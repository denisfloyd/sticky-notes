describe('StickyNotes Feature Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should render sticky notes application', () => {
    cy.get('#container').should('exist');
    cy.contains('button', '+').should('exist');
    cy.get('#trashZone').should('exist');
  });

  it('should be able to create a sticky note', () => {
    cy.contains('button', '+').click();

    cy.get("[data-testid='sticky']").should('exist');
    cy.get("[data-testid='sticky']").within(() => {
      cy.get('header').should('exist');
      cy.get('textarea').should('exist');
    });
  });

  it('should able to move a sticky note', () => {
    cy.contains('button', '+').click();

    cy.get("[data-testid='sticky']").within(() => {
      cy.get('header')
        .trigger('mousedown', { which: 1 })
        .trigger('mousemove', { clientX: 400, clientY: 200 })
        .trigger('mouseup', { force: true });
    });

    cy.get("[data-testid='sticky']")
      .should('have.attr', 'style')
      .should('contain', 'transform', 'translate(300px, 180px)');
  });

  it.only('should be able to remove a sticky note', () => {
    cy.contains('button', '+').click();

    cy.get("[data-testid='sticky']").within(() => {
      cy.get('header')
        .trigger('mousedown', { which: 1 })
        .trigger('mousemove', { clientX: 800, clientY: 400 })
        .trigger('mouseup', { force: true });
    });

    cy.get("[data-testid='sticky']").should('not.exist');
  });
});
