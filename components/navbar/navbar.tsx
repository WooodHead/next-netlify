import React, { useContext, useEffect, useState } from "react";
import Link from 'next/link'
import '../../configureAmplify'
import Auth from '@aws-amplify/auth'
import Modal from './modal'
import { useRouter } from 'next/router'
// import Context from '../../pages/_app'

const NavbarComp = ({ auth, username }) => {
  const router = useRouter()
  // const shit = useContext(Context)

  const [modalState, setModalState] = useState(null)
  
  return (
    <nav className="flex flex-row">
      <div className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 ">
        <Link href="/browse">
          <a>Browse</a>
        </Link>
      </div>
      <div className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 ">
        <Link href={
          username 
          ? `/${username}`
          : auth 
          ? `/yourPage` 
          : router.asPath === "/" 
          ? "/#about" 
          : "/" 
        }>
          <a>{auth ? "Your page" : "What is Talktree?"}</a>
        </Link>
      </div>
      {auth
        ? <div className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 ">
            <Link href="/account">
              <a>Account</a>
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