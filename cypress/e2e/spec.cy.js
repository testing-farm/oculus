describe('tmt-single-pass', () => it('run', () => {
    cy.visit('/results.html?url=scenarios/tmt-single-pass')
    cy.get('#overall-result').should('have.text', 'passed')
    // no config box, as only passed tests
    cy.get('#config').should('not.be.visible')
    // this scenario has results-junit.xml
    cy.get('#download-junit').should('be.visible')

    // single top-level plan, not opened by default
    cy.get('main > details')
        .should('contain', '/plans/all')
        .and('not.have.attr', 'open')
    cy.get('main > details summary').should('have.class', 'result-pass')

    // clicking on details opens expander and shows logs
    cy.get('main > details').click().should('have.attr', 'open')

    cy.get('main > details').within(() => {
        // Expected log links
        cy.get('ul')
            .should('contain', 'Copr build(s) installation')
            .and('contain', 'pre_artifact_installation')
            .and('contain', 'post_artifact_installation')
            .and('contain', 'workdir')

        // renders tmt reproducer inline
        cy.get('log-viewer')
            .should('have.attr', 'url')
            .and('contain', '/tmt-reproducer.sh')
        // log-viewer is custom element with a shadow-root
        cy.get('log-viewer').shadow().find('pre')
            .should('contain', 'tmt run --all')

        // log output for successful test is collapsed
        cy.get('details')
            .should('contain', '/tests')
            .and('not.have.attr', 'open')
        cy.get('details summary').should('have.class', 'result-pass')

        cy.get('details').click()
            .should('have.attr', 'open')
        // testout.log visible
        cy.get('details > log-viewer').shadow().find('pre')
            .should('have.text', 'all good!\n')
    })
}))
