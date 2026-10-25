---
id: segmented-control
component: segmented-control
category: Forms & Inputs
title: Segmented Control
description: 面向工具栏、菜单与视图切换的紧凑胶囊分段开关。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| ← / → | 在相邻分段项之间导航 |
| Home / End | 跳转至首个／末尾分段项 |
| Space / Enter | 选中并激活当前聚焦的分段项 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `options` | `SegmentedControlOption[]` | — | 选项对象数组（{ label、value、icon?、badge?、disabled?、tooltip? }）。 |
| `value` | `string \| number` | — | 受控激活值。 |
| `defaultValue` | `string \| number` | — | 非受控模式下的初始值。 |
| `onValueChange` | `(value: string \| number) => void` | — | 选中新分段时触发的回调。 |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | 物理尺寸变体（‘sm’、‘default’、‘lg’）。 |
| `title` | `string` | — | 显示于分段之前的可选前缀标签。 |
| `disabled` | `boolean` | `false` | 是否禁用整个分段控制器。 |
| `fullWidth` | `boolean` | `false` | 分段是否等分扩展以填满父容器。 |
| `equalWidth` | `boolean` | `false` | 所有分段是否在贴合内容的同时共享相同的固定宽度。 |
| `itemWidth` | `number` | — | 为每个分段选项分配的显式固定宽度。 |
| `tooltipSide` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 选项工具提示的默认显示方位。 |
| `tooltipDelayDuration` | `number` | `200` | 悬停后显示选项工具提示的默认延迟时长（毫秒）。 |
| `renderTooltip` | `(option: SegmentedControlOption) => React.ReactNode` | — | 选项工具提示的自定义渲染函数，支持完全自定义。 |
```
