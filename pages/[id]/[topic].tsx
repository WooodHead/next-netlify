import React from 'react'
import API from '@aws-amplify/api'
import Head from 'next/head'
import '../../configureAmplify'
import TopicComp from '../../components/[id]/[topic]/topicComp'
import { turnBracketsToAlt } from '../../components/custom/keyToImage'
import { NotionAPI } from 'notion-client'
import NotionComp from '../../components/[id]/[topic]/notionComp'

// core styles shared by all of react-notion-x (required)
import 'prismjs/themes/prism-tomorrow.css'

export default function Topic({ user, topic }) {

  const firstImgAddress = topic.firstImage
  const description = topic.description
  const title = topic.title
  const recordMap = topic.recordMap || null
  console.dir(user.recordMap2)
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
      {recordMap 
      ? <NotionComp recordMap={recordMap} /> 
      : <TopicComp user={user} topic={topic} />
      }
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
        topicURL !== '' && paths.push({ params: params })
      })
    }
  })
  return {
    paths: paths,
    fallback: "blocking"
  }
}

export async function getStaticProps({ params }) {
  const notion = new NotionAPI()
  const recordMap2 = await notion.getPage('beb65813cfb84831855397d1b7bdede6')
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
      recordMap2: recordMap2
    }
    let topic
    getUser.topics.forEach(async (topicObj) => {

      let recordMap = null

      if (topicObj.notion) {
        recordMap = await notion.getPage(topicObj.topicId)
        console.log(recordMap)
        // topicURL????
      }
      if (topicObj.title === params?.topic || topicObj.titleURL === params?.topic) {
        topic = {
          topicId: topicObj.topicId,
          title: topicObj.title,
          titleURL: topicObj.titleURL,
          string: turnBracketsToAlt(topicObj.string),
          description: topicObj.description,
          firstImage: topicObj.firstImage,
          lastSave: topicObj.lastSave,
          recordMap: recordMap
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