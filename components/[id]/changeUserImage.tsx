import API from '@aws-amplify/api'
import Auth from '@aws-amplify/auth'
import Storage from '@aws-amplify/storage'
import { v4 as uuidv4 } from 'uuid'

import { useEffect, useRef, useState } from 'react'

  const ChangeUserImage = (props) => {
    const user = props.user

    const [state, setState] = useState({
      isUser: null,
      loadingImg: false
    })

    const imageHandler = async (event) => {
      /* THIS IS FOR USER IMAGE */
      setState({...state, loadingImg: true})
      // I should add an "only this type of image", serverless image handler wont return anything not correct
      const file = event.target.files[0]
      const fileType = file.name.match(/\.[0-9a-z]+$/i)
      try {
        const fileKey: string = uuidv4() + fileType
        const putS3: any = await Storage.put(fileKey, file)
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
        console.log(convertedUrl)
        const stringInit = {
          headers: { Authorization: userSession.getIdToken().getJwtToken() },
          body: {
            string: convertedUrl,
          }
        }
        const saveUrl = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/saveUserImage', stringInit)
        setState({...state, loadingImg: false})
      } catch (err) {
        console.log('storage err', err)
        setState({...state, loadingImg: false})
      }
    }

    const isOwnPage = async () => {
      try {
        const userAuth = await Auth.currentAuthenticatedUser()
        if (user.Username === userAuth.username) {
          setState({...state, isUser: userAuth.username})
        }
      } catch {}
    }

    useEffect(() => {
      isOwnPage()
    }, [])

    return (
      state.isUser 
      ? <div className="">
        <input type="file" onChange={e => imageHandler(e)}></input>
      </div> : null
    )
  }

  export default ChangeUserImage