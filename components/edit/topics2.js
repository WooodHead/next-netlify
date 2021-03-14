import React, { useRef, useState } from 'react'
import { API, Auth } from 'aws-amplify'
import TopicString from './topic'
import Link from 'next/link'

export default function Topics(props) {

  console.log(props)
  const [topicState, setTopicState] = useState(props.user.topics)
  const [selectedTopicState, setSelectedTopic] = useState(props.user.topics)
  const [newTopicState, setNewTopicState] = useState(false)
  const topicInputRef = useRef()

  const createNewTopic = async () => {
    const userSession = await Auth.currentSession()
    const newTopicParams = {
      headers: { Authorization: userSession.idToken.jwtToken },
      body: {
        new: true,
        deleteTopic: false,
        topic: topicInputRef.current.value,
        string: null
      }
    }
    const newTopic = await API.post(process.env.apiGateway.NAME, '/topics', newTopicParams )
    console.log(newTopic)
    setTopicState([...topicState, newTopic.body])
    setNewTopicState(true)
  }

  const deleteTopic = async (topicProp) => {
    console.log(topicProp)
    const userSession = await Auth.currentSession()
    const deleteTopicParams = {
      headers: { Authorization: userSession.idToken.jwtToken },
      body: {
        new: true,
        deleteTopic: true,
        topic: topicProp,
        string: null
      }
    }
    await API.post(process.env.apiGateway.NAME, '/topics', deleteTopicParams )
    setTopicState(topicState.filter((topicObj) => topicObj.topic !== topicProp))
  }

  const selectTopic = (topicProp) => {
    console.log(topicProp)
    setSelectedTopic(topicProp)
  }

  return (
    <div className="bg-gray-100" >
    {topicState.map((topicObj) => 
      <div key={topicObj.topic} >
        <button onClick={() => selectTopic(topicObj)} href={ "/" + props.user.Username + '/topic'}>
          <a className="border-2 hover:border-black">{topicObj.topic}</a>
        </button>
      </div>
    )}
    <input ref={topicInputRef}  ></input>
    <button onClick={createNewTopic}>create new topic</button>
    <TopicString 
    {...props} 
    topicState={selectedTopicState?.topic} 
    deleteTopic={deleteTopic} 
    stringState={selectedTopicState?.string} 
    editProps={newTopicState}
    />

    </div>
  )
}