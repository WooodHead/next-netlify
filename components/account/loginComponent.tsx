
import { ConsoleLogger } from '@aws-amplify/core';
import { AmplifyAuthenticator, AmplifySignUp, AmplifySignIn, AmplifyAuthContainer } from '@aws-amplify/ui-react';
import { AuthContext } from '../../utils/context';
import { onAuthUIStateChange } from '@aws-amplify/ui-components'
import { useContext, useEffect, useState } from 'react'
import API from '@aws-amplify/api'
import CustomSpinner from '../custom/spinner';


export default function LoginComponent({ auth, updateAuth }) {

  const [state, setState] = useState({
    loading: false 
  })

    useEffect(() => {
        setState({ loading: false })
        return onAuthUIStateChange((nextAuthState, authData) => {
          console.log(nextAuthState)
          nextAuthState === 'signin' ? {} : setState({loading: true});
        });
    }, []);

  const federated = { googleClientId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT }

  const authHandler = async (authEvent) => {
    if (authEvent === "signedin") {
      updateAuth()
    }
  }

  return (
    <>
      { !state.loading ? <AmplifyAuthContainer>
        <AmplifyAuthenticator
          usernameAlias="email"
          federated={federated}
          handleAuthStateChange={authHandler}
          >
          <AmplifySignIn
          />
          <AmplifySignUp
            slot="sign-up"
            usernameAlias="email"
            formFields={[
              { type: "email", inputProps: { required: true, autocomplete: "username" } },
              { type: "password" },
            ]}
          />

        </AmplifyAuthenticator>
      </AmplifyAuthContainer> : <div className="flex justify-center m-40"><CustomSpinner /></div>}
    </> 
  )
}