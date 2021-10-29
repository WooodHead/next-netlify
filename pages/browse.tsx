import Link from 'next/link'
import API from '@aws-amplify/api'
import { useRouter } from 'next/router'
import '../configureAmplify'
import { getBrowseTopics } from '../utils/node/getNotionRecord'

const Users = ({ allTopics }) => {
  const router = useRouter()

  if (allTopics.length === 0) { return <div className="m-10 italic" >error, no topics!</div> }

  const defaultMapImageUrl = (url: string) => {
    if (!url) {
      return null
    }

    if (url.startsWith('data:')) {
      return url
    }

    if (url.startsWith('/images')) {
      url = `https://www.notion.so${url}`
    }

    // more recent versions of notion don't proxy unsplash images
    if (!url.startsWith('https://images.unsplash.com')) {
      url = `https://www.notion.so${url.startsWith('/image') ? url : `/image/${encodeURIComponent(url)}`
        }`

      const notionImageUrlV2 = new URL(url)

      url = notionImageUrlV2.toString()
    }

    return url
  }

  const Card = () => {
    return <>
      {allTopics.map((topic) => {
        const image: any = Object.values(topic.recordMap.block).find((block: any) => {
          return block.value?.type === "image"
        })
        const url = image?.value?.properties?.source[0]?.[0]
        const shit = defaultMapImageUrl(url)

        return (
          <div className="flex">
            <div className="flex-1"></div>


            <Link passHref
              href={`/${topic.username + '/' + topic.titleUrl}`}
            >
              <div
                className="flex-1 max-w-4xl mx-5 my-5 bg-gray-100 cursor-pointer hover:bg-gray-200"
                key={topic.titleUrl}
              >
                <img height={100} width={100} src={shit} />
                <div className="mx-5 my-2">
                  <a>{topic.title}</a>
                </div>
              </div>
            </Link>
            <div
              className="flex flex-row overflow-auto"
            >

            </div>
            <div className="flex-1"></div>
          </div>
        )
      })}
    </>
  }

  return (
    <>
      <div className="">
        <Card />
        <div className="m-10">Browse page currently under development</div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  try {
    const allUsers = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getUsers", null)
    const topicArray = []
    for (const user of allUsers) {
      const notionPages = await getBrowseTopics(user.notionId, user.username)
      notionPages && topicArray.push(...notionPages)
    }
    return { props: { allTopics: topicArray }, revalidate: 1 }
  } catch (err) {
    console.log(err)
    return { props: { allTopics: [] } }
  }

}

export default Users
