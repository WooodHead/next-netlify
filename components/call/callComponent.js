import React, { useState } from 'react';
import { API, Auth } from 'aws-amplify';
import config from '../../config'
import { OpenTokSDK } from 'opentok-accelerator-core';
import OTcommponent from './otComponent'
import 'opentok-solutions-css';
// const TextChatAccPack = require('opentok-text-chat');


const WebphoneHC = (props) => {
  const [tokenDataState, setTokenData] = useState();
  const [connectedState, setConnectedState] = useState(false)
  const currentUser = props.targetUser
  const folder = props.folder
  const deviceInput = props.deviceInput

  if (!tokenDataState) {
    (async () => {
      let accessToken
      try {
        const userSession = await Auth.currentSession()
        accessToken = userSession.accessToken.jwtToken
      } catch {
        accessToken = 'anonymous'
      }
      let myInit = {
        body: {
          name: currentUser,
          folder: folder,
          deviceInput: deviceInput,
          accessToken: accessToken
        }
      }
      API.post(config.apiGateway.NAME, '/tokbox', myInit).then((createSessionRes) => {
        const OTcreds = {
          apiKey: createSessionRes.body.apikey,
          sessionId: createSessionRes.body.SessionId,
          token: createSessionRes.body.token
        }
        setTokenData(OTcreds)
      }).catch((err) => console.log("omg err", err))
    })()
  }


  if (tokenDataState) {
    const otSDK = new OpenTokSDK(tokenDataState)
    otSDK.connect()
      .then(() => { setConnectedState(true) 
    })
      .catch((err) => console.log('connection error', err))
    if (connectedState) {
      return (
        <div>
        <div><OTcommponent {...props} otSDK={otSDK} /></div>
        </div>
      )
    } else {
      return <div>connecting...</div>
    }
  } else {
    return (
      <div>establishing call</div>
    )
  }
}

export default WebphoneHC;