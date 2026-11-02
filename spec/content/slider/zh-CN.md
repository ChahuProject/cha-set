---
id: slider
component: slider
category: Forms & Inputs
title: Slider
description: 允许用户沿滑动轨道选取单一数值、区间范围或离散预设档位的交互控件。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| ← / ↓ | 将数值减小一个步进（范围模式下调节当前聚焦滑块） |
| → / ↑ | 将数值增大一个步进（范围模式下调节当前聚焦滑块） |
| Tab / Shift+Tab | 范围模式下在低位与高位滑块之间切换焦点 |
| PageDown / PageUp | 将数值减小 / 增大 10 个步进 |
| Home / End | 直接跳转至最小值 / 最大值 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value` | `number \| [number, number]` | `—` | 滑块的受控数值或 [min, max] 区间元组。 |
| `defaultValue` | `number \| [number, number]` | `0` | 滑块非受控用法下的默认数值或 [min, max] 区间元组。 |
| `min` | `number` | `0` | 允许的最小值。 |
| `max` | `number` | `100` | 允许的最大值。 |
| `step` | `number` | `1` | 步进粒度间隔。 |
| `range` | `boolean` | `false` | 为 true 时启用双滑块区间选择模式与高亮区间填充。 |
| `minStepsBetweenThumbs` | `number` | `0` | 范围模式下强制保持的双滑块间最小步进数（防重叠）。 |
| `commitOnRelease` | `boolean` | `false` | 为 true 时，拖动滑块仅实时反馈视觉位置，数值更新与变更回调仅在松开鼠标（撒手）时生效提交。 |
| `size` | `'default' \| 'sm'` | `'default'` | 滑块轨道与滑块的尺寸规格。 |
| `disabled` | `boolean` | `false` | 为 true 时阻止用户交互并应用弱化透明度。 |
| `readOnly` | `boolean` | `false` | 为 true 时阻止数值变化，同时保持完整视觉不透明度。 |
| `showTooltip` | `boolean` | `false` | 为 true 时，在拖拽与悬停时于滑块上显示交互式浮动数值提示。 |
| `formatValue` | `(value: number) => string` | `—` | 浮动提示文本的可选格式化函数。 |
| `showTicks` | `boolean` | `false` | 沿滑块轨道显示刻度标记。 |
| `marks` | `string[]` | `—` | 与离散停靠位置对应的标签字符串可选数组。 |
| `count` | `number` | `—` | 离散停靠点总数（吸附模式）。 |
| `labels` | `string[]` | `—` | 轨道下方显示的离散停靠点标签文本数组。 |
| `leftLabel` | `string` | `—` | 轨道下方最左侧的文本标注说明。 |
| `rightLabel` | `string` | `—` | 轨道下方最右侧的文本标注说明。 |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | 滑块轨道的方向。 |
| `onValueChange` | `(value: any) => void` | `—` | 滑块数值变化时调用的事件处理函数。 |
| `onChange` | `(value: any) => void` | `—` | 滑块数值变化时调用的标准事件处理函数。 |
| `onValueCommit` | `(value: any) => void` | `—` | 滑块释放或键盘步进完成时触发的提交回调函数。 |
| `name` | `string` | `—` | 底层隐藏输入框的表单提交名称。 |
| `forceHover` | `boolean` | `false` | 以编程方式强制悬停样式的视觉测试辅助。 |
| `forceFocus` | `boolean` | `false` | 以编程方式强制焦点环样式的视觉测试辅助。 |
| `className` | `string` | `''` | 应用于滑块根元素的额外 CSS 类名。 |
```
