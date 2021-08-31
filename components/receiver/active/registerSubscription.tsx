import Auth from '@aws-amplify/auth'
import API from '@aws-amplify/api'

import urlBase64ToUint8Array from '../../custom/url64to8array'

const registerSubscription = async () => {
    try {
      const userSession = await Auth.currentSession()
      const idToken = userSession.getIdToken().getJwtToken()

      const registration = await navigator.serviceWorker.ready
      
      if (Notification.permission !== "granted") {
        Notification.requestPermission()
      }

      try {
        /* get existing subscription */
        const subscription = await registration.pushManager.getSubscription()

        const subEndpoint = subscription.endpoint
        const newSubscription = JSON.parse(JSON.stringify(subscription))
        let myInit = {
          headers: { Authorization: idToken },
          body: {
            endpoint: subEndpoint,
            auth: newSubscription.keys.auth,
            p256dh: newSubscription.keys.p256dh,
            phoneToken: 'null'
          }
        }
        await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/register", myInit)
        console.log('existing subscription found')
      } catch (err) {
        /* if subscription doesn't exist */
        const response = await API.get(
          process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/register", { headers: { Authorization: idToken } }
        )
        const vapidPublicKey2 = "" + response;
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey2)
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        })
        console.log('new subscription created')
        /* duplicate code in try */
        const subEndpoint = subscription.endpoint
        const newSubscription = JSON.parse(JSON.stringify(subscription))
        let myInit = {
          headers: { Authorization: idToken },
          body: {
            endpoint: subEndpoint,
            auth: newSubscription.keys.auth,
            p256dh: newSubscription.keys.p256dh,
            phoneToken: 'null'
          }
        }
        await API.post(process.env.NEXT_PUBLIC_APIGATEWAY_NAME, "/register", myInit)
      }

    } catch (err) {
      console.log(err)
      return null
    }
  }

  export default registerSubscription