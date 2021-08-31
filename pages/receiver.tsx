import { useEffect, useState } from "react"
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import '../configureAmplify'
import ReceiverSettings from '../components/receiver/receiverSettings'
import CustomSpinner from "../components/custom/spinner"
import Active from "../components/receiver/active"

export default function Receiver() {
  const [state, setState] = useState({
    active: null,
    ppm: 0,
    stripeReceiver: false,
    audio: false,
    video: false,
    screen: false,
    text: true,
    stripeUrl: null,
  })
  const modifyState = e => setState({ ...state, ...e })

  const getSelf = async () => {
    try {
      const userSession = await Auth.currentSession()
      const idToken = userSession.getIdToken().getJwtToken()
      const getUserInit = { headers: { Authorization: idToken } }
      const gotSelf = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/getSelfUser', getUserInit)
      const deviceInputRes = gotSelf.deviceInput
      modifyState({
        active: gotSelf.active,
        ppm: Number(gotSelf.ppm),
        stripeReceiver: gotSelf.receiver,
        video: deviceInputRes.video,
        screen: deviceInputRes.screen,
        text: deviceInputRes.text,
        audio: deviceInputRes.audio,
      })
    } catch (err) {
      console.log(err)
    }
  }

  const goOnlineOffline = async (props: Boolean) => {
    try {
      const userSession = await Auth.currentSession()
      const idToken = userSession.getIdToken().getJwtToken()
      const updateUserInit = {
        headers: { Authorization: idToken },
        body: { available: props }
      }
      const updatedUser = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/updateUserInactive', updateUserInit)
      modifyState({ active: updatedUser.available })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getSelf()
  }, [])

  return (
    <>
      <div className="flex justify-center my-20">
        {state.active === null ? <CustomSpinner />
          : state.active
            ? <div>
            <button onClick={() => goOnlineOffline(false)}>Go offline</button>
            <Active />
            <div className="mt-5">Changing your devices allowed or price per minute is not configureable while active</div>
          </div>: <div>
              <button onClick={() => goOnlineOffline(true)}>Go online</button>
              <div>
                <ReceiverSettings state={state} modifyState={modifyState} />
              </div>
            </div>
            
        }
      </div>
    </>
  )
}
