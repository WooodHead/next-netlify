import Amplify from 'aws-amplify'

Amplify.configure({
  Auth: {
    region: process.env.cognito.REGION,
    userPoolId: process.env.cognito.USER_POOL_ID,
    userPoolWebClientId: process.env.cognito.APP_CLIENT_ID,
    identityPoolId: process.env.cognito.IDENTITY
  },
  API: {
    endpoints: [{ name: process.env.apiGateway.NAME, endpoint: process.env.apiGateway.URL }]
  },
  Storage: {
    AWSS3: {
        bucket: 'talktreeuserimgs', //REQUIRED -  Amazon S3 bucket name
        region: 'us-east-1', //OPTIONAL -  Amazon service region
    }
}
})