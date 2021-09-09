describe('Make an unpaid call', () => {
  it('Visits message', () => {
    cy.visit('http://localhost:3000/geoff-young/message')
    cy.intercept('https://dev-api.talktree.me/getUser').as('getUser')
    cy.intercept('POST', 'https://dev-api.talktree.me/createUnpaidSession').as('createUnpaidSession')
    cy.wait('@createUnpaidSession').its('response.statusCode').should('eql', 201)
    cy.get('textarea')

  })
})