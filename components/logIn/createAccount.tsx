import React, { useState, useRef, useEffect } from 'react'
import Auth from '@aws-amplify/auth'
import { useRouter } from 'next/router'
import CustomSpinner from '../custom/spinner'
import '../../configureAmplify'

const SignUp = props => {
  
    const [submitAccountState, setSubmitAccountState] = useState(false)
    const [submitConfirmationState, setSubmitConfirmationState] = useState(false)
    const [submitConfirmation, setSubmitConfirmation] = useState(null)
    const [hiddenPassState, setHiddenPassState] = useState(true)
    const [errState, setErrState] = useState(null)
    const [splashState, setSplashState] = useState(null)

  const signInFn = props.signInFn

  const emailInputRef = useRef(null)
  const passInputRef = useRef(null)
  const usernameInputRef = useRef(null)
  const securityCode = useRef(null)
  
  const router = useRouter()

  const userAddHandler = async e => {
    e.preventDefault();
    setSubmitAccountState(true)
    try {
      await Auth.signUp({
        username: "" + emailInputRef.current.value,
        password: "" + passInputRef.current.value,
        attributes: {
          preferred_username: usernameInputRef.current.value
        }
      })
      setErrState("accepted")
      setSubmitAccountState(false)
    } catch (err) {
      console.log(err)
      if (err.message === "Username should be an email." || err.code === "UsernameExistsException") {
        setErrState("emailBad")
      }
      if (err.message.includes('password')) {
        setErrState("passBad")
      }
      setSubmitAccountState(false) 
    }
  };
  
  const userVerifyHandler = async e => {
    e.preventDefault();
    setSubmitConfirmationState(true)
    try {
      await Auth.confirmSignUp(emailInputRef.current.value, securityCode.current.value)
      setSubmitConfirmation("accepted")
      setSubmitConfirmationState(false)
      await Auth.signIn( emailInputRef.current.value, passInputRef.current.value )
      router.push('/account/edit')
    } catch(err) {
      console.log(err)
      setSubmitConfirmation("denied")
      setSubmitConfirmationState(false)
    }
  }

  const isLoggedIn = async () => {
    try {
      await Auth.currentSession()
      setSplashState('alreadyLoggedIn')
    } catch {
      setSplashState('notSignedUp')
    }
  }
  useEffect(() => {
    isLoggedIn()
  }, [])

  if (splashState === 'alreadyLoggedIn') {
    return (
      <div className="container mt-3">
        You must go to your settings and log out before you can create a new account
      </div>
    )
  } else {
    return (
      <div className="container">
        <div className="column">
          <h4 className="mb-2">create an account</h4>
          <div className="mb-3">
            Username - this will be your URL (eg: talktree.me/gty)
            <div >
              <input ref={usernameInputRef} className="bg-blue-100" disabled={(errState === "accepted")} placeholder="enter username"></input>
              {/* {(errState === "emailBad") && ' ❌' } */}
            </div>
          </div>
          <div className="mb-3">
            email
            <div>
              <input ref={emailInputRef} disabled={(errState === "accepted")} placeholder="enter email"></input>
              {(errState === "emailBad") && ' ❌' }
            </div>
          </div>
          <div className="mb-3">
            password
            <div className="container-fluid row">
              <input 
              type={ hiddenPassState ? "password" : "text" }
              ref={passInputRef} 
              disabled={(errState === "accepted")} 
              placeholder="enter password"
              ></input>            <div 
              className="ml-1" 
              style={{cursor: "pointer"}} 
              onClick={() => setHiddenPassState(!hiddenPassState)}>
             {(hiddenPassState) ? 'show' : 'hide' }
            </div>
              {(errState === "passBad") && ' ❌' }
  
            </div>
            <div>please make it complicated</div>
          </div>
          <div className="mb-5">
            <button disabled={(errState === "accepted")} onClick={userAddHandler}>submit</button> 
            {(errState === "accepted") && ' ✔️' }
            {submitAccountState && <CustomSpinner />}
          </div>
          <div className="mb-2">and check your email for a confirmation code</div>
          <div className="mb-3">
            <input ref={securityCode} placeholder="confirmation code"></input>
          </div>
          <div>
            <button disabled={submitConfirmationState} onClick={userVerifyHandler}>submit</button>
            {submitConfirmationState && <CustomSpinner />}
            {(submitConfirmation === "accepted") ? <CustomSpinner /> : (submitConfirmation === "denied") ? ' ❌' : null}
          </div>
        </div>
      </div>
    )
  }
    
  
}

export default SignUp