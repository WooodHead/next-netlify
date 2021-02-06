import React, { useEffect, useState } from 'react'
import { API, Auth } from 'aws-amplify'
import config from '../config'
import '../configureAmplify'
import dynamic from "next/dynamic"
const InitOT = dynamic(() => import('../components/phone/initOT'), { ssr: false })

const Phone = () => {
  const [state, setState] = useState()
  const [errState, setErrState] = useState()

  const getSessionAsync = async () => {
    try {
      const userSession = await Auth.currentSession()
      const authHeader = {
        headers: { Authorization: userSession.idToken.jwtToken }
      }
      const getSelfTavs = API.get(config.apiGateway.NAME, "/users/folders", authHeader )
      const getSessionRes = API.get(config.apiGateway.NAME, "/tokbox", authHeader )
      const ownUser = await getSelfTavs
      const getOTsession = await getSessionRes
      console.log(getOTsession.Item.apiKey)
      setState({
        TAVS: {
          audio: ownUser.Item.deviceInput.M.audio.BOOL,
          screen: ownUser.Item.deviceInput.M.screen.BOOL,
          text: ownUser.Item.deviceInput.M.text.BOOL,
          video: ownUser.Item.deviceInput.M.video.BOOL
        },
        otToken: {
          Receiver: getOTsession.Item.Receiver.S,
          apikey: getOTsession.Item.apikey.S,
          caller: getOTsession.Item.caller.S,
          deviceInput: getOTsession.Item.deviceInput.S,
          sessionId: getOTsession.Item.sessionId.S,
          token: getOTsession.Item.token.S
        },
        userSession: userSession,
      })
    } catch (err) {
      console.log(err)
      setErrState(true)
    }
  }

  useEffect(() => {
    getSessionAsync()
  }, [])

    return (
      <div>
        {state?.otToken.sessionId && <div>
          <InitOT
            tokenData={state.otToken}
            cognitoData={state.userSession}
            allowedDevices={state.TAVS}
          />
        </div>}
        {errState && <div>caller disconnected</div>}
        {!state && !errState && <div>retrieving data</div>}
      </div>
    )
  }

export default Phone