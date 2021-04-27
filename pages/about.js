import { useState } from 'react'
import PrivacyPolicy from '../components/about/privacyPolicy'
import TermsOfService from '../components/about/termsOfService'
import Navbar from '../components/navbar/navbar'
export default function About() {
  const [state, setState] = useState({
    TOS: false,
    PP: false
  })
  return (
    <>
      <Navbar />
      <div className="m-10">
        <div className="max-w-prose">This site combines blogging with direct communication. 
        Sign up, receive calls, and charge a price as low as $0.17/per minute to talk to you; 
        text, audio, video, or screensharing. You decide whats allowed. Write a blog under your page
        to get found or give out your number.
        </div>
        <div className="mt-5">This website is in beta</div>
        <div>email geoff@talktree.me or call <a href="/6779991/call" >talktree.me/6779991</a></div>
        <div className="mt-5">
          <button onClick={() => setState({ PP: false, TOS: !state.TOS })} >Terms of Service</button>
          <button onClick={() => setState({ TOS: false, PP: !state.PP })} >Privacy Policy</button>
          {state.TOS && <TermsOfService />}
          {state.PP && <PrivacyPolicy />}
        </div>
      </div>

    </>
  )
}