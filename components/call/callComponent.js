import React, { useState } from 'react';
import { API } from 'aws-amplify';
import '../../configureAmplify'
import { OpenTokSDK } from 'opentok-accelerator-core';
import OTcommponent from './otComponent'

const CallComponent = (props) => {
  const [tokenDataState, setTokenData] = useState()
  const [connectedState, setConnectedState] = useState()
  const currentUser = props.targetUser
  const deviceInput = props.deviceInput

  if (!tokenDataState) {
    (async () => {
      let myInit = {
        body: {
          name: currentUser,
          deviceInput: deviceInput,
        }
      }
      console.log('call COMponent createSession init: ', myInit)
      const createSessionRes = await API.post(process.env.apiGateway.NAME, '/createSession2', myInit)
      console.log('createSessionRes', createSessionRes)
      const OTcreds = {
        apiKey: createSessionRes.apikey,
        sessionId: createSessionRes.SessionId,
        token: createSessionRes.token
      }
      setTokenData({ OTcreds: OTcreds })
    })()
  }

  if (tokenDataState) {
    console.log('tokenDataState', tokenDataState)
    const otSDK = new OpenTokSDK(tokenDataState.OTcreds)
    otSDK.connect()
      .then(() => { setConnectedState(true) })
      .catch((err) => { console.log('ot connection err', err) })
    if (connectedState) {
      return (
        <div>
          <div><OTcommponent {...props} otSDK={otSDK} /></div>
        </div>
      )
    } else {
      return <div>calling</div>
    }
  } else {
    return (
      <div>establishing call</div>
    )
  }
}

export default CallComponent;