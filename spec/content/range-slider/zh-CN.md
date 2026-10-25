---
id: range-slider
component: range-slider
category: Forms & Inputs
title: Range Slider
description: 支持最小-最大区间选择的双拇指滑块，具备碰撞防交叉保护。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Tab | 在低位与高位范围滑块手柄之间切换焦点 |
| ← / ↓ | 按步长减少当前手柄数值 |
| → / ↑ | 按步长增加当前手柄数值 |
| Home / End | 将活动手柄吸附至最小／最大边界 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value` | `[number, number]` | `[0, 100]` | 当前 [min, max] 区间值。 |
| `onValueChange` | `(val: [number, number]) => void` | `undefined` | 滑块移动时触发的回调。 |
| `onChange` | `(val: [number, number]) => void` | `undefined` | onValueChange 的别名。 |
| `size` | `"default" \| "sm"` | `"default"` | 密度与尺寸变体。 |
| `showTooltip` | `boolean` | `false` | 悬停、拖拽与聚焦时显示数值提示气泡。 |
| `readOnly` | `boolean` | `false` | 阻止用户交互但保持对比度。 |
| `disabled` | `boolean` | `false` | 禁用滑块交互并降低不透明度。 |
| `min` | `number` | `0` | 允许的最小值。 |
| `max` | `number` | `100` | 允许的最大值。 |
| `step` | `number` | `1` | 步进增量。 |
| `minStepsBetweenThumbs` | `number` | `0` | 两滑块之间的最小间隔。 |
```
