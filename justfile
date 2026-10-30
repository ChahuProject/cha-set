# justfile for cha-set
# 跨平台任务管理：统一由此调度，杜绝别名与重复命令
set shell := ["pwsh", "-c"]

default:
    @just --list

# ---------- bque 全局编译排队自省 ----------

# 全局跨工作树编译排队状态
queue-status:
    @bque status

# 应急清理全局编译锁状态
queue-clean:
    @bque clean

# 手动暂停后台编译（让路游戏或交互压测）
queue-pause:
    @bque pause

# 手动恢复后台编译
queue-resume:
    @bque resume

# ---------- 开发与展示台入口 ----------

# 启动 React 组件展示台开发环境
react:
    pnpm --filter @chaset/example-react-button dev

# 启动 Qt 组件展示台（可透传参数，如 just qt --hot）
qt *ARGS:
    node scripts/run-qt-showcase.mjs {{ARGS}}

# ---------- 构建与打包 ----------

# 构建组件库或展示台 (TARGET: react | qt | all，默认 all)
build TARGET="all":
    #!pwsh
    $tgt = '{{TARGET}}'.ToLower()
    if ($tgt -eq 'react') {
        bque run -- pnpm --filter @chahu/cha-set build
    } elseif ($tgt -eq 'qt') {
        bque run -- node scripts/run-qt-showcase.mjs --build-only
    } elseif ($tgt -eq 'all') {
        bque run -- pnpm --filter @chahu/cha-set build
        bque run -- node scripts/run-qt-showcase.mjs --build-only
    } else {
        Write-Error "未知构建目标: $tgt。可选目标: react, qt, all"
        exit 1
    }

# 同步构建产物至下游消费者项目
sync:
    node scripts/sync-consumers.mjs

# ---------- 代码与设计资产生成 ----------

# 全量资产生成 (Tokens, CSS, Qt, Icons, Highlight)
gen:
    node spec/generators/generate-all.mjs

# 生成设计令牌快照
gen-tokens:
    node spec/build-tokens.mjs

# 生成 CSS 样式变量
gen-css:
    node spec/generators/generate-css.mjs

# 生成 Qt/QML 设计令牌
gen-qt:
    node spec/generators/generate-qt.mjs

# 生成文档角色
gen-roles:
    node spec/generators/generate-doc-roles.mjs

# 迁移文档文本
migrate-doctext:
    node scripts/migrate-doc-text.mjs

# 生成语法高亮规则
gen-highlight:
    node spec/generators/generate-highlight.mjs

# 生成展示台导航与数据
gen-showcase:
    node spec/generators/generate-showcase-data.mjs

# 生成双端矢量图标资产
gen-icons:
    node spec/generators/generate-icons.mjs

# ---------- 规范检查与门禁 ----------

# 运行全套静态规范检查 (主题边界、自适应、缩放、无 Emoji、QML 规范、图标、圆角、i18n、文档、调色板)
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

# 主题边界检查（支持透传 --self-test）
check-theme-boundary *ARGS:
    node scripts/check-theme-boundary.mjs {{ARGS}}

# 主题自适应检查（支持透传 --self-test）
check-theme-adaptive *ARGS:
    node scripts/check-theme-adaptive.mjs {{ARGS}}

# 衍生对齐检查
check-derived-parity:
    node scripts/check-derived-parity.mjs

# Qt 缩放规则检查
check-scaling:
    node scripts/check-qt-scaling.mjs

# 严禁 Emoji 扫描
check-no-emoji:
    node scripts/check-no-emoji.mjs

# QML 导入版本检查
check-qml-imports:
    node scripts/strip-qml-import-versions.mjs --check

# QML 导入版本批量剥离修复
fix-qml-imports:
    node scripts/strip-qml-import-versions.mjs

# 图标规范检查
check-icons:
    node scripts/check-icon-spec.mjs

# 同心圆角几何检查
check-concentric:
    node scripts/check-concentric-radii.mjs

# 国际化文案覆盖率检查
check-i18n:
    node scripts/check-i18n-coverage.mjs

# 文档内容完整性检查
check-docs:
    node scripts/check-doc-content.mjs

# 调色板对齐检查
check-palette:
    node scripts/check-showcase-palette.mjs

# 展示台规约一致性检查（支持透传 --component <name>）
check-showcase *ARGS:
    node scripts/verify-showcase-parity.mjs {{ARGS}}

# TypeScript 类型检查
typecheck:
    @bque run -- pnpm --filter @chahu/cha-set typecheck

# 规范与一致性门禁检查 (Parity Gate，支持透传参数如 --skip-qt)
gate *ARGS:
    @bque run -- node gate/parity.mjs {{ARGS}}

# 视觉对比门禁
gate-visual:
    @bque run -- node scripts/visual-diff.mjs

# 像素级严格对齐门禁（可透传参数，如 just gate-pixel --component button）
gate-pixel *ARGS:
    @bque run -- node scripts/pixel-sync-test.mjs {{ARGS}}

# 一键完整门禁 / CI 校验 (类型检查 + 静态全检 + 规范门禁 + 单元测试)
ci: typecheck check gate test

# ---------- 测试与性能跑分 ----------

# 运行单元测试
test *ARGS:
    @bque run -- pnpm --filter @chahu/cha-set test {{ARGS}}

# 设计令牌与规约测试
test-tokens:
    @bque run -- pnpm --filter @chahu/cha-set exec vitest run --config ../../spec/vitest.config.mjs

# 专项性能跑分 (TARGET: react | qt | audit | all，默认 all)
bench TARGET="all" *ARGS:
    #!pwsh
    $tgt = '{{TARGET}}'.ToLower()
    $extraArgs = '{{ARGS}}'
    if ($tgt -eq 'react') {
        bque bench -- pnpm --filter @chahu/cha-set exec vitest bench --run $extraArgs
    } elseif ($tgt -eq 'qt') {
        bque bench -- node scripts/run-qt-showcase.mjs --test-scenario benchmark $extraArgs
    } elseif ($tgt -eq 'audit') {
        bque bench -- node scripts/perf-audit.mjs $extraArgs
    } elseif ($tgt -eq 'all') {
        bque bench -- pnpm --filter @chahu/cha-set exec vitest bench --run
        bque bench -- node scripts/run-qt-showcase.mjs --test-scenario benchmark
    } else {
        Write-Error "未知跑分目标: $tgt。可选目标: react, qt, audit, all"
        exit 1
    }
