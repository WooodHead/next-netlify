
import React, { useState } from 'react';
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import '../../configureAmplify'
import CustomSpinner from '../../components/custom/spinner'
import { useRouter } from "next/router";

const Rating = props => {
    
    const [reviewSubmitting, setReviewSubmitting] = useState(false)
    const [rangeValue, setRangeValue] = useState('50')
    const [reviewErrorState, setReviewErrorState] = useState('')

    const receiver = props.receiver
    const ratingHandler = (event) => {
        setRangeValue(event.target.value)
      }

    const ratingAddHandler = async () => {
        setReviewSubmitting('submitting')
        try {
          const userSession = await Auth.currentSession()
          const ratingNumber = rangeValue / 10
          let myInit = {
            headers: { 'Authorization': userSession.idToken.jwtToken },
            body: {
              ratingNumber: ratingNumber,
              recipient: receiver
            }
          }
          const postReview = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/review', myInit)
          if (postReview?.errorType === 'ValidationException') {
            setReviewErrorState('User does not exist')
          } else if (postReview.body === 'success') {
            setReviewSubmitting('success')
          }
        } catch (err) {
          if (err === 'No current user') {
            setReviewErrorState('You must be logged in to leave a review, you can however leave a tip')
          }
          console.log(err)
          setReviewSubmitting(false)
        }
      }
    
    return (
        <div>
        <div>
        <h3 className="mt-3">leave a review</h3>
        </div>
        <div className="mt-5">
          <input
            type="range"
            min="1"
            max="99"
            defaultValue={rangeValue}
            onChange={ratingHandler}
            style={{ width: "250px" }}
          />
        </div>
        <div>
          {(rangeValue < 10) && <div>malicious</div>}
          {(rangeValue > 9 && rangeValue < 20) && <div>terrible</div>}
          {(rangeValue > 19 && rangeValue < 30) && <div>not good</div>}
          {(rangeValue > 29 && rangeValue < 40) && <div>meh, okay</div>}
          {(rangeValue > 39 && rangeValue < 50) && <div>decent</div>}
          {(rangeValue > 49 && rangeValue < 60) && <div>good</div>}
          {(rangeValue > 59 && rangeValue < 70) && <div>really good</div>}
          {(rangeValue > 69 && rangeValue < 80) && <div>great</div>}
          {(rangeValue > 79 && rangeValue < 90) && <div>amazing</div>}
          {(rangeValue > 89) && <div>better than amazing</div>}
        </div>
        <div className="mt-3">
          <button id="sendreview" onClick={() => ratingAddHandler()}>
            submit review
          </button>
          {(reviewSubmitting === 'submitting') && <CustomSpinner />}
          {(reviewSubmitting === 'success') && ' ✔️'}
          <span style={{color: 'red'}} >{" " + reviewErrorState}</span>
        </div>
        </div>
    )
        
}

export default Rating