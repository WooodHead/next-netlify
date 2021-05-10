import React from 'react'
import Link from 'next/link'
const { PHASE_PRODUCTION_BUILD } = require('next/constants')
import Head from 'next/head'

export default function SplashPage() {
  // const loader = () => {
  //   return "https://d1pvyp5tr4e89i.cloudfront.net/eyJidWNrZXQiOiJ0YWxrdHJlZWltYWdlc3B1YmxpYyIsImtleSI6IjJfMS5qcGciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjEwMjQsImhlaWdodCI6NzY4LCJmaXQiOiJjb3ZlciJ9fX0="
  // }
  const exampleUserUrl = process.env.STAGE === 'prod' ? '/6779991/' : '/9552262/'

  return (
    <>
    <Head>
      <title>Ask an expert</title>
      <meta name="description" content="Free Web tutorials" />
    </Head>
    <div className="mx-20 my-5">
      <h1 className="text-5xl my-10">Talk to an expert immediately</h1>
      
      <div className="text-2xl">Talktree is a platform for experts to pick up your call when you need it</div>
      <div className="mt-10 mb-5">View the list of available experts in the Users tab</div>
      <img width="421" src="/smallerUsers.png" alt="Talktree example users list"></img>
      <div className="text-sm mb-5">( I'm the only one right now )
        {/* <Link href={exampleUserUrl}>
          <button
            className="mx-1 px-1 py-0.5 text-sm rounded shadow-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
          > here</button>
        </Link> */}
      </div>

      <div><img src="/smallCallTest.png" alt="Talktree call menu"></img></div>
      <div>Select how you want to talk to them</div>
      <img src="/callScreen.png" ></img>
      <div>Join the early adopters</div>
      <div>charge a price to talk to you per minute</div>
      <h2 className="">You don't need to be the best to start helping others</h2>
      <div>Become an early adopter, no qualifications necessary</div>
      {/* <h1 className="mx-5 my-4">get found on google</h1>
      <h1 className="mx-5 my-4 mb-10">make money maybe</h1> */}
      <Link className="mx-5 my-5" href="/6779991/How-to-upload-images-to-S3-using-Quill,-React,-and-Amplify">
        <button>see example user</button>
      </Link>
      {/* <Image 
      loader={loader}
      src="/2_1.jpg" alt="testImage" width={1024} height={768} /> */}
    </div>
    </>
  )
}