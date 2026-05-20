# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Oculus is a self-contained single-file HTML viewer (`results.html`) for Testing Farm test results. It loads `results.xml` (completed runs) or `pipeline.log` (in-progress runs) and renders them with embedded Lit web components. No build step — the HTML file is the deliverable.

## Commands

### Linting

```bash
npm install          # first time only
npm run eslint       # check
npm run eslint:fix   # auto-fix
pre-commit run --all-files  # run all pre-commit checks
```

### Integration Tests (Cypress)

Tests run in a container via podman/docker — this is the preferred way:

```bash
cypress/run-container.sh       # headless run
cypress/run-container.sh ui    # interactive Cypress UI (needs X11)
```

The script uses `docker.io/cypress/included:11.2.0` (same as CI), starts `python3 -m http.server 8000` inside the container, and runs Cypress against it.

On test failure, check `cypress/screenshots/` for screenshots.

### Local Development

```bash
python3 -m http.server 8000
# browse http://localhost:8000/results.html?url=scenarios/tmt-single-pass
```

## Architecture

### Single-File Design

`results.html` bundles CSS, JS, and Lit web components in one file. No external CSS/JS CDN dependencies. Icons use inline SVG data URIs in CSS. This matters: any new dependency must be embedded, not loaded externally.

### Key Embedded Components

- **LogViewer** — custom element that fetches and renders log files with ANSI color support (via AnsiUp)
- **WarningsViewer** — fetches `warnings.yaml` from workdir, parses with js-yaml, self-removes from DOM if no warnings found

### Rendering Flow

1. Page loads, extracts `?url=` param or uses `.` as base
2. Fetches API request metadata to determine state (complete/running/canceled/error)
3. For completed: parses `results.xml` via DOMParser, calls `renderTests()` → `renderTestList()` recursively
4. `renderTestList()` iterates `<testsuite>` elements, skips passed ones when `showPassed=false` (but still renders warnings for them)
5. Each testsuite/testcase renders as `<details>/<summary>` with result-specific CSS classes

### Test Scenarios

`scenarios/` contains fixture directories with `results.xml` + workdir artifacts taken from real Testing Farm results. Each scenario is a self-contained test case referenced by Cypress tests in `cypress/e2e/spec.cy.js`.

### ESLint Style

JavaScript Standard Style via neostandard (ESLint 9 flat config in `eslint.config.mjs`) with: 4-space indent, 120-char max line, semicolons required, smart eqeqeq. Style rules use `@stylistic/` prefix (e.g. `@stylistic/indent`).
