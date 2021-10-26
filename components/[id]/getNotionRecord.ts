import { NotionAPI } from 'notion-client'
import { getPageTitle, getBlockIcon, getPageProperty, getAllPagesInSpace, getBlockParentPage } from 'notion-utils'
import { Block } from 'notion-types'

const notion = new NotionAPI()

export async function getNotionPage(topicProp) {
  try {
    // const notion = new NotionAPI()
    const recordMap = await notion.getPage(topicProp)
    // console.log('redocrdMap', recordMap)
    let titleUrl = null
    const title = getPageTitle(recordMap) || null
    // let pageBlock = null
    // for (const [blockKey, blockData] of Object.entries(recordMap.block)) {
    //   if (blockData.value.type === "page") {
    //     pageBlock = blockData
    //   }
    // }
    // const icon = getBlockIcon(pageBlock.value, recordMap)
    const sanitized = title?.replace(/[_$&+,:;=?[\]@#|{}'<>.^*()%!/\\]/g, "")
    titleUrl = sanitized?.replace(/ /g, '-') || title
    // const allPages = await getAllPagesInSpace(topicProp, null, notion.getPage.bind(notion))
    // Object.values(allPages).forEach(page => { console.log(getPageTitle(page))} )
    return { 
      topicId: topicProp as string,
      titleUrl: titleUrl || null, 
      title: title || null, 
      recordMap: recordMap,
      // icon: icon
    }
  } catch (err) {
    console.log(err)
    return {
      topicId: null,
      titleUrl: null, 
      title: null, 
      recordMap: null
    }
  }
}

export const getNotionPages = async ( notionId: string ): Promise<{
  title: string
  titleUrl: string
  recordMap: Block
}[]> => {
  try {
    const recordMap = await notion.getPage(notionId)
    let pageBlock = null
    for (const [blockKey, blockData] of Object.entries(recordMap.block)) {
      if (blockData.value.type === "page") {
        pageBlock = blockData
      }
    }
    const notionTopics = []
    const allPages = await getAllPagesInSpace(notionId, null, notion.getPage.bind(notion))
    /* i think allPages is null in prod */

    Object.values(allPages).forEach(page => {
      const title = getPageTitle(page)
      const sanitized = title?.replace(/[_$&+,:;=?[\]@#|{}'<>.^*()%!/\\]/g, "")
      const titleUrl = sanitized ? sanitized.replace(/ /g, '-') : title
      // turn title to url
      title && notionTopics.push({
        // topicId: page,
        title: title,
        titleUrl: titleUrl.toLowerCase(),
        recordMap: page
      })
    })
    return notionTopics
  } catch (err) {
    console.log("notion not found")
    return []
  }
}

type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never;
export type TopicObjs = {
  username: string
  title: string
  titleUrl: string
  recordMap: Block
}

const makeUrl = (title: string) => {
  const sanitized = title?.replace(/[_$&+,:;=?[\]@#|{}'<>.^*()%!/\\]/g, "")
  const titleUrl = sanitized ? sanitized.replace(/ /g, '-') : title
  return titleUrl.toLowerCase()
}

export const getBrowseTopics = async ( notionId: string, username: string ): Promise<Expand<TopicObjs>[]> => {
  try {

    const recordMap = await notion.getPage(notionId)
    let parentBlockKey = null
    for (const [blockKey, blockData] of Object.entries(recordMap.block)) {
      if (blockData.value.parent_table === "space") {
        // tons of type pages in a page
        parentBlockKey = blockKey
      }
    }
    const notionTopics = []
    const allPages = await getAllPagesInSpace(notionId, null, notion.getPage.bind(notion))

    /* i think allPages is null in prod */

    for (const [pageKey, pageValue] of Object.entries(allPages)) {
      for (const [key, value] of Object.entries(pageValue.block)) {
        if (key === pageKey) {
          const block = value.value
        
          const pageProperty = getPageProperty('Property', block, recordMap)
  
          if (pageProperty === 'blog' || block.parent_table === "space") {
            
            const title = getPageTitle(pageValue)
            const titleUrl = makeUrl(title)
            const topicObj = {
              username: username,
              title: title,
              titleUrl: titleUrl,
              recordMap: pageValue
            }
      
            title && notionTopics.push(topicObj)
        }

        } 
      }

    // }
  }

    return notionTopics
  } catch (err) {
    console.log("getBrowseTopics notionErr")
    return null
  }
}