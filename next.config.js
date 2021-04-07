const { PHASE_PRODUCTION_BUILD } = require('next/constants')
const withPWA = require('next-pwa')

module.exports = (phase) => {

  const isProd = phase === PHASE_PRODUCTION_BUILD

  const env = {
    pwa: { dest: 'public' },

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
      IDENTITY: isProd ? "us-east-1:6b320e0d-f2e3-466c-a4ce-b0c761788cdc"
        : "us-east-1:5697ad78-d1ea-429e-9dd4-3284ae4549fc" ,
    },
    storage: {
      BUCKET: 'talktreeusrimages',
      REGION: 'us-east-1'
    },
    SITE_URL: isProd ? "talktree.me" : "talktree.me"
  }

  return isProd ? withPWA({ env }) : { env }
}