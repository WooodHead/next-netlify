import { useState } from 'react'
import dynamic from 'next/dynamic'
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import CardComponent from './paidCall/cardComponent'


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY)

export default function PaidCall(props) {
  const targetUser = props.targetUser
  const ppm = props.ppm

  return (
    <>
        <Elements stripe={stripePromise} >
          <CardComponent targetUser={targetUser} />
        </Elements>
    </>
  )
}