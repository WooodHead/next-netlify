import React, { useContext, useEffect, useState } from "react";
import Link from 'next/link'
import '../../configureAmplify'
import { useRouter } from 'next/router'
import { AuthContext } from "../../utils/context";
import Auth from '@aws-amplify/auth'

const NavbarComp = ({ auth }) => {
  const router = useRouter()
  // const context = useContext(AuthContext)
  // const auth = context.auth

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       const userAccount = await Auth.currentAuthenticatedUser()
  //       // console.log(userAccount)
  //       // setUsernameState(userAccount.username)
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   })()
  // }, [])

  // const [modalState, setModalState] = useState(null)

  return (
    // <div className="flex">
    //   <div className="flex-1"></div>
    <nav className="flex flex-row">
      <div className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 ">
        <Link href="/browse">
          <a>Browse</a>
        </Link>
      </div>
      <div className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 ">
        <Link href={
          typeof(auth) === 'string'
            ? `/${auth}`
            : auth
              ? `/yourPage`
              : router.asPath === "/"
                ? "/#about"
                : "/"
        }>
          <a>{auth ? "Your page" : "What is Talktree?"}</a>
        </Link>
      </div>
      <div className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 ">
        <Link href="/account">
          <a>{auth ? "Account" : "Login  /  Sign up"}</a>
        </Link>
      </div>


    </nav>
    // <div className="flex-1"></div>
    // </div>
  )
}

export default NavbarComp;