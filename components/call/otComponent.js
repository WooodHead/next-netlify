import React, { useEffect, useRef, useState, useReducer } from 'react';
import { useRouter } from 'next/router'
import AudioComponent from '../tavs/audio'
import VideoComponent from '../tavs/video'
import ScreenComponent from '../tavs/screen'
import TextComponent from '../tavs/text'


const OTcomponent = (props) => {

  const [otherConnection, setOtherConnection] = useState('');
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  // const [markedInactive, setMarkedInactive] = useState(false)

  const initialState = ''
  const reducer = (curState, action) => {
    return curState + action.data + "\n"
  }
  const [textState, dispatchTextState] = useReducer(reducer, initialState)

  const currentUser = props.targetUser
  const deviceInput = props.deviceInput
  const allowedDevices = props.allowedDevices
  const audioOn = allowedDevices.audio
  const otSDK = props.otSDK
  const sessionId = otSDK.credentials.sessionId
  const router = useRouter()

  // let ringTimer = useRef()
  console.log('otSDK: ', otSDK)

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
    otSDK.disconnect()

    router.push(`/${currentUser}/review`)
  }

  const onSignalSend = signalInputRefProp => {
    let txtMessage = signalInputRefProp;
    otSDK.session.signal(
      { type: "signal", data: "" + txtMessage },
      function signalCallback(err) {
        if (err) {
          console.log(err)
        }
      }
    )
  }

  // const disconnectionTimer = async () => {
  //   try{
  //       let init = {
  //         body: {
  //           userToMarkInactive: currentUser,
  //           sessionId: sessionId
  //         }
  //       }
  //       await API.post(process.env.apiGateway.NAME, "/userstatus/forceInactive", init)
  //       navigator.sendBeacon(
  //         process.env.apiGateway.URL +
  //         "/disconnectCall" +
  //         "?receiver=" + currentUser +
  //         "&sessionId=" + sessionId
  //       )
  //       clearTimeout(ringTimer.current)
  //       otSDK.disconnect()
  //       setMarkedInactive(true)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

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
    const session = otSDK.session
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
        // clearTimeout(ringTimer.current)
        setOtherConnection(true)
      }
    })
    session.on('connectionDestroyed', () => {
      console.log('connectionDestroyed')
      otSDK.disconnect()
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
  }, [otSDK, currentUser, router])

  // if (!markedInactive) {

    if (otherConnection) {

      // clearTimeout(ringTimer.current)
      return (
        <div>
          {{
            "audio": <AudioComponent otSDK={otSDK} />,
            "video": <VideoComponent audioOn={audioOn} otSDK={otSDK} />,
            "screen": <ScreenComponent audioOn={audioOn} otSDK={otSDK} />
          }[deviceInput]}

          {allowedDevices.text && otSDK && <TextComponent
            selectedDevice={deviceInput}
            textState={textState}
            onSignalSend={onSignalSend}
            otSDK={otSDK}
          />}
          {otherUserTyping ? <div>other user is typing</div> : <br />}
          <button className="mt-5" id="disconnect" onClick={() => disconnectWithAPI()}>Disconnect</button>
        </div>
      )
    } else {
      // ringTimer.current = setTimeout(() => disconnectionTimer(), 120000)
      return (
        <div>calling</div>
      )
    }
  // } else {
  //   return (
  //     <div>
  //       <div style={{ margin: '2%' }}>User failed to answer the call and has been marked inactive</div>
  //       <div>
  //         <button onClick={() => router.go(0)} >refresh</button>
  //       </div>
  //     </div>

  //   )
  // }

}

export default OTcomponent;