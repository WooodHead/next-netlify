import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'

import CustomSpinner from '../../../custom/spinner'

const CardComponent = (props) => {
  const state = props.state
  const modifyState = e => props.modifyState(e)
  // @ts-ignore
  const stripe = useStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)
  const elements = useElements()

  const setupCard = async () => {

    if (!stripe || !elements) { return }
    //post an unauthed route, see what auth gets sent?
    const intentKey = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/logIdentity', {})
    console.log(intentKey)
    modifyState({intentKey: intentKey })
  }
  

  const submitCard = async () => {
    await stripe.confirmCardSetup("" + state.intentKey, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          // name: nameRef.current.value,
          // email: email
        },
      }
    })
  }

  useEffect(() => {
    setupCard()
  }, [])

  return (
    <form onSubmit={submitCard} >
      Card details
      <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
      <button>submit</button>{state.submitting && <CustomSpinner />}
    </form>
  )
}

export default CardComponent