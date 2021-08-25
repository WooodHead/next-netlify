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
        <meta property="og:image" content={firstImgAddress}></meta>z
      </Head>
      {/* <NavbarComp /> */}
      <TopicComp user={user} topic={topic} />

    </>
  )
}

export async function getStaticPaths() {
  const getAllUsersRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUsers", {})
  const paths = []

  getAllUsersRes.forEach(userObj => {
    if (userObj.topics.length) {
      userObj.topics.forEach(topicObj => {
        const topicURL = topicObj.titleURL ? topicObj.titleURL : topicObj.title.replace(/ /g, '-')
        const params = { id: userObj.username, topic: topicURL }
        paths.push({ params: params })
      })

    } else {
      paths.push({ params: { id: userObj.username, topic: "" } })
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
    getUser.topics.forEach(async (topicObj) => {
      if (topicObj.title === params?.topic || topicObj.titleURL === params?.topic) {
        topic = {
          topicId: topicObj.topicId,
          title: topicObj.title,
          titleURL: topicObj.titleURL,
          string: turnBracketsToAlt(topicObj.string),
          description: topicObj.description,
          firstImage: topicObj.firstImage,
          lastSave: topicObj.lastSave,
        }
      }
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