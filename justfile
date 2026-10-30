# justfile for cha-set
# 跨平台任务管理：常用开发、构建、测试与 Showcase 统一由此调度
set shell := ["pwsh", "-c"]

default:
    @just --list

# ---------- bque 全局编译排队自省 ----------

# 全局跨工作树编译排队状态
queue-status:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Status

# 应急清理全局编译锁状态
queue-clean:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Clean

# 手动暂停后台编译（让路游戏或交互压测）
queue-pause:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Pause

# 手动恢复后台编译
queue-resume:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Resume

# ---------- 常用 Showcase 开发入口 ----------

# 启动 React 组件展示台 (Showcase / Dev)
react:
    pnpm --filter @chaset/example-react-button dev

alias showcase := react
alias dev := react

# 启动 Qt 组件展示台 (Qt C++ / QML Showcase)
qt *ARGS:
    node scripts/run-qt-showcase.mjs {{ARGS}}

# 纯构建 Qt 展示台 (不拉起窗口)
build-qt:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Desc "Build Qt Showcase" -Cmd "node scripts/run-qt-showcase.mjs --build-only"

# ---------- 构建与代码生成 ----------

# 构建组件库包 (由 bque 排队并置于 Idle 优先级)
build:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Desc "ChaSet Build" -Cmd "pnpm --filter @chahu/cha-set build"

alias b := build

# 生成设计系统全部衍生资产 (Tokens, CSS, Qt, Icons, Highlight)
gen:
    node spec/generators/generate-all.mjs

# 同步构建产物至下游消费者项目
sync:
    node scripts/sync-consumers.mjs

# ---------- 校验与门禁 ----------

# 静态规范全量检查 (主题边界、自适应、缩放、图标、文档、QML 规范)
check:
    @node scripts/check-theme-boundary.mjs
    @node scripts/check-theme-adaptive.mjs
    @node scripts/check-derived-parity.mjs
    @node scripts/check-qt-scaling.mjs
    @node scripts/check-no-emoji.mjs
    @node scripts/strip-qml-import-versions.mjs --check
    @node scripts/check-icon-spec.mjs
    @node scripts/check-concentric-radii.mjs
    @node scripts/check-i18n-coverage.mjs
    @node scripts/check-doc-content.mjs
    @node scripts/check-showcase-palette.mjs

# TypeScript 类型检查
typecheck:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Desc "ChaSet Typecheck" -Cmd "pnpm --filter @chahu/cha-set typecheck"

# 规范与一致性门禁检查 (Parity Gate)
gate:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Desc "ChaSet Parity Gate" -Cmd "node gate/parity.mjs"

# 视觉对比门禁 (受 bque 排队管控)
gate-visual:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Desc "ChaSet Visual Gate" -Cmd "node scripts/visual-diff.mjs"

# 像素级一致性门禁 (受 bque 排队管控)
gate-pixel:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Desc "ChaSet Pixel Gate" -Cmd "node scripts/pixel-sync-test.mjs --component all"

# 一键完整门禁 / CI 校验 (类型检查 + 静态全检 + 规范门禁 + 单元测试)
ci: typecheck check gate test

alias check-gate := ci

# ---------- 测试与跑分 ----------

# 运行单元测试
test *ARGS:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Desc "ChaSet Test" -Cmd "pnpm --filter @chahu/cha-set test {{ARGS}}"

# 设计令牌与规约测试
test-tokens:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Desc "Tokens Test" -Cmd "pnpm --filter @chahu/cha-set exec vitest run --config ../../spec/vitest.config.mjs"

# 展示台对齐测试
test-showcase:
    node scripts/verify-showcase-parity.mjs

# React 基准跑分
bench-react *ARGS:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Bench -Desc "ChaSet React Bench" -Cmd "pnpm --filter @chahu/cha-set exec vitest bench --run {{ARGS}}"

# Qt 基准跑分
bench-qt *ARGS:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Bench -Desc "ChaSet Qt Bench" -Cmd "node scripts/run-qt-showcase.mjs --test-scenario benchmark {{ARGS}}"

# 性能画像审计
bench-audit *ARGS:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Bench -Desc "ChaSet Perf Audit" -Cmd "node scripts/perf-audit.mjs {{ARGS}}"

# 专项性能基准测试 (bque bench 自动挂起后台编译以提供纯净 CPU 环境)
bench *ARGS:
    @pwsh -NoProfile -File tools/bque-runner.ps1 -Bench -Desc "ChaSet Bench" -Cmd "pnpm bench {{ARGS}}"

alias benchmark := bench
