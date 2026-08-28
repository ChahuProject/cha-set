---
name: commit
description: >-

  约定式提交流程。提交信息用中文撰写（type/scope 除外）。提交前先跑项目约定的检查（约定脚本 > 项目清单 > 兜底扫 diff）、拆分无关改动、提交后立即 push。
  Triggers: commit, 提交, amend, push, commit message, conventional commits.

---

<!-- PENGJ_TEMPLATE_START -->
# Commit 提交流程


按约定式提交写提交信息。提交后立即 push，防止丢失。

## 1. 收集提交上下文（标准 git 命令，跨平台）
仓库根运行：
`git status` · `git diff --stat` · `git diff --cached --stat`（必要时看完整 diff）

## 2. 提交前完整性检查 —— 项目自定义
本步骤归**项目**所有，模板不硬编码具体检查：按下方托管块外「项目专属提交流程与红线」的定义执行——跑什么命令、查哪些项、用什么语言写，全部由项目在那里自行声明。

项目专属区未定义任何检查时，使用兜底自检：扫 diff——改动构建/依赖、文档/AGENTS.md/配置、公开命名时对应校验构建、更新文档、跑格式化；触及架构（新增/调整模块边界、数据流、生命周期、系统拓扑、核心不变式等）时检查 `docs/architecture/README.md` 与对应领域文档是否已同步，详情见 `.agents/skills/arch-align`。

不要在本流程里发明仓库专属检查；它们归项目所有（见下方项目专属区）。

### 架构文档一致性检查（`arch-align` 已启用时本节生效）

本项目已启用 `arch-align` 时，第 2 步需追加以下判定：

- **触发判断：** 是否触及架构（新增模块/改拓扑/改数据流/改不变式/改跨层契约）？
- **命中 → 核验：** `docs/architecture/README.md` 索引与对应 `docs/architecture/<domain>.md` 是否已同步。需深度对齐时执行 `.agents/skills/arch-align` 流程。
- **快速路径（无需更新文档）：** 纯测试、纯格式化、单函数 bugfix 且不改行为/契约。

判定表追加：

| 改动 | 命中的检查 |
| --- | --- |
| 触及架构（新增/调整模块、数据流、生命周期、跨模块契约） | `docs/architecture/README.md` 索引与对应领域文档是否已同步 |


## 3. 拆分无关改动
不相关领域拆多次提交（文档与功能、构建与业务分开）。

## 4. 提交信息格式
`type(scope): 标题`

- 标题用中文短句、不加句号。
- type/scope 用英文：`feat` `fix` `docs` `style` `refactor` `perf` `test` `build` `ci` `chore` `revert`。
- scope 参考项目 `commitlint.config.js` 的 scope-enum 白名单，无合适则省略。


## 5. 提交与 Push（PowerShell 兼容）
`git commit -m "<type>: 标题"` 后立即 `git push`；远端有更新先 `git pull --rebase` 再 push。

## 6. Amend
仅当用户明确要求、且是刚提交未 push、无人依赖时。Amend 前仍跑完整性检查，完成后立即 push。

<!-- PENGJ_TEMPLATE_END -->
