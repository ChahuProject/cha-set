---
name: branch-sync
description: >-

  Fast worktree-aware linear branch sync. Automates net-new commit identification via patch-id, rebase/ff or cherry-pick sync into integration branch, safe force-with-lease push, and verification with minimal tool calls and token usage. Use when merging branches, syncing worktrees, aligning branches, or consolidating parallel worktrees.
  Triggers: branch-sync, worktree sync, sync branch, merge branch, align branch, cherry-pick, rebase.

---

<!-- PENGJ_TEMPLATE_START -->
# Branch Sync — Fast Worktree-Aware Linear Sync

Sync a feature branch (single-repo or worktree-occupied) into the integration branch with **safety backup references (refs/sync-backup/), Tree-Diff Guard revision preservation, remote-alignment anti-loss checks, and 1-shot closed-loop verification**.
History must be strictly linear, zero merge commits, and force pushes must use `--force-with-lease`.

> Convention: `{{ integration }}` refers to the target integration branch (default `main`). Declare deviations (e.g. `dev`/`master`) once in the project-specific area below.

```
[1-Shot One-Line Execution: sync-branch.ps1 -Apply] 
  ├── 1. Adaptive topology & branch auto-detection
  ├── 2. Remote alignment check (fast-forward remote commits, prevent drops)
  ├── 3. Safety snapshot reference (refs/sync-backup/ permanent protection)
  ├── 4. Linear merge (Route A: rebase-ff / Route B: ordered cherry-pick)
  ├── 5. Tree-Diff Guard (strictly verifies 100% changes preserved before resetting source)
  ├── 6. Source branch realignment & safe push (--force-with-lease)
  └── 7. Automated post-merge test command (e.g. cargo test) -> Final status dashboard
```

## ⚡ Fast-Track Workflow (Recommended: 1 Single Tool Call)

When requested to merge, sync, or align branches, **directly execute the script with `-Apply` in 1 single tool call**. The script handles end-to-end safety checks, sync, push, and verification:

```powershell
# 1. Recommended: 1-Shot merge, push, and test in a single tool call
pwsh .agents/skills/branch-sync/scripts/sync-branch.ps1 -SourceBranch 'feat/x' -Apply

# 2. Auto-inference: Automatically detects current feature branch when omitted
pwsh .agents/skills/branch-sync/scripts/sync-branch.ps1 -Apply

# 3. Dry-run only (read-only preview of topology and net commits)
pwsh .agents/skills/branch-sync/scripts/sync-branch.ps1 -SourceBranch 'feat/x'
```

> **Efficiency & Low-Intelligence Guardrails (Hard Rules)**:
> 1. **1-Shot to Completion**: Do NOT split into multiple tool calls (dry-run -> apply -> build check). Run `-Apply` directly; the script inspects worktrees, prevents dirty overwrites, merges, pushes, and automatically runs the project's verification test (e.g. `cargo test`).
> 2. **Never Hand-Craft Raw Git Commands**: Do NOT attempt manual `git merge` (violates commitlint) or manual `reset --hard` (causes irrevocable commit drops). Everything must go through `sync-branch.ps1`.
> 3. **Dashboard Decides Completion**: When the script reports `STATUS: COMPLETED_READY_TO_REPORT`, all synchronization, pushes, and test checks have succeeded. Immediately report completion to the user without redundant tool calls.

---

## 🛡️ Anti-Drop & Anti-Overwrite Safeguards

1. **Safety Backup Reference (refs/sync-backup/)**:
   Before performing any destructive operation, the script snapshots branches to `refs/sync-backup/<branch>/<timestamp>-<sha>`. Any interrupted or failed operation can be restored instantly via `git branch -f <branch> <backup-ref>`.
2. **Remote Alignment Guard**:
   Compares local and `origin/<branch>` before merging: auto-fast-forwards if remote is ahead (preventing dropped remote commits) and blocks immediately if diverged.
3. **Tree-Diff Guard**:
   Before resetting the source branch, the script rigorously audits the integration branch:
   **If any net commit from the source branch is missing, the source branch is NEVER reset or pushed**, and integration is rolled back automatically.

---

## 🛠️ Emergency Fallback (Only when PowerShell script execution is impossible)

If operating in a restricted environment without PowerShell:

```powershell
# 1. Create safety snapshot
git update-ref refs/sync-backup/feat_x/temp HEAD

# 2. Route A (free branch): rebase -> merge ff -> push -> realign source -> push source
git checkout 'feat/x' && git rebase main && git checkout main && git merge --ff-only 'feat/x' && git push origin main && git checkout 'feat/x' && git reset --hard main && git push --force-with-lease origin 'feat/x' && git checkout main

# 3. Post-merge validation
cargo test --workspace
```

## Guardrails & Traps
- **No merge commits**: commitlint rejects `merge:`. Always use linear rebase/ff or cherry-pick.
- **Force push discipline**: Always use `--force-with-lease` after `git fetch`; never bare `-f`.
- **Workspace cleanliness**: Never run resets when uncommitted changes exist.
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
