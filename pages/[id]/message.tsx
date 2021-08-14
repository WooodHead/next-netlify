import React, { useEffect, useReducer, useRef, useState } from "react";
import API from '@aws-amplify/api'
import '../../configureAmplify'
import Head from 'next/head';
import dynamic from 'next/dynamic'
// import MessageOtComponent from "../../components/[id]/message/messageComponent"

const DynamicMessageComponent = dynamic(
  () => import('../../components/[id]/message/messageOtCaller'),
  { ssr: false }
)

const Message = ({ user }) => {

  const id = user.Username

  useEffect(() => {
    window.addEventListener('beforeunload', function() { 
    //@ts-ignore
    window && window.dataLayer && window.dataLayer.push({ event: 'beforeunload'}) })
  }, [])

  return (
    <div>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <script src="https://static.opentok.com/v2.20.1/js/opentok.min.js"></script>
        {/* <script dangerouslySetInnerHTML={{
          __html: `window.addEventListener('beforeunload', function() { 
            window.dataLayer.push({ event: 'beforeunload'});`
        }}></script> */}
      </Head>
      <DynamicMessageComponent
        targetUser={id}
      />
    </div>
  )
}
export default Message

export async function getStaticPaths() {
  const allUsersInit = { headers: { Authorization: "all" } }
  const getAllUsersRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", allUsersInit)
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
  const getAllUsersRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", allUsersInit)
  getAllUsersRes.body.Items.forEach((userRes) => {
    if (userRes.Username.S === params.id) {
      user = {
        Username: userRes.Username.S,
        active: userRes.active.BOOL,
        busy: userRes.busy.BOOL,
        ppm: userRes.ppm.N,
        ratingAv: userRes.ratingAv?.S || null,
        publicString: userRes.publicString?.S || null
      }
    }
  })
  return { props: { user: user } }
}
