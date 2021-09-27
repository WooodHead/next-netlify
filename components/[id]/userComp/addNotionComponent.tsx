import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import { useEffect, useRef, useState } from 'react'

  const AddNotionComponent = (props) => {
    const user = props.user

    const notionRef = useRef(null)

    const [state, setState] = useState({
      isUser: null,
      returnUri: null
    })

    const saveNotionId = async () => {
      const userSession = await Auth.currentSession()
      console.log(notionRef.current.value)
      const saveNotionInit = {
        headers: { Authorization: userSession.getIdToken().getJwtToken() },
        body: {
          notionId: notionRef.current.value,
          deleted: false
        }
      }
      await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/saveDeleteNotion', saveNotionInit)
    }

    const isOwnPage = async () => {
      try {
        const userAuth = await Auth.currentAuthenticatedUser()
        console.log(userAuth)
        if (user.Username === userAuth.username) {
          setState({...state, isUser: userAuth.username})
        }
      } catch (err) {
        console.log(err)
      }
    }
    const talktreeReturnUrl = process.env.NEXT_PUBLIC_STAGE === "dev" 
      ? "http://localhost:3000/" + state.isUser
      : "https://talktree.me/" + state.isUser

    useEffect(() => {
      isOwnPage()
    }, [])

    const notionURL = `https://api.notion.com/v1/oauth/authorize?owner=user&client_id=${process.env.NEXT_PUBLIC_NOTION_CLIENT_ID}&response_type=code&state=${talktreeReturnUrl}`
    console.log(notionURL)

    return (
      state.isUser 
      ? <div className="m-8">
        <a href={notionURL}>Add to Notion</a>
        <input ref={notionRef} placeholder="notionPageId">
        </input>
        <button onClick={saveNotionId}>add notion page</button>
      </div> : null
    )
  }

  export default AddNotionComponent