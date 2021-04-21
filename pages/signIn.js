import React from 'react'
import '../configureAmplify'
import dynamic from 'next/dynamic'
const SignIn = dynamic(() => import('../components/signIn/signIn'),{ ssr: false })

export default function Auth() {
  return (
    <div>
      <SignIn />
    </div>
  )
}