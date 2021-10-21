import API from '@aws-amplify/api'
import { useEffect, useRef, useState } from 'react'
import { normalizeTitle, parsePageId } from 'notion-utils'
import { useRouter } from 'next/router'

export default function YourPage() {
  const [state, setState] = useState({
    hasUsername: false,
    hasNotion: false
  })
  const [usernameInputState, setUsernameInputState] = useState(null)
  const notionInputRef = useRef(null)
  const router = useRouter()

  const setUserNameFn = (username) => {
    // const sanitized = username.replace(/[_$&+,:";=?\\[\]@#|{}'<>.^*()%!/]/g, "")
    const sanitized = normalizeTitle(username)
    setUsernameInputState(sanitized)
  }

  const getUser = async () => {
    try {
      const self = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/getSelf', {})
      setState({ ...state, hasUsername: self.username, hasNotion: self.notionId })
      self.username && self.notionId && router.push(`/${self.username}`)
      console.log('self', self)
    } catch {
      console.log('no self')
    }
  }

  const submitUsername = async () => {
    const usernameInit = {
      body: { username: usernameInputState }
    }
    try {
      const saveUser = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/saveUsername', usernameInit)
      console.log(saveUser)
    } catch (err) {
      console.log(err)
    }
  }
  const submitNotion = async () => {
    
    const notionInit = {
      body: { notionId: parsePageId(notionInputRef.current.value) }
    }
    try {
      const saveNotion = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/saveNotionId', notionInit)
      console.log(saveNotion)
      router.push('')
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <>
      <div className="flex justify-center">
        <div className="flex-col mt-40">
          { !state.hasUsername ? <div>
            <div className="m-5">Start by creating your page name</div>
            <input className="outline-black" onChange={(e) => setUserNameFn(e.target.value)} onSubmit={submitUsername} >
            </input>
            <div>talktree.me/{usernameInputState}</div>
            <button onClick={submitUsername}>Submit</button>
          </div>
          : !state.hasNotion && <div>
            <div className="m-5">Connect your Notion Page</div>
            <input className="outline-black" ref={notionInputRef} onSubmit={submitNotion} >
            </input>
            <button onClick={submitNotion}>Submit</button>
          </div>}

        </div>
      </div>
    </>
  )
}