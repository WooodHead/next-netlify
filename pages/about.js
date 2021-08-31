import AboutComp from "../components/about/aboutComp"
import { useRouter } from 'next/router'
import Link from 'next/link'
import AboutMessage from '../components/about/aboutMessage'
import Head from 'next/head'
import AboutBlog from '../components/about/aboutBlog'

export default function About() {
  const router = useRouter()

  const goToUserPage = () => {
    router.push(`/geoff-young`)
  }
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

  const DemoUser = () => {
    return (
      <div className="">
        <div onClick={goToUserPage} className="cursor-pointer">
          <img width="100" height="100" src="https://d31kifv93uudih.cloudfront.net/eyJidWNrZXQiOiJ0dDMtczMtcHJvZC1pbWFnZXNidWNrZXQtODBncWJxbmMwNDJhIiwia2V5IjoicHVibGljLzk2YWI4ZDhkLWE3ZmQtNDI4NC05MzRhLWI4MzEzYmE3M2I4Ni5qcGciLCJlZGl0cyI6eyJzbWFydENyb3AiOnsicGFkZGluZyI6MjQwfSwicmVzaXplIjp7IndpZHRoIjoxMDAsImhlaWdodCI6MTAwLCJmaXQiOiJjb3ZlciJ9fX0=" ></img>
          <h3 className='mx-5 mt-5 '>geoff-young</h3>
          <div className='mx-5 mb-3'>📝📞📹💻</div>
          <span className="p-2 text-xs">🟢   available</span>
        </div>

        <div className="justify-center ">
          <button className="w-24" type="button" onClick={openMessagePhone}>message</button>
        </div>

        <div className="m-2 text-sm">$0 / minute</div>

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
        className="flex p-2 pr-3 my-5 bg-gray-100 shadow-md cursor-pointer hover:bg-gray-200"
        onClick={goToUserPage}
      >
        {/* <img className="" width="100" height="100" src="https://d31kifv93uudih.cloudfront.net/eyJidWNrZXQiOiJ0dDMtczMtcHJvZC1pbWFnZXNidWNrZXQtODBncWJxbmMwNDJhIiwia2V5IjoicHVibGljLzk2YWI4ZDhkLWE3ZmQtNDI4NC05MzRhLWI4MzEzYmE3M2I4Ni5qcGciLCJlZGl0cyI6eyJzbWFydENyb3AiOnsicGFkZGluZyI6MjQwfSwicmVzaXplIjp7IndpZHRoIjoxMDAsImhlaWdodCI6MTAwLCJmaXQiOiJjb3ZlciJ9fX0=" ></img> */}

        <div className="mx-3 my-2">
          <Link href={`/geoff-young`} >
            <a>geoff-young</a>
          </Link>
          <div>
            📝📞📹💻
          </div>
          <span className="p-2 text-xs">🟢 available</span>

        </div>
        <div className="flex-1 max-w-2xl py-5">
          Next.js, Tailwind, Opentok, Amplify, Stripe, AWS, Serverless Stack
        </div>
        <div>

        </div>
      </div>)
  }

  return (
    <>
      <Head>
        <script src="https://static.opentok.com/v2.20.1/js/opentok.min.js"></script>
      </Head>
      <div className="flex justify-center mt-20 text-3xl" >Find, share, or sell knowledge</div>
      <div className="flex mt-20">{/* 1st row */}

        <div className="flex-1"></div>

        <div className="flex-col">
          <div className="flex flex-row my-6">
            <div className="flex flex-col justify-center px-4">
              <div className="flex">Find a user that is available.</div>
              <div>There's only me right now.</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1">

        </div>

        <div className="">
          <UserCard />
        </div>

        <div className="flex-1"></div>

      </div>

      <div className="flex mt-32"> {/* 2nd row */}

        <div className="flex-1"></div>

        <div className="flex-col">
          <div className="flex flex-row my-6">
            <div className="flex flex-col justify-center px-4">
              <DemoUser />
            </div>
          </div>
        </div>

        <div className="flex flex-1">

        </div>

        <div>
          <div>If you click my face or the button above, you'll find my blog posts and message button.</div>

          <div>Notice the emojis - I'm available to text, voice and video chat, as well as screenshare.</div>
          <div></div>
        </div>

        <div className="flex-1"></div>

      </div>

      <div className="flex mt-20"> {/* 3rd row */}

        <div className="flex-1"></div>

        <div className="flex-col">
          <div className="flex flex-row my-6">
            <div className="flex flex-col justify-center px-4">
              <div>You can message whenever</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1">

        </div>

        <div>
          <AboutMessage />
        </div>

        <div className="flex-1"></div>

      </div>

      <div className="flex justify-center my-20 ">
        <div className="flex flex-col">
          <div className="text-3xl">Share what you know by creating your own page</div>
          <div className="flex flex-row justify-center mt-3">
            <button>Signup</button>
          </div>

        </div>
      </div>

      <div className="flex mt-20"> {/* SHARE row 1 */}

        <div className="flex-1"></div>

        <div className="flex-col">
          <div className="flex flex-row my-6">
            <div className="flex flex-col justify-center px-4">
              <textarea value="I think I'm an excellent bike mechanic; also decent at JavaScript and React"></textarea>

            </div>
          </div>
        </div>

        <div className="flex flex-1">

        </div>

        <div>
          <div>You can write out your expertise</div>
        </div>

        <div className="flex-1"></div>

      </div>

      <div className="flex mt-20"> {/* SHARE row 2 */}

        <div className="flex-1"></div>

        <div className="flex-col">
          <div className="flex flex-row my-6">
            <div className="flex flex-col justify-center px-4">
              <div>And make blog posts to catch Google search traffic</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1">

        </div>

        <div>
          <AboutBlog />
        </div>

        <div className="flex-1"></div>
      </div>

      <div className="flex my-20"> {/* SHARE row 3 */}

        <div className="flex-1"></div>

        <div className="flex-col">
          <div className="flex flex-row my-6">
            <div className="flex flex-col justify-center px-4">
              <div>-------available-------TAVS-------------</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1">

        </div>

        <div>
          <div >Set your availability, what devices you'll allow, and receive calls</div>
        </div>

        <div className="flex-1"></div>

      </div>

      <div>
        <div className="flex justify-center text-3xl">Sell your expertise by connecting with Stripe</div>
      </div>
      <div className="flex mt-20"> {/* SELL row 1 */}

        <div className="flex-1"></div>

        <div className="flex-col">
          <div className="flex flex-row my-6">
            <div className="flex flex-col justify-center px-4">
              <div>And make blog posts to catch Google search traffic</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1">

        </div>

        <div>

        </div>

        <div className="flex-1"></div>

      </div>

    </>
  )
}