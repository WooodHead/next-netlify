import React, { useEffect, useRef, useState } from 'react'
import Amplify, { API, Auth, Storage } from 'aws-amplify'
import '../../configureAmplify'
import "../../node_modules/react-quill/dist/quill.snow.css"
import NavbarComp from '../navbar/navbar'
import DOMPurify from 'dompurify';
import PublicString from './publicString'
import TopicComponent from './topicComponent'
import EditTAVScomp from './tavs'
import KeyToImage from '../custom/keyToImage'
import { v4 as uuidv4 } from 'uuid'

export default function Edit(props) {

  const publicStringState = props.publicStringState
  const setPublicStringState = (e) => { props.setPublicStringState(e) }
  const userState = props.userState
  const setUserState = (e) => { props.setUserState(e) }
  const getUserData = (e) => { props.getUserData(e)}
  const setSelectedTopicState = (stateProps) => props.setSelectedTopicState(stateProps)
  const selectedTopicState = props.selectedTopicState
  const setTavsState = (e) => { props.setTavsState(e) }
  const tavsState = props.tavsState

  const [errorState, setErrorState] = useState('')
  
  const createNewTopic = () => {
    setSelectedTopicState({
      topicId: uuidv4(),
      title: '',
      string: '',
      quill: '',
      editing: true
    })
  }

  const selectTopic = async (topicProp) => {
    try {
      const stringWithImages = await KeyToImage(topicProp.string)
      props.setSelectedTopicState({
        title: topicProp.title,
        string: stringWithImages,
        quill: stringWithImages,
        editing: false,
        topicId: topicProp.topicId
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      <NavbarComp />

      <div className="mx-5">

        <div className="flex flex-row my-5 bg-gray-100">
          <div className="flex flex-col mx-5 my-5">
            <h3 className='mx-5 my-5'>{userState.Username}</h3>
            {userState.TAVS}
            <EditTAVScomp
              userState={userState}
              tavsState={tavsState}
              setTavsState={setTavsState}
              getUserData={getUserData} />
          </div>
          <PublicString
            publicStringState={publicStringState}
            setPublicStringState={setPublicStringState} />
        </div>

        <div className="bg-gray-100" >
          {userState.topics.map((topicObj) =>
            <div key={topicObj.title} >
              <button className={topicObj.draft ? "bg-gray-300" : ""} onClick={() => selectTopic(topicObj)}>
                <a>{topicObj.title}</a>
              </button>
            </div>
          )}
          <button onClick={createNewTopic}>create new topic</button>
        </div>

        <div className="my-5 bg-gray-100">
          <TopicComponent
            {...props}
            getUserData={getUserData}
            selectedTopicState={selectedTopicState}
            setSelectedTopicState={setSelectedTopicState}
            userState={userState}
            setUserState={setUserState}
            setErrorState={setErrorState} />
          {errorState}
        </div>
        
      </div>
    </>
  )
}