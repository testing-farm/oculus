
const requestIdMock = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";

function addRequestId(url){
    return url + "&requestId=" + requestIdMock;
}

// most of the tests are fine with this request 
beforeEach(() => {
    cy.intercept(
        'GET',
        'https://api.testing-farm.io/v0.1/requests/' + requestIdMock,
        { fixture: 'complete.json' }
    )
})

describe('tmt-single-pass', () => it('run', () => {
    cy.visit(addRequestId('/results.html?url=scenarios/tmt-single-pass'));
    cy.get('#overall-result').should('have.text', 'passed');
    // no config box, as only passed tests
    cy.get('#config').should('not.be.visible');
    // this scenario has results-junit.xml
    cy.get('#download-junit').should('be.visible');
    // docs are always visible
    cy.get('#docs').should('be.visible');

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
            .should('contain', ' (original result: fail)')
            .and('have.attr', 'open');
        cy.get('details summary').should('have.class', 'result-pass');

        // testout.log visible
        cy.get('details log-viewer').shadow().find('pre')
            .should('have.text', 'all good!\n');
        
        // subresults or checks should not exist
        cy.get('details details').should('not.exist');
    });

    // no pipeline.log, as successful
    cy.get('details[class="pipeline-log"]').should('not.exist');

    // check if link to pipeline.log
    cy.get('header > #pipeline-log')
        .should('be.visible')
        .should('contain', 'Pipeline log')
        .and('have.attr', 'href', 'scenarios/tmt-single-pass/pipeline.log')

    // error reason shown not be shown
    cy.get('main > details summary p').should('not.exist')

}));

describe('tmt-single-info', () => it('run', () => {
    cy.visit(addRequestId('/results.html?url=scenarios/tmt-single-info'));
    cy.get('#overall-result').should('have.text', 'info');
    // no config box, as only passed tests
    cy.get('#config').should('not.be.visible');
    // this scenario has no results-junit.xml
    cy.get('#download-junit').should('not.be.visible');
    // docs are always visible
    cy.get('#docs').should('be.visible');

    // single top-level plan, opened by default
    cy.get('main > details')
        .should('contain', '/plans/all')
        .and('have.attr', 'open');
    cy.get('main > details summary').should('have.class', 'result-info');

    cy.get('main > details').within(() => {
        // log output for single test is expanded
        cy.get('details')
            .should('contain', '/tests')
            .and('have.attr', 'open');
        cy.get('details summary').should('have.class', 'result-info');

        // testout.log visible
        cy.get('details log-viewer').shadow().find('pre')
            .should('have.text', 'some info only\n');

        // subresults or checks should not exist
        cy.get('details details').should('not.exist');
    });

    // no pipeline.log, as successful
    cy.get('details[class="pipeline-log"]').should('not.exist');

    // check if link to pipeline.log
    cy.get('header > #pipeline-log')
        .should('be.visible')
        .should('contain', 'Pipeline log')
        .and('have.attr', 'href', 'scenarios/tmt-single-info/pipeline.log')

    // error reason shown not be shown
    cy.get('main > details summary p').should('not.exist')
}));


describe('tmt-21-fails', () => it('run', () => {
    cy.visit(addRequestId('/results.html?url=scenarios/tmt-21-fails'));
    cy.get('#overall-result').should('have.text', 'failed');
    // no config box, as only failed tests
    cy.get('#config').should('not.be.visible');
    // this scenario has no results-junit.xml
    cy.get('#download-junit').should('not.be.visible');
    // docs are always visible
    cy.get('#docs').should('be.visible');

    // single top-level plan, collapsed by default
    cy.get('main > details')
        .should('contain', '/plans/all')
        .and('have.attr', 'open');
    cy.get('main > details summary').should('have.class', 'result-fail');

    cy.get('main > details').within(() => {
        // renders tmt reproducer inline
        cy.get('log-viewer[url*="/tmt-reproducer.sh"]').should('exist');

        // log output for failed test is collapsed
        cy.get('details')
            .should('contain', '/tests1')
            .and('not.have.attr', 'open');
        cy.get('details summary').should('have.class', 'result-fail');

        // subresults or checks should not exist
        cy.get('details details').should('not.exist');
    });

    // no pipeline.log, as not an error state
    cy.get('details[class="pipeline-log"]').should('not.exist');

    // error reason shown not be shown
    cy.get('main > details summary p').should('not.exist')
}));


describe('tmt-2-fails', () => it('run', () => {
    cy.visit(addRequestId('/results.html?url=scenarios/tmt-2-fails'));
    cy.get('#overall-result').should('have.text', 'failed');
    // no config box, as only failed tests
    cy.get('#config').should('not.be.visible');
    // this scenario has no results-junit.xml
    cy.get('#download-junit').should('not.be.visible');
    // docs are always visible
    cy.get('#docs').should('be.visible');

    // single top-level plan, collapsed by default
    cy.get('main > details')
        .should('contain', '/plans/all')
        .and('have.attr', 'open');
    cy.get('main > details summary').should('have.class', 'result-fail');

    cy.get('main > details').within(() => {
        // renders tmt reproducer inline
        cy.get('log-viewer[url*="/tmt-reproducer.sh"]').should('exist');

        // log output for failed test is collapsed
        cy.get('details')
            .should('contain', '/tests1')
            .and('not.have.attr', 'open');
        cy.get('details summary').should('have.class', 'result-fail');

        // subresults or checks should not exist
        cy.get('details details').should('not.exist');
    });

    // no pipeline.log, as not an error state
    cy.get('details[class="pipeline-log"]').should('not.exist');

    // error reason shown not be shown
    cy.get('main > details summary p').should('not.exist')
}));


describe('tmt-single-fail', () => it('run', () => {
    cy.visit(addRequestId('/results.html?url=scenarios/tmt-single-fail'));
    cy.get('#overall-result').should('have.text', 'failed');
    // no config box, as only failed tests
    cy.get('#config').should('not.be.visible');
    // this scenario has no results-junit.xml
    cy.get('#download-junit').should('not.be.visible');
    // docs are always visible
    cy.get('#docs').should('be.visible');

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
        
        // subresults
        cy.get('details:nth-child(3) > details:nth-child(3) > summary')
            .should('have.class', 'result-fail')
            .should('contain', '3 subresults (2 passed, 1 failed, 0 error)');
        cy.get('details:nth-child(3) > details:nth-child(3)').within(() => {
            cy.get('details:nth-child(2) > summary')
                .should('have.class', 'result-pass')
                .should('contain', '/some-test')
                .should('contain', 'pass');
            cy.get('details:nth-child(2) > div > ul > li > a').should('have.text', 'some-test_log1.txt');
            cy.get('details:nth-child(3) > summary')
                .should('have.class', 'result-pass')
                .should('contain', '/some-other-test')
                .should('contain', 'pass');
            cy.get('details:nth-child(3) > div > ul > li > a').should('have.text', 'some-other-test_log2.txt');
            cy.get('div:nth-child(4) > monospace > div')
                .should('have.class', 'result-fail')
                .should('contain', '/some-test')
                .should('contain', 'fail');
        });

        // checks
        cy.get('details:nth-child(3) > details:nth-child(5) > summary')
            .should('have.class', 'result-error')
            .should('contain', '4 checks (1 passed, 1 failed, 1 error, 1 skipped)');
        cy.get('details:nth-child(3) > details:nth-child(5)').within(() => {
            cy.get('details:nth-child(2) > summary')
                .should('have.class', 'result-fail')
                .should('contain', 'dmesg (before-test)').should('contain', 'fail');
            cy.get('details:nth-child(2) > div > ul > li > a').should('have.text', 'dmesg-before-test.txt');
            cy.get('details:nth-child(3) > summary')
                .should('have.class', 'result-pass')
                .should('contain', 'dmesg (after-test)')
                .should('contain', 'pass');
            cy.get('details:nth-child(3) > div > ul > li > a').should('have.text', 'dmesg-after-test.txt');
            cy.get('details:nth-child(4) > summary')
                .should('have.class', 'result-error')
                .should('contain', 'avc (before-test)')
                .should('contain', 'error');
            cy.get('details:nth-child(4) > div > ul > li > a').should('have.text', 'avc-before-test.txt');
            cy.get('div:nth-child(5) > monospace > div')
                .should('have.class', 'result-skip')
                .should('contain', 'avc (after-test)')
                .should('contain', 'skip');
        });
    });

    // no pipeline.log, as not an error state
    cy.get('details[class="pipeline-log"]').should('not.exist');

    // error reason shown not be shown
    // cy.get('main > details summary p').should('not.exist')  // TODO: fix test, it collides with <p> with notes

    // notes should be visible
    cy.get('.notes > li:nth-child(1)').should('have.text', "check 'dmesg' failed");
    cy.get('.notes > li:nth-child(2)').should('have.text', 'original test result: pass');
}));

describe('tmt-double-pass', () => it('run', () => {
    cy.visit(addRequestId('/results.html?url=scenarios/tmt-double-pass'));

    // container test - does not have compose visible
    cy.get('#main > details:nth-child(1) > summary:nth-child(1)').should('contain', '/testing-farm/sanity')
    cy.get('#main > details:nth-child(1) > summary:nth-child(1) > monospace').should('contain', '💻 x86_64')
    // guest test - does have compose visible
    cy.get('#main > details:nth-child(2) > summary:nth-child(1)').should('contain', '/testing-farm/sanity1')
    cy.get('#main > details:nth-child(2) > summary:nth-child(1) > monospace').should('contain', '💻 x86_64 💿 Fedora-Rawhide\n')
}));

describe('tmt-html-artifact', () => it('run', () => {
    cy.visit(addRequestId('/results.html?url=scenarios/tmt-html-artifact'));
    cy.get('#overall-result').should('have.text', 'failed');

    // docs are always visible
    cy.get('#docs').should('be.visible');

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

        // subresults or checks should not exist
        cy.get('details details').should('not.exist');
    });

    // error reason shown not be shown
    cy.get('main > details summary p').should('not.exist')
}));

describe('tmt-mixed', () => it('run', () => {
    cy.visit(addRequestId('/results.html?url=scenarios/tmt-mixed'));
    cy.get('#overall-result').should('have.text', 'failed');
    // docs are always visible
    cy.get('#docs').should('be.visible');
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

    // error reason shown not be shown
    cy.get('main > details summary p').should('not.exist')
}));

describe('tmt-multihost-pass', () => it('run', () => {
    cy.visit(addRequestId('/results.html?url=scenarios/tmt-multihost-pass'));

    // plan contains the correct plan name, names, arches and composes of all guests
    const plan = cy.get('#main > details:nth-child(1) > summary:nth-child(1)')
    plan.should('contain', '/testing-farm/multihost')
    const plan_info = cy.get('#main > details:nth-child(1) > summary:nth-child(1) > monospace')
    plan_info.should('contain', 'server: 💻 x86_64 💿 Fedora-Rawhide')
    plan_info.should('contain', 'client: 💻 aarch64 💿 Fedora-40')
    // check if css is set to a small monospace font
    plan_info.should('have.css', 'font-family', 'monospace')
    plan_info.should('have.css', 'font-size', '11px')

    // each test contains the correct name of the test and name of the guest it was executed on 
    const test_1 = cy.get('#main > details:nth-child(1) > details:nth-child(3) > summary:nth-child(1)')
    test_1.should('contain', '/server-setup/testing-farm/tests/multihost/A')
    test_1.should('contain', 'test #1 on server')
    const test_2 = cy.get('#main > details:nth-child(1) > details:nth-child(4) > summary:nth-child(1)')
    test_2.should('contain', '/tests/testing-farm/tests/multihost/B')
    test_2.should('contain', 'test #2 on server')
    const test_3 = cy.get('#main > details:nth-child(1) > details:nth-child(5) > summary:nth-child(1)')
    test_3.should('contain', '/tests/testing-farm/tests/multihost/B')
    test_3.should('contain', 'test #2 on client')
    const test_4 = cy.get('#main > details:nth-child(1) > details:nth-child(6) > summary:nth-child(1)')
    test_4.should('contain', '/tests/testing-farm/tests/multihost/C')
    test_4.should('contain', 'test #3 on server')
    const test_5 = cy.get('#main > details:nth-child(1) > details:nth-child(7) > summary:nth-child(1)')
    test_5.should('contain', '/tests/testing-farm/tests/multihost/C')
    test_5.should('contain', 'test #3 on client')

    cy.get('#overall-result').should('have.text', 'passed');
    // docs are always visible
    cy.get('#docs').should('be.visible');
    // open advanced plan
    cy.get('main > details:first-of-type ').click()
        .should('have.attr', 'open');
    // scroll bar is almost at the top initially
    cy.window().its('scrollY').should('lessThan', 150);

    // jump to plan artifacts
    cy.get('main > details:nth-of-type(1) > p > a')
        .should('have.text', 'Go to Logs and Artifacts')
        .click();
}));

describe('tmt-failed-install', () => it('run', () => {
    cy.intercept(
        'GET',
        'https://api.testing-farm.io/v0.1/requests/' + requestIdMock,
        { fixture: 'error.json' }
    )

    cy.visit(addRequestId('/results.html?url=scenarios/tmt-failed-install'));
    cy.get('#overall-result').should('have.text', 'error');
    // no config box, as only failed tests
    cy.get('#config').should('not.be.visible');
    // docs are always visible
    cy.get('#docs').should('be.visible');

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

        // subresults or checks should not exist
        cy.get('details details').should('not.exist');
    });

    // error state shows pipeline.log
    cy.get('details[class="pipeline-log"] log-viewer')
        .shadow().find('pre')
        .should('contain', 'pipeline details')
        .should('contain', '[E]rror messages')
        .find('span')
        .should('have.attr', 'style', 'color:rgb(187,0,0)');

    // error reason shown not be shown (no mocked request)
    cy.get('main > details summary p').should('not.exist')
}));

describe('tmt-failed-install-rhel', () => it('run', () => {
    cy.intercept(
        'GET',
        'https://api.testing-farm.io/v0.1/requests/' + requestIdMock,
        { fixture: 'error.json' }
    )

    cy.visit(addRequestId('/results.html?url=scenarios/tmt-failed-install-rhel'));
    cy.get('#overall-result').should('have.text', 'error');
    // docs are always visible
    cy.get('#docs').should('be.visible');

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

        // subresults or checks should not exist
        cy.get('details details').should('not.exist');
    });

    // error reason shown not be shown (no mocked request)
    cy.get('main > details summary p').should('not.exist')
}));

describe('tmt-failed-prepare', () => it('run', () => {
    cy.intercept(
        'GET',
        'https://api.testing-farm.io/v0.1/requests/' + requestIdMock,
        { fixture: 'error.json' }
    )

    cy.visit(addRequestId('/results.html?url=scenarios/tmt-failed-prepare'));
    cy.get('#overall-result').should('have.text', 'error');
    // docs are always visible
    cy.get('#docs').should('be.visible');

    cy.get('main > details').within(() => {
        // renders artifact installation logs inline, with concatenating all log files
        cy.get('log-viewer[url*="/tmt-run.log"]')
            .shadow().find('pre')
            .should('contain', 'tmt log with an error')
            .find('span')
            .should('have.attr', 'style', 'color:rgb(187,0,0)');

        // guest setup succeeded, log link present
        cy.get('ul')
            .should('contain', 'pre_artifact_installation')
            .and('contain', 'Copr build(s) installation')
            .and('contain', 'post_artifact_installation')
            .and('contain', 'workdir');

        // subresults or checks should not exist
        cy.get('details details').should('not.exist');
    });

    // error state shows pipeline.log
    cy.get('details[class="pipeline-log"] log-viewer')
        .shadow().find('pre')
        .should('contain', 'pipeline details')
        .should('contain', '[E]rror messages');

    // error reason shown not be shown (no mocked request)
    cy.get('main > details summary p').should('not.exist')
}));

describe('tmt-error-no-logs', () => it('run', () => {
    cy.intercept(
        'GET',
        'https://api.testing-farm.io/v0.1/requests/' + requestIdMock,
        { fixture: 'request-error-reason.json' }
    )

    cy.exec('mkdir -p cypress/downloads/nologs');
    cy.writeFile('cypress/downloads/nologs/pipeline.log', 'pipeline details\nwith more\nerror messages\n');
    cy.writeFile('cypress/downloads/nologs/results.xml',
                 '<testsuites overall-result="error">\n' +
                 '  <testsuite name="/plans/ci" result="undefined" tests="0"></testsuite>\n' +
                 '</testsuites>\n');

    cy.visit(addRequestId('/results.html?url=cypress/downloads/nologs'));
    cy.get('#overall-result').should('have.text', 'error');

    cy.get('main > details')
        .should('contain', '/plans/ci')
        .and('have.attr', 'open');
    cy.get('main > details summary').should('have.class', 'result-error');
    cy.get('main > details')
        .should('contain', 'Tests failed to run')
        .should('contain', 'pipeline.log');

    // error state shows pipeline.log
    cy.get('details[class="pipeline-log"] log-viewer')
        .shadow().find('pre')
        .should('contain', 'pipeline details')
        .should('contain', 'error messages');

    // error reason shown
    cy.get('main > details summary p')
        .should('contain', '⚠ Test environment installation failed: Install packages')
}));

describe('inprogress', () => it('run', () => {
    cy.intercept(
        'GET',
        'https://api.testing-farm.io/v0.1/requests/' + requestIdMock,
        { fixture: 'running.json' }
    )

    // initialize 🕗, we want to move forward time
    cy.clock();
    // copy scenrios/inprogress into cypress/downloads, so we can play with it
    // NOTE: cypress/downloads location is trashed on each start of cypress
    //       https://docs.cypress.io/guides/references/configuration#Downloads
    cy.exec('mkdir -p cypress/downloads/; cp -r scenarios/inprogress cypress/downloads/');
    cy.writeFile('cypress/downloads/inprogress/pipeline.log', 'tests\nare\n...\nrunning', { flag: 'w+' })
    cy.visit(addRequestId('/results.html?url=cypress/downloads/inprogress'));
    cy.get('#overall-result').should('to.have.text', 'in progress');
    // docs are always visible
    cy.get('#docs').should('be.visible');
    // no config box
    cy.get('#config').should('not.be.visible');
    // no results-junit.xml yet
    cy.get('#download-junit').should('not.be.visible');
    cy.get('details').should('exist');
    cy.get('log-viewer[url*="/tmt-run.log"]')
        .shadow().find('pre')
        .should('contain', 'Test environment setup is in progress');
}));

describe('inprogress-no-results-xml', () => it('run', () => {
    cy.intercept(
        'GET',
        'https://api.testing-farm.io/v0.1/requests/' + requestIdMock,
        { fixture: 'running.json' }
    )

    // initialize 🕗, we want to move forward time
    cy.clock();
    // copy scenrios/inprogress into cypress/downloads, so we can play with it
    // NOTE: cypress/downloads location is trashed on each start of cypress
    //       https://docs.cypress.io/guides/references/configuration#Downloads
    cy.exec('mkdir -p cypress/downloads/; cp -r scenarios/inprogress-no-results-xml cypress/downloads/');
    cy.visit(addRequestId('/results.html?url=cypress/downloads/inprogress-no-results-xml'));
    cy.get('#overall-result').should('to.have.text', 'in progress');
    // docs are always visible
    cy.get('#docs').should('be.visible');
    // no config box
    cy.get('#config').should('not.be.visible');
    // no results-junit.xml yet
    cy.get('#download-junit').should('not.be.visible');
    // show pipeline.log
    cy.get('main pre').should('have.text', 'tests\nare\n...\nrunning\n');
    cy.get('details').should('not.exist');
    // add more stuff into progress.log
    cy.writeFile('cypress/downloads/inprogress-no-results-xml/pipeline.log', 'added to log later\naligator\n', { flag: 'a+' })
    // go forward 6s
    cy.tick(6000);
    // make sure the log is updated
    cy.get('main pre').should('have.text', 'tests\nare\n...\nrunning\nadded to log later\naligator\n');

    // check that the output is colored
    cy.get('main pre span').should(($spans) => {
        expect($spans).to.have.length(3)
        expect($spans.eq(0)).to.contain('tests')
        expect($spans.eq(0)).to.have.attr('style', 'color:rgb(0,187,0)')
        expect($spans.eq(1)).to.contain('are')
        expect($spans.eq(1)).to.have.attr('style', 'color:rgb(187,187,0)')
        expect($spans.eq(2)).to.contain('running')
        expect($spans.eq(2)).to.have.attr('style', 'color:rgb(187,0,0)')
      })
}));

describe('inprogress-no-results-xml-no-reload', () => it('run', () => {
    cy.intercept(
        'GET',
        'https://api.testing-farm.io/v0.1/requests/' + requestIdMock,
        { fixture: 'running.json' }
    )

    // initialize 🕗, we want to move forward time
    cy.clock();
    // copy scenrios/inprogress into cypress/downloads, so we can play with it
    // NOTE: cypress/downloads location is trashed on each start of cypress
    //       https://docs.cypress.io/guides/references/configuration#Downloads
    cy.exec('cp -r scenarios/inprogress-no-results-xml cypress/downloads')
    cy.writeFile('cypress/downloads/inprogress-no-results-xml/pipeline.log', 'old line\n'.repeat(100)+'last old line\n', { flag: 'a+' })
    cy.visit(addRequestId('/results.html?url=cypress/downloads/inprogress-no-results-xml'));
    cy.get('#overall-result').should('to.have.text', 'in progress');
    // no config box
    cy.get('#config').should('not.be.visible');
    // docs are always visible
    cy.get('#docs').should('be.visible');
    // no results-junit.xml yet
    cy.get('#download-junit').should('not.be.visible');
    // show pipeline.log
    cy.get('main pre').should('include.text', 'last old line\n');
    cy.get('details').should('not.exist');
    // scroll page up so the log won't be reloaded
    cy.scrollTo('top');
    // add more stuff into progress.log
    cy.writeFile('cypress/downloads/inprogress-no-results-xml/pipeline.log', 'new line\n', { flag: 'a+' })
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
    cy.intercept(
        'GET',
        'https://api.testing-farm.io/v0.1/requests/' + requestIdMock,
        { fixture: 'error.json' }
    )

    cy.visit(addRequestId('/results.html?url=scenarios/tf-synthetic-error'));
    cy.get('#overall-result').should('have.text', 'error');
    // docs are always visible
    cy.get('#docs').should('be.visible');

    cy.get('main > details')
        .should('contain', 'pipeline')
        .and('have.attr', 'open');
}));

// scenario with a user facing error, request in complete state
describe('tf-complete-error', () => it('run', () => {
    cy.intercept(
        'GET',
        'https://api.testing-farm.io/v0.1/requests/' + requestIdMock,
        { fixture: 'error-with-complete-state.json' }
    )

    cy.visit(addRequestId('/results.html?url=scenarios/tf-complete-error'));
    cy.get('#overall-result').should('have.text', 'error');

    // docs are always visible
    cy.get('#docs').should('be.visible');

    cy.get('main > details')
        .should('contain', 'pipeline')
        .and('have.attr', 'open');

    // error reason shown
    cy.get('main > details summary p')
        .should('contain', '⚠ A nice human-readable error reason.')
}));

// check if api link shown
describe('api-link', () => it('run', () => {
    cy.intercept(
        'GET',
        'https://api.testing-farm.io/v0.1/requests/7614510d-5a51-4cb8-a81b-40b7d78ff111',
        { fixture: 'error.json' }
    )

    // NOTE: this url is malformed on purpose, to simulate a more real URL, not passed via `url` param
    cy.visit(addRequestId('/results.html?7614510d-5a51-4cb8-a81b-40b7d78ff111'), { failOnStatusCode: false } );

    // docs are always visible
    cy.get('#docs').should('be.visible');

    cy.get('header > #api-request')
        .should('be.visible')
        .should('contain', 'API request')
        .and('have.attr', 'href', 'https://api.testing-farm.io/v0.1/requests/7614510d-5a51-4cb8-a81b-40b7d78ff111')
}));

// produced by https://gitlab.com/testing-farm/infrastructure/-/blob/testing-farm/ranch/public/jobs/tf-tmt
describe('tf-canceled', () => it('run', () => {
    cy.intercept(
        'GET',
        'https://api.testing-farm.io/v0.1/requests/' + requestIdMock,
        { fixture: 'canceled.json' }
    )
    globalThis.window.location.href = '7614510d-5a51-4cb8-a81b-40b7d78ff111'
                                      

    // this does not matter at all
    cy.visit(addRequestId('/results.html?url=scenarios/tf-synthetic-error'));

    // the title should be canceled
    cy.get('#overall-result').should('have.text', 'canceled');

    // docs are always visible
    cy.get('#docs').should('be.visible');

    // nice text should be shown
    cy.get('main pre').should('include.text', 'Request was canceled on user request.');

    cy.intercept(
        'GET',
        'https://api.testing-farm.io/v0.1/requests/' + requestIdMock,
        { fixture: 'cancel-requested.json' }
    )

    // this does not matter at all
    cy.visit(addRequestId('/results.html?url=scenarios/tf-synthetic-error'));

    // the title should be canceled
    cy.get('#overall-result').should('have.text', 'canceled');

    // docs are always visible
    cy.get('#docs').should('be.visible');

    // nice text should be shown
    cy.get('main pre').should('include.text', 'Request was canceled on user request.');
}));

// scenario with a passed and errored testsuites, request in complete state
describe('tf-error-show-passed', () => it('run', () => {
    cy.intercept(
        'GET',
        'https://api.testing-farm.io/v0.1/requests/' + requestIdMock,
        { fixture: 'error-with-reason.json' }
    )

    cy.visit(addRequestId('/results.html?url=scenarios/tf-error-show-passed'));
    cy.get('#overall-result').should('have.text', 'error');

    // docs are always visible
    cy.get('#docs').should('be.visible');

    cy.get('main > details')
        .should('contain', 'pipeline')
        .and('have.attr', 'open');

    // error reason shown
    cy.get('main > details summary p')
        .should('contain', '⚠ A nice human-readable error reason.');

    // passed plan not visible yet
    cy.get('#main > details').should('have.length', 2);

    // show passed tests
    cy.get('#config input').click();

    // inspect the plans and tests
    cy.get('#main > details').should('have.length', 3);

    cy.get('#main > details:nth-child(1) > summary:nth-child(1)')
    .should('have.class', 'result-pass')
    .should('contain', '/plan/pass');
    cy.get('#main > details:nth-child(1) > details:nth-child(3) > summary:nth-child(1)')
    .should('have.class', 'result-pass')
    .should('contain', '/test/pass');

    cy.get('#main > details:nth-child(2) > summary:nth-child(1)')
    .should('have.class', 'result-error')
    .should('contain', '/plan/error');
    cy.get('#main > details:nth-child(2) > details:nth-child(3) > summary:nth-child(1)')
    .should('have.class', 'result-error')
    .should('contain', '/test/error');
}));
