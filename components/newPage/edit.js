import React, { useEffect, useRef, useState } from 'react'
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import '../../configureAmplify'
import NavbarComp from '../navbar/navbar'
import DOMPurify from 'dompurify';
import PublicString from './publicString'
import TopicComponent from '../edit/topicComponent'
import EditTAVScomp from './tavs'
import CreateAccount from './createAccount'
import { useRouter } from 'next/router'

export default function EditComponent(props) {

  const users = props?.userState
  const router = useRouter()
  const [createAccountState, setCreateAccountState] = useState()
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
    editing: true,
    saved: false,
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
      const getUserRes = await API.get(process.env.apiGateway.NAME, "/users", getUserInit)
      const topicsArray = []
      for (const topicKey in getUserRes.Item.topics.M) {
        topicsArray.push({
          topic: topicKey,
          string: DOMPurify.sanitize(getUserRes.Item.topics.M[topicKey].S)
        })
      }
      const TAVS = []
      const deviceInputRes = getUserRes.Item.deviceInput.M
      deviceInputRes.text.BOOL && TAVS.push("📝")
      deviceInputRes.audio.BOOL && TAVS.push("📞")
      deviceInputRes.video.BOOL && TAVS.push("📹")
      deviceInputRes.screen.BOOL && TAVS.push("💻")
      const user = {
        Username: getUserRes.Item.Username.S,
        active: getUserRes.Item.active.BOOL,
        busy: getUserRes.Item.busy.BOOL,
        // folders: getUserRes.Item.folders?.SS || [],
        TAVS: TAVS,
        ppm: getUserRes.Item.ppm.N,
        ratingAv: getUserRes.Item.ratingAv?.S || null,
        publicString: getUserRes.Item.publicString?.S || null,
        receiver: getUserRes.Item.receiver.BOOL,
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
      const sanitizedString = DOMPurify.sanitize(getUserRes.Item.publicString?.S)
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

  const accountCreatedSaveStrings = async () => {
    try {
      const userSession = await Auth.currentSession()
      const pubStringInit = {
        headers: { Authorization: userSession.idToken.jwtToken },
        body: {
          stringType: 'publicString',
          string: `` + publicStringState.quill
        }
      }
      const escapedString = selectedTopicState.quill.replaceAll('"', '\\"')
      const topicStringInit = {
        headers: { Authorization: userSession.idToken.jwtToken },
        body: {
          deleteTopic: false,
          ogTopic: selectedTopicState.ogTopic,
          topic: selectedTopicState.topic,
          string: escapedString
        }
      }
      const savedTopicRes = API.post(process.env.apiGateway.NAME, '/topics', topicStringInit)
      const savedString = API.post(process.env.apiGateway.NAME, '/saveStrings', pubStringInit)
      await savedTopicRes
      await savedString
      router.push('/account/edit')
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

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
              getUserData={getUserData} 
               />
          </div>
          <div className="flex flex-col">
            <div>
              <PublicString
                setCreateAccountState={setCreateAccountState}
                createAccountState={createAccountState}
                publicStringState={publicStringState}
                setPublicStringState={setPublicStringState} />
            </div>
            <div>
              {createAccountState 
              && <CreateAccount 
              accountCreatedSaveStrings={accountCreatedSaveStrings} />}
            </div>
          </div>
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
          setUserState={setUserState}
          setErrorState={setErrorState}/>
        </div>
        {errorState}
      </div>
    </>
  )
}