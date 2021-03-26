import React from 'react'
import { API, Auth } from 'aws-amplify'
import '../../configureAmplify'
import PPM from './ppm'
import StripeOnboard from './onboard'

export default function TAVS(props) {
  const tavsState = props.tavsState
  const setTavsState = (e) => props.setTavsState(e)
  const userState = props.userState
  const getUserData = () => props.getUserData()

  const deviceInputs = ['text', 'audio', 'video', 'screen']

  const handleCheckboxClick = async (tavProp) => {
    setTavsState({...tavsState, [tavProp.TAVS]: !tavsState[tavProp.TAVS]})
    try {
      const userSession = await Auth.currentSession()
      let myInit = {
        headers: { Authorization: userSession.idToken.jwtToken },
        body: { deviceName: tavProp.TAVS, deviceBool: !tavsState[tavProp.TAVS] },
      }
      await API.post(process.env.apiGateway.NAME, "/users/devices", myInit)
      props.getUserData()
    } catch (err) {
      console.log(err)
    }
  }

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
        defaultChecked={tavsState[CCprops.TAVS]} 
        name={CCprops.TAVS}
        value="hello"
      />
      {CCprops.TAVS}
    </div>
  );

  return (
    <div>
      <button onClick={() => setTavsState({...tavsState, editing: !tavsState.editing})}>settings</button>
      {tavsState.editing 
        && <div>
          {deviceInputs.map((device) => <CustomCheckbox key={device} TAVS={device} />)}
          <div className="my-5">
            < PPM getUserData={getUserData} userState={userState} />
          </div>
          
          <StripeOnboard />
        </div>}
    </div>
    
  )
}