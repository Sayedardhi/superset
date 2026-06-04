# Visual QA for the Superset frontend

Verify the Superset **frontend** for visual/runtime regressions on a PR. Pick the
**lightest boot path** that can render what the PR actually changed — most PRs do
**not** need the full backend.

## Environment (do this once)

- Node **22.x** (repo requires `^22.22.0`), npm `^10.8.1`.
- `superset-frontend` is an npm **workspaces monorepo**. Install at its root:

```bash
export NODE_OPTIONS=--max-old-space-size=8192   # the install/build is memory heavy
cd superset-frontend
npm ci                                          # large + slow — be patient, don't cancel
```

## Path A — Storybook (PREFERRED — no backend needed)

Best for PRs that change React components (modals, forms, list views, charts).

```bash
npm run storybook        # serves on http://localhost:6006, no Flask backend required
```

1. In the browser (Computer Use) open `http://localhost:6006`.
2. Find the story for the component(s) changed in the diff — search the sidebar by
   component name (e.g. `DuplicateDatasetModal`, `TableSelector`).
3. If the changed component has **no story**, add a minimal local `*.stories.tsx`
   for it (no need to commit) so it renders in isolation, **or** use Path B.
4. Screenshot at **1280px** and **375px**.

Storybook renders components in isolation, boots fast, and is reliable. Use it
whenever the diff is component-level.

## Path B — Full application (only when route-level QA is required)

Needed for end-to-end pages (e.g. `/dashboard`, `/tablemodelview/list/`) whose
content comes from the API.

```bash
# from the repo root
docker compose up        # backend + Celery + DB + frontend; heavy & slow to start
# wait until http://localhost:8088 responds, then log in (dev image: admin / admin)
```

> Do NOT run `npm run dev-server` and expect a working app — it only **proxies** API
> calls to a backend on `:8088`, so pages error without one. And `npm run dev` merely
> **builds bundles**; it does not serve anything. Those are the two most common boot
> mistakes — avoid them.

## Choosing the path

1. Read the git diff. Touches only `superset-frontend/src/**` component files →
   **Path A (Storybook)**.
2. Changes a full page/route or backend-driven data → **Path B**.

## For each target (story or route)

1. Open at 1280px (desktop); screenshot.
2. Resize to 375px (mobile); screenshot.
3. Flag: console errors, overlapping/hidden elements, horizontal scroll, unreachable
   buttons/links, missing images/icons.

## Report

- Record a video of the run and attach it.
- Emit findings via the session's structured output (`findings[]` with
  `route` (or story), `viewport`, `severity`, `description`, `screenshot`).
- File a GitHub issue labelled `devin-auto` for each **confirmed** UI bug.

## Time/cost guidance

If `npm ci` or a boot path is taking very long, prefer Path A (Storybook) and a
single representative target rather than exhaustively booting the full stack.
