---
name: branch-sync
description: >-

  Linear branch/worktree sync with clean history. Identify net-new commits, sync parallel feat branches into the integration branch via rebase/ff-merge or cherry-pick + force-with-lease, and verify no merge commits. Use when merging branches, syncing worktrees, aligning branches, or consolidating parallel worktrees.
  Triggers: branch-sync, worktree sync, sync branch, merge branch, align branch, cherry-pick, rebase.

---

# Branch Sync — Worktree-Aware Linear Sync

Sync a parallel feat branch (often held by a worktree) into the integration branch with **linear history, no merge commits, and `--force-with-lease` only**. Failsafe by default: inspect first, deduplicate duplicate commits, then merge via the route that matches the checkout state.

> Convention: this template calls the target `{{ integration }}` (default `main`). Replace it with your project's actual integration branch (`main`/`dev`/`master`). Declare it once in the project-specific area below — the managed block below never hard-codes it.

```
[Pre-check] -> [Net contribution filtering] -> [Route A: no-worktree / free branch | Route B: worktree-occupied] -> [Push] -> [Verify]
```

## 1. Pre-check (see clearly before touching)

Run from repo root:

```powershell
git worktree list          # 1 entry = single-repo (no worktree); >1 = multi-worktree mode
git branch -a
git status --short
# integration = your integration branch (main/dev); source = parallel branch (feat/x)
git log --oneline 'feat/x' '^main'          # exclusive commits on source not in integration
# only if worktree exists:
git -C <worktree-path> status --short       # must be clean before any reset --hard
```

Rules:

- Determine the integration branch first: ask the user if ambiguous; default `main` if `origin/main` exists, otherwise ask explicitly and record it in the project-specific area.
- Decide mode from `git worktree list`: single entry -> **no-worktree (single-repo) mode** -> skip all `git -C <worktree-path>` checks and go directly to Route A; multiple entries -> multi-worktree mode -> check each worktree's cleanliness.
- Quote branch names in PowerShell: `git log --oneline 'feat/x' '^main'` — bare `^`/`..` is parsed by PowerShell.
- Never `reset --hard` or `--force` a dirty worktree — `status --short` must be empty; stash or commit first.

## 2. Net contribution filtering (critical — avoid pulling duplicate commits)

Parallel branches often contain **same title, different hash** commits (both cherry-picked shared fixes). Merge only the truly net-new commits:

1. `git log --oneline 'feat/x' '^main'` — candidate exclusives.
2. Cross-check titles against `git log --oneline main` — drop any candidate whose subject already exists on integration (same change, no need to reintroduce).
3. For remaining candidates, `git show --stat <hash>` to confirm touched files are the intended contribution.
4. Reconcile: `git diff main 'feat/x' --stat` should match the combined `--stat` of the kept candidates — that set is the net contribution. If it doesn't, you missed a duplicate or an unrelated commit.
5. Record the final hash list in order (oldest-first) for cherry-pick.

## 3. Route selection (exactly one)

**Route A — No worktree / single-repo OR source branch is NOT held by a worktree (free to checkout):**

Use this for **both**: (a) you don't use `git worktree` at all (single-repo, `git worktree list` shows 1 entry), and (b) you use worktrees but the source branch is currently free. It is the only route needed when there is no worktree.

```powershell
git checkout 'feat/x'
git rebase main
git checkout main
git merge --ff-only 'feat/x'   # linear fast-forward, no merge commit
git push origin main
# Sync merged branch to latest (make feat/x identical to main)
git checkout 'feat/x'
git reset --hard main
git push --force-with-lease origin 'feat/x'
```

`rebase` keeps periodic sync the same: `git checkout 'feat/x' && git rebase main`. If conflicts arise, resolve, `git rebase --continue`, then continue.

**Route B — Source branch IS held by a worktree (multi-worktree only):**

```powershell
# 1) From main repo: cherry-pick net contributions in order (oldest -> newest)
git checkout main
git cherry-pick <hash-1> <hash-2>   # only the filtered net-new hashes
git push origin main

# 2) In the worktree that holds feat/x:
git fetch origin
git reset --hard origin/main
git push --force-with-lease origin 'feat/x'
```

Never use `git merge <branch>` on the integration branch — `merge:` is not a valid `commitlint` type and will be rejected by the `commit-msg` hook. Linear paths above avoid it by construction.

## 4. Push discipline

- `git push origin main` for the integration branch (fast-forward only after Route A/B).
- `git push --force-with-lease origin 'feat/x'` for the **merged source branch after realignment** — never bare `-f`/`--force`. This applies to **both** no-worktree (Route A) and worktree (Route B) modes: the merged branch must always be fast-forwarded/reset to the integration tip and pushed so `origin/main` and `origin/feat/x` become identical.
- If push is rejected (non-fast-forward): `git fetch` first; if remote hasn't moved -> `--force-with-lease` is safe; if remote has moved -> fetch + rebase/cherry-pick again, then push.

## 5. Post-merge verification (one-shot checklist)

```powershell
git rev-parse HEAD origin/main origin/'feat/x'   # all three should match (local HEAD must be on main)
git diff origin/main origin/'feat/x' --stat       # empty = content identical (proves merged branch synced)
git log --oneline --merges origin/main            # empty = no merge commits
git worktree list                                 # 1 entry = no-worktree; >1 = worktree mode
git status --short                                # clean (single-repo)
# only if worktree exists:
git -C <worktree-path> status --short             # clean
```

Also run the project's single post-merge build/check once on the integration branch (declare the command in the project-specific area; e.g. `cargo test --workspace`, `just ci`, `pnpm build`). Do not run full builds on multiple branches in parallel.

## 6. Traps

- **commitlint has no `merge` type**: don't create merge commits to "fix" a failed merge; re-linearize instead.
- **Non-ASCII paths**: wrap pathspecs in quotes in PowerShell: `git add "docs/guides/file.md"`.
- **Dirty worktree loss**: `reset --hard` discards uncommitted changes with no recovery — verify `status --short` is clean.
- **Stale origin**: always `git fetch origin` before `--force-with-lease`; a stale view makes the lease check meaningless.
- **Rebase vs cherry-pick confusion**: if the source branch is occupied, don't `checkout` it in the main repo — you will get "already checked out" errors; use cherry-pick.

