import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import { useEffect, useRef, useState } from 'react'
import { parsePageId } from 'notion-utils'
import CustomSpinner from '../custom/spinner'
import { useRouter } from 'next/router'

const AddNotionComponent = ({ user }) => {
  const notionExists = user.notionDetails?.recordMap

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
    try {
      const userSession = await Auth.currentSession()
      const saveNotionInit = {
        headers: { Authorization: userSession.getIdToken().getJwtToken() },
        body: {
          notionId: notionRef.current.value,
          deleted: false
        }
      }
      const notionRes = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/saveNotionId', saveNotionInit)

    } catch {}

  }

  const isOwnPage = async () => {
    try {
      const userAuth = await Auth.currentAuthenticatedUser()
      if (user.Username === userAuth.username) {
        setState({ ...state, isUser: userAuth.username })
      }
    } catch {}
  }
  const talktreeReturnUrl = process.env.NEXT_PUBLIC_STAGE === "dev"
    ? "http://localhost:3000/" + state.isUser
    : "https://talktree.me/" + state.isUser

  useEffect(() => {
    isOwnPage()
  }, [])

  // const notionURL = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${process.env.NEXT_PUBLIC_NOTION_CLIENT_ID}&response_type=code&state=${talktreeReturnUrl}`

  return (
    state.isUser
      ? <div className="flex justify-center m-8">
        {/* <a href={notionURL}>Add to Notion</a> */}
        <div className="flex-col">

          <div className="flex flex-row">
            <input className="px-3 mr-3 border shadow" ref={notionRef} placeholder="notionPageId or URL"></input>
            <button className="mr-3" onClick={saveNotionId}>{notionExists ? "Change notion page" : "Add notion page"}</button>
            {state.loading && <CustomSpinner />}
          </div>

          {!notionExists 
          && <div>
            <div className="mt-10 mb-3">Create a page with <a className="text-blue-400 underline" href="https://notion.so">Notion.so</a></div>
            <div className="mb-1">Then in Notion share it to the web; copy and paste the url above.</div>
            <img className="border" src="/shareToWeb.png"></img>
            </div>
          }
        </div>
      </div> : null
  )
}

export default AddNotionComponent