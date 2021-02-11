import Link from 'next/link'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import '../configureAmplify'

const Users = ({ allUsers }) => {
  const router = useRouter()

  const userClickFn = (idProp) => {
    router.push(`/${idProp}`)
  }
  return (
    <>
      <h2>
        <Link href="/">
          <a className="mx-5 my-5">Back to home</a>
        </Link>
      </h2>
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
                    {user.Username}
                    <div className="flex flex-col flex-wrap max-h-20">{user.folders.map((folder) => {
                    return (
                      <div className="mx-5 " key={user.Username + folder} >{folder}</div>
                    )
                  })}</div></a>
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
    const firstSixFolders = userRes.folders?.SS.slice(0, 6) || []
    newAllUsers.push({
      Username: userRes.Username.S,
      active: userRes.active.BOOL,
      busy: userRes.busy.BOOL,
      folders: firstSixFolders || [],
      ppm: userRes.ppm.N,
      ratingAv: userRes.ratingAv?.S || null,
      publicString: userRes.publicString?.S || null
    })
  })
  return { props: { allUsers: newAllUsers } }
}

export default Users