
import React, { useRef, useState, useEffect } from 'react';
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import Rating from './rating'
import PaymentNavbar from './paymentNavbar'
import CardTip from './cardTip'
// import PRTip from '../../components/review/prTip'
import { loadStripe } from '@stripe/stripe-js';
import '../../configureAmplify'
import Head from 'next/head'

// const DynamicCallComponent = dynamic(
//   () => import('../../components/review/callComponent'),
//   { ssr: false }
// )
// this is supposed to be a page, not in components, just removing for the time being

const ReviewParent = props => {
  const [cardOnFile, setCardOnFile] = useState(null)
  const [callerNumberState, setCallerNumberState] = useState('anonymous')
  const [paymentState, setPaymentState] = useState('amount')
  const [stripeState, setStripeState] = useState()
  const [elementState, setElementState] = useState()
  const tipAmountRef = useRef(1.00)
  const [userState, setUserState] = useState({
    username: null,
    active: null,
    busy: null,
    ppm: null,
    receiver: null
  })

  // const receiver = props.user.Username


  const setPayment = (paymentProp) => {
    
    const amountInputDOM = document.getElementById("amountInput")

    if (tipAmountRef.current.value < 0.5 || tipAmountRef.current.value > 500) {
      if (tipAmountRef.current.value > 500) {
        setPaymentState('amountHigh')
      } else {
        setPaymentState('amountLow')
      }
      amountInputDOM.disabled = false
      
    } else {
      setPaymentState(paymentProp)
      if (paymentProp === 'pr' || 'card') {
        amountInputDOM.disabled = true
      } 
      if (paymentProp === 'amount') {
        amountInputDOM.disabled = false
      }
    }
  }

  const getUserFromURL = async () => {
    try {
      const idMaybe = window.location.pathname.match(/\/(.+?)\//) || router.asPath.match(/\/(.+)/)
      const getUserInit = { body: { username: idMaybe[1] } }
      const getUser = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUser", getUserInit)
      setUserState({
        username: getUser.username,
        active: getUser.active,
        busy: getUser.busy,
        ppm: getUser.ppm,

      })
      return getUser.username
    } catch (err) {
      console.log(err)
      setUserState({ ...state, username: '' })
    }
  }
  

  useEffect(() => {
    (async () => {
      const username = await getUserFromURL()
      let stripeAccount
      try {
        /* get user receiver */
        const amountInputDOM = document.getElementById("amountInput")
        // const getUserParams = { headers: { Authorization: receiver } }
        const getReceiverParams = { body: { receiver: username } } 
        const getReceiver = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/getReceiver', getReceiverParams)
        if (getReceiver.body?.onBoarding !== 'finished') {
          setPaymentState('noReceiver'); amountInputDOM.disabled = true 
        }
          stripeAccount = getReceiver.body.account
        // }
      } catch (err) {
        console.log('couldnt get user')
      }
      try {
        /* load stripe */
        const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY, { stripeAccount: stripeAccount })
  
        setStripeState(stripe)
        try {
          const paymentRequest = stripe.paymentRequest({
            country: 'US',
            currency: 'usd',
            total: {
              label: `tipping user ${username}`,
              amount: tipAmountRef.current.value * 100
            },
          })
          const canMakePayment = await paymentRequest.canMakePayment()
          if (canMakePayment) {
            setElementState(stripe.elements())
          }
        } catch {}
      } catch (err) {
        console.log(err)
      }
      try { 
        /* does caller have cardOnFile */
        const authUser = await Auth.currentAuthenticatedUser()
        setCallerNumberState(authUser.username)
        const userSession = authUser.signInUserSession
        const getCardParams = { headers: { Authorization: userSession.idToken.jwtToken } }
        try {
          const getCardOnFile = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/cards', getCardParams)
          setCardOnFile(getCardOnFile.body.Item.preferredCard)
        } catch { /* no card on file found */ }  
      } catch { /* user not logged in */ }
    })()
  }, [])

  return (
    <>
    <Head>
    <meta name="robots" content="noindex, nofollow" />
    </Head>
    <div className="container m-5">
      <Rating receiver={userState.username}/>
      <div>
      <div className="mt-8 text-xl ">Leave a tip</div>
      <div className="mt-3">Amount</div>
      $<input 
      className="mt-1 mb-4"
        id="amountInput"
        disabled={false}
        ref={tipAmountRef}
        style={{width: "60px"}}
        type="number"
        step="0.01"
        min="0.50"
        max="500"
        defaultValue={(tipAmountRef.current?.value) ? tipAmountRef.current.value : (1.00).toFixed(2) }
      ></input>

      <PaymentNavbar
        stripeState={stripeState}
        setPaymentState={setPayment}
        paymentState={paymentState}
        elements={elementState}
      />
     
      {(paymentState === 'Csucceeded') && 
        <div className="mt-3">Payment success</div> /*had a ✔ */
      }
      {(paymentState === 'noReceiver') && 
        <div className="mt-3">User is unable to receive tips</div> 
      }
      {(paymentState === 'amountLow') && 
        <div className="mt-3">Tips can&apos;t be less than $0.50</div> 
      }
      {(paymentState === 'amountHigh') && 
        <div className="mt-3">The max is $500</div> 
      }
      {(paymentState === 'card') && 
        <CardTip
          receiver={userState.username} 
          stripeState={stripeState}
          amount={tipAmountRef.current.value} 
          callerNumberState={callerNumberState}
          cardOnFile={cardOnFile?.M.cardId.S}
          last4={cardOnFile?.M.last4.S}
          setPaymentState={setPayment}
          paymentState={paymentState}
        />
      }
      {/* {(paymentState === 'pr') && 
      <PRTip
        setPaymentState={setPayment}
        amount={tipAmountRef.current.value}
        stripeState={stripeState}
        receiver={receiver}
      />
      } */}
      {(paymentState === 'failed') &&
        <div>payment failed</div>}
      </div>

    </div>
    </>
  );
}

export default ReviewParent;

// export async function getStaticPaths() {
//   const allUsersInit = { headers: { Authorization: "all" } }
//   const getAllUsersRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", allUsersInit)
//   const paths = getAllUsersRes.body.Items.map(user => {
//     return { params: { id: user.Username.S } }
//   })
//   return {
//     paths,
//     fallback: false
//   }
// }

// export async function getStaticProps({ params }) {
//   let user
//   const allUsersInit = { headers: { Authorization: "all" } }
//   const getAllUsersRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", allUsersInit)
//   getAllUsersRes.body.Items.forEach((userRes) => {
//     if (userRes.Username.S === params.id) {
//       user = {
//         Username: userRes.Username.S,
//         active: userRes.active.BOOL,
//         busy: userRes.busy.BOOL,
//         ppm: userRes.ppm.N,
//         ratingAv: userRes.ratingAv?.S || null,
//         publicString: userRes.publicString?.S || null
//       }
//     }
//   })
//   return { props: { user: user } }
// }