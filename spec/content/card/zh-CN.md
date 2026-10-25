---
id: card
component: card
category: Surfaces & Layout
title: Card
description: 展示包含页眉、标题、描述、正文与底部操作区的卡片容器。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Tab / Shift + Tab | 在卡片内的交互控件间遍历切换 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'secondary' \| 'outline'` | `'default'` | 卡片容器的视觉呈现样式。 |
| `size` | `'default' \| 'sm'` | `'default'` | 卡片与复合容器的密度及内边距规格。 |
| `interactive` | `boolean` | `false` | 卡片是否提供悬停／激活态层级阴影与指针光标反馈。 |
| `className` | `string` | `''` | 应用于容器的额外 CSS 类名。 |
| `children` | `React.ReactNode` | `—` | 卡片复合子组件或自定义元素。 |
```
