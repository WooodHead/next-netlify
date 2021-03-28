import React from 'react'
import { API, Auth } from 'aws-amplify'
import '../../configureAmplify'
import dynamic from 'next/dynamic'
import CustomSpinner from "../custom/spinner"
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function PublicString(props) {
  const selectedTopicState = props.selectedTopicState
  const setSelectedTopicState = (e) => props.setSelectedTopicState(e)
  const userState = props.userState
  const setUserState = (e) => props.setUserState(e)
  const getUserData = () => props.getUserData()


  const formats = [
    'header',
    'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ],

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
        console.log(savedTopicRes.err)
        if (savedTopicRes.err === "ValidationException: ExpressionAttributeNames contains invalid value: Empty attribute") {
          console.log('no topic')
        }
        console.log('savetopic failed')
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      {selectedTopicState.editing
        ? <div>
          <input type="text" onChange={(e) => setSelectedTopicState({ ...selectedTopicState, topic: e.target.value })} value={selectedTopicState.topic} />
          <ReactQuill 
          theme="snow"
          formats={formats} 
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