---
id: checkbox
component: checkbox
category: Forms & Inputs
title: Checkbox
description: 允许用户在选中和未选中状态之间切换的控件，支持半选状态、多尺寸、辅助说明文本与配套标签。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Space | 在选中与未选中状态间切换复选框 |
| Tab / Shift + Tab | 在控件之间转移键盘焦点 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `checked` | `boolean` | `false` | 复选框的受控选中状态。 |
| `defaultChecked` | `boolean` | `false` | 非受控模式下的默认选中状态。 |
| `indeterminate` | `boolean` | `false` | 复选框是否处于半选状态（视觉优先级高于选中态）。 |
| `disabled` | `boolean` | `false` | 禁用用户交互，并应用 50％ 不透明度。 |
| `readOnly` | `boolean` | `false` | 阻止状态切换，同时保留聚焦能力与完整不透明度。 |
| `invalid` | `boolean` | `false` | 应用破坏性错误样式与 aria-invalid 属性。 |
| `size` | `'default' \| 'sm'` | `'default'` | 尺寸变体：default 或 sm。 |
| `label` | `ReactNode` | `undefined` | 与复选框并排渲染的可选配套标签。 |
| `description` | `ReactNode` | `undefined` | 渲染于标签下方的可选辅助说明文本。 |
| `onCheckedChange` | `(checked: boolean) => void` | `undefined` | 选中状态变化时触发的回调。 |
| `forceHover` | `boolean` | `false` | 用于强制呈现悬停态样式的视觉测试辅助。 |
| `forceFocus` | `boolean` | `false` | 用于强制呈现聚焦环样式的视觉测试辅助。 |
| `className` | `string` | `''` | 应用于复选框按钮的额外 CSS 类名。 |
```
