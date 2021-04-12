import Head from 'next/head'
import { useRouter } from 'next/router'
import  Link from 'next/link'
import NavbarComp from '../components/navbar/navbar'
import SplashComp from '../components/index/splash'
import FooterComp from '../components/navbar/footer'
export default function Home() {
  
  return (
    <div className="container">
      <Head>
        <title>Talktree</title>
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta property="og:image" content="https://talktree.me/favicon128.png"></meta>
      </Head>

      <div className="flex flex-col min-h-screen">
        <div className="flex-1">
        <NavbarComp />
        <SplashComp />
        </div>
        <FooterComp />    
      </div>
    </div>
  )
}
