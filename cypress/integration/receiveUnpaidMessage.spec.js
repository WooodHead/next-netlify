describe("ReceiveUnpaidMessage", () => {
  before(() => {
    cy.signIn("gefyoung+552@gmail.com", "monkey11")
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

  it("triggers the creation of a session", () => {
    cy.request('POST', 'https://dev-api.talktree.me/createUnpaidSession', {
      name: 'geoff-young'
    })
  })

  it("should be logged in", () => {
    cy.visit("http://localhost:3000/receiver", {
      onBeforeLoad (win) {
        cy.stub(win.Notification, 'permission', 'unknown')
        cy.stub(win.Notification, 'requestPermission').resolves('granted').as('ask')
        cy.stub(win, 'Notification').as('Notification')
      }
    })
    cy.window().should('have.property', 'Notification').should('be.a', 'function')
    // cy.intercept('POST', 'https://dev-api.talktree.me/register').as('register')
    // cy.wait('@register')
    cy.intercept('https://dev-api.talktree.me/getSession').then(() => {
      cy.get('[data-cy=accept]').contains('Accept Call')
    })
    
    
  })
})