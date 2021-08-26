import React, { useState } from "react"
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import '../../configureAmplify'
import CustomSpinner from "../custom/spinner"
// import { Link } from "react-router-dom";
// import config from '../config'

export default function PPM(props) {
  const userState = props.userState
  const [ppmState, setPPMstate] = useState(props.userState.ppm);
  const [ppmLoading, setPPMloading] = useState(false)
  const [ppmDenied, setPPMdenied] = useState(false)
  const [noReciever, setNoReciever] = useState(false)
  const [valueTooSmall, setValueTooSmall] = useState(false)
  const [userAvailable, setUserAvailable] = useState(userState.active)

  // const reciever = props.receiver

  const getUserData = () => props.getUserData()

  // const setNetworkOrAuthError = props.setNetworkOrAuthError

  const setPPMfn = (eventNumber) => {
    if (eventNumber.currentTarget.value < 0.17 && eventNumber.currentTarget.value > 0.00) {
      setValueTooSmall(true)
    } else {
      setValueTooSmall(false)
      setPPMstate(eventNumber.currentTarget.value)
    }
  }

  const submitPPM = async e => {
    e.preventDefault()
    try {
      const userSession = await Auth.currentSession()
      if (userState.receiver) {
        const myInit = {
          headers: { Authorization: userSession.idToken.jwtToken },
          body: { PPMnum: "" + ppmState }
        }
        setPPMloading(true)
        const PPMres = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/setPPM", myInit)
        PPMres.statusCode === 500 ? setPPMdenied(true) : setPPMdenied(false), getUserData()
        setPPMloading(false)
      } else {
        setNoReciever(true)
      }
    } catch (err) {
      console.log(err)
      // if (err === 'No current user') {
        // setNetworkOrAuthError('No user')
      // } else {
        // setNetworkOrAuthError('error')
      // }
    }
  }

  const goActiveHandler = async () => {
    const userSession = await Auth.currentSession()
    const accessToken = userSession.getIdToken().getJwtToken()
    const updateUserInit = { 
      headers: { Authorization: accessToken },
      body: { available: !userAvailable} }
    try {
      const updatedAvailability = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/updateUserInactive", 
        updateUserInit )
        setUserAvailable(updatedAvailability.available)
    } catch (err) {
      console.log(err)
    }

  }

  return (
    <div className="mt-1 ml-0 row" >
      {/* <button onClick={submitPPM}>submit</button> */}
      <form onSubmit={submitPPM}>$ 
       <input
         style={{width: "60px"}}
         type="number"
         step="0.01"
         min="0.00"
         max="20"
         onChange={setPPMfn}
         defaultValue={userState.ppm}
       />
      </form>
      <div className="mt-2 ml-2 row">
      {ppmLoading && <CustomSpinner/>}
      
      {ppmDenied ? 
        <div style={{color: "red"}}>{" "} go inactive to change price</div> :
        (noReciever) ?  <div style={{color: "red"}}>{" "} you must set up how you get paid  </div>
        : valueTooSmall ? <div>{" "} minimum price is $0.17</div> : <div>{" "} your price per minute</div>}
      </div>
      <input type="checkbox" checked={userAvailable} onChange={goActiveHandler} className=""></input> Available
    </div>
  )
}
