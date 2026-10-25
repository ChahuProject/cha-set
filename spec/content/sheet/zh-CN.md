---
id: sheet
component: sheet
category: Overlays & Feedback
title: Sheet
description: 扩展对话框组件，用于展示从任意屏幕边缘（顶部、右侧、底部、左侧）滑入的内容。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Tab / Shift + Tab | 将焦点严格限制在抽屉侧栏内部循环 |
| Escape | 关闭抽屉侧栏并将焦点恢复至触发源 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | 受控的打开状态。 |
| `defaultOpen` | `boolean` | `false` | 非受控使用时的默认打开状态。 |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | 打开状态变化时触发的回调。 |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | 抽屉滑入的视口边缘。 |
| `size` | `'sm' \| 'default' \| 'lg' \| 'xl' \| 'full'` | `'default'` | 抽屉尺寸预设（左右为宽度，上下为高度）。 |
| `showCloseButton` | `boolean` | `true` | 是否在抽屉内渲染右上角关闭图标按钮。 |
| `closeOnOverlayClick` | `boolean` | `true` | 点击背景是否自动关闭抽屉。 |
```
