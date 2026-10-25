---
id: read-only-input
component: read-only-input
category: Forms & Inputs
title: Read-Only Input
description: 面向令牌与 ID 的受保护只读输入框，集成复制到剪贴板操作。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Tab | 聚焦输入框以允许划选或读取数值 |
| Ctrl + C / ⌘ + C | 复制当前数值至系统剪贴板 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value` | `string` | `''` | 输入框中展示的受保护数值。 |
| `showCopy` | `boolean` | `true` | 是否显示附带的复制按钮。 |
| `masked` | `boolean` | `false` | 是否以圆点掩码遮盖字符。 |
| `maskChar` | `string` | `'•'` | 用于掩码的字符。 |
| `showMaskToggle` | `boolean` | `true` | 掩码时是否显示显隐切换按钮。 |
| `size` | `"default" \| "sm"` | `"default"` | 密度与尺寸变体。 |
| `colorScheme` | `"default" \| "destructive" \| "warning" \| "success"` | `"default"` | 颜色主题变体。 |
| `disabled` | `boolean` | `false` | 输入框是否禁用。 |
| `placeholder` | `string` | `''` | 数值为空时显示的占位提示。 |
```
