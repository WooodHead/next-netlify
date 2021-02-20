import React, { useEffect, useState }  from 'react'
import Amplify, { API, Auth } from 'aws-amplify'
import '../../configureAmplify'
import "../../node_modules/react-quill/dist/quill.snow.css"
import NavbarComp from '../../components/navbar/navbar'
import dynamic from 'next/dynamic'
const PublicString = dynamic(() => import('../../components/edit/publicString'),{ ssr: false })
const Topics = dynamic(() => import('../../components/edit/topics'),{ ssr: false })

export default function Topic( { user } ) {
  const [isUser, setIsUser] = useState(false)
  const [userDataState, setUserDataState] = useState( { user } )

  const getUserData = async () => {
    const getUserInit = { headers: { Authorization: user.Username
  } } 
    try {
      let user = {}
      const getAllUsersRes = await API.get(process.env.apiGateway.NAME, "/users", getUserInit)
          user = {
            Username: getAllUsersRes.Item.Username.S,
            active: getAllUsersRes.Item.active.BOOL,
            busy: getAllUsersRes.Item.busy.BOOL,
            folders: getAllUsersRes.Item.folders?.SS || [],
            ppm: getAllUsersRes.Item.ppm.N,
            ratingAv: getAllUsersRes.Item.ratingAv?.S || null,
            publicString: getAllUsersRes.Item.publicString?.S || null,
            topics: getAllUsersRes.Item.topics?.M || null,
          }
      setUserDataState({ user: user })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <>
    <NavbarComp />
    <div className="mx-5">
      <PublicString user={user}/>
      <Topics user={user} />
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
        topics: userRes.topics?.M || null,
      }
    }    
  })
  return {props: { user: user } }
}