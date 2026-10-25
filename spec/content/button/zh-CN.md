---
id: button
component: button
category: Base Primitives
title: Button
description: 展示一个按钮或具有按钮外观的组件，提供多种变体、尺寸和状态。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Space / Enter | 触发按钮点击事件处理函数 |
| Tab | 将焦点移动到下一个可聚焦元素 |
| Shift + Tab | 将焦点移动到上一个可聚焦元素 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link' \| 'overlay'` | `'default'` | 按钮外观与语义意图。 |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon' \| 'xs' \| 'icon-xs' \| 'icon-sm' \| 'icon-lg'` | `'default'` | 标准化尺寸规格。 |
| `loading` | `boolean` | `false` | 显示加载旋转指示并禁用用户交互。 |
| `loadingText` | `ReactNode` | `undefined` | 加载状态下显示的可选内容。 |
| `pressed` | `boolean` | `false` | 带激活样式与 aria-pressed 的切换或选中状态。 |
| `leftIcon` | `ReactNode` | `undefined` | 显示在子内容之前的可选前置图标。 |
| `rightIcon` | `ReactNode` | `undefined` | 显示在子内容之后的可选后置图标。 |
| `iconSize` | `number` | `undefined` | 逻辑未缩放图标尺寸；可放大或覆盖按钮内渲染的图标。 |
| `fullWidth` | `boolean` | `false` | 将按钮拉伸至父容器宽度的 100%。 |
| `asChild` | `boolean` | `false` | 将属性直接传递给子元素（多态）。 |
| `disabled` | `boolean` | `false` | 阻止点击并应用弱化禁用样式。 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | HTML 按钮类型属性。 |
```
