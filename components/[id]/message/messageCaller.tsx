import React, { useEffect, useRef, useState, useReducer } from 'react';
import { useRouter } from 'next/router'
import TextOnlyComponent from '../../tavs/messenger/textOnly'
import PhoneButtons from './phoneButtons'
import API from '@aws-amplify/api'
import MicComponent from '../../tavs/messenger/mic';

const MessageComponent = (props) => {
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
  const currentUser = props.targetUser
  const session = props.otSession
  
  const sessionId = session.id

  const router = useRouter()

  const disconnectWithAPI = async () => {
    try {
      navigator.sendBeacon(
        process.env.NEXT_PUBLIC_APIGATEWAY_URL +
        "/disconnectCall" +
        "?receiver=" + currentUser +
        "&sessionId=" + sessionId
      )
    } catch (err) {
      console.log(err)
    }
    session.disconnect()
    router.push(`/${currentUser}/review`)
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
          receiver: currentUser
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
      "?receiver=" + currentUser +
      "&sessionId=" + sessionId
    )
  }

  const publishMic = async () => {
      // OT.getDevices((devices) => {
      //   console.log("OT DEVICES", devices)
      // })
      const userMedia = await OT.getUserMedia({ audioSource: true})

      // const pubOptions = {
      //   insertMode: 'append',
      //   showControls: false,
      //   width: 80,
      //   height: 70,
      //   videoSource: null,
      // }
      // publisherRef.current = session.publish('publisher', pubOptions)
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
      // videoSource: null,
    }
    publisherRef.current = session.publish('publisher', pubOptions)
  }
  const publishScreen = async () => {
    // this did not work
    // Promise.all([
    //   OT.getUserMedia({
    //     videoSource: 'screen'
    //   }),
    //   (state.mic) ? OT.getUserMedia({
    //     videoSource: null
    //   }) : null
    // ])
    // .then(([screenStream, micStream]) => {
    //   console.log('screenStream', screenStream)
    //   const pubOptions = {
    //     insertMode: 'append',
    //     width: '100%',
    //     height: '100%',
    //     videoSource: screenStream.getVideoTracks()[0],
    //   }
    //   publisherRef.current = session.publish('publisher', pubOptions) 
    // }).catch((err) => console.log(err))
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
              "?receiver=" + currentUser +
              "&sessionId=" + session.id
          )
        }
        setState({...state, otherUser: true})
        dispatchTextState({ data: `${currentUser} connected`})
      }
    })
    session.on('streamCreated', ({ stream }) => {
      if (stream.hasVideo) {
        const subscriberOptions = {
          width: 230,
          height: 200,
          insertMode: 'append'
        }
        session.subscribe(stream, "subscriber", subscriberOptions)
      } else {
        const subscriberOptions = {
          width: 1,
          height: 1
        }
        session.subscribe(stream, "micSubscriber", subscriberOptions)
      }
    })
    session.on('connectionDestroyed', () => {
      console.log('connectionDestroyed')
      session.disconnect()
      router.push(`/${currentUser}/review`)
      navigator.sendBeacon(
        process.env.NEXT_PUBLIC_APIGATEWAY_URL +
          "/disconnectCall" +
          "?receiver=" + currentUser +
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
          <div id="subscriber" ></div>
          {state.text && <TextOnlyComponent
            textState={textState}
            onSignalSend={onSignalSend}
            otherUser={state.otherUser}
          />}
          <div id="publisher"></div>
          {/* <div>{state.mic && <MicComp />}</div> */}
          {otherUserTyping ? <div>other user is typing</div> : <br />}
          <PhoneButtons 
            publishScreen={publishScreen}
            publishVideo={publishVideo}
            publishMic={publishMic} 
            unPublish={unPublish} 
            session={session} 
            state={state} 
            setState={setState}/>
          <button className="m-5 mt-10" id="disconnect" onClick={() => disconnectWithAPI()}>Disconnect</button>
            <div id="micSubscriber" ></div>
        </div>
      )

}

export default MessageComponent;