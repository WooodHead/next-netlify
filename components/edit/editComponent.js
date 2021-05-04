import React, { useState } from 'react'
import '../../configureAmplify'
import "../../node_modules/react-quill/dist/quill.snow.css"
import NavbarComp from '../navbar/navbar'
import PublicString from './publicString'
import TopicComponent from './topicComponent'
import EditTAVScomp from './tavs'
import { turnBracketsToAlt } from '../../components/custom/keyToImage'
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

  const selectTopic = (topicProp) => {
    // console.log(turnBracketsToAlt(topicProp.string))
    if (topicProp.topicId === selectedTopicState.topicId) {
      setSelectedTopicState({
        topicId: '',
        title: '',
        string: '',
        quill: '',
        editing: false
      })
    } else {
      props.setSelectedTopicState({
        title: topicProp.title,
        string: turnBracketsToAlt(topicProp.string),
        quill: topicProp.string,
        editing: false,
        topicId: topicProp.topicId
      })
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