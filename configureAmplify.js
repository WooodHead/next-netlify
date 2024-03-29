import Amplify from '@aws-amplify/core'

Amplify.configure({
  Auth: {
    region: process.env.NEXT_PUBLIC_COGNITO_REGION,
    userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_APP_CLIENT_ID,
    identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY
  },
  API: {
    endpoints: [{ name: process.env.NEXT_PUBLIC_APIGATEWAY_NAME, endpoint: process.env.NEXT_PUBLIC_APIGATEWAY_URL }]
  },
})

// why did i have // identityPoolId: typeof window === 'undefined' ? null : ...