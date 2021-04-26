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
        <div>This website is in beta</div>
        <div>email geoff@talktree.me</div>
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