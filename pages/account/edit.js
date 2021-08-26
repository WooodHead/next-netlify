import React, { useEffect, useRef, useState } from 'react'
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import '../../configureAmplify'
import "../../node_modules/react-quill/dist/quill.snow.css"
import DOMPurify from 'dompurify';
import EditComponent from '../../components/edit/editComponent'
import BlogEdit from '../../components/edit/blogEdit'
// import { turnBracketsToAlt } from "../../components/custom/keyToImage"
// import Footer from '../../components/navbar/footer'
import { pullBracketData } from '../../components/custom/keyToImage'
// import Head from 'next/head'

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
    TAVS: [],
    receiver: null,
    image: null
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
    try {
      const userSession = await Auth.currentSession()
      const idToken = userSession.getIdToken().getJwtToken()
      const getSelfInit = { headers: { Authorization: idToken } }
      const getSelfRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getSelfUser", getSelfInit)
      const topicsArray = []
      getSelfRes.topics.forEach(topicObj => {
        const stringWithBracketData = pullBracketData(topicObj.string)
        topicsArray.push({
          topicId: topicObj.topicId,
          title: topicObj.title,
          string: stringWithBracketData,
          draft: topicObj.draft,
          lastSave: topicObj.lastSave
        })
      })
      const TAVS = []
      const deviceInputRes = getSelfRes.deviceInput
      deviceInputRes.text && TAVS.push("📝")
      deviceInputRes.audio && TAVS.push("📞")
      deviceInputRes.video && TAVS.push("📹")
      deviceInputRes.screen && TAVS.push("💻")
      const user = {
        Username: getSelfRes.username,
        active: getSelfRes.active,
        busy: getSelfRes.busy,
        TAVS: TAVS,
        ppm: getSelfRes.ppm,
        publicString: getSelfRes.publicString,
        receiver: getSelfRes.receiver,
        topics: topicsArray,
        image: getSelfRes.firstImage
      }
      setUserState(user)
      setTavsState({ ...tavsState, ...deviceInputRes })
      const sanitizedString = DOMPurify.sanitize(getSelfRes.publicString)

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
    {/* <Head>
    <link rel="stylesheet"
      href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/vs2015.min.css" />
    <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/highlight.min.js"></script>
    </Head> */}
    {/* <div className="flex flex-col min-h-screen">
      <div className="flex-1 "> */}
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
      {/* </div>
      <Footer />
    </div> */}

    </>
  )
}