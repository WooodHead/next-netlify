import SideUserIsland from './sideUserIsland'
import TopUserIsland from './topUserIsland'
import { NotionRenderer, Code, Collection, CollectionRow, Modal, Pdf, Equation } from 'react-notion-x'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// const NotionRenderer = dynamic(() =>
//   import('react-notion-x').then((notion) => notion.NotionRenderer))
// const Code = dynamic(() =>
//   import('react-notion-x').then((notion) => notion.Code)
// )
// const Collection = dynamic(() =>
//   import('react-notion-x').then((notion) => notion.Collection)
// )
// const CollectionRow = dynamic(
//   () => import('react-notion-x').then((notion) => notion.CollectionRow),
//   { ssr: false}
// )
// const Pdf = dynamic(() => import('react-notion-x').then((notion) => notion.Pdf))
// const Equation = dynamic(() =>
//   import('react-notion-x').then((notion) => notion.Equation)
// )
// const Tweet = dynamic(() => import('react-tweet-embed'))
// const Modal = dynamic(
//   () => import('react-notion-x').then((notion) => notion.Modal),
//   { ssr: false }
// )

export default function NotionComp(props) {
  const user = props.user
  const recordMap = props.recordMap
  // const title = props.title
  // const titleUrl = props.titleUrl

  const getUrl = (pageLinkObj) => {
    console.log("pageLinkObj", pageLinkObj)
    const title = pageLinkObj.children?.props?.block?.properties?.title ? pageLinkObj.children.props.block.properties.title[0] : ''
    const title2 = Array.isArray(title) ? title[0] : title
    console.log("title:", title2)
    const sanitized = title2.replace(/[_$&+,:;=?[\]@#|{}'<>.^*()%!/\\]/g, "")
    const withDashes = sanitized.replaceAll(' ', '-') || title
    return user.Username + "/" + withDashes
  }

  return (
    <div className="flex my-5 bg-gray-100">

      <div className="mx-5">
        <div className="my-10">
        <NotionRenderer 
        
      className="prose" 
      recordMap={recordMap} 
      components={{
        pageLink: ({
          href,
          as,
          passHref,
          prefetch,
          replace,
          scroll,
          shallow,
          locale,
          ...props
        }) => (
          <Link
            href={getUrl(props)}
            as={as}
            passHref={passHref}
            prefetch={prefetch}
            replace={replace}
            scroll={scroll}
            shallow={shallow}
            locale={locale}
          >
            <a {...props} />
          </Link>
        ),
        code: Code,
        collection: Collection,
        collectionRow: CollectionRow,
        modal: Modal,
      }}
      fullPage={false} 
      darkMode={false} 
      />

        </div>
      </div>

      <div className="flex-1">
      </div>


    </div>
  )
}

