
import React, { useRef, useState, useEffect } from 'react';
import { API, Auth } from 'aws-amplify';
import { useRouter } from "next/router";
import Rating from '../../components/review/rating'
import PaymentNavbar from '../../components/review/paymentNavbar'
import CardTip from '../../components/review/cardTip'
// import PRTip from '../../components/review/prTip'
import { loadStripe } from '@stripe/stripe-js';
import '../../configureAmplify'

// const DynamicCallComponent = dynamic(
//   () => import('../../components/review/callComponent'),
//   { ssr: false }
// )

const ReviewParent = props => {
  const [cardOnFile, setCardOnFile] = useState(null)
  const [callerNumberState, setCallerNumberState] = useState('anonymous')
  const [paymentState, setPaymentState] = useState('amount')
  const [stripeState, setStripeState] = useState()
  const [elementState, setElementState] = useState()
  const tipAmountRef = useRef(1.00)

  const receiver = props.user.Username


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

  useEffect(() => {
    (async () => {
      let stripeAccount
      try {
        /* get user receiver */
        const amountInputDOM = document.getElementById("amountInput")
        // const getUserParams = { headers: { Authorization: receiver } }
        const getReceiverParams = { body: { receiver: receiver } } 
        // const getUser = await API.get(config.apiGateway.NAME, '/users', getUserParams)
        const getUser = await API.post(process.env.apiGateway.NAME, '/getReceiver', getReceiverParams)
        if (getUser.body?.onBoarding !== 'finished') {
          setPaymentState('noReceiver'); amountInputDOM.disabled = true 
        }
          stripeAccount = getUser.body.account
        // }
      } catch (err) {
        console.log('couldnt get user')
      }
      try {
        /* load stripe */
        const stripe = await loadStripe(process.env.STRIPE_KEY, { stripeAccount: stripeAccount })
  
        setStripeState(stripe)
        try {
          const paymentRequest = stripe.paymentRequest({
            country: 'US',
            currency: 'usd',
            total: {
              label: `tipping user ${receiver}`,
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
        setCallerNumberState(authUser.attributes.preferred_username)
        const userSession = authUser.signInUserSession
        const getCardParams = { headers: { Authorization: userSession.idToken.jwtToken } }
        try {
          const getCardOnFile = await API.get(process.env.apiGateway.NAME, '/cards', getCardParams)
          setCardOnFile(getCardOnFile.body.Item.preferredCard)
        } catch { /* no card on file found */ }  
      } catch { /* user not logged in */ }
    })()
  }, [])

  return (
    <div className="container">
      <Rating receiver={receiver}/>
      <h3 className="mt-5">leave a tip</h3>
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
        <div className="mt-3">Tips can't be less than $0.50</div> 
      }
      {(paymentState === 'amountHigh') && 
        <div className="mt-3">The max is $500</div> 
      }
      {(paymentState === 'card') && 
        <CardTip
          receiver={receiver} 
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
  );
}

export default ReviewParent;

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