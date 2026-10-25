---
id: elided-text
component: elided-text
category: Base Primitives
title: Elided Text
description: 智能文本省略截断，具备自动溢出检测、点击复制以及悬浮气泡提示功能。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Hover / Focus | 若文本发生省略，则在气泡提示中显示完整未截断文本 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `text` | `string` | `''` | 待显示并检测溢出的字符串内容。 |
| `tooltipText` | `string` | `''` | 与原文不同时的自定义提示文本覆盖。 |
| `tooltipPlacement` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'auto'` | `'top'` | 浮动工具提示的显示方位。 |
| `tooltipDelay` | `number` | `400` | 悬停后显示提示的延迟时长（毫秒）。 |
| `alwaysShowTooltip` | `boolean` | `false` | 悬停时强制显示提示，即使文本未被省略。 |
| `showTooltipWhenElided` | `boolean` | `true` | 检测到溢出截断时允许提示显现。 |
| `maxLines` | `number` | `1` | 截断前允许显示的最大可见行数（1 为单行截断，>1 为多行文本截断）。 |
| `copyable` | `boolean` | `false` | 点击文本是否复制到剪贴板并即时反馈。 |
```
