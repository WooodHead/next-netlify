import { useRef, useState } from 'react'
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
    const { default: RQ } = await import("react-quill");
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
      // const userSession = await Auth.currentAuthenticatedUser()
      // const getUserInit = { headers: { Authorization: userSession.attributes.preferred_username } }
      // const getAllUserRes = await API.get(process.env.apiGateway.NAME, "/users", getUserInit)
      // const stringWithImages = await KeyToImage(getAllUserRes.Item.topics.M[selectedTopicState.topic]?.S)
      setSelectedTopicState({ editing: false, saved: false })
    } catch (err) {
      setSelectedTopicState({ editing: false, saved: false })
      console.log(err)
    }
  }
  const turnSrcStringsToKeys = async (stringProp) => {
    console.log(stringProp)
    if (stringProp.indexOf('<img src=') > -1) {
      const srcAddress = stringProp.slice(stringProp.indexOf('<img src='))
      console.log(srcAddress)
      const slashSplit = srcAddress.split('/')
      const qSplit = slashSplit[4].split('?')
      const imgKey = qSplit[0]
      // const authIdentity = await Auth.currentCredentials()
      const convertedString = stringProp.match(/<img .*?>/, `{key: ${imgKey}, id: ${null}}`)
      const afterIterated = turnSrcStringsToKeys(convertedString)
      return afterIterated
    }
    return stringProp
  }
  const turnAltToBrackets = (stringProp) => {
    if (stringProp.indexOf('<img alt') > -1) {
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
      const fileTypeLocation = file.name.indexOf('.')
      const fileType = file.name.slice(fileTypeLocation)
      try {
        const putS3 = Storage.put(uuidv4() + fileType, file)
        const s3res = await putS3
        console.log('s3 res'. s3res)
        const jsonToUrl = {
          "bucket": process.env.storage.BUCKET,
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
        const convertedUrl = process.env.img_cloudfront + "/" + converting
        console.log(convertedUrl)

        editor.insertEmbed(range.index, 'image', convertedUrl)
      } catch (err) {
        console.log('storage err', err)
      }
    }
  }

  const saveTopicString = async (isDraftProp) => {
    // const keyifiedString = await turnSrcStringsToKeys(selectedTopicState.quill)
    const imgAltAdded = turnBracketsToAlt(selectedTopicState.quill)

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
    const noSpacesTopic = firstHeading1.replaceAll(' ', '-')

    setSelectedTopicState({ ...selectedTopicState, saved: 'saving' })

    try {
      const userSession = await Auth.currentSession()
      const stringInit = {
        headers: { Authorization: userSession.idToken.jwtToken },
        body: {
          deleteTopic: false,
          topicId: selectedTopicState.topicId,
          string: imgAltAdded,
          accessToken: userSession.accessToken.jwtToken,
          topicObj: {
            title: { S: noSpacesTopic },
            string: { S: imgAltAdded },
            draft: { BOOL: isDraftProp }
          }
        }
      }
      const savedTopicRes = await API.post(process.env.apiGateway.NAME, '/topics', stringInit)
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
    const deleteTopicRes = await API.post(process.env.apiGateway.NAME, '/topics', deleteTopicParams)
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
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block'],
        [{ 'list': 'bullet' }],
        ['link', 'image']
      ],
      handlers: {
        image: () => imageHandler(),
      }
    }
  })

  return (
    <div className="flex flex-col flex-auto h-screen">
      <Navbar className="h-8"/>
      <div className="h-full">
        {/* <div className=""> */}
          {/* <div className="flex-1"> */}
          <div className='flex h-5/6 justify-center'>
            <ReactQuill
              className="m-5 h-5/6 flex-1 max-w-5xl max-w-80"
              forwardedRef={quillRef}
              modules={modules}
              value={selectedTopicState.quill}
              onChange={topicTypingFn} />
          </div>
          {/* </div> */}
        {/* </div> */}

        <div className="justify-center flex mx-10 flex-row h-8">
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