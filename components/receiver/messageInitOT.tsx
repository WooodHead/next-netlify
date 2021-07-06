import React, { useState } from 'react';
// import TAVSparent from './tavsParent'
import MessageReceiver from './messageReceiver'
import CustomSpinner from '../custom/spinner'

const MessageInitOT = props => {
  const [state, setState] = useState({
    session: null
  })

  const tokenDataProps = props.tokenData
  console.log(tokenDataProps)
  if (state.session) {
    return (
      <MessageReceiver
        prevMessages={props.prevMessages}
        otSession={state.session}
      />
    )
  } else {
    const otSession = OT.initSession(tokenDataProps.apikey, tokenDataProps.sessionId)
    otSession.connect(tokenDataProps.token, function (err) {
      if (err) { console.log(err) } else {
        setState({ ...state, session: otSession })
      }
    })
    return (
      <div className="flex justify-center m-40"><CustomSpinner /></div>
    )
  }

}

export default MessageInitOT

