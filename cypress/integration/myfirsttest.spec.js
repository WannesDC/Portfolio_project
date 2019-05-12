describe('My First Test', function() {
    //check if app is running
    it('our app runs', function() {
        cy.visit('/');
      });

    it('you can register an account', function() {
        cy.get('[data-cy=register-open]').click();
        cy.get('[data-cy=register-button]').should('be.disabled');
        cy.get('[data-cy=register-firstname]').type('Testman');
        cy.get('[data-cy=register-lastname]').type('De Tester');
        cy.get('[data-cy=register-email]').type('testman.detester@test.com');
        cy.get('[data-cy=register-password]').type('1234_Testman');
        cy.get('[data-cy=register-confirm-password]').type('1234_Testman');
        cy.get('[data-cy=register-button]').should('not.be.disabled');

    });

  });