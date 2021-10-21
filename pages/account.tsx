
import React, { useContext, useEffect, useState, } from 'react'
import API from '@aws-amplify/api'
import '../configureAmplify'
import LoginComponent from '../components/account/loginComponent'
import AccountSettings from '../components/account/accountSettings'
import { AuthContext } from '../utils/context'
import Auth from '@aws-amplify/auth'

const Account = () => {

  const context = useContext(AuthContext)

  // const [state, setState] = useState({
  //   loading: false,
  //   auth: false,
  //   username: null,
  //   notionId: null
  // })

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const isAuth = await Auth.currentCredentials()
  //       isAuth.authenticated && setState({ ...state, auth: true})

  //     } catch {  }
  //   })()
  // },[])

  return (
    <>
    { context.auth ? <AccountSettings /> : <LoginComponent /> }
    </>
  )
}

export default Account