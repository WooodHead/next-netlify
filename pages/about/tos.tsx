import NavbarComp from "../../components/navbar/navbar"
import About from "../../components/about/aboutComp"

export default function Tos() {
  return (
    <>
    <About />
    <div className="mx-10">
      <div className="mt-3 text-lg font-semibold">Terms of Service</div>
      <div className="mtb-1">
      Last updated: Aug 13, 2021
      </div>
      <div className="mt-3 text-lg" >Acceptance of Terms of Service</div>
      <div>By using the Talktree platform, you agree to the following Terms of Service and Privacy Policy, if you do not agree to
        these terms, do not use or visit Talktree.me
      </div>
      <div className="mt-3 text-lg">Privacy</div>
      <div>To access paid features of this site, you are required to provide certain details. It is a condition of this
      site that the information you provide is correct.</div>
      <div className="mt-3 text-lg">Authorized Users</div>
      <div>If you are under age 18, you may only use the services with the consent of your parent or legal guardian. Please be 
        sure your parent or legal guardian has read and discussed these terms with you.</div>
      <div className="mt-3 text-lg">User Submissions</div>
      <div>Talktree does not claim ownership of any information provided by you whatsoever. ALL INFORMATION PROVIDED BY USERS
      IS FOR THE PURPOSE OF GENERAL DISCUSSION AND CONSULTING. The content provided is not verified; reliance on such content is to be used 
      at your own risk. ANY PAID COMMUNICATION IS SUBJECT TO STRIPE&apos;S RESTRICTED BUSINESSES, https://stripe.com/restricted-businesses.
      Failure to comply with these rules will result in suspension or deactivation of the user account.
      </div>
      <div className="mt-3 text-lg">Topics / Posts</div>
      <div>All submitted topics can be removed by Talktree at any time for any reason</div>
      <div className="mt-3 text-lg">Payments and Billing</div>
      <div>All prices denoted in USD. Users are responsible for the payment of all charges in connection with paid calls. The calculation of charges is dependent on the
        agreed upon price per minute, multiplied by the amount of minutes, with seconds rounded up to the nearest minute. E.G. A call lasting
        3 minutes and 1 second, will be billed for 4 minutes. Upon making a paid call, you agree to the price per minute as displayed on screen
         before the call is made. Charges are immediatly initiated after the call has ended. Charges will be made directly from caller to receiver enabled through
        Stripe. Talktree LLC receives $0.02 + 1% of every transaction on the Talktree platform, this is subject to change. Stripe fees are $0.30 + 2.9% per transaction.
        Charges are final and non-refundable, unless 
        otherwise determined by Talktree LLC. Talktree reserves the right to remove or revise charges for any transaction. Charges
        shall not exceed $520.32 or be less than $0.50 per transaction. 
      </div>
      <div className="mt-3 text-lg">Payouts</div>
      <div>SELLERS/CONSULTANTS, IE USERS SOLICITING THEIR TIME IN EXCHANGE FOR MONEY THROUGH THE TALKTREE PLATFORM ARE NOT GUARANTEED THEIR ASKED COMPENSATION.
        Any loss, or percieved loss of compensation is to be expected and in no way will Talktree LLC be held liable. Lack of compensation
        can be due to payments declining, or Talktree LLC voiding the transaction due to a breach of Terms of Service. The received money can be less than the asked
         compensation, this is usually about $0.01 every $20.00.
        Minimum compensation is $0.17 per minute, the maximum is $20 per minute. Consultants are responsible for paying any and all taxes which may apply.
        ANY TRANSACTION THAT FAILS TO MEET STRIPE&apos;S RESTRICTED BUSINESSES POLICY WILL BE VOIDED, see https://stripe.com/restricted-businesses.
      </div>
      <div className="mt-3 text-lg">Consultants</div>
      <div>CONSULTANTS MAY NOT BE IN THE BUSINESS OF ADVERTISING REGARDLESS OF COMPENSATION. </div>
      <div className="mt-3 text-lg">Ratings</div>
      <div>
        Users have the ability to rate sellers/consultants. This rating is reflected from a number 1, bad, through 9, good. This rating
        is to be treated with great skepticism as the number may not accurately reflect the quality of the consulting. DO NOT MAKE ANY PAID CALL
        WITH THE EXPECTATION OF ADEQUATE CONSULTING OR ACCURATE INFORMATION. While it is in Talktree&apos;s best interest for the ratings to be accurate, 
        the ratings are still susceptible to manipulation.
      </div>
      <div className="mt-3 text-lg">Copyright Infringement</div>
      <div>Any violation of copyright law will result in the offending user&apos;s account to be suspended. If you believe a user is in 
        violation of copyright law, please provide written notice to geoff@talktree.me
      </div>
      <div className="mt-3 text-lg">Disclaimer of Liability</div>
      <div>Talktree LLC will not be liable for any loss caused as a result of using the website nor is any warranty of any kind provided.
        This includes any loss caused by a deficiency, error, or interruption in the website. It is up to the user to ensure their device 
        works harmoniously with the browser, i.e. make sure audio/video/screensharing/text works in the browser. Talktree will not be 
        liable for any inability of the user&apos;s device to use the requested input (audio/video/screensharing/text).  </div>
      <div className="mt-3 text-lg">Intellectual Property Rights</div>
      {/* <div>You may access the material on this site for your own personal, non-commercial use. You may not reproduce, distribute, modify, download
        or store any of the material on this site.
      </div> */}
      <div className="mt-3 text-lg">Applicable Law</div>
      By using Talktree.me, you agree to any applicable federal and state laws.
      <div className="mt-3 text-lg">Termination of Use</div>
      <div>You may end your legal agreement with Talktree LLC at any time by deactivating your account at talktree.me/accountsettings. Talktree LLC
        reserves the right to suspend or deactivate your account for any reason.
      </div>
      <div className="mt-3 text-lg">Changes to Terms</div>
      <div className="mb-5">These terms shall be revised. Upon any revisions made, an email will be sent to your email address provided to the Talktree platform.
        By continuing to access the site after any revisions have been made, you agree to the revised terms.
      </div>
    </div>
    </>
  )
}
