import { NotionAPI } from 'notion-client'
import { getPageTitle, getBlockIcon } from 'notion-utils'

export default async function getNotionTitle(topicProp) {
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
    console.log("pageBlock", pageBlock)
    const icon = getBlockIcon(pageBlock.value, recordMap)
    console.log('icon', icon)
    const sanitized = title.replace(/[_$&+,:;=?[\]@#|{}'<>.^*()%!/\\]/g, "")
    titleUrl = sanitized.replaceAll(' ', '-') || title
    /* need to implement length restriction */

    // Object.values(recordMap.block).forEach((block: any) => {
    //   if (block.value.content?.length && block.value.properties.title) {
    //     title = block.value.properties.title[0][0] || block.value.properties.title[0]
    //     const sanitized = title.replace(/[_$&+,:;=?[\]@#|{}'<>.^*()%!/\\]/g, "")
    //     titleUrl = sanitized.replaceAll(' ', '-') || title
    //   }
    // })
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