import React, { useState } from 'react'
import '../../configureAmplify'
import "../../node_modules/react-quill/dist/quill.snow.css"
import NavbarComp from '../navbar/navbar'
import PublicString from './publicString'
import TopicComponent from './topicComponent'
import EditTAVScomp from './tavs'
import { turnBracketsToAlt } from '../custom/keyToImage'
import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import Storage from '@aws-amplify/storage'
import { v4 as uuidv4 } from 'uuid'
import CustomSpinner from '../custom/spinner'

export default function Edit(props) {
  const publicStringState = props.publicStringState
  const setPublicStringState = (e) => { props.setPublicStringState(e) }
  const userState = props.userState
  const setUserState = (e) => { props.setUserState(e) }
  const getUserData = () => { props.getUserData() }
  const setSelectedTopicState = (stateProps) => props.setSelectedTopicState(stateProps)
  const selectedTopicState = props.selectedTopicState
  const setTavsState = (e) => { props.setTavsState(e) }
  const tavsState = props.tavsState

  const [errorState, setErrorState] = useState('')
  const [loadingImageState, setLoadingImageState] = useState(false)

  const selectTopic = (topicProp) => {
    if (topicProp.topicId === selectedTopicState.topicId) {
      setSelectedTopicState({
        topicId: '',
        title: '',
        string: '',
        quill: '',
        editing: false,
        lastSave: ''
      })
    } else {
      let dateString = ''
      if (topicProp.lastSave) {
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"]
        const lastSaveDate = new Date(JSON.parse(topicProp.lastSave))
        const day = lastSaveDate.getDate()
        const month = lastSaveDate.getMonth()
        const year = lastSaveDate.getFullYear()
        dateString = '' + monthNames[month] + ' ' + day + ' ' + year
      }
      props.setSelectedTopicState({
        title: topicProp.title,
        string: turnBracketsToAlt(topicProp.string),
        quill: topicProp.string,
        editing: false,
        topicId: topicProp.topicId,
        lastSave: dateString
      })
    }
  }

  const imageHandler = async (event) => {
    /* THIS IS FOR USER IMAGE */
    setLoadingImageState(true)
    // I should add an "only this type of image", serverless image handler wont return anything not correct
    const file = event.target.files[0]
    const fileType = file.name.match(/\.[0-9a-z]+$/i)
    try {
      const fileKey: string = uuidv4() + fileType
      const putS3: any = await Storage.put(fileKey, file)
      console.log('@@', putS3)
      // const s3res = await putS3
      const jsonToUrl = {
        "bucket": process.env.NEXT_PUBLIC_STORAGE_BUCKET,
        "key": `public/${putS3.key}`,
        "edits": {
          smartCrop: {
            padding: 240
          },
          // roundCrop: true,
          "resize": {
            "width": 100,
            "height": 100,
            "fit": "cover"
          }
        }
      }
      const userSession = await Auth.currentSession()
      const converting = Buffer.from(JSON.stringify(jsonToUrl)).toString('base64')
      const convertedUrl = process.env.NEXT_PUBLIC_IMG_CLOUDFRONT + "/" + converting
      const stringInit = {
        headers: { Authorization: userSession.getIdToken().getJwtToken() },
        body: {
          stringType: 'urlString',
          string: convertedUrl,
          accessToken: userSession.getAccessToken().getJwtToken()
        }
      }
      const saveUrl = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/saveStrings', stringInit)
      setUserState({ ...userState, image: convertedUrl })
      getUserData()
      setLoadingImageState(false)
    } catch (err) {
      console.log('storage err', err)
      setLoadingImageState(false)
    }
  }

  return (
    <>
      {/* <NavbarComp /> */}

      <div className="mx-5">
        <div className="my-5 bg-gray-100">
          <div className="flex flex-row">
            <div className="flex flex-col mx-5 my-5">
              <img width="100" height="100" src={userState.image} ></img>
              <h3 className='mx-5 my-5'>{userState.Username}</h3>
              <div>
                <input type="file" onChange={(e) => imageHandler(e)} ></input>
                {loadingImageState && <CustomSpinner />}
              </div>
              {userState.TAVS}
              {/* <EditTAVScomp
                userState={userState}
                tavsState={tavsState}
                setTavsState={setTavsState}
                getUserData={getUserData} /> */}
            </div>

            <div className="flex-col hidden md:flex lg:flex xl:flex 2xl:flex">
              <PublicString
                publicStringState={publicStringState}
                setPublicStringState={setPublicStringState}
              />
              {userState.topics.map((topicObj) =>
                <div key={topicObj.title} >
                  <button className={topicObj.draft ? "bg-gray-300" : ""} onClick={() => selectTopic(topicObj)}>
                    <a>{topicObj.title}</a>
                  </button>
                </div>
              )}
            </div>


          </div>
          <div className="flex flex-col md:hidden">
          <PublicString
            publicStringState={publicStringState}
            setPublicStringState={setPublicStringState}
          />
          {userState.topics.map((topicObj) =>
            <div key={topicObj.title} >
              <button className={topicObj.draft ? "bg-gray-300" : ""} onClick={() => selectTopic(topicObj)}>
                <a>{topicObj.title}</a>
              </button>
            </div>
          )}
        </div>
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