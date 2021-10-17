// import SideUserIsland from './sideUserIsland'
import TopUserIsland from './topUserIsland'
import { NotionRenderer, Code, Collection, CollectionRow, Modal, Pdf, Equation } from 'react-notion-x'
import Link from 'next/link'
import AddNotionComponent from './addNotionComponent'
import { getPageTitle, getBlockTitle, uuidToId, parsePageId, getCanonicalPageId } from 'notion-utils'

export default function NotionComp({ user, recordMap }) {
  
  const mapPageUrl = ( 
    // site, 
    recordMap ) => (pageId = '') => {
    // if (uuidToId(pageId) === site.rootNotionPageId) {
    //   return '/'
    // } else {
      return `${user.Username}/${getCanonicalPage(pageId, recordMap)}`
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
        <div className="flex justify-center"><TopUserIsland user={user} /></div>
        < AddNotionComponent user={user} />
        <NotionRenderer
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
                href={href}
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
          mapPageUrl={mapPageUrl(recordMap)}
        />
      </div>
    </>
  )
}

