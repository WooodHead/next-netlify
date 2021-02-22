import React, { useEffect, useState } from "react";
import Link from 'next/link'
import '../../configureAmplify'
import { Auth } from "aws-amplify"

const NavbarComp = props => {
  const [usernameState, setUsernameState] = useState()

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
        <nav className="flex flex-row mx-5">
          <div className="mx-5 my-1">
            <Link href="/users">
              <a>Users</a>
            </Link>
          </div>
          <div className="mx-5 my-1">
            <Link href={ loggedIn ? "/user#" : "/newPage" }>
              <a>Create a page</a>
            </Link>
          </div>
          <div className="mx-5 my-1">
            <Link href="/phone">
              <a>Phone</a>
            </Link>
          </div>
          <div className="mx-5 my-1">
            <Link href="/questionmark"><a>?</a></Link>
          </div>
          <div className="mx-5 my-1">
            {usernameState ? 
              <Link href="/account">{usernameState}</Link> : 
              <Link href="/signIn">Login / Sign Up</Link>}
          </div>
        </nav>
    )
}

export default NavbarComp;