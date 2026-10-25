---
id: tabs
component: tabs
category: Surfaces & Layout
title: Tabs
description: 一组层叠内容区（称为选项卡面板），一次显示其中之一。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| ← / → | 水平方向切换当前激活标签 |
| ↑ / ↓ | 垂直方向切换当前激活标签 |
| Home / End | 直接跳转至首个 / 末尾标签 |
| Space / Enter | 手动激活模式下激活所选标签 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `defaultValue` | `string` | `undefined` | 初始渲染时应激活的选项卡值（非受控）。 |
| `value` | `string` | `undefined` | 当前激活选项卡的受控值。 |
| `onValueChange` | `(value: string) => void` | `undefined` | 激活选项卡变化时调用的事件处理函数。 |
| `variant` | `'default' \| 'line'` | `'default'` | 视觉呈现样式：胶囊容器（default）或下划线选项卡栏（line）。 |
| `size` | `'default' \| 'sm'` | `'default'` | 选项卡触发器与容器的尺寸规格。 |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | 选项卡的方向（控制键盘导航轴）。 |
| `disabled` | `boolean` | `false` | 在 TabsTrigger 上为 true 时阻止该选项卡的交互。 |
| `badge` | `ReactNode \| string` | `undefined` | 在触发器内渲染的可选计数徽章或文本标签。 |
| `icon` | `ReactNode` | `undefined` | 在触发器内渲染的可选前置图标元素。 |
```
