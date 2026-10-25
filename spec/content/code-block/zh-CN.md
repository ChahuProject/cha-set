---
id: code-block
component: code-block
category: Composite Engines
title: Code Block
description: 规范驱动的代码语法高亮查看器，基于统一零依赖词法分析器与滚动、复制、标签组件构建，双端色彩与分词完全一致。
---

## 动效规范 {#animations}

交互状态的动效行为与时间节奏，严格遵循 ChaSet 令牌体系。

- 状态切换（悬停、按下、聚焦）在 `duration-quick` 时长内以 `ease-standard` 缓动曲线过渡。
- 动效时长与缓动直接解析自主题令牌，启用减弱动效偏好（`prefers-reduced-motion`）时将自动置零；Qt 端由 `ThemeTokens.animationsEnabled` 集中管控该开关。

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Tab / Shift + Tab | 在文件选项卡与顶部复制按钮之间周转遍历 |
| ← / → | 在多文件代码块中切换当前活动文件选项卡 |
| Space / Enter | 复制当前活动文件的源码至系统剪贴板 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `code` | `string` | `''` | 源码文本；提供 `files` 时将被忽略。 |
| `language` | `string` | `'tsx'` | 由共享词法器解析的语言标识或别名。 |
| `filename` | `string` | `undefined` | 顶部标题覆盖；默认为解析后的语言标签。 |
| `files` | `CodeBlockFileProps[]` | `undefined` | 多文件选项卡组；存在时替换单文件正文。 |
| `highlight` | `boolean` | `true` | 启用规范驱动的语法高亮。 |
| `showLineNumbers` | `boolean` | `false` | 渲染行号指示槽。 |
| `showLanguage` | `boolean` | `true` | 在顶部渲染语言／文件名标签。 |
| `showCopy` | `boolean` | `true` | 在顶部渲染内置复制按钮。 |
| `wrap` | `boolean` | `false` | 长行自动换行而非水平滚动。 |
| `maxHeight` | `number \| string` | `undefined` | 限制内容高度（rem 等效数值，或任意 CSS 长度字符串）。 |
| `embedded` | `boolean` | `false` | 去除卡片边框（边框／背景／顶部栏）以便行内嵌入。 |
| `copyLabel` | `string` | `undefined` | 复制按钮的无障碍标签。 |
| `className` | `string` | `undefined` | 外部容器的额外类名。 |
```
