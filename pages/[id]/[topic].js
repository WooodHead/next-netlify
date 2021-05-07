import React, { useEffect, useState } from 'react'
import API from '@aws-amplify/api'
import { useRouter } from 'next/router'
import Head from 'next/head'
import '../../configureAmplify'
import NavbarComp from '../../components/navbar/navbar'
import UserComp from '../../components/[id]/userComp'
import CommentComp from '../../components/[id]/commentComp'
import { turnBracketsToAlt } from '../../components/custom/keyToImage'
// import Image from 'next/image'

export default function Topic({ user, topic }) {
  const router = useRouter()
  if (router.isFallback) {
    return (
<div>error</div>
    )
  }
  const userOnboarded = user.receiver
  const firstImgAddress = topic.firstImage
  const description = topic.description
  const title = topic.title
  let dateString = ''

  if (topic.lastSave) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"]
    const lastSaveDate = new Date(JSON.parse(topic.lastSave))
    console.log(lastSaveDate)
    const day = lastSaveDate.getDate()
    const month = lastSaveDate.getMonth()
    const year = lastSaveDate.getFullYear()
    dateString = '' + monthNames[month] + ' ' + day + ' ' + year
  }

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
      <div className="">
        <NavbarComp />
        <UserComp user={user} />
        <div className="mx-5">
            <div className="my-5 lg:flex justify-center bg-gray-100" >
                <div className="prose">
                  {/* <h1>{title}</h1>
                  <h2>{description}</h2>
                  <Image src={firstImgAddress} alt={topic.firstImageAlt}></Image> */}
                  <div 
                    className="m-3 sm:prose prose-sm overflow-auto"
                    dangerouslySetInnerHTML={{ __html: topic.string }} 
                  ></div>
                  {/* <div className="justify-center flex">
                  < CommentComp />
                  </div> */}
                  <div className="flex my-3 justify-center text-xs">last updated: {dateString} </div>
                  
                </div>
                
              </div>
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const allUsersInit = { headers: { Authorization: "all" } }
  const getAllUsersRes = await API.get(process.env.apiGateway.NAME, "/users", allUsersInit)
  const paths = []
  getAllUsersRes.body.Items.map(user => {
    if (user.topics) {
      for (const [uuidKey, topicObj] of Object.entries(user.topics.M)) {
        if (!topicObj.M.draft.BOOL) {
          paths.push({ params: { id: user.Username.S, topic: topicObj.M.title.S } })
        }
      }
    } else {
      paths.push({ params: { id: user.Username.S, topic: "" } })
    }
  })

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  let topic
  const specificUserInit = { headers: { Authorization: params.id } }
  const getUserRes = await API.get(process.env.apiGateway.NAME, "/users", specificUserInit)
  const userRes = getUserRes.Item

  const TAVS = []
  userRes.deviceInput.M.text.BOOL && TAVS.push("📝")
  userRes.deviceInput.M.audio.BOOL && TAVS.push("📞")
  userRes.deviceInput.M.video.BOOL && TAVS.push("📹")
  userRes.deviceInput.M.screen.BOOL && TAVS.push("💻")
  const topicsArray = []
  for (const [key, topicObj] of Object.entries(userRes.topics?.M)) {
    if (!topicObj.M.draft.BOOL) {
      topicsArray.push({...topicObj.M, topicId: key})
    }
  }
  const user = {
    Username: userRes.Username.S,
    active: userRes.active.BOOL,
    busy: userRes.busy.BOOL,
    folders: userRes.folders?.SS || [],
    TAVS: TAVS,
    ppm: userRes.ppm.N,
    ratingAv: userRes.ratingAv?.S || null,
    publicString: userRes.publicString?.S || null,
    topics: topicsArray || null,
    receiver: userRes.receiver.BOOL
  }

    user.topics.forEach( async (topicObj) => {
    const title = topicObj.title.S
    const string = turnBracketsToAlt(topicObj.string.S)

    // const draft = topicObj.draft.BOOL
    const topicId = topicObj.topicId
    const lastSave = topicObj.lastSave ? topicObj.lastSave.S : null
    if (title === params.topic) {
      const titleWithSpaces = title.replace(/-/g, ' ')
      const h2Tag = string.match(/<h2>(.+?)<\/h2>/)
      const description = h2Tag ? h2Tag[1] : null
      const wholeImgTag = string.match(/<img.+?src="(.+?)"/)
      const imgSrc = wholeImgTag ? wholeImgTag[1] : null
      // add height and width to <img>s
      topic = {
        topicId: topicId,
        title: titleWithSpaces,
        string: string,
        description: description,
        // draft: draft
        firstImage: imgSrc,
        lastSave: lastSave,
      }
    }
  })

  return {
    props: { user: user, topic: topic },
    revalidate: 1
  }
}