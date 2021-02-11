import React from "react";
import Link from 'next/link'

const NavbarComp = props => {

    return (
        <nav className="flex flex-row mx-5">
          <div className="mx-5 my-1">
            <Link href="/users">
              <a>Users</a>
            </Link>
          </div>
          <div className="mx-5 my-1">
            <Link href="/">
              <a>Folders</a>
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
            {props.userName ? 
              <Link href="/account"></Link> : 
              <Link href="/signIn">Login / Sign Up</Link>}
          </div>
        </nav>
    )
}

export default NavbarComp;