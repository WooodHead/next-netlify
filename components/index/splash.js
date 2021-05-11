import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import API from '@aws-amplify/api'
import { useRef } from 'react'

export default function SplashPage() {
  const emailRef = useRef()

  const emailUpdatesHandler = async (e) => {
    e.preventDefault()
    const submitEmailParams = {
      body: { receiver: '6779991', comment: '' + emailRef.current.value, topic: 'email' },
    }
    try {
      await API.post(process.env.apiGateway.NAME, '/leaveComment', submitEmailParams)
      emailRef.current.value = ''
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <Head>
        <title>Talktree</title>
        <meta name="description" content="Ask an expert on demand" />
      </Head>
      <div className="mx-20 my-5">
        <h1 className="text-5xl my-10">Talk to an expert immediately</h1>

        <div className="text-2xl">Talktree is a platform for experts to pick up your call when you need it</div>
        <div className="mt-10 mb-5">Select one of the available experts in the Users tab</div>
        <img width="421" src="/with677.png" alt="Talktree example users list"></img>
        <div className="mt-10 mb-5">Press call to open the call options
      </div>

        <div><img src="/callButtonPPM.png" alt="Talktree call menu"></img></div>
        <div className="mb-5 mt-10">Select how you'd like to talk with them</div>
        <img src="/17ppm.png" ></img>
        {/* <div>Talk for as little or as long as you'd like</div>
      <div><img src="screenChat.png" ></img></div> */}
        <div className="mt-14 mb-5 text-5xl">Want to be an expert?</div>
        <span className="underline" ><Link href="/signIn">Sign up</Link></span>
        <span> - That's it, you can now start receiving calls</span>
        <div className="mt-5"><img src="/phone.png" alt="Talktree phone receiver" ></img></div>
        <div className="mb-5 mt-3">You'll get an e-mail to open your phone when someone is calling you, alternatively if you open the web phone you can receieve notifications</div>
        <h2 className="mt-10 mb-3">Nobody wants to call? Start blogging with our SEO optimized editor and get found on Google</h2>
        <div><img src="/editor.png" alt="Talktree blog editor"></img></div>
        <div className="mt-10 mb-3">Create or connect your Stripe account and charge by the minute</div>
        <div><img src="/settings.png" ></img></div>
        <div className="mt-3" >Don't want people to see or hear you? Uncheck your contact options</div>
        <div className="mt-10">This website is still in Beta, want to know when it's updated? Leave your e-mail</div>
        <form onSubmit={emailUpdatesHandler} >
          <input type="text" ref={emailRef} className="border"></input>
        </form>
        <div className="mt-10 mb-20">
          <Link className="" href="/6779991/How-to-upload-images-to-S3-using-Quill,-React,-and-Amplify">
            <button>check out my page / give me a call</button>
          </Link>
        </div>
        <img src="/favicon512.png"></img>
      </div>
    </>
  )
}