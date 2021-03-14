import React, { useEffect, useRef, useState } from 'react'
import Amplify, { API, Auth } from 'aws-amplify'
import '../../configureAmplify'
import "../../node_modules/react-quill/dist/quill.snow.css"
import NavbarComp from '../../components/navbar/navbar'
import DOMPurify from 'dompurify';
import PublicString from '../../components/edit/publicString'
import TopicComponent from '../../components/edit/topic'

export default function Edit(props) {

  const users = props?.userState

  const [userState, setUserState] = useState({
    Username: props ? users?.Username : 'loading...',
    ppm: 'loading...',
    ratingAv: 'loading...',
    publicString: 'loading...',
    topics: [],
  })
  const [publicStringState, setPublicStringState] = useState({
    string: '',
    quill: '',
    editing: false,
    saved: false
  })
  const [selectedTopicState, setSelectedTopicState] = useState({
    topic: '',
    ogTopic: '',
    string: '',
    quill: '',
    editing: false,
    saved: false
  })

  const getUserData = async () => {
    const userSession = await Auth.currentAuthenticatedUser()
    const getUserInit = {
      headers: {
        Authorization: userSession.attributes.preferred_username
      }
    }
    try {
      const getAllUsersRes = await API.get(process.env.apiGateway.NAME, "/users", getUserInit)
      const topicsArray = []
      for (const topicKey in getAllUsersRes.Item.topics.M) {
        topicsArray.push({
          topic: topicKey,
          string: DOMPurify.sanitize(getAllUsersRes.Item.topics.M[topicKey].S)
        })
      }
      const user = {
        Username: getAllUsersRes.Item.Username.S,
        active: getAllUsersRes.Item.active.BOOL,
        busy: getAllUsersRes.Item.busy.BOOL,
        // folders: getAllUsersRes.Item.folders?.SS || [],
        TAVS: getAllUsersRes.Item.deviceInput.M,
        ppm: getAllUsersRes.Item.ppm.N,
        ratingAv: getAllUsersRes.Item.ratingAv?.S || null,
        publicString: getAllUsersRes.Item.publicString?.S || null,
        topics: topicsArray,
      }
      setUserState(user)
      const sanitizedString = DOMPurify.sanitize(getAllUsersRes.Item.publicString?.S)
      const pubString = {
        ...publicStringState, 
        string: sanitizedString, 
        quill: sanitizedString === '' ? 'write something about yourself' : sanitizedString,
        editing: sanitizedString === '' ? true : false
      }
      setPublicStringState(pubString)
    } catch (err) {
      console.log(err)
    }
  }
  const createNewTopic = async () => {
    setSelectedTopicState({
      topic: '',
      ogTopic: '',
      string: '',
      quill: '',
      editing: true
    })
  }
  const selectTopic = (topicProp) => {
    setSelectedTopicState({
      ogTopic: topicProp.topic,
      topic: topicProp.topic,
      string: topicProp.string,
      quill: topicProp.string,
      editing: false
    })
  }

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <>
      <NavbarComp />
      <div className="mx-5">
        <div className="flex flex-row bg-gray-100 my-5">
          <div className="flex flex-col mx-5 my-5">
            <h3 className='mx-5 my-5'>{userState.Username}</h3>
          </div>
          <PublicString 
            publicStringState={publicStringState} 
            setPublicStringState={setPublicStringState}/>
        </div>
        <div className="bg-gray-100" >
          {userState.topics.map((topicObj) =>
            <div key={topicObj.topic} >
              <button onClick={() => selectTopic(topicObj)} href={"/" + userState.Username + '/topic'}>
                <a>{topicObj.topic}</a>
              </button>
            </div>
          )}
          <button onClick={createNewTopic}>create new topic</button>
        </div>
        <div className="my-5 bg-gray-100">
        <TopicComponent 
          getUserData={getUserData}
          selectedTopicState={selectedTopicState} 
          setSelectedTopicState={setSelectedTopicState}
          userState={userState}
          setUserState={setUserState}/>
        </div>
      </div>
    </>
  )
}