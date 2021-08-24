import React, { useState, useRef, useEffect } from 'react'
import Auth from '@aws-amplify/auth'
import { useRouter } from 'next/router'
import CustomSpinner from '../custom/spinner'
import '../../configureAmplify'
import Link from 'next/link'
const SignUp = props => {

  const [submitAccountState, setSubmitAccountState] = useState(false)
  const [submitConfirmationState, setSubmitConfirmationState] = useState(false)
  const [submitConfirmation, setSubmitConfirmation] = useState(null)
  const [hiddenPassState, setHiddenPassState] = useState(true)
  const [errState, setErrState] = useState(null)
  const [splashState, setSplashState] = useState(null)
  const [loginState, setLoginState] = useState({
    username: '',
    email: '',
    password: '',
    code: '',
  })
  const setModalState = (e) => props.setModalState(e)

  const router = useRouter()

  const userAddHandler = async e => {
    e.preventDefault();

    try {
      await Auth.signUp({
        username: "" + loginState.username,
        password: "" + loginState.password,
        attributes: {
          email: loginState.email
        }
      })
      setErrState("accepted")
      setSubmitAccountState(true)
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
  }

  const userVerifyHandler = async e => {
    e.preventDefault();
    setSubmitConfirmationState(true)
    try {
      await Auth.confirmSignUp(loginState.username, loginState.code)
      setSubmitConfirmation("accepted")
      setSubmitConfirmationState(false)
      await Auth.signIn(loginState.email, loginState.password)
      router.push('/account/edit')
      setModalState(false)
    } catch (err) {
      console.log(err)
      setSubmitConfirmation("denied")
      setSubmitConfirmationState(false)
    }
  }

  const usernameHandler = (usernameInput) => {
    const sanitized = usernameInput.replace(/[_$&+,:;=?[\]@#|{}'<>.^*()%!/]/g, "")
    // console.log(isNotAllowed)
    // if (isNotAllowed) {
    //   setUserNameState('❌')
    // } else {
    setLoginState({...loginState, username: sanitized})
    // }
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
        <span>By continuing, you agree to our </span>
        <span className="text-blue-500" >
          <Link href="/about/tos"><a>User Agreement</a></Link>
        </span>
        <span> and </span>
        <span className="text-blue-500">
          <Link href="/about/privacy"><a>Privacy Policy</a></Link>
        </span>
        <span>
          .
        </span>
        {!submitAccountState ? <div className="m-5"><div className="mt-5 mb-5">
          Username
            <div >
            <input
              onChange={(event) => usernameHandler(event.target.value)}
              className="bg-blue-100" disabled={(errState === "accepted")}
              placeholder="Enter username">
            </input>
            <div>talktree.me/{loginState.username}</div>
            {/* {(errState === "emailBad") && ' ❌' } */}
          </div>
        </div>
          <div className="mb-5">
            Email
            <div>
              <input 
                onChange={(event) => setLoginState({...loginState, email: event.target.value})} 
                disabled={(errState === "accepted")} 
                placeholder="enter email">
              </input>{(errState === "emailBad") && ' ❌'}
              <div>You can use either username or email to login</div>
            </div>
          </div>
          <div className="mb-5">
            Password
            <div className="container-fluid row">
              <input
                type={hiddenPassState ? "password" : "text"}
                onChange={(event) => setLoginState({...loginState, password: event.target.value})}
                disabled={(errState === "accepted")}
                placeholder="enter password"
              ></input>
              <span
                className="ml-2"
                style={{ cursor: "pointer" }}
                onClick={() => setHiddenPassState(!hiddenPassState)}>
                <span></span>{(hiddenPassState) ? 'show' : 'hide'}
              </span>
              {(errState === "passBad") && ' ❌'}

            </div>
            {/* <div>please make it complicated</div> */}
          </div>
          <div className="mb-5">
            <button disabled={(errState === "accepted")} onClick={userAddHandler}>Submit</button>
            {(errState === "accepted") && ' ✔️'}
            {submitAccountState && <CustomSpinner />}
          </div></div> : <div className="m-5 column">

          <div className="mb-2">We sent a confirmation code to your email</div>
          <div className="mb-3">
            <input onChange={(event) => setLoginState({...loginState, code: '' + event.target.value})} placeholder="Confirmation code"></input>
          </div>
          <div>
            <button disabled={submitConfirmationState} onClick={userVerifyHandler}>submit</button>
            {submitConfirmationState && <CustomSpinner />}
            {(submitConfirmation === "accepted") ? <CustomSpinner /> : (submitConfirmation === "denied") ? ' ❌' : null}
          </div>

        </div>}
        <div className="mt-10">
          Already have an account? <span className="text-blue-500 cursor-pointer " onClick={() => setModalState('Login')}>LOG IN</span>
        </div>
      </div>
    )
  }


}

export default SignUp