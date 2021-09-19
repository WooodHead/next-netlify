import React from 'react'
import API from '@aws-amplify/api'
import Head from 'next/head'
import '../../configureAmplify'
import TopicComp from '../../components/[id]/[topic]/topicComp'
import { turnBracketsToAlt } from '../../components/custom/keyToImage'
import { NotionAPI } from 'notion-client'
import NotionComp from '../../components/[id]/[topic]/notionComp'
// import 'react-notion-x/src/styles.css'
// core styles shared by all of react-notion-x (required)
import 'prismjs/themes/prism-tomorrow.css'
import { getNotionPages } from '../../components/[id]/getNotionRecord'

export default function Topic({ user, topic }) {
  const firstImgAddress = topic.firstImage
  const description = topic.description
  const title = topic.title
  const recordMap = topic.recordMap || null
  console.log("TOPIC", topic)
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
        ? <NotionComp recordMap={recordMap} title={title} user={user} />
        :
        <TopicComp user={user} topic={topic} />
      }
      <img src="https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F4fb0ec04-3a2d-4ba0-bc5c-c00237458337%2FPXL_20210222_213622015.MP.jpg?table=block&id=9d8442f9-091f-4650-a3e5-5cf5d377b1d3&cache=v2" ></img>
    </>
  )
}

export async function getStaticPaths() {
  const getAllUsersRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUsers", {})
  const usersWithNotion = getAllUsersRes.filter(user => user.notionId)
  const paths = await Promise.all(usersWithNotion.map(async userObj => {
    // let params = null
    const notionRes = await getNotionPages(userObj.notionId)
    //@ts-ignore
    return notionRes.map(notionTopic => {
      return { params: { id: userObj.username, topic: notionTopic.titleURL } }
    })
  }))
  const newArray = []
  /* TODO:: THIS WILL NOT WORK WHEN THERE ARE MORE USERS WITH NOTIONID I THINK */
  return {
    paths: paths[0],
    fallback: "blocking"
  }
}

export async function getStaticProps({ params }) {
  console.log("PARAMS", params)
  const notion = new NotionAPI()
  try {
    const getUserInit = { body: { username: params.id } }
    const getUser = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUser", getUserInit)
    const TAVS = []
    getUser.deviceInput.text && TAVS.push("📝")
    getUser.deviceInput.audio && TAVS.push("📞")
    getUser.deviceInput.video && TAVS.push("📹")
    getUser.deviceInput.screen && TAVS.push("💻")

      const notionPages = await getNotionPages(getUser.notionId)
    console.log('notionpages', notionPages)
    const cleanedTopics = []
    notionPages.forEach((topic) => topic && cleanedTopics.push(topic))
    const user = {
      Username: getUser.username,
      active: getUser.active,
      busy: getUser.busy,
      ppm: getUser.ppm,
      TAVS: TAVS,
      // publicString: getUser.publicString,
      // topics: cleanedTopics,
      receiver: getUser.receiver,
      image: getUser.userImg,
    }
    console.log("CLEANEDTOPICS", cleanedTopics)
    let selectedTopic = null
    cleanedTopics.forEach((topicObj) => {
      if (topicObj.titleURL === params.topic) {
        selectedTopic = {
          topicId: topicObj.topicId,
          title: topicObj.title,
          titleURL: topicObj.titleURL,
          recordMap: topicObj.recordMap,
          // icon: topicObj.icon
        }
      }
    })
    //@ts-ignore
    return selectedTopic ? {
      props: { user: user, topic: selectedTopic },
      revalidate: 1
    }
      : { notFound: true }
  } catch (err) {
    console.log(err)
    return { notFound: true }
  }

}