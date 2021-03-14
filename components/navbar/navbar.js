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

  const pages = [
    { href: "/users", text: 'Users' },
    { href: usernameState ? "/account/edit" : "/newPage",
      text: usernameState ? 'Edit your page' : 'Create a page' },
    { href: '/phone', text: 'Phone' },
    // { href: '/questionmark', text: '?' },
    { href: usernameState ? '/account': '/signIn',
      text: usernameState ? usernameState : 'Login / Sign Up'}
  ]

  const loggedIn = false
  return (
    <nav className="flex flex-row mx-5">
      {pages.map((page) =>
        <div key={page.href} className="mx-5 my-1 py-1 px-2 rounded hover:bg-gray-200">
          <Link href={page.href}>
            <a>{page.text}</a>
          </Link>
        </div>)}
    </nav>
  )
}

export default NavbarComp;