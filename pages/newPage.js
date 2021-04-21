import React, { useState }  from 'react'
import '../configureAmplify'
import "../node_modules/react-quill/dist/quill.snow.css"
// import NavbarComp from '../components/navbar/navbar'
// import dynamic from 'next/dynamic'
// import PublicString from '../components/edit/publicString'
// import TopicComponent from '../components/edit/topics'
import EditComponent from '../components/newPage/edit'

export default function NewPage() {
  const [userState, setUserState] = useState({
    Username: "new user",
    active: false,
    busy: false,
    folders: [],
    TAVS: [],
    ppm: 0,
    ratingAv: null,
    publicString: '',
    topics: [],
  })
  // const [publicStringState, setPublicStringState] = useState({
  //   string: '',
  //   quill: '',
  //   editing: false,
  //   saved: false,
  //   createAccount: false
  // })
  // const [selectedTopicState, setSelectedTopicState] = useState({
  //   topic: '',
  //   ogTopic: '',
  //   string: '',
  //   quill: '',
  //   editing: false,
  //   saved: false
  // })
  return (
    <>
    < EditComponent userState={userState} />
    {/* <NavbarComp />
    <div className="mx-5">
        <div className="flex flex-row my-5 bg-gray-100">
          <div className="flex flex-col mx-5 my-5">
            <h3 className='mx-5 my-5'>{userState.Username}</h3>
          </div>
          <PublicString 
            publicStringState={publicStringState} 
            setPublicStringState={setPublicStringState}/>
        </div>
        <div className="bg-gray-100" >
          {userState.topics.map((topicObj) =>
            <div key={topicObj.topic} >
              <button onClick={() => selectTopic(topicObj)} href={"/" + userState.Username + '/topic'}>
                <a>{topicObj.topic}</a>
              </button>
            </div>
          )}
          <button onClick={createNewTopic}>create new topic</button>
        </div>
        <div className="my-5 bg-gray-100">
        <TopicComponent 
          selectedTopicState={selectedTopicState} 
          setSelectedTopicState={setSelectedTopicState}
          userState={userState}
          setUserState={setUserState}/>
        </div>
      </div> */}
    </>
  )

}