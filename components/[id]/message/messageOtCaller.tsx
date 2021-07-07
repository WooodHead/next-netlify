import React, { useState } from 'react';
import API from '@aws-amplify/api';
import '../../../configureAmplify'
import MessageComponent from './messageCaller'
import CustomSpinner from '../../custom/spinner';

const MessageOtComponent = (props) => {

  const [sessionState, setSessionState] = useState(null)
  const targetUser = props.targetUser

  if (!sessionState) {
    (async () => {
      let myInit = {
        body: {
          name: targetUser,
          deviceInput: 'text',
        }
      }
      const createSessionRes = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/createSession2', myInit)
      const otSession = OT.initSession(createSessionRes.apikey, createSessionRes.SessionId)
      setSessionState(otSession)
      otSession.connect(createSessionRes.token, function(err){
        if (err) { console.log(err)}
      })
    })()
  }

  if (sessionState) {
      return (
        <div className="flex flex-col items-center">
          <div>
            <MessageComponent 
              targetUser={targetUser}
              otSession={sessionState}
            />
            </div>
        </div>
      )
  } else {
    return (
      <div className="flex justify-center m-40"><CustomSpinner /></div>
    )
  }
}

export default MessageOtComponent