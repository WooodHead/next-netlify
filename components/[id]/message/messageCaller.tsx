import React, { useEffect, useRef, useState, useReducer } from 'react';
import { useRouter } from 'next/router'
import TextOnlyComponent from '../../tavs/messenger/textOnly'
import PhoneButtons from './phoneButtons'
import API from '@aws-amplify/api'

declare var OT

const MessageComponent = ({ targetUser, otSession }) => {
  const [state, setState] = useState({
    audio: true,
    video: false,
    screen: false,
    text: true,
    mic: false,
    otherUser: false
  })
  const [otherUserTyping, setOtherUserTyping] = useState(false)

  const initialState = "User hasn't connected yet, try sending a message \n"
  const reducer = (curState, action) => {

    return curState + action.data + "\n"
  }
  const [textState, dispatchTextState] = useReducer(reducer, initialState)
  const publisherRef = useRef()
  const micPublisherRef = useRef()
  const session = otSession
  
  const sessionId = session.id

  const router = useRouter()

  const disconnectWithAPI = async () => {
    try {
      navigator.sendBeacon(
        process.env.NEXT_PUBLIC_APIGATEWAY_URL +
        "/disconnectCall" +
        "?receiver=" + targetUser +
        "&sessionId=" + sessionId
      )
    } catch (err) {
      console.log(err)
    }
    session.disconnect()
    router.replace(`/${targetUser}/review`)
  }

  const onSignalSend = async signalInputRefProp => {
    let txtMessage = signalInputRefProp
    session.signal(
      { type: "signal", data: "" + txtMessage },
      function signalCallback(err) {
        if (err) {
          console.log(err)
        }
      }
    )
    if (!state.otherUser) {
      console.log('no other user')
      const myInit = {
        // headers: {},
        body: {
          message: txtMessage,
          receiver: targetUser
        }
      }
      await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/textMessage', myInit)
    }
  }

  window.onunload = event => {
    event.preventDefault()
    event.returnValue = ""
    navigator.sendBeacon(
      process.env.NEXT_PUBLIC_APIGATEWAY_URL +
      "/disconnectCall" +
      "?receiver=" + targetUser +
      "&sessionId=" + sessionId
    )
  }

  const publishMic = () => {
      // OT.getDevices((devices) => {
      //   console.log("OT DEVICES", devices)
      // })
      // const userMedia = await OT.getUserMedia({ audioSource: true})

      const pubOptions = {
        insertDefaultUI: false,
        // insertMode: 'append',
        // showControls: false,
        // width: 1,
        // height: 1,
        videoSource: null,
      }
      micPublisherRef.current = session.publish('micPublisher', pubOptions)
  }
  const unPublishMic = () => {
    session.unpublish(micPublisherRef.current)
  }
  const unPublish = () => {
    console.log('unpublish,', publisherRef.current)
    session.unpublish(publisherRef.current)
  }
  const publishVideo = () => {
    const pubOptions = {
      insertMode: 'append',
      showControls: false,
      width: 80,
      height: 70,
      audioSource: null
      // videoSource: null,
    }
    publisherRef.current = session.publish('publisher', pubOptions)
  }
  const publishScreen = async () => {
    const userMedia = await OT.getUserMedia({ videoSource: 'screen' })
    const pubOptions = {
      audioSource: null,
      // publishAudio: state.mic,
      insertMode: 'append',
      showControls: false,
      width: 80,
      height: 70,
      videoSource: userMedia.getVideoTracks()[0],
    }
    publisherRef.current = session.publish('publisher', pubOptions)
  }

  useEffect(() => {
    session.on('connectionCreated', (connectionEvent) => {    
      const connectionId = connectionEvent.connection.id
      const myConnectionId = session.connection.id
      /* another person has joined, send Start time to API */
      if (connectionId !== myConnectionId) { 
        window.onunload = event => {
          event.preventDefault()
          event.returnValue = ""
          navigator.sendBeacon(
            process.env.NEXT_PUBLIC_APIGATEWAY_URL +
              "/disconnectCall" +
              "?receiver=" + targetUser +
              "&sessionId=" + session.id
          )
        }
        setState({...state, otherUser: true})
        dispatchTextState({ data: `${targetUser} connected`})
      }
    })
    session.on('streamCreated', ({ stream }) => {
      if (stream.hasVideo) {
        const subscriberOptions = {
          width: 500,
          height: 400,
          insertMode: 'append'
        }
        session.subscribe(stream, "subscriber", subscriberOptions)
      } else {
        const subscriberOptions = {
          insertDefaultUI: false
          // width: 1,
          // height: 1
        }
        session.subscribe(stream, subscriberOptions)
      }
    })
    session.on('connectionDestroyed', () => {
      console.log('connectionDestroyed')
      session.disconnect()
      router.replace(`/${targetUser}/review`)
      navigator.sendBeacon(
        process.env.NEXT_PUBLIC_APIGATEWAY_URL +
          "/disconnectCall" +
          "?receiver=" + targetUser +
          "&sessionId=" + session.id
      )
    })
    session.on('signal', (event) => {
      const myConnectionId = session.connection.id
      if (event.data === '%t%yping') {
        if (event.from.connectionId !== myConnectionId) {
          setOtherUserTyping(true)
        }
      } else if (event.data === 'not%t%yping') {
        if (event.from.connectionId !== myConnectionId) {
          setOtherUserTyping(false)
        }
      } else {
        const messages = (event.from.connectionId === myConnectionId) ? { data: `you: ${event.data}` }
          : { data: `them: ${event.data}` }
        dispatchTextState(messages)
        let textArea = document.getElementById('textArea')
        textArea.scrollTop = textArea.scrollHeight
      }
    })
  }, [])

      return (
        <div className="m-5">
          <div id="subscriber" className="border resize" ></div>
          {state.text && <TextOnlyComponent
            textState={textState}
            onSignalSend={onSignalSend}
            otherUser={state.otherUser}
          />}
          <div id="publisher" ></div>
          {/* <div>{state.mic && <MicComp />}</div> */}
          {otherUserTyping ? <div>other user is typing</div> : <br />}
          <PhoneButtons 
            unPublishMic={unPublishMic}
            publishScreen={publishScreen}
            publishVideo={publishVideo}
            publishMic={publishMic} 
            unPublish={unPublish} 
            session={session} 
            state={state} 
            setState={setState}/>
          <button className="m-5 mt-10" id="disconnect" onClick={() => disconnectWithAPI()}>Disconnect</button>
            <div id="micSubscriber" ></div>
            <div id="micPublisher" ></div>
        </div>
      )

}

export default MessageComponent;