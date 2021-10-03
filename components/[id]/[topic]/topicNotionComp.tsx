import SideUserIsland from '../sideUserIsland'
import TopUserIsland from '../topUserIsland'
import { NotionRenderer, Code, Collection, CollectionRow, Modal, Pdf, Equation } from 'react-notion-x'

export default function NotionComp(props) {
  const user = props.user
  const recordMap = props.recordMap
  const title = props.title
  const CustomHeader = () => {
    return <div className="text-4xl font-bold" >{title}</div>
  }

  return (
    // <div className="flex my-5">

    //   <div className="flex justify-center flex-1 mt-10">
    //     <SideUserIsland user={user} />
    //   </div>

    //   <div className="mx-5">
    //     <TopUserIsland user={user} />
    //     <div className="my-10">

       recordMap && <NotionRenderer 
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
    //     </div>
    //   </div>
    //   <div className="flex-1">
    //   </div>
    // </div>
  )
}

