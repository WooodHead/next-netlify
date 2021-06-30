import Link from 'next/link'
import React from 'react'

export default function UserCompId(props) {

  const user = props.user

  const openCallPhone = () => {
    const devSite = `/${user.Username}/call`
    const prodSite = `https://talktree.me/${user.Username}/call`
    const currentSite = process.env.NEXT_PUBLIC_STAGE === 'prod' ? prodSite : devSite
    window.open(
      currentSite,
      "MsgWindow",
      "width=500,height=700"
    )
  }
  const openReviewPhone = () => {
    const devSite = `/${user.Username}/review`
    const prodSite = `https://talktree.me/${user.Username}/review`
    const currentSite = process.env.NEXT_PUBLIC_STAGE === 'prod' ? prodSite : devSite
    window.open(
      currentSite,
      "MsgWindow",
      "width=500,height=700"
    )
  }

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

  const UserComponentTop = () => {
    return (
      <div className="flex m-5 mb-10 md:hidden">
        <div className="flex-shrink-0">
          {user.image && <img src={user.image} ></img>}
        </div>

        <div className="flex flex-col">
          <h3 className='mx-5 mt-5'>{user.Username}</h3>
          <div className='mx-5 mb-3'>{user.TAVS}</div>
          {user.ppm > 0 && <div className='mx-5 mb-3'>{'$' + user.ppm}</div>}
          <button type="button" onClick={openCallPhone}>call</button>
          {user.receiver && <button className="mt-3" type="button" onClick={openReviewPhone}>donate</button>}
          {user.ppm > 0 && <div className="m-2 text-md">${user.ppm} / minute</div>}
        </div>
        <div>
          {user.publicString}
        </div>
      </div>
    )
  }

  const UserComponentSide = () => {
    return (
      <div className="flex-col hidden mt-10 md:flex lg:flex xl:flex 2xl:flex">
        {user.image && <img src={user.image} ></img>}
        <h3 className='mx-5 mt-5'>{user.Username}</h3>
        <div className='mx-5 mb-3'>{user.TAVS}</div>
        {/* <div className='mx-5 mb-3'>{'$' + user.ppm}</div> */}
        <button type="button" onClick={openCallPhone}>call</button>
        {user.receiver && <button className="mt-3" type="button" onClick={openReviewPhone}>donate</button>}
        {user.ppm > 0 && <div className="m-2 text-md">${user.ppm} / minute</div>}
      </div>

    )
  }

  return (
    <div className="mx-5">
      <div className="flex flex-row my-5 bg-gray-100">
        <div className="flex-1">
          <div className="flex justify-center">
          <UserComponentSide />
          </div>
        </div>
        <div className="flex my-3" >
          <div className="bg-gray-100" >
            <UserComponentTop />
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