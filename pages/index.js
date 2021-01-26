import Head from 'next/head'
import Header from '@components/Header'
import Footer from '@components/Footer'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const goToUsers = () => {
    router.push('/users')
  }
  return (
    <div className="container">
      <Head>
        <title>Next.js Starter!</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header title="hello" />
        <p className="description" onClick={goToUsers}>
          See all users here
        </p>
      </main>

      <Footer />
    </div>
  )
}
