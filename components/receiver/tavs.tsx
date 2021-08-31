import React from 'react'
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import '../../configureAmplify'

export default function TAVS(props) {
  const state = props.state
  const modifyState = e => props.modifyState(e)

  const handleCheckboxClick = async (tavProp) => {
    try {
      const userSession = await Auth.currentSession()
      const idToken = userSession.getIdToken().getJwtToken()
      let myInit = {
        headers: { Authorization: idToken },
        body: {
          deviceName: tavProp.TAVS,
          deviceBool: !state[tavProp.TAVS]
        },
      }
      const updatedTavs = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/updateTavs", myInit)
      modifyState({ ...updatedTavs }) /* spread necessary, thought I could pass the Obj up and it be spread but no*/
    } catch (err) {
      console.log(err)
    }
  }

  const deviceInputs = ['text', 'audio', 'video', 'screen']
  const CustomCheckbox = (CCprops) => (
    <div
      className="ml-3"
      style={{ cursor: "pointer" }}
      onClick={() => handleCheckboxClick(CCprops)}
    >
      <input
        className="mr-1"
        onChange={null}
        style={{ cursor: "pointer" }}
        type="checkbox"
        defaultChecked={state[CCprops.TAVS]}
        name={CCprops.TAVS}
        value="hello"
      />
      {CCprops.TAVS}
    </div>
  )

  return (
    <div>
      {deviceInputs.map((device) => <CustomCheckbox key={device} TAVS={device} />)}
    </div>
  )
}