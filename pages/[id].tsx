
import API from '@aws-amplify/api'
import '../configureAmplify'
import Head from 'next/head'
import NavbarComp from '../components/navbar/navbar'
import UserComp from '../components/[id]/userComp'

export interface User {
  Username: string
  active: boolean
  busy: boolean
  ppm: number
  TAVS: string[]
  publicString: string
  topicString: string
  topics: any[]
  receiver: boolean
  image: string
  [key: string]: any
}

export default function User({ user }: User) {

  const description = user.publicString
  return (
    <>
      <Head>
        <title>{user.Username}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta property="og:image" content="/favicon512"></meta>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {/* <NavbarComp /> */}
      <UserComp user={user} />
   </>
  )
}

export async function getStaticPaths() {
  const allUsersInit = { headers: { Authorization: "all" } }
  const getAllUsersRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", allUsersInit)
  const paths = getAllUsersRes.body.Items.map(user => {
    return { params: { id: user.Username.S } }
  })
  return {
    paths,
    fallback: "blocking"
  }
}

export async function getStaticProps({ params }) {
  try {
    const getUserInit = { body: { username: params.id } }
    const getUser = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUser", getUserInit)
    const TAVS = []
    getUser.deviceInput.text && TAVS.push("📝")
    getUser.deviceInput.audio && TAVS.push("📞")
    getUser.deviceInput.video && TAVS.push("📹")
    getUser.deviceInput.screen && TAVS.push("💻")
    const user = {
      Username: getUser.username,
      active: getUser.active,
      busy: getUser.busy,
      ppm: getUser.ppm,
      TAVS: TAVS,
      publicString: getUser.publicString,
      topics: getUser.topics,
      receiver: getUser.receiver,
      image: getUser.userImg,
    }  
    return getUser.username ? { props: { user: user }, revalidate: 1 } : { notFound: true}
  } catch (err) {
    console.log(err)
    return { notFound: true }
  }

}