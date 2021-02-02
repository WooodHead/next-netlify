import React, { useState } from 'react';
import { API, Auth } from 'aws-amplify';
import config from '../../config'
import OTcommponent from './otComponent'

const CallComponent = (props) => {

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
        setTokenData({
          OTcreds: OTcreds
        })
      }).catch((err) => console.log("omg err", err))
    })()
  }


  if (tokenDataState) {
    const otSession = OT.initSession(tokenDataState.OTcreds)
    console.log(otSession)
      return (
        <div>
        <div><OTcommponent {...props} otSession={otSession} /></div>
        </div>
      )
  } else {
    return (
      <div>establishing call</div>
    )
  }
}

export default CallComponent;