import API from '@aws-amplify/api'
import "tailwindcss/tailwind.css"
import '../styles/globals.css'
import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Auth from '@aws-amplify/auth'
import NavbarComp from "../components/navbar/navbar"

// export const Context = createContext(state)

function Application({ Component, pageProps }) {
  const router = useRouter()

  const [state, setState] = useState({
    auth: false,
    username: null
  })



  useEffect(() => {
    (async () => {
      try {
        const isAuth = await Auth.currentCredentials()
        if (isAuth.authenticated) {
          try {
            const self = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/getSelf', {})
            setState({ ...state, auth: true, username: self.username })
          } catch {
            setState({ ...state, auth: true})
          }
        }
      } catch {  }
    })()
  }, [])

  return (router.pathname === "/[id]/review" || router.pathname === "/[id]/message")
    ? <Component {...pageProps} />
    : <>
    {/* <Context.Provider value={Context}> */}
      <NavbarComp {...state} />
      <Component {...pageProps} />
      {/* </Context.Provider> */}
    </>
}

export default Application
