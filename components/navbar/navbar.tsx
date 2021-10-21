import React, { useContext, useEffect, useState } from "react";
import Link from 'next/link'
import '../../configureAmplify'
import { useRouter } from 'next/router'
import { AuthContext } from "../../utils/context";

const NavbarComp = () => {
  const router = useRouter()
  const context = useContext(AuthContext)
  const auth = context.auth
  console.log('ait', auth)
  console.log(typeof(auth))

  // const [modalState, setModalState] = useState(null)

  return (
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
  )
}

export default NavbarComp;