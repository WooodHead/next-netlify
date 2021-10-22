import API from '@aws-amplify/api'
import { withSSRContext } from 'aws-amplify'
import '../configureAmplify'
import Head from 'next/head'
import IdNotion from '../components/[id]/idNotion'
import { NotionAPI } from 'notion-client'
import { getNotionPage, getNotionPages } from '../components/[id]/getNotionRecord'
import UploadNotionComponent from '../components/account/uploadNotionComponent'

export interface User {
  Username: string
  // active: boolean
  // busy: boolean
  // ppm: number
  // receiver: boolean
  notionId: string
  [key: string]: any
}
export default function User({ user }: User) {
  console.log(user)
  return (
    <>
      <Head>
        <title>{user.Username}</title>
        {/* <meta name="description" content={} /> */}
        <link rel="icon" href="/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta property="og:image" content="/favicon512"></meta>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {user.notionDetails 
      ? <IdNotion 
        user={user}
        recordMap={user.notionDetails.recordMap}
      /> 
      : <UploadNotionComponent />
      }
    </>
  )
}
export async function getStaticPaths() {
  const paths = []
  try {
    const SSR = withSSRContext()
    const getAllUsersRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUsers", {})
    getAllUsersRes.forEach(user => {
      paths.push({ params: { id: user.username } }) 
    })
    console.log(paths)
  } catch (err) {
  }

    return {
      paths,
      fallback: "blocking"
    }

}

export async function getStaticProps({ params }) {
  try {
    const getUserInit = { body: { username: params.id } }
    const getUser = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUser", getUserInit)
    console.log(getUser)
    const notionDetails = getUser.notionId ? await getNotionPage(getUser.notionId) : null
    const user = {
      Username: getUser.username,
      // active: getUser.active,
      // busy: getUser.busy,
      // ppm: getUser.ppm,
      // receiver: getUser.receiver,
      notionDetails: notionDetails
    }
    console.log('getstaticprops', user)

    return getUser.username ? { props: { user: user }, revalidate: 1 } : { notFound: true }
  } catch (err) {
    console.log(err)
    return { notFound: true }
  }
}
