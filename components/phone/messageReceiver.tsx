import React, { useEffect, useState, useReducer } from 'react';
import AudioComponent from '../tavs/audio'
import VideoComponent from '../tavs/video'
import ScreenComponent from '../tavs/screen'
import TextComponent from '../tavs/text'
import { useRouter } from 'next/router';
import TextOnlyComponent from '../tavs/text'
import PhoneButtons from '../[id]/message/phoneButtons'
const MessageReceiver = props => {

  const session = props.otSession
  const [state, setState] = useState({
    audio: true,
    video: false,
    screen: false,
    text: true,
    mic: false,
    otherUser: false
  })
  const initialState = ''
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const reducer = (curState, action) => {
    return curState + action.data + "\n"
  }
  const [textState, dispatchTextState] = useReducer(reducer, initialState)
  const router = useRouter()

  // const callDisconnected = () => {
  //   // go to blank page?
  // }

  const disconnectButton = async () => {
    session.disconnect()
    router.push('/')
  }

  const onSignalSend = signalInputRefProp => {
    const signalObj = { "type": "signal", "data": "" + signalInputRefProp}
    session.signal(signalObj)
  }

  useEffect(() => {
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
      session.disconnect()
      // callDisconnected()
    })

  }, [])

    return (
      <>
      <div  className="container-fluid" id="sessionStatus">
        <div id="publisher" ></div>
        <TextOnlyComponent 
          otherUser={true}
          textState={textState}
          onSignalSend={onSignalSend}
          session={session}
        />
      {otherUserTyping ? <div>other user is typing</div> : <br/>}
        <button className="mt-5" id="disconnect" onClick={() => disconnectButton()}>Disconnect</button>
      </div>
      <PhoneButtons state={state} setState={setState} />
      </>
    );

}

export default MessageReceiver