import Auth from '@aws-amplify/auth'
import API from '@aws-amplify/api'

const checkForCalls = async () => {
    try {
      const userSession = await Auth.currentSession()
      const authHeader = { headers: { Authorization: userSession.getIdToken().getJwtToken() } }
      const otSession = await API.get(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/getSession", authHeader)
      console.log('checked for call')
      return otSession as {
        sessionId: string,
        apikey: string,
        Receiver: string,
        token: string
      }
    } catch (err) {
      console.log(err)
      return {
        sessionId: null,
        apikey: null,
        Receiver: null,
        token: null
      }
    }
  }

  export default checkForCalls