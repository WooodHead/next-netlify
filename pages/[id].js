
import config from '../config'
import { API } from 'aws-amplify'
import '../configureAmplify'
import Link from 'next/link'
import Head from 'next/head'

export default function User({ user }) {

  const openCallPhone = () => {
    const devSite = `/${user.Username}/call`
    const prodSite = `https://talktree.me/${user.Username}/call`
    /* PROBLEM NO GOING PROD */
    const currentSite = process.env.REACT_APP_STAGE === 'prod' ? prodSite : devSite
    window.open(
      currentSite,
      "MsgWindow",
      "width=500,height=700"
    )
  }

  return (
    <div>
      <Head>
        <title>Chat with {user.Username}, who might have solved this</title>
        <meta name="description" content={'userprovidedcontent'} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Link href="/users">
        <a>Back to users</a>
      </Link>
      <button onClick={openCallPhone}>open phone</button>
      <h3>{user.Username}</h3>
      {user.folders.map((folder) => <h5 key={folder}>{folder}</h5>)}
      <div dangerouslySetInnerHTML={{ __html: user.publicString }} ></div>
      <Link href={user.Username + '/edit'}>
        <a>edit</a>
      </Link>
    </div>
  )
}

export async function getStaticPaths() {
  const getAllUsersRes = await API.get(config.apiGateway.NAME, "/getAllUsers")
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
  const getAllUsersRes = await API.get(config.apiGateway.NAME, "/getAllUsers")
  getAllUsersRes.body.Items.forEach((userRes) => {
    if (userRes.Username.S === params.id) {
      user = {
        Username: userRes.Username.S,
        active: userRes.active.BOOL,
        busy: userRes.busy.BOOL,
        folders: userRes.folders?.SS || [],
        ppm: userRes.ppm.N,
        ratingAv: userRes.ratingAv?.S || null,
        publicString: userRes.publicString?.S || null
      }
    }    
  })
  return {props: { user: user } }
}