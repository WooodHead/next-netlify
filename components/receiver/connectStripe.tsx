import React, { useState, useEffect } from 'react'
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import '../../configureAmplify'
// import {loadStripe} from '@stripe/stripe-js'
import Image from 'next/image'

// const stripePromise = loadStripe(process.env.STRIPE_KEY)

export default function ConnectStripe(props) {
  const modifyState = e => props.modifyState(e)
  const state = props.state


  const getOnboardLink = async () => {
    try {
      const userSession = await Auth.currentSession()
      const idToken = userSession.getIdToken().getJwtToken()
      const params = { headers: { Authorization: idToken } }
      const { status, body } = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/onboard', params)
      modifyState({ stripeUrl: body.url })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getOnboardLink()
  }, [])

  return (
    <div>{state.stripeUrl && 
      <a href={state.stripeUrl}>
      <Image alt="connect with stripe" src='/light-on-light.png' width={190} height={33} />
      </a>
      }</div>
  )
}