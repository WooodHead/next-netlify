import Link from 'next/link'
import API from '@aws-amplify/api'
import { useRouter } from 'next/router'
import '../configureAmplify'
import NavbarComp from '../components/navbar/navbar'

const Users = ({ allUsers }) => {
  const router = useRouter()

  // const userClickFn = (userObjProp) => {
  //   console.log(userObjProp.topics[0].title.S)
  //   const titleIfExists = userObjProp.topics[0] ? userObjProp.topics[0].title.S : ''
  //   // router.push(`/${userObjProp.Username + "/" + titleIfExists}`)
  // }
  return (
    <>
        <NavbarComp />
      <div>
        {allUsers.map((user) => {
          return (
            <div
              className="flex mx-5 my-5 bg-gray-100 hover:bg-gray-200"
              key={user.Username}
            >
              <div className="mx-5 my-2">
                <Link 
                className="" 
                href={"/" + user.Username + "/" + (user.topics[0] ? user.topics[0].title.S : '')}
                >
                  <a className="flex overflow-auto flex-row">
                    <div>
                    {user.Username}
                    {user.TAVS}
                    <div className="flex flex-col flex-wrap max-h-20">
                      {user.topics.map((topicObj) => 
                      <div className="mx-5" key={topicObj.topicId} >
                        {topicObj.title.S.replace(/-/g, ' ')}
                      </div>
                    )
                  }</div>
                    </div>
                    
                  <div dangerouslySetInnerHTML={{ __html: user.publicString }}>
                  </div>
                  </a>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export async function getStaticProps() {
  const newAllUsers = []
  const allUsersInit = { headers: { Authorization: "all" } }
  const getAllUsersRes = await API.get(process.env.apiGateway.NAME, "/users", allUsersInit)
  getAllUsersRes.body.Items.forEach((userRes) => {
    const TAVS = []
    const topicsArray = []
    for (const [key, topicObj] of Object.entries(userRes.topics?.M)) {
      if (!topicObj.M.draft.BOOL) {
        topicsArray.push({...topicObj.M, topicId: key})
      }
    }
    userRes.deviceInput.M.text.BOOL && TAVS.push("📝")
    userRes.deviceInput.M.audio.BOOL && TAVS.push("📞")
    userRes.deviceInput.M.video.BOOL && TAVS.push("📹")
    userRes.deviceInput.M.screen.BOOL && TAVS.push("💻")
    const firstSixFolders = userRes.folders?.SS.slice(0, 6) || []
    newAllUsers.push({
      Username: userRes.Username.S,
      active: userRes.active.BOOL,
      busy: userRes.busy.BOOL,
      folders: firstSixFolders || [],
      TAVS: TAVS,
      ppm: userRes.ppm.N,
      ratingAv: userRes.ratingAv?.S || null,
      publicString: userRes.publicString?.S || null,
      topics: topicsArray
    })
  })
  return { props: { allUsers: newAllUsers }, revalidate: 1 }
}

export default Users