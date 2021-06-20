import React, { useEffect, useState } from "react";
import Link from 'next/link'
import '../../configureAmplify'
import Auth from '@aws-amplify/auth'
import Modal from './modal'

const NavbarComp = props => {
  const [usernameState, setUsernameState] = useState(null)
  const [modalState, setModalState] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const userAccount = await Auth.currentAuthenticatedUser()
        setUsernameState(userAccount.username)
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
          <a>{usernameState ? "Your page" : "Create a page"}</a>
        </Link>
      </div>
      <div className="mx-5 my-1 py-1 px-2 rounded hover:bg-gray-200 ">
        <Link href="/phone">
          <a>Phone</a>
        </Link>
      </div>
      {usernameState
        ? <div className="mx-5 my-1 py-1 px-2 rounded hover:bg-gray-200 ">
            <Link href="/account">
              <a>{usernameState}</a>
            </Link>
          </div>
        : <div className="flex flex-row">
            <div className="mx-5 my-1 py-1 px-2 rounded hover:bg-gray-200 ">
              <div onClick={() => setModalState("Login")} className="cursor-pointer">
                Login
              </div>
            </div>
            <div className="mx-5 my-1 py-1 px-2 rounded hover:bg-gray-200 ">
              <div onClick={() => setModalState("Sign Up")} className="cursor-pointer">
                Sign Up
              </div>
            {modalState ? <Modal setModalState={setModalState} modalState={modalState} /> : null}
          </div>
        </div>
      }
    </nav>
  )
}

export default NavbarComp;