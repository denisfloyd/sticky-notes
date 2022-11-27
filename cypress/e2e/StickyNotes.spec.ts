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

    cy.then(() => {
      cy.wrap(JSON.parse(localStorage.getItem('@sticky-notes/notes'))).should('not.be.empty');
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

    cy.wait(100);
    cy.then(() => {
      cy.wrap(JSON.parse(localStorage.getItem('@sticky-notes/notes')))
        .should('not.be.empty')
        .then((sticky) => Cypress._.map(sticky, (o) => Cypress._.pick(o, ['x', 'y'])))
        .should('deep.include', { x: 300, y: 180 });
    });
  });

  it('should be able to remove a sticky note', () => {
    cy.contains('button', '+').click();

    cy.get("[data-testid='sticky']").within(() => {
      cy.get('header')
        .trigger('mousedown', { which: 1 })
        .trigger('mousemove', { clientX: 800, clientY: 400 })
        .trigger('mouseup', { force: true });
    });

    cy.get("[data-testid='sticky']").should('not.exist');

    cy.then(() => {
      cy.wrap(JSON.parse(localStorage.getItem('@sticky-notes/notes'))).should('be.empty');
    });
  });

  it('should be able to edit a sticky note', () => {
    cy.contains('button', '+').click();

    cy.get("[data-testid='sticky']").within(() => {
      cy.get('textarea').type('do something');
    });

    // debounce time
    cy.wait(500);
    cy.then(() => {
      cy.wrap(JSON.parse(localStorage.getItem('@sticky-notes/notes')))
        .should('not.be.empty')
        .then((sticky) => Cypress._.map(sticky, (o) => Cypress._.pick(o, 'text')))
        .should('deep.include', { text: 'do something' });
    });
  });

  it('should be able to resize a sticky note', () => {
    cy.contains('button', '+').click();

    cy.get("[data-testid='sticky']").within(() => {
      cy.get('textarea').invoke('attr', 'style', 'width: 300px; height: 300px');
    });

    cy.wait(200);
    cy.then(() => {
      cy.wrap(JSON.parse(localStorage.getItem('@sticky-notes/notes')))
        .should('not.be.empty')
        .then((sticky) => Cypress._.map(sticky, (o) => Cypress._.pick(o, ['width', 'height'])))
        .should('deep.include', { width: 300, height: 300 });
    });
  });

  it('should move a sticky to front in case overlapping another', () => {
    cy.contains('button', '+').click();
    cy.contains('button', '+').click();

    cy.get('#sticky-1').within(() => {
      cy.get('header')
        .trigger('mousedown', { which: 1, force: true })
        .trigger('mousemove', { clientX: 400, clientY: 200, force: true })
        .trigger('mouseup', { force: true });
    });

    cy.get('#sticky-2').within(() => {
      cy.get('header')
        .trigger('mousedown', { which: 1, force: true })
        .trigger('mousemove', { clientX: 400, clientY: 250, force: true })
        .trigger('mouseup', { force: true });
    });

    cy.get('#sticky-1').should('have.attr', 'style').should('contain', 'z-index: 0');
    cy.get('#sticky-2').should('have.attr', 'style').should('contain', 'z-index: 1');
  });

  it('should save stickies interations in localStorage and restore them after reload page', () => {
    cy.contains('button', '+').click();
    cy.contains('button', '+').click();

    cy.get('#sticky-1').within(() => {
      cy.get('header')
        .trigger('mousedown', { which: 1, force: true })
        .trigger('mousemove', { clientX: 200, clientY: 100, force: true })
        .trigger('mouseup', { force: true });
    });

    cy.get('#sticky-1').within(() => {
      cy.get('textarea').invoke('attr', 'style', 'width: 250px; height: 250px');
    });

    cy.get('#sticky-1').within(() => {
      cy.get('textarea').type('do something #1', { force: true });
    });

    cy.get('#sticky-2').within(() => {
      cy.get('header')
        .trigger('mousedown', { which: 1, force: true })
        .trigger('mousemove', { clientX: 750, clientY: 0, force: true })
        .trigger('mouseup', { force: true });
    });

    cy.get('#sticky-2').within(() => {
      cy.get('textarea').invoke('attr', 'style', 'width: 300px; height: 300px');
    });

    cy.get('#sticky-2').within(() => {
      cy.get('textarea').type('do something #2', { force: true });
    });

    // debounce time
    cy.wait(500);

    cy.reload();

    cy.get('#sticky-1').should('exist');
    cy.get('#sticky-1').within(() => cy.get('textarea').should('contain', 'do something #1'));
    cy.get('#sticky-1').within(() =>
      cy
        .get('textarea')
        .should('have.attr', 'style')
        .should('contain', 'width: 250px', 'height: 250px'),
    );
    cy.get('#sticky-1')
      .should('have.attr', 'style')
      .should('contain', 'transform', 'translate(100px, 80px)');

    cy.get('#sticky-2').should('exist');
    cy.get('#sticky-2').within(() => cy.get('textarea').should('contain', 'do something #2'));
    cy.get('#sticky-2').within(() =>
      cy
        .get('textarea')
        .should('have.attr', 'style')
        .should('contain', 'width: 300px', 'height: 300px'),
    );
    cy.get('#sticky-2')
      .should('have.attr', 'style')
      .should('contain', 'transform', 'translate(650px, 0px)');
  });
});
