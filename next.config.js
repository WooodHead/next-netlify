const { PHASE_PRODUCTION_BUILD } = require('next/constants')
const withPWA = require('next-pwa')

module.exports = (phase) => {

  const isProd = phase === PHASE_PRODUCTION_BUILD

  const env = {
    pwa: { dest: 'public' },
    // images: {
    //   domains: ["localhost", "d1la1a6cwiwn48.cloudfront.net", "https://d1la1a6cwiwn48.cloudfront.net"]
    // },
    img_cloudfront: isProd ? "https://d31kifv93uudih.cloudfront.net" : "https://d1yh8cksvv9kll.cloudfront.net",
    gif_cloudfront: isProd ? "https://d3guuahkmft7rx.cloudfront.net" : "https://d113rofegfcvwz.cloudfront.net",
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
      USER_POOL_ID: isProd ? "us-east-1_b1l8O5a6e"
        : "us-east-1_E1rXwEwFG",
        // old prod "us-east-1_lfnYkHZ0h"
        // old dev "us-east-1_tQ7eQDxrO"
      APP_CLIENT_ID: isProd ? "6fqtglce77tt8i60tmsm83e7kp"
        : "4u5e0sjuv242pf7os0pho22rae",
        // old dev "13tccrpqrs740rua48kbl8kt70"
        //old prod "15bvc7hrss54rp3rodve8ncnao"
      IDENTITY: isProd ? "us-east-1:647dbf69-9432-4411-a5d4-78ba23dab8f9"
        : "us-east-1:6a389b4a-87a3-4738-bfb1-878fe5105f5d" ,
        //old dev "us-east-1:fc28ba4c-cf45-4a2e-bab7-a6bff48b857b"
        // old prod "us-east-1:914c9af9-eac4-4e24-ad2f-6d9a341be684"
    },
    storage: {
      BUCKET: isProd ? 'tt3-s3-prod-imagesbucket-80gqbqnc042a' : 'tt3-s3-dev-imagesbucket-ohmvfcukxwiv',
      REGION: 'us-east-1'
    },
    SITE_URL: isProd ? "talktree.me" : "talktree.me",
    NEXT_PUBLIC_GOOGLE_ANALYTICS: isProd ? "GTM-N6LXWFR" : "GTM-KQMLD57"
  }

  return isProd ? withPWA({ env }) : { env }
}