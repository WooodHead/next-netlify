import React, { useState } from "react"
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import '../../configureAmplify'
import CustomSpinner from "../custom/spinner"

export default function PPM(props) {
  const state = props.state
  const modifyState = e => props.modifyState(e)

  const [ppmLoading, setPPMloading] = useState(false)
  const [ppmDenied, setPPMdenied] = useState(false)
  const [noReciever, setNoReciever] = useState(false)
  const [valueTooSmall, setValueTooSmall] = useState(false)

  const setPPMfn = (eventNumber) => {
    if (eventNumber.currentTarget.value < 0.17 && eventNumber.currentTarget.value > 0.00) {
      setValueTooSmall(true)
    } else {
      setValueTooSmall(false)
      modifyState({ ppm: eventNumber.currentTarget.value })
    }
  }

  const submitPPM = async e => {
    e.preventDefault()
    try {
      const userSession = await Auth.currentSession()
      const idToken = userSession.getIdToken().getJwtToken()
      if (state.stripeReceiver) {
        const myInit = {
          headers: { Authorization: idToken },
          body: { PPMnum: state.ppm }
        }
        setPPMloading(true)
        const PPMres = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/setPPM", myInit)
        const ppmNum = Number(PPMres.body)
        modifyState({ ppm: ppmNum })
        PPMres.statusCode === 500 ? setPPMdenied(true) : setPPMdenied(false)
        setPPMloading(false)
      } else {
        setNoReciever(true)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="mt-1 ml-0 row" >
      <form onSubmit={submitPPM}>$ 
       <input
         style={{width: "60px", borderStyle: "solid"}}
         type="number"
         step="0.01"
         min="0.00"
         max="5"
         onChange={setPPMfn}
         defaultValue={state.ppm}
       />
      </form>
      <div className="mt-2 ml-2 row">
      {ppmLoading && <CustomSpinner/>}
      
      {ppmDenied ? 
        <div style={{color: "red"}}>{" "} go inactive to change price</div> :
        (noReciever) ?  <div style={{color: "red"}}>{" "} you must set up how you get paid  </div>
        : valueTooSmall ? <div>{" "} minimum price is $0.17</div> : <div></div>}
      </div>
    </div>
  )
}
