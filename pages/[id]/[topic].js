import React, { useEffect, useState }  from 'react'
import Amplify, { API, Auth } from 'aws-amplify'
import Link from 'next/link'
import Head from 'next/head'
import '../../configureAmplify'
import "../../node_modules/react-quill/dist/quill.snow.css"
import NavbarComp from '../../components/navbar/navbar'

export default function Topic( { user, topic } ) {

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
        
        <div className="flex flex-row bg-gray-100 my-5">
          <div className="flex flex-col mx-5 my-5">
            <h3 className='mx-5 my-5'>{user.Username}</h3>
            <button type="button" className="border-4 hover:border-black" onClick={openCallPhone}>chat</button>
          </div>
          <div className="my-3" >
          <div className="my-5 bg-gray-100" dangerouslySetInnerHTML={{ __html: user.publicString }} ></div>
          </div>
        </div>

        <div className="bg-gray-100" >
          {Object.keys(user.topics).map((folder) => 
            <div>
              <Link key={folder} href={"/" + user.Username + "/" + folder}><a >{folder}</a></Link>
            </div>
          )}
        </div>
            <div>
            <div className="my-5 bg-gray-100" dangerouslySetInnerHTML={{ __html: topic }} ></div>
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

      for (const key in user.topics) {
        if (key === params.topic) {
          topic = user.topics[key].S
        }
    }    
  }})
  return {props: { user: user, topic: topic } }
}