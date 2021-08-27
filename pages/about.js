import AboutComp from "../components/about/aboutComp"
import { useRouter } from 'next/router'
export default function About() {

  const DemoUser = () => {

    const router = useRouter()

    const openMessagePhone = () => {
      const devSite = `/gt2/message`
      const prodSite = `https://talktree.me/geoff-young/message`
      const currentSite = process.env.NEXT_PUBLIC_STAGE === 'prod' ? prodSite : devSite
      window.open(
        currentSite,
        "MsgWindow",
        "width=500,height=700"
      )
    }
    const goToUserPage = () => {
      router.push(`/geoff-young`)
    }

    return (
      <div >
        <div onClick={goToUserPage} className="cursor-pointer">
          <img width="100" height="100" src="https://d31kifv93uudih.cloudfront.net/eyJidWNrZXQiOiJ0dDMtczMtcHJvZC1pbWFnZXNidWNrZXQtODBncWJxbmMwNDJhIiwia2V5IjoicHVibGljLzk2YWI4ZDhkLWE3ZmQtNDI4NC05MzRhLWI4MzEzYmE3M2I4Ni5qcGciLCJlZGl0cyI6eyJzbWFydENyb3AiOnsicGFkZGluZyI6MjQwfSwicmVzaXplIjp7IndpZHRoIjoxMDAsImhlaWdodCI6MTAwLCJmaXQiOiJjb3ZlciJ9fX0=" ></img>
          <h3 className='mx-5 mt-5 '>geoff-young</h3>
          <div className='mx-5 mb-3'>📝📞📹💻</div>
          <span className="p-2 text-xs">🟢   available</span>
        </div>

        <div className="justify-center ">
          <button className="w-24" type="button" onClick={openMessagePhone}>message</button>
        </div>

          <div className="m-2 text-md">$0 / minute</div>
        
        <div className="max-w-xs my-3 text-xs" >
          {/* {user.publicString} */}
          <div className="bg-gray-100" ></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex">
        <div className="flex-1 bg-gray-400">
          hello
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row">
            <div className="flex">
              Find a user that is 🟢 available
            </div>
            <div>theres only me right now</div>
            <div className="flex">
    <DemoUser />
            </div>
            <div>
              hello2
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex">
              They could be free, or cost money. The rate is the price per minute to talk with them.
            </div>
            <div className="flex">
              The message button opens up a text chat. You can turn on audio, video, and screenshare.
            </div>
            <div className="flex">

            </div>
          </div>

        </div>
        <div className="flex-1 bg-gray-400">
          hello
        </div>
      </div>
      <AboutComp />
    </>
  )
}