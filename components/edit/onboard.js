import React, { useState, useEffect } from 'react'
import { API, Auth } from 'aws-amplify'
import {loadStripe} from '@stripe/stripe-js'
import Image from 'next/image'

const stripePromise = loadStripe(process.env.STRIPE_KEY)

export default function Onboard() {
  const [onboardingLinkState, setOnboardingLinkState] = useState()


  const getOnboardLink = async () => {
    console.log('getOnboardingLink render')
    const authSession = await Auth.currentAuthenticatedUser()
    const userSession = authSession.signInUserSession
    const params = {
      headers: { Authorization: userSession.idToken.jwtToken }
    }
    const { status, body } = await API.get(process.env.apiGateway.NAME, '/onboard', params)
    setOnboardingLinkState(body.url)

  }

  useEffect(() => {
    getOnboardLink()
  }, [])

  return (
    <div>{onboardingLinkState && <a href={onboardingLinkState}>
      <Image alt="connect with stripe" src='/light-on-light.png' width={190} height={33} /></a>}</div>
  )
}