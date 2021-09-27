
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import SideUserIsland from './sideUserIsland'
import TopUserIsland from './topUserIsland'
import { User } from '../../pages/[id]'
import AddNotionComponent from './userComp/addNotionComponent'
import NotionComponent from './notionComponent'

export default function UserCompId(props) {
  // : { user: {
  //   Username: string,
  //   active: boolean,
  //   busy: boolean,
  //   ppm: number,
  //   TAVS: string[],
  //   publicString: string,
  //   topicString: string,
  //   topics: any[],
  //   receiver: boolean,
  //   image: string
  // }}

  const user = props.user


  const router = useRouter()
  const topicClick = (urlProp) => {
    router.push("/" + user.Username + "/" + urlProp)
  }




  return (
    <div className="flex my-5">

      <div className="flex justify-center flex-1 mt-10">
        <SideUserIsland user={user} />
      </div>

      <div className="flex my-3" >
        <div className="">
          <TopUserIsland user={user} />
          <AddNotionComponent user={user}/>
          { user.notionDetails && <NotionComponent 
            // titleUrl={user.notionDetails.titleUrl}
            user={user}
            recordMap={user.notionDetails.recordMap}
          /> }
        </div>
      </div>
      <div className="flex-1"></div>
    </div>
  )
}