import React, { useEffect, useState } from "react";
import Link from 'next/link'
import '../../configureAmplify'
import Auth from '@aws-amplify/auth'
import Modal from './modal'
import { useRouter } from 'next/router'

const NavbarComp = props => {
  const router = useRouter()
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
      <div className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 ">
        <Link href="/browse">
          <a>Browse</a>
        </Link>
      </div>
      <div className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 ">
        <Link href={usernameState ? `/${usernameState}` : router.asPath === "/" ? "/#about" : "/" }>
          <a>{usernameState ? "Your page" : "What is Talktree?"}</a>
        </Link>
      </div>
      {usernameState && <div className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 ">
        <Link href="/receiver">
          <a>Receive calls</a>
        </Link>
      </div>}
      {usernameState
        ? <div className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 ">
            <Link href="/account">
              <a>{usernameState}</a>
            </Link>
          </div>
        : <div className="flex flex-row">
            <div className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 ">
              <div onClick={() => setModalState("Login")} className="cursor-pointer">
                Login
              </div>
            </div>
            <div className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 ">
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