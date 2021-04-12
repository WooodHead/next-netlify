import React, { useEffect, useState } from 'react'
import Amplify, { API, Auth } from 'aws-amplify'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Head from 'next/head'
import '../../configureAmplify'
import NavbarComp from '../../components/navbar/navbar'
import UserComp from '../../components/[id]/userComp'
import KeyToImage from '../../components/custom/keyToImage'

export default function Topic({ user, topic }) {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <div>
        the page is being created, try refreshing the page
      </div>
    )
  }

  const firstImgAddress = topic.firstImage
  console.log(firstImgAddress)
  // const [stringState, setStringState] = useState('')


  // useEffect(() => {
  //   (async () => setStringState(await KeyToImage(topic.string)))()
  // }, [topic])

  return (
    <>
      <Head>
        <title>{topic.topic}</title>
        <meta name="description" content={topic.description} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:image" content={firstImgAddress}></meta>
      </Head>
      <NavbarComp />
      <UserComp user={user} />
      <div className="mx-5">
        <div className="flex justify-center">
          <div className="my-5 prose bg-gray-100" dangerouslySetInnerHTML={{ __html: topic.stringNoKeys }} ></div>
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
      Object.keys(user.topics.M).map((topic) => {
        paths.push({ params: { id: user.Username.S, topic: topic } })
      })
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

  const user = {
    Username: userRes.Username.S,
    active: userRes.active.BOOL,
    busy: userRes.busy.BOOL,
    folders: userRes.folders?.SS || [],
    TAVS: TAVS,
    ppm: userRes.ppm.N,
    ratingAv: userRes.ratingAv?.S || null,
    publicString: userRes.publicString?.S || null,
    topics: userRes.topics?.M || null,
  }

  for (const key in user.topics) {
    if (key === params.topic) {
      const h2Index = user.topics[key].S.indexOf('<h2>')
      const h2IndexEnd = user.topics[key].S.indexOf('</h2>', h2Index)
      const h2Description = user.topics[key].S.slice(h2Index + 4, h2IndexEnd)

      const keysNowStrings = await KeyToImage(user.topics[key].S)
      const firstImageBeginning = keysNowStrings.indexOf('<img')
      const firstImageEnd = keysNowStrings.indexOf('/>', firstImageBeginning)
      const firstImage = keysNowStrings.slice(firstImageBeginning + 10, firstImageEnd - 2)
      topic = {
        topic: key,
        string: user.topics[key].S,
        stringNoKeys: keysNowStrings,
        description: h2Description,
        firstImage: firstImage
      }

    }
  }

  return {
    props: { user: user, topic: topic },
    revalidate: 1
  }
}