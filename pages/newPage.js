import React, { useEffect, useState }  from 'react'
import Amplify, { API, Auth } from 'aws-amplify'
import '../configureAmplify'
import "../node_modules/react-quill/dist/quill.snow.css"
import NavbarComp from '../components/navbar/navbar'
import dynamic from 'next/dynamic'
// const PublicString = dynamic(() => import('../components/edit/publicString'),{ ssr: false })
// const Topics = dynamic(() => import('../components/edit/topics'),{ ssr: false })

export default function NewPage() {

  const user = {
    Username: "user number hasn't been assigned",
    active: false,
    busy: false,
    folders: [],
    ppm: 0,
    ratingAv: null,
    publicString: null,
    topics: {},
  }
  return (
    <>
    <NavbarComp />
    <div className="mx-5">
      {/* <PublicString user={user}/>
      <Topics user={user} /> */}
    </div>
    </>
  )

}