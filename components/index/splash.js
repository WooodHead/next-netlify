import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import API from '@aws-amplify/api'
import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
// import Modal from '../navbar/modal'
import About from './about'
export default function SplashPage() {
  const emailRef = useRef()
  const router = useRouter()
  // const [modalState, setModalState] = useState(null)

  const userButtonClick = () => {
    router.push('/geoff-young')
  }
  const signUpClick = () => {
    setModalState("Sign Up")
  }

  return (
    <>
      {/* <Head>
        <title>Talktree</title>
        <meta name="description" content="Ask an expert on demand" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="talktree.me" />
        <meta property="twitter:url" content="https://talktree.me" />
        <meta name="twitter:title" content="Talktree" />
        <meta name="twitter:description" content="Ask an expert on demand" />
        <meta name="twitter:image" content="https://talktree.me/1200x630.png" />
      </Head> */}
      <div className="flex flex-row">
        <div className="flex-1">

        </div>
        <div className="flex-col flex-initial max-w-3xl mx-10 my-20">
          <div className="text-5xl ">On demand discussion</div>
          <div className="mt-5 ml-1 text-2xl">Creating the opportunity for meaningful collisions since 2021</div>
        </div>
        <div className="hidden my-20 text-5xl md:flex-1 lg:grid xl:grid 2xl:grid">
          <div className="max-w-sm"><img src="/favicon512.png"></img></div>
        </div>
        <div className="flex-1">

        </div>
      </div>
      <About signUp={signUpClick} seeExample={userButtonClick}/>
      {/* {modalState ? <Modal setModalState={setModalState} modalState={modalState} /> : null} */}
    </>
  )
}