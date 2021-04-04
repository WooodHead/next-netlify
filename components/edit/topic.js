import React, { createRef, useRef, useState } from 'react'
import { API, Auth, Storage } from 'aws-amplify'
import '../../configureAmplify'
import dynamic from 'next/dynamic'
import CustomSpinner from "../custom/spinner"
import KeyToImage from '../../components/custom/keyToImage'
import { v4 as uuidv4 } from 'uuid'
const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill");
    return ({ forwardedRef, ...props }) => <RQ ref={forwardedRef} {...props} /> },
  { ssr: false }
)

export default function PublicString(props) {
  const selectedTopicState = props.selectedTopicState
  const setSelectedTopicState = (e) => props.setSelectedTopicState(e)
  const userState = props.userState
  const setUserState = (e) => props.setUserState(e)
  const getUserData = () => props.getUserData()
  const setErrorState = (e) => props.setErrorState(e)
  const quillRef = useRef()

  const topicTypingFn = (e) => {
    setSelectedTopicState({ ...selectedTopicState, quill: e, saved: false})

  }

  const onCloseTopicEdit = async () => {
    try {
      getUserData()
      // const userSession = await Auth.currentAuthenticatedUser()
      // const getUserInit = { headers: { Authorization: userSession.attributes.preferred_username } }
      // const getAllUserRes = await API.get(process.env.apiGateway.NAME, "/users", getUserInit)
      // const stringWithImages = await KeyToImage(getAllUserRes.Item.topics.M[selectedTopicState.topic]?.S)
      setSelectedTopicState({ ...selectedTopicState, editing: false, saved: false })
    } catch (err) {
      setSelectedTopicState({ ...selectedTopicState, editing: false, saved: false })
      console.log(err)
    }
  }
  const deleteTopic = async (topicProp) => {
    const userSession = await Auth.currentSession()
    const deleteTopicParams = {
      headers: { Authorization: userSession.idToken.jwtToken },
      body: {
        new: true,
        deleteTopic: true,
        topic: topicProp,
        ogTopic: topicProp,
        string: null
      }
    }
    const deleteTopicRes = await API.post(process.env.apiGateway.NAME, '/topics', deleteTopicParams)
    deleteTopicRes.status === 200 
      ? setUserState({...userState, topics: userState.topics.filter((topicObj) => topicObj.topic !== topicProp)})
      : console.log('delete failed')
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

  const saveTopicString = async () => {
    const keyifiedString = await turnSrcStringsToKeys(selectedTopicState.quill)
    const escapedString = keyifiedString.replaceAll('"', '\\"')
    const noSpacesTopic = selectedTopicState.topic.replaceAll(' ', '-')
    setSelectedTopicState({ ...selectedTopicState, saved: 'saving'})
    try {
      const userSession = await Auth.currentSession()
      const stringInit = {
        headers: { Authorization: userSession.idToken.jwtToken },
        body: {
          // new: false,
          deleteTopic: false,
          ogTopic: selectedTopicState.ogTopic,
          topic: noSpacesTopic,
          string: escapedString
        }
      }
      const savedTopicRes = await API.post(process.env.apiGateway.NAME, '/topics', stringInit)
      if (savedTopicRes.status === 200) {
        setSelectedTopicState({...selectedTopicState, saved: "saved"})
        getUserData()
      } else {
        if (savedTopicRes.err.message === "ExpressionAttributeNames contains invalid value: Empty attribute name for key #DE") {
          setErrorState('topic cannot be left blank')
        }
      }
    } catch (err) {
      console.log(err)
    }
  }

  const imageHandler = (e) => {
    const date = new Date()
    const time = date.getTime()
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    input.click()
    input.onchange = async () => {
      const editor = quillRef.current.getEditor()  
      const file = input.files[0]
      const range = editor.getSelection(true)
      editor.setSelection(range.index + 1)
      try {
        console.log('file', file)
        Storage.configure({ level: 'protected' })
        const s3res = await Storage.put(time + file.name, file)
        // the problem here is I don't know where the image was placed... if I were to use key[]
        const getS3 = await Storage.get(s3res.key)
        console.log('getS3', getS3)
        editor.insertEmbed(range.index, 'image', getS3)
      } catch (err) {
        console.log('storage err', err)
      }
    }
  }

  const [modules] = useState( {
    toolbar:  {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'bullet'}],
        [ 'image' ]
      ],
      handlers: {
        image: () => imageHandler()
      },
    },
  })

  return (
    <div>
      {selectedTopicState.editing
        ? <div>
          <input type="text" onChange={(e) => setSelectedTopicState({ ...selectedTopicState, topic: e.target.value })} value={selectedTopicState.topic} />
          <div className='h-full flex-1'>
            <ReactQuill 
              forwardedRef={quillRef}
              modules={modules} 
              value={selectedTopicState.quill} 
              onChange={topicTypingFn} />
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
            <button className="mr-10" onClick={() => deleteTopic(selectedTopicState.topic)}>delete</button>
          </div>


        </div>

        : <div>
          <div>{selectedTopicState.topic}</div>
          <button onClick={() => setSelectedTopicState({ ...selectedTopicState, editing: true })}>
            <div>edit</div>
          </button>
          <div className="mx-3 my-3" dangerouslySetInnerHTML={{ __html: selectedTopicState.string }} ></div>

        </div>

      }
    </div>

  )
}