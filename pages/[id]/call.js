import React, { useEffect, useReducer, useRef, useState } from "react";
import { API, Auth } from 'aws-amplify'
import { Link, useParams } from "react-router-dom";
import OT from "@opentok/client"
import CallComponent from '../../components/call/callComponent'
import config from '../../config'

const Call = () => {
  const { id } = useParams();
  const tav = (id[7] ? id.slice(7, 8) : 'a')
  const folder = id[8] ? id.slice(8, id.length) : 'none'
  const receiver = id.slice(0, 7)
  const receiverRef = useRef()
  const callerRef = useRef('anonymous')

  let defaultInput
  switch (tav) {
    case 't': defaultInput = 'text'; break
    case 'v': defaultInput = 'video'; break
    case 's': defaultInput = 'screen'; break
    default: defaultInput = 'audio'
  }
  receiverRef.current = id.slice(0, 7)

  const [deviceInputState, setDeviceInputState] = useState(defaultInput);
  const [ppmState, setPPMstate] = useState(0)
  const [mobileState, setMobileState] = useState(false)
  const [callerHasCardState, setCallerHasCardState] = useState(false)
  const [errorState, setErrorState] = useState('init')
  const [phoneState, setPhoneState] = useState(false)
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
  });

  OT.checkScreenSharingCapability(function (response) {
    if (!response.supported || response.extensionRegistered === false) {
      console.log('this browser doesnt support screen sharing')
    }
  });

  const CustomRadioButton = (CRprops) => {
    return (
      <div
        className="mt-1 mb-2"
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (allowedDevices[CRprops.TAVS]) {
            setDeviceBadState(false)
            setDeviceInputState(CRprops.TAVS)
          }
        }
        }
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
    );
  }

  const ppmx04 = ppmState * 0.04 
  const firstMinFee = (0.02 + ppmState) * 0.04 
  const firstMin = (0.32 + firstMinFee + ppmState >= 0.5) ? 0.32 + firstMinFee + ppmState : 0.50
  const rounded = Math.round(firstMin * 100)
  const firstMinPrice = financial(rounded / 100)
  const subsequentPayment = financial(ppmx04 + ppmState)

  useEffect(() => {
    (async () => {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        setMobileState(true)
      }
      try {
        const authUser = await Auth.currentAuthenticatedUser()
        callerRef.current = authUser.attributes.preferred_username
      } catch { }

      try {
        /* this authorization isn't context, its header.params */
        const receiverGet = API.get(config.apiGateway.NAME, "/users", { headers: { Authorization: "" + receiverRef.current } })
        if (callerRef.current !== 'anonymous') {
          const callerGet = await API.get(config.apiGateway.NAME, "/users", { headers: { Authorization: "" + callerRef.current } })
          setCallerHasCardState(callerGet.Item.customer.BOOL)
        }
        const receiverGot = await receiverGet
        if (receiverGot.hasOwnProperty('Item')) {
          if (receiverGot.Item.active.BOOL === false) { setErrorState('offline') }
          if (receiverGot.Item.busy.BOOL === true) { setErrorState('busy') }
          setPPMstate(Number(receiverGot.Item.ppm.N))
          const rawDevices = receiverGot.Item.deviceInput.M
          for (const [device, bool] of Object.entries(rawDevices)) {
            if (bool.BOOL === true) {
              dispatchAllowedDevices(device)
            } else { /* if gotten device input is false , removed 'if (device === defaultInput)' */
              setDeviceBadState(true)
            }
          }
          if ((receiverGot.Item.active.BOOL === true) && (receiverGot.Item.busy.BOOL === false)) {
            setErrorState('good')
          }
        } else { setErrorState('nonexist') }
      } catch (err) {
        console.log(err)
      }
    })()
  }, [])

  if (phoneState) {
    return (
      <CallComponent
        targetUser={receiver}
        folder={folder}
        deviceInput={deviceInputState}
        // timer={converstationTime}
        allowedDevices={allowedDevices}
      />
    )
  } else {
    return (
      <div className="container">
        <div className="mt-1">Receiver: {receiver}</div>
        <div className="mt-1">Topic: {folder}</div>
        {ppmState === 0 &&
          <div className="mt-1 mb-3">Price: free</div>
        }
        {ppmState > 0 &&
          <div>
            <div className="mt-1">Price after fees: ${firstMinPrice} first minute</div>
            <div className="ml-3 mb-3">${subsequentPayment} each subsequent minute</div>
          </div>
        }
        < CustomRadioButton TAVS="text" />
        < CustomRadioButton TAVS="audio" />
        < CustomRadioButton TAVS="video" />
        < CustomRadioButton TAVS="screen" />
        {
          ((ppmState > 0 && callerHasCardState) && (errorState === 'good')) &&
          <button onClick={() => setPhoneState(true)} className="mt-3 mb-3">call</button>
        }
        {
          ((ppmState === 0 && (errorState === 'good')) && (!deviceBadState)) &&
          <button onClick={() => setPhoneState(true)} className="mt-3 mb-3">call</button>
        }
        {/* {authState && <div>calls are limited to 25 minutes</div>} */}
        {((ppmState > 0 && callerHasCardState) && (errorState === 'good')) &&
          <div>a call time of 1 minute 1 second is billed for 2 minutes</div>
        }
        {deviceBadState && <div>Choose an available device</div>}
        {mobileState && (deviceInputState === 'screen') && <div style={{ color: 'red' }}>mobile devices do not currently support screen publishing</div>}
        {(ppmState > 0 && !callerHasCardState) && <div><Link to='/i/billing'>You don't have a credit or debit card on file</Link></div>}
        {(callerRef.current === 'anonymous') && (errorState === 'good') &&
          <div>By pressing call, you agree to the <Link to="/i/policies">Privacy Policy and Terms of Service</Link></div>}
      </div>
    )
  }
}
export default Call;


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
