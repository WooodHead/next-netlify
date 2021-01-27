import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import { useRouter } from 'next/router'
import  Link from 'next/link'

export default function Home() {

  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="hello" />
        {/* <p className="description" onClick={goToUsers}>
          See all users here
        </p> */}
        <Link href="/users">
          <a >all users</a>
        </Link>
        
      </main>

      <Footer />
    </div>
  )
}
