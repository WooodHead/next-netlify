import React, { useState } from 'react';
import { OpenTokSDK } from 'opentok-accelerator-core';
import TAVSparent from './tavsParent'

const InitOT = props => {
    const [connectedState, setConnectedState] = useState()

    const tokenDataProps = props.tokenData

    const OTcreds = {
        apiKey: tokenDataProps.apikey.S,
        sessionId: tokenDataProps.sessionId.S,
        token: tokenDataProps.token.S
    }

    const otSDK = new OpenTokSDK(OTcreds)
    otSDK.connect()
    .then(() => { setConnectedState(true) })
    .catch((err) => console.log('connection error', err))
    if (connectedState) {
        return (
            <TAVSparent {...props} otSDK={otSDK} />
        )
    } else {
        return (
            <div>connecting</div>
        )
    }

}

export default InitOT;