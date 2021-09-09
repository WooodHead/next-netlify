describe('Make an unpaid call', () => {
  it('Visits message', () => {
    cy.visit('http://localhost:3000/geoff-young/message')
    cy.intercept('https://dev-api.talktree.me/getUser').as('getUser')
    cy.intercept('POST', 'https://dev-api.talktree.me/createUnpaidSession').as('createUnpaidSession')
    cy.wait('@createUnpaidSession').its('response.statusCode').should('eql', 201)
    cy.get('textarea')

  })
})

describe("Example test", () => {
  before(() => {
    cy.signIn();
  });

  after(() => {
    cy.clearLocalStorageSnapshot();
    cy.clearLocalStorage();
  });

  beforeEach(() => {
    cy.restoreLocalStorage();
  });

  afterEach(() => {
    cy.saveLocalStorage();
  });

  it("should be logged in", () => {
    cy.visit("http://localhost:3000/");
    // cy.get(".App-logo").should("be.visible");

    it("Should talk about react", () => {
      cy.visit("/receiver")
      cy.contains("React")
    })
  });
});