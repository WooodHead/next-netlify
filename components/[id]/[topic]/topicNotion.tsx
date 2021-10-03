
import TopUserIsland from '../topUserIsland'
import { NotionRenderer, Code, Collection, CollectionRow, Modal, Pdf, Equation } from 'react-notion-x'

export default function NotionComp({ user, recordMap, title}) {
  const CustomHeader = () => {
    return <div className="text-4xl font-bold" >{title}</div>
  }

  return (
    <>

<div className="flex justify-center"><TopUserIsland user={user} /></div>

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
        />
        </>
  )
}