import React from 'react';

const PaymentNavbar = props => {
  const stripeState = props.stripeState
  const elements = props.elements

  const setPaymentState = (paymentParam) => {
    props.setPaymentState(paymentParam)
  }

  return (
      <div className="row">
        <div>
          <button 
            disabled={(props.paymentState === 'noReceiver') || (!stripeState)}
            onClick={() => setPaymentState('card')} 
            type="button" 
            className="btn btn-link"
          >Card</button>
        </div>
        <div>
          <button 
            disabled={(props.paymentState === 'noReceiver') || (!elements)}
            onClick={() => setPaymentState('pr')} 
            type="button" 
            className="btn btn-link"
          >Google Pay / Apple Pay</button>
        </div>
      </div>
  )
}

export default PaymentNavbar;
