import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
// import NavbarComp from '../components/navbar/navbar'
import SplashComp from '../components/index/splash'
// import FooterComp from '../components/navbar/footer'
import About from '../components/index/about'

export default function Home() {
//   const router = useRouter()
//   console.log(router.locale)

//   useEffect(()=> {
//     console.log(router)
//     // if (location.hash) {
//     //     let elem = document.getElementById(location.hash.slice(1))
//     //     if (elem) {
//     //         elem.scrollIntoView({behavior: "smooth"})
//     //     }
//     // } else {
//     // window.scrollTo({top:0,left:0, behavior: "smooth"})
//     // }
// }, [])

  return (
    <div className="">
      <Head>
        <title>Talktree</title>
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta property="og:image" content="https://talktree.me/1200x630.png"></meta>
        <link rel="stylesheet" href="//cdn.quilljs.com/1.2.6/quill.snow.css" />
        {/* <script src="https://static.opentok.com/v2.20.1/js/opentok.min.js"></script> */}
      </Head>
        <div className="flex-1">
          <SplashComp />
          <div id="about" >
          <About />
          </div>
          
        </div>
    </div>
  )
}
