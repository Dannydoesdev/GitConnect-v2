// describe('empty spec', () => {
//   it('passes', () => {
//     cy.visit('https://example.cypress.io')
//   })
// })


describe('Test homepage', () => {
  it('Heading shows up', () => {
    cy.visit('localhost:3000')

    // The new page should contain an h1 with "About page"
    cy.get('h1').contains('GitConnect;')

    // cy.contains('type')
  })
})