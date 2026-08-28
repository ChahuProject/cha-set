# Token 映射与刷新指南

> 单一事实源：`spec/tokens/**` 分片（SoT）+ `spec/qt-mapping.json` 映射表，`spec/tokens.json` 为聚合快照。不要直接手改快照。详见 `spec/README.md`。

## 1. 三层架构（launcher 思路为骨架）

```
Tier 0 primitives   尺度刻度：space(0..6=0/2/4/8/12/16/24px)、motion(90/120/180ms)、
                    size(21 个控件尺寸)、fontWeight, 与主题无关的常数。
Tier 1 semantic     角色别名，每个 token 带 presets：
                      launcher: {light, dark}   ← crd-a/launcher 手写变量逐字转录
                      dunting:  {light, dark}   ← ThemeManager kDark/kLight 映射
                    核心词表 = shadcn 兼容（background/foreground/card/popover/
                    primary/secondary/muted/accent/destructive/border/input/ring/
                    chart-1..5）；产品专名进命名空间：chrome.* canvas.* overlay.*
                    interaction.* accent.nest/pending/conflict/blocked。
Tier 2 composite    多部件表面（材质 alpha/模糊/阴影/渐变），仅 "$platform":["css"]；
                    Qt 渲染管线不消费（Dunting 为离屏 QML，无 QSS）。
themes              选择器轴 mode × accentTheme(8) × windowTint(6) × interfaceStyle(2)
                    + deltas[]（轴组合 + tokens，不存 selector，见 §6 推导规则）。
qt                  派生表（不存于分片）：colors{33 字段×dark/light}+ space/motion/size，
                    由 semantic.dunting + primitives 经 spec/qt-mapping.json 派生。
```

### 三层架构图

```
                    ┌──────────────────────────────┐
                    │  Tier 0  primitives         │  spec/tokens/primitives.json
                    │  space / motion / size /    │  常数尺度，跨产品共享
                    │  fontWeight                 │
                    └──────────┬───────────────────┘
                               │ 被 semantic 语义化引用
                    ┌──────────▼───────────────────┐
                    │  Tier 1  semantic           │  spec/tokens/semantic/*.json
                    │  core / launcher / dunting  │  58 tokens × presets
                    │  launcher=oklch  dunting=   │  #RRGGBBAA
                    │  #RRGGBBAA                  │
                    └──────────┬───────────────────┘
                               │ 被 composite 叠加
                    ┌──────────▼───────────────────┐
                    │  Tier 2  composite.launcher │  spec/tokens/composite/
                    │  40 个 app-* 表面           │    launcher.json
                    │  $platform: ["css"]         │
                    └──────────┬───────────────────┘
                               │ 被 themes 差量覆盖
                    ┌──────────▼───────────────────┐
                    │  themes                      │  spec/tokens/themes/
                    │  axes(8/6/2) + deltas(30)   │    axes.json + deltas.json
                    │  selector 由 selectorFor    │  派生，非手写
                    │  派生                        │
                    └──────────┬───────────────────┘
                               │ 派生 qt
                    ┌──────────▼───────────────────┐
                    │  qt (derived)                │  spec/qt-mapping.json +
                    │  33 colors + space/motion/   │  token-helpers hexToRgbf
                    │  size 派生                   │  + fmtChannel
                    └──────────────────────────────┘
```

## 2. 文件拆分表

SoT 为分片，`spec/tokens.json` 为 `spec/build-tokens.mjs` 聚合的已提交快照（CI 以 sha256 校验分片与快照一致）。

| # | 文件 | 内容 | 顶层键 | 行数/规模 |
|---|------|------|--------|-----------|
| 1 | `spec/tokens/meta.json` | schemaVersion、description、sources、conventions | `meta` | 约 40 行 |
| 2 | `spec/tokens/primitives.json` | space(7)、motion(3)、size(21)、fontWeight(2) | `primitives` | 约 45 行 |
| 3 | `spec/tokens/semantic/core.json` | 核心 shadcn 兼容 token 约 22 个：background/foreground/card/popover/primary 等 | `semantic` | 约 260 行 |
| 4 | `spec/tokens/semantic/launcher.json` | launcher 专有：sidebar*、chart-1..5 | `semantic` | 约 120 行 |
| 5 | `spec/tokens/semantic/dunting.json` | dunting 命名空间：chrome.*、canvas.*、overlay.*、accent.nest/pending/conflict/blocked | `semantic` | 约 220 行 |
| 6 | `spec/tokens/composite/launcher.json` | 40 个 `app-*` 复合表面，`$platform: ["css"]` | `composite.launcher` | 约 360 行 |
| 7 | `spec/tokens/themes/axes.json` | 四轴枚举：mode(2)、accentTheme(8)、windowTint(6)、interfaceStyle(2) | `themes.axes` | 约 20 行 |
| 8 | `spec/tokens/themes/deltas.json` | 30 条差量（16 accent + 12 tint + 2 interfaceStyle），无 selector | `themes.deltas` | 约 440 行 |
| 9 | `spec/qt-mapping.json` | qt 派生映射：colors 33 + space 7 + motion 3 + size 21 | 映射表 | 74 行 |
| 10 | `spec/load-tokens.mjs` | 单一读取入口，分片优先、快照兜底 | 无 | 264 行 |
| 11 | `spec/build-tokens.mjs` | 聚合器 + sha256 + `--check` 漂移门 | 无 | 167 行 |
| - | `spec/tokens.json` | 已提交快照（生成物，非 SoT） | `meta/primitives/semantic/composite/themes/qt` | 2173 行 |
| - | `spec/token-helpers.mjs` | 共享纯函数：HEX8/OKLCH_RE/COLOR_MIX_RE、hexToRgbf、fmtChannel、selectorFor、stringifySorted/ORDER | 无 | 191 行 |

> 说明：计划按 DTCG 分组落 11 文件，实际落地为 8 个分片 JSON + 3 个聚合/映射脚本（上表 1..11，8 physical shards + qt-mapping mapping to 11 logical）。不允许 `spec/tokens/**` 下出现 `qt` 分片，也不允许 `deltas` 中出现 `selector`，由 `validate-tokens.mjs` 硬校验。

## 3. 聚合与生成管线图

```
spec/tokens/** 分片 (8 files) ─┐
spec/qt-mapping.json 映射表    ─┤
                                ├─▶  loadTokensSync({from:"split"})
                                │       ├─ 固定顺序 deepMerge
                                │       │   meta → primitives → semantic/core
                                │       │   → semantic/launcher → semantic/dunting
                                │       │   → composite/launcher → themes/axes
                                │       │   → themes/deltas
                                │       ├─ deriveThemes: deltas → overrides
                                │       │   （selectorFor 逐条派生，见 §6）
                                │       └─ deriveQt: semantic.dunting + primitives
                                │           经 qt-mapping + hexToRgbf → qt.colors/rgbf
                                │              /space/motion/size
                                │
                                ▼
                    buildSnapshotObject(memoized)
                                │
                                ├─ stringifySorted(ORDER) 规范键序
                                │  top: meta/primitives/semantic/composite/themes/qt
                                │  semantic 按 ORDER.semantic 分组排序
                                │
                                ▼
                    spec/tokens.json 快照 ── sha256 校验 ── git 已提交
                                │
              ┌─────────────────┼─────────────────┐
              ▼                 ▼                 ▼
   generate-css.mjs     generate-qt.mjs    validate-tokens.mjs
   (loadTokensSync)     (loadTokensSync     (loadTokensSync)
    selectorFor)         + deriveQt)         axes/delta/hex校验
              │                 │                 │
              ▼                 ▼                 │
  tokens.css (lib)   theme_tokens.generated.h     │
  tokens.generated   ThemeTokens.generated.qml    │
  .css (launcher)    33 colors+7+3+21            │
              │                 │                 │
              └────────┬────────┘                 │
                       ▼                         │
              git diff --exit-code 校验          │
              pnpm gen:all / CI drift gate ◀─────┘
```

管线链：`shards -> loadTokens -> buildSnapshotObject -> spec/tokens.json -> generators`

关键不变量：

- 合并顺序固定，分片间顶层键不重叠（validator 校验 overlapping key）。
- 键序由 `spec/token-helpers.mjs: ORDER` + `stringifySorted` 决定，保证 `pnpm gen:tokens` 字节一致。
- `qt` 不存分片，`selector` 不存差量，均为运行期派生。

## 4. 生成物与消费方

| 产物 | 生成器 | 落点（cha-set） | 消费方 |
|---|---|---|---|
| 库风味 CSS | generate-css.mjs | packages/react/src/styles/tokens.css（shadcn 标准名，无前缀，仅核心层） | @chahu/cha-set（Button 等）；宿主已定义同名变量时以宿主为准 |
| 兼容风味 CSS | 同上 | dist/consumers/launcher/generated/tokens.generated.css | crd-a/launcher/src/css/generated/（替换原 shadcn-base/app-variables/window-tint/themes 四文件变量块） |
| Qt C++ 头 | generate-qt.mjs | dist/consumers/dunting/generated/theme_tokens.generated.h | dt-a/theme/generated/（ThemeManager::Tokens 取值源） |
| Qt QML 单例 | generate-qt.mjs | qt/src/ThemeTokens.generated.qml | qt showcase / Dunting QML |

## 5. dunting → unified 语义映射

### 5.1 概览映射（ThemeManager 字段 → unified 语义位）

| ThemeManager 字段 | unified 语义位 |
|---|---|
| text | foreground（兼 card-foreground/secondary-foreground/accent-foreground） |
| subduedText | muted-foreground |
| danger / focus / panel / panelRaised / onAccent / selection / border / background / accent | destructive / ring / card(+muted) / popover(+secondary) / primary-foreground(+destructive-foreground) / accent / border / background / primary |
| chrome, chromeIcon/Hover/Down | chrome.surface / chrome.icon / chrome.hover / chrome.down |
| canvasMarquee(+Border), canvasLoading*(3), canvasGrid(+Major) | canvas.* |
| overlayScrim, infoBar | overlay.scrim / overlay.info-bar |
| hover, pressed, disabled, disabledText | interaction.* |
| nestAccent, pendingAccent, conflict, blocked | accent.nest / accent.pending / accent.conflict / accent.blocked |

不生成的项：`accentHover/accentPressed`（theme_manager.cpp 运行时派生 lighter(112)/darker(110)）、
`tabMinWidth/tabMaxWidth`（用户偏好非 token）。

### 5.2 qt 33 行映射表（qt field → semantic token + transform）

`spec/qt-mapping.json` 为唯一映射表，`generate-qt.mjs:deriveQt` + `load-tokens.mjs:deriveQt` 共用。

| # | qt field | semantic token | transform | 说明 |
|---|----------|----------------|-----------|------|
| 1 | chrome | chrome.surface | 无 | dunting dark/light #RRGGBBAA |
| 2 | background | background | 无 | |
| 3 | panel | card | 无 | |
| 4 | panelRaised | popover | 无 | |
| 5 | border | border | 无 | |
| 6 | accent | primary | 无 | |
| 7 | nestAccent | accent.nest | 无 | |
| 8 | pendingAccent | accent.pending | 无 | |
| 9 | blocked | accent.blocked | 无 | |
| 10 | text | foreground | 无 | |
| 11 | subduedText | muted-foreground | 无 | |
| 12 | conflict | accent.conflict | 无 | |
| 13 | onAccent | primary-foreground | 无 | |
| 14 | selection | accent | 无 | |
| 15 | hover | interaction.hover | 无 | |
| 16 | pressed | interaction.pressed | 无 | |
| 17 | disabled | interaction.disabled | 无 | |
| 18 | disabledText | interaction.disabled-text | 无 | |
| 19 | focus | ring | 无 | |
| 20 | overlayScrim | overlay.scrim | 无 | |
| 21 | danger | destructive | 无 | |
| 22 | dangerHover | destructive | alpha:0.5 | 取 destructive 的 hex，alpha 字节重写为 `round(0.5*255)=0x80`，如 `#D12E26E6 → #D12E2680` |
| 23 | infoBar | overlay.info-bar | 无 | 原为 #AARRGGBB 浮点来源，派生后以 hexToRgbf 并做快照 rgbf 回退保证字节一致 |
| 24 | canvasMarquee | canvas.marquee | 无 | |
| 25 | canvasMarqueeBorder | canvas.marquee-border | 无 | |
| 26 | canvasLoadingBackdrop | canvas.loading-backdrop | 无 | |
| 27 | canvasLoadingBorder | canvas.loading-border | 无 | |
| 28 | canvasLoadingText | canvas.loading-text | 无 | |
| 29 | canvasGrid | canvas.grid | 无 | |
| 30 | canvasGridMajor | canvas.grid-major | 无 | |
| 31 | chromeIcon | chrome.icon | 无 | |
| 32 | chromeHover | chrome.hover | 无 | |
| 33 | chromeDown | chrome.down | 无 | |

space / motion / size 映射（`spec/qt-mapping.json: space/motion/size`）：

- space: `space0..space6 → primitives.space.space0..space6`（7 项）
- motion: `motionQuick/Short/Medium → primitives.motion.quick/short/medium`（3 项）
- size: `radiusSmall/controlHeight/gap/pageInset/dockInset/dividerThickness/minimumPaneExtent/panelRadius/rowRadius/radiusLarge/radiusXl/separatorHeight/separatorLine/checkCol/iconCol/cascadeGap/chevronW/fontSizeTitle/fontSizeHeading/fontSizeBody/fontSizeSmall → primitives.size.*`（21 项）

派生细节：`hexToRgbf(hex)` 按 `#RRGGBBAA` 拆字节 /255 取浮点，`fmtChannel` 对 byte-origin 通道输出 `"<byte>.0 / 255.0"` 保证 Qt 16 位存储位精确等值；对 chrome 等浮点来源，若 hex 派生 rgbf 与快照 rgbf 差值 >1e-9 则整表回退快照 rgbf 以保字节一致（`load-tokens.mjs` 与 `generate-qt.mjs` 同逻辑）。

## 6. selectorFor 推导规则

`spec/token-helpers.mjs: selectorFor` 为唯一选择器合成入口，`generate-css.mjs` 仅通过它派生。

```js
export function selectorFor({ mode, accentTheme, windowTint, interfaceStyle }) {
  if (mode !== 'light' && mode !== 'dark') throw new Error('mode must be "light" | "dark"');
  const count = Number(accentTheme!==undefined) + Number(windowTint!==undefined) + Number(interfaceStyle!==undefined);
  if (count !== 1) throw new Error('exactly one of accentTheme|windowTint|interfaceStyle must be set');
  const base = mode === 'dark' ? '.dark' : ':root';
  if (accentTheme !== undefined) return `${base}[data-theme="${accentTheme}"]`;
  if (windowTint !== undefined) return `${base}[data-window-tint="${windowTint}"]`;
  return `${base}[data-interface-style="${interfaceStyle}"]`;
}
```

规则（selectorFor rule：`mode light|dark + exactly one of accentTheme/windowTint/interfaceStyle -> .dark/:root[data-*]`）：

- `mode` 必填且仅 `light | dark`。
- 恰好一个轴：`accentTheme`、`windowTint`、`interfaceStyle` 三选一，非零即一，否则硬错误。
- `base`：`dark → .dark`，`light → :root`。
- 后缀按轴固定：`data-theme`、`data-window-tint`、`data-interface-style`，值为 `themes.axes` 枚举字面量（8/6/2），未知值在 `validate-tokens.mjs` 与 `selectorFor` 双重校验。
- `spec/tokens/themes/deltas.json` 禁止出现 `selector` 字段，`validate-tokens.mjs` 与 `generate-css.mjs` 双重守卫；`spec/tokens.json` 快照中的 `themes.overrides[].selector` 为派生写入，非 SoT。
- 级联顺序由 `deltas.json` 文件顺序固化（30 条同原 `overrides:1065-1533` 顺序：16 accent 先 light 后 dark，12 tint，2 interfaceStyle），生成器不重排，`byAxis` 按轴过滤后保持原序。

示例：`{mode:"dark", accentTheme:"slate"}` → `.dark[data-theme="slate"]`，`{mode:"light", windowTint:"mist"}` → `:root[data-window-tint="mist"]`。

## 7. 刷新流程（改值 → 两端生效）

SoT 是分片，禁止直接改 `spec/tokens.json`。

```bash
# 1) 只改分片（JSON 手工编辑点）
#    spec/tokens/meta.json | primitives.json
#    spec/tokens/semantic/core.json | launcher.json | dunting.json
#    spec/tokens/composite/launcher.json
#    spec/tokens/themes/axes.json | deltas.json
#    规模映射改 spec/qt-mapping.json（通常不动）

# 2) 聚合快照 + 生成全部产物
pnpm gen:tokens    # node spec/build-tokens.mjs  → 写 spec/tokens.json + 打印 sha256
pnpm gen:all      # node spec/generators/generate-all.mjs → gen:css + gen:qt
#  单步等价： pnpm gen:tokens && pnpm gen:css && pnpm gen:qt

# 3) 本地漂移自检（CI 同款门）
node spec/build-tokens.mjs --check
node spec/validate-tokens.mjs
git diff --exit-code -- spec/tokens.json packages/react/src/styles/tokens.css qt/src/ThemeTokens.generated.qml dist/consumers/

# 一键刷新校验（CI 同款一键门）
pnpm gen:tokens && pnpm gen:all && git diff --exit-code -- spec/tokens.json packages/react/src/styles/tokens.css qt/src/ThemeTokens.generated.qml dist/consumers/

# 4) 同步到同级检出（存在才拷贝，缺失跳过；含 git status 提示）
node scripts/sync-consumers.mjs
#    crd-a  ← dist/consumers/launcher/generated/tokens.generated.css
#    dt-a   ← dist/consumers/dunting/generated/theme_tokens.generated.h
#            注意：刷新头后需 touch theme/theme_manager.cpp 再 ninja，否则不重编

# 5) 提交（本仓提交快照 + 生成物 + 分片）
git add spec/tokens/** spec/tokens.json spec/qt-mapping.json packages/react/src/styles/tokens.css qt/src/ThemeTokens.generated.qml dist/consumers/
git commit -m "refactor(spec): ..."

# 6) 各消费仓审查并提交（见各自仓库流程）
```

防漂移分工：

- 本仓 CI `git diff --exit-code` 把关 `spec/tokens.json` + 4 产物。
- 额外 `node spec/build-tokens.mjs --check` 保证分片与快照 sha256 一致（规范化后）。
- dt-a 侧 `DuntingThemeTokensGoldenTests` 黄金测试把关头文件漂移。

紧急旁路见 §8 `CHA_TOKENS_FROM`。

## 8. 回滚指南（可逆性）

### 单次 revert 即可回退

`spec/tokens.json` 仍作为已提交快照保留，`spec/tokens/**` 为 SoT，重构未改任何 token 值与消费者路径，故整套改动可一次性回退：

```bash
# 查看本轮重构提交区间（以实际 git log 为准，6 个原子提交）
git log --oneline --graph --all | grep -E "chore\(spec\)|refactor\(spec\)|feat\(spec\)|chore\(ci\)|docs\(spec\)"

# 一键回退整套重构（示例区间，替换为实际 commit range）
git revert --no-commit HEAD~6..HEAD
git commit -m "revert: 回退 cha-token-refactor 分片重构，恢复单文件 SoT"

# 或保留历史，直接重置到重构前基线
git reset --hard <pre-refactor-base>
```

回退后：

- `spec/tokens/**`、`spec/load-tokens.mjs`、`spec/build-tokens.mjs`、`spec/qt-mapping.json` 被删除，恢复单文件 `spec/tokens.json` 手工编辑。
- 旧版生成器仍直接读 `spec/tokens.json`，`pnpm gen:all` 保持可用，产物字节一致。
- 证据保留于 `.omo/evidence/cha-token-refactor/`。

### 热修复开关：CHA_TOKENS_FROM

所有读取均经 `spec/load-tokens.mjs:loadTokensSync({from})`，支持环境变量覆盖：

```bash
# 强制从快照读取（忽略分片），用于分片损坏或紧急热修复
CHA_TOKENS_FROM=snapshot node spec/validate-tokens.mjs
CHA_TOKENS_FROM=snapshot pnpm gen:css
CHA_TOKENS_FROM=snapshot pnpm gen:qt
CHA_TOKENS_FROM=snapshot pnpm gen:all

# 默认行为（分片优先，快照兜底）
node spec/build-tokens.mjs --check   # 校验分片与快照一致
```

生成器内部固定 `loadTokensSync({from:"split"})`，但手工以 `CHA_TOKENS_FROM=snapshot` 启动可绕过分片派生，直接用已提交快照应急发版，事后补齐分片并重跑 `pnpm gen:tokens && pnpm gen:all` 即可。

## 9. 设计取舍：DTCG + vanilla Node（DTCG vanilla Node rationale）

- 借鉴 W3C DTCG 2025.10 的分组与 `$type` 思路组织文件（按产品与层级分文件，保留 `$type` 与 `$platform`），但不引入 Style Dictionary 等重型依赖。
- 拒绝 Style Dictionary 的原因：额外依赖、键序与 `oklch()`/`color-mix()` 转写不可控、会改变已提交产物字节，违背"字节一致"约束。
- 选择 vanilla Node 聚合：`ORDER` + `stringifySorted` 保证键序确定，`oklch()`/`color-mix()` 保持逐字原文，`fmtChannel` 保持与 `spec/generators/generate-qt.mjs:42-45` 一致的 `byte*255` 舍入，`sha256` 快照比对提供字节一致证明。
- 快照策略：`spec/tokens.json` 作为已提交生成物保留，兼顾可审计与一键 revert；`spec/tokens/**` 为 SoT，分片编辑后 `pnpm gen:tokens` 重写快照，CI 以 `--check` 锁死两者一致。

## 10. 已知语义陷阱（转录时踩过）

- Qt `QColor(QString)` 9 位十六进制是 **#AARRGGBB**：源码 `infoBar "#99000000"` =
  α0x99 黑色；`canvasMarquee "#3366aaff"` 同理 α0x33。spec.qt.rgbf 以浮点数组保存
  真值，生成器发 `QColor::fromRgbF(...)` 保证 16 位存储位精确等值。
- launcher 兼容风味的变量名 = semantic 键去命名空间前缀（interaction.hover→--hover）。
- `--app-status-*` 保留原名归入 composite 层（消费方按名引用）。

## 11. 债务附录（未清理，仅记录）

dt-a qml/ 内 ~300 处 `? theme.X : "#hex"` 回退色值（308 hex + 48 rgba，19 文件），
且部分回退值已与 kDark 漂移（如 InspectorPanel `#1c2330` vs 真 panel `#161b26`）。
分类与 Top10 名单见 `.omo/drafts/chaset-ui-unify.md`「迁移债」小节；建议后续以
DuntingButton 的守卫模式统一收敛为单一 guarded-token 单例。
