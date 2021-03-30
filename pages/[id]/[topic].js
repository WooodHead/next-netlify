import React, { useEffect, useState }  from 'react'
import Amplify, { API, Auth } from 'aws-amplify'
import Link from 'next/link'
import Head from 'next/head'
import '../../configureAmplify'
import NavbarComp from '../../components/navbar/navbar'
import UserComp from '../../components/account/userComp'
import KeyToImage from '../../components/custom/keyToImage'

export default function Topic( { user, topic } ) {

  // const openCallPhone = () => {
  //   const devSite = `/${user.Username}/call`
  //   const prodSite = `https://talktree.me/${user.Username}/call`
  //   const currentSite = process.env.STAGE === 'prod' ? prodSite : devSite
  //   window.open(
  //     currentSite,
  //     "MsgWindow",
  //     "width=500,height=700"
  //   )
  // }

  const [stringState, setStringState] = useState('')

  useEffect(() => {
    (async () => setStringState( await KeyToImage(topic.string)))()
  }, [topic])

  return (
    <>
      <Head>
        <title>{topic.topic}</title>
        <meta name="description" content={topic.string} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NavbarComp />
      <UserComp user={user} />
      <div className="mx-5">
        <div>
          <div className="my-5 bg-gray-100" dangerouslySetInnerHTML={{ __html: stringState }} ></div>
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const getAllUsersRes = await API.get(process.env.apiGateway.NAME, "/getAllUsers")
  const paths = []
  getAllUsersRes.body.Items.map(user => { 
      if (user.topics) { Object.keys(user.topics.M).map((topic) => {
        paths.push({ params: { id: user.Username.S, topic: topic }})
    }) } else {
      paths.push({ params: { id: user.Username.S, topic: "" }})
    }
  })
  
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  let user
  let topic
  const getAllUsersRes = await API.get(process.env.apiGateway.NAME, "/getAllUsers")
  getAllUsersRes.body.Items.forEach((userRes) => {
    const TAVS = []
    userRes.deviceInput.M.text.BOOL && TAVS.push("📝")
    userRes.deviceInput.M.audio.BOOL && TAVS.push("📞")
    userRes.deviceInput.M.video.BOOL && TAVS.push("📹")
    userRes.deviceInput.M.screen.BOOL && TAVS.push("💻")
    if (userRes.Username.S === params.id) {
      user = {
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
          topic = { topic: [key], string: user.topics[key].S }
        }
    }    
  }})
  return {props: { user: user, topic: topic } }
}