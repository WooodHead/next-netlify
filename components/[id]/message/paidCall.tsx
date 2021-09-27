import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import MessageCaller from './messageCaller'
import CustomSpinner from '../../custom/spinner'
import { loadStripe } from '@stripe/stripe-js/pure'
declare var OT

// loadStripe.setLoadParameters({advancedFraudSignals: false})

const PaidCallContainer = (props) => {
  const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
  const targetUser = props.targetUser
  return (
    <Elements stripe={stripePromise}><PaidCall targetUser={targetUser} /></Elements>
  )
}

const PaidCall = (props) => {
  const targetUser = props.targetUser
  const [state, setState] = useState({
    card: false,
    intentKey: null,
    submitting: false,
    otSession: null,
    busy: null,
    apiHit: false
  })
  const modifyState = e => setState({ ...state, ...e })

  // @ts-ignore
  const stripe = useStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
  const elements = useElements()

  const submitCard = async e => {
    e.preventDefault()
    try {
      await stripe.confirmCardSetup("" + state.intentKey, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            // name: nameRef.current.value,
            // email: email
          },
        }
      })
      console.log('after stripe, target user', targetUser)
      const sessionRes = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/createPaidSession', {
        body: { name: targetUser }
      })
      // this acts like createSession
      if (sessionRes.busy) {
        modifyState({ busy: true, apiHit: true })
      } else {
        const otSession = OT.initSession(sessionRes.apikey, sessionRes.SessionId)
        modifyState({ otSession: otSession, apiHit: true })
        otSession.connect(sessionRes.token, function (err) {
          if (err) { console.log(err) }
        })
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    const setupCard = async () => {
      // if (!stripe || !elements) { console.log('returned'); return }
      //post an unauthed route, see what auth gets sent?
      const intentKey = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/logIdentity', {})
      modifyState({ intentKey: intentKey })
    }
    setupCard()
  }, [stripe])

  return (
    state.otSession
      ? <div>
        <MessageCaller otSession={state.otSession} targetUser={targetUser} />
      </div>
      : stripe
        ? <div className="mx-5 mt-20">
          <div className="flex justify-center mb-20">
            <div className="flex flex-col">
              <div className="flex">User costs ${props.ppm} per minute </div>
              <div className="flex">You will be charged after the conversation ends. Minimum charge is $.50</div>
              {/* <a href="/pricing">Go here for more info on pricing</a> */}
            </div>

          </div>

          <form onSubmit={submitCard} >
            Card details
            <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
            <button className="mt-5">submit and call</button>
            {state.submitting && <CustomSpinner />}
          </form></div>
        : null
  )
}


export default PaidCallContainer