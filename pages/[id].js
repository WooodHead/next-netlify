import { useRouter } from 'next/router'
import config from '../config'
import { API } from 'aws-amplify'
import '../configureAmplify'


export default function User({ allUsers }) {
  // const router = useRouter()
  // const { id } = router.query 
  // if (router.isFallback) {
  //   return <div>Loading...</div>
  // }
  console.log(allUsers)

  return (
    <div>hello</div>
  )
}

export async function getStaticPaths() {
  const getAllUsersRes = await API.get(config.apiGateway.NAME, "/getAllUsers")
  console.log(getAllUsersRes)
  const paths = getAllUsersRes.body.Items.map(user => { 
    return { params: { id: user.Username.S }}
  })
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  console.log('params', params)
  const newAllUsers = []
  const getAllUsersRes = await API.get(config.apiGateway.NAME, "/getAllUsers")
  getAllUsersRes.body.Items.forEach((userRes) => {
    const firstSixFolders = userRes.folders?.SS.slice(0, 6) || []
    newAllUsers.push({
      Username: userRes.Username.S,
      active: userRes.active.BOOL,
      busy: userRes.busy.BOOL,
      folders: firstSixFolders || [],
      ppm: userRes.ppm.N,
      ratingAv: userRes.ratingAv?.S || null,
      publicString: userRes.publicString?.S || null
    })
  })
  return {props: { allUsers: newAllUsers } }
}