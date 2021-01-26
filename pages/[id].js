import { useRouter } from 'next/router'
import config from '../config'
import { API } from 'aws-amplify'
import '../configureAmplify'


export default function User({ user }) {

  console.log(user)

  return (
    <div>
      <h3>{user.Username}</h3>
      <h5>{user.folders.map((folder) => <div>{folder}</div>)}</h5>
      <div>{user.publicString}</div>
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
  console.log(params.id)
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