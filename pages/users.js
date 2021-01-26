import Link from 'next/link'
import { API } from 'aws-amplify'
import config from '../config'
import { useRouter } from 'next/router'
import '../configureAmplify'
import styles from '../css/users.module.css'
const Users = ({ allUsers }) => {
  const router = useRouter()

  const userClickFn = (idProp) => {
    router.push(`/${idProp}`)
  }
  return (
    <>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
      <div>
        {allUsers.map((user) => {
          return (
            <div className={styles.userList} key={user.Username} onClick={() => userClickFn(user.Username)}>
              <div>{user.Username}</div>
              <div className={styles.userListFolders}>
                {user.folders.map((folder) => {
                  return (
                    <div key={user.Username + folder} >{folder}</div>
                  )
                })}</div>
            </div>
          )
        })}
      </div>

    </>
  )
}

export async function getStaticProps() {
  const newAllUsers = []
  const getAllUsersRes = await API.get(config.apiGateway.NAME, "/getAllUsers")
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
  return {props: { allUsers: newAllUsers } }
}

export default Users