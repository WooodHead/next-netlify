import React from 'react'
import Link from 'next/link'

export default function SplashPage() {
  return (
    <div className="mx-5 my-5">
      <h1 className="mx-5 my-4 mt-10">create a page, write stuff</h1>
      <h1 className="mx-5 my-4">get found on google</h1>
      <h1 className="mx-5 my-4 mb-10">make money maybe</h1>
      <Link className="mx-5 my-5" href="/6779991">
        <button>see example user</button>
      </Link>
    </div>
  )
}