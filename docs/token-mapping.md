# Token 映射与刷新指南

> 单一事实源：`spec/tokens.json`。本文回答三件事：结构是什么、两个产品如何映射、
> 改一个值后如何流到两端。

## 1. 三层架构（launcher 思路为骨架）

```
Tier 0 primitives   尺度刻度：space(0..6=0/2/4/8/12/16/24px)、motion(90/120/180ms)、
                    size(21 个控件尺寸)、fontWeight —— 与主题无关的常数。
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
                    + overrides[]（选择器逐字来自源 css，级联顺序已固化在生成器）。
qt                  dunting 扁平表：colors{33 字段×dark/light}+ space/motion/size，
                    字段名与 ThemeManager::Tokens 一一对应。
```

## 2. 生成物与消费方

| 产物 | 生成器 | 落点（cha-set） | 消费方 |
|---|---|---|---|
| 库风味 CSS | generate-css.mjs | packages/react/src/styles/tokens.css（`--cs-*`） | @chahu/cha-set（Button 等） |
| 兼容风味 CSS | 同上 | dist/consumers/launcher/generated/tokens.generated.css | crd-a/launcher/src/css/generated/（替换原 shadcn-base/app-variables/window-tint/themes 四文件变量块） |
| Qt C++ 头 | generate-qt.mjs | dist/consumers/dunting/generated/theme_tokens.generated.h | dt-a/theme/generated/（ThemeManager::Tokens 取值源） |

## 3. dunting → unified 语义映射

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

## 4. 刷新流程（改值 → 两端生效）

```bash
# 1) 只改 spec/tokens.json（唯一手工编辑点）
# 2) 重新生成
pnpm gen:all            # = generate-css.mjs + generate-qt.mjs
# 3) 同步到同级检出（存在才拷贝；缺失自动跳过）
node scripts/sync-consumers.mjs
# 4) 各消费仓审查并提交：
#    crd-a  → launcher/src/css/generated/tokens.generated.css
#    dt-a   → theme/generated/theme_tokens.generated.h
#             ⚠ ninja 依赖跟踪怪癖：刷新头文件后须 touch theme/theme_manager.cpp
#               再构建，否则不会重编（见 t5 排障记录）。
# 5) cha-set 本仓提交 regenerated tokens.css（CI 有 git diff --exit-code 防漂移）。
```

防漂移分工：CSS 由本仓 CI `git diff --exit-code` 把关；Qt 头由 dt-a 侧
`DuntingThemeTokensGoldenTests` 黄金测试把关（期望值独立硬编码，头文件任何漂移即红）。

## 5. 已知语义陷阱（转录时踩过）

- Qt `QColor(QString)` 9 位十六进制是 **#AARRGGBB**：源码 `infoBar "#99000000"` =
  α0x99 黑色；`canvasMarquee "#3366aaff"` 同理 α0x33。spec.qt.rgbf 以浮点数组保存
  真值，生成器发 `QColor::fromRgbF(...)` 保证 16 位存储位精确等值。
- launcher 兼容风味的变量名 = semantic 键去命名空间前缀（interaction.hover→--hover）。
- `--app-status-*` 保留原名归入 composite 层（消费方按名引用）。

## 6. 债务附录（未清理，仅记录）

dt-a qml/ 内 ~300 处 `? theme.X : "#hex"` 回退色值（308 hex + 48 rgba，19 文件），
且部分回退值已与 kDark 漂移（如 InspectorPanel `#1c2330` vs 真 panel `#161b26`）。
分类与 Top10 名单见 `.omo/drafts/chaset-ui-unify.md`「迁移债」小节；建议后续以
DuntingButton 的守卫模式统一收敛为单一 guarded-token 单例。
