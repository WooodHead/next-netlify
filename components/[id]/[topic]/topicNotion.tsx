
import TopUserIsland from '../topUserIsland'
import { NotionRenderer, Code, Collection, CollectionRow, Modal, Pdf, Equation } from 'react-notion-x'
import { getCanonicalPageId } from 'notion-utils'

export default function NotionComp({ user, recordMap, title}) {
  const CustomHeader = () => {
    return <div className="text-4xl font-bold" >{title}</div>
  }

  const mapPageUrl = ( 
    // site, 
    recordMap ) => (pageId = '') => {
    // if (uuidToId(pageId) === site.rootNotionPageId) {
    //   return '/'
    // } else {
      return `${getCanonicalPage(pageId, recordMap)}`
    // }
  }

  function getCanonicalPage(
    pageId: string,
    recordMap
  ): string | null {
      const displayFriendly = getCanonicalPageId(pageId, recordMap, { uuid: false })
      /* this makes the title-ID url */
      return displayFriendly
    // }
  }

  return (
    <>
<div className="mb-20">
{/* <div className="flex justify-center"><TopUserIsland user={user} /></div> */}

        <NotionRenderer 
        // className="prose-sm prose sm:prose"
        recordMap={recordMap} 
        components={{
          code: Code,
          collection: Collection,
          collectionRow: CollectionRow,
          modal: Modal,
        }}
        hideBlockId={true}
        // defaultPageCoverPosition={0}
        fullPage={false}
        darkMode={false}
        pageHeader={<CustomHeader />}
        mapPageUrl={mapPageUrl(recordMap)}
        />
        </div>
        </>
  )
}