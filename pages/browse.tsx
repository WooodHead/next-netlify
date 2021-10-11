import Link from 'next/link'
import API from '@aws-amplify/api'
import { useRouter } from 'next/router'
import '../configureAmplify'
import { getBrowseTopics } from '../components/[id]/getNotionRecord'

const Users = ({ allTopics }) => {
  const router = useRouter()


  const clickTopic = (usernameProp) => {
    router.push(usernameProp)
  }
  return (
    <>
      <div className="flex-1">
        {allTopics.map((topic) => {
          return (
            <div
              className="flex mx-5 my-5 bg-gray-100 cursor-pointer hover:bg-gray-200"
              onClick={() => clickTopic(topic.username + '/' + topic.titleUrl)}
              key={topic.titleUrl}
            >
              {/* <img src={user.image} className="p-2"></img> */}
              <div className="mx-5 my-2">

                <Link
                  href={`/${encodeURIComponent(topic.username + '/' + topic.titleUrl)}`}
                >
                  <a>{topic.title}</a>
                </Link>
                <div
                  className="flex flex-row overflow-auto"
                >
                </div>
              </div>
            </div>
          )
        })}
        <div className="m-10">Browse page currently under development</div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  // const allUsersInit = { body: { Authorization: "all" } }
  const allUsers = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUsers", {})
  const topicArray = []
  for (const user of allUsers) {
    const notionPages = await getBrowseTopics(user.notionId, user.username)
    notionPages && topicArray.push(...notionPages)
  }
  return { props: { allTopics: topicArray }, revalidate: 1 }
}

export default Users
