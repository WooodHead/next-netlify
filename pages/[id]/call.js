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
  const callerRef = useRef('anonymous')

  const [deviceInputState, setDeviceInputState] = useState('audio');
  const [mobileState, setMobileState] = useState(false)
  const [errorState, setErrorState] = useState('init')
  const [callingState, setCallingState] = useState(false)
  const [deviceBadState, setDeviceBadState] = useState(false)

  function financial(x) {
    return Number.parseFloat(x).toFixed(2);
  }

  const reducer = (curState, action) => {
    if (action === 'text') { return { ...curState, text: true } }
    if (action === 'audio') { return { ...curState, audio: true } }
    if (action === 'screen') { return { ...curState, screen: true } }
    if (action === 'video') { return { ...curState, video: true } }
  }
  const [allowedDevices, dispatchAllowedDevices] = useReducer(reducer, {
    text: false,
    audio: false,
    video: false,
    screen: false
  })

  const CustomRadioButton = (CRprops) => {
    return (
      <div
        className="mt-1 mb-2"
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (allowedDevices[CRprops.TAVS]) {
            setDeviceBadState(false)
            setDeviceInputState(CRprops.TAVS)
          } } }
      >
        <input className="mr-1"
          style={{ cursor: "pointer" }}
          disabled={!allowedDevices[CRprops.TAVS]}
          type="radio"
          name="device-input"
          checked={deviceInputState === CRprops.TAVS}
          onChange={() => setDeviceInputState(CRprops.TAVS)}
        />
        {CRprops.TAVS}
      </div>
    )
  }

  useEffect(() => {
    (async () => {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        setMobileState(true)
      }
      try {
        /* this authorization isn't context, its header.params; I'm stupidly using it to send data */
        const receiverGot = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME,"/users",{headers: {Authorization: id}})
        if (receiverGot.hasOwnProperty('Item')) {
          /* if receiver exists */
          const rawDevices = receiverGot.Item.deviceInput.M
          for (const [device, bool] of Object.entries(rawDevices)) {
            if (bool.BOOL === true) {
              dispatchAllowedDevices(device)
            } else { /* if gotten device input is false , removed 'if (device === defaultInput)' */
              setDeviceBadState(true)
            }
          }
        } else { setErrorState('nonexist') }
      } catch (err) { console.log(err) }
    })()
  }, [])

  if (callingState) {
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
  } else {
    return (
      <div className=" mx-5 my-2">
        <div className="text-3xl my-5 mx-5">Receiver: {id}</div>
        <div className="text-2xl my-5 mx-5">Price: ${user.ppm} per minute</div>
        {user.ppm > 0.00 && <div className="mx-5">with a $0.50 minimum</div>}
        <div className="text-xl my-5 mx-5">
        < CustomRadioButton TAVS="text" />
        < CustomRadioButton TAVS="audio" />
        < CustomRadioButton TAVS="video" />
        < CustomRadioButton TAVS="screen" />
        <button onClick={() => setCallingState(true)} className="my-10">Call</button>
        </div>
        {deviceBadState && <div>Choose an available device</div>}
        {mobileState && (deviceInputState === 'screen') && <div style={{ color: 'red' }}>mobile devices do not currently support screen publishing</div>}
      </div>
    )
  }
}
export default Call

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
        folders: userRes.folders?.SS || [],
        ppm: userRes.ppm.N,
        ratingAv: userRes.ratingAv?.S || null,
        publicString: userRes.publicString?.S || null
      }
    }
  })
  return { props: { user: user } }
}
