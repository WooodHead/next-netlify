import React, { useState } from 'react';
import { API, Auth } from 'aws-amplify';
import config from '../../config'
import { OpenTokSDK } from 'opentok-accelerator-core';
import OTcommponent from './otComponent'

const CallComponent = (props) => {
  const [tokenDataState, setTokenData] = useState()
  const [connectedState, setConnectedState] = useState()
  const currentUser = props.targetUser
  const deviceInput = props.deviceInput

  if (!tokenDataState) {
    (async () => {
      let accessToken
      let OTcreds
      try {
        const userSession = await Auth.currentSession()
        accessToken = userSession.accessToken.jwtToken
      } catch {
        accessToken = 'anonymous'
      }
      let myInit = {
        body: {
          name: currentUser,
          folder: null,
          deviceInput: deviceInput,
          accessToken: accessToken
        }
      }
      const createSessionRes = await API.post(config.apiGateway.NAME, '/tokbox', myInit)
        OTcreds = {
          apiKey: createSessionRes.body.apikey,
          sessionId: createSessionRes.body.SessionId,
          token: createSessionRes.body.token
        }
      setTokenData({ OTcreds: OTcreds} )
    })()
  }

  if (tokenDataState) {
    const otSDK = new OpenTokSDK(tokenDataState.OTcreds)
    otSDK.connect()
    .then(() => { setConnectedState(true)})
    .catch((err) => { console.log('ot connection err', err)})
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