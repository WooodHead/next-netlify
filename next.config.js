const { PHASE_PRODUCTION_BUILD } = require('next/constants')
const withPWA = require('next-pwa')

module.exports = (phase) => {

  const isProd = phase === PHASE_PRODUCTION_BUILD

  const env = {
    pwa: { dest: 'public' },
    // images: {
    //   domains: ["localhost", "d1la1a6cwiwn48.cloudfront.net", "https://d1la1a6cwiwn48.cloudfront.net"]
    // },
    img_cloudfront: "https://d1yh8cksvv9kll.cloudfront.net",
    STAGE: isProd? "prod" : "dev",
    STRIPE_KEY: isProd ? "pk_live_N8vqxQWqGt8Npt6r0yIJueJ3"
      : "pk_test_0ktNaTLSdckHwnQ7IuUQtFwK",
    apiGateway: {
      REGION: "us-east-1",
      URL: isProd ? "https://api.talktree.me"
        : "https://dev-api.talktree.me",
      NAME: isProd ? "prod-tt3-topical"
        : "dev-tt3-topical"
    },
    cognito: {
      REGION: "us-east-1",
      USER_POOL_ID: isProd ? "us-east-1_lfnYkHZ0h"
        : "us-east-1_tQ7eQDxrO",
      APP_CLIENT_ID: isProd ? "15bvc7hrss54rp3rodve8ncnao"
        : "13tccrpqrs740rua48kbl8kt70",
      IDENTITY: isProd ? "us-east-1:914c9af9-eac4-4e24-ad2f-6d9a341be684"
        : "us-east-1:fc28ba4c-cf45-4a2e-bab7-a6bff48b857b" ,
    },
    storage: {
      BUCKET: isProd ? 'tt3-s3-prod-imagesbucket-80gqbqnc042a' : 'tt3-s3-dev-imagesbucket-ohmvfcukxwiv',
      REGION: 'us-east-1'
    },
    SITE_URL: isProd ? "talktree.me" : "talktree.me",
    NEXT_PUBLIC_GOOGLE_ANALYTICS: isProd ? "G-5E2G7WDTKQ" : "G-YCPJBLFQST"
  }

  return isProd ? withPWA({ env }) : { env }
}