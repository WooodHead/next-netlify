const dev = {
  STRIPE_KEY: "pk_test_0ktNaTLSdckHwnQ7IuUQtFwK",
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://dev-api.talktree.me",
    NAME: "dev-tt3-topical"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_tQ7eQDxrO",
    APP_CLIENT_ID: "13tccrpqrs740rua48kbl8kt70"
  }
};

const prod = {
  STRIPE_KEY: "pk_live_N8vqxQWqGt8Npt6r0yIJueJ3",
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://api.talktree.me",
    NAME: "prod-tt3-topical	"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_lfnYkHZ0h",
    APP_CLIENT_ID: "15bvc7hrss54rp3rodve8ncnao"
  }
};

const config = dev
// {
//   // Default to dev if not set
//   ...(process.env.REACT_APP_STAGE === "prod" ? prod : dev),
// };

export default config;