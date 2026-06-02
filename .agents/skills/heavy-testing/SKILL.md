# Heavy PR testing for Superset

Use this skill to rigorously validate a pull request's backend/Python changes.
Devin triggers it on PRs touching `superset/**` or `tests/**`, or on request.

## Setup

```bash
pip install -r requirements/development.txt
# Spin up just what the touched tests need (DB/Redis) via the dev compose
# if integration tests require it.
```

## Test plan

1. Read the PR diff to identify the affected modules.
2. Run the existing suites for those areas:
   ```bash
   pytest tests/unit_tests -q
   pytest tests/integration_tests -q -k "<relevant area>"
   ```
3. Write **new** focused regression tests covering the diff's new behaviour and
   edge cases. Do not weaken or delete existing assertions to make tests pass.
4. Re-run until green and record pass/fail/added counts.

## Output & PR

Report progress via structured output (`tests_passed`, `tests_failed`,
`tests_added`, `summary`, `pr_url`). If you changed code or added tests, open a
PR titled `[devin-auto] harden tests for PR #<n>` linking the original PR.
