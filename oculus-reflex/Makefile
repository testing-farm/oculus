IMPORT_STR := import "@patternfly/react-core/dist/styles/base.css";

init:
	poetry run reflex init
	cp next.config.js .web/next.config.js
	head -n 1 .web/pages/_app.js  | grep patternfly || sed -i '1i${IMPORT_STR}' .web/pages/_app.js

run:
	poetry run reflex run
