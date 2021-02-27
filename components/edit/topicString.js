import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import { API, Auth } from 'aws-amplify'

export default function TopicString(props) {

  const [editState, setEditState] = useState()
  const [savedState, setSavedState] = useState()
  const [stringState, setStringState] = useState(props.stringState)
  /* seperated string and quill because if quill didn't save, it would appear as if it did when edit closed */
  const [quillState, setQuillState] = useState(props.user.topicString)
  
  const saveString = async () => {
    try {
      const userSession = await Auth.currentSession()
      const stringInit = {
        headers: { Authorization: userSession.idToken.jwtToken },
        body: {
          new: false,
          string: `` + quillState
        }
      }
      const savedString = await API.post(process.env.apiGateway.NAME, '/saveStrings', stringInit )
      setSavedState(true)
      setStringState(savedString.body)
    } catch (err) {
      console.log(err)
    }
  }

  const typingFn = (e) => {
    setQuillState(e)
    setSavedState(false)
  }
  const onCloseEdit = () => {
    setEditState(false)
    setSavedState(false)
  }

  return (
    <div className="my-5 bg-gray-100">
      <div>{props.topicState}</div>
    {editState || props.editProps
      ? <div>
        <ReactQuill value={quillState} onChange={typingFn} />
        <button onClick={onCloseEdit} >close</button>
        <div className="border-2 my-3 mx-3 hover:border-black">
            <button onClick={() => saveString(true)}>
              save
            </button>
        </div>
        {savedState && <div className="">
            <div>
              saved
            </div>
        </div>}
      </div>
      : <div>
          
          <div className="mx-3 my-3" dangerouslySetInnerHTML={{ __html: props.stringState }} ></div>
          <button onClick={() => setEditState(true)}>
            <div className="border-2 my-3 mx-3 hover:border-black">edit</div>
          </button>
          <button onClick={() => props.deleteTopic(props.topicState)}>
        <div className="border-2 my-3 mx-3 hover:border-black">delete</div>
      </button>
      </div>
    }
  </div>
  )
}