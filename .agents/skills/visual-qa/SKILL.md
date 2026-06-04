# Visual QA for the Superset frontend

Verify the Superset **frontend** for visual/runtime regressions on a PR. Pick the
**lightest boot path** that can render what the PR changed — most PRs do **not**
need the full backend.

## Environment (pre-warmed via org snapshot)

The org snapshot already has this repo cloned at **`~/repos/superset`** with
`superset-frontend` dependencies installed (Node 22). Reuse it — do NOT clone
fresh or run a cold `npm ci`:

```bash
cd ~/repos/superset
git fetch origin && git checkout <PR head ref>   # check out the PR branch here
cd superset-frontend
# deps are already installed from the snapshot; only run `npm ci` if
# package-lock.json changed in the diff (otherwise skip — it's slow).
export NODE_OPTIONS=--max-old-space-size=8192
```

If `~/repos/superset` is somehow absent (no snapshot), fall back to a shallow
clone + `npm ci`, but prefer the pre-installed copy for speed.

## Path A — Storybook (PREFERRED — no backend, fast, reliable)

Use for any PR that changes React components (modals, forms, list views, charts,
plugins under `superset-frontend/plugins/**` or `packages/**`).

```bash
npm run storybook        # http://localhost:6006 — NO Flask backend needed
```

1. Open `http://localhost:6006` in the browser (Computer Use).
2. Find the story for the changed component — search the sidebar by component name
   (e.g. `DuplicateDatasetModal`, `TableSelector`, `ListView`). Stories live next to
   components as `*.stories.tsx`.
3. If the changed component has **no story**, create a throwaway
   `<Component>.stories.tsx` that renders it with minimal props (no need to commit),
   then view it.
4. Screenshot at **1280px** and **375px**.

## Path B — Full application (only for route/data-driven QA)

Needed only when the PR changes a full page or backend-driven data.

```bash
# from the repo root
docker compose up        # backend + Celery + DB + frontend; heavy & slow
# wait for http://localhost:8088, then log in (dev image: admin / admin)
```

> Common boot mistakes to AVOID:
> - `npm run dev-server` alone → only **proxies** API calls to a backend on `:8088`;
>   pages error without it. Use Path A or bring up the backend (Path B).
> - `npm run dev` → only **builds bundles**, it does not serve anything.

## Choosing the path

- Diff touches only `superset-frontend/src/**` / `plugins/**` / `packages/**`
  component files → **Path A (Storybook)**.
- Diff changes a route/page or backend-driven data → **Path B**.
- Prefer Storybook + one representative target over exhaustively booting the stack.

## For each target (story or route)

1. Open at 1280px (desktop); screenshot.
2. Resize to 375px (mobile); screenshot.
3. Flag: console errors, overlapping/hidden elements, horizontal scroll, unreachable
   controls, missing images/icons.

## Reporting (IMPORTANT — use authenticated tooling, never the browser)

You are authenticated to GitHub through the connected GitHub App / git proxy — but
**only the agent tooling has that auth, NOT the in-session browser.**

- **Report findings by commenting on the pull request** using the
  **`git_comment_on_pr`** tool. It is authenticated via the GitHub App.
- **Do NOT** open `github.com` in the browser, and **do NOT** try to log into GitHub
  in the browser — that session is unauthenticated and will dead-end on a login page.
- If (and only if) you must create a standalone issue and a GitHub token is provided
  as a session secret, use `gh issue create` / the REST API with that token — still
  never the browser.

Also record a video of the run and attach it, and emit findings via the structured
output schema (`findings[]` with route/story, viewport, severity, description,
screenshot) so the dashboard can display them.
