import API from '@aws-amplify/api'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import '../configureAmplify'
import NavbarComp from '../components/navbar/navbar'
import stringSimilarity from 'string-similarity'
import CustomSpinner from '../components/custom/spinner'

export default function FourOhFour() {
  const [state, setState] = useState({
    username: '',
    recommendedTopic: null,
    topics: [],
    loading: true
  })
  const router = useRouter()
  const topicClick = (urlProp) => {
    router.push("/" + user.Username + "/" + urlProp)
  }

  useEffect(() => {
    const getAssumedUser = async () => {
      try {
        const idMaybe = router.asPath.match(/\/(.+?)\//) || router.asPath.match(/\/(.+)/)
        const badTopic = router.asPath.match(/\/.+\/(.+)/) || [null, null]

        const getUserInit = { body: { username: idMaybe[1] } }
        const getUser = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUser", getUserInit)
        const topicTitlesList = []
        let recommendedTopic
        const topicList = Object.values(getUser.topics)

        topicList.forEach((topicObj => {
          topicTitlesList.push(topicObj.title)
        }))

        const bestMatch = badTopic ? stringSimilarity.findBestMatch(badTopic[1], topicTitlesList) : null
        
        getUser.topics.forEach((topicObj) => {
          if (topicObj.title === bestMatch.bestMatch.target) {
            recommendedTopic = {
              topicId: topicObj.topicId,
              title: topicObj.title,
              titleURL: topicObj.titleURL,
              firstImage: topicObj.firstImage,
              description: topicObj.description
            }
          }
        })
        
        setState({
          ...state,
          username: getUser.username,
          recommendedTopic: recommendedTopic,
          topics: getUser.topics,
          loading: false
        })
      } catch (err) {
        console.log(err)
        setState({...state,
          username: null,
          loading: false
        })
      }
    }
    
    getAssumedUser()
  }, [])

  
  return <>
    <NavbarComp />
    <div className="flex flex-col">
      <div className="flex justify-center text-3xl my-44">404 - Page Not Found</div>
      <div className="flex justify-center my-8">Maybe the page moved:</div>
      {state.loading ? <div className="flex justify-center"><CustomSpinner  /></div>: <div></div>}
      {state.recommendedTopic? 
      <div className="flex justify-center"><div 
        className="max-w-3xl px-2 py-1 my-3 rounded shadow-md cursor-pointer mx-7 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
        onClick={() => topicClick(state.recommendedTopic.titleURL ? state.recommendedTopic.titleURL : state.recommendedTopic.title)}>
        <div className="flex flex-row">
          <div className="flex-shrink-0">
            {state.recommendedTopic.firstImage && <img width={100} height={100} src={state.recommendedTopic.firstImage}></img>}
          </div>
          <div className="flex-col ml-3 ">
            <Link href={state.recommendedTopic.titleURL
              ? "/" + state.username + "/" + state.recommendedTopic.titleURL
              : "/" + state.username + "/" + state.recommendedTopic.title}
            >
              <a className="font-semibold sm:text-2xl">{state.recommendedTopic.title}</a>
            </Link>

            <div>{state.recommendedTopic.description}</div>
          </div>
        </div>
      </div></div>: <div></div>}
    </div>

  </>
}