import React, { useState } from "react"
import { API, Auth } from "aws-amplify"
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
      if (userState.reciever) {
        const myInit = {
          headers: { Authorization: userSession.idToken.jwtToken },
          body: { PPMnum: "" + ppmState }
        }
        setPPMloading(true)
        API.post(process.env.apiGateway.NAME, "/setPPM", myInit)
          .then((res) => {
            if (res.statusCode === 500) {setPPMdenied(true)} else {
              setPPMdenied(false)
              getUserData()
            }
            setPPMloading(false)
          }).catch(err => { console.log(err)
            setPPMloading(false)
          });
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

  return (
    <div className="row ml-0 mt-1" >
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
      <div className="row ml-2 mt-2">
      {ppmLoading && <CustomSpinner/>}
      
      {ppmDenied ? 
        <div style={{color: "red"}}>{" "} go inactive to change price</div> :
        (noReciever) ?  <div style={{color: "red"}}>{" "} you must set up how you get paid  </div>
        : valueTooSmall ? <div>{" "} minimum price is $0.17</div> : <div>{" "} your price per minute</div>}
      </div>
    </div>
  )
}
