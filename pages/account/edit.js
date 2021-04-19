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
import EditComponent from '../../components/edit/editComponent'
import BlogEdit from '../../components/edit/blogEdit'
import state from 'opentok-accelerator-core/dist/state'

export default function EditParent(props) {

  const [selectedTopicState, setSelectedTopicState] = useState({
    topic: '',
    ogTopic: '',
    string: '',
    quill: '',
    editing: false,
    saved: false
  })
  const [userState, setUserState] = useState({
    Username: 'loading...',
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
  const [tavsState, setTavsState] = useState({
    text: true,
    audio: true,
    video: false,
    screen: false,
    editing: false
  })
  const [errorState, setErrorState] = useState('')

  const setUserStateFn = (e) => { setUserState({ ...userState, e }) }
  const setPublicStateFn = (e) => { setPublicStringState({ ...publicStringState, e }) }
  const setTavsStateFn = (e) => { setTavsState({ ...tavsState, e })}

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
      console.log("getUserRes :", getUserRes)
      
      for (const topicKey in getUserRes.Item.topics.M) {
        const title = getUserRes.Item.topics.M[topicKey].M.title.S
        const titleWithSpaces = title.replaceAll('-', ' ')
        topicsArray.push({
          topic: titleWithSpaces,
          string: DOMPurify.sanitize(getUserRes.Item.topics.M[topicKey].M.string.S),
          draft: getUserRes.Item.topics.M[topicKey].M.draft.BOOL
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
        quill: sanitizedString === '' ? 'if you want to describe your page, write here, 160 character limit' : sanitizedString,
        editing: sanitizedString === '' ? true : false
      }
      setPublicStringState(pubString)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  const setSelectedTopic = (stateProp) => {
    console.log('stateProp: ', stateProp)
    setSelectedTopicState({...selectedTopicState, ...stateProp})
  }


  // const users = props?.userState

  return ( 
    <>
      {selectedTopicState.editing 
      ? <BlogEdit 
          setSelectedTopicState={(e) => setSelectedTopic(e)}
          selectedTopicState={selectedTopicState} 
          setUserState={setUserStateFn}
          setPublicStringState={setPublicStateFn}
          userState={userState}
          publicStringState={publicStringState}
          getUserData={getUserData}
          setTavsState={setTavsStateFn}
          tavsState={tavsState}
          /> 
      : <EditComponent 
          setSelectedTopicState={setSelectedTopic}
          selectedTopicState={selectedTopicState} 
          setUserState={setUserStateFn}
          setPublicStringState={setPublicStateFn}
          userState={userState}
          publicStringState={publicStringState}
          getUserData={getUserData}
          setTavsState={setTavsStateFn}
          tavsState={tavsState}
          />}
    </>
  )
}