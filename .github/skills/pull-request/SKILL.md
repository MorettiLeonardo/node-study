---
name: pull-request
description: Create a Pull Request following project standards — branch rules, file limit, template, and gh CLI
---

Create a Pull Request for the current branch. Follow every rule below exactly.

**Context:** $ARGUMENTS
(Optional: ticket ID or extra context, e.g. "DES-520". Leave blank to auto-detect from branch name.)

---

## Step 1 — Pre-flight checks

Run these commands and evaluate the results before doing anything else:

```bash
git branch --show-current
git diff main...HEAD --stat
git log main...HEAD --oneline
git status
```

**File count check:**
Count the files changed. If the count exceeds **30 files**, stop and tell the user:
> "This PR contains X files, which exceeds the 30-file limit. Please split it into smaller PRs grouped by scope before continuing."

Do not proceed until the user confirms a split or reduces scope.

**Branch name check:**
The branch must follow the project naming convention: `{type}/{kebab-case-description}`

Valid types: `feat`, `feature`, `fix`, `refactor`, `chore`, `docs`, `test`

Examples: `feat/DES-520-create-rotation-report`, `fix/kim-lhc-header-layout`

If the branch name doesn't follow this pattern, warn the user but do not block.

**Push check:**
Check if the current branch has been pushed to remote:
```bash
git status -sb
```
If not pushed yet, push it:
```bash
git push -u origin $(git branch --show-current)
```

---

## Step 2 — Analyze the diff

Read the changed files as needed to understand what the PR actually does. Identify:
- PR type (Feature / Bug Fix / Optimization / Refactor / Docs / Tests) — can be multiple
- What changed technically (which layers, which entities, what behavior)
- Ticket ID from branch name or from `$ARGUMENTS` (e.g. `feat/DES-520_...` → DES-520)
- Whether web files changed (needed for UI checklist)
- Whether translation files changed
- Whether test files are in the diff

---

## Step 3 — Fill the PR template

Fill in the template below. **Do NOT modify the structure** — only fill the fields.
- Check boxes that apply: change `[ ]` to `[x]`
- Replace placeholder text with real content
- Keep all sections, headings, and order exactly as below
- Do not summarize or remove any section

```markdown
## What type of PR is this? (check all applicable)

- [ ] :pizza: Feature
- [ ] :bug: Bug Fix
- [ ] :fire: Optimization
- [ ] :man_technologist: Refactor
- [ ] :books: Documentation Update
- [ ] :test_tube: Test's

## Description

{2–5 sentences. What changed, why, and what approach was taken.
Be specific and technical — mention layers touched, entities affected, behavior changed.}

## Related Tickets & Documents

{Linear URL if ticket found. e.g. https://linear.app/pixfy/issue/DES-520/...
Write "N/A" if no ticket.}

## Screenshots, Recordings
#### Before
{Describe previous behavior, or "N/A — no UI changes"}
#### After
{Describe new behavior, or "N/A — no UI changes"}


## QA Instructions

{Actionable steps to verify the change works. Use real endpoints, real UI flows, or real commands.
Example: "1. Call GET /rotation-reports?organization_id=X — expect paginated list with total/limit/page/rows"}

### UI accessibility checklist
_If your PR includes UI changes, please utilize this checklist:_
- [ ] :earth_africa: Have the translations been updated?
  - [ ] :brazil: pt-BR
  - [ ] :cn: zh-CN
  - [ ] :de: de-DE
  - [ ] :es: es_ES

- [ ] :closed_lock_with_key: This change involves permissions users? (Roles)
  - [ ] MASTER
  - [ ] SUPERVISOR
  - [ ] USER

- [ ] :triangular_ruler: This change involves responsiveness design?
  - [ ] 1024x768
  - [ ] 1280x720
  - [ ] 1366x768
  - [ ] 1920x1080

## Added/updated tests?
_We encourage you to keep the code coverage percentage at 80% and above._

- [ ] Yes
- [ ] No, and this is why: {reason — be specific}
- [ ] I need help with writing tests

## [optional] Are there any post deployment tasks we need to perform?

{Migrations to run, env vars to add, feature flags to toggle. Or leave blank.}

## [optional] What gif best describes this PR or how it makes you feel?

```

**Template filling rules:**
- UI accessibility section: only check boxes if web files are in the diff
- Translations: only check language boxes if translation files are in the diff
- Tests: check `Yes` only if test files are in the diff; otherwise check `No` with a reason
- Do not invent content not visible in the diff
- QA Instructions must be actionable — not vague like "test the feature"

---

## Step 4 — Determine the base branch

Check if a feature base branch exists (e.g. `use-case/kim-lhc` for `feature/kim-lhc-*`).
If no clear base branch is identifiable, default to `main`.

---

## Step 5 — Create the PR

Use `gh pr create` with the filled body via HEREDOC. Never use `--body-file` with the unfilled template.

```bash
gh pr create \
  --base {base-branch} \
  --head $(git branch --show-current) \
  --title "{type}: {concise description under 70 chars}" \
  --body "$(cat <<'EOF'
{filled template content here}
EOF
)"
```

Title format: `{type}: {description}` — e.g. `feat: add rotation report endpoint`, `fix: kim-lhc header layout`

---

## Step 6 — Confirm

After creation, output:
- The PR URL
- File count
- Base branch used
- A one-line summary of what was included

---

## Hard rules

- Never create PRs through the GitHub UI — always use `gh pr create`
- Never use `--body-file .github/PULL_REQUEST_TEMPLATE.md` with the blank template
- Never exceed 30 files without user confirmation
- Never modify the template structure — only fill the fields
- The branch must not contain unrelated changes
- Do not mix feature + unrelated fixes + refactor in the same PR