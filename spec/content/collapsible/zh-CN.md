---
id: collapsible
component: collapsible
category: Surfaces & Layout
title: Collapsible
description: 可展开与折叠内容面板的交互式组件。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Space / Enter | 切换折叠面板的展开或收起状态 |
| Tab | 在触发器与嵌套控件之间周转焦点 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | 折叠面板的受控展开状态。 |
| `defaultOpen` | `boolean` | `false` | 非受控用法下的初始展开状态。 |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | 展开状态变化时触发的回调。 |
| `variant` | `'default' \| 'card' \| 'ghost'` | `'default'` | 视觉容器样式变体。 |
| `disabled` | `boolean` | `false` | 是否禁用用户交互。 |
| `className` | `string` | `''` | 额外的自定义 CSS 类。 |
```
