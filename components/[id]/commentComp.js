import API from '@aws-amplify/api'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function CommentComp () {
  const [textAreaState, setTextAreaState] = useState(" Should I use more photos or add more text?   Submit your advice, it won't be displayed publicly")
  const router = useRouter()
  const { id, topic } = router.query
  console.log(topic)

  const submitHandler = async () => {
    console.log(textAreaState)
    const submitCommentParams = {
      body: { receiver: '' + id, comment: '' + textAreaState, topic: topic },
    }
    try {
      const leaveCommentRes = await API.post(process.env.apiGateway.NAME, '/leaveComment', submitCommentParams)
      console.log(leaveCommentRes)
    } catch (err) {
      console.log(err)
    }

  }

  return (
    <div className="flex flex-col">
      <textarea 
      onChange={(e) => setTextAreaState(e)} 
      className="resize overflowE-auto" 
      rows="4" 
      cols="60"
      defaultValue={textAreaState}></textarea>
      <div className="flex justify-center">
      <button onClick={submitHandler} className="">submit</button>
      </div>
    </div>
  )
}