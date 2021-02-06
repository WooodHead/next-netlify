import React, { useState }  from 'react'
import config from '../../config'
import Amplify, { API, Auth } from 'aws-amplify'
import '../../configureAmplify'
import dynamic from "next/dynamic"
import "../../node_modules/react-quill/dist/quill.snow.css"
import Link from 'next/link'

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function Edit({ user }) {
  const [quillState, setQuillState] = useState(user.publicString)
  const [savedState, setSavedState] = useState()

  console.log((quillState))
  function byteCount(s) {
    return encodeURI(s).split(/%..|./).length - 1;
}
  const typingFn = (e) => {


    setQuillState(e)
    setSavedState(false)
  }
  const savePublicString = async () => {
    try {
      const userSession = await Auth.currentSession()
      const stringInit = {
        headers: { Authorization: userSession.idToken.jwtToken },
        body: {
          publicString: `` + quillState
        }
      }
      await API.post(config.apiGateway.NAME, '/savePublicString', stringInit )
      setSavedState(true)
    } catch (err) {
      console.log(err)
    }
  }
    return (
      <div>
        <ReactQuill theme={"snow"} 
            modules={{ /*this fixes the additional spacing issue??? */
              clipboard: {
                  matchVisual: false
              }
          }} 
          value={quillState} onChange={(e) => typingFn(e) }/>
        <button onClick={savePublicString}>save</button>
        { savedState && <> saved</> }
        <div>
          <Link href={"/" + user.Username}>
            <a>Back to user</a>
          </Link>
        </div>
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
