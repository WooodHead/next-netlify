import React, { useEffect, useRef, useState, useReducer } from 'react';
import { useRouter } from 'next/router'
// import AudioComponent from '../../tavs/audio'
// import VideoComponent from '../../tavs/video'
// import ScreenComponent from '../../tavs/screen'
// import TextComponent from '../../tavs/text'
import TextOnlyComponent from '../../tavs/textOnly'
import PhoneButtons from './phoneButtons'
import API from '@aws-amplify/api'

const MessageComponent = (props) => {
  const [state, setState] = useState({
    audio: true,
    video: false,
    screen: false,
    text: true,
    mic: false,
    otherUser: false
  })
  // const [otherConnection, setOtherConnection] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false)

  const initialState = ''
  const reducer = (curState, action) => {
    return curState + action.data + "\n"
  }
  const [textState, dispatchTextState] = useReducer(reducer, initialState)

  const currentUser = props.targetUser
  const session = props.otSession
  console.log(session)
  
  const sessionId = session.id

  const router = useRouter()

  const disconnectWithAPI = async () => {
    try {
      navigator.sendBeacon(
        process.env.apiGateway.URL +
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

  const onSignalSend = signalInputRefProp => {
    let txtMessage = signalInputRefProp;
    session.signal(
      { type: "signal", data: "" + txtMessage },
      function signalCallback(err) {
        if (err) {
          console.log(err)
        }
      }
    )
    if (!state.otherUser) {
      const myInit = {
        headers: {},
        body: {
          
        }
      }
      API.post(process.env.apiGateway.NAME, '/', myInit)
    }
  }

  window.onunload = event => {
    event.preventDefault()
    event.returnValue = ""
    navigator.sendBeacon(
      process.env.apiGateway.URL +
      "/disconnectCall" +
      "?receiver=" + currentUser +
      "&sessionId=" + sessionId
    )
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
            process.env.apiGateway.URL +
              "/disconnectCall" +
              "?receiver=" + currentUser +
              "&sessionId=" + session.id
          )
        }
        setState({...state, otherUser: true})
      }
    })
    session.on('connectionDestroyed', () => {
      console.log('connectionDestroyed')
      session.disconnect()
      router.push(`/${currentUser}/review`)
      navigator.sendBeacon(
        process.env.apiGateway.URL +
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
          {state.text && <TextOnlyComponent
            textState={textState}
            onSignalSend={onSignalSend}
          />}


          {otherUserTyping ? <div>other user is typing</div> : <br />}
          <PhoneButtons state={state} setState={setState}/>
          <button className="m-5 mt-10" id="disconnect" onClick={() => disconnectWithAPI()}>Disconnect</button>
        </div>
      )

}

export default MessageComponent;