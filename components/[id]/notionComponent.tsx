import SideUserIsland from './sideUserIsland'
import TopUserIsland from './topUserIsland'
import { NotionRenderer, Code, Collection, CollectionRow, Modal, Pdf, Equation } from 'react-notion-x'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { getPageTitle } from 'notion-utils'

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

export default function NotionComp({ user, recordMap}) {
  // const user = props.user
  // const recordMap = props.recordMap
  // const title = props.title
  // const titleUrl = props.titleUrl

  const getUrl = (pageLinkObj) => {
    const cards = pageLinkObj.children
    const cardBodyParent = Array.isArray(cards) 
    ? cards.filter(
        card => card.props.className === "notion-collection-card-body")
    : cards
    const cardBody = cardBodyParent[0].props.children
    const cardPropertyParent = Array.isArray(cardBody)
    ? cardBody.filter(
      card => card.props?.className === "notion-collection-card-property")
    : cardBody
    const cardProperty = cardPropertyParent[0].props?.children?.props?.data
    /* probably going to crash if wrong inputs here */

    const title = cardProperty ? cardProperty[0] : ''
    const title2 = Array.isArray(title) ? title[0] : title
    const sanitized = title2.replace(/[_$&+,:;=?[\]@#|{}'<>.^*()%!/\\]/g, "")
    const withDashes = sanitized?.replaceAll(' ', '-') || title
    console.log('WITHDASHES', withDashes)
    return user.Username + "/" + withDashes
  }

  return (
    <div className="flex my-5">

      <div className="mx-5">
        <div className="my-10">
        { recordMap && <NotionRenderer 
        
      // className="prose" 
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
      showCollectionViewDropdown={false}
      fullPage={false} 
      darkMode={false} 
      />}

        </div>
      </div>

      <div className="flex-1">
      </div>


    </div>
  )
}

