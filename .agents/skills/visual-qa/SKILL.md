# Visual QA for the Superset frontend

Use this skill whenever a session needs to verify the Superset **frontend** for
visual or runtime regressions on a pull request. Devin triggers it automatically
when a diff touches `superset-frontend/**`, or you can invoke it explicitly.

## Boot (frontend dev server only — do NOT start the full backend stack)

```bash
cd superset-frontend
npm ci
# Point the dev server at any reachable Superset API, or use the mock.
npm run dev          # webpack dev server on http://localhost:9000
```

Wait until `http://localhost:9000` responds before testing.

## Test plan

1. Read the current git diff and map changed files to routes. Always include:
   - `/dashboard/list/`
   - `/chart/add`
   - any route whose components appear in the diff
2. For each route, in the browser (Computer Use):
   a. Open `http://localhost:9000/{route}`
   b. Screenshot at **1280px** (desktop)
   c. Resize to **375px** (mobile) and screenshot
   d. Check for: console errors, overlapping/hidden elements, horizontal
      scroll, unreachable buttons/links, missing images or icons
3. Record a video of the whole run and attach it to the session.

## Report

Emit findings via the session's structured output (`findings[]` with
`route`, `viewport`, `severity`, `description`, `screenshot`). For every
**confirmed** UI bug, file a GitHub issue in this repository labelled
`devin-auto` so the remediation pipeline can pick it up.
