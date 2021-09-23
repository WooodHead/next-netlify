import { NotionAPI } from 'notion-client'
import { getPageTitle, getBlockIcon, getAllPagesInSpace } from 'notion-utils'

export async function getNotionPage(topicProp) {
  try {
    const notion = new NotionAPI()
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
    titleUrl = sanitized?.replaceAll(' ', '-') || title
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

export async function getNotionPages( notionId: string ) {
  try {
    const notion = new NotionAPI()
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
      console.log("PAGE", page)

      const title = getPageTitle(page)
      const sanitized = title?.replace(/[_$&+,:;=?[\]@#|{}'<>.^*()%!/\\]/g, "")
      const titleUrl = sanitized ? sanitized.replaceAll(' ', '-') : title
      title && notionTopics.push({
        topicId: page,
        title: title,
        titleUrl: titleUrl,
        recordMap: page
      })
    })

    return notionTopics
  } catch (err) {
    console.log(err)
    return [{ 
      topicId: null,
      titleUrl: null, 
      title: null, 
      recordMap: null
    }]
  }
}