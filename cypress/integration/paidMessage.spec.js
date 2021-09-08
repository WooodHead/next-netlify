describe('My First Test', () => {
  it('Visits message', () => {
    cy.visit('http://localhost:3000/gt2/message')
    cy.get('form').within(() => {
      cy.fillElementsInput('cardNumber', '4242424242424242');
      cy.fillElementsInput('cardExpiry', '1025'); // MMYY
      cy.fillElementsInput('cardCvc', '123');
      cy.fillElementsInput('postalCode', '90210');
    })
    cy.contains('submit and call').click()
    // cy.contains('chat_shit')
  })
})