---
id: duration-input
component: duration-input
category: Forms & Inputs
title: Duration Input
description: 分段时长输入框，支持步进按钮、方向键跳转与预设菜单。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| ↑ / ↓ | 递增／递减当前聚焦的时间分段（时、分、秒） |
| ← / → | 在相邻时间分段之间导航 |
| Tab / Shift + Tab | 在时间分段与预设下拉菜单之间移动焦点 |
| Mouse Wheel | 向上或向下调整当前聚焦时间分段数值 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value` | `number` | `0` | 受控模式下的总时长（秒）。 |
| `defaultValue` | `number` | `0` | 非受控模式下的初始时长（秒）。 |
| `onChange` | `(seconds: number) => void` | `undefined` | 时长变化时触发的回调。 |
| `maxHours` | `number` | `99` | 小时分段的上限钳制值。 |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | 视觉密度与尺寸变体。 |
| `disabled` | `boolean` | `false` | 输入框、按钮与预设下拉是否禁用。 |
| `showPresets` | `boolean` | `true` | 是否显示预设下拉按钮。 |
| `showLabels` | `boolean` | `true` | 是否在分段下方显示单位标签。 |
| `presets` | `DurationPresetGroup[]` | `defaultDurationPresetGroups` | 下拉菜单的自定义分组时长预设。 |
| `hoursLabel` | `string` | `'Hours'` | 小时分段的标签文本。 |
| `minutesLabel` | `string` | `'Minutes'` | 分钟分段的标签文本。 |
| `secondsLabel` | `string` | `'Seconds'` | 秒分段的标签文本。 |
| `presetsLabel` | `string` | `'Presets'` | 预设触发按钮的标签文本。 |
| `className` | `string` | `undefined` | 外层容器的自定义 CSS 类。 |
```
