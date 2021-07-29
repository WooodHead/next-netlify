import NavbarComp from "../navbar/navbar"
import Link from 'next/link'

export default function AboutComp() {
  return (
    <>
    <NavbarComp />
      <div className="m-10">
        <div className="max-w-prose">This site combines blogging with direct communication. 
        Sign up, receive calls via push notifications, and charge a price as low as $0.17/per minute to talk to you; 
        text, audio, video, or screensharing.
        </div>
        <div className="mt-5">This website is in beta</div>
        <div>Email geoff@Talktree.me or <a href="/geoff-young" >Talktree.me/geoff-young</a></div>
        <div className="mt-5">
          <button className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 ">
          <Link href="tos">Terms of Service</Link>
          </button>
          <button className="px-2 py-1 mx-5 my-1 rounded hover:bg-gray-200 " >
          <Link href="privacy">Privacy Policy</Link>
          </button>
        </div>
      </div>
      </>
  )
}