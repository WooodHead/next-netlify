import React, { useEffect, useRef, useState } from 'react'
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import '../../configureAmplify'
import "../../node_modules/react-quill/dist/quill.snow.css"
import DOMPurify from 'dompurify';
import EditComponent from '../../components/edit/editComponent'
import BlogEdit from '../../components/edit/blogEdit'
// import { turnBracketsToAlt } from "../../components/custom/keyToImage"
import Footer from '../../components/navbar/footer'

export default function EditParent(props) {

  const [selectedTopicState, setSelectedTopicState] = useState({
    title: '',
    topicId: '',
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

  const setUserStateFn = (e) => { setUserState({ ...userState, e }) }
  const setPublicStateFn = (e) => { setPublicStringState({ ...publicStringState, ...e }) }
  const setTavsStateFn = (e) => { setTavsState({ ...tavsState, ...e })}
  const setSelectedTopic = (e) => { setSelectedTopicState({...selectedTopicState, ...e}) }

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
        const title = getUserRes.Item.topics.M[topicKey].M.title.S
        const titleWithSpaces = title.replaceAll('-', ' ')
        // const stringWithAltTags = turnBracketsToAlt(getUserRes.Item.topics.M[topicKey].M.string.S)
        topicsArray.push({
          topicId: topicKey,
          title: titleWithSpaces,
          string: getUserRes.Item.topics.M[topicKey].M.string.S,
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

  // const users = props?.userState

  return ( 
    <>
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
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
      </div>
      <Footer />
    </div>

    </>
  )
}