import { useRouter } from 'next/router'
import Link from 'next/link'
import AboutMessage from '../about/aboutMessage'
import Head from 'next/head'

export default function About({
  seeExample,
  signUp
}: {
  seeExample: () => void,
  signUp: () => void
}) {
  const router = useRouter()

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
      <div className="flex justify-center text-5xl" >Share</div>
      <div className="flex mt-20">{/* 1st row */}

        <div className="flex-1"></div>

        <div className="flex-col justify-center hidden md:flex">
          <div className="px-4 my-6 text-xl">
            <div>Show off what you know</div>
            Create a page with <a className="text-blue-500 underline focus:text-blue-700" href="https://notion.so">Notion.so</a>
          </div>
        </div>

        <div className="flex flex-1"></div>

        <div className="px-4">
          <div className="border">
          <img src="/myNotionPage.png" ></img>
          </div>
          <div className="md:hidden">
          <div className="my-6 text-xl ">
            <div>Show off what you know</div>
            Create a page with <a className="text-blue-500 underline focus:text-blue-700" href="https://notion.so">Notion.so</a>
          </div>
        </div>
        </div>
        

        <div className="flex-1"></div>

      </div>


      <div className="flex mt-20"> {/* 2nd row */}

        <div className="flex-1"></div>

        <div className="flex-col">
          <div className="flex flex-row my-6">
            <div className="flex flex-col justify-center px-4">
              <img className="border" src="/shareToWeb.png"></img>
              <div className="md:hidden">
              <div className="mt-10 text-xl">Then copy and paste your Notion URL to Talktree</div>
          <div className="flex flex-row mt-5">
            <input className="px-3 mr-3 border shadow" placeholder="notionPageId or URL"></input>
            <button onClick={signUp} className="mr-3" >Add notion page</button>
            </div>
          </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1"></div>

        <div className="flex-col justify-center hidden md:flex">
          <div className="text-xl">Then copy and paste your Notion URL to Talktree</div>
          <div className="flex flex-row mt-5">
            <input className="px-3 mr-3 border shadow" placeholder="notionPageId or URL"></input>
            <button onClick={signUp} className="mr-3 bg-white" >Add notion page</button>
          </div>
          
          <div className="flex flex-row m-5">
          <button className="bg-white" onClick={signUp}>Sign Up</button>
          </div>
          
          <div></div>
        </div>

        <div className="flex-1"></div>

      </div>

      <div className="flex px-4 mt-20"> {/* 3rd row */}

        <div className="flex-1"></div>

        <div className="flex flex-col justify-center ">
          <div className="hidden my-6 md:flex">
            <div className="flex flex-col justify-center text-xl">
              <div className="pr-10">Your page and all the child pages are rendered as static HTML optimized for search engines.</div>
              <Link href="/geoff-young"><a className="mt-3 text-blue-400 underline">Example</a></Link>
              <div className="mt-5">Talktree automatically updates your page when it gets changed in Notion.</div>
            </div>
          </div>
        </div>

        <div className="flex flex-1"></div>

        <div className="">
          <img className="border" src="/renderedNotion.png"></img>
          <div className="flex flex-row my-6 md:hidden">
            <div className="flex flex-col justify-center text-xl">
              <div className="">Your page and all the child pages are rendered as static HTML optimized for search engines.</div>
              <Link href="/geoff-young"><a className="mt-3 text-blue-400 underline">Example</a></Link>
              <div className="mt-5">Talktree automatically updates your page when it gets changed in Notion.</div>
            </div>
          </div>
        </div>

        <div className="flex-1"></div>

      </div>
      <div className="">
     


        <div className="flex my-20"> {/* SHARE row 3 */}

          <div className="flex-1"></div>

          <div className="flex-col px-4 ">
            <img className="border" src="/chatWindow.png"></img>
            <div className="flex flex-col justify-center my-6 md:hidden">
            <div className="text-xl">Help others directly by receiving calls through the browser</div>
            <div className="flex flex-row my-6">
              <div className="flex flex-col justify-center px-4">
                <div>    <div className="mb-5 bg-white"><button onClick={signUp} >Receive calls</button></div><div>
                  {deviceInputs.map((device) => <CustomCheckbox key={device} TAVS={device} />)}
                </div></div>
              </div>
            </div>
          </div>
          </div>

          <div className="flex flex-1">

          </div>

          <div className="flex-col justify-center hidden md:flex">
            <div className="text-xl">Help others directly by receiving calls through the browser</div>
            <div className="flex flex-row my-6">
              <div className="flex flex-col justify-center px-4">
                <div>    <div className="mb-5 bg-white"><button onClick={signUp} >Receive calls</button></div><div>
                  {deviceInputs.map((device) => <CustomCheckbox key={device} TAVS={device} />)}
                </div></div>
              </div>
            </div>
          </div>

          <div className="flex-1"></div>

        </div>


        <div>
          <div className="flex justify-center mx-5 text-5xl">Sell</div>
        </div>

        <div className="flex mt-20"> {/* SELL row 1 */}

          <div className="flex-1"></div>

          <div className="flex-col">
            <div className="flex flex-row my-6">
              <div className="flex flex-col justify-center px-4">
                <div className="text-xl">Helping too many people? Charge money to talk with you</div>
              </div>
            </div>
          </div>

          <div className="flex flex-1">

          </div>

          <div className="mt-5 text-xl" >
            $ <input
              style={{ width: "65px", borderStyle: "solid" }}
              type="number"
              step="0.01"
              min="0.17"
              max="5"
              defaultValue={0.17} />
            <span className="text-sm" > per minute</span>
          </div>

          <div className="flex-1"></div>

        </div>
        <div className="flex my-20 "> {/* SELL row 2 */}

          <div className="flex-1"></div>

          <div className="flex-col">
            <div className="flex flex-row my-6">
              <div className="flex flex-col justify-center px-4">
                <div>$ <input
                  className="text-xl"
                  style={{ width: "65px", borderStyle: "solid" }}
                  type="number"
                  step="0.01"
                  min="0.17"
                  max="5"
                  defaultValue={5.25} /><button className="ml-3 bg-white">Leave tip</button></div>
              </div>
            </div>
          </div>

          <div className="flex flex-1">

          </div>

          <div className="text-xl">
            Or just make money receiving tips
          </div>

          <div className="flex-1"></div>
        </div>

        <div className="flex justify-center pt-10 pb-40 mx-5">
          <div>
          <button onClick={signUp} className="text-3xl bg-white">Sign Up</button>
          <div className="mt-3">Talktree is still in beta</div>
          </div>
         
          
        </div>

      </div>

    </>
  )
}