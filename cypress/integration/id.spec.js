describe("GetNotion", () => {

  it("visits my user page", () => {
    cy.visit(`http://localhost:3000/geoff-young`)
    cy.get('.notion').should('be.visible')
  })
})