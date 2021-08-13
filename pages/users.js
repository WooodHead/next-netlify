import Link from 'next/link'
import API from '@aws-amplify/api'
import { useRouter } from 'next/router'
import '../configureAmplify'
import NavbarComp from '../components/navbar/navbar'
import Footer from '../components/navbar/footer'

const Users = ({ allUsers }) => {
  const router = useRouter()

  // const userClickFn = (userObjProp) => {
  //   console.log(userObjProp.topics[0].title.S)
  //   const titleIfExists = userObjProp.topics[0] ? userObjProp.topics[0].title.S : ''
  //   // router.push(`/${userObjProp.Username + "/" + titleIfExists}`)
  // }
  const clickUser = (usernameProp) => {
    router.push(usernameProp)
  }
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <NavbarComp />
        <div className="flex-1">
          {allUsers.map((user) => {
            return (
              <div
                className="flex mx-5 my-5 bg-gray-100 cursor-pointer hover:bg-gray-200"
                onClick={() => clickUser(user.Username)} 
                key={user.Username}
              >
                <div className="mx-5 my-2">
                  <Link
                    className=""
                    href={"/" + user.Username}
                    // passHref
                  >
                    <a>{user.Username}</a>
                  </Link>
                  <div 
                    
                    className="flex flex-row overflow-auto"
                  >
                    
                    <div className="flex flex-col w-20">
                      <div>
                        {user.TAVS}
                      </div>
                    </div>

                    {/* <div className="flex flex-col flex-wrap max-h-20">
                      {user.topics.map((topicObj) =>
                        <div className="mx-5" key={topicObj.topicId} >
                          {topicObj.title.S.replace(/-/g, ' ')}
                        </div>
                      )
                      }</div> */}

                    <div className="ml-2" dangerouslySetInnerHTML={{ __html: user.publicString }}>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <Footer />
      </div>
    </>
  )
}

export async function getStaticProps() {
  const newAllUsers = []
  const allUsersInit = { headers: { Authorization: "all" } }
  const getAllUsersRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", allUsersInit)
  getAllUsersRes.body.Items.forEach((userRes) => {
    const TAVS = []
    const topicsArray = []
    for (const [key, topicObj] of Object.entries(userRes.topics?.M)) {
      if (!topicObj.M.draft.BOOL) {
        topicsArray.push({ ...topicObj.M, topicId: key })
      }
    }
    userRes.deviceInput.M.text.BOOL && TAVS.push("📝")
    userRes.deviceInput.M.audio.BOOL && TAVS.push("📞")
    userRes.deviceInput.M.video.BOOL && TAVS.push("📹")
    userRes.deviceInput.M.screen.BOOL && TAVS.push("💻")
    newAllUsers.push({
      Username: userRes.Username.S,
      active: userRes.active.BOOL,
      busy: userRes.busy.BOOL,
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