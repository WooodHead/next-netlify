import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import SideUserIsland from './[topic]/sideUserIsland'
import TopUserIsland from './[topic]/topUserIsland'
import { User } from '../../pages/[id]'

export default function UserCompId(props) {
  // : { user: {
  //   Username: string,
  //   active: boolean,
  //   busy: boolean,
  //   ppm: number,
  //   TAVS: string[],
  //   publicString: string,
  //   topicString: string,
  //   topics: any[],
  //   receiver: boolean,
  //   image: string
  // }}
  
  const user = props.user
  console.log(user)
  const router = useRouter()
  const topicClick = (urlProp) => {
    router.push("/" + user.Username + "/" + urlProp)
  }
  return (
      <div className="flex my-5 bg-gray-100">

          <div className="flex justify-center flex-1 mt-10">
            <SideUserIsland user={user} />
          </div>

        <div className="flex my-3" >
          <div className="bg-gray-100">
            <TopUserIsland user={user} />
            {(user.topics).map((topicObj) => (
              <div
                key={topicObj.topicId}
                className="max-w-3xl px-2 py-1 my-3 rounded shadow-md cursor-pointer mx-7 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
                onClick={() => topicClick(topicObj.titleURL ? topicObj.titleURL : topicObj.title)}
              >
                <div className="flex flex-row">
                  <div className="flex-shrink-0">
                    {topicObj.firstImage 
                    && <img width={100} height={100} src={topicObj.firstImage}></img>
                    }
                  </div>
                  <div className="flex-col ml-3 ">
                    <Link href={topicObj.titleURL 
                      ? "/" + user.Username + "/" + topicObj.titleURL 
                      : "/" + user.Username + "/" + topicObj.title}>
                      <a className="font-semibold sm:text-2xl">{topicObj.title}</a>
                    </Link>

                    <div>{topicObj.description}</div>
                  </div>
                </div>
                {/* <a className="px-2 py-1 mx-2 font-semibold rounded shadow-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75">
                  <div>{topicObj.title}</div>
                  {topicObj.description}
                </a> */}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1"></div>
      </div>
  )
}