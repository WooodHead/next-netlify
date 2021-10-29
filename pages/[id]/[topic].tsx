import React from 'react'
import API from '@aws-amplify/api'
import Head from 'next/head'
import '../../configureAmplify'
import { NotionAPI } from 'notion-client'
import TopicNotion from '../../components/[id]/[topic]/topicNotion'
import 'prismjs/themes/prism-tomorrow.css'
import { getNotionPages } from '../../utils/node/getNotionRecord'

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
        <meta property="og:image" content={firstImgAddress}></meta>
      </Head>
      <TopicNotion recordMap={recordMap} title={title} user={user} />
    </>
  )
}

export async function getStaticPaths() {
  try {
    const getAllUsersRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUsers", {})
    const usersWithNotion = getAllUsersRes.filter(user => user.notionId)
    const paths = await Promise.all(usersWithNotion.map(async userObj => {
      const notionRes = await getNotionPages(userObj.notionId)
      return notionRes.map(notionTopic => {
        return { params: { id: userObj.username, topic: notionTopic.titleUrl } }
      })
    }))
    /* this is because each seperate user is an array within the main array */
    return {
      paths: paths[0],
      fallback: "blocking"
    }
  } catch (err) {
    console.log(err)
  }
}

export async function getStaticProps({ params }) {
  // { id: 'gt2', topic: 'Keystone-Colorado-to-Austin-Texas-by-bicycle' }
  const notion = new NotionAPI()
  try {
    const getUserInit = { body: { username: params.id } }
    const getUser = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUser", getUserInit)
    const TAVS = []

    const notionPages = await getNotionPages(getUser.notionId)

    const user = {
      Username: getUser.username,
      active: true,
      busy: false,
      ppm: 0,
      receiver: true,
    }
    let selectedTopic = null
    notionPages.forEach((topicObj) => {
      if (topicObj.titleUrl === params.topic) {
        selectedTopic = {
          // topicId: topicObj.topicId,
          title: topicObj.title,
          titleUrl: topicObj.titleUrl,
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