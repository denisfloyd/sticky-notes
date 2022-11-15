describe('StickyNotes Feature Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('it should render sticky notes application', () => {
    cy.get('#container').should('exist');
    cy.contains('button', '+').should('exist');
    cy.get('#trashZone').should('exist');
  });
});
