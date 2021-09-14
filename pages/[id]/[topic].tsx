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
import getNotionTitle from '../../components/[id]/getNotionRecord'

export default function Topic({ user, topic }) {
  const firstImgAddress = topic.firstImage
  const description = topic.description
  const title = topic.title
  const recordMap = topic.recordMap || null
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
        :
        <TopicComp user={user} topic={topic} />
      }

    </>
  )
}

export async function getStaticPaths() {
  const getAllUsersRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUsers", {})

  const paths = await Promise.all(getAllUsersRes.map(async userObj => {
    let params = null
      await Promise.all(userObj.notionIds.map(async notionId => {
        let notionRes = await getNotionTitle(notionId)
        params = { id: userObj.username, topic: notionRes.titleURL }
      }))
    return { params: params }
  }))

  let pathArray = []
  //@ts-ignore
  if (paths.params) { pathArray.push({ params: params }) }
  return {
    paths: pathArray,
    fallback: "blocking"
  }
}

export async function getStaticProps({ params }) {
  const notion = new NotionAPI()
  try {
    const getUserInit = { body: { username: params.id } }
    const getUser = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUser", getUserInit)
    const TAVS = []
    getUser.deviceInput.text && TAVS.push("📝")
    getUser.deviceInput.audio && TAVS.push("📞")
    getUser.deviceInput.video && TAVS.push("📹")
    getUser.deviceInput.screen && TAVS.push("💻")
    if (!getUser.notionIds) return
    console.log('getUser', getUser)
    const newTopics = await Promise.all(getUser.notionIds.map(async (notionId) => {
      return await getNotionTitle(notionId)
    }))
    const cleanedTopics = []
    newTopics.forEach((topic) => topic && cleanedTopics.push(topic))

    const user = {
      Username: getUser.username,
      active: getUser.active,
      busy: getUser.busy,
      ppm: getUser.ppm,
      TAVS: TAVS,
      publicString: getUser.publicString,
      topics: cleanedTopics,
      receiver: getUser.receiver,
      image: getUser.userImg,
    }
    let selectedTopic = null
    await Promise.all(newTopics.map(async (topicObj: any) => {

      if (topicObj.recordMap) {
        if (topicObj.titleURL === params.topic) {
          selectedTopic = {
            topicId: topicObj.title,
            title: topicObj.title,
            titleURL: topicObj.titleURL,
            recordMap: topicObj.recordMap
          }
          console.log("selected notiontopic", selectedTopic)
        }
      } else if (topicObj.title === params.topic || topicObj.titleURL === params.topic) {
        selectedTopic = {
          topicId: topicObj.topicId,
          title: topicObj.title,
          titleURL: topicObj.titleURL,
          string: turnBracketsToAlt(topicObj.string),
          description: topicObj.description,
          firstImage: topicObj.firstImage,
          lastSave: topicObj.lastSave,
          recordMap: null
        }

      }
    }))
    console.log('selected', selectedTopic)
    let cleanedTopic = null
    // topic.forEach(topic => {
    //   if (topic) { cleanedTopic = topic }
    // })
    // console.log('cleanedTOpic', cleanedTopic)
    //@ts-ignore
    return selectedTopic.topicId ? {
      props: { user: user, topic: selectedTopic },
      revalidate: 1
    }
      : { notFound: true }
  } catch (err) {
    console.log(err)
    return { notFound: true }
  }

}