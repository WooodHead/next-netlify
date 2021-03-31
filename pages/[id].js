
import { API } from 'aws-amplify'
import '../configureAmplify'
import Link from 'next/link'
import Head from 'next/head'
import NavbarComp from '../components/navbar/navbar'
import UserComp from '../components/[id]/userComp'

export default function User({ user }) {

  return (
    <>
      <Head>
        <title>Chat with {user.Username}, who might have solved this</title>
        <meta name="description" content={'userprovidedcontent'} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NavbarComp />
      <UserComp user={user} />
    </>
  )
}

export async function getStaticPaths() {
  const getAllUsersRes = await API.get(process.env.apiGateway.NAME, "/getAllUsers")
  const paths = getAllUsersRes.body.Items.map(user => { 
    return { params: { id: user.Username.S }}
  })
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  let user
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
        ppm: userRes.ppm.N,
        TAVS: TAVS,
        ratingAv: userRes.ratingAv?.S || null,
        publicString: userRes.publicString?.S || null,
        topicString: userRes.topicString?.S || null,
        topics: userRes.topics?.M || null
      }
    }    
  })
  return {props: { user: user }, revalidate: 1 }
}