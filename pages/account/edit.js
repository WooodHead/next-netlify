import React, { useEffect, useRef, useState } from 'react'
import Amplify, { API, Auth } from 'aws-amplify'
import '../../configureAmplify'
import "../../node_modules/react-quill/dist/quill.snow.css"
import NavbarComp from '../../components/navbar/navbar'
import dynamic from 'next/dynamic'
import DOMPurify from 'dompurify';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function Edit() {

  const [userState, setUserState] = useState({
    Username: 'loading...',
    ppm: 'loading...',
    ratingAv: 'loading...',
    publicString: 'loading...',
    topics: [],
  })
  const [publicStringState, setPublicStringState] = useState({
    string: '',
    quill: '',
    editing: false,
    saved: false
  })
  const [selectedTopicState, setSelectedTopicState] = useState({
    topic: '',
    string: '',
    quill: '',
    editing: false,
    saved: false
  })

  const publicTypingFn = (e) => {
    setPublicStringState({...publicStringState, quill: e, saved: false})
  }
  const topicTypingFn = (e) => {
    setSelectedTopicState({ ...selectedTopicState, quill: e, saved: false})
  }

  const onClosePublicEdit = async () => {
    try {
      const userSession = await Auth.currentAuthenticatedUser()
      const getUserInit = { headers: { Authorization: userSession.attributes.preferred_username } }
      const getAllUserRes = await API.get(process.env.apiGateway.NAME, "/users", getUserInit)
      console.log(getAllUserRes)
      const userResString = getAllUserRes.Item.publicString.S
      setPublicStringState({ ...publicStringState, string: userResString, editing: false, saved: false })
    } catch (err) {
      setPublicStringState({ ...publicStringState, editing: false, saved: false })
      console.log(err)
    }
  }
  const onCloseTopicEdit = async () => {
    try {
      const userSession = await Auth.currentAuthenticatedUser()
      const getUserInit = { headers: { Authorization: userSession.attributes.preferred_username } }
      const getAllUserRes = await API.get(process.env.apiGateway.NAME, "/users", getUserInit)
      const userResString = getAllUserRes.Item.topics.M[selectedTopicState.topic].S
      setSelectedTopicState({ ...selectedTopicState, string: userResString, editing: false, saved: false })
    } catch (err) {
      setSelectedTopicState({ ...selectedTopicState, editing: false, saved: false })
      console.log(err)
    }
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
          string: DOMPurify.sanitize(getAllUsersRes.Item.topics.M[topicKey].S)
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
      const sanitizedString = DOMPurify.sanitize(getAllUsersRes.Item.publicString.S)
      setPublicStringState({...publicStringState, string: sanitizedString, quill: sanitizedString})
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
          string: `` + publicStringState.quill
        }
      }
      const savedString = await API.post(process.env.apiGateway.NAME, '/saveStrings', stringInit)
      setPublicStringState({ ...publicStringState, string: savedString.body, saved: true })
    } catch (err) {
      console.log(err)
    }
  }

  const saveTopicString = async () => {
    const escapedString = selectedTopicState.quill.replaceAll('"', '\\"')
    // const escapedAgain = escapedString.replaceAll("\\", "\\\\")
    console.log(escapedString)
    try {
      const userSession = await Auth.currentSession()
      const stringInit = {
        headers: { Authorization: userSession.idToken.jwtToken },
        body: {
          new: false,
          deleteTopic: false,
          topic: selectedTopicState.topic,
          string: escapedString
        }
      }
      const savedString = await API.post(process.env.apiGateway.NAME, '/topics', stringInit)
      setSelectedTopicState({...selectedTopicState, saved: true})
    } catch (err) {
      console.log(err)
    }
  }

  const createNewTopic = async () => {
    setSelectedTopicState({
      topic: '',
      string: '',
      quill: '',
      editing: true
    })
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
    setUserState({...userState, topics: userState.topics.filter((topicObj) => topicObj.topic !== topicProp)})
  }

  const selectTopic = (topicProp) => {
    console.log(topicProp)
    setSelectedTopicState({
      topic: topicProp.topic,
      string: topicProp.string,
      quill: topicProp.string,
      editing: false
    })
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

          {publicStringState.editing
            ? <div>
              <ReactQuill value={publicStringState.quill} onChange={publicTypingFn} />
              <button onClick={onClosePublicEdit} >close</button>
              <button onClick={savePublicString} >save</button>

              {publicStringState.saved && <div className=""><div>saved</div></div>}

            </div>
            : <div className="my-3" >
              <div>
                <div className="mx-3 my-3" dangerouslySetInnerHTML={{ __html: publicStringState.string }} ></div>
              </div>
              <div>
                <button
                  className="border-2 hover:border-black"
                  onClick={() => setPublicStringState({...publicStringState, editing: true})}
                >
                  edit
            </button>
              </div>
            </div>
          }
        </div>
        <div className="bg-gray-100" >
          {userState.topics.map((topicObj) =>
            <div key={topicObj.topic} >
              <button onClick={() => selectTopic(topicObj)} href={"/" + userState.Username + '/topic'}>
                <a className="border-2 hover:border-black">{topicObj.topic}</a>
              </button>
            </div>
          )}
          <button onClick={createNewTopic}>create new topic</button>
        </div>
        <div className="my-5 bg-gray-100">


          {selectedTopicState.editing
            ? <div>
              <input type="text" onChange={(e) => setSelectedTopicState({...selectedTopicState, topic: e.target.value})} value={selectedTopicState.topic} />
              <ReactQuill value={selectedTopicState.quill} onChange={topicTypingFn} />
              <button onClick={onCloseTopicEdit} >close</button>
              <div className="border-2 my-3 mx-3 hover:border-black">
                <button onClick={() => saveTopicString(true)}>
                  save
            </button>
              </div>
              {selectedTopicState.saved && <div className="">
                <div>
                  saved
            </div>
              </div>}
            </div>
            : <div>
              <div>{selectedTopicState?.topic}</div>
              <div className="mx-3 my-3" dangerouslySetInnerHTML={{ __html: selectedTopicState?.string }} ></div>
              <button onClick={() =>  setSelectedTopicState({ ...selectedTopicState, editing: true })}>
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