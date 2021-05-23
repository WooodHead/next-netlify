import React from 'react'
import API from '@aws-amplify/api'
import { useRouter } from 'next/router'
import Head from 'next/head'
import '../../configureAmplify'
import NavbarComp from '../../components/navbar/navbar'
import UserComp from '../../components/[id]/userComp'
import CommentComp from '../../components/[id]/commentComp'
import { turnBracketsToAlt } from '../../components/custom/keyToImage'
import SideUserIsland from '../../components/[id]/[topic]/sideUserIsland'
import TopUserIsland from '../../components/[id]/[topic]/topUserIsland'

export default function Topic({ user, topic }) {
  const userOnboarded = user.receiver
  const firstImgAddress = topic.firstImage
  const description = topic.description
  const title = topic.title
  let dateString = ''

  if (topic.lastSave) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"]
    const lastSaveDate = new Date(JSON.parse(topic.lastSave))
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
      <NavbarComp />
      <div className="bg-gray-100">

        <div className="my-5 w-screen">
          <div className="flex flex-row">

            <div className="flex flex-1 justify-center">
              <div className="hidden md:flex lg:flex xl:flex mt-10 mr-2 2xl:flex justify-center">
                <SideUserIsland user={user} />
              </div>
            </div>

            <div className="mx-5">
              <TopUserIsland user={user} />
              <div className="my-5" >
                <div className="my-5">
                  <div
                    className="prose sm:prose prose-sm"
                    dangerouslySetInnerHTML={{ __html: topic.string }}
                  ></div>
                  <div className="justify-center flex">
                    < CommentComp user={user} />
                  </div>
                  <div className="flex my-3 justify-center text-xs">last updated: {dateString} </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-1">
              {/* this is the empty right column */}
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
    paths: paths,
    fallback: "blocking"
  }
}

export async function getStaticProps({ params }) {
  let topic = {}
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
      topicsArray.push({ ...topicObj.M, topicId: key })
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
    receiver: userRes.receiver.BOOL,
    image: userRes.urlString?.S || null,
  }
  user.topics.forEach(async (topicObj) => {
    const title = topicObj.title.S
    const string = turnBracketsToAlt(topicObj.string.S)
    // add height and width elements to img
    if (string) {
      // const stringWithResize = string.replace(/<img/g, "<img className='w-100% h-100%'") shits w-full not 100 lol
      // const constWithPreChanged = string.replace(/<pre/g, "<pre className='max-w-screen overflow-auto'")
      const topicId = topicObj.topicId
      const lastSave = topicObj.lastSave ? topicObj.lastSave.S : null
      if (title === params?.topic) {
        const titleWithSpaces = title.replace(/-/g, ' ')
        const h2Tag = string.match(/<h2>(.+?)<\/h2>/)
        const description = h2Tag ? h2Tag[1] : null
        const wholeImgTag = string.match(/<img.+?src="(.+?)"/)
        const imgSrc = wholeImgTag ? wholeImgTag[1] : null
        topic = {
          topicId: topicId,
          title: titleWithSpaces,
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
}