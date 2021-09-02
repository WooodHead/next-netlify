import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import API from '@aws-amplify/api'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Modal from '../navbar/modal'

export default function SplashPage() {
  const emailRef = useRef()
  const router = useRouter()
  const [modalState, setModalState] = useState(null)

  const userButtonClick = () => {
    router.push('/geoff-young')
  }
  const signUpClick = () => {
    setModalState("Sign Up")
  }

  return (
    <>
      <Head>
        <title>Talktree</title>
        <meta name="description" content="Ask an expert on demand" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="talktree.me" />
        <meta property="twitter:url" content="https://talktree.me" />
        <meta name="twitter:title" content="Talktree" />
        <meta name="twitter:description" content="Ask an expert on demand" />
        <meta name="twitter:image" content="https://talktree.me/1200x630.png" />
      </Head>
      <div className="flex flex-row">
        <div className="flex-1">

        </div>
        <div className="flex-col flex-initial max-w-3xl mx-10 my-20">
          <div className="text-5xl ">Get unstuck now. 1:1 help, on demand.</div>
          {/* <button className="m-5" onClick={userButtonClick}>See a member</button> */}
          <div className="mt-20">Or become a member. Charge as little as $0.17/minute</div>
          <button className="m-5" onClick={signUpClick}>Sign Up</button>
        </div>
        {/* <div className="flex-1 hidden md:flex lg:flex xl:flex 2xl:flex">

        </div> */}
        <div className="hidden my-20 text-5xl md:flex-1 lg:grid xl:grid 2xl:grid">
          <div className="max-w-sm"><img src="/favicon512.png"></img></div>
        </div>
        <div className="flex-1">

        </div>
      </div>
      {modalState ? <Modal setModalState={setModalState} modalState={modalState} /> : null}
    </>
  )
}