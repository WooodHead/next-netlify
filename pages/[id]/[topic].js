import React from 'react'
import API from '@aws-amplify/api'
import Head from 'next/head'
import '../../configureAmplify'
import NavbarComp from '../../components/navbar/navbar'
import TopicComp from '../../components/[id]/[topic]/topicComp'

import { turnBracketsToAlt } from '../../components/custom/keyToImage'


export default function Topic({ user, topic }) {
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
  getAllUsersRes.body.Items.map(user => {
    if (user.topics) {
      for (const [uuidKey, topicObj] of Object.entries(user.topics.M)) {
        if (!topicObj.M.draft.BOOL) {
          const topicURL = topicObj.M.titleURL ? topicObj.M.titleURL.S : topicObj.M.title.S.replace(/ /g, '-')
          // topicURL is conditional to be backwards compatible when the titleURL didn't exist
          paths.push({ params: { id: user.Username.S, topic: topicURL } })
        }
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
    let topic = {}
    const specificUserInit = { headers: { Authorization: params.id } }
    const getUserRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", specificUserInit)
    const userRes = getUserRes.Item
  
    const TAVS = []
    userRes.deviceInput.M.text.BOOL && TAVS.push("📝")
    userRes.deviceInput.M.audio.BOOL && TAVS.push("📞")
    userRes.deviceInput.M.video.BOOL && TAVS.push("📹")
    userRes.deviceInput.M.screen.BOOL && TAVS.push("💻")
    const topicsArray = []
    for (const [key, topicObj] of Object.entries(userRes.topics?.M)) {
      if (!topicObj.M.draft.BOOL) {
        topicsArray.push({ ...topicObj.M, topicId: key })
      }
    }
    const user = {
      Username: userRes.Username.S,
      active: userRes.active.BOOL,
      busy: userRes.busy.BOOL,
      TAVS: TAVS,
      ppm: userRes.ppm.N,
      ratingAv: userRes.ratingAv?.S || null,
      publicString: userRes.publicString?.S || null,
      topics: topicsArray || null,
      receiver: userRes.receiver.BOOL,
      image: userRes.urlString?.S || null,
    }
    user.topics.forEach(async (topicObj) => {
      const title = topicObj.title.S
      const titleURL = topicObj.titleURL?.S || null
      const string = turnBracketsToAlt(topicObj.string.S)
      // add height and width elements to img
      if (string) {
        // const stringWithResize = string.replace(/<img/g, "<img className='w-100% h-100%'") shits w-full not 100 lol
        // const constWithPreChanged = string.replace(/<pre/g, "<pre className='overflow-auto max-w-screen'")
        const topicId = topicObj.topicId
        const lastSave = topicObj.lastSave ? topicObj.lastSave.S : null

        if (title === params?.topic || titleURL === params?.topic) {
          // const titleWithSpaces = title.replace(/-/g, ' ')
          const h2Tag = string.match(/<h2>(.+?)<\/h2>/)
          const description = h2Tag ? h2Tag[1] : null
          const wholeImgTag = string.match(/<img.+?src="(.+?)"/)
          const imgSrc = wholeImgTag ? wholeImgTag[1] : null
          topic = {
            topicId: topicId,
            title: title,
            titleURL: titleURL,
            string: string,
            description: description,
            firstImage: imgSrc,
            lastSave: lastSave,
          }
        }
      }
    })
    return {
      props: { user: user, topic: topic },
      revalidate: 1
    }
  } catch (err) {
    console.log(err)
    return { notFound: true }
  }

}