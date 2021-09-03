import { useRouter } from 'next/router'
import Link from 'next/link'
import AboutMessage from '../about/aboutMessage'
import Head from 'next/head'
import AboutBlog from '../about/aboutBlog'

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

  const topics = [{
    topicId: 1,
    title: "Retrieve images from S3",
    titleURL: "Retrieve-images-from-S3-using-AWSs-serverless-image-handler",
    firstImage: "https://d31kifv93uudih.cloudfront.net/eyJidWNrZXQiOiJ0dDMtczMtcHJvZC1pbWFnZXNidWNrZXQtODBncWJxbmMwNDJhIiwia2V5IjoicHVibGljL2FiMWU2NjUxLTA0ZWMtNGYwNi04YmJlLTg4MTAyMGY5YzhiMi5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjEwMCwiaGVpZ2h0IjoxMDB9fX0=",
    description: "Using AWS's serverless image handler Cloudformation to easily resize images",
  },
  {
    topicId: 2,
    title: "Prevent Next.js 500 errors",
    titleURL: "Prevent-Nextjs-500-error-with-proper-404-page-configuration",
    firstImage: "https://d31kifv93uudih.cloudfront.net/eyJidWNrZXQiOiJ0dDMtczMtcHJvZC1pbWFnZXNidWNrZXQtODBncWJxbmMwNDJhIiwia2V5IjoicHVibGljL2M5M2Q4NDA2LWRkMTUtNDllZi1iODY0LWIzZmM1ZjkwYzUwNy5wbmciLCJlZGl0cyI6eyJyZXNpemUiOnsid2lkdGgiOjEwMCwiaGVpZ2h0IjoxMDB9fX0=",
    description: "Are you using incremental static regeneration? Is your Google search console indexing 500 error pages?"
  }]

  const DemoUser = () => {
    return (
      <div className="flex flex-row">
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
        </div>

        <div className="max-w-xl">
          {(topics).map((topicObj) => (
            <div
              key={topicObj.topicId}
              className="max-w-3xl px-2 py-1 my-3 rounded shadow-md cursor-pointer mx-7 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
              onClick={() => router.push("/geoff-young/" + topicObj.titleURL)}
            >
              <div className="flex flex-row">
                <div className="flex-shrink-0 overflow-auto">
                  {topicObj.firstImage
                    && <img width={100} height={100} src={topicObj.firstImage}></img>
                  }
                </div>
                <div className="flex-col ml-3 ">
                  <Link href={topicObj.titleURL
                    ? "/geoff-young/" + topicObj.titleURL
                    : "/geoff-young/" + topicObj.title}>
                    <a className="font-semibold sm:text-2xl">{topicObj.title}</a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
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

  const deviceInputs = ['text', 'audio', 'video', 'screen']
  const CustomCheckbox = (CCprops) => (
    <div
      className="ml-3"
      style={{ cursor: "pointer" }}
    // onClick={() => handleCheckboxClick(CCprops)}
    >
      <input
      
        className="mr-1"
        // onChange={null}
        style={{ cursor: "pointer" }}
        type="checkbox"
        defaultChecked={CCprops.TAVS === 'video' ? false : true}
        name={CCprops.TAVS}
        // value="hello"
      />
      {CCprops.TAVS}
    </div>
  )

  return (
    <>
    {/* <div className="flex justify-center mt-20 text-5xl" >What is Talktree?</div> */}
      <div className="flex justify-center mt-20 text-4xl" >Find, share, or sell knowledge</div>
      <div className="flex mt-20">{/* 1st row */}

        <div className="flex-1"></div>

        <div className="flex-col">
          <div className="flex flex-row my-6">
            <div className="flex flex-col justify-center px-4">
              <div className="flex">Find an available user</div>
              {/* <div>There's only me right now.</div> */}
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
          <div>You can read their blog posts or message them for help</div>

          {/* <div>Notice the emojis - I'm available to text, voice and video chat, as well as screenshare.</div> */}
          <div></div>
        </div>

        <div className="flex-1"></div>

      </div>

      <div className="flex mt-12"> {/* 3rd row */}

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
      <div className="bg-gray-100">
      <div className="flex justify-center my-20">
        <div className="flex flex-col">
          <div className="mt-10 text-3xl">Share what you know by creating your own page</div>
          {/* <div className="flex flex-row justify-center mt-3">
            <button className="bg-white">Signup</button>
          </div> */}

        </div>
      </div>
      

      
      <div className="flex mt-20"> {/* SHARE row 1 */}

        <div className="flex-1"></div>

        <div className="flex-col">
          <div className="flex flex-row my-6">
            <div className="flex flex-col justify-center px-4">
              <textarea style={{height: 80}} value="I think I'm an excellent bike mechanic; also decent at JavaScript and React"></textarea>

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
              <div>And make blog posts to catch search traffic</div>
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
              <div>    <div className="mb-5 bg-white"><button>Receive calls</button></div><div>
                {deviceInputs.map((device) => <CustomCheckbox key={device} TAVS={device} />)}
              </div></div>
            </div>
          </div>
        </div>

        <div className="flex flex-1">

        </div>

        <div>
          <div >Receive calls through the browser and set device restrictions</div>
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
              <div>Charge a price per minute to talk with you</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1">

        </div>

        <div>
          <input type="number" defaultValue={40} />
        </div>

        <div className="flex-1"></div>

      </div>
      <div className="flex mt-20"> {/* SELL row 2 */}

        <div className="flex-1"></div>

        <div className="flex-col">
          <div className="flex flex-row my-6">
            <div className="flex flex-col justify-center px-4">
              <div>------------------------tip--------------------</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1">

        </div>

        <div>
          Or just make money receiving tips
        </div>

        <div className="flex-1"></div>
        </div>
      </div>

    </>
  )
}