# Testing Farm Oculus

This is web application for presenting a Testing Farm results.

The web app is a self-contained [results.html](./results.html) file that should
be put into the result directory of a test. If `./results.xml` is available, it
will load, parse, and present it. Otherwise, it considers the test to be still
in progress, and loads/presents `./pipeline.log`.

## Development and testing

`results.html` accepts an `url` argument to point it at a base directory other
than `.`. For development, start an HTTP server in the repository checkout, for
example:

    python3 -m http.server

Then you can browse a result on the Testing Farm on
`http://localhost:8000/results.html?url=...`, for example

http://localhost:8000/results.html?url=https://artifacts.dev.testing-farm.io/7d6a6cbf-3cd5-49fb-aca1-f76ffa0734aa/

Alternatively you can put a `results.xml` (plus the files it refers to) next to
results.html and open http://localhost:8000/results.html without any arguments.

## Static analysis

The static analysis tests are managed by [pre-commit](https://pre-commit.com/).
It is advised to install `pre-commit` hooks when developing Oculus.

To install:

    dnf -y install pre-commit
    pre-commit install

To force execution of all the checks use:

    pre-commit run --all-files

### ESLint

For linting and code style enforcement `ESLint` is used.
See [.eslintrc.js](./.eslintrc.js) for configuration details.
Currently, the code adheres to the [JavaScript Standard Style](https://www.npmjs.com/package/standard).

The check runs via `pre-commit`, but if you want to run it manually:

    npm install
    npm run eslint

If you want to instruct `eslint` to try to fix the encountered problems:

    npm run eslint:fix

## Scenario collection

The [scenarios/](./scenarios/) directory contains a few key scenarios, to make
it easier to test them manually. They were taken from real-life Testing Farm
results, with some modifications:

 - Only a few logs are downloaded: the ones which get rendered inline, and some
   others which we want to test.

 - Absolute URLs to downloaded logs were turned into relative ones.

 - Actual test output got trimmed, as they are not important for the viewer.
   The STI ones are kept as their original though, to test the maximum height
   and scrolling behaviour.

You can look at a scenario on e.g. http://localhost:8000/results.html?url=scenarios/sti-fail

# Browser integration tests

Tests are run with [cypress.io](https://www.cypress.io/). They can be run
locally in a convenient and safe way in a container (podman or docker):

    cypress/run-container.sh

In case of a test failure, have a look in the `cypress/screenshots/` directory.

You can also start cypress' interactive UI, to step through the tests, select
elements and show their selectors, check with different browsers, etc.:

    cypress/run-container.sh ui

This is especially useful for rapid test iteration: You can edit the test
outside of the container, cypress will detect changes to the file, and
automatically re-run it.
