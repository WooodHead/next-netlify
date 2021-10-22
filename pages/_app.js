import API from '@aws-amplify/api'
import "tailwindcss/tailwind.css"
import '../styles/globals.css'
import { createContext, memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Auth from '@aws-amplify/auth'
import NavbarComp from "../components/navbar/navbar"
import { AuthContext, UsernameContext, Context } from '../utils/context'

// export const Context = createContext(state)

function Application({ Component, pageProps }) {
  const router = useRouter()

  const [authState, setAuthState] = useState(false?? '')
  const [notionState, setNotionState] = useState(null)
  // const [usernameState, setUsernameState] = useState(null)
  // const [state, setState] = useState({
  //   auth: false?? '',
  //   notionId: null
  // })

  console.log('APP render!', authState)
  const modifyState = (e) => {
    setState({...state, ...e})
  }

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await Auth.currentCredentials()
        if (isAuth.authenticated) {
          // setAuthState(true)
          try {
            const self = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/getSelf', {})
            // setUsernameState(self.username)
            setAuthState(self.username)
            // setState({ ...state, auth: true, username: self.username })
          } catch {
            setAuthState(true)
            // setState({ ...state, auth: true})
          }
        }
      } catch { setAuthState(false) }
    })()
  }, [])

  // const MemoizedComp = memo((pageProps2) => {
  //   return <Component {...pageProps2} />
  // })

  return (router.pathname === "/[id]/review" || router.pathname === "/[id]/message")
    ? <Component {...pageProps} />
    : <>
    <AuthContext.Provider value={{ auth: authState, setAuthState: setAuthState}}>
    {/* <UsernameContext.Provider value={{username: usernameState, setUsernameState: (e) => setUsernameState(e)}}> */}
      <NavbarComp />
      <Component {...pageProps}/>
      {/* </UsernameContext.Provider> */}
      </AuthContext.Provider>
    </>
}

export default Application
