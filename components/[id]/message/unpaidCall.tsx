import React, { useState } from 'react';
import API from '@aws-amplify/api';
import '../../../configureAmplify'
import MessageComponent from './messageCaller'
import CustomSpinner from '../../custom/spinner';
declare var OT

const MessageOtComponent = (props) => {

  const [state, setState] = useState({
    busy: false,
    otSession: null,
    apiHit: false
  })
  const targetUser = props.targetUser

  if (!state.apiHit) {
    (async () => {
      try {
        let myInit = {
          body: {
            name: targetUser,
            // deviceInput: 'text',
          }
        }
        const createSessionRes = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/createUnpaidSession', myInit)
        if (createSessionRes.busy) {
          setState({ ...state, busy: true, apiHit: true })
        } else {
          const otSession = OT.initSession(createSessionRes.apikey, createSessionRes.SessionId)
          setState({ ...state, otSession: otSession, apiHit: true })
          otSession.connect(createSessionRes.token, function (err) {
            if (err) { console.log(err) }
          })
        }
      } catch (err) {
        console.log(err)
      }
    })()
  }

  if (state.otSession) {
    return (
      <div className="flex flex-col items-center">
        <div>
          <MessageComponent
            targetUser={targetUser}
            otSession={state.otSession}
          />
        </div>
      </div>
    )
  } else if (state.busy) {
    return (
      <div className="flex justify-center my-20">User is busy</div>
    )
  } else {
    return (
      <div className="flex justify-center m-40"><CustomSpinner /></div>
    )
  }
}

export default MessageOtComponent