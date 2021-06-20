import React, { useEffect, useReducer, useRef, useState } from "react";
import API from '@aws-amplify/api'
import '../../configureAmplify'
import Head from 'next/head';
import dynamic from 'next/dynamic'

const DynamicCallComponent = dynamic(
  () => import('../../components/[id]/call/callComponent'),
  { ssr: false }
)

const Call = ({ user }) => {

  const id = user.Username

  const deviceInputState = 'text'
  const allowedDevices = {
    text: true,
    audio: true,
    video: true,
    screen: true
  }

    return (
      <div>
        <Head>
        <meta name="robots" content="noindex, nofollow" />
        <script src="https://static.opentok.com/v2/js/opentok.min.js"></script>
        </Head>
        <DynamicCallComponent
          targetUser={id}
          folder={null}
          deviceInput={deviceInputState}
          allowedDevices={allowedDevices}
        />
      </div>
    )
}
export default Call

export async function getStaticPaths() {
  const allUsersInit = { headers: { Authorization: "all" } }
  const getAllUsersRes = await API.get(process.env.apiGateway.NAME, "/users", allUsersInit)
  const paths = getAllUsersRes.body.Items.map(user => {
    return { params: { id: user.Username.S } }
  })
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  let user
  const allUsersInit = { headers: { Authorization: "all" } }
  const getAllUsersRes = await API.get(process.env.apiGateway.NAME, "/users", allUsersInit)
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
  return { props: { user: user } }
}
