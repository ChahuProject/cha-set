---
name: branch-sync
description: >-

  Fast worktree-aware linear branch sync. Automates net-new commit identification via patch-id, rebase/ff or cherry-pick sync into integration branch, safe force-with-lease push, and verification with minimal tool calls and token usage. Use when merging branches, syncing worktrees, aligning branches, or consolidating parallel worktrees.
  Triggers: branch-sync, worktree sync, sync branch, merge branch, align branch, cherry-pick, rebase.

---

<!-- PENGJ_TEMPLATE_START -->
# Branch Sync — Fast Worktree-Aware Linear Sync

Sync a parallel feat branch (often held by a worktree) into the integration branch with **linear history, no merge commits, and `--force-with-lease` only**.

> Convention: `{{ integration }}` refers to the target integration branch (default `main`). Declare deviations (e.g. `dev`/`master`) once in the project-specific area below.

```
[Fast-Track: sync-branch.ps1] OR [Inspection (git cherry -v)] -> [Route A: Free / Route B: Occupied] -> [Push & Verify]
```

## Fast-Track Workflow (Recommended: 1–2 Tool Calls)

Use the bundled script `.agents/skills/branch-sync/scripts/sync-branch.ps1` to automate topology detection, patch-level deduplication, branch alignment, safe push, and verification in a single run:

```powershell
# 1. Quick Dry Run: Check worktree topology & net-new commits in ~1s (read-only)
pwsh .agents/skills/branch-sync/scripts/sync-branch.ps1 -SourceBranch 'feat/x'

# 2. One-shot Execution: Rebase/ff or cherry-pick, align source branch, push, & verify
pwsh .agents/skills/branch-sync/scripts/sync-branch.ps1 -SourceBranch 'feat/x' -Apply
```

> **Efficiency Principle**: When the user requests a merge/sync and the source branch is known, run `-Apply` directly in **1 single tool call**. The script automatically verifies clean worktrees, identifies net commits, syncs both branches, and performs post-merge verification.

---

## Manual Fallback (Chained One-Liners)

If the script environment is unavailable, use chained compound commands. **Never execute git commands line-by-line across multiple tool rounds, and never print raw full git logs to manually compare subjects.**

### 1. Fast Topology & Net Contribution Inspection (1 Tool Call)

```powershell
git worktree list; git cherry -v main 'feat/x'
```

- **Topology decision**:
  - `git worktree list` has 1 entry or `feat/x` is not checked out elsewhere -> **Route A**;
  - `feat/x` is checked out in another worktree path -> **Route B**.
- **Net-contribution rules**:
  - Lines with `+ <hash>`: Truly net-new commits to be merged.
  - Lines with `- <hash>`: Already applied in `main` with an identical patch -> automatically ignored!

### 2. Chained Execution (1 Tool Call)

**Route A — Single-repo OR source branch is free:**
```powershell
git checkout 'feat/x' && git rebase main && git checkout main && git merge --ff-only 'feat/x' && git push origin main && git checkout 'feat/x' && git reset --hard main && git push --force-with-lease origin 'feat/x' && git checkout main
```

**Route B — Source branch is occupied by another worktree:**
```powershell
# 1) Main repo: cherry-pick net-new hashes in order and push
git checkout main && git cherry-pick <net-hash-1> <net-hash-2> && git push origin main

# 2) In occupied worktree: sync and push
git -C <worktree-path> fetch origin && git -C <worktree-path> reset --hard origin/main && git -C <worktree-path> push --force-with-lease origin 'feat/x'
```

### 3. Post-Merge Verification (1 Tool Call)

```powershell
git rev-parse HEAD origin/main origin/'feat/x'; git diff origin/main origin/'feat/x' --stat; git log --oneline --merges -n 5 origin/main; git status --short
```

Verification goals:
1. `HEAD`, `origin/main`, `origin/feat/x` all point to the same commit;
2. `git diff` is empty (source branch fully aligned);
3. No merge commits (`--merges` output is empty);
4. Workspace is clean.

Run the project build check **once** on the integration branch (e.g. `just ci`, `cargo test --workspace`).

## Guardrails & Traps
- **commitlint rejection**: Never create merge commits (`merge: ...`). Always use linear rebase/ff or cherry-pick.
- **Force push discipline**: Always use `--force-with-lease` after `git fetch`; never bare `-f` / `--force`.
- **Both branches aligned**: Always realign and push the source branch after merging so `origin/main` and `origin/feat/x` match.
- **Dirty worktree loss**: Never run `reset --hard` when uncommitted changes exist.
<!-- PENGJ_TEMPLATE_END -->

<!-- Project-specific area below -->
## Project-Specific Configuration & Verification

> This section belongs to the **project**. Template updates will only replace the managed block above.

### Integration Branch Declaration
- Integration branch: `main`

### Post-Merge Validation Command
Declare the single post-merge verification command to run on integration:
```powershell
# cargo test --workspace
# just ci
```
