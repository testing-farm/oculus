.DEFAULT_GOAL := help

IMPORT_STR := import "@patternfly/react-core/dist/styles/base.css";

init:  ## Initialize the environment
	poetry run reflex init

fix:
	cp next.config.js .web/next.config.js
	head -n 1 .web/pages/_app.js  | grep patternfly || sed -i '1i${IMPORT_STR}' .web/pages/_app.js

run:  ## Run the app
	poetry run reflex run

# See https://www.thapaliya.com/en/writings/well-documented-makefiles/ for details.
help:  ## Show this help
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make [target]\033[36m\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
