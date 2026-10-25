---
id: input
component: input
category: Forms & Inputs
title: Input
description: 显示表单文本输入框或具备输入框外观与行为的组件。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Typing | 输入并编辑文本内容 |
| Enter | 提交表单或确认输入数值 |
| Escape | 清空文本或取消焦点 |
| Tab | 将焦点前移至下一个元素 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `size` | `'default' \| 'sm'` | `'default'` | 输入框的高度与内边距规格。 |
| `type` | `string` | `'text'` | 标准 HTML／Qt 输入框类型：「text」｜「password」｜「email」｜「search」｜「number」。 |
| `placeholder` | `string` | `''` | 输入框为空时显示的占位提示文本。 |
| `disabled` | `boolean` | `false` | 禁用用户交互并应用 50% 不透明度。 |
| `readOnly` | `boolean` | `false` | 阻止编辑数值，同时保持可聚焦性。 |
| `invalid` | `boolean` | `false` | 应用破坏性错误样式与 aria-invalid 属性。 |
| `clearable` | `boolean` | `false` | 文本存在时渲染清除按钮以清空内容。 |
| `passwordToggle` | `boolean` | `false` | 渲染眼睛切换按钮以显示或遮盖密码。 |
| `leftIcon` | `ReactNode` | `undefined` | 渲染于输入框前置位置的图标元素。 |
| `rightIcon` | `ReactNode` | `undefined` | 渲染于输入框后置位置的图标元素。 |
| `onClear` | `() => void` | `undefined` | 点击清除按钮时触发的回调。 |
| `forceHover` | `boolean` | `false` | 用于强制悬停态样式的视觉测试辅助。 |
| `forceFocus` | `boolean` | `false` | 用于强制聚焦环样式的视觉测试辅助。 |
| `className` | `string` | `''` | 应用于输入框元素的额外 CSS 类名。 |
```
