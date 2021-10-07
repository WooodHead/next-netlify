describe("ReceivePaidMessage", () => {
  before(() => {
    cy.signIn("gefyoung+2@gmail.com", "monkey11")
  })

  after(() => {
    cy.clearLocalStorageSnapshot()
    cy.clearLocalStorage()
  })

  beforeEach(() => {
    // persists login state
    cy.restoreLocalStorage()
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  it("triggers the creation of a session", () => {
    cy.request('POST', 'https://dev-api.talktree.me/createPaidSession', {
      
    }).as('createSession')
    cy.intercept('POST', 'https://dev-api.talktree.me/createPaidSession').as('createSession')
    cy.wait('@createSession').get('response')
  })

  it("should be logged in", () => {
    cy.visit("http://localhost:3000/receiver")
    // cy.intercept('POST', 'https://dev-api.talktree.me/getSession').as('getSession')
    // cy.wait('@getSession').get('response')
    cy.window().should('have.property', 'Notification').should('be.a', 'function')
  })
})