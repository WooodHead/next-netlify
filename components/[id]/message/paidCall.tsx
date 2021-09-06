import { useState } from 'react'
import dynamic from 'next/dynamic'
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CardComponent from './paidCall/cardComponent'
const DynamicMessageComponent = dynamic(
  () => import('./messageOtCaller'),
  { ssr: false }
)
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

export default function PaidCall(props) {
  const username = props.username
  const ppm = props.ppm

  const [state, setState] = useState({
    card: false,
    intentKey: null,
    submitting: false
  })
  const modifyState = e => setState({...state, ...e})

  return (
    <>
      {state.card
        ? <DynamicMessageComponent targetUser={username} />
        : <Elements stripe={stripePromise} >
          <h5>Add your card to make paid calls</h5>

          <CardComponent state={state} modifyState={modifyState}/>
        </Elements>
      }
      <div className="flex justify-center my-32">This user costs ${ppm} per minute</div>
    </>
  )
}