import Amplify from 'aws-amplify'
import config from './config'

Amplify.configure(  {Auth: {
  region: config.cognito.REGION,
  userPoolId: config.cognito.USER_POOL_ID,
  userPoolWebClientId: config.cognito.APP_CLIENT_ID, 
},
API: {
  endpoints: [ { name: config.apiGateway.NAME, endpoint: config.apiGateway.URL } ]
}})