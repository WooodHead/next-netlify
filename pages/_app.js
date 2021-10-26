import API from '@aws-amplify/api'
import "tailwindcss/tailwind.css"
import '../styles/globals.css'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Auth from '@aws-amplify/auth'
import NavbarComp from "../components/navbar/navbar"
import { AuthContext } from '../utils/context'

function Application({ Component, pageProps }) {
  const router = useRouter()

  const [authState, setAuthState] = useState(false?? '')

  useEffect(() => {
    (async () => {
      try {
        const isAuth = await Auth.currentCredentials()
        if (isAuth.authenticated) {
          try {
            const self = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/getSelf', {})
            setAuthState(self.username)
          } catch {
            setAuthState(true)
          }
        }
      } catch { setAuthState(false) }
    })()
  }, [])

  return (router.pathname === "/[id]/review" || router.pathname === "/[id]/message")
    ? <Component {...pageProps} />
    : <>
    <AuthContext.Provider value={{ auth: authState, setAuthState: setAuthState}}>
      <NavbarComp />
      <Component {...pageProps}/>
      </AuthContext.Provider>
    </>
}

export default Application