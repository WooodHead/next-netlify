import React, { useEffect, useState, useReducer } from 'react';
import AudioComponent from '../tavs/audio'
import VideoComponent from '../tavs/video'
import ScreenComponent from '../tavs/screen'
import TextComponent from '../tavs/text'

const TAVSparent = props => {
  const initialState = ''
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const reducer = (curState, action) => {
    return curState + action.data + "\n"
  }
  const [textState, dispatchTextState] = useReducer(reducer, initialState)

  const tokenDataProps = props.tokenData
  const allowedDevices = props.allowedDevices
  const audioOn = allowedDevices.audio
  const otSDK = props.otSDK

  // const callDisconnected = () => {
  //   // go to blank page?
  // }

  const disconnectButton = async () => {
    otSDK.disconnect()
    // callDisconnected()
  }

  const onSignalSend = signalInputRefProp => {
    const signalObj = { "type": "signal", "data": "" + signalInputRefProp}
    otSDK.session.signal(signalObj)
  };

  useEffect(() => {
    const session = otSDK.session
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
        const messages = (event.from.connectionId === myConnectionId) ? {data: `you: ${event.data}` }
        : { data: `them: ${event.data}` }
      dispatchTextState(messages)
      let textArea = document.getElementById('textArea')
      textArea.scrollTop = textArea.scrollHeight
      }
    })
    session.on('connectionDestroyed', (connectionEvent) => {
      otSDK.disconnect()
      // callDisconnected()
    })

  }, [otSDK])

    return (
      <div  className="container-fluid" id="sessionStatus">
        Connected with {tokenDataProps.caller}
          {{
            "audio": <AudioComponent otSDK={otSDK} webphoneC={false} />,
            "video": <VideoComponent audioOn={audioOn} otSDK={otSDK} webphoneC={false}/>,
            "screen": <ScreenComponent audioOn={audioOn} otSDK={otSDK} webphoneC={false}/>
          }[tokenDataProps.deviceInput]}
        <div id="publisher" ></div>
        {allowedDevices.text && otSDK && <TextComponent
          selectedDevice={tokenDataProps.deviceInput}
          textState={textState}
          onSignalSend={onSignalSend}
          otSDK={otSDK}
        />}
      {otherUserTyping ? <div>other user is typing</div> : <br/>}
        <button className="mt-5" id="disconnect" onClick={() => disconnectButton()}>Disconnect</button>
      </div>
    );

}

export default TAVSparent;