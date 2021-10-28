import Auth from '@aws-amplify/auth'
import API from '@aws-amplify/api'

const MessengerSettings = ({ modifyState, notionId, username, available, ppm, stripeReciever }) => {

  const goOnlineOffline = async (props: Boolean) => {
    try {
      const updateUserInit = {
        body: { available: props }
      }
      const updatedUser = await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, '/updateSelfInactive', updateUserInit)
      modifyState({ available: updatedUser.available })
    } catch (err) {
      console.log(err)
    }
  }

  return ( 
    <div>
      <button onClick={() => goOnlineOffline(!available)}>{available ? "go offline" : "go online"} </button>
      Go online/offline
    </div>
  )
}

export default MessengerSettings