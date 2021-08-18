import API from '@aws-amplify/api'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import '../configureAmplify'
import NavbarComp from '../components/navbar/navbar'
import stringSimilarity from 'string-similarity'

export default function FourOhFour() {
  const [state, setState] = useState({
    username: '',
    topics: '',
    bestMatch: ''
  })
  const router = useRouter()
  
  useEffect(() =>{
    const getAssumedUser = async () => { 
      const idMaybe = router.asPath.match(/\/(.+?)\//)
      const badTopic = router.asPath.match(/\/.+\/(.+)/)

      const specificUserInit = { headers: { Authorization: idMaybe[1] } }
      const getUserRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", specificUserInit)
      const topicList = []
      for (const [key, properties] of Object.entries(getUserRes.Item.topics.M)) {
        if (!properties.M.draft.BOOL) {
        topicList.push(properties.M.title.S)
        }
      }
      const bestMatch = stringSimilarity.findBestMatch(badTopic[1], topicList)
      console.log('bestmatch', bestMatch.bestMatch.target)
      console.log('badtopic', badTopic[1])
      setState({...state, 
        username: getUserRes.Item.Username.S,
        topics: topicList,
        bestMatch: bestMatch.bestMatch.target
      })
    }

    getAssumedUser()
  }, [])
  
  return <>
    <NavbarComp />
    <div className="flex justify-center text-2xl">404 - Page Not Found</div>
    <div>Maybe you meant to visit talktree.me/{state.username}/{state.bestMatch}</div>
  </>
}