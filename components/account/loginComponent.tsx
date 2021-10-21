
import { ConsoleLogger } from '@aws-amplify/core';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn, AmplifyAuthContainer } from '@aws-amplify/ui-react';
import { AuthContext, UsernameContext } from '../../utils/context';
import { useContext, useEffect } from 'react'

export default function LoginComponent() {

  const context = useContext(AuthContext)

  const federated = { googleClientId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT }

  const authHandler = (authEvent) => {
    if (authEvent === "signedin") {
      context.setAuthState(true)
    }
  }

  return (
    <>
      <AmplifyAuthContainer>
        <AmplifyAuthenticator
          usernameAlias="email"
          federated={federated}
          handleAuthStateChange={authHandler}
          >
          <AmplifySignIn
          />
          <AmplifySignUp
            slot="sign-up"
            formFields={[
              { type: "email", inputProps: { required: true, autocomplete: "username" } },
              { type: "password" },
            ]}
          />

        </AmplifyAuthenticator>
      </AmplifyAuthContainer>
    </>
  )
}