import React from 'react'
import API from '@aws-amplify/api'
import Head from 'next/head'
import '../../configureAmplify'
import NavbarComp from '../../components/navbar/navbar'
import TopicComp from '../../components/[id]/[topic]/topicComp'
import { turnBracketsToAlt } from '../../components/custom/keyToImage'
import ErrorPage from 'next/error'
import { useRouter } from 'next/router'

export default function Topic({ user, topic }) {
  // const router = useRouter()
  // if (router.isFallback) {
  //   return <div>Loading...</div>
  // }

  const firstImgAddress = topic.firstImage
  const description = topic.description
  const title = topic.title

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {/* <link rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/vs2015.min.css" />
        <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/highlight.min.js"></script> */}
        <meta property="og:image" content={firstImgAddress}></meta>
      </Head>
      <NavbarComp />
      <TopicComp user={user} topic={topic} />

    </>
  )
}

export async function getStaticPaths() {
  const allUsersInit = { headers: { Authorization: "all" } }
  const getAllUsersRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", allUsersInit)
  const paths = []

  getAllUsersRes.body.Items.forEach(user => {
    if (Object.keys(user.topics.M).length) {
      for (const [topicId, topicObj] of Object.entries(user.topics.M) as [topicObj: any]) {
        const topicURL = topicObj.M.titleURL ? topicObj.M.titleURL.S : topicObj.M.title.S.replace(/ /g, '-')
        const params = { id: user.Username.S, topic: topicURL }
        paths.push({ params: params })
      }
    } else {
      paths.push({ params: { id: user.Username.S, topic: "" } })
    }
  })
  return {
    paths: paths,
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

    let topic
    // const specificUserInit = { headers: { Authorization: params.id } }
    // const getUserRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", specificUserInit)
    // const userRes = getUserRes.Item

    // const TAVS = []
    // userRes.deviceInput.M.text.BOOL && TAVS.push("📝")
    // userRes.deviceInput.M.audio.BOOL && TAVS.push("📞")
    // userRes.deviceInput.M.video.BOOL && TAVS.push("📹")
    // userRes.deviceInput.M.screen.BOOL && TAVS.push("💻")
    // const topicsArray = []
    // for (const [key, topicObj] of Object.entries(userRes.topics?.M)) {
    //   if (!topicObj.M.draft.BOOL) {
    //     topicsArray.push({ ...topicObj.M, topicId: key })
    //   }
    // }
    // const user = {
    //   Username: userRes.Username.S,
    //   active: userRes.active.BOOL,
    //   busy: userRes.busy.BOOL,
    //   TAVS: TAVS,
    //   ppm: userRes.ppm.N,
    //   ratingAv: userRes.ratingAv?.S || null,
    //   publicString: userRes.publicString?.S || null,
    //   topics: topicsArray || null,
    //   receiver: userRes.receiver.BOOL,
    //   image: userRes.urlString?.S || null,
    // }
    getUser.topics.forEach(async (topicObj) => {
      // const title = topicObj.title.S
      // const titleURL = topicObj.titleURL?.S || null
      // const string = turnBracketsToAlt(topicObj.string.S)
      // add height and width elements to img
      // if (string) {
      // const topicId = topicObj.topicId
      // const lastSave = topicObj.lastSave ? topicObj.lastSave.S : null
      // const firstImage = topicObj.firstImage ? topicObj.firstImage.S : null
      // const description = topicObj.description ? topicObj.description.S : null

      if (topicObj.title === params?.topic || topicObj.titleURL === params?.topic) {
        topic = {
          topicId: topicObj.topicId,
          title: topicObj.title,
          titleURL: topicObj.titleURL,
          string: topicObj.string,
          description: topicObj.description,
          firstImage: topicObj.firstImage,
          lastSave: topicObj.lastSave,
        }
      }
      // }
    })
    return topic.topicId ? {
      props: { user: user, topic: topic },
      revalidate: 1
    }
      : { notFound: true }
  } catch (err) {
    console.log(err)
    return { notFound: true }
  }

}