import AboutComp from "../components/about/aboutComp"
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function About() {
  const router = useRouter()
  const goToUserPage = () => {
    router.push(`/geoff-young`)
  }
  const DemoUser = () => {

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
  const UserCard = () => {
    return (
      <div
        className="flex p-2 mx-5 my-5 bg-gray-100 cursor-pointer hover:bg-gray-200"
        onClick={goToUserPage}
      >
        <img className="" width="100" height="100" src="https://d31kifv93uudih.cloudfront.net/eyJidWNrZXQiOiJ0dDMtczMtcHJvZC1pbWFnZXNidWNrZXQtODBncWJxbmMwNDJhIiwia2V5IjoicHVibGljLzk2YWI4ZDhkLWE3ZmQtNDI4NC05MzRhLWI4MzEzYmE3M2I4Ni5qcGciLCJlZGl0cyI6eyJzbWFydENyb3AiOnsicGFkZGluZyI6MjQwfSwicmVzaXplIjp7IndpZHRoIjoxMDAsImhlaWdodCI6MTAwLCJmaXQiOiJjb3ZlciJ9fX0=" ></img>

        <div className="mx-4 my-2">
          <Link href={`/geoff-young`} >
            <a>geoff-young</a>
          </Link>
          <div>
            📝📞📹💻
          </div>

        </div>
        <div className="flex-1 max-w-2xl">
              Next.js, Tailwind, Opentok, Amplify, Stripe, AWS, Serverless Stack
            </div>
        <div>

        </div>
      </div>)
  }

  return (
    <>
      <div className="flex">
        <div className="flex-1 bg-gray-400">

        </div>
        <div className="flex-col">

          <div className="flex flex-row">
            <div className="flex-col m-10">
              <div className="flex">
                Find a user that is available.
              </div>
              <div>There's only me right now</div>
            </div>

            <div className="flex">

            </div>

            <div className="flex justify-center">
              {/* <DemoUser /> */}
              <UserCard />
            </div>
          </div>
          <div className="flex flex-row">

            <div className="flex">

            </div>
          </div>

        </div>
        <div className="flex-1 bg-gray-400">

        </div>
      </div>

    </>
  )
}