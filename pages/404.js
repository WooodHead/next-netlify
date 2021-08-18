import API from '@aws-amplify/api'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function FourOhFour() {
  const router = useRouter()
  console.log(router.asPath)
  
  const specificUserInit = { headers: { Authorization: params.id } }
  const getUserRes = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/users", specificUserInit)
  return <>
    <h1>404 - Page Not Found</h1>
    <Link href="/">
      <a>
        Go back home
      </a>
    </Link>
  </>
}