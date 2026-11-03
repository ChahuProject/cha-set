---
id: log-console
component: log-console
category: Composite Engines
title: Log Console
description: 虚拟化高性能终端日志输出控制台，支持 ANSI 彩色解析、贴底自动滚动与纯文本一键复制。
---

## 动效规范 {#animations}

日志控制台滚动与流式渲染动效规范。

- 随着实时日志持续输出，滚动容器在贴底状态下保持帧率同步平滑跟随，无掉帧与布局重排跳变。
- 用户向上划动时立即脱离贴底状态，停止自动滚动；滚动到底部时自动恢复贴底粘附。
- 动效平滑度与节流控制严格遵循 ChaSet 令牌体系，Qt 端由 `ThemeTokens.animationsEnabled` 管控。

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作。

```table shortcuts
| 按键 | 交互行为 |
| --- | --- |
| Tab / Shift+Tab | 在日志控制台容器、行号计数角标与复制按钮之间移动焦点 |
| Space / Enter | 激活复制按钮将全部日志纯文本写入系统剪贴板 |
| PageUp / PageDown | 在日志流中快速向上或向下翻页浏览 |
| Home / End | 快速跳转至日志首行或跳至日志尾部并恢复贴底自动滚动 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `lines` | `string[]` | `[]` | 日志行字符串数组，支持嵌入 ANSI 颜色控制字符。 |
| `emptyText` | `string` | `'No logs'` | 日志数组为空时居中呈现的提示文案。 |
| `showCopy` | `boolean` | `true` | 是否在右上角展示一键复制按钮。 |
| `showLineCount` | `boolean` | `true` | 是否在右上角展示当前日志总行数角标。 |
| `autoScroll` | `boolean` | `true` | 是否在处于贴底状态时随新日志追加自动滚动到底部。 |
| `copyTitle` | `string` | `'Copy all logs'` | 复制按钮的文字提示（Tooltip）文案。 |
| `className` | `string` | `undefined` | 附加到根容器的自定义 CSS 类名（仅限 React）。 |
```
