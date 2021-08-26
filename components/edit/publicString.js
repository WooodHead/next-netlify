import React, { useRef } from 'react'
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import '../../configureAmplify'
import dynamic from 'next/dynamic'

export default function PublicString(props) {

  const publicStringState = props.publicStringState
  const textAreaRef = useRef()
  const setPublicStringState = (e) => props.setPublicStringState(e)

  // const publicTypingFn = (e) => {
  //   setPublicStringState({...publicStringState, quill: e, saved: false})
  // }
  const onClosePublicEdit = async () => {
    try {
      const userSession = await Auth.currentSession()
      const idToken = userSession.getIdToken().getJwtToken()
      const getUserInit = { headers: { Authorization: idToken } }
      const getSelf = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getSelfUser", getUserInit)
      const userResString = getSelf.publicString
      setPublicStringState({ string: userResString, editing: false, saved: false })
    } catch (err) {
      setPublicStringState({ editing: false, saved: false })
      console.log(err)
    }
  }
  const savePublicString = async () => {
    try {
      const userSession = await Auth.currentSession()
      const stringInit = {
        headers: { Authorization: userSession.idToken.jwtToken },
        body: {
          stringType: 'publicString',
          string: `` + textAreaRef.current.value,
          accessToken: userSession.accessToken.jwtToken
        }
      }
      const savedString = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/saveStrings', stringInit)
      console.log('savePubStringRes: ', savedString)
      setPublicStringState({ string: savedString, saved: true })
    } catch (err) {
      console.log(err)
    }
  }

  const modules = {
    toolbar:  []
  }
  return (
    <div>
      {publicStringState.editing

        ? <div>
          <div className="mt-3">
          <textarea 
          defaultValue={publicStringState.quill}
          ref={textAreaRef} 
          maxLength="160" 
          className="px-2 py-1.5 overflow-auto resize h-24 w-96 max-w-full bg-gray-50">
          </textarea>
          </div>
          
          {/* <ReactQuill modules={modules} value={publicStringState.quill} onChange={publicTypingFn} /> */}
          <button className='btn' onClick={onClosePublicEdit} >close</button>
          <button onClick={savePublicString} >save</button>
          {publicStringState.saved && <div className=""><div>saved</div></div>}
        </div>

        : <div className="my-3" >
          <div>
            {publicStringState.string}
            {/* <div className="mx-3 my-3" dangerouslySetInnerHTML={{ __html: publicStringState.string }} ></div> */}
          </div>
          <div>
            <button onClick={() => setPublicStringState({ editing: true })} >
              edit
            </button>
          </div>
        </div>

      }
    </div>

  )
}