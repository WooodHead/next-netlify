import React from 'react'
import { API, Auth } from 'aws-amplify'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function PublicString(props) {
  const publicStringState = props.publicStringState
  const setPublicStringState = (e) => props.setPublicStringState(e)

  const publicTypingFn = (e) => {
    setPublicStringState({...publicStringState, quill: e, saved: false})
  }
  const onClosePublicEdit = async () => {
    try {
      const userSession = await Auth.currentAuthenticatedUser()
      const getUserInit = { headers: { Authorization: userSession.attributes.preferred_username } }
      const getAllUserRes = await API.get(process.env.apiGateway.NAME, "/users", getUserInit)
      const userResString = getAllUserRes.Item.publicString.S
      setPublicStringState({ ...publicStringState, string: userResString, editing: false, saved: false })
    } catch (err) {
      setPublicStringState({ ...publicStringState, editing: false, saved: false })
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
          string: `` + publicStringState.quill
        }
      }
      const savedString = await API.post(process.env.apiGateway.NAME, '/saveStrings', stringInit)
      setPublicStringState({ ...publicStringState, string: savedString.body, saved: true })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div>
      {publicStringState.editing

        ? <div>
          <ReactQuill value={publicStringState.quill} onChange={publicTypingFn} />
          <button className='btn' onClick={onClosePublicEdit} >close</button>
          <button onClick={savePublicString} >save</button>
          {publicStringState.saved && <div className=""><div>saved</div></div>}
        </div>

        : <div className="my-3" >
          <div>
            <div className="mx-3 my-3" dangerouslySetInnerHTML={{ __html: publicStringState.string }} ></div>
          </div>
          <div>
            <button onClick={() => setPublicStringState({ ...publicStringState, editing: true })} >
              edit
            </button>
          </div>
        </div>

      }
    </div>

  )
}