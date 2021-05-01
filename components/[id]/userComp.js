import { useState } from 'react'
import Link from 'next/link'
// import CardTip from '../review/cardTip'
export default function UserComp(props) {

  const user = props.user


  const openCallPhone = () => {
    const devSite = `/${user.Username}/call`
    const prodSite = `https://talktree.me/${user.Username}/call`
    const currentSite = process.env.STAGE === 'prod' ? prodSite : devSite
    window.open(
      currentSite,
      "MsgWindow",
      "width=500,height=700"
    )
  }
  const openReviewPhone = () => {
    const devSite = `/${user.Username}/review`
    const prodSite = `https://talktree.me/${user.Username}/review`
    const currentSite = process.env.STAGE === 'prod' ? prodSite : devSite
    window.open(
      currentSite,
      "MsgWindow",
      "width=500,height=700"
    )
  }

  return (
      <div className="mx-5">
        <div className="flex flex-row my-5 bg-gray-100">
          <div className="flex flex-col mx-5 mb-5">
            <h3 className='mx-5 mt-5'>{user.Username}</h3>
            <div className='mx-5 mb-3'>{user.TAVS}</div>
            {/* <div className='mx-5 mb-3'>{'$' + user.ppm}</div> */}
            <button type="button" onClick={openCallPhone}>call</button>
            {user.receiver && <button className="mt-3" type="button" onClick={openReviewPhone}>donate</button>}
          </div>
          <div className="my-3" >
          <div className="my-5 bg-gray-100" dangerouslySetInnerHTML={{ __html: user.publicString }} ></div>
          </div>
        </div>

        <div className="bg-gray-100" >
          {(user.topics).map((topicObj) => {
            return (
              <div key={topicObj.topicId} className="my-3">
              <Link href={"/" + user.Username + "/" + topicObj.title.S}>
                <a className="px-2 py-1 mx-2 font-semibold rounded shadow-md hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75">
                  {topicObj.title.S.replace(/-/g, ' ')}
                </a>
                </Link>
            </div>
            )
          }

          )}
        </div>
      </div>
  )
}