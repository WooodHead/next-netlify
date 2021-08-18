import API from '@aws-amplify/api'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import '../configureAmplify'

export default function FourOhFour() {
  const router = useRouter()
  console.log(router.asPath)
  
  useEffect(() =>{
    const getAssumedUser = async () => { 
      const idMaybe = router.asPath.match(/\/(.+?)\//)

      const specificUserInit = { headers: { Authorization: idMaybe[1] } }
      const getUserRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", specificUserInit)
      console.log('getuserres', getUserRes)
    }
    getAssumedUser()
  }, [])
  
  return <>
    <h1>404 - Page Not Found</h1>
    <Link href="/">
      <a>
        Go back home
      </a>
    </Link>
  </>
}