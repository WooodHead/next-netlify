import React, { useEffect, useState } from 'react'
import InitOT from '../components/phone/initOT'

const Phone = () => {
  const [state, setState] = useState();

  getSessionAsync = async () => {
    const userSession = await Auth.currentSession()
    const authHeader = {
      headers: { Authorization: userSession.idToken.jwtToken }
    }
    const getSelfTavs = API.get(config.apiGateway.NAME, "/users/folders", authHeader )
    const getSessionRes = API.get(config.apiGateway.NAME, "/tokbox", authHeader )
    const ownUser = await getSelfTavs
    const getOTsession = await getSessionRes

    setState({
      TAVS: {
        audio: ownUser.Item.deviceInput.M.audio.BOOL,
        screen: ownUser.Item.deviceInput.M.screen.BOOL,
        text: ownUser.Item.deviceInput.M.text.BOOL,
        video: ownUser.Item.deviceInput.M.video.BOOL
      },
      userSession: userSession,
      otToken: getOTsession.Item
    })
  }

  useEffect(() => {
    getSessionAsync()
  }, [])

  if (otTokenState) {
    return (
      <div>
        <InitOT
          tokenData={state.otToken}
          cognitoData={state.userSession}
          allowedDevices={state.TAVS}
        />
      </div>
    )
  } else {
    <div>retrieving data</div>
  }
}

export default Phone