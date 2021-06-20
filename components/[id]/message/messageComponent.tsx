import React, { useState } from 'react';
import API from '@aws-amplify/api';
import '../../../configureAmplify'
import { OpenTokSDK } from 'opentok-accelerator-core';
import OTcommponent from '../call/otComponent'

const CallComponent = (props) => {
  const [tokenDataState, setTokenData] = useState({
    apiKey: null,
    sessionId: null,
    token: null
  })
  const currentUser = props.targetUser
  const deviceInput = props.deviceInput

  if (!tokenDataState.sessionId) {
    (async () => {
      let myInit = {
        body: {
          name: currentUser,
          deviceInput: deviceInput,
        }
      }
      const createSessionRes = await API.post(process.env.apiGateway.NAME, '/createSession2', myInit)
      const OTcreds = {
        apiKey: createSessionRes.apikey,
        sessionId: createSessionRes.SessionId,
        token: createSessionRes.token
      }
      setTokenData(OTcreds)
    })()
  }

  if (tokenDataState) {
    const otSDK = new OpenTokSDK(tokenDataState)
    otSDK.connect()
      return (
        <div>
          <div><OTcommponent {...props} otSDK={otSDK} /></div>
        </div>
      )
  } else {
    return (
      <div className="m-5">establishing call</div>
    )
  }
}

export default CallComponent;