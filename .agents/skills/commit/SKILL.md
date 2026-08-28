---
name: commit
description: >-

  Conventional commit workflow. Write commit messages in English. Run the project's pre-commit check first (convention script > project checklist > generic diff scan), split unrelated changes, and push immediately.
  Triggers: commit, amend, push, commit message, conventional commits.

---

<!-- PENGJ_TEMPLATE_START -->

# Commit

Write conventional commit messages. Always push immediately after committing to avoid losing work.

## 1. Gather context (standard git, cross-platform)
Run from repo root:

`git status` · `git diff --stat` · `git diff --cached --stat` (add full diffs when needed)

## 2. Pre-commit completeness check — project-defined
This step belongs to the PROJECT, not the template: follow whatever the project-specific area below the managed block defines (which commands to run, what to verify — all written there, any language or tool). If the project-specific area defines no checks, use the generic fallback: scan the diff — if it touches build/deps, docs/AGENTS.md/config, or public naming, verify build / update docs / run formatter as appropriate before committing. If this change touches architecture (new/adjusted module boundaries, data flow, lifecycle, system topology, core invariants, etc.), also verify `docs/architecture/README.md` and the corresponding domain docs are in sync; see `.agents/skills/arch-align` for details.

Do NOT invent repo-specific checks here; the project owns them (see the project-specific area below).

### Architecture doc consistency check (active when `arch-align` is enabled)

When `arch-align` is enabled, add the following gate to step 2:

- **Trigger question:** Does this change touch architecture — new/adjusted module boundaries, system topology, data flow, lifecycle, cross-layer contracts, core invariants?
- **If hit → verify:** `docs/architecture/README.md` index and the corresponding `docs/architecture/<domain>.md` are in sync with the code change. See `.agents/skills/arch-align` for deep alignment.
- **Fast path (no doc update needed):** pure tests, pure formatting, single-function bugfixes with no behavior/contract change.

Judgment addition:

| Change seen | Check hit |
| --- | --- |
| Touched architecture (new/adjusted modules, data flow, lifecycle, cross-module contracts) | `docs/architecture/README.md` index & domain docs in sync |


## 3. Split unrelated changes
Separate unrelated areas into distinct commits (e.g. do not mix docs with feature code).

## 4. Commit message format
`type(scope): subject`

- Subject in English (imperative, short, no trailing period).
- Type/scope in English: `feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`.
- Scope from the project's `commitlint.config.js` scope-enum whitelist when it exists.


## 5. Commit & push (PowerShell compatible)
`git commit -m "<type>: <subject>"` then `git push`. On remote divergence, `git pull --rebase` then push.

## 6. Amend
Only when explicitly asked, for the just-made, unpushed commit with no dependency from others. Run the completeness check again; push after amend.

<!-- PENGJ_TEMPLATE_END -->


<!-- Project-specific area left empty by default (no commit skill → no content; with commit skill, add your checks here) -->

