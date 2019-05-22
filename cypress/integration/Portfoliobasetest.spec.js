describe('Testing login & create / delete portfolio', function() {
    //check if app is running
    it('our app runs', function() {
        cy.visit('/');
      });

    it('you can log in to an account', function() {
        cy.get('[data-cy=login-email]').type('cypress@test.com').should('have.value', 'cypress@test.com');
        cy.get('[data-cy=login-password]').type('1234_Cypress').should('have.value', '1234_Cypress');
        cy.get('[data-cy=login-button]').click();
    });

    it('you can add features to a portfolio', function(){
        cy.wait(2000);
        cy.get('[data-cy=open-exp]').click();

        cy.get('[data-cy=exp-comp]').type('cypress_tests').should('have.value', 'cypress_tests');
        cy.get('[data-cy=exp-pos]').type('cypress tests position').should('have.value', 'cypress tests position');
        cy.get('[data-cy=exp-link]').type('https://docs.cypress.io/').should('have.value', 'https://docs.cypress.io/');
        cy.get('[data-cy=exp-desc]').type('cypress_tests description').should('have.value', 'cypress_tests description');
        cy.get('[data-cy=exp-time-start]').type('1995-06-13').should('have.value', '1995-06-13');
        cy.get('[data-cy=exp-time-end]').type('2005-06-13').should('have.value', '2005-06-13');
        cy.get('[data-cy=exp-submit]').click();

        cy.wait(2000);
        cy.get('[data-cy=close-exp]').click();

        cy.wait(500);

        cy.get('[data-cy=open-works]').click();
        cy.get('[data-cy=work-name]').type('cypress_tests').should('have.value', 'cypress_tests');
        cy.get('[data-cy=work-desc]').type('cypress_tests description').should('have.value', 'cypress_tests description');
        cy.get('[data-cy=work-link]').type('https://docs.cypress.io/').should('have.value', 'https://docs.cypress.io/');
        cy.get('[data-cy=work-time]').type('1995-06-13').should('have.value', '1995-06-13');
        cy.get('[data-cy=work-submit]').click();
        cy.wait(2000);
        cy.get('[data-cy=close-works]').click();
    })

    it('you can edit your portfolio name', function(){
        cy.wait(1000);
        cy.get('[data-cy=open-edit]').click();
        cy.wait(500);
        cy.get('[data-cy=edit-port-name]').clear();
        cy.get('[data-cy=edit-port-name]').type('cypress_tests').should('have.value', 'cypress_tests');
        cy.get('[data-cy=edit-save]').click();
        cy.wait(500);
        cy.get('[data-cy=close-edit]').click();
    });

    it('you can log out once finished', function(){
        cy.wait(1000);
        cy.get('[data-cy=logout]').click();
    });


  });