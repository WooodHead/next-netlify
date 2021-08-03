import NavbarComp from "../navbar/navbar"
import Link from 'next/link'

export default function AboutComp() {
  return (
    <>
    <NavbarComp />
      <div className="m-10">
        <div className="max-w-prose">
        Talktree is a platform for on demand communication. 
        Users can make and receive messages through the web app.
        Text, audio, video, and screenshare.
        Create an account and charge a price as low as $0.17/per minute to talk to you.
        </div>
        <div className="mt-5">This website is in beta</div>
        <div>Email geoff@Talktree.me or <a href="/geoff-young" >Talktree.me/geoff-young</a></div>
        <div className="mt-5">
          
          <Link href="tos">
          <button className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 ">
            Terms of Service
            </button>
          </Link>
          
          
          <Link href="privacy">
          <button className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 " >
            Privacy Policy
            </button>
            </Link>
          
        </div>
      </div>
      </>
  )
}