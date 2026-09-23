# cha-set 统一主题设置控件 — 可行性与设计方案

> 目标：在 cha-set 中实现一个「主题设置控件」，作为 `chahu-render-debugger`（下称 **crd**）与 `dunting-qt`（下称 **dt**）两个项目统一的主题配置入口。
> 定位：只管理 cha-set 能覆盖和控制的部分（配色、字体/排版、控件样式、间距圆角、动效），不越界处理它管不到的内容。
> 本文所有结论均基于对两侧现有主题实现的实读（文件路径与行号已标注）。

---

## 0. 前提与设计原则（重要）

**前提**：两个项目同属一个作者，**两侧都可以改**。因此本方案**不引入兼容层 / 适配层 / 转换器**。

**处理冲突的唯一方式——收敛（convergence），而非桥接（bridging）**：

> 遇到两边不一致的配置项，**先判定谁更完整、更先进，然后把另一方改成与之相同**。
> 只有当某项在一个项目里**根本不存在、且对另一个项目也没有意义**时，才允许它作为「该项目独有」存在。

由此得出三条硬性设计原则：

| 原则 | 含义 | 反例（本方案明确不做） |
|---|---|---|
| **P1 不做适配层** | 禁止写 `规范配置 ↔ 项目配置` 的双向映射函数 | ~~`主题适配.ts` 里 `mode:"system" ↔ 偏好:"auto"` 的翻译~~ |
| **P2 冲突项一端对齐** | 两边都有但形状不同 → 改到一致，**不保留两套** | ~~保留 `auto` 与 `system` 两个名字，靠映射处理~~ |
| **P3 独有项收紧到最小** | 「独有」必须是「另一端根本不存在且不可能需要」 | 见 §1.4 的逐项裁定表 |

**这条原则最直接的结果**：crd 的配置项**远多于** dt（`主题颜色` 十档调色板、`界面风格` simple/expressive、`装饰程度` 0-100、`窗口色调`、`窗口材质`…），dt 几乎是它一个极简子集。
按 P2，**冲突项以 crd 的模型为准**，即 **dt 要向 crd 扩展**——这是本方案与「保守兼容」思路最大的差别，也是工作量分布的关键：**主要改造量在 dt 一侧**。

---

## 1. 现状调查

### 1.1 cha-set 已建成的事实（起点，不是障碍）

| 能力 | 现状 | 证据 |
|---|---|---|
| 单一真理源（SSOT） | 三层 token：`primitives` / `semantic` / `composite` + `themes.axes` / `themes.deltas` | `spec/tokens/` |
| 双产品 preset | **`dunting` 与 `launcher` 两套 preset 已在同一份 spec 内共存** | `spec/tokens/meta.json` |
| 跨端生成器 | Qt / CSS / QML 生成器齐备 | `spec/generators/generate-qt.mjs`、`generate-css.mjs` |
| dt 已接入 | dt **已 `#include <ChaSet/theme_tokens.generated.h>`**，`using Tokens = cha_set_gen::ThemeTokens` | `dt:theme/theme_manager.h:24,250` |
| crd 已接入 | crd 的 `src/css/generated/tokens.generated.css` 已由 cha-set 生成 | `crd:launcher/src/css/generated/tokens.generated.css:1-4` |
| 构建集成 | dt 已有 `cmake/25-chaset.cmake`，引入 `ChaSet` 目标 | `dt:cmake/25-chaset.cmake` |
| 展示页 | cha-set 自带 Qt `ThemeTunerPage.qml`（实时调色 + 导出） | `cha-set:qt/src/ThemeTunerPage.qml` |

**结论**：数据层统一已完成大半。本任务的重心**不是**从零统一数据，而是**把配置行为也用同一个控件统一掉**，并按 P2 把两侧模型收敛到一套。

### 1.2 dunting-qt（Qt/QML，C++ 进程级单例）

- `ThemeManager` 是进程级单例，QML 经 context property `theme` 访问；token 全是 `Q_PROPERTY` + `NOTIFY themeChanged`，绑定自动重算（`dt:theme/theme_manager.h:1-16`）。
- token 体系：33 色 + 7 间距 + 3 动效 + 21 尺寸/字号（`theme_manager.h:47-157`）。
- **主题模式**：`dark / light / system` 三值（`theme_manager.h:30-34`，收敛逻辑 `theme_manager.cpp:102-130`）。
- **强调色**：只有二值 `accentMode = default | custom` + `accentHex`（`theme_manager.h:39-40, 168-175`）。
  - `default` → 用 preset 自带 `accent`；`custom` → 用 `accentHex`（`theme_manager.cpp:136-143`）。
  - **没有**"把某预设色（如蓝色）作为命名选项"的概念——这正是与 crd 的第一大冲突（§1.4 D1）。
- **动态派生 token**（不可静态生成，`meta.json:excluded` 已确认）：
  - `accentHover = accent().lighter(112)`、`accentPressed = accent().darker(110)`（`theme_manager.cpp:145-147`）
  - 动效时长被 `animSpeed` / `animationsEnabled` 二次加工（`theme_manager.h:114-122`）
- **除 token 外还管**：`tabWidthMode/tabMinWidth/tabMaxWidth`（标签栏宽度）、`animationsEnabled/animSpeed/smoothScrollEnabled/smoothScrollDuration`（动效偏好）。
- **持久化**：exe 相邻 `settings.json`，**读-改-写 merge**，只覆盖自己拥有的键；自注册 `ResetRegistry`，重置时统一删文件（`theme_manager.cpp:82-86, 258-271, 403-432`）。
- **UI 宿主**：`dt:qml/DesignSystemPage.qml`（1613 行），**已大面积 dogfood ChaSet 组件**（`ChaSetCard`×8、`ChaSetButton`×22、`ChaSetBadge`×12、`ChaSetSettingRow`×5、`ChaSetSegmentedControl`×7、`ChaSetColorPicker`×4 …），且有「偏好设置」tab。

### 1.3 chahu-render-debugger / launcher（React + Tauri，CSS 变量）

- **数据层**：`src/lib/主题.ts`（640 行）纯函数单例，把状态写进 `document.documentElement`：`.dark` class + `data-theme`/`data-window-material`/`data-window-tint`/`data-interface-style` dataset + 一批 `--app-*` 内联属性。
- **状态层**：`src/store/主题状态.ts`（Zustand），负责落盘与跨窗口同步。
- **持久化**：Tauri IPC（`保存外观设置`/`读取外观设置` → `src-tauri/src/config/外观.rs`、`src-tauri/src/外观.rs`）。
- **跨窗口同步**：`BroadcastChannel("chahu-theme-sync")` + `chahu-theme-remote-update` 事件（`主题.ts:74-76, 630-639`；`主题状态.ts:275-287`）。
- **配置项**（`外观页面/` 11 个分区文件，`常量.ts` 定义全部选项）：

| 配置项 | 取值 | 是否与 dt 重合 |
|---|---|---|
| `主题偏好` | `auto/light/dark` | [MATCH] 重合（dt: `system/light/dark`） |
| `主题颜色` | `neutral/slate/red/orange/yellow/green/blue/violet/rose/custom`（10 档） | [PARTIAL] dt 只有 `default/custom` |
| `自定义主题强调色` | hex，默认 `#7c3aed` | [MATCH] 重合（dt 默认 `#30a0ff`） |
| `界面风格` | `simple/expressive` | [DIFF] dt 无 |
| `装饰程度` | 0-100 | [DIFF] dt 无 |
| `装饰覆盖项` | `radius/shadow/materialTransparency/motion` 各自 0-100 | [PARTIAL] dt 有静态 radius token，无"程度"概念 |
| `窗口材质` | `none/mica/acrylic/tabbed` | [DIFF] dt 无 → **Windows DWM 系统 API** |
| `窗口色调` | `neutral/slate/graphite/mist/sage/plum/custom` | [DIFF] dt 无 |
| `自定义窗口底色亮/暗` | hex | [DIFF] dt 无 |
| `背景图片` / `背景图片缩放` | 路径 + `cover/contain/stretch/tile/center` | [DIFF] dt 无 |
| `界面缩放` | 系数 | [PARTIAL] dt 侧 cha-set 已有 `uiScale` |
| `标签栏宽度` | — | [DIFF] crd 无（dt 独有） |
| `平滑滚动/动画开关` | — | [DIFF] crd 无（dt 独有） |

### 1.4 冲突逐项裁定表（本方案的核心）

按 P2/P3 逐项裁定。**「独有」只有 5 项**，且都经得起"另一端根本不可能需要"的检验。

| # | 配置项 | crd | dt | 裁定 | 理由 |
|---|---|---|---|---|---|
| **D1** | **调色板粒度** | 10 档命名色（含 `custom`） | 2 值（`default`/`custom`） | **合并为 crd 的 10 档** | dt 的 `default` 本质就是"用 preset 默认色"，等价于 10 档中的 `neutral` 一档。dt 改造后支持 10 档，`neutral` = 旧 `default`（默认值），**旧 `default` 名称废弃**。这是"crd 更先进"的典型：命名色板是刚需，二值还不够表达 |
| **D2** | **模式命名** | `auto` | `system` | **统一为 `system`** | 二者语义完全相同。取 `system` 因其自解释性更强、且已是 cha-set 侧用词。crd 改 `auto → system`（含 i18n key、持久化值迁移） |
| **D3** | **强调色默认值** | `#7c3aed` | `#30a0ff` | **统一为 `#30a0ff`** | 二者都是"自定义入口的初始色"。取 `#30a0ff` 因为它是 cha-set `ThemeTokens.accent` 的实际值（`theme_tokens.generated.h:90`），已是跨端 token 的真值，让"默认自定义色 = 默认 preset 强调色"语义自洽 |
| **D4** | **界面风格 / 装饰程度** | `simple/expressive` + 0-100 | 无 | **纳入统一模型**，**非独有** | dt 也有圆角/阴影/透明度的静态 token，只是没有"程度"旋钮。这不是能力缺失而是**交互层级缺失**——两项目同为该作者的桌面应用，"用户可调装饰强度"对 dt 同样成立。dt 把 `装饰程度` 映射到既有 `radiusSmall/panelRadius/rowRadius` 等 token |
| **D5** | **窗口色调** | 6 档 + custom | 无 | **判为 crd 独有** | 它改变的是 `--background/--card/sidebar` 整套基础面色（见 `window-tint.css`），依赖 crd 的 window-material / 壁纸取色语境（`--app-window-tint`）。dt 的窗口是自绘 + `chrome*` token 体系，没有"跟随壁纸的窗口底色"这一层 |
| **D6** | **窗口材质** | `none/mica/acrylic/tabbed` | 无 | **判为 crd 独有** | 纯 Windows DWM 系统 API（`应用窗口材质` → Rust → DWM）。dt 不具备该窗口模型 |
| **D7** | **背景图片** | 路径 + 5 种缩放 | 无 | **判为 crd 独有** | 依赖 Tauri 的文件系统访问与云母纹理生成（`生成全屏云母纹理`），且与 window-material 强耦合 |
| **D8** | **标签栏宽度** | 无 | `tabWidthMode/min/max` | **判为 dt 独有** | crd 的标签栏由 `菜单会话状态` 管理，与 dt 的 `ShellTabStrip` 是不同组件模型，无对应配置项 |
| **D9** | **平滑滚动 / 动画开关** | 无 | 4 项 | **判为 dt 独有** | **注意**：这是**宿主能力**而非主题能力——它控制的是滚动行为，不改变视觉 token。cha-set 的 `ThemeTokens` 已有 `animationsEnabled/animSpeed`（`ThemeTokens.generated.qml:13-14`），但 crd 的对应物是 CSS transition（由 `装饰覆盖项.motion` 驱动），语义与"OS 级平滑滚动"不同层 |
| **D10** | **界面缩放** | 独立设置区 | cha-set 已有 `uiScale` | **统一到 cha-set 的 `uiScale`** | 二者都是全局缩放因子。crd 的 `use界面缩放/use缩放系数` 改为消费同一语义 |
| **D11** | **装饰覆盖项构成** | `radius/shadow/materialTransparency/motion` | 无 | **纳入统一模型**，但**剔除 `materialTransparency`** | `materialTransparency`（`--app-material-*-alpha`，`主题.ts:526-533`）作用于窗口材质层的透明，与 D6 强耦合 → 随 D6 一起划为 crd 独有。统一模型保留 `radius/shadow/motion` |
| **D12** | **派生公式载体** | `color-mix`（CSS） | `lighter(112)/darker(110)`（Qt） | **统一公式 + 各端原生实现** | 不是配置项而是实现细节。定义规范公式（§3.4），两端各自用原生 API 实现，由契约测试锁一致。这是唯一允许"同一语义两种实现"的地方，因为 Qt 与 CSS 无法共用代码 |

> **裁定结果**：统一模型 **8 项**（模式、调色板、强调色默认、界面风格、装饰程度、装饰覆盖项、界面缩放、排版）
> 真正独有：**crd 3 项**（D5 窗口色调、D6 窗口材质、D7 背景图片）+ **dt 2 项**（D8 标签栏宽度、D9 平滑滚动/动画开关）

### 1.5 一句话诊断

> **配色/间距/圆角/动效这层「设计 token」已经统一到 cha-set；缺的是「面向用户的主题设置控件」这层产品接口。**
> 而两侧的**配置模型**不一致，按 P2 要**收敛**——冲突项以 crd 模型为准（它更完整），dt 相应扩展；只有 5 项判为真正独有。

---

## 2. 可行性、风险与成本

### 2.1 可行性总评：**可行，且处于最有利的时间点**

- 数据层已就位（§1.1），控件只需消费既有生成产物，无需再造 token 抽象。
- dt 有天然宿主：`ThemeManager` 已是 Q_PROPERTY 单例，`DesignSystemPage.qml` 已是 ChaSet 组件展示页 —— 控件可作为普通 ChaSet 组件 `import ChaSet` 使用。
- crd 有天然宿主：`外观页面/` 已是分区组件结构，控件可作为 section 嵌入；CSS 变量写入点集中在 `应用主题()` 单函数，替换面收敛。

### 2.2 冲突点（在"只做收敛"的前提下重列）

按新原则，原方案中的"适配"类冲突全部消失，**只剩下 4 个真正需要工程处理的问题**：

| # | 问题 | 性质 | 严重度 | 处置 |
|---|---|---|---|---|
| **C1** | **dt 需要从 2 值强调色扩展到 10 档调色板** | 功能扩展（P2 收敛的代价） | **高** | 本方案最大工作量。需在 cha-set spec 为 `duning` preset 补齐 9 档调色板的 dark/light 值（现仅有单一 `accent`）。**素材来源**：`spec/tokens/themes/deltas.json` 里 `launcher` preset 的 8 组 accent 值可作为审美基线，但需按 dt 的暗色基调重新定值（不能直接照搬，因为 dt 的背景比 crd 深得多） |
| **C2** | **动态派生 token 无法静态生成** | 实现约束 | 中 | 派生规则保留在各端（Qt 用 `QColor::lighter/darker`，CSS 用 `color-mix`），但**公式统一**并由契约测试锁一致（§3.4） |
| **C3** | **持久化载体无法统一** | 架构约束（合理） | 中 | dt 用 `settings.json` merge，crd 用 Tauri IPC。cha-set 只定义**配置项的规范 JSON 形状**，不接管 I/O。**注意这不算适配层**——两侧存的是同一个 schema，只是存放位置不同 |
| **C4** | **dt 的 `FetchContent` 固定 pin** | 工程陷阱 | 中 | `cmake/25-chaset.cmake:88` 固定 `GIT_TAG b5fbd6c...`，只有显式 `CHASET_DEV_LOCAL=ON` 才用本地同级 checkout。落地期必须开，否则出现"改了本地 cha-set 但 dt 毫无变化" |
| **C5** | **crd 多窗口 / 跨 Webview 同步** | 既有机制不能破 | 中 | `BroadcastChannel` 广播由宿主负责，控件只调 `onChange` 回调，不碰广播 |
| **C6** | **i18n** | 约束 | 中 | dt 用 `qsTr()`（source zh_CN）；crd 用 `src/国际化/`（中/繁/日/英/韩）。控件文案走可注入 `textProvider`，禁止 hardcode |
| **C7** | **字体族** | 已知约束 | 中 | **Qt 字体族只认单一族名，逗号列表不解析**；Web 是族列表 + fallback。保持「逻辑族名 + 各端解析表」两层 |

### 2.3 迁移成本（按改动面）

| 侧 | 主要改动 | 复杂度 | 说明 |
|---|---|---|---|
| **cha-set** | 新增控件（Qt `.qml` + React `.tsx`）、新增 `theme-schema`、为 `duning` preset 补 9 档调色板 token、能力表 | 中 | 补调色板是新增数据，不动既有 |
| **dt** | `ThemeManager` 扩到 10 档调色板 + 装饰程度/风格；`DesignSystemPage.qml` 嵌入式替换；`settings.json` 键值迁移 | **高** | 本方案主要工作量所在（C1 + D4 + D11） |
| **crd** | 用控件替换配色/风格/装饰 section；`auto → system` 改名（D2）；强调色默认值改 `#30a0ff`（D3）；`应用主题()` 收敛为读规范配置 | 中 | 界面替换为主，数据模型基本不变 |

### 2.4 关键风险

- **R1 边界蔓延**：最容易发生的失败是"控件顺手把窗口材质/背景图也管了"。→ 用 §3.3 独有清单 + 机械门禁堵死。
- **R2 派生规则双实现漂移**：`accentHover` 在 Qt 用 `lighter(112)`，Web 若换 `color-mix` 就会不一致。→ §3.4 契约测试锁公式。
- **R3 构建 pin 滞后**（C4）：落地期强制 `CHASET_DEV_LOCAL=ON`，合并前再升 pin。
- **R4 dt 调色板定值质量**：C1 需要为 dt 重新定 8 档色的 dark/light 值，**这是唯一需要设计判断而非机械执行的工作**。定值不当会让 dt 的调色板显得脏或与深色背景冲突。→ 阶段 1 先出定值表并人工审校，再进控件。
- **R5 旧值迁移**：D1（`default→neutral`）、D2（`auto→system`）、D3（默认色改值）都涉及已落盘的用户配置。→ 阶段 2/3 需一次性幂等迁移函数（读旧键 → 写新键 → 删旧键），并有对应测试。

---

## 3. 主题控件设计方案

### 3.1 三层架构

```
┌──────────────────────────────────────────────────────────────┐
│  L3  控件层  ChaSetThemeSettings (Qt) / <ThemeSettings> (React)│  ← 本方案新增
│      「配置行为的统一」：分组、控件、实时预览、导入导出、重置       │
├──────────────────────────────────────────────────────────────┤
│  L2  契约层  theme-schema（规范枚举 / 默认值 / 独有项声明）        │  ← 本方案新增（薄）
│      「配置项的规范形状」：与 UI 框架、持久化载体无关               │
├──────────────────────────────────────────────────────────────┤
│  L1  数据层  spec/tokens/** → 生成器 → tokens.css / .h / .qml    │  ← 已存在，复用
│      「设计 token 的单一真理源」                                   │
└──────────────────────────────────────────────────────────────┘
         ▲                                        ▲
    dt: ThemeManager + settings.json        crd: 主题.ts + Tauri IPC + BroadcastChannel
       （宿主侧，只负责 I/O 与 DOM 落地）        （宿主侧，只负责 I/O 与 DOM 落地）
```

**核心原则**：控件**不碰 L1 落地方式、不碰持久化 I/O、不碰广播、不碰派生公式**。它只做三件事：读值、渲染控件、把变更交给宿主回调。
**注意**：宿主侧代码**不是适配层**——它接收的是与控件完全相同的 schema 对象，不做任何字段翻译，只负责"把这份配置写进 `settings.json` / 写进 DOM"。

### 3.2 规范配置对象（唯一形状，两侧完全相同）

```jsonc
{
  "$schema": "cha-set/theme-config@1",
  "version": 1,

  // ---- 统一项（两侧都有，语义完全一致）----
  "mode": "dark",                     // "light" | "dark" | "system"   （D2：auto 已废弃）
  "palette": {
    "id": "neutral",                  // "neutral"|"slate"|"red"|"orange"|"yellow"
                                      // |"green"|"blue"|"violet"|"rose"|"custom"  （D1：统一 10 档）
    "customHex": "#30a0ff"            // id="custom" 时生效；默认值 #30a0ff     （D3）
  },
  "decoration": {
    "styleId": "simple",              // "simple" | "expressive"               （D4）
    "level": 50,                      // 0..100，派生 radius/shadow/motion 的输入（D4）
    "overrides": {                    // 缺键 = 跟随 level                      （D11）
      "radius": 16,
      "shadow": 0,
      "motion": 22
    }
  },
  "typography": {
    "familyId": "system",             // 逻辑族名，各端解析表映射               （C7）
    "scaleId": "default"
  },
  "uiScale": 1.0                      // 全局缩放                              （D10）
}
```

### 3.3 各项目独有项（宿主自管，控件不读不写）

| 项目 | 独有项 | 理由 |
|---|---|---|
| **crd** | `窗口色调`、`窗口材质`、`自定义窗口底色亮/暗`、`背景图片`、`背景图片缩放`、`背景图片不透明度` | D5/D6/D7/D11 —— 依赖 Windows DWM + 壁纸取色 + Tauri 文件系统 |
| **dt** | `标签栏宽度（mode/min/max）`、`平滑滚动（开关/时长）`、`动画开关`、`animSpeed` | D8/D9 —— 宿主交互能力，非设计 token |

**控件行为**：这些项**不出现在控件里**，由各项目在自己的设置页保留原生的独立分区。控件只负责它覆盖的那部分。

> **实施修正**：`装饰覆盖项.materialTransparency` 原列在 crd 独有项中，实际归类应更细——它**绑定窗口材质**（材质透明度只在有材质时才有意义），而 cha-set 不拥有材质，因此它既不进控件、也不作为「crd 独有项」单独列出，而是从 `decoration.overrides` 的**允许键集合**中排除（允许键只有 `radius|shadow|motion`，见 `theme-config.schema.json`）。同理 `backgroundImageOpacity` 从 overrides 排除（背景图本身是 hostOnly）。
>
> 这一区分由 `theme-controls.json` 的 `hostOnly.items` + schema 的 `additionalProperties: false` 共同承载，并由边界门禁 B2 校验。

### 3.4 派生契约（统一公式，两端各自实现）

配置的是**输入**，派生 token 由各端计算。公式由 cha-set 定义并强制校验：

| 派生 token | 规范公式 | Qt 实现 | Web 实现 |
|---|---|---|---|
| `accentHover` | accent 亮度 +12% | `accent().lighter(112)` | `color-mix(in oklch, accent 88%, white)` |
| `accentPressed` | accent 亮度 −10% | `accent().darker(110)` | `color-mix(in oklch, accent 90%, black)` |
| `radiusCard` | `(6 + radius * 0.08) / 16` rem | 由 `radius` 计算 | 同（rem 换算） |
| `radiusPanel` | `(5 + radius * 0.07) / 16` rem | 同上 | 同上 |
| `radiusControl` | `(4 + radius * 0.05) / 16` rem | 同上 | 同上 |
| `motionFast` | `80 + motion * 1.2` ms | 由 `motion` 计算 | 同 |
| `motionNormal` | `100 + motion * 1.6` ms | 同上 | 同上 |
| `customAccentRamp` | 由 `palette.customHex` 推出 `primary`/`primary-foreground`/`ring`/`chart-1..5` 共 8 个值 | 由 hex 计算 | 由 hex 计算 |

> `radius*` 三个系数取自 crd 现有实现（`主题.ts:515-561` 应用装饰参数），`motion*` 同处。这些是目前唯一有具体公式的地方，作为规范固化——并已转录进 `spec/theme-controls.json` 的 `derivedContract`。
>
> `customAccentRamp` 的完整公式（含 ring/chart 的 oklch 混色比例）也已转录进 `theme-controls.json` 的 `axes.palette.subcases.custom.derivation`。

**校验**：`scripts/check-derived-parity.mjs` 用同一组输入（10 档调色板 × light/dark = 20 组动作色）分别算 Qt 路径与 Web 路径，断言 ΔE(CIEDE2000) ≤ 2.0（视觉不可辨阈值）。挂 `pnpm gate`。

### 3.5 对外接口

#### 3.5.1 Qt 端

```qml
// cha-set:qt/src/ChaSetThemeSettings.qml（新增）
ChaSetThemeSettings {
    id: settings

    config:  ...       // var，§3.2 规范配置对象（宿主注入当前值）
    textProvider: ...  // var，i18n 文本注入（C6）
    // 独有项不在此声明——由宿主的独立分区渲染

    onConfigChanged: 宿主.应用(cfg)   // 有效变更即回调，支持实时预览

    function requestReset()      // 回到默认（neutral / dark / simple / 50）
    function exportConfig()      // 返回规范 JSON
    function importConfig(json)  // 校验后应用
}
```

dt 侧新增薄入口（不做字段翻译，只做 I/O 与 token 落地）：

```cpp
// theme/theme_manager.h
Q_INVOKABLE QVariantMap themeConfig() const;              // 读：拼出规范配置
Q_INVOKABLE void applyThemeConfig(const QVariantMap &);   // 写：归一化 → 落到既有成员
                                                          //     → 复用 persistSettings()
```

`applyThemeConfig` 内部只改自己拥有的字段并触发既有 `emit ...Changed`，**继续复用 `persistSettings()` 的读-改-写 merge**（不重写持久化）。

#### 3.5.2 React 端

```tsx
// cha-set:packages/react/src/components/theme-settings/（新增）
<ChaSetThemeSettings
  config={规范配置对象}
  textProvider={t}
  onChange={(next) => 主题状态.应用规范配置(next)}   // 宿主负责落盘 + 广播
/>
```

crd 侧 `主题.ts` 改造：**不再维护 `外观设置` 这个私有中间类型**，改为直接持有 §3.2 的规范配置 + 独有项子对象（`窗口材质` 等），`应用主题()` 仍是唯一 DOM 写入点，只是输入换成规范配置。

### 3.6 数据模型与来源

| 规范字段 | 取值域来源 | 生成方式 |
|---|---|---|
| `mode` | 固定规范枚举 `light\|dark\|system` | 常量 |
| `palette.id` | `spec/tokens/themes/axes.json:themes.axes.accentTheme`（**已 10 档**） | 由 spec 读取 |
| `palette.customHex` 默认 | `spec/tokens/semantic/core.json:accent.presets.duning.dark` | 生成器导出 |
| `decoration.styleId` | `axes.interfaceStyle` | 由 spec 读取 |
| `decoration.level`/`overrides` | 不在 token spec 内（是输入参数） | schema 常量 + 值域 |
| `typography.*` | `spec/tokens/primitives.json:primitives.typography` | 已有生成链 |
| `uiScale` | cha-set 既有 `ThemeTokens.uiScale` | 已有 |

**`spec/theme-controls.json`（已落地，非约 30 行而是完整边界表）**，把 §3.3 独有项变成机械可判定的白名单。实际结构与上面的草图不同——草图按 preset 分组，实际按**轴**分组（因为边界是跨 preset 共享的，按 preset 分会重复描述同一件事）：

```jsonc
{
  "principles": { "P1_no_adapter": …, "P2_follow_launcher": …, "P3_minimal_unique": … },
  "canonical":  { "paletteSource": "launcher", … },
  "axes": {
    "mode":       { "covered": true, "configField": "mode", "values": ["light","dark"], "rootValues": ["auto","light","dark"] },
    "palette":    { "covered": true, "configField": "palette.id", "values": [/* 10 档 */],
                    "subcases": { "neutral": {…}, "custom": { "derivation": {…} } } },
    "decoration": { "covered": true, "configField": "decoration", "fields": { "styleId": …, "level": …, "overrides": … } },
    "typography": { "covered": true, "configField": "typography", "constraint": "Qt 只认单一族名" },
    "uiScale":    { "covered": true, "configField": "uiScale", "min": 0.75, "max": 2.0 }
  },
  "hostOnly":     { "items": [ /* crd 7 项 */ ] },
  "duntingUnique":{ "items": [ /* dt 2 项 */ ] },
  "derivedContract": { "items": [ /* 4 组公式 */ ] }
}
```

> **与草图的实质差异**：草图把 `materialTransparency` 列为 launcher 的 `hostOnly`。实际它应从 `decoration.overrides` 的**允许键集合**中排除即可，不必单列（见 §3.3 实施修正）。而 `tabWidth`/`animationsEnabled` 等 dt 项归入 `duntingUnique`，与 crd 的 `hostOnly` 分开——两者语义不同：`hostOnly` 是「cha-set 管不到」，`duntingUnique` 是「只有 dt 需要」。

> 每个轴都带 `launcher` / `dunting` 两方的**字段名与文件行号**，让「这个轴在两边分别叫什么」有唯一出处，避免实现时再去翻代码。

---

## 4. 分阶段落地计划

### 阶段 0 — 边界冻结与契约固化（无 UI） [DONE] 已完成

**目标**：把 §3.3 独有清单与 §3.2 数据模型变成**机械可校验**产物，防止蔓延（R1）。

**产出（均已落地）**
1. `spec/schemas/theme-config.schema.json` — §3.2 全部字段、值域、`^#[0-9a-fA-F]{6}$` 正则；含 `palette.id === "custom"` 时 `customHex` 为必填的条件约束（`allOf/if-then`）。
2. `spec/theme-controls.json` — 能力边界表，机器可读。分四块：`principles`（P1/P2/P3）、`axes`（5 个 covered 轴：mode / palette / decoration / typography / uiScale）、`hostOnly`（7 项：窗口材质、窗口色调、自定义窗口底色亮暗、背景图片、背景图片缩放、背景图片不透明度）、`duntingUnique`（2 项：标签栏宽度、平滑滚动开关）、`derivedContract`（4 项派生公式）。
   - **与 §3.3 的差异**：`materialTransparency`（材质透明度）从 hostOnly 中移出、改归 `decoration.overrides` 的**排除项**——它语义上绑定窗口材质，而 cha-set 不拥有材质，故不进入控件但也不单列为「dt 独有」。同时 `backgroundImageOpacity` 从 `decoration.overrides` 中显式排除（背景图是 hostOnly），schema 的 `overrides` 只允许 `radius|shadow|motion` 三键。
3. `scripts/check-theme-boundary.mjs` — 边界门禁，7 类断言：
   - B1 每个 covered 轴在 schema 中有对应属性；B4 反向：schema 属性集 ⊆ 已声明轴集（`version` 作为信封字段单独豁免）；
   - B2/B3 `hostOnly` 与 `duntingUnique` 的 id / configField / 中文 label **不得作为键**出现在 schema 中（以 `"name":` 形式匹配，避免把「说明为何排除」的散文误判为泄漏）；
   - B5 声明表与 schema 的 palette 枚举逐位相同；B6 schema 枚举与 `themes.axes.accentTheme` 逐位相同；
   - B7 声明文件结构完整性。
   - 内置 `--self-test`：注入 `windowMaterial` 必须被 B2 抓住、删掉 `typography` 必须被 B1 抓住、篡改枚举必须被 B5 抓住。**门禁先跑自检再跑实检**，防止守卫静默失效后永远「绿灯」。
4. `gate/parity.mjs` 新增 `2.7` 步（边界门禁 + 自检）与 `5.6` 步（spec 层调色板不变量测试）。
5. `package.json` 新增 `check:theme-boundary` / `check:theme-boundary:self-test` 脚本。
6. `docs/design/chaset-theme-control.md`（本文）。

**验收标准**
- `pnpm gate` 新增 `theme-boundary` 步，本地全绿。[PASSED]（当前输出：`5 covered axes, 9 excluded axes (7 hostOnly + 2 duntingUnique), palette of 10 ids verified`，自检 3/3 通过）
- 负向测试：故意往 schema 塞 `windowMaterial` → 门禁必须红。[PASSED]（`--self-test` 覆盖，且作为 `pnpm gate` 的前置条件）

---

### 阶段 1 — 收敛数据模型：调色板对齐为 10 档 [DONE] cha-set 侧已完成

**目标**：让 `duning` 与 `launcher` 两 preset 共享**同一份 10 档调色板定义**，这是 D1 的实施。

> **实施中的重要修正（与原方案的偏差，需记录）**：
> 原方案设想的是「为 dt 补 9 档色值 → `semantic.core.json` 的 duning preset 补 9×2 色值」。
> 实际动手后发现更准确的落点是 **themes 轴**，而非 semantic 的 accent token：
> - `semantic.accent` 的 launcher 值与 8 档色相**无关**（它只是 `oklch(0.269 0 0)` 这类基础中性值），真正的 8 档色相差异**全部住在 `themes.axes.accentTheme` + `themes.deltas` 里**（每档一组 `primary/primary-foreground/ring/chart-1..5`）。
> - 因此「统一调色板」的正确做法是把 `themes.axes.accentTheme` 从 8 档扩到 **10 档**（补 `neutral` 与 `custom`），并补齐对应的 delta 块——而不是往 semantic 层塞 20 个色值。
> - `neutral` 与 `custom` 不是「又一个色相」，而是两种**非色相语义**（见下），所以 §3 的调色板模型必须把它们区分对待。

**调色板最终形态（10 档，与 crd 的下拉 1:1）**
`neutral, slate, red, orange, yellow, green, blue, violet, rose, custom`

| id | 语义 | 落点 |
|---|---|---|
| `neutral` | **重置态**。不覆盖，回落到 shadcn 基础 accent | 显式 delta 块，写入基础值（`oklch(0.205 0 0)` 等）。crd 侧**没有** `[data-theme="neutral"]` 规则，cha-set 把它物化成显式块，使生成产物自描述而非依赖 fallthrough |
| 8 个色相 | 静态色相档 | 原有 delta 块，保持不变 |
| `custom` | **派生态**。由用户一个 hex 在运行时推出整条 ramp | delta 块内全部写 `var(--chaset-custom-accent[,…])` 并**带 fallback**——它是指向宿主派生结果的插槽，不是字面量 |

**产出（均已落地）**
1. `spec/tokens/themes/axes.json` — `accentTheme` 8 → **10** 档，顺序与 crd 下拉一致。
2. `spec/tokens/themes/deltas.json` — 30 → **34** 块（20 accent + 12 tint + 2 interface-style），新增 `neutral`/`custom` 各 light+dark 共 4 块。
   - `custom` 块的每个 `var()` 都带 fallback（如 `var(--chaset-custom-accent, oklch(0.5 0 0))`），宿主尚未注入派生 ramp 时也能出可读的灰阶而不是无效值。
3. `spec/validate-tokens.mjs` — `accentTheme` 断言从「长度 = 8」改为**逐位精确等于 10 档常量**（顺序也锁死，防漂移）；deltas/overrides 数量断言 30 → 34。
4. `spec/__tests__/palette-parity.test.mjs`（新增，24 个测试）— 断言三方一致（token 轴 / 边界声明 / schema 枚举）、每档都有 light+dark 块、每块都有 `primary`、`neutral` 落到 shadcn 基础值、`custom` 全为 `var()` 且都带 fallback、调色板**不渗入**冻结的 33 字段 Qt 颜色契约。
5. `spec/__tests__/roundtrip.test.mjs` — 修正硬编码的 `30` 为从声明推导（否则每加一档就要改测试，是脆弱点）。
6. `pnpm gen:all` 重跑：`packages/react/src/styles/tokens.css` +30 行（4 个新选择器），`dist/consumers/dunting/generated/theme_tokens.generated.h` **无变化**——印证调色板轴不污染 Qt 侧冻结契约。

**验收标准**
- `pnpm gate` 全绿（typography 契约 68 值不变）。[PASSED]
- `spec/__tests__/palette-parity.test.mjs` 通过。[PASSED]（24/24；整个 spec 套件 80/80）
- `spec/validate-tokens.mjs` 通过。[PASSED]（`34 theme overrides`）

**阶段 1 宿主收敛结果**
- dt 侧已把 `accentMode: default|custom` + 单个 `accentHex` 彻底收敛为 10 档 palette + `customHex`（在阶段 2 完成，见下）。
- 10 档色已在 dt 深底与 light/dark 双端实装并通过 `check-derived-parity.mjs` 与 C++ 单元测试全量验证。

---

### 阶段 2 — 控件实现与 dt 接入（cha-set 内 + dt） [DONE] 已完成

**目标**：做出双端对等的控件，并在 dt 落地。

**产出（均已落地）**
1. Qt：`qt/src/ChaSetThemeSettings.qml` + `ThemeSettingsDocPage.qml`，注册进 `qt/CMakeLists.txt`（`ChaSet` 与 `QtChaSetDemo`）。
2. React：`packages/react/src/theme-settings/ThemeSettings.tsx` + `ThemeSettingsDocPage.tsx`，注册进 `spec/showcase/navigation.json` 与 `packages/react/examples/basic/src/App.tsx`。
3. 严格遵循 Red Line 4 演示自举与 dogfooding：使用 `ChaSetSettingRow`、`ChaSetSegmentedControl`、`ChaSetColorPicker`、`ChaSetSlider`、`ChaSetButton`、`ChaSetCopyButton`。
4. `ThemeTunerPage.qml` 的能力与新控件融合，展示页完整对齐 SPAS 2.0 五大 TOC 标准锚点与快捷键。
5. **dt `ThemeManager` 扩展（`dunting-qt-a` 提交 `93b93e0f`）**：
   - `accentMode` 扩展为 `paletteId`（10 档，`neutral` 为默认）；
   - 新增 `decorationStyleId`（simple/expressive）、`decorationLevel`（0-100）、`decorationOverrides`（radius/shadow/motion）；
   - 新增 `applyThemeConfig()` / `themeConfig()`；
   - `settings.json` 自动迁移旧键（`accentMode:"default"` → `paletteId:"neutral"`），完整保持 merge 幂等性；
   - 单元测试 `tests/window/theme_manager_test.cpp` 扩充 5 个完整测试用例（含旧值迁移、Round-trip、合法性校验、独立键保护），全绿。
6. `DesignSystemPage.qml` 嵌入 `ChaSetThemeSettings`，替换原有散装设置；独有项 `tabWidth*` 与 `smoothScroll*` 移至控件外部独立分区。
7. CI / 构建：本地使用 `-DCHASET_DEV_LOCAL=ON` 零延迟同级联动，构建及 QTest 全部通过。

**验收标准**
- `pnpm gate` 全绿（涵盖 47+ 组件 SPAS 契约、Click 交互测试、Qt headless `--test-scenario all`）。[PASSED]
- 手工交互验证：模式切换、10 档调色板逐档切换、装饰程度拖动、重置、导出/导入 JSON 往返一致。[PASSED]
- 单元测试全绿（C++ Catch2 / QTest 套件全部通过）。[PASSED]

---

### 阶段 3 — 接入 chahu-render-debugger [DONE] 已完成

**目标**：crd 外观页面用控件替换已纳入 schema 的 section；独有项保持原生。

**产出（均已落地，`chahu-render-debugger-a` 提交 `458abc76`）**
1. `launcher/src/pages/外观页面/index.tsx` 嵌入 `<ThemeSettings />`，替换原先散落的 `主题颜色区.tsx` / `界面风格区.tsx` / `装饰设置区.tsx`。
2. **D2**：`auto → system` 全局改名（Tauri 后端 `外观.rs` 默认值、前端 `主题.ts`、`主题偏好` 类型、`常量.ts`、循环切换按钮均已对齐）。
3. **D3**：`自定义主题强调色` 默认值统一收敛为 `#30a0ff`（跨 Rust 后端与 TS 前端）。
4. **D11**：`materialTransparency` 移出控件，在 `窗口材质选择器.tsx` 中作为独立宿主滑块渲染；`radius/shadow/motion` 移交 `<ThemeSettings>`。
5. **保持独有**：`窗口材质选择器.tsx`、`背景图像设置.tsx`、`界面基色选择器.tsx`、`界面缩放设置区.tsx` 保持原生分区。
6. `launcher/src/lib/主题.ts` 与 `launcher/src/store/主题状态.ts` 全面接入 `@chahu/cha-set` 规范配置（`ThemeConfig`），提供从存量格式到规范格式的双向无损转换与自动迁移；新增专门测试套件 `launcher/src/lib/主题.test.ts`（5/5 用例通过）。

**验收标准**
- `pnpm typecheck` 通过（exit 0）。[PASSED]
- `pnpm exec vitest run`（21 个测试文件，115 个用例全部通过）。[PASSED]
- `pnpm build` 生产构建通过（exit 0）。[PASSED]
- 独有项隔离回归验证：修改窗口材质或背景图不影响 ThemeSettings 内部状态，反之亦然。[PASSED]
- 存量配置迁移验证：`auto` 自动映射为 `system`，`neutral` 映射为默认色，无损平滑。[PASSED]

---

### 阶段 4 — 清理旧主题代码 [DONE] 已完成

**目标**：移除已被接管的手写实现，SSOT 收敛。

**产出（均已落地）**
1. crd（`chahu-render-debugger-a` 提交 `f24d0e87`）：
   - 更新 `launcher/src/css/generated/tokens.generated.css`（从 cha-set 同步最新包含 10 档调色板及 rem 转换后的 tokens）；
   - 在 `launcher/src/index.css` 引入 `./css/generated/tokens.generated.css`；
   - 移除 `launcher/src/css/shadcn-base.css` 内手写的冗余 `:root` 与 `.dark` 变量声明（行 104-179）；
   - 完全移除已废弃的 `launcher/src/css/themes.css`（其界面风格与 10 档色板全部由 generated tokens 提供）；
   - Vitest 21 个文件 115 个测试全部通过，生产环境 `pnpm build` 顺利打包。
2. dt：`theme_manager.cpp` 的 `kDark` 与 `kLight` 直接由 `cha_set_gen::kDark` 和 `cha_set_gen::kLight` 初始化；零手工维护色值；`theme_manager.h` 注释明确指向 cha-set。
3. 清理已废弃的多余辅助函数与临时中间结构。
4. 文档与架构规约：
   - `AGENTS.md` 新增 Golden Red Line 14《Mandatory Unified Theme Configuration Contract》，确立唯一入口与独有项零泄漏红线；
   - `docs/architecture/README.md` 索引登记 `chaset-theme-control.md` 作为权威架构规范；
   - `spec/tokens/meta.json` 的 `sources` 引用更新完毕。
5. 机械门禁：
   - `scripts/check-theme-boundary.mjs` 扩充 B8 检查（静态扫描双端 ThemeSettings 组件源码及各宿主外观页，严防独有字段倒灌），自检与实测全绿。

**验收标准**
- `pnpm check:theme-boundary` 全绿（5 covered axes, 9 excluded axes, 10 palette ids, 4 component/consumer sources verified）。[PASSED]
- 两项目行为级零回归，类型检查与全量单测全绿。[PASSED]
- `spec/tokens/meta.json` 同步更新完毕。[PASSED]

---

## 5. 视觉统一保障（两项目 UI 不一致的前提下）

先说清一点：**「视觉统一」不是「长得一样」**。dt 是桌面原生 Qt 应用（窗口材质、画布网格、字体渲染都不同），crd 是 Tauri + Web。强行同貌既不现实也无意义。
真正要保证的是：**同一份配置生效后，两者语义角色映射一致、派生规则一致、可被机械验证**。四道防线按强度递增。

### 5.1 第一道：语义 token 映射对齐（已有基础）

`spec/tokens/meta.json` 已写下映射关系：`dunting.panel → card (+muted base)`、`dunting.subduedText → muted-foreground`、`dunting.focus → ring`、`dunting.onAccent → primary-foreground`。
**动作**：阶段 0 把这张映射表从"说明文本"提升为**受校验产物**，让「dt 的 `panel` 与 crd 的 `--card` 指向同一 token」成为可断言事实。

### 5.2 第二道：控件层单一实现（本方案主要贡献）

两侧 UI 细节不一致的最大来源，是**主题设置界面本身各写一套**——同样是"选强调色"，dt 与 crd 交互与视觉都不同；同样是"模式切换"，两边也不一样。
**动作**：控件成为**唯一实现**，两侧都只是宿主。这一条直接消灭「设置界面长得不一样」，同时消灭 D2 的枚举命名分歧（收敛到控件内）。

### 5.3 第三道：派生契约测试（对付 R2，最硬的一道）

派生 token 无法静态生成（C2），但可以**把两条公式锁在一起**：
- `scripts/check-derived-parity.mjs`：以 10 档调色板 × light/dark = 20 组输入色，分别算 Qt 路径与 Web 路径，断言 ΔE(CIEDE2000) **≤ 2.0**。
- 同时覆盖 `radiusCard/Panel/Control` 与 `motionFast/Normal` 的插值公式（§3.4）。
- 挂 `pnpm gate`。

这是**唯一能防止「改了一边、另一边悄悄漂移」**的机制。

### 5.4 第四道：跨端视觉基线（几何 + 语义双断言）

对**控件自身**（不是整应用）做确定性渲染截图（固定 DPR、固定字体、`uiScale=1`），两侧比对：
- **整体差异率**只作粗布局守卫（经验值 `maxDiff ≈ 4.0`）；
- **几何行距断言**用 `pitchTolerance`（自相关 lag）—— 因为已知「整体差异率抓不住文字行高漂移」（小字号 + `includeAA:false` 时，行高 16.8→14px 只让差异率从 2.61% 走到 3.08%）。
- 文本密集区域（设置项名称/描述）必须走几何断言，不能只看差异率。

### 5.5 明确不追求统一的（写进文档，避免反复讨论）

- 窗口装饰：dt 用自绘窗口 + `chrome*` token；crd 用系统 Mica/Acrylic → 各自保留（§3.3）。
- 字体实际渲染：dt 单一族名（C7），crd 族列表 → 只统一**逻辑族名**，不追求像素同字。
- 图标体系：dt `AppIcon.qml`，crd 各式 SVG → 不纳入本方案。

---

## 6. 总结与建议

1. **最大发现**：数据层统一已完成大半（dt 已 include 生成头文件、crd 已用生成 CSS），因此**不要**再建新 token 抽象，直接做控件层。
2. **处理冲突的方式是收敛，不是适配**：冲突项以 crd 模型为准（它更完整），dt 相应扩展。只有 5 项判为真正独有（crd 3 + dt 2），全部经得起"另一端不可能需要"的检验。
3. **工作量分布**：本方案主要改造量在 **dt 一侧**（补 9 档调色板 + 装饰程度 + 风格档位），不是 crd。crd 的基本是界面替换。
4. **最需要设计判断的一步**：阶段 1 为 dt 重定 9 档调色板的 dark/light 值（R4）。这是唯一无法机械执行的工作，也是质量风险最高处——建议先出定值表人工审校再进控件。
5. **最容易被忽略的工程点**：dt 的 `25-chaset.cmake` 默认 pin 远端固定 commit（C4），落地期务必 `CHASET_DEV_LOCAL=ON`。
6. **落地顺序不可颠倒**：阶段 0（边界）→ 1（数据收敛）→ 2（控件 + 先接 dt）→ 3（接 crd）→ 4（清理）。
   先接 dt 是因为它配置项少、`settings.json` merge 语义成熟，是最小可行验证；crd 配置项多、多窗口同步复杂，放后面吸收经验。
