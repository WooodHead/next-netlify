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
    // topicTitleArray: [],
    recommendedTopic: {},
    topics: [],
    loading: true
  })
  const router = useRouter()
  const topicClick = (urlProp) => {
    router.push("/" + user.Username + "/" + urlProp)
  }

  useEffect(() => {
    // router format
    const getAssumedUser = async () => {
      try {
        const idMaybe = router.asPath.match(/\/(.+?)\//) || router.asPath.match(/\/(.+)/)
        const badTopic = router.asPath.match(/\/.+\/(.+)/) || [null, null]
        const specificUserInit = { headers: { Authorization: idMaybe[1] } }

        const getUserRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", specificUserInit)
        const topicTitlesList = []
        const topicsList = []
        let recommendedTopic
        for (const [key, properties] of Object.entries(getUserRes.Item.topics.M)) {
          if (!properties.M.draft.BOOL) {
            topicTitlesList.push(properties.M.title.S)
            topicsList.push(properties.M)
          }
        }
        const bestMatch = badTopic ? stringSimilarity.findBestMatch(badTopic[1], topicTitlesList) : null
        for (const [key, properties] of Object.entries(getUserRes.Item.topics.M)) {
          console.log(properties)
          if (properties.M.title.S === bestMatch.bestMatch.target) {
            recommendedTopic = {
              // draft: properties.M.draft.BOOL,
              // lastSave: properties.M.lastSave.S,
              // string: properties.M.string.S,
              title: properties.M.title.S
            }
            console.log('recommendedTopic', recommendedTopic)
          }
        }
        setState({
          ...state,
          username: getUserRes.Item.Username.S,
          // topicTitleArray: topicTitlesList,
          recommendedTopic: recommendedTopic,
          topics: topicsList,
          loading: false
        })
      } catch (err) {
        console.log(err)
      }
    }
    
    getAssumedUser()
  }, [])
  console.log(state)
  
  return <>
    <NavbarComp />
    <div className="flex flex-col">
      <div className="flex justify-center text-3xl my-44">404 - Page Not Found</div>
      <div className="flex justify-center my-8">Maybe the page moved:</div>
      {state.loading ? <CustomSpinner />: <div></div>}
      {/* <div 
        className="max-w-3xl px-2 py-1 my-3 rounded shadow-md cursor-pointer mx-7 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:ring-opacity-75"
        onClick={() => topicClick(state.recommendedTopic.titleURL.S ? state.recommendedTopic.titleURL.S : state.recommendedTopic.title.S)}>
        <div className="flex flex-row">
          <div className="flex-shrink-0">
            <img src={state.recommendedTopic}></img>
          </div>
          <div className="flex-col ml-3 ">
            <Link href={state.recommendedTopic.titleURL.S
              ? "/" + state.username + "/" + state.recommendedTopic.titleURL.S
              : "/" + state.username + "/" + state.recommendedTopic.title.S}
            >
              <a className="font-semibold sm:text-2xl">{state.recommendedTopic.title.S}</a>
            </Link>

            <div>{topicObj.description}</div>
          </div>
        </div>
      </div> */}
    </div>

  </>
}