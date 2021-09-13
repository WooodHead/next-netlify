import API from '@aws-amplify/api'
import '../configureAmplify'
import Head from 'next/head'
import NavbarComp from '../components/navbar/navbar'
import UserComp from '../components/[id]/userComp'
import { NotionAPI } from 'notion-client'
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
  // console.log(user)
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
  const getAllUsersRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUsers", {})
  const paths = getAllUsersRes.map(user => {
    return { params: { id: user.username } }
  })
  return {
    paths,
    fallback: "blocking"
  }
}
export async function getStaticProps({ params }) {
  console.log('getstatic props params', params) // why am i getting <no source> for username in get user
  try {
    const notion = new NotionAPI()
    const getUserInit = { body: { username: params.id } }
    const getUser = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUser", getUserInit)
    const TAVS = []
    getUser.deviceInput.text && TAVS.push("📝")
    getUser.deviceInput.audio && TAVS.push("📞")
    getUser.deviceInput.video && TAVS.push("📹")
    getUser.deviceInput.screen && TAVS.push("💻")



    const topics = await Promise.all(getUser.topics.map( async (topicObj) => {
      
      let header = null
      let titleURL = null
      if (topicObj.notion) {
        let recordMap = await notion.getPage(topicObj.topicId)
          Object.values(recordMap.block).forEach((block) => {
            //@ts-ignore
            if (block.value.parent_table === "space") {
              //@ts-ignore
              header = block.value.properties.title[0][0]
              console.log('notion hit, header:', header)
              const sanitized = header.replace(/[_$&+,:;=?[\]@#|{}'<>.^*()%!/\\]/g, "")
              titleURL = sanitized.replaceAll(' ', '-')
            }
          })
          let topic = {
            topicId: topicObj.topicId,
            title: header,
            titleURL: titleURL,
            description: topicObj.description,
            firstImage: topicObj.firstImage,
            lastSave: topicObj.lastSave,
            // recordMap: recordMap
          }
          console.log("TOPI!!!!!!!!!!!!!!!,", topic)
          // console.log(topic)
          return topic
        
      } else {
        return topicObj
      }
      
    }))

    console.log('topics', topics)
    const user = {
      Username: getUser.username,
      active: getUser.active,
      busy: getUser.busy,
      ppm: getUser.ppm,
      TAVS: TAVS,
      publicString: getUser.publicString,
      topics: topics,
      receiver: getUser.receiver,
      image: getUser.userImg,
    }
    return getUser.username ? { props: { user: user }, revalidate: 1 } : { notFound: true }
  } catch (err) {
    // console.log(err)
    return { notFound: true }
  }
}