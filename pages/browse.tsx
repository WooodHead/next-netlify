import Link from 'next/link'
import API from '@aws-amplify/api'
import { useRouter } from 'next/router'
import '../configureAmplify'
import { getBrowseTopics } from '../components/[id]/getNotionRecord'
import { Block, ImageBlock } from 'notion-types'

const Users = ({ allTopics }) => {
  const router = useRouter()
  console.log(allTopics)

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
        // console.log(image)
        const url = image?.value?.properties?.source[0]?.[0]
        const shit = defaultMapImageUrl(url)
        
        // console.log("topic recordMAP::", topic.recordMap)
        // const contentBlock = topic.recordMap?.value as ImageBlock

        // const source = contentBlock.properties?.source?.[0]?.[0] ?? contentBlock.format?.display_source
        // const src = defaultMapImageUrl(source, contentBlock)
        // console.log(src)

        return (
          <div
            className="flex mx-5 my-5 bg-gray-100 cursor-pointer hover:bg-gray-200"
            onClick={() => router.push(`${topic.username}/${topic.titleUrl}`)}

            key={topic.titleUrl}
          >
            <img height={100} width={100} src={shit} />
            {/* <img src={user.image} className="p-2"></img> */}
            <div className="mx-5 my-2">

              <Link
                href={`/${topic.username + '/' + topic.titleUrl}`}
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
    </>
  }

  return (
    <>
      <div className="flex-1">
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
  return { props: { allTopics: [] } }
}

}

export default Users
