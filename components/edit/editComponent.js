import React, { useEffect, useRef, useState } from 'react'
import Amplify, { API, Auth, Storage } from 'aws-amplify'
import '../../configureAmplify'
import "../../node_modules/react-quill/dist/quill.snow.css"
import NavbarComp from '../navbar/navbar'
import DOMPurify from 'dompurify';
import PublicString from './publicString'
import TopicComponent from './topic'
import EditTAVScomp from './tavs'
import KeyToImage from '../custom/keyToImage'

export default function Edit(props) {

  // const [userState, setUserState] = useState({
  //   Username: 'loading...',
  //   ppm: 0,
  //   ratingAv: 'loading...',
  //   publicString: 'loading...',
  //   topics: [],
  //   TAVS: []
  // })
  // const [publicStringState, setPublicStringState] = useState({
  //   string: '',
  //   quill: '',
  //   editing: false,
  //   saved: false
  // })
  const publicStringState = props.publicStringState
  const setPublicStringState = (e) => { props.setPublicStringState(e) }
  const userState = props.userState
  const setUserState = (e) => { props.setUserState(e) }
  const getUserData = (e) => { props.getUserData(e)}
  const setSelectedTopicState = (stateProps) => props.setSelectedTopicState(stateProps)
  const selectedTopicState = props.selectedTopicState

  // const [selectedTopicState, setSelectedTopicState] = useState({
  //   topic: '',
  //   ogTopic: '',
  //   string: '',
  //   quill: '',
  //   // editing: false,
  //   saved: false
  // })
  const [tavsState, setTavsState] = useState({
    text: true,
    audio: true,
    video: false,
    screen: false,
    editing: false
  })
  const [errorState, setErrorState] = useState('')

  // const getUserData = async () => {
  //   const userSession = await Auth.currentAuthenticatedUser()
  //   const getUserInit = {
  //     headers: {
  //       Authorization: userSession.attributes.preferred_username
  //     }
  //   }
  //   try {
  //     const getUserRes = await API.get(process.env.apiGateway.NAME, "/users", getUserInit)
  //     const topicsArray = []
  //     for (const topicKey in getUserRes.Item.topics.M) {
  //       const topicWithSpaces = topicKey.replaceAll('-', ' ')
  //       topicsArray.push({
  //         topic: topicWithSpaces,
  //         string: DOMPurify.sanitize(getUserRes.Item.topics.M[topicKey].S),
  //         draft: getUserRes.Item.topics.M[topicKey].S
  //       })
  //     }
  //     const TAVS = []
  //     const deviceInputRes = getUserRes.Item.deviceInput.M
  //     deviceInputRes.text.BOOL && TAVS.push("📝")
  //     deviceInputRes.audio.BOOL && TAVS.push("📞")
  //     deviceInputRes.video.BOOL && TAVS.push("📹")
  //     deviceInputRes.screen.BOOL && TAVS.push("💻")
  //     const user = {
  //       Username: getUserRes.Item.Username.S,
  //       active: getUserRes.Item.active.BOOL,
  //       busy: getUserRes.Item.busy.BOOL,
  //       TAVS: TAVS,
  //       ppm: getUserRes.Item.ppm.N,
  //       ratingAv: getUserRes.Item.ratingAv?.S || null,
  //       publicString: getUserRes.Item.publicString?.S || null,
  //       receiver: getUserRes.Item.receiver.BOOL,
  //       topics: topicsArray,
  //     }
  //     setUserState(user)
  //     setTavsState({
  //       ...tavsState, 
  //       text: deviceInputRes.text.BOOL,
  //       audio: deviceInputRes.audio.BOOL,
  //       video: deviceInputRes.video.BOOL,
  //       screen: deviceInputRes.screen.BOOL
  //     })
  //     const sanitizedString = DOMPurify.sanitize(getUserRes.Item.publicString?.S)
  //     const pubString = {
  //       ...publicStringState, 
  //       string: sanitizedString, 
  //       quill: sanitizedString === '' ? 'if you want to describe your page, write here, 160 character limit' : sanitizedString,
  //       editing: sanitizedString === '' ? true : false
  //     }
  //     setPublicStringState(pubString)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }
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

  // useEffect(() => {
  //   getUserData()
  // }, [])

  return (
    <>
      <NavbarComp />

      <div className="mx-5">

        <div className="flex flex-row my-5 bg-gray-100">
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
            {...props}
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