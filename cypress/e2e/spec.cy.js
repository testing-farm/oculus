describe('tmt-single-pass', () => it('run', () => {
    cy.visit('/results.html?url=scenarios/tmt-single-pass');
    cy.get('#overall-result').should('have.text', 'passed');
    // no config box, as only passed tests
    cy.get('#config').should('not.be.visible');
    // this scenario has results-junit.xml
    cy.get('#download-junit').should('be.visible');

    // single top-level plan, opened by default
    cy.get('main > details')
        .should('contain', '/plans/all')
        .and('have.attr', 'open');
    cy.get('main > details summary').should('have.class', 'result-pass');

    cy.get('main > details').within(() => {
        // Expected log links
        cy.get('ul')
            .should('contain', 'Copr build(s) installation')
            .and('contain', 'pre_artifact_installation')
            .and('contain', 'post_artifact_installation')
            .and('contain', 'workdir');

        // renders tmt reproducer inline
        cy.get('log-viewer[url*="/tmt-reproducer.sh"]')
        // log-viewer is custom element with a shadow-root
            .shadow().find('pre')
            .should('contain', 'tmt run --all')
            .should('contain', 'plan --name ^\\/plans\\/all');

        // log output for single test is expanded
        cy.get('details')
            .should('contain', '/tests')
            .and('have.attr', 'open');
        cy.get('details summary').should('have.class', 'result-pass');

        // testout.log visible
        cy.get('details log-viewer').shadow().find('pre')
            .should('have.text', 'all good!\n');
    });
}));

describe('tmt-single-fail', () => it('run', () => {
    cy.visit('/results.html?url=scenarios/tmt-single-fail');
    cy.get('#overall-result').should('have.text', 'failed');
    // no config box, as only failed tests
    cy.get('#config').should('not.be.visible');
    // this scenario has no results-junit.xml
    cy.get('#download-junit').should('not.be.visible');

    // single top-level plan, opened by default
    cy.get('main > details')
        .should('contain', '/plans/all')
        .and('have.attr', 'open');
    cy.get('main > details summary').should('have.class', 'result-fail');

    cy.get('main > details').within(() => {
        // renders tmt reproducer inline
        cy.get('log-viewer[url*="/tmt-reproducer.sh"]').should('exist');

        // log output for failed test is expanded
        cy.get('details')
            .should('contain', '/tests')
            .and('have.attr', 'open');
        cy.get('details summary').should('have.class', 'result-fail');
        // testout.log visible
        cy.get('details log-viewer').shadow().find('pre')
            .should('have.text', 'something went wrong\n');
    });
}));

describe('tmt-html-artifact', () => it('run', () => {
    cy.visit('/results.html?url=scenarios/tmt-html-artifact');
    cy.get('#overall-result').should('have.text', 'failed');

    // single top-level plan, opened by default
    cy.get('main > details')
        .should('contain', '/plans/all')
        .and('have.attr', 'open');
    cy.get('main > details summary').should('have.class', 'result-fail');

    cy.get('main > details').within(() => {
        // failed test is expanded
        cy.get('details')
            .should('contain', '/tests')
            .and('have.attr', 'open');
        cy.get('details summary').should('have.class', 'result-fail');
        // no log viewer, as we have a HTML artifact
        cy.get('details > log-viewer').should('not.exist');
        // custom viewer is shown inline as an iframe
        cy.get('h3').should('contain', 'viewer.html');
        cy.get('iframe')
            .should('have.attr', 'src')
            .and('contain', '/plans/all/execute/data/tests/viewer.html');
        cy.get('iframe')
            // retries until body is loaded
            .its('0.contentDocument.body').should('not.be.empty')
            .should('contain', 'Custom results viewer');
    });
}));

describe('tmt-mixed', () => it('run', () => {
    cy.visit('/results.html?url=scenarios/tmt-mixed');
    cy.get('#overall-result').should('have.text', 'failed');
    // failed tests are shown by default
    cy.get('main > details').should('contain', '/plans/features/basic');
    cy.get('main > details').should('contain', '/tests/discover/distgit');
    cy.get('main > details summary').should('have.class', 'result-fail');
    // links and shows correct reproducer
    cy.get('log-viewer[url*="/work-basic_WExhR/tmt-reproducer.sh"]')
        .shadow().find('pre')
        .should('contain', 'plan --name ^\\/plans\\/features\\/basic');
    // passed tests are hidden by default
    cy.get('main > details').should('not.contain', '/tests/clean/chain');
    cy.get('details[class="result-pass"').should('not.exist');
    // config box, as there are passed and failed tests
    cy.get('#config')
        .should('be.visible')
        .should('not.be.selected');
    // show passed tests
    cy.get('#config input').click();
    cy.get('main > details:first-of-type summary')
        .should('have.class', 'result-pass')
        .should('contain', '/plans/features/advanced');
    // open advanced plan
    cy.get('main > details:first-of-type ').click()
        .should('have.attr', 'open');
    // scroll bar is almost at the top initially
    cy.window().its('scrollY').should('lessThan', 150);

    // jump to plan artifacts
    cy.get('main > details:nth-of-type(1) > p > a')
        .should('have.text', 'Go to Logs and Artifacts')
        .click();
    // this moves tmt-reproducer to the top
    cy.window().its('scrollY')
        .should('greaterThan', 1000);
    cy.get('log-viewer[url*="/work-advancedw2ccwZ/tmt-reproducer.sh"')
        .then(element => element[0].offsetTop)
        .then(offset => cy.window().its('scrollY').should('closeTo', offset, 50));

    // links and shows correct reproducer for advanced plan
    cy.get('log-viewer[url*="/work-advancedw2ccwZ/tmt-reproducer.sh"')
        .shadow().find('pre')
        .should('contain', 'plan --name ^\\/plans\\/features\\/advanced');
}));

describe('tmt-failed-install', () => it('run', () => {
    cy.visit('/results.html?url=scenarios/tmt-failed-install');
    cy.get('#overall-result').should('have.text', 'error');
    // no config box, as only failed tests
    cy.get('#config').should('not.be.visible');

    // single top-level plan, opened by default
    cy.get('main > details')
        .should('contain', '/plans/ci')
        .and('have.attr', 'open');
    cy.get('main > details summary').should('have.class', 'result-error');

    cy.get('main > details').within(() => {
        // pre_artifact_installation succeeded, log link present
        cy.get('ul')
            .should('contain', 'pre_artifact_installation')
            .and('not.contain', 'build installation')
            .and('not.contain', 'post_artifact_installation');

        // renders artifact installation logs inline, with concatenating all log files
        cy.get('log-viewer[url*="/artifact-installation-2f53d6d4-ef46-42af-a3d1-c87db9490f27"]')
            .shadow().find('pre')
            .should('contain', 'koji download-build')
            .and('contain', 'dnf --allowerasing -y install')
            .and('contain', 'nothing provides pkgconfig(binutils-devel)')
            .and('not.contain', 'Index of');
    });
}));

describe('tmt-failed-install-rhel', () => it('run', () => {
    cy.visit('/results.html?url=scenarios/tmt-failed-install-rhel');
    cy.get('#overall-result').should('have.text', 'error');

    cy.get('main > details').within(() => {
        // pre_artifact_installation succeeded, log link present
        cy.get('ul')
            .should('contain', 'pre_artifact_installation')
            .and('not.contain', 'build installation')
            .and('not.contain', 'post_artifact_installation');

        // renders artifact installation logs inline, with concatenating all log files
        cy.get('log-viewer[url*="/artifact-installation-f5fd255d-f104-4ecb-ac7e-47333c4895b0"]')
            .shadow().find('pre')
            .should('contain', 'TheDownloadLog')
            .and('contain', 'TheInstallLog')
            .and('not.contain', 'Index of');
    });
}));

describe('tmt-error-no-logs', () => it('run', () => {
    cy.exec('mkdir -p cypress/downloads/nologs');
    cy.writeFile('cypress/downloads/nologs/pipeline.log', 'pipeline details\nwith more\nerror messages\n');
    cy.writeFile('cypress/downloads/nologs/results.xml',
                 '<testsuites overall-result="error">\n' +
                 '  <testsuite name="/plans/ci" result="undefined" tests="0"></testsuite>\n' +
                 '</testsuites>\n');

    cy.visit('/results.html?url=cypress/downloads/nologs');
    cy.get('#overall-result').should('have.text', 'error');

    cy.get('main > details')
        .should('contain', '/plans/ci')
        .and('have.attr', 'open');
    cy.get('main > details summary').should('have.class', 'result-error');
    cy.get('main > details')
        .should('contain', 'Tests failed to run')
        .should('contain', 'pipeline.log');
}));

describe('inprogress', () => it('run', () => {
    // initialize 🕗, we want to move forward time
    cy.clock();
    // copy scenrios/inprogress into cypress/downloads, so we can play with it
    // NOTE: cypress/downloads location is trashed on each start of cypress
    //       https://docs.cypress.io/guides/references/configuration#Downloads
    cy.exec('mkdir -p cypress/downloads/; cp -r scenarios/inprogress cypress/downloads/');
    cy.visit('/results.html?url=cypress/downloads/inprogress');
    cy.get('#overall-result').should('to.have.text', 'in progress');
    // no config box
    cy.get('#config').should('not.be.visible');
    // no results-junit.xml yet
    cy.get('#download-junit').should('not.be.visible');
    // show pipeline.log
    cy.get('main pre').should('have.text', 'tests\nare\n...\nrunning\n');
    cy.get('details').should('not.exist');
    // add more stuff into progress.log
    cy.writeFile('cypress/downloads/inprogress/pipeline.log', 'added to log later\naligator\n', { flag: 'a+' })
    // go forward 6s
    cy.tick(6000);
    // make sure the log is updated
    cy.get('main pre').should('have.text', 'tests\nare\n...\nrunning\nadded to log later\naligator\n');
}));

describe('inprogress-no-reload', () => it('run', () => {
    // initialize 🕗, we want to move forward time
    cy.clock();
    // copy scenrios/inprogress into cypress/downloads, so we can play with it
    // NOTE: cypress/downloads location is trashed on each start of cypress
    //       https://docs.cypress.io/guides/references/configuration#Downloads
    cy.exec('cp -r scenarios/inprogress cypress/downloads')
    cy.writeFile('cypress/downloads/inprogress/pipeline.log', 'old line\n'.repeat(100)+'last old line\n', { flag: 'a+' })
    cy.visit('/results.html?url=cypress/downloads/inprogress');
    cy.get('#overall-result').should('to.have.text', 'in progress');
    // no config box
    cy.get('#config').should('not.be.visible');
    // no results-junit.xml yet
    cy.get('#download-junit').should('not.be.visible');
    // show pipeline.log
    cy.get('main pre').should('include.text', 'last old line\n');
    cy.get('details').should('not.exist');
    // scroll page up so the log won't be reloaded
    cy.scrollTo('top');
    // add more stuff into progress.log
    cy.writeFile('cypress/downloads/inprogress/pipeline.log', 'new line\n', { flag: 'a+' })
    // go forward 6s
    cy.tick(6000);
    // confirm the log was not updated
    cy.get('main pre').should('not.include.text', 'new line\n');
    // now scroll to the bottom and wait 6s for log reload
    cy.scrollTo('bottom');
    cy.tick(6000);
    // confirm the log was updated this time
    cy.get('main pre').should('include.text', 'new line\n');
}));

// produced by https://gitlab.com/testing-farm/infrastructure/-/blob/testing-farm/ranch/public/jobs/tf-tmt
describe('tf-synthetic-error', () => it('run', () => {
    cy.visit('/results.html?url=scenarios/tf-synthetic-error');
    cy.get('#overall-result').should('have.text', 'error');

    cy.get('main > details')
        .should('contain', 'pipeline')
        .and('have.attr', 'open');
}));
