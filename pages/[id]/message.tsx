import React, { useEffect, useReducer, useRef, useState } from "react";
import API from '@aws-amplify/api'
import '../../configureAmplify'
import Head from 'next/head';
import dynamic from 'next/dynamic'
import CustomSpinner from '../../components/custom/spinner'
import { useRouter } from 'next/router'
import Error from 'next/error'

import PaidCall from "../../components/[id]/message/paidCall"
import UnpaidCall from "../../components/[id]/message/unpaidCall"
// const DynamicMessageComponent = dynamic(
//   () => import('../../components/[id]/message/unpaidCall'),
//   { ssr: false }
// )

const Message = () => {

  const [state, setState] = useState({
    username: null,
    active: true,
    busy: false,
    ppm: 0 as Number,
    loading: true
  })

  const router = useRouter()
  
  useEffect(() => {
    const getUserFromURL = async () => {
      try {
        const idMaybe = window.location.pathname.match(/\/(.+?)\//) || window.location.pathname.match(/\/(.+)/)
        const getUserInit = { body: { username: idMaybe[1] } }
        const getUser = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUser", getUserInit)
        setState({
          username: getUser.username,
          active: getUser.active,
          busy: getUser.busy,
          ppm: Number(getUser.ppm),
          loading: false
        })
      } catch (err) {
        console.log(err)
        setState({ ...state, username: '' })
    }
  }
  console.log(state.ppm)

    getUserFromURL()
    const date = new Date()
    const timeStart = date.getTime()
    window.addEventListener('beforeunload', function () {
      const date = new Date()
      const timeEnd = date.getTime()
      const timeDifference = (timeEnd - timeStart) * .001
      //@ts-ignore
      window && window.dataLayer && window.dataLayer.push({ event: 'beforeunload', lengthOfTime: timeDifference })
    })
  }, [])

  return (
    <div>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
        <script src="https://static.opentok.com/v2.20.1/js/opentok.min.js"></script>
      </Head>
      {state.loading ? <div className="flex justify-center m-40"><CustomSpinner /></div> 
      : state.busy 
      ? <div className="flex mt-40 justify-cetner">User busy</div> 
      : !state.active 
      ? <div className="flex mt-40 justify-cetner">User offline</div> 
      : state.ppm 
      ? <PaidCall targetUser={state.username}/>
      : state.username === ''
      ? <Error statusCode={404}></Error> 
      : state.username 
      ? <UnpaidCall targetUser={state.username}/> 
      : null}
    </div>
  )
}

export default Message
