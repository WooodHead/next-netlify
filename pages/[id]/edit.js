import React, { useEffect, useState }  from 'react'
import Amplify, { API, Auth } from 'aws-amplify'
import '../../configureAmplify'
import "../../node_modules/react-quill/dist/quill.snow.css"
import Link from 'next/link'
import NavbarComp from '../../components/navbar/navbar'
// import PublicString from '../../components/edit/publicString'
// import TopicString from '../../components/edit/topicString'
import folders from '../../components/edit/folders'
import dynamic from 'next/dynamic'
const ReactQuill = dynamic(
  () => import('react-quill'),
  { ssr: false }
)
const PublicString = dynamic(
  () => import('../../components/edit/publicString'),
  { ssr: false }
)
const TopicString = dynamic(
  () => import('../../components/edit/topicString'),
  { ssr: false }
)

export default function Edit( { user } ) {
  const [isUser, setIsUser] = useState(false)
  const [userDataState, setUserDataState] = useState( { user } )

  const getUserData = async () => {
    const getUserInit = { headers: { Authorization: user.Username
  } } 
    try {
      let user = {}
      const getAllUsersRes = await API.get(process.env.apiGateway.NAME, "/users", getUserInit)
      console.log(getAllUsersRes)
          user = {
            Username: getAllUsersRes.Item.Username.S,
            active: getAllUsersRes.Item.active.BOOL,
            busy: getAllUsersRes.Item.busy.BOOL,
            folders: getAllUsersRes.Item.folders?.SS || [],
            ppm: getAllUsersRes.Item.ppm.N,
            ratingAv: getAllUsersRes.Item.ratingAv?.S || null,
            publicString: getAllUsersRes.Item.publicString?.S || null,
            topicString: getAllUsersRes.Item.topicString?.S || null,
          }
      setUserDataState({ user: user })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
  //   (async () => {try {
  //     const userAuth = await Auth.currentAuthenticatedUser()
  //     userAuth.attributes.preferred_username === user.Username && setIsUser(true)
  //   } catch { 
  //     return setIsUser(false)
  //   }
  // })()
    getUserData()
  }, [])

  return (
    <>
    <NavbarComp />
    <div className="mx-5">
      <PublicString user={user}/>

      <div className="bg-gray-100" >
        {user.folders.map((folder) => <h5 key={folder}>{folder}</h5>)}
      </div>

      <TopicString user={user} />

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
        publicString: userRes.publicString?.S || null,
        topicString: userRes.topicString?.S || null,
      }
    }    
  })
  return {props: { user: user } }
}