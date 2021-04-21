import React, { useState, useEffect } from 'react';
import Auth from 'aws-amplify/auth'
import { useRouter } from 'next/router'
import CustomSpinner from '../custom/spinner'
import '../../configureAmplify'

const SignUp = props => {

  const accountCreatedSaveStrings = () => props.accountCreatedSaveStrings()
  const [submitAccountState, setSubmitAccountState] = useState(false)
  const [submitConfirmationState, setSubmitConfirmationState] = useState(false)
  const [submitConfirmation, setSubmitConfirmation] = useState()
  const [errState, setErrState] = useState(false)
  const [splashState, setSplashState] = useState(false)
  const [confirmationState, setConfirmationState] = useState()
  const [emailPassInput, setEmailPassInput] = useState({
    emailInput: '',
    passInput: '',
    codeInput: ''
  })

  const router = useRouter()

  const submitUserHandler = async e => {
    e.preventDefault();
    setSubmitAccountState(true)
    try {
      await Auth.signUp({
        username: emailPassInput.emailInput,
        password: emailPassInput.passInput,
        attributes: {
          preferred_username: "toBeReplaced"
        }
      })
      setErrState("accepted")
      setSubmitAccountState(false)
      setConfirmationState(true)
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
      await Auth.confirmSignUp(emailPassInput.emailInput, emailPassInput.codeInput)
      setSubmitConfirmation("accepted")
      setSubmitConfirmationState(false)
      await Auth.signIn(emailPassInput.emailInput, emailPassInput.passInput)
      accountCreatedSaveStrings()
    } catch (err) {
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
  } else if (!confirmationState) {
    return (
      <div className="container">
        <div className="column">
          <h4 className="mb-2 mt-3">create an account</h4>
          <div className="mb-3">
            <div>
              <input
                onChange={(e) => setEmailPassInput({ ...emailPassInput, emailInput: e.target.value })}
                disabled={(errState === "accepted")}
                placeholder="enter email"></input>
              {(errState === "emailBad") && ' ❌'}
            </div>
          </div>
          <div className="mb-3">
            <div className="container-fluid row">
              <input
                type="password"
                onChange={(e) => setEmailPassInput({ ...emailPassInput, passInput: e.target.value })}
                disabled={(errState === "accepted")}
                placeholder="enter password"
              ></input>
              {(errState === "passBad") && ' ❌'}

            </div>
            {/* <div>please make it complicated</div> */}
          </div>
          <div className="mb-5">
            <button disabled={(errState === "accepted")} onClick={submitUserHandler}>submit</button>
            {(errState === "accepted") && ' ✔️'}
            {submitAccountState && <CustomSpinner />}
          </div>

        </div>
      </div>
    )
  } else {
    return (
      <div>
        <div className="mx-2 my-3">check your email for a confirmation code</div>
        <div className="mb-3">
          <input 
            onChange={(e) => setEmailPassInput({ ...emailPassInput, codeInput: e.target.value })}
            placeholder="confirmation code"></input>
        </div>
        <div>
          <button disabled={submitConfirmationState} onClick={userVerifyHandler}>submit</button>
          {submitConfirmationState && <CustomSpinner />}
          {(submitConfirmation === "accepted") ? <CustomSpinner /> : (submitConfirmation === "denied") ? ' ❌' : null}
        </div>
      </div>
    )
  }


}

export default SignUp