import Amplify from 'aws-amplify'

Amplify.configure(  {Auth: {
  region: process.env.cognito.REGION,
  userPoolId: process.env.cognito.USER_POOL_ID,
  userPoolWebClientId: process.env.cognito.APP_CLIENT_ID, 
},
API: {
  endpoints: [ { name: process.env.apiGateway.NAME, endpoint: process.env.apiGateway.URL } ]
}})