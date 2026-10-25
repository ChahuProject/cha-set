---
id: switch
component: switch
category: Forms & Inputs
title: Switch
description: 允许用户在开与关状态之间切换的控制开关，支持异步加载、只读模式及辅助说明描述。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Space / Enter | 切换开关开启或关闭状态 |
| Tab / Shift + Tab | 在控件之间转移键盘焦点 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `checked` | `boolean` | `false` | 开关是否处于打开（选中）状态。 |
| `defaultChecked` | `boolean` | `false` | 非受控用法下的默认选中状态。 |
| `onCheckedChange` | `(checked: boolean) => void` | `—` | 选中状态变化时调用的事件处理函数。 |
| `size` | `'default' \| 'sm'` | `'default'` | 开关轨道与滑块的尺寸规格。 |
| `disabled` | `boolean` | `false` | 禁用用户交互并应用弱化透明度。 |
| `readOnly` | `boolean` | `false` | 开关是否为只读（阻止交互但不弱化透明度）。 |
| `loading` | `boolean` | `false` | 在滑块内展示动画 spinner 并阻止切换。 |
| `label` | `React.ReactNode` | `—` | 随开关渲染的可选伴随标签。 |
| `description` | `React.ReactNode` | `—` | 展示于标签下方的可选辅助文本。 |
| `forceHover` | `boolean` | `false` | 强制悬停状态的视觉测试辅助。 |
| `forceFocus` | `boolean` | `false` | 强制焦点环的视觉测试辅助。 |
| `className` | `string` | `''` | 应用于开关轨道元素的额外 CSS 类名。 |
```
