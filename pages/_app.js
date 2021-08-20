import "tailwindcss/tailwind.css"
import '../styles/globals.css'
// import { useEffect } from 'react'
import { useRouter } from 'next/router'
// import * as ga from '../lib/index'
// import Router from 'next/router'
import NavbarComp from "../components/navbar/navbar"

function Application({ Component, pageProps }) {
  const router = useRouter()

  // useEffect(() => {
  //   const handleRouteChange = (url) => {
  //     ga.pageview(url)
  //   }
  //   //When the component is mounted, subscribe to router changes
  //   //and log those page views
  //   router.events.on('routeChangeComplete', handleRouteChange)

  //   // If the component is unmounted, unsubscribe
  //   // from the event with the `off` method
  //   return () => {
  //     router.events.off('routeChangeComplete', handleRouteChange)
  //   }
  // }, [router.events])

//   useEffect(() => {
//     const handleRouteChange = (url) => GTMPageView(url);
//     router.events.on('routeChangeComplete', handleRouteChange);
//     return () => {
//         router.events.off('routeChangeComplete', handleRouteChange);
//     };
// }, []);

  return (router.pathname === "/[id]/review" || router.pathname ==="/[id]/message")
  ? <Component {...pageProps} />
    : <>< NavbarComp /><Component {...pageProps} /></> 
}

export default Application
