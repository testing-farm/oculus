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

describe('tmt-single-fail', () => it('run', () => {
    cy.visit('/results.html?url=scenarios/tmt-single-fail')
    cy.get('#overall-result').should('have.text', 'failed')
    // no config box, as only failed tests
    cy.get('#config').should('not.be.visible')
    // this scenario has no results-junit.xml
    cy.get('#download-junit').should('not.be.visible')

    // single top-level plan, opened by default
    cy.get('main > details')
        .should('contain', '/plans/all')
        .and('have.attr', 'open')
    cy.get('main > details summary').should('have.class', 'result-fail')

    cy.get('main > details').within(() => {
        // renders tmt reproducer inline
        cy.get('> log-viewer[url*="/tmt-reproducer.sh"]').should('exist')

        // log output for successful test is expanded
        cy.get('details')
            .should('contain', '/tests')
            .and('have.attr', 'open')
        cy.get('details summary').should('have.class', 'result-fail')
        // testout.log visible
        cy.get('details > log-viewer').shadow().find('pre')
            .should('have.text', 'something went wrong\n')
    })
}))

describe('tmt-mixed', () => it('run', () => {
    cy.visit('/results.html?url=scenarios/tmt-mixed')
    cy.get('#overall-result').should('have.text', 'failed')
    // failed tests are shown by default
    cy.get('main > details').should('contain', '/plans/features/basic')
    cy.get('main > details').should('contain', '/tests/discover/distgit')
    cy.get('main > details summary').should('have.class', 'result-fail')
    // passed tests are hidden by default
    cy.get('main > details').should('not.contain', '/tests/clean/chain')
    cy.get('details[class="result-pass"').should('not.exist')
    // config box, as there are passed and failed tests
    cy.get('#config')
        .should('be.visible')
        .should('not.be.selected')
    // show passed tests
    cy.get('#config input').click()
    cy.get('main > details:first-of-type summary')
        .should('have.class', 'result-pass')
        .should('contain', '/plans/features/advanced')
}))

describe('inprogress', () => it('run', () => {
    cy.visit('/results.html?url=scenarios/inprogress')
    cy.get('#overall-result').should('to.have.text', 'in progress')
    // no config box
    cy.get('#config').should('not.be.visible')
    // no results-junit.xml yet
    cy.get('#download-junit').should('not.be.visible')
    // show pipeline.log
    cy.get('main pre').should('have.text', 'tests\nare\n...\nrunning\n')
    cy.get('details').should('not.exist')
}))
