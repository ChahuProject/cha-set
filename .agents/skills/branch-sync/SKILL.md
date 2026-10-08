---
name: branch-sync
description: >-

  Fast worktree-aware linear branch sync. Automates net-new commit identification via patch-id, rebase/ff or cherry-pick sync into integration branch, safe force-with-lease push, and verification with minimal tool calls and token usage. Use when merging branches, syncing worktrees, aligning branches, or consolidating parallel worktrees.
  Triggers: branch-sync, worktree sync, sync branch, merge branch, align branch, cherry-pick, rebase.

---

<!-- PENGJ_TEMPLATE_START -->
# Branch Sync — Fast Worktree-Aware Linear Sync

Sync all branches or a specific feature branch into the integration branch in **1-shot**, with **safety backup references (refs/sync-backup/), global chronological commit ordering, Tree-Diff Guard revision preservation, batch worktree alignment, and closed-loop verification**.
History must be strictly linear, zero merge commits, and force pushes must use `--force-with-lease`.

> **Integration Branch Inference**: By default, the branch currently checked out in the active directory is selected as the integration target (where tests run). Detached HEAD worktrees, SKILL.md declarations, and remote/default branches are supported via intelligent multi-layer fallback.

```
[1-Shot One-Line Execution: sync-branch.ps1 -Apply] 
  ├── 1. Dynamic integration branch resolution (active directory branch)
  ├── 2. Auto-discovery of all candidate branches & remote fast-forwarding
  ├── 3. Chronological net commit extraction (sorted by committer timestamp)
  ├── 4. Safety snapshot reference (refs/sync-backup/ permanent protection)
  ├── 5. Linear merge (Route A: rebase-ff / Route B: ordered cherry-pick)
  ├── 6. Tree-Diff Guard (strictly verifies 100% changes preserved)
  ├── 7. Batch branch & worktree alignment + safe push (--force-with-lease)
  └── 8. Automated post-merge verification command -> Final status dashboard
```

## ⚡ Fast-Track Workflow (Recommended: 1 Single Tool Call)

When requested to merge, sync, or align branches without specific filters, **directly execute `sync-branch.ps1 -Apply` in 1 single tool call**. The script handles end-to-end safety checks, sync, push, and verification:

```powershell
# 1. Recommended: 1-Shot sync ALL branches to the current active branch
pwsh .agents/skills/branch-sync/scripts/sync-branch.ps1 -Apply

# 2. Sync a single specific feature branch
pwsh .agents/skills/branch-sync/scripts/sync-branch.ps1 -SourceBranch 'feat/x' -Apply

# 3. Read-only topology inspection (zero side-effects)
pwsh .agents/skills/branch-sync/scripts/show-branch-topology.ps1
```

> **Efficiency & Low-Intelligence Guardrails (Hard Rules)**:
> 1. **1-Shot to Completion**: Do NOT split into multiple tool calls (dry-run -> apply -> build check). Run `-Apply` directly; the script inspects worktrees, prevents dirty overwrites, merges chronologically, pushes, and automatically runs the project's verification test (e.g. `cargo test`).
> 2. **Never Hand-Craft Raw Git Commands**: Do NOT attempt manual `git merge` (violates commitlint) or manual `reset --hard` (causes irrevocable commit drops). Everything must go through `sync-branch.ps1`.
> 3. **Dashboard Decides Completion**: When the script reports `STATUS: COMPLETED_READY_TO_REPORT`, all synchronization, pushes, and test checks have succeeded. Immediately report completion to the user without redundant tool calls.

---

## 🧰 Toolkit Reference (.agents/skills/branch-sync/scripts/)

| Script | Purpose | Common Invocation |
|---|---|---|
| `sync-branch.ps1` | **Master 1-Shot Sync Engine** (all branches or single branch) | `pwsh .agents/skills/branch-sync/scripts/sync-branch.ps1 -Apply` |
| `show-branch-topology.ps1` | Read-only inspection of branch topology & net commits | `pwsh .agents/skills/branch-sync/scripts/show-branch-topology.ps1 -Detailed` |
| `align-branches.ps1` | Batch align all branches & worktrees to target commit | `pwsh .agents/skills/branch-sync/scripts/align-branches.ps1 -Apply` |
| `continue-sync.ps1` | Resume or abort sync after conflict resolution | `pwsh .agents/skills/branch-sync/scripts/continue-sync.ps1 -Continue` |
| `manage-sync-backups.ps1` | Inspect, restore, or prune `refs/sync-backup/` refs | `pwsh .agents/skills/branch-sync/scripts/manage-sync-backups.ps1 -List` |

---

## 🛡️ Anti-Drop & Anti-Overwrite Safeguards

1. **Safety Backup Reference (refs/sync-backup/)**:
   Before performing any destructive operation, the script snapshots branches to `refs/sync-backup/<branch>/<timestamp>-<sha>`. Restore at any time via `manage-sync-backups.ps1 -RestoreBranch <bName> -BackupRef <ref>`.
2. **Global Chronological Ordering**:
   When merging multiple branches, all net commits are sorted by committer timestamp (`%ct`) ascending before cherry-picking, eliminating out-of-order temporal dependency conflicts.
3. **Tree-Diff Guard**:
   Before resetting branches, the script audits the integration branch:
   **If any net commit from any source branch is missing, branches are NEVER reset or pushed**, and integration is rolled back automatically.

## 🤖 Agent Environment Adaptation (Sandbox / Tool Constraints)

Inside a sandboxed agent environment, `git` does **not** behave like a hand-typed terminal.
The following three rules are mandatory; see `REFERENCE.md` §1 for full command templates and rationale:

1. **Run git write operations through a host-language process, not one shell call per command**:
   some sandboxes silently virtualize writes to `refs/remotes/**` — `git fetch` prints `old..new`
   but nothing lands, so `rev-parse origin/<branch>` and `branch -r -v` then read stale values and
   you misdiagnose "the remote branch got clobbered". Chain consecutive operations inside one process
   (e.g. Python `subprocess.run(['git', *args], cwd=...)`).
2. **Trust only `git ls-remote` for remote truth**; when judging net contribution locally, compare
   against the local branch object instead of `origin/*`: `git cherry -v <integration tip> <source>`.
3. **Give long git operations a generous timeout**: a tool-call timeout SIGTERMs git mid-flight,
   killing `reset --hard` on a large worktree and leaving an `index.lock` plus hundreds of
   half-deleted files. Delete the lock first, then re-run.

## Guardrails & Traps
- **No merge commits**: commitlint rejects `merge:`. Always use linear rebase/ff or cherry-pick.
- **Force push discipline**: Always use `--force-with-lease` after `git fetch`, **and always in
  explicit form** `--force-with-lease=refs/heads/<branch>:<freshly-read-remote-sha>` (the implicit
  form reports `stale info` in some environments); never bare `-f`.
- **Re-verify remote net contribution right before force-pushing (hard rule)**: `--force-with-lease`
  only guarantees "the remote has not been changed since you last looked" — it does **not** guarantee
  "the remote has no net contribution you have not seen". The lease picks up the newer value, judges it
  consistent, and lets the push through, erasing other people's commits. **Re-run `ls-remote` every
  time** to obtain the lease (never reuse an observation from minutes ago), then re-run
  `git cherry -v <integration> <remote-sha>`; any `+` means the remote has new work — **merge it first**.
- **Merge batches in chronological order**: cherry-pick net commits across branches sorted globally by
  `committerdate`, **not grouped by branch**; after merging, verify file-level diff completeness and
  decide "already merged" by comparing added/removed lines only.
- **Conflict resolution convention**: default to the source (incoming) side; when the two sides are
  **different dimensions** of change rather than two spellings of one change, **keep both** — read the
  full diff for semantics before touching the conflict block.
- **Workspace cleanliness**: Never run resets when uncommitted changes exist.

## 📚 Deeper Reference (Progressive Disclosure)

Consult [`REFERENCE.md`](REFERENCE.md) on demand before acting:

- Git semantics under agent sandboxes (virtualized ref writes, repairing lost tracking refs `[gone]`,
  missing coreutils, and more);
- Net-contribution re-verification before force-push, and the **recovery flow after an accidental overwrite**;
- Manual handling of the diverged-branch case (Tree-Diff Guard reports Diverged);
- Multi-branch batch merge methodology and a fast "already merged" check;
- Entity-level conflict merging for generated/resource files (translation bundles, manifests);
- Establishing a true baseline for post-merge test failures (and common misdiagnoses).
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
