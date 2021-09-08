describe('My First Test', () => {
  it('Visits message', () => {
    cy.visit('http://localhost:3000/')
    cy.contains('Talktree')
  })
})