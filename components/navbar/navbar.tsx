import React, { useEffect, useState } from "react";
import Link from 'next/link'
import '../../configureAmplify'
import Auth from '@aws-amplify/auth'
import LoginModal from './logInModal'
import SignUpModal from './signUpModal'

const NavbarComp = props => {
  const [usernameState, setUsernameState] = useState(null)
  const [modalState, setModalState] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const userAccount = await Auth.currentAuthenticatedUser()
        setUsernameState(userAccount.attributes.preferred_username)
      } catch (err) {
        console.log(err)
      }
    })()
  }, [])

  const loggedIn = false
  return (
    <nav className="flex flex-row">
      <div className="mx-5 my-1 py-1 px-2 rounded hover:bg-gray-200 ">
        <Link href="/users">
          <a>Users</a>
        </Link>
      </div>
      <div className="mx-5 my-1 py-1 px-2 rounded hover:bg-gray-200 ">
        <Link href="/account/edit">
          <a>Create a page</a>
        </Link>
      </div>
      <div className="mx-5 my-1 py-1 px-2 rounded hover:bg-gray-200 ">
        <Link href="/phone">
          <a>Phone</a>
        </Link>
      </div>
      <div className="mx-5 my-1 py-1 px-2 rounded hover:bg-gray-200 ">
        <div onClick={() => setModalState("login")} className="cursor-pointer">
          Login
            </div>
      </div>
      <div className="mx-5 my-1 py-1 px-2 rounded hover:bg-gray-200 ">
        <div onClick={() => setModalState("signUp")} className="cursor-pointer">
          Sign Up
      </div>
        {(modalState === "login") ? (
          <LoginModal setModalState={setModalState} />
        ) : (modalState === "signUp") ? (
          <SignUpModal setModalState={setModalState} />
        ) : null}
      </div>

    </nav>
  )
}

export default NavbarComp;