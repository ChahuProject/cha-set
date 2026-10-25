---
id: preset-number-input
component: preset-number-input
category: Forms & Inputs
title: Preset Number Input
description: 带快捷预设下拉面板与清空操作的数值输入框。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| ↑ / ↓ | 按单步长递增／递减数值 |
| PageUp / PageDown | 按预设大步长递增／递减数值 |
| Enter | 提交解析后的数值 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value` | `string` | `''` | 输入框当前的数值。 |
| `onChange` | `(val: string) => void` | `undefined` | 数值变化时触发的回调。 |
| `presets` | `number[]` | `[64, 128, 256, 512, 1024, 2048, 4096, 8192]` | 快速选择的预设数值列表。 |
| `placeholder` | `string` | `undefined` | 为空时显示的占位文本。 |
| `disabled` | `boolean` | `false` | 是否禁用输入与下拉交互。 |
| `allowClear` | `boolean` | `true` | 是否在下拉中显示清除／重置选项。 |
| `clearLabel` | `string` | `'None'` | 清除选项的标签文本。 |
| `inputClassName` | `string` | `undefined` | 内部输入框的自定义 CSS 类。 |
| `className` | `string` | `undefined` | 外部容器的自定义 CSS 类。 |
```
