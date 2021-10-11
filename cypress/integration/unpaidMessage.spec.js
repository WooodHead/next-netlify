describe('Make an unpaid call', () => {
  it('Visits message', () => {
    cy.visit('http://localhost:3000/geoff-young/message')
    cy.intercept('https://dev-api.talktree.me/getUser').as('getUser')
    cy.intercept('POST', 'https://dev-api.talktree.me/createUnpaidSession').as('createUnpaidSession')
    cy.wait('@createUnpaidSession').its('response.statusCode').should('eql', 201)
    cy.get('textarea')
  })
})

describe("ReceiveUnpaidMessage", () => {
  before(() => {
    cy.signIn("gefyoung+552@gmail.com", "monkey11")
  })

  after(() => {
    cy.clearLocalStorageSnapshot()
    cy.clearLocalStorage()
    cy.get('@getSession').then((session) => {
      let sessionId = session.response.body.sessionId
      let url = `https://dev-api.talktree.me/disconnectCall?receiver=geoff-young&sessionId=${sessionId}`
      cy.request('POST', url)
        .should((response) => { expect(response.status).to.eq(200) })
    })
  })

  beforeEach(() => {
    cy.restoreLocalStorage()
  })

  afterEach(() => {
    cy.saveLocalStorage()
  })

  it("mimics a user calling - triggers the creation of a session", () => {
    cy.request('POST', 'https://dev-api.talktree.me/createUnpaidSession', {
      name: 'geoff-young'
    })
    // i need to get the sessionId as a variable to send with disconnectCall
  })

  it("opens receiver page", () => {
    cy.visit("http://localhost:3000/receiver", {
      // onBeforeLoad (win){ cy.spy(win, "message") }
  })
  
  cy.intercept('https://dev-api.talktree.me/getSession').as('getSession')
  cy.wait('@getSession')
  cy.get('[data-cy=accept]').click()
  cy.get('circle')
  cy.wait(300)
  cy.get('textarea')
  // cy.get('[data-cy=disconnect]').click()
  })
    //   onBeforeLoad (win) {
    //     cy.stub(win.Notification, 'permission', 'unknown')
    //     cy.stub(win.Notification, 'requestPermission').resolves('granted').as('ask')
    //     cy.stub(win, 'Notification').as('Notification')
    //   }
    // })
    // cy.window().should('have.property', 'Notification').should('be.a', 'function')
    // cy.intercept('POST', 'https://dev-api.talktree.me/register').as('register')
    // cy.wait('@register')
})