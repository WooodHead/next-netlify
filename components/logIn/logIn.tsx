import React, { useRef, useState } from "react";
import Auth from '@aws-amplify/auth'
import CustomSpinner from "../custom/spinner"
import ForgotPassword from "./forgotPassword"
import '../../configureAmplify'
import { useRouter } from 'next/router'
import Navbar from '../navbar/navbar'
import Link from 'next/link'
// import CreateAccount from '../signIn/createAccount'

const LogIn = props => {

  const [hiddenPassState, setHiddenPassState] = useState(true)
  const setModalState = (e) => props.setModalState(e)

  const router = useRouter()

  const [pageState, setPageState] = useState(null)
  const [isSubmitting, setSubmitting] = useState(false)
  const [errState, setErrState] = useState(null)
  const emailInputRef = useRef(null)
  const passInputRef = useRef(null)

  const userLoginHandler = async e => {
    setSubmitting(true)
    e.preventDefault();
    try {
      const authSignInRes = await Auth.signIn(
        emailInputRef.current.value,
        passInputRef.current.value
      );
      console.log(authSignInRes)
      setSubmitting(false)
      router.push("/account/edit")
    } catch (err) {
      if (err.code === "UserNotFoundException") {
        setErrState("emailErr")
      }
      if (err.code === "NotAuthorizedException") {
        setErrState("passErr")
      }
      setSubmitting(false)
    }
  };

  return (
    <>
      <span>By continuing, you agree to our </span>
      <span className="text-blue-500" >
        <Link href="/about">User Agreement</Link>
      </span>
      <span> and </span>
      <span className="text-blue-500">
        <Link href="/about">Privacy Policy</Link>
      </span>
      <span>
        .
      </span>
      <div className="m-5">
      {
        // (pageState === 'forgotPass') ? <div>

        //   <ForgotPassword setPageState={setPageState} />
        // </div> :
          (pageState === 'createAccount') ? <div>
            {/* <CreateAccount /> */}
          </div> :
            <div>
              <div className="container" >
                <div className="mb-5">
                  Email
                <div>
                    <input className="bg-blue-50" type="email" ref={emailInputRef} placeholder="enter email"></input>
                    {errState === "emailErr" && ' ❌'}
                  </div>
                </div>

                <div className="mb-5">
                  Password
                <div>
                    <input className="bg-blue-50" type={ hiddenPassState ? "password" : "text" } ref={passInputRef} placeholder="enter password"></input>
                    <span 
                      className="ml-2" 
                      style={{cursor: "pointer"}} 
                      onClick={() => setHiddenPassState(!hiddenPassState)}>
                    <span></span>{(hiddenPassState) ? 'show' : 'hide' }
                  </span>
                    {errState === "passErr" && ' ❌'}
                  </div>
                </div>

                <div className="mb-10 flex flex-row">
                  <button onClick={userLoginHandler} disabled={isSubmitting}>Log In </button>
                  <div className="mx-2 mt-1">{isSubmitting && <CustomSpinner />}</div>
                </div>

                <div className="mb-5">
                  <div className="link-button">Forgot your <span onClick={() => setModalState('Reset Password')} className="text-blue-500 cursor-pointer">password</span>?</div>
                </div>

                <div className="d-flex justify-content-center">
                  Don't have an account? <span className="text-blue-500 cursor-pointer" onClick={() => setModalState('Sign Up')}>SIGN UP</span>
                </div>
              </div>
              <div>
              </div>
            </div>

      }</div>
    </>
  )
}

export default LogIn;
