
import React, { useContext, useEffect, useState, } from 'react'
import API from '@aws-amplify/api'
import '../configureAmplify'
import LoginComponent from '../components/account/loginComponent'
import AccountSettings from '../components/account/accountSettings'
import Settings from '../components/account/settings'
import { AuthContext } from '../utils/context'
import Auth from '@aws-amplify/auth'

const Account = () => {

  const context = useContext(AuthContext)

  return (
    <>
    { context.auth ? <Settings /> : <LoginComponent /> }
    </>
  )
}

export default Account