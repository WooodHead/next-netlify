import React, { createRef, useRef, useState } from 'react'
import { API, Auth, Storage } from 'aws-amplify'
import '../../configureAmplify'
import dynamic from 'next/dynamic'
import CustomSpinner from "../custom/spinner"
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
      const userSession = await Auth.currentAuthenticatedUser()
      const getUserInit = { headers: { Authorization: userSession.attributes.preferred_username } }
      const getAllUserRes = await API.get(process.env.apiGateway.NAME, "/users", getUserInit)
      const userResString = getAllUserRes.Item.topics.M[selectedTopicState.topic].S
      setSelectedTopicState({ ...selectedTopicState, string: userResString, editing: false, saved: false })
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

  const saveTopicString = async () => {
    // console.log(quillRef)
    /*change to s3 url */
    // const stringWithoutImg = selectedTopicState.quill.replace(/<img .*?>/, `{key: ${userState.Username}}`)
    /**/ 
    const escapedString = selectedTopicState.quill.replaceAll('"', '\\"')
    setSelectedTopicState({ ...selectedTopicState, saved: 'saving'})
    try {
      const userSession = await Auth.currentSession()
      const stringInit = {
        headers: { Authorization: userSession.idToken.jwtToken },
        body: {
          // new: false,
          deleteTopic: false,
          ogTopic: selectedTopicState.ogTopic,
          topic: selectedTopicState.topic,
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
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click()
    input.onchange = async () => {
      const editor = quillRef.current.getEditor()
      
      const file = input.files[0]
      const formData = new FormData()

      const range = editor.getSelection(true)
      editor.setSelection(range.index + 1);
      const s3res = await Storage.vault.put(file.name, file)
      const getS3 = await Storage.vault.get(s3res.key)
      editor.insertEmbed(range.index, 'image', getS3)
    }
  }

  const [modules] =useState( {
    toolbar:  {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'bullet'}],
        [ 'image' ]
      ],
      handlers: {
        image: () => imageHandler()
      }
    },
  })

  return (
    <div>
      {selectedTopicState.editing
        ? <div>
          <input type="text" onChange={(e) => setSelectedTopicState({ ...selectedTopicState, topic: e.target.value })} value={selectedTopicState.topic} />
          <ReactQuill 
            forwardedRef={quillRef}
            modules={modules} 
            value={selectedTopicState.quill} 
            onChange={topicTypingFn} />
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
          <div className="mx-3 my-3" dangerouslySetInnerHTML={{ __html: selectedTopicState.string }} ></div>
          <button onClick={() => setSelectedTopicState({ ...selectedTopicState, editing: true })}>
            <div>edit</div>
          </button>

        </div>

      }
    </div>

  )
}