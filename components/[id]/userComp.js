import Link from 'next/link'
import React from 'react'
import SideUserIsland from './[topic]/sideUserIsland'
import TopUserIsland from './[topic]/topUserIsland'

export default function UserCompId(props) {

  const user = props.user

  const TopicCard = React.forwardRef(({ onClick, href, topicObj }, ref) => {
    return (
      <div  className="px-2 py-1 mx-2 rounded shadow-md max-w-prose-lg hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75">
        <a href={href} onClick={onClick}>
          <div className="flex flex-row">
            <div className="flex-shrink-0">
              <img src={topicObj.firstImage}></img>
            </div>
            <div className="ml-3">
              <div className="font-semibold sm:text-2xl" >{topicObj.title.replace(/-/g, ' ')}</div>
              <div className="">{topicObj.description}</div>
            </div>
          </div>
        </a>
      </div>
    )
  })

  return (
    <div className="">
      <div className="flex my-5 bg-gray-100">
        <div className="flex-1">
          <div className="flex justify-center mt-10">
            <SideUserIsland user={user} />
          </div>
        </div>
        <div className="flex my-3" >
          <div className="bg-gray-100" >
            <TopUserIsland user={user} />
            {(user.topics).map((topicObj) => (
              <div key={topicObj.topicId} className="my-3">
                <Link href={"/" + user.Username + "/" + topicObj.title} passHref>
                  <TopicCard topicObj={topicObj} />
                  {/* <a className="px-2 py-1 mx-2 font-semibold rounded shadow-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75">
                  <div>{topicObj.title}</div>
                  {topicObj.description}
                </a> */}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1"></div>
      </div>
    </div>
  )
}