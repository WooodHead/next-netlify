describe("ReceivePaidMessage", () => {
  before(() => {
    cy.signIn("gefyoung+2@gmail.com", "monkey11")
  })

  after(() => {
    cy.clearLocalStorageSnapshot()
    cy.clearLocalStorage()
  })

  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  it("should be logged in", () => {
    cy.visit("http://localhost:3000/receiver")
    // cy.intercept('POST', 'https://dev-api.talktree.me/getSession').as('getSession')
    // cy.wait('@getSession').get('response')
    cy.window().should('have.property', 'Notification').should('be.a', 'function')
  })
})