
import API from '@aws-amplify/api'
import '../configureAmplify'
import Head from 'next/head'
import NavbarComp from '../components/navbar/navbar'
import UserComp from '../components/[id]/userComp'
import ErrorPage from 'next/error'
import { getAmplifyUserAgent } from '@aws-amplify/core'

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
      <NavbarComp />
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
    console.log(params.id)
    const getUserInit = { body: { username: params.id } }
    const getUser = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUser", getUserInit)
    console.log("getUser", getUser)
    // const specificUserInit = { headers: { Authorization: params.id } }
    // const getUserRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", specificUserInit)
    // const userRes = getUserRes.Item
    const TAVS = []
    getUser.deviceInput.text && TAVS.push("📝")
    getUser.deviceInput.audio && TAVS.push("📞")
    getUser.deviceInput.video && TAVS.push("📹")
    getUser.deviceInput.screen && TAVS.push("💻")
    // userRes.deviceInput.M.text.BOOL && TAVS.push("📝")
    // userRes.deviceInput.M.audio.BOOL && TAVS.push("📞")
    // userRes.deviceInput.M.video.BOOL && TAVS.push("📹")
    // userRes.deviceInput.M.screen.BOOL && TAVS.push("💻")
    // const topicsArray = []
    // if (userRes.topics) {
      // for (const [key, topicObj] of Object.entries(userRes.topics.M) as [key:string, topicObj:any]) {
        // if (!topicObj.M.draft.BOOL) {
          // const title = topicObj.M.title.S
          // const titleURL = topicObj.M.titleURL?.S || null
          // const topicString = topicObj.M.string.S
          // const lastSave = topicObj.M.lastSave ? topicObj.M.lastSave.S : null
          // const titleWithSpaces = title.replace(/-/g, ' ')
          // const h2Tag = topicString.match(/<h2>(.+?)<\/h2>/)
          // const description = h2Tag ? h2Tag[1] : null
          // const wholeImgTag = topicString.match(/<img.+?src=".+?cloudfront.net\/(.+?)"/)
          // const wholeURL = wholeImgTag ? wholeImgTag[0].match(/https.+?cloudfront.net\/(.+?)"/) : null
          // const isGif = wholeImgTag ? wholeImgTag[0].match(/gif/) : true
          // let firstImage = null
          // if (!isGif) {
          //   const imgSrc = wholeImgTag ? wholeImgTag[1] : null
          //   const atob = a => Buffer.from(a, 'base64').toString('binary')
          //   const btoa = b => Buffer.from(b).toString('base64')
          //   const converted = JSON.parse(atob(imgSrc))
          //   converted.edits.resize.width = 100
          //   converted.edits.resize.height = 100
          //   const reverted = btoa(JSON.stringify(converted))
          //   firstImage = wholeURL[0].replace(/(https:.+?cloudfront.net\/).+?"/, function(a, b) {
          //     return b + reverted
          //   })
          // }
  
          // topicsArray.push({
          //   topicId: key,
          //   title: title,
          //   titleURL: titleURL,
          //   // string: topicString,
          //   description: description,
          //   firstImage: firstImage,
          //   lastSave: lastSave,
          // })
        // }
      // }
    // }
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