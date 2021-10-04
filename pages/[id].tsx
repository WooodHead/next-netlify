import API from '@aws-amplify/api'
import '../configureAmplify'
import Head from 'next/head'
import IdNotion from '../components/[id]/idNotion'
import { NotionAPI } from 'notion-client'
import { getNotionPage, getNotionPages } from '../components/[id]/getNotionRecord'

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
      {user.notionDetails && <IdNotion 
            user={user}
            recordMap={user.notionDetails.recordMap}
      /> }
    </>
  )
}
export async function getStaticPaths() {
  try {
    const getAllUsersRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUsers", {})
    const paths = getAllUsersRes.map(user => {
      return { params: { id: user.username } }
    })
    return {
      paths,
      fallback: "blocking"
    }
  } catch (err) {
    console.log(err)
  }
}
export async function getStaticProps({ params }) {
  try {
    const notion = new NotionAPI()
    const getUserInit = { body: { username: params.id } }
    const getUser = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUser", getUserInit)
    const TAVS = []
    getUser.deviceInput.text && TAVS.push("📝")
    getUser.deviceInput.audio && TAVS.push("📞")
    getUser.deviceInput.video && TAVS.push("📹")
    getUser.deviceInput.screen && TAVS.push("💻")
    const notionDetails = getUser.notionId ? await getNotionPage(getUser.notionId) : null
    // const deleteThis = getUser.notionId ? await getNotionPages(getUser.notionId) : null
    const user = {
      Username: getUser.username,
      active: getUser.active,
      busy: getUser.busy,
      ppm: getUser.ppm,
      TAVS: TAVS,
      receiver: getUser.receiver,
      image: getUser.userImg,
      notionDetails: notionDetails
    }
    return getUser.username ? { props: { user: user }, revalidate: 1 } : { notFound: true }
  } catch (err) {
    console.log(err)
    return { notFound: true }
  }
}
