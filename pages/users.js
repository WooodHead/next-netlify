import Link from 'next/link'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import '../configureAmplify'
import NavbarComp from '../components/navbar/navbar'

const Users = ({ allUsers }) => {
  const router = useRouter()

  const userClickFn = (idProp) => {
    router.push(`/${idProp}`)
  }
  return (
    <>
        <NavbarComp />
      <div>
        {allUsers.map((user) => {
          return (
            <div
              className="flex mx-5 my-5 bg-gray-100 hover:bg-gray-200"
              key={user.Username}
              onClick={() => userClickFn(user.Username)}
            >
              <div className="mx-5 my-2">
                <Link 
                className="" 
                href={"/" + user.Username}
                >
                  <a className="flex flex-row">
                    <div>
                    {user.Username}
                    {user.TAVS}
                    {/* this aint workin? */}
                    <div className="flex flex-col flex-wrap max-h-20">
                      {Object.keys(user.topics).map((topic) => 
                      <div className="mx-5" key={user.Username + topic} >
                        {topic}
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
  const getAllUsersRes = await API.get(process.env.apiGateway.NAME, "/getAllUsers")
  getAllUsersRes.body.Items.forEach((userRes) => {
    const TAVS = []
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
      topics: userRes.topics.M
    })
  })
  return { props: { allUsers: newAllUsers }, revalidate: 1 }
}

export default Users