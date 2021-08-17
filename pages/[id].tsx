
import API from '@aws-amplify/api'
import '../configureAmplify'
import Head from 'next/head'
import NavbarComp from '../components/navbar/navbar'
import UserComp from '../components/[id]/userComp'
import ErrorPage from 'next/error'

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

export default function User({ ...user }: User) {

  const description = user.publicString
  return user ?

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
   : <><ErrorPage statusCode={404}/></>
}

export async function getStaticPaths() {
  const allUsersInit = { headers: { Authorization: "all" } }
  const getAllUsersRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", allUsersInit)
  const paths = getAllUsersRes.body.Items.map(user => {
    return { params: { id: user.Username.S } }
  })
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const specificUserInit = { headers: { Authorization: params.id } }
  const getUserRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", specificUserInit)
  const userRes = getUserRes.Item
  const TAVS = []
  userRes.deviceInput.M.text.BOOL && TAVS.push("📝")
  userRes.deviceInput.M.audio.BOOL && TAVS.push("📞")
  userRes.deviceInput.M.video.BOOL && TAVS.push("📹")
  userRes.deviceInput.M.screen.BOOL && TAVS.push("💻")
  const topicsArray = []
  if (userRes.topics) {
    for (const [key, topicObj] of Object.entries(userRes.topics.M) as [key:string, topicObj:any]) {
      if (!topicObj.M.draft.BOOL) {
        const title = topicObj.M.title.S
        const titleURL = topicObj.M.titleURL?.S || null
        const topicString = topicObj.M.string.S
        const lastSave = topicObj.M.lastSave ? topicObj.M.lastSave.S : null
        // const titleWithSpaces = title.replace(/-/g, ' ')
        const h2Tag = topicString.match(/<h2>(.+?)<\/h2>/)
        const description = h2Tag ? h2Tag[1] : null
        const wholeImgTag = topicString.match(/<img.+?src=".+?cloudfront.net\/(.+?)"/)
        const wholeURL = wholeImgTag ? wholeImgTag[0].match(/https.+?cloudfront.net\/(.+?)"/) : null
        const isGif = wholeImgTag ? wholeImgTag[0].match(/gif/) : true
        let firstImage = null
        if (!isGif) {
          const imgSrc = wholeImgTag ? wholeImgTag[1] : null
          const atob = a => Buffer.from(a, 'base64').toString('binary')
          const btoa = b => Buffer.from(b).toString('base64')
          const converted = JSON.parse(atob(imgSrc))
          converted.edits.resize.width = 100
          converted.edits.resize.height = 100
          const reverted = btoa(JSON.stringify(converted))
          firstImage = wholeURL[0].replace(/(https:.+?cloudfront.net\/).+?"/, function(a, b) {
            return b + reverted
          })
        }

        topicsArray.push({
          topicId: key,
          title: title,
          titleURL: titleURL,
          // string: topicString,
          description: description,
          firstImage: firstImage,
          lastSave: lastSave,
        })
      }
    }
  }
  const user = {
    Username: userRes.Username.S,
    active: userRes.active.BOOL,
    busy: userRes.busy.BOOL,
    ppm: userRes.ppm.N,
    TAVS: TAVS,
    // ratingAv: userRes.ratingAv?.S || null,
    publicString: userRes.publicString?.S || null,
    topicString: userRes.topicString?.S || null,
    topics: topicsArray || null,
    receiver: userRes.receiver.BOOL,
    image: userRes.urlString?.S || null,
  }

  return { props: { user: user }, revalidate: 1 }
}