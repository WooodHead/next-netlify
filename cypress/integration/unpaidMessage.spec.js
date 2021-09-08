describe('My First Test', () => {
  it('Visits message', () => {
    cy.visit('http://localhost:3000/geoff-young/message')
    cy.get('textarea')
  })
})