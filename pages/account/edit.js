import React, { useEffect, useRef, useState } from 'react'
import Amplify, { API, Auth } from 'aws-amplify'
import '../../configureAmplify'
import "../../node_modules/react-quill/dist/quill.snow.css"
import NavbarComp from '../../components/navbar/navbar'
import dynamic from 'next/dynamic'
// import TopicString from '../../components/edit/topicString'
const TopicString = dynamic(() => import('../../components/edit/topicString'), { ssr: false })
// const Topics = dynamic(() => import('../../components/edit/topics'),{ ssr: false })
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function Edit() {

  const [userState, setUserState] = useState({
    Username: 'loading...',
    ppm: 'loading...',
    ratingAv: 'loading...',
    publicString: 'loading...',
    topics: [],
  })
  const [publicStringState, setPublicStringState] = useState()
  const [editPubStringState, setEditPubStringState] = useState()
  const [publicQuillState, setPublicQuillState] = useState()
  const [topicQuillState, setTopicQuillState] = useState()
  const [savedState, setSavedState] = useState()
  const [topicState, setTopicState] = useState([])
  const [selectedTopicState, setSelectedTopic] = useState({topic: '', string: ''})
  const [newTopicState, setNewTopicState] = useState(false)
  const [editTopicState, setEditTopicState] = useState()
  const [savedTopicState, setSavedTopicState] = useState()
  const topicInputRef = useRef()

  const typingFn = (e) => {
    setPublicQuillState(e)
    setSavedState(false)
  }
  const onCloseEdit = () => {
    setEditPubStringState(false)
    setSavedState(false)
    getUserData()
  }
  const topicTypingFn = (e) => {
    setTopicQuillState(e)
    setSavedTopicState(false)
  }
  const onCloseTopicEdit = () => {
    setEditTopicState(false)
    setSavedTopicState(false)
  }

  const getUserData = async () => {
    const userSession = await Auth.currentAuthenticatedUser()
    const getUserInit = {
      headers: {
        Authorization: userSession.attributes.preferred_username
      }
    }
    try {
      const getAllUsersRes = await API.get(process.env.apiGateway.NAME, "/users", getUserInit)
      const topicsArray = []
      for (const topicKey in getAllUsersRes.Item.topics.M) {
        topicsArray.push({
          topic: topicKey,
          string: getAllUsersRes.Item.topics.M[topicKey].S
        })
      }
      const user = {
        Username: getAllUsersRes.Item.Username.S,
        active: getAllUsersRes.Item.active.BOOL,
        busy: getAllUsersRes.Item.busy.BOOL,
        folders: getAllUsersRes.Item.folders?.SS || [],
        ppm: getAllUsersRes.Item.ppm.N,
        ratingAv: getAllUsersRes.Item.ratingAv?.S || null,
        publicString: getAllUsersRes.Item.publicString?.S || null,
        topics: topicsArray,
      }
      setUserState(user)
      setPublicStringState(getAllUsersRes.Item.publicString.S)
      setPublicQuillState(getAllUsersRes.Item.publicString.S)
      setTopicState(topicsArray)
    } catch (err) {
      console.log(err)
    }
  }

  const savePublicString = async () => {
    try {
      const userSession = await Auth.currentSession()
      const stringInit = {
        headers: { Authorization: userSession.idToken.jwtToken },
        body: {
          stringType: 'publicString',
          string: `` + publicQuillState
        }
      }
      const savedString = await API.post(process.env.apiGateway.NAME, '/saveStrings', stringInit)
      setSavedState(true)
      setUserState({ ...userState }, { publicString: savedString.body })
    } catch (err) {
      console.log(err)
    }
  }

  const saveTopicString = async () => {
    console.log(selectedTopicState.topic, topicQuillState)
    try {
      const userSession = await Auth.currentSession()
      const stringInit = {
        headers: { Authorization: userSession.idToken.jwtToken },
        body: {
          new: false,
          deleteTopic: false,
          topic: selectedTopicState.topic,
          string: `` + topicQuillState
        }
      }
      const savedString = await API.post(process.env.apiGateway.NAME, '/topics', stringInit)
      setSavedTopicState(true)
      console.log(savedString)
      // setStringState(savedString.body)
    } catch (err) {
      console.log(err)
    }
  }

  const createNewTopic = async () => {
    const userSession = await Auth.currentSession()
    const newTopicParams = {
      headers: { Authorization: userSession.idToken.jwtToken },
      body: {
        new: true,
        deleteTopic: false,
        topic: topicInputRef.current.value,
        string: null
      }
    }
    const newTopicRes = await API.post(process.env.apiGateway.NAME, '/topics', newTopicParams)
    console.log(newTopicRes)
    setTopicState([...userState.topics, newTopicRes.body])
    setNewTopicState(true)
    setSelectedTopic(newTopicRes.body)
  }

  const deleteTopic = async (topicProp) => {
    console.log(topicProp)
    const userSession = await Auth.currentSession()
    const deleteTopicParams = {
      headers: { Authorization: userSession.idToken.jwtToken },
      body: {
        new: true,
        deleteTopic: true,
        topic: topicProp,
        string: null
      }
    }
    await API.post(process.env.apiGateway.NAME, '/topics', deleteTopicParams)
    setTopicState(topicState.filter((topicObj) => topicObj.topic !== topicProp))
  }

  const selectTopic = (topicProp) => {
    console.log(topicProp)
    setSelectedTopic(topicProp)
  }

  useEffect(() => {
    getUserData()
  }, [])

  return (
    <>
      <NavbarComp />
      <div className="mx-5">
        <div className="flex flex-row bg-gray-100 my-5">
          <div className="flex flex-col mx-5 my-5">
            <h3 className='mx-5 my-5'>{userState.Username}</h3>
          </div>

          {editPubStringState
            ? <div>
              <ReactQuill value={publicQuillState} onChange={typingFn} />
              <button onClick={onCloseEdit} >close</button>
              <button onClick={savePublicString} >save</button>
              {savedState && <div className="">
                <div>
                  saved
            </div>
              </div>}
            </div>
            : <div className="my-3" >
              <div>
                <div className="mx-3 my-3" dangerouslySetInnerHTML={{ __html: publicStringState }} ></div>
              </div>
              <div>
                <button
                  className="border-2 hover:border-black"
                  onClick={() => setEditPubStringState(true)}
                >
                  edit
            </button>
              </div>
            </div>
          }

        </div>
        <div className="bg-gray-100" >
          {topicState.map((topicObj) =>
            <div key={topicObj.topic} >
              <button onClick={() => selectTopic(topicObj)} href={"/" + userState.Username + '/topic'}>
                <a className="border-2 hover:border-black">{topicObj.topic}</a>
              </button>
            </div>
          )}
          <input ref={topicInputRef}  ></input>
          <button onClick={createNewTopic}>create new topic</button>
        </div>
        <div className="my-5 bg-gray-100">
          <div>{selectedTopicState?.topic}</div>

          {editTopicState || newTopicState
            ? <div>
              <ReactQuill value={topicQuillState} onChange={topicTypingFn} />
              <button onClick={onCloseTopicEdit} >close</button>
              <div className="border-2 my-3 mx-3 hover:border-black">
                <button onClick={() => saveTopicString(true)}>
                  save
            </button>
              </div>
              {savedTopicState && <div className="">
                <div>
                  saved
            </div>
              </div>}
            </div>
            : <div>
              <div className="mx-3 my-3" dangerouslySetInnerHTML={{ __html: selectedTopicState?.string }} ></div>
              <button onClick={() => setEditTopicState(true)}>
                <div className="border-2 my-3 mx-3 hover:border-black">edit</div>
              </button>
              <button onClick={() => deleteTopic(selectedTopicState?.topic)}>
                <div className="border-2 my-3 mx-3 hover:border-black">delete</div>
              </button>
            </div>
          }

        </div>
      </div>
    </>
  )
}