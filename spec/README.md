# spec: Token 源与聚合说明

> SoT 为 `tokens/**` 分片 + `qt-mapping.json`，`tokens.json` 为提交快照（生成物）。

## 分片一览

```
spec/
  tokens.json                 # 已提交快照（生成物，不要手改）
  qt-mapping.json             # qt 派生映射：33 colors + space 7 + motion 3 + size 21
  load-tokens.mjs             # 单一读取入口，分片优先、快照兜底
  build-tokens.mjs            # 聚合器：分片 → 快照（规范键序 + sha256）
  token-helpers.mjs           # 共享纯函数：HEX8/OKLCH_RE/HEX、hexToRgbf、fmtChannel、selectorFor、stringifySorted/ORDER
  validate-tokens.mjs         # 校验器：oklch/color-mix/hex、axes、deltas 30、禁止 selector/qt 分片
  tokens/
    meta.json                 # meta: schemaVersion/sources/conventions
    primitives.json           # primitives: space(7)/motion(3)/size(21)/fontWeight(2)
    semantic/
      core.json               # 核心 shadcn 兼容 token 约 22 个
      launcher.json           # launcher 专有：sidebar*、chart-1..5
      dunting.json            # dunting 命名空间：chrome.*/canvas.*/overlay.*/accent.*
    composite/
      launcher.json           # 40 个 app-* 复合表面，$platform ["css"]
    themes/
      axes.json               # 四轴枚举：mode(2) accentTheme(8) windowTint(6) interfaceStyle(2)
      deltas.json             # 30 条差量（16 accent + 12 tint + 2 interfaceStyle），无 selector
```

键序由 `token-helpers.mjs:ORDER` + `stringifySorted` 固定；分片间顶层键不重叠；`qt` 与 `selector` 均为派生，不存分片。

## 常用命令

```bash
# 聚合快照（分片 → spec/tokens.json）
node spec/build-tokens.mjs
pnpm gen:tokens

# 校验分片与快照一致（CI 同款门，sha256 规范化后比对）
node spec/build-tokens.mjs --check

# 校验结构（默认读分片，含 qt/selector 派生）
node spec/validate-tokens.mjs

# 生成全部产物
pnpm gen:all            # = gen:css + gen:qt
pnpm gen:css            # → packages/react/src/styles/tokens.css + dist/consumers/launcher/generated/tokens.generated.css
pnpm gen:qt             # → dist/consumers/dunting/generated/theme_tokens.generated.h + qt/src/ThemeTokens.generated.qml

# 刷新完整流程（改分片后）
pnpm gen:tokens && pnpm gen:all
git diff --exit-code -- spec/tokens.json packages/react/src/styles/tokens.css qt/src/ThemeTokens.generated.qml dist/consumers/
node scripts/sync-consumers.mjs  # 同步到同级 crd-a/dt-a 检出（若存在）

# 紧急旁路：忽略分片，直接用已提交快照
CHA_TOKENS_FROM=snapshot node spec/validate-tokens.mjs
CHA_TOKENS_FROM=snapshot pnpm gen:all
```

## 校验与门禁

- `node spec/validate-tokens.mjs` 绿：`validateSpec` + `validateShards` 双路径。
- `node spec/build-tokens.mjs --check` 绿：分片聚合 sha256 与已提交 `spec/tokens.json` 一致。
- `pnpm gate` 绿：`gate/parity.mjs` 对 `spec/capabilities.json` 校验。
- CI 额外 `git diff --exit-code -- spec/tokens.json packages/react/src/styles/tokens.css qt/src/ThemeTokens.generated.qml dist/consumers/` 防漂移。

## 环境开关

- `CHA_TOKENS_FROM=snapshot`：强制 `load-tokens.mjs` 读 `spec/tokens.json` 快照而非分片，用于分片损坏或热修复旁路。
- 默认 `CHA_TOKENS_FROM=split`（分片优先，快照兜底）：`spec/tokens/**` 存在则读分片并派生 `qt`/`selector`，否则回退快照。

## 回滚

整套重构为值不变、路径不变的纯结构改动，单次 revert 即可回退见 `docs/token-mapping.md` §8。

```
git revert --no-commit HEAD~6..HEAD && git commit -m "revert: 回退 cha-token-refactor"
```

## 参考

- 映射与刷新详见 `docs/token-mapping.md`（文件拆分表、聚合图、33 行 qt 表、selectorFor 规则）。
- 设计取舍：W3C DTCG 分组思想 + vanilla Node 聚合（见 `docs/token-mapping.md` §9），拒绝 Style Dictionary 以保字节一致。
