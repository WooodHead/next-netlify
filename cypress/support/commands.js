
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// cypress/support/auth-provider-commands/cognito.ts


import Auth from '@aws-amplify/auth'
import "cypress-localstorage-commands"

const userPoolId = "us-east-1_E1rXwEwFG"
const clientId = "4u5e0sjuv242pf7os0pho22rae"

const awsconfig = { 
  aws_user_pools_id: userPoolId, 
  aws_user_pools_web_client_id: clientId, 
}
Auth.configure(awsconfig)

Cypress.Commands.add("signIn", (username, password) => {
  cy.then(() => Auth.signIn(username, password)).then((cognitoUser) => {
    const idToken = cognitoUser.signInUserSession.idToken.jwtToken
    const accessToken = cognitoUser.signInUserSession.accessToken.jwtToken

    const makeKey = (name) => `CognitoIdentityServiceProvider.${cognitoUser.pool.clientId}.${cognitoUser.username}.${name}`

    cy.setLocalStorage(makeKey("accessToken"), accessToken)
    cy.setLocalStorage(makeKey("idToken"), idToken)
    cy.setLocalStorage(
      `CognitoIdentityServiceProvider.${cognitoUser.pool.clientId}.LastAuthUser`,
      cognitoUser.username
    );
  });
  cy.saveLocalStorage()
});