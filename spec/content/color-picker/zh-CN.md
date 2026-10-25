---
id: color-picker
component: color-picker
category: Forms & Inputs
title: ColorPicker
description: 交互式颜色选择器，支持饱和度/明度选区与色板。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Tab / Shift + Tab | 在饱和度取色区、色相滑条与输入框之间循环切换焦点 |
| Arrow Keys | 微调颜色坐标点与色相角度 |
| Enter | 确认颜色选取结果 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value` | `string` | `—` | 受控十六进制颜色值（例如 #1D7AE0）。 |
| `defaultValue` | `string` | `'#1d7ae0'` | 非受控用法下的初始颜色值。 |
| `mode` | `'inline' \| 'popover'` | `'inline'` | 显示模式：内联面板卡片或浮层下拉触发器。 |
| `size` | `'default' \| 'sm'` | `'default'` | 画布、色板与输入框的视觉尺寸规格。 |
| `disabled` | `boolean` | `false` | 为 true 时阻止用户交互并应用弱化透明度。 |
| `movable` | `boolean` | `false` | 为 true 时允许拖拽空白背景区域以移动组件，双击重置位置。 |
| `showPreview` | `boolean` | `true` | 是否显示顶部预览头的色板与十六进制标签。 |
| `showHex` | `boolean` | `true` | 是否显示可编辑的 HEX 文本输入行。 |
| `showSwatches` | `boolean` | `true` | 是否显示快捷预设颜色色板行。 |
| `presetColors` | `string[]` | `16 default colors` | 在色板面板中展示的预设十六进制颜色字符串数组。 |
| `onChange` | `(hex: string) => void` | `—` | 选中颜色变化时触发的回调。 |
| `onValueChange` | `(hex: string) => void` | `—` | 为契约一致性提供的 onChange 别名回调。 |
| `title` | `ReactNode` | `'Color'` | 在预览头中渲染的自定义标签。 |
```
