import React from 'react'
import '../configureAmplify'
import dynamic from 'next/dynamic'
// const SignIn = dynamic(() => import('../components/signIn/signIn'),{ ssr: false })
import SignIn from '../components/signIn/signIn'
import Footer from '../components/navbar/footer'

export default function Auth() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
      <SignIn />
      </div>
      <Footer />
    </div>
  )
}