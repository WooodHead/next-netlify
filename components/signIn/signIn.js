import React, { useRef, useState } from "react";
import { Auth } from "aws-amplify";
// import { useHistory } from "react-router-dom"
import { CustomSpinner } from "../custom/spinner"
import ForgotPassword from "./forgotPassword"
import '../../configureAmplify'
import { useRouter } from 'next/router'
import NavbarComp from '../navbar/navbar'
import CreateAccount from '../signIn/createAccount'

const SignIn = props => {

  const router = useRouter()
  
  const [pageState, setPageState] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)
  const [errState, setErrState] = useState(false)

  // let history = useHistory()
  const emailInputRef = useRef();
  const passInputRef = useRef();

  const userLoginHandler = async e => {
      setSubmitting(true)
    e.preventDefault();
    try {
      const authSignInRes = await Auth.signIn(
        emailInputRef.current.value,
        passInputRef.current.value
      );
      // const preferredUsername = authSignInRes.attributes.preferred_username
      // const cognitoData = authSignInRes.signInUserSession

      // signInFn(preferredUsername, cognitoData)

      setSubmitting(false)
      // history.push("/i/whosonline")
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

  const createAccountButtonFn = () => {
      router.push("/i/signUp")
  }
  

  return (
    (pageState === 'forgotPass') ? <div>
      <NavbarComp />
      <ForgotPassword setForgotPassState={setForgotPassState}/>
    </div> :
    (pageState === 'createAccount') ? <div>
      <CreateAccount />
    </div> :
    <div>
      <NavbarComp />
      <div className="container" >
        <div className="mb-3">
          email
          <div>
            <input type="email" ref={emailInputRef} placeholder="enter email"></input>
            {errState === "emailErr"  && ' ❌'}
          </div>
        </div>

        <div className="mb-3">
          password 
        <div>
          <input type="password" ref={passInputRef} placeholder="enter password"></input> 
          {errState === "passErr" && ' ❌' }
        </div>
        </div>

        <div className="mb-2">
          <button onClick={userLoginHandler} disabled={isSubmitting}>sign in</button>
          {isSubmitting && <CustomSpinner/>}
        </div> 
        
        <div className="mb-3">
          <button type="button" className="link-button" onClick={() => setPageState('forgotPass')}>forgot password?</button>
        </div>

        <div className="d-flex justify-content-center mb-1">or</div>
          <div className="d-flex justify-content-center">
              <button onClick={() => setPageState('createAccount')}>create an account</button>
          </div>
        </div>
        <div>
        </div>
    </div>
  );
};

export default SignIn;
