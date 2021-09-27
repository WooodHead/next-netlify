
import React, { useState } from 'react';
import API from '@aws-amplify/api'
import '../../configureAmplify'
import CustomSpinner from '../../components/custom/spinner'
import { useRouter } from "next/router";
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';


const CardTip = props => {

  const tipAmountProp = props.amount
  const callerNumberState = props.callerNumberState
  const cardOnFile = props.cardOnFile
  const last4 = props.last4
  const stripeState = props.stripeState
  // const hasLoaded = props.hasLoaded
  
  const [tipErrorState, setTipErrorState] = useState('')
  const [useCardOnFile, setUseCardOnFile] = useState(false)

  const receiver = props.receiver

  const setPaymentState = (paymentParam) => {
    props.setPaymentState(paymentParam)
  }

  const CardComponent = () => {
    const [cardSubmitting, setCardSubmitting] = useState(false)
    const stripe = useStripe();
    const elements = useElements();

    const submitCard = async (e) => {
      e.preventDefault();
      // const amountInputDOM = document.getElementById("amountInput")
      try {
        setCardSubmitting('submitting')
        // amountInputDOM.disabled = true
        const myInit = { body: {
          amount: tipAmountProp * 100,
          receiver: receiver,
          caller: callerNumberState,
          usingCardOnFile: cardOnFile
        } }
        const clientSecret = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/createTipIntent', myInit);
        if (clientSecret.err === "User does not exist") {
          setTipErrorState('User does not exist')
        }
        if (clientSecret.body === "Payment Succeeded") {
          setPaymentState('Csucceeded')
          return
        }
        if (!stripe || !elements) {
          return //stripe hasn't loaded yet
        }
        // const paymentMethod = (useCardOnFile) ? newPMFromFile : { card: elements.getElement(CardElement) }
        const cardResult = await stripe.confirmCardPayment("" + clientSecret.body, {
          payment_method: { card: elements.getElement(CardElement) }
        })
        if (cardResult.paymentIntent.status === 'succeeded') {
          setCardSubmitting('succeeded')
          setPaymentState('Csucceeded')
        }

      } catch (err) {
        console.log(err)
        setCardSubmitting('failed')
        setPaymentState("failed")
        // amountInputDOM.disabled = false
      }
    }
    return (
      <div>
        <form onSubmit={submitCard} style={{width: '420px'}}>
          <CardElement
          
            className="mt-4"
            options={{ 
              disabled: useCardOnFile, 
              // || hasLoaded
              style: { base: { 
                fontSize: "16px",
                // backgroundColor: '#DADDFF'
              }} 
            }}
          />
          {cardOnFile &&
            <div className="mt-2" >
              <input
                onClick={() => setUseCardOnFile(!useCardOnFile)}
                type="checkbox"
                defaultChecked={useCardOnFile}
              /> use card {last4}
            </div>
          }
          <div className="mt-3">
            <button disabled={(cardSubmitting === 'submitting')}>submit</button>
            {(cardSubmitting === 'submitting') && <CustomSpinner />}
            {(cardSubmitting === 'succeeded') && <span role="img" aria-label="checkmark"> ✔️</span>}
            {(cardSubmitting === 'failed') && <span role="img" aria-label="X"> ❌</span>}
            <span style={{ color: 'red' }} >{" " + tipErrorState}</span>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div id="cardParent" className="mb-2">
      <Elements stripe={stripeState} >
        <CardComponent />
      </Elements>
      <button onClick={() => setPaymentState('amount')} className="mt-2 btn btn-link"><small>change amount?</small></button>
    </div>
  )
}

export default CardTip;
