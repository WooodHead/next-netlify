import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { v4 as uuidv4 } from 'uuid'
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import Storage from '@aws-amplify/storage'
import Navbar from '../navbar/navbar'
import CustomSpinner from "../custom/spinner"
import { turnBracketsToAlt } from "../../components/custom/keyToImage"

const ReactQuill = dynamic(
  async () => {
    const { default: RQ, Quill } = await import("react-quill");
    // const code = Quill.import('formats/code-block')
    // console.log(code)
    // code.tagName = 'span'
    // Quill.register(code, true)
    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} />
  },
  { ssr: false }
)

export default function BlogEdit(props) {

  const quillRef = useRef()
  const setUserState = (e) => props.setUserState(e)
  const getUserData = () => props.getUserData()
  const setErrorState = (e) => props.setErrorState(e)
  const setSelectedTopicState = (e) => props.setSelectedTopicState(e)
  const topicTypingFn = (e) => {
    setSelectedTopicState({ quill: e, saved: false })
  }
  const selectedTopicState = props.selectedTopicState

  const onCloseTopicEdit = async () => {
    try {
      getUserData()
      setSelectedTopicState({ editing: false, saved: false })
    } catch (err) {
      setSelectedTopicState({ editing: false, saved: false })
      console.log(err)
    }
  }

  const imageHandler = async () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.click()
    input.onchange = async () => {
      const editor = quillRef.current.getEditor()
      const file = input.files[0]
      const range = editor.getSelection(true)
      editor.setSelection(range.index + 1)
      const fileType = file.name.match(/\.[0-9a-z]+$/i)
      if (fileType[0] === ".gif") {
        try {
          const putS3 = Storage.put(uuidv4() + fileType, file)
          const s3res = await putS3
          const cloudfrontUrl = process.env.NEXT_PUBLIC_GIF_CLOUDFRONT + "/" + s3res.key
          editor.insertEmbed(range.index, 'image', cloudfrontUrl)
          editor.insertText(range.index + 1, true)
        } catch (err) {
          console.log('storage err', err)
        }
      } else {
        try {
          const putS3 = Storage.put(uuidv4() + fileType[0], file)
          const s3res = await putS3
          const jsonToUrl = {
            "bucket": process.env.NEXT_PUBLIC_STORAGE_BUCKET,
            "key": `public/${s3res.key}`,
            "edits": {
              "resize": {
                "width": 900,
                "height": 675,
                "fit": "cover"
              }
            }
          }
          const converting = Buffer.from(JSON.stringify(jsonToUrl)).toString('base64')
          const convertedUrl = process.env.NEXT_PUBLIC_IMG_CLOUDFRONT + "/" + converting
          editor.insertEmbed(range.index, 'image', convertedUrl)
          editor.insertText(range.index + 1, '[alt tag; h:675, w:900]', true)
        } catch (err) {
          console.log('storage err', err)
        }
      }
    }
  }

  const saveTopicString = async (isDraftProp) => {

    let firstHeading1 = 'no title'
    const h1index = selectedTopicState.quill.indexOf('<h1>')
    if (h1index > -1) {
      const h1end = selectedTopicState.quill.indexOf('</h1>', h1index)
      const slicedTitle = selectedTopicState.quill.slice(h1index + 4, h1end)
      firstHeading1 = slicedTitle
    }
    if (firstHeading1.length > 60) {
      firstHeading1 = firstHeading1.slice(0, 60)
    }

    const sanitizedTitle = firstHeading1.replace(/[_$&+,:;=?[\]@#|{}'<>.^*()%!/\\]/g, "")
    const noSpacesTopic = sanitizedTitle.replaceAll(' ', '-')
    setSelectedTopicState({ ...selectedTopicState, saved: 'saving' })

    try {
      const userSession = await Auth.currentSession()
      const now = new Date()

      //get first image
      let firstImage = ''
      let description
      const string = turnBracketsToAlt(selectedTopicState.quill)
      if (string) {
        const h2Tag = string.match(/<h2>(.+?)<\/h2>/)
        description = h2Tag ? h2Tag[1] : null

        const wholeImgTag = string.match(/<img.+?src="(.+?)"/)
        const ImgTag = string.match(/<img.+?src=".+?cloudfront.net\/(.+?)"/)
        const wholeURL = wholeImgTag ? wholeImgTag[0].match(/https.+?cloudfront.net\/(.+?)"/) : null
        const isGif = wholeImgTag ? wholeImgTag[0].match(/gif/) : true
          if (!isGif) {
            const imgSrc = ImgTag ? ImgTag[1] : null
            const atob = a => Buffer.from(a, 'base64').toString('binary')
            const btoa = b => Buffer.from(b).toString('base64')
            const converted = JSON.parse(atob(imgSrc))
            converted.edits.resize.width = 100
            converted.edits.resize.height = 100
            const reverted = btoa(JSON.stringify(converted))
            firstImage = wholeURL[0].replace(/(https:.+?cloudfront.net\/).+?"/, function(a, b) {
              return b + reverted
            })
          }
      }

      const stringInit = {
        headers: { Authorization: userSession.idToken.jwtToken },
        body: {
          deleteTopic: false,
          topicId: selectedTopicState.topicId,
          string: selectedTopicState.quill,
          accessToken: userSession.accessToken.jwtToken,
          topicObj: {
            title: { S: firstHeading1 },
            titleURL: { S: noSpacesTopic },
            string: { S: selectedTopicState.quill },
            draft: { BOOL: isDraftProp },
            lastSave: { S: "" + now.getTime() },
            description: { S: description },
            firstImage: { S: firstImage }
          }
        }
      }
      const savedTopicRes = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/topics', stringInit)
      if (savedTopicRes.string) {
        setSelectedTopicState({ ...selectedTopicState, saved: "saved" })
        getUserData()
      } else {
        setErrorState('save error... yikes')
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteTopic = async () => {
    const userSession = await Auth.currentSession()
    const deleteTopicParams = {
      headers: { Authorization: userSession.idToken.jwtToken },
      body: {
        deleteTopic: true,
        accessToken: userSession.accessToken.jwtToken,
        string: null,
        topicId: selectedTopicState.topicId,
        topicObj: null
      }
    }
    const deleteTopicRes = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/topics', deleteTopicParams)
    setSelectedTopicState({
      title: '',
      topicId: '',
      string: '',
      quill: '',
      editing: false,
      saved: false
    })
    /* following seems to be redudant because of getUser in edit, to change */
    // deleteTopicRes.body === "deleted" 
    //   ? setUserState({ topics: props.userState.topics.filter((topicObj) => topicObj.topicId !== selectedTopicState.topicId)})
    //   : console.log('delete failed')
  }

  const [modules] = useState({
    // syntax: true,
    toolbar: {
      container: [
        [{ 'header': 1 }, { 'header': 2 }, 'code'],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{ 'list': 'bullet' }],
        ['link', 'image'],
        // [{ 'background': [] }],
      ],
      handlers: {
        image: () => imageHandler(),
      }
    }
  })

  return (
    <div className="flex flex-col flex-auto h-screen">
      {/* <Navbar className="h-8" /> */}
      <div className="h-full">
        {/* <div className=""> */}
        {/* <div className="flex-1"> */}
        <div className='flex justify-center h-5/6'>
          <ReactQuill
            className="flex-1 max-w-5xl m-5 h-5/6 max-w-80"
            forwardedRef={quillRef}
            modules={modules}
            value={selectedTopicState.quill}
            onChange={topicTypingFn} />
        </div>
        {/* </div> */}
        {/* </div> */}

        <div className="flex flex-row justify-center h-8 mx-10">
          <button className="mr-10" onClick={() => saveTopicString(false)}>save and publish</button>
          <button className="mr-10" onClick={() => saveTopicString(true)}>save as draft</button>
          {selectedTopicState.saved === "saving" && <CustomSpinner />}
          {selectedTopicState.saved === "saved" && <div className="">saved</div>}
          <button className="mr-10" onClick={onCloseTopicEdit} >close</button>
          <button className="mr-10" onClick={() => deleteTopic()}>delete</button>
        </div>
      </div>
    </div>
  )
}