
import { API } from 'aws-amplify'
import '../configureAmplify'
import Link from 'next/link'
import Head from 'next/head'
import NavbarComp from '../components/nabar/navbar'
export default function User({ user }) {

  const openCallPhone = () => {
    const devSite = `/${user.Username}/call`
    const prodSite = `https://talktree.me/${user.Username}/call`
    const currentSite = process.env.STAGE === 'prod' ? prodSite : devSite
    window.open(
      currentSite,
      "MsgWindow",
      "width=500,height=700"
    )
  }

  return (
    <>
      <Head>
        <title>Chat with {user.Username}, who might have solved this</title>
        <meta name="description" content={'userprovidedcontent'} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <NavbarComp />
      <div className="mx-5">
        
        <div className="flex flex-row">
          <div className="flex flex-col mx-5">
          <h3 className='mx-5 my-5'>{user.Username}</h3>
          <button type="button" className="border-4 hover:border-black" onClick={openCallPhone}>chat</button>
          </div>
          
          <div>{user.folders.map((folder) => <h5 key={folder}>{folder}</h5>)}</div>
        </div>


        <div className="my-5" dangerouslySetInnerHTML={{ __html: user.publicString }} ></div>
        <Link href={ "/" + user.Username + '/edit'}>
          <a className="border-2 hover:border-black">edit</a>
        </Link>
      </div>

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