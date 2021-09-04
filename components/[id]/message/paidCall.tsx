import { useState } from 'react'
import dynamic from 'next/dynamic'
import API from '@aws-amplify/api'
import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
const DynamicMessageComponent = dynamic(
  () => import('./messageOtCaller'),
  { ssr: false }
)

export default function PaidCall(props) {
  const username = props.username
  const ppm = props.ppm
  const [cardState, setCardState] = useState(false)

  return (
    <>
    {cardState 
    ? <DynamicMessageComponent targetUser={username}/> 
    : <div>
      ENTER CARD
    </div>
    }
    <div className="flex justify-center my-32">This user costs ${ppm} per minute</div>
    </>
  )
}