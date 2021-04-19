import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { v4 as uuidv4 } from 'uuid'
import { API, Auth, Storage } from 'aws-amplify'
import Navbar from '../navbar/navbar'
import CustomSpinner from "../custom/spinner"

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} /> },
  { ssr: false }
)

export default function BlogEdit(props) {

  const quillRef = useRef()
  const setUserState = (e) => props.setUserState(e)
  const getUserData = () => props.getUserData()
  const setErrorState = (e) => props.setErrorState(e)
  const setSelectedTopicState = (e) => props.setSelectedTopicState(e)
  const topicTypingFn = (e) => {
    setSelectedTopicState({ quill: e, saved: false})
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
    if (stringProp.indexOf('<img src=') > -1) {
      const srcAddress = stringProp.slice(stringProp.indexOf('<img src='))
      const slashSplit = srcAddress.split('/')
      const qSplit = slashSplit[5].split('?')
      const imgKey = qSplit[0]
      const authIdentity = await Auth.currentCredentials()
      const convertedString = stringProp.replace(/<img .*?>/, `{key: ${imgKey}, id: ${authIdentity.identityId}}`)
      const afterIterated = turnSrcStringsToKeys(convertedString)
      return afterIterated
    }
    return stringProp
  }

  const imageHandler = () => {
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
        Storage.configure({ level: 'protected' })
        const s3res = await Storage.put(uuidv4() + fileType, file)
        const getS3 = await Storage.get(s3res.key)
        editor.insertEmbed(range.index, 'image', getS3)
      } catch (err) {
        console.log('storage err', err)
      }
    }
  }

  const saveTopicString = async () => {

    const keyifiedString = await turnSrcStringsToKeys(selectedTopicState.quill)

    let firstHeading1 = 'no title'
    const h1index = selectedTopicState.quill.indexOf('<h1>')
    if (h1index > -1 ) {
      const h1end = selectedTopicState.quill.indexOf('</h1>', h1index)
      const slicedTitle = selectedTopicState.quill.slice(h1index + 4, h1end)
      firstHeading1 = slicedTitle
    }
    if (firstHeading1.length > 60) {
      firstHeading1 = firstHeading1.slice(0, 60)
    }
    const noSpacesTopic = firstHeading1.replaceAll(' ', '-')

    setSelectedTopicState({ ...selectedTopicState, saved: 'saving'})

    try {
      const userSession = await Auth.currentSession()
      const stringInit = {
        headers: { Authorization: userSession.idToken.jwtToken },
        body: {
          deleteTopic: false,
          topicId: selectedTopicState.topicId,
          string: keyifiedString,
          accessToken: userSession.accessToken.jwtToken,
          topicObj: { 
            title: { S: noSpacesTopic }, 
            string: { S: keyifiedString }, 
            draft: { BOOL: false } 
          }
        }
      }
      const savedTopicRes = await API.post(process.env.apiGateway.NAME, '/topics', stringInit)
      if (savedTopicRes.string) {
        setSelectedTopicState({...selectedTopicState, saved: "saved"})
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
      topic: '',
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

  const [modules] = useState( {
    // syntax: true,
    toolbar:  {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote', 'code-block'],
        [{'list': 'bullet'}],
        [ 'image' ]
      ],
      handlers: {
        image: () => imageHandler(),
      }
    }
  })

  return (
    <>
      <Navbar />
      <div>
          {/* <input type="text" onChange={(e) => setSelectedTopicState({ ...selectedTopicState, topic: e.target.value })} value={selectedTopicState.topic} /> */}
          <div className="flex justify-center prose">
          <div className='h-full overflow-hidden min-height-1'>
           <ReactQuill 
              forwardedRef={quillRef}
              modules={modules} 
              value={selectedTopicState.quill} 
              onChange={topicTypingFn} />
            </div> 
            </div>
          <div className="flex flex-row">
            <div className="flex flex-row mr-10" >
            <button onClick={() => saveTopicString()}>save</button>
            {selectedTopicState.saved === "saving" && <CustomSpinner />}
          {selectedTopicState.saved === "saved" && <div className="">
            <div>
              saved
            </div>
          </div>}
          </div>
            <button className="mr-10" onClick={onCloseTopicEdit} >close</button>
            <button className="mr-10" onClick={() => deleteTopic()}>delete</button>
          </div>


        </div>
    </>
  )
}