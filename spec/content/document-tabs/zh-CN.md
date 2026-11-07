---
id: document-tabs
component: document-tabs
category: Desktop & Virtualization
title: Document Tabs
description: 桌面端工作区多文档标签栏容器，支持平滑横向滚动、内容自适应/等宽排版模式、关闭操作与无边框标题栏无缝融合。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Ctrl + W / Cmd + W | 关闭当前激活的文档标签页 |
| Ctrl + Tab | 切换至下一个文档标签页 |
| Ctrl + Shift + Tab | 切换至上一个文档标签页 |
| 鼠标中键点击 | 直接关闭所点击的标签页 |
| 鼠标右键点击 | 呼出标签上下文操作菜单 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `useShellChrome` | `boolean` | `false` | 是否启用无边框原生标题栏融合模式。 |
| `tabWidthMode` | `'content' \| 'fixed'` | `'content'` | 标签宽度排版模式：内容自适应 (VS Code 风格) 或固定等宽 (Chrome 风格)。 |
| `selected` | `boolean` | `false` | 当前标签项是否处于激活选中状态。 |
| `canClose` | `boolean` | `true` | 标签是否可关闭；为 false 时呈现固定标签 (Pinned Tab)。 |
| `tabMinWidth` | `number` | `56` | 标签最小宽度下限约束。 |
| `tabMaxWidth` | `number` | `240` | 标签最大宽度上限约束，超出时智能省略截断。 |
| `onClose` | `() => void` | `undefined` | 点击关闭按钮时触发的回调。 |
| `onMiddleClick` | `() => void` | `undefined` | 鼠标中键点击标签时触发的回调。 |
```
