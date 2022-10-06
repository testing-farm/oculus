# Testing Farm Oculus

This is the Testing Farm Console's web interface for presenting a result.

[results.html](./results.html) should be put into the result directory of a
test. If `./results.xml` is available, it will load, parse, and present it.
Otherwise, it considers the test to be in progress still, and loads/presents
`./pipeline.log`.

## Development and testing

results.html accepts an `url` argument to point it at a base directory other
than `.`. For development, start a HTTP server in the repository checkout, for
example:

    python3 -m http.server

Then you can browse a result on the Testing Farm on
`http://localhost:8000/results.html?url=...`, for example

http://localhost:8000/results.html?url=https://artifacts.dev.testing-farm.io/7d6a6cbf-3cd5-49fb-aca1-f76ffa0734aa/

Alternatively you can put a `results.xml` (plus the files it refers to) next to
results.html and open http://localhost:8000/results.html without any arguments.
