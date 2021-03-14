import React from 'react'
import { API, Auth } from 'aws-amplify'
import dynamic from 'next/dynamic'
import CustomSpinner from "../../components/custom/spinner"
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function PublicString(props) {
  const selectedTopicState = props.selectedTopicState
  const setSelectedTopicState = (e) => props.setSelectedTopicState(e)
  const userState = props.userState
  const setUserState = (e) => props.setUserState(e)

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
        setSelectedTopicState({...selectedTopicState, saved: true})
        const editedTopics = []
        selectedTopicState.ogTopic !== selectedTopicState.topic &&
        /* if topicName has been changed, update userState topics */
          userState.topics.forEach((topicObj) => {
            topicObj.topic !== selectedTopicState.ogTopic && editedTopics.push(topicObj)
          })
          editedTopics.push({topic: selectedTopicState.topic, string: escapedString})
          setUserState({
          ...userState, 
          topics: editedTopics
        })    
      } else {
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
          <ReactQuill value={selectedTopicState.quill} onChange={topicTypingFn} />
          <button onClick={onCloseTopicEdit} >close</button>
          <div >
            <button onClick={() => saveTopicString()}>
              save
            </button>
          </div>
          {selectedTopicState.saved && <div className="">
            {selectedTopicState.saved === "saving" && 
             <div className="">
               <CustomSpinner />
             </div>
            }
            <div>
              saved
            </div>
          </div>}
        </div>

        : <div>
          <div>{selectedTopicState.topic}</div>
          <div className="mx-3 my-3" dangerouslySetInnerHTML={{ __html: selectedTopicState.string }} ></div>
          <button onClick={() => setSelectedTopicState({ ...selectedTopicState, editing: true })}>
            <div>edit</div>
          </button>
          <button onClick={() => deleteTopic(selectedTopicState.topic)}>
            <div>delete</div>
          </button>
        </div>

      }
    </div>

  )
}