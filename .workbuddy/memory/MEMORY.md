# cha-set 项目长期记忆（跨会话）

## 仓库与 Git 布局
- 主仓库 `D:/pengj/cha-set`（分支 `main`）；另一工作树 `D:/pengj/cha-set-a`（分支 `a`）。
- WorkBuddy 工作树：`C:/Users/Development/WorkBuddy/Worktrees/cha-set/main-f97eb8f8`，
  分支 `workbuddy/main-f97eb8f8`。远端 `origin = ChahuProject/cha-set`。
- 提交规范：Conventional Commits，**标题必须英文**（commitlint 有 lefthook 钩子）；
  无 scope-enum 白名单。拆分提交（代码 / 文档分开）。
- **本机 git 写操作必须 `dangerouslyDisableSandbox: true`**，否则沙箱内静默虚拟化（返回 0 但不落盘）。

## Qt 构建（本机唯一可用配方）
QML 全部编译进二进制，**改 `qt/src/*.qml` 必须重建**才生效。
用 PowerShell 工具执行（Bash 里 `cmd.exe /c` 被宿主安全策略拒绝）：
```
Import-Module 'C:\Program Files\Microsoft Visual Studio\18\Community\Common7\Tools\Microsoft.VisualStudio.DevShell.dll'
Enter-VsDevShell -VsInstallPath 'C:\Program Files\Microsoft Visual Studio\18\Community' -SkipAutomaticLocation -DevCmdArguments '-arch=x64 -host_arch=x64'
$env:PATH = 'D:\pengj\qt\6.10.1\msvc2022_64\bin;' + $env:PATH
cmake -S qt -B qt/build -G Ninja -DCMAKE_PREFIX_PATH='D:\pengj\qt\6.10.1\msvc2022_64' -DCMAKE_C_COMPILER=cl -DCMAKE_CXX_COMPILER=cl *> $env:TEMP\chaset-qt-build.log
cmake --build qt/build *>> $env:TEMP\chaset-qt-build.log
```
不加载 DevShell（或不显式指定 `cl`）→ CMake 误选 MinGW gcc 去链 MSVC 版 Qt，链接期炸。
PowerShell 的 stdout 捕获不可靠 → **必须重定向到日志文件再读**。
单个 QML 增量重建约 10–20s。

## 门禁（`pnpm gate` / `pnpm gate:pixel`）
- `pnpm gate` 步骤：能力覆盖 → 49 双端演示文档 → SPAS 展示对齐 → **Cross-Stack Typography Contract（68 值）**
  → `QtChaSetDemo.exe --test-scenario all` → React 展示页测试 → cursor conformance。
- **已知红点：Pointer Raycasting 在本机就失败**（12–14 处 `got window cursor 0`，页面 color-picker/
  theme-tuner/splitter-handle/sidebar），且运行间波动（776/777 控件）→ 环境相关。
  它在第 3 步 `process.exit(1)`，**导致第 4/5 步不执行**，需手工补跑
  `vitest run src/__tests__/showcase-{parity,pages,sidebar}.test.tsx src/__tests__/cursor-conformance.test.tsx`。
  怀疑自己引入回归前，先用 `git show HEAD:qt/src/Main.qml > qt/src/Main.qml` 重建做 A/B，
  并用 `sed 's/_QMLTYPE_[0-9]*//; s/_QML_[0-9]*//g'` 归一化（实例编号随类型注册表变动，是噪声）。
- `QT_QPA_PLATFORM` 本机**未设置**。

## 排版系统（Single Source of Truth）
`spec/tokens/primitives.json:primitives.typography` → `spec/build-tokens.mjs` → `tokens.css`（Web，px→rem）
+ `qt/src/Typography.generated.qml`（Qt 单例，`lineHeightPx()`/`trackingPx()` 是唯一换算入口）。
契约检查 `scripts/check-typography-parity.mjs`（挂 `pnpm gate`），豁免写 `scripts/typography-allowlist.json`。
文档 `docs/architecture/typography-system.md`。
**Qt 字体族只认单一族名**，逗号列表不解析（实际回落到默认字体）。

## 像素同步（`pnpm test:pixel --component <name>`）
- **`pixelmatch` 的整体差异率抓不住文字行高漂移**：`includeAA:false` + 小字号（边缘像素占多数）
  → 行高 16.8→14px 只让差异率从 2.61% 走到 3.08%。
- 文本密集组件（`code-block`）改用**几何行距断言** `pitchTolerance`：截图每行墨水量剖面的自相关 lag，
  对齐时 `17/17px ok`，漂移时 `17/14px DRIFT`。`maxDiff: 4.0` 仅作粗布局守卫。
- 捕获竞态：冷启动首帧不能固定 sleep，要轮询 `document.readyState + location.search`（否则 97% 假差异）。
