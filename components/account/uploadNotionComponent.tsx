import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import { useEffect, useRef, useState } from 'react'
import { parsePageId } from 'notion-utils'
import CustomSpinner from '../custom/spinner'
import { useRouter } from 'next/router'
// import '../../configureAmplify'

const UploadNotionComponent = () => {

  const notionRef = useRef(null)

  const [state, setState] = useState({
    isUser: null,
    returnUri: null,
    loading: false
  })

  const router = useRouter()

  const saveNotionId = async () => {
    setState({...state, loading: true})
    const parsedId = notionRef.current.value ? parsePageId(notionRef.current.value) : null
    let username = ''
    try {
      // const userSession = await Auth.currentSession()
      // console.log(userSession)
      // const userAuth = await Auth.currentAuthenticatedUser()
      // console.log(userAuth)
      // username = userAuth.username
      const saveNotionInit = {
        // headers: { Authorization: userSession.getIdToken().getJwtToken() },
        body: {
          notionId: parsedId,
        }
      }
      const notionRes = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/saveNotionId', saveNotionInit)
      console.log(notionRes)
      router.push(username)

    } catch (err) { console.log(err) }
    
  }

  return (
       <div className="flex justify-center m-8">
        <div className="flex-col">

          <div className="flex flex-row">
            <input type="text" className="px-3 mr-3 border shadow" ref={notionRef} placeholder="notionPageId or URL"></input>
            <button className="mr-3" onClick={saveNotionId}>Add notion page</button>
            {state.loading && <CustomSpinner />}
          </div>
        </div>
      </div>
  )
}

export default UploadNotionComponent