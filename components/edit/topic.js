import React from 'react'
import { API, Auth, Storage } from 'aws-amplify'
import dynamic from 'next/dynamic'
import CustomSpinner from "../custom/spinner"
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false })

export default function PublicString(props) {
  const selectedTopicState = props.selectedTopicState
  const setSelectedTopicState = (e) => props.setSelectedTopicState(e)
  const userState = props.userState
  const setUserState = (e) => props.setUserState(e)
  const getUserData = () => props.getUserData()
  const setErrorState = (e) => props.setErrorState(e)

  const topicTypingFn = (e) => {
    setSelectedTopicState({ ...selectedTopicState, quill: e, saved: false})
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
  const deleteTopic = async (topicProp) => {
    const userSession = await Auth.currentSession()
    const deleteTopicParams = {
      headers: { Authorization: userSession.idToken.jwtToken },
      body: {
        new: true,
        deleteTopic: true,
        topic: topicProp,
        ogTopic: topicProp,
        string: null
      }
    }
    const deleteTopicRes = await API.post(process.env.apiGateway.NAME, '/topics', deleteTopicParams)
    deleteTopicRes.status === 200 
      ? setUserState({...userState, topics: userState.topics.filter((topicObj) => topicObj.topic !== topicProp)})
      : console.log('delete failed')
  }

  const saveTopicString = async () => {
    uploadImage()
    /*change to s3 url */
    const stringWithoutImg = selectedTopicState.quill.replace(/<img .*?>/, `{key: ${userState.Username}}`)
    /**/ 
    const escapedString = stringWithoutImg.replaceAll('"', '\\"')
    setSelectedTopicState({ ...selectedTopicState, saved: 'saving'})
    try {
      const userSession = await Auth.currentSession()
      const stringInit = {
        headers: { Authorization: userSession.idToken.jwtToken },
        body: {
          // new: false,
          deleteTopic: false,
          ogTopic: selectedTopicState.ogTopic,
          topic: selectedTopicState.topic,
          string: escapedString
        }
      }
      const savedTopicRes = await API.post(process.env.apiGateway.NAME, '/topics', stringInit)
      if (savedTopicRes.status === 200) {
        setSelectedTopicState({...selectedTopicState, saved: "saved"})
        getUserData()
      } else {
        if (savedTopicRes.err.message === "ExpressionAttributeNames contains invalid value: Empty attribute name for key #DE") {
          setErrorState('topic cannot be left blank')
        }
        console.log(savedTopicRes)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function uploadImage(e) {
    const buf = Buffer.from(selectedTopicState.quill.replace(/^data:image\/\w+;base64,/, ""),'base64')
    console.log(buf)
    const data = {
      Key: userState.Username,
      Body: buf,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg'
    }
    const s3res = await Storage.vault.put(data.Key, data)
        console.log('s3 res: ', s3res)
  }

  const imageHandler = (e) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click()

    // Listen upload local image and save to server
    input.onchange = async () => {
      const file = input.files[0];
      // file.name = {username} + '-' + file.name

      // file type is only image.
      if (/^image\//.test(file.type)) {
        // saveToServer(file);
        console.log(file)


        const s3res = await Storage.vault.put(file.name, file)
        console.log('s3 res: ', s3res)
        const getS3 = await Storage.vault.get(s3res.key)
        console.log('gets3: ', getS3)
        const stringPushed = selectedTopicState.quill + getS3
        console.log(selectedTopicState.quill)
        setSelectedTopicState({ ...selectedTopicState, quill: stringPushed})
        // push image url to rich editor.
        // const range = editor.getSelection();
        // editor.insertEmbed(range.index, 'image', `http://localhost:9000${url}`);
      } else {
        console.warn('You could only upload images.');
      }
    }
  }

  const modules = {
    toolbar:  {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'bullet'}],
        [ 'image' ]
      ],
      // handlers: {
      //   image: imageHandler
      // }
    },
  }

  return (
    <div>
      {selectedTopicState.editing
        ? <div>
          <input type="text" onChange={(e) => setSelectedTopicState({ ...selectedTopicState, topic: e.target.value })} value={selectedTopicState.topic} />
          <ReactQuill 
          modules={modules} 
          value={selectedTopicState.quill} 
          onChange={topicTypingFn} />

          <div className="flex flex-row">
            <div className="flex flex-row mr-10" >
            <button onClick={() => saveTopicString()}>save</button>
            {selectedTopicState.saved === "saving" && <CustomSpinner />}
          {selectedTopicState.saved === "saved" && <div className="">
            <div>
              saved
            </div>
          </div>}
          </div>
            <button className="mr-10" onClick={onCloseTopicEdit} >close</button>
            <button className="mr-10" onClick={() => deleteTopic(selectedTopicState.topic)}>delete</button>
          </div>


        </div>

        : <div>
          <div>{selectedTopicState.topic}</div>
          <div className="mx-3 my-3" dangerouslySetInnerHTML={{ __html: selectedTopicState.string }} ></div>
          <button onClick={() => setSelectedTopicState({ ...selectedTopicState, editing: true })}>
            <div>edit</div>
          </button>

        </div>

      }
    </div>

  )
}