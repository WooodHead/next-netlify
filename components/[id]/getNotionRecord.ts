import { NotionAPI } from 'notion-client'
import { getPageTitle, getBlockIcon, getAllPagesInSpace } from 'notion-utils'

export async function getNotionPage(topicProp) {
  try {
    const notion = new NotionAPI()
    const recordMap = await notion.getPage(topicProp)
    let titleUrl = null
    const title = getPageTitle(recordMap)

    let pageBlock = null
    for (const [blockKey, blockData] of Object.entries(recordMap.block)) {
      if (blockData.value.type === "page") {
        pageBlock = blockData
      }
    }
    const icon = getBlockIcon(pageBlock.value, recordMap)
    const sanitized = title.replace(/[_$&+,:;=?[\]@#|{}'<>.^*()%!/\\]/g, "")
    titleUrl = sanitized.replaceAll(' ', '-') || title

    const allPages = await getAllPagesInSpace(topicProp, null, notion.getPage.bind(notion))
    // Object.values(allPages).forEach(page => { console.log(getPageTitle(page))} )


    return { 
      topicId: topicProp as string,
      titleURL: titleUrl || null, 
      title: title || null, 
      recordMap: recordMap,
      icon: icon
    }
  } catch (err) {
    console.log(err)
    return { 
      topicId: null,
      titleURL: null, 
      title: null, 
      recordMap: null
    }
  }
}

export async function getNotionPages( notionId: string ) {
  try {
    const notion = new NotionAPI()
    const recordMap = await notion.getPage(notionId)
    let titleUrl = null

    let pageBlock = null
    for (const [blockKey, blockData] of Object.entries(recordMap.block)) {
      if (blockData.value.type === "page") {
        pageBlock = blockData
      }
    }
    const notionTopics = []
    const allPages = await getAllPagesInSpace(notionId, null, notion.getPage.bind(notion))
    Object.values(allPages).forEach(page => { 
      const title = getPageTitle(page)
      const sanitized = title.replace(/[_$&+,:;=?[\]@#|{}'<>.^*()%!/\\]/g, "")
      const titleUrl = sanitized.replaceAll(' ', '-') || title
      notionTopics.push({
        topicId: page,
        title: title,
        titleURL: titleUrl,
        recordMap: recordMap
      })
    })

    return notionTopics
  } catch (err) {
    console.log(err)
    return [{ 
      topicId: null,
      titleURL: null, 
      title: null, 
      recordMap: null
    }]
  }
}