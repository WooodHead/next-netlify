import API from '@aws-amplify/api'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function CommentComp (props) {
  // const [textAreaState, setTextAreaState] = useState(" Didn't like it? Leave some feedback")
  // const router = useRouter()
  // const { id, topic } = router.query
  const user = props.user
  const userActive = user.active
  // const submitHandler = async () => {
  //   const submitCommentParams = {
  //     body: { receiver: '' + id, comment: '' + textAreaState, topic: topic },
  //   }
  //   try {
  //     const leaveCommentRes = await API.post(process.env.apiGateway.NAME, '/leaveComment', submitCommentParams)
  //   } catch (err) {
  //     console.log(err)
  //   }
  // }

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
  const openMessagePhone = () => {
    const devSite = `/${user.Username}/message`
    const prodSite = `https://talktree.me/${user.Username}/message`
    const currentSite = process.env.STAGE === 'prod' ? prodSite : devSite
    window.open(
      currentSite,
      "MsgWindow",
      "width=500,height=700"
    )
  }

  return (
    <div className="flex flex-col">
      <div className="text-lg flex font-bold mt-10 justify-center" >Still need help?</div>
      {userActive ? <div>🟢 I'm online</div> : <div>🔴 I'm offline</div>}
      <div className="flex justify-center mt-3 mb-2">
          <button className="w-24 mb-12" type="button" onClick={openMessagePhone}>Message me</button>
        </div>
        {/* <div className='justify-center flex'>{user.TAVS}</div> */}
        {user.ppm > 0 
          && <div className="flex justify-center mb-10 mt-2">${user.ppm} / minute</div>
        }
      {/* <button></button> */}
      {/* <textarea 
      onChange={(e) => setTextAreaState(e)} 
      className="w-screen md:w-full resize overflow-auto" 
      rows="3" 
      cols="40"
      defaultValue={textAreaState}></textarea>
      <div className="flex justify-center">
      <button onClick={submitHandler} className="">submit</button>
      </div> */}
    </div>
  )
}