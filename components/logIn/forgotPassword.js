import React, { useRef, useState } from 'react'
import Auth from '@aws-amplify/auth'
import '../../configureAmplify'

const ForgotPassword = props => {
  // const setPageState = props.setPageState
  const setModalState = e => props.setModalState(e)

  const [errState, setErrState] = useState(false)
  const [sendCodeState, setSendCodeState] = useState(null)
  const [paramsState, setParamsState] = useState({
    email: null,
    code: null,
    password: null
  })


  const sendCode = async () => {
    try {
      await Auth.forgotPassword(paramsState.email)
      setErrState("success")
      setSendCodeState("sent")
    } catch {
      setErrState("email")
    }
  }
  const pretendConfirmCode = () => {
    setSendCodeState("codeEntered")
  }


  const afterReset = async () => {
    try {
      await Auth.forgotPasswordSubmit(paramsState.email, paramsState.code, paramsState.password )
      setModalState('Login')
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
    <>
    {!sendCodeState 
      ? <div className="mx-5">
          Tell us the email address associated with your account, and we'll send you an email with a code to reset your password.
          <div className="mb-2 mt-5">
            Email
            <div className="mb-5">
              <input 
                className="bg-blue-50" type="email" 
                disabled={errState === "success"} 
                onChange={(event) => setParamsState({...paramsState, email: event.target.value})} 
                placeholder="Enter email">
              </input>
              {errState === "success" && ' ✔️'}
              {errState === "email" && ' ❌' }
            </div>
          </div>
          <div className="mb-4">
            <button onClick={sendCode}>Send Password Code</button>
          </div>
        </div>

      : (sendCodeState === "sent") 
      ? <div className="mb-2">
        We sent the confirmation code to your email
          <div className="mt-5">
            <input 
              onChange={(event) => setParamsState({...paramsState, code: event.target.value})} 
              className="bg-blue-50"  placeholder="Enter code">
            </input>
            <div className="mt-5" >
              <button onClick={pretendConfirmCode}>
                Confirm
              </button>
            </div>
            {errState === "confirmationCode" && ' ❌' }
          </div>
        </div>

      : (sendCodeState === "codeEntered")
      ? <div className="mb-5">
                <div className="mb-3">
          New password
          <div className="mb-5">
          <input 
            className="bg-blue-50" 
            type="password" 
            placeholder="Enter new password"
            onChange={(event) => setParamsState({...paramsState, password: event.target.value})}></input>
          {errState === "password" && ' ❌' }
          </div>
        </div>
          <button onClick={afterReset}>Submit</button>
        </div>
      : null}

      <div className="mt-12">
        Back to <span className="text-blue-500 cursor-pointer" onClick={() => setModalState('Login')}>login</span>
      </div>

    </>
  )

}

export default ForgotPassword