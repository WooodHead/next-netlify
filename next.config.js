const { PHASE_PRODUCTION_BUILD } = require('next/constants')

module.exports = (phase) => {

  const isProd = phase === PHASE_PRODUCTION_BUILD

  const env = {
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
        : "13tccrpqrs740rua48kbl8kt70"
    }
  }

  return { env }
}