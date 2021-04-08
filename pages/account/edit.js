import React, { useEffect, useRef, useState } from 'react'
import Amplify, { API, Auth, Storage } from 'aws-amplify'
import '../../configureAmplify'
import "../../node_modules/react-quill/dist/quill.snow.css"
import NavbarComp from '../../components/navbar/navbar'
import DOMPurify from 'dompurify';
import PublicString from '../../components/edit/publicString'
import TopicComponent from '../../components/edit/topic'
import EditTAVScomp from '../../components/edit/tavs'
import KeyToImage from '../../components/custom/keyToImage'

export default function Edit(props) {

  const users = props?.userState

  const [userState, setUserState] = useState({
    Username: props ? users?.Username : 'loading...',
    ppm: 0,
    ratingAv: 'loading...',
    publicString: 'loading...',
    topics: [],
    TAVS: []
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
  const [tavsState, setTavsState] = useState({
    text: true,
    audio: true,
    video: false,
    screen: false,
    editing: false
  })
  const [errorState, setErrorState] = useState('')

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
      console.log(getAllUsersRes)
      for (const topicKey in getAllUsersRes.Item.topics.M) {
        const topicWithSpaces = topicKey.replaceAll('-', ' ')
        topicsArray.push({
          topic: topicWithSpaces,
          string: DOMPurify.sanitize(getAllUsersRes.Item.topics.M[topicKey].S)
        })
      }
      const TAVS = []
      const deviceInputRes = getAllUsersRes.Item.deviceInput.M
      deviceInputRes.text.BOOL && TAVS.push("📝")
      deviceInputRes.audio.BOOL && TAVS.push("📞")
      deviceInputRes.video.BOOL && TAVS.push("📹")
      deviceInputRes.screen.BOOL && TAVS.push("💻")
      const user = {
        Username: getAllUsersRes.Item.Username.S,
        active: getAllUsersRes.Item.active.BOOL,
        busy: getAllUsersRes.Item.busy.BOOL,
        TAVS: TAVS,
        ppm: getAllUsersRes.Item.ppm.N,
        ratingAv: getAllUsersRes.Item.ratingAv?.S || null,
        publicString: getAllUsersRes.Item.publicString?.S || null,
        receiver: getAllUsersRes.Item.receiver.BOOL,
        topics: topicsArray,
      }
      setUserState(user)
      setTavsState({
        ...tavsState, 
        text: deviceInputRes.text.BOOL,
        audio: deviceInputRes.audio.BOOL,
        video: deviceInputRes.video.BOOL,
        screen: deviceInputRes.screen.BOOL
      })
      console.log('non sanitized', getAllUsersRes.Item.publicString?.S)
      const sanitizedString = DOMPurify.sanitize(getAllUsersRes.Item.publicString?.S)
      console.log(sanitizedString)
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

  const selectTopic = async (topicProp) => {
    const stringWithImages = await KeyToImage(topicProp.string)
    setSelectedTopicState({
      ogTopic: topicProp.topic,
      topic: topicProp.topic,
      string: stringWithImages,
      quill: stringWithImages,
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
            {userState.TAVS}
            <EditTAVScomp
              userState={userState}
              tavsState={tavsState}
              setTavsState={setTavsState}
              getUserData={getUserData} />
          </div>
          <PublicString
            publicStringState={publicStringState}
            setPublicStringState={setPublicStringState} />
        </div>

        <div className="bg-gray-100" >
          {userState.topics.map((topicObj) =>
            <div key={topicObj.topic} >
              <button onClick={() => selectTopic(topicObj)}>
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
            setUserState={setUserState}
            setErrorState={setErrorState} />
          {errorState}
        </div>
        
      </div>
    </>
  )
}