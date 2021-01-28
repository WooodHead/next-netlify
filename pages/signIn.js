import React from 'react'
import { AmplifyAuthenticator } from '@aws-amplify/ui-react'
import '../configureAmplify'

export default function signIn() {
  return (
    <div>
      <AmplifyAuthenticator />
    </div>
  )
}