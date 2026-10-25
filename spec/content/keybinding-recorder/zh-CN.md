---
id: keybinding-recorder
component: keybinding-recorder
category: Forms & Inputs
title: Keybinding Recorder
description: 面向桌面应用的交互式录制器，用于捕获加速键键盘序列。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Any Key Combo | 捕获并录制按下的修饰键与快捷键 |
| Backspace / Delete | 清除当前已录制的按键绑定 |
| Escape | 取消录制模式且不保存任何变更 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value` | `string \| KeybindingValue` | `''` | 当前按键组合（字符串或结构化对象）。 |
| `onValueChange` | `(val: string \| KeybindingValue) => void` | `undefined` | 录制到新组合时触发的回调。 |
| `onChange` | `(value: KeybindingValue, str: string) => void` | `undefined` | 同时接收结构化对象与字符串的双回调。 |
| `size` | `"default" \| "sm"` | `"default"` | 常规与紧凑密度的尺寸预设变体。 |
| `clearable` | `boolean` | `true` | 设置快捷键后是否渲染清除按钮。 |
| `disabled` | `boolean` | `false` | 录制器是否禁用。 |
| `placeholder` | `string` | `'No keybinding set'` | 未定义快捷键时的占位提示。 |
| `recordingText` | `string` | `'Press key combination (Esc to cancel)...'` | 录制过程中显示的提示语。 |
```
