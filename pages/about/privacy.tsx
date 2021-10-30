import Navbar from '../../components/navbar/navbar'
import Link from 'next/link'
import AboutComp from '../../components/about/aboutComp'

export default function Privacy() {
  return (
    <>
      <AboutComp />
      <div className="mx-10">
      <div className="mt-3 text-lg font-semibold">
        Privacy Policy
      </div>
      <div className="mb-3">
      Last updated: July 29, 2021
      </div>
      <div>
        Talktree LLC is committed to protecting the privacy and accuracy of confidential information to 
        the extent possible, subject to provisions of state and federal law. 
        Other than as required by law, or in response to subpoenas that authorize access, 
        personal information is not actively shared.
        In particular, we do not re-distribute or sell personal information collected on our web servers.
      </div>
      <div className="mt-3 text-lg">
        Information collected
      </div>
      <div>
        <div>IP address</div>
        <div>web pages requested </div>
        <div>referring web page </div>
        <div>browser used </div>
        <div>date and time</div>
      </div>
      <div>Talktree LLC does not associate this data to individual user identities</div>
      <div className="mt-3 tet-lg" >
        Cookies
      </div>
      <div>
        The only cookies used on this site are used for processing payments via Stripe. The processing of cards is governed
        by Stripe&apos;s conditions https://stripe.com/ie/privacy. Talktree LLC does not collect or process your your credit or debit card. 
      </div>
      <div className="mt-3 text-lg" >
      Data
      </div>
      <div>
        Talktree LLC has no access to any data transmitted between users via the in-website phone; this includes text, audio, video,
        and screensharing conversations. Talktree does has access to data such as call time, duration, users involved, topic, and selected
        device. Tokbox, a Vonage company, is our data processor, which has no knowledge of the customer&apos;s end users; they process all in-website
         phone conversations: text, video, audio, and screenshare. See their privacy statement here https://www.vonage.com/legal/privacy-policy/.
      </div>
      <div className="mt-3 text-lg">
        How information is collected
      </div>
      <div>
        Talktree LLC uses forms on this site. These forms require users to give e-mail and name if required.
        Contact information from the registration form is used only to send material relating to the purpose for which
        it was collected and will not be sold to another party.
      </div>
      <div className="mt-3 text-lg">
        Use of collected information
      </div>
      <div>Talktree LLC will only use personal information collected from this site for the purpose of 
        communication back to individuals who contact us via the site.</div>
        <div>Talktree LLC uses browser-IP-address information and anonymous-browser history to report 
          information about site accesses and for profiling purposes. This information is used 
          to improve Web presentation and utilization. IP address information may also be used for 
          troubleshooting purposes.</div>
          <div className="mt-3 text-lg">
        Distribution of collected information
      </div>
      <div>Talktree LLC will not disclose, without your consent, personal information collected 
        about you, except for certain explicit circumstances in which disclosure is required by law.</div>
        <div>Talktree LLC will not distribute or sell personal information to third-party
           organizations.</div>
           <div className="mt-3 text-lg">
        {/* Contact: */}
      </div>
      {/* <div>You can e-mail me at geoff@talktree.me</div> */}
    </div>
    </>
  )
}