import { useEffect, useState } from "react"
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import '../configureAmplify'
import CustomSpinner from "../components/custom/spinner"
import Active from "../components/receiver/active"
import TAVS from '../components/receiver/tavs'
import PPM from '../components/receiver/ppm'
import ConnectStripe from '../components/receiver/connectStripe'

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
      // const userSession = await Auth.currentSession()
      const userAuth = await Auth.currentAuthenticatedUser()
      // const idToken = userSession.getIdToken().getJwtToken()
      // const getUserInit = { headers: { Authorization: idToken } }
      // const gotSelf = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/getSelfUser', getUserInit)
      const getUserInit = { body: { username: userAuth.username } }
      const gotSelf = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY, '/getUser', getUserInit)
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
      <div >
        {
          state.active === null
            ? <div className="flex justify-center mt-32"><CustomSpinner /></div>
            : state.active
              ? <div>
                <div className="m-20">
                <div>To disable calls and/or change call settings</div>
                <button onClick={() => goOnlineOffline(false)}>Go offline</button>
                  </div>
                
                <Active />
              </div>
              : <div>
                <div className="flex justify-center mt-20">
                  <button onClick={() => goOnlineOffline(true)}>Go online</button>
                </div>

                <div className="flex flex-row flex-wrap">
                  <div className="flex justify-center flex-grow">
                    <div className="flex-col">
                      <div className="mx-5 mt-20 mb-10">Set the permitted devices:</div>
                      <TAVS state={state} modifyState={modifyState} />
                    </div>
                  </div>
                  <div className="flex justify-center flex-grow" >
                    <div className="flex flex-col">
                      <div className="mx-5 mt-20 mb-10">Your price per minute:</div>
                      <div className=""><PPM state={state} modifyState={modifyState} /></div>
                      <div className="my-10">
                      <ConnectStripe state={state} modifyState={modifyState} />
                      </div>
                    </div>
                  </div>
                </div>
                
              </div>
        }
      </div>
    </>
  )
}
