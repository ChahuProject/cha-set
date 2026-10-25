---
id: slider
component: slider
category: Forms & Inputs
title: Slider
description: 允许用户沿滑动轨道选取数值的交互控件。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| ← / ↓ | 将数值减小一个步进 |
| → / ↑ | 将数值增大一个步进 |
| PageDown / PageUp | 将数值减小 / 增大 10 个步进 |
| Home / End | 直接跳转至最小值 / 最大值 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value` | `number` | `—` | 滑块的受控数值。 |
| `defaultValue` | `number` | `0` | 滑块非受控用法下的默认值。 |
| `min` | `number` | `0` | 允许的最小值。 |
| `max` | `number` | `100` | 允许的最大值。 |
| `step` | `number` | `1` | 步进粒度间隔。 |
| `size` | `'default' \| 'sm'` | `'default'` | 滑块轨道与滑块的尺寸规格。 |
| `disabled` | `boolean` | `false` | 为 true 时阻止用户交互并应用弱化透明度。 |
| `readOnly` | `boolean` | `false` | 为 true 时阻止数值变化，同时保持完整视觉不透明度。 |
| `showTooltip` | `boolean` | `false` | 为 true 时，在拖拽与悬停时于滑块上显示交互式浮动数值提示。 |
| `formatValue` | `(value: number) => string` | `—` | 浮动提示文本的可选格式化函数。 |
| `showTicks` | `boolean` | `false` | 沿滑块轨道显示刻度标记。 |
| `marks` | `string[]` | `—` | 与离散停靠位置对应的标签字符串可选数组。 |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | 滑块轨道的方向。 |
| `onValueChange` | `(value: number) => void` | `—` | 滑块数值变化时调用的事件处理函数。 |
| `onChange` | `(value: number) => void` | `—` | 滑块数值变化时调用的标准事件处理函数。 |
| `name` | `string` | `—` | 底层隐藏输入框的表单提交名称。 |
| `forceHover` | `boolean` | `false` | 以编程方式强制悬停样式的视觉测试辅助。 |
| `forceFocus` | `boolean` | `false` | 以编程方式强制焦点环样式的视觉测试辅助。 |
| `className` | `string` | `''` | 应用于滑块根元素的额外 CSS 类名。 |
```
