import React, { useRef, useState } from 'react'
import Auth from 'aws-amplify/auth'
import '../../configureAmplify'

const ForgotPassword = props => {
  const setPageState = props.setPageState

  const [errState, setErrState] = useState(false)

  const emailInputRef = useRef();
  const codeRef = useRef()
  const passwordRef = useRef()

  const submitForgotten = async () => {
    try {
      await Auth.forgotPassword(emailInputRef.current.value)
      setErrState("success")
    } catch {
      setErrState("email")
    }
  }

  const afterReset = async () => {
    try {
      await Auth.forgotPasswordSubmit(emailInputRef.current.value, codeRef.current.value, passwordRef.current.value )
      setPageState('')
    } catch (err) {
      if (err.code === "InvalidParameterException") {
        setErrState("password")
      }
      if (err.code === "CodeMismatchException" ) {
        setErrState("confirmationCode")
      }
    }
  }

  return (
    <div className="container">
      <div className="mb-2 mt-2">
        email
        <div>
          <input type="email" disabled={errState === "success"} ref={emailInputRef} placeholder="Enter email"></input>
          {errState === "success" && ' ✔️'}
          {errState === "email" && ' ❌' }
        </div>

      </div>
      <div className="mb-4">
        <button onClick={submitForgotten}>reset password</button>
      </div>
      <div className="mb-3">
        new password
        <div>
        <input type="password" ref={passwordRef} placeholder="Enter new password"></input>
        {errState === "password" && ' ❌' }
        </div>
      </div>
      <div className="mb-2">
        confirmation code
        <div>
          <input ref={codeRef} placeholder="Enter code"></input>
          {errState === "confirmationCode" && ' ❌' }
        </div>
      </div>
      <div className="mb-2">
        <button onClick={afterReset}>create new password</button>
      </div>
      <div>
        <button className="link-button" onClick={() => setPageState('')}>back to sign in</button>
      </div>
    </div>
  )
}

export default ForgotPassword