---
id: dropdown-menu
component: dropdown-menu
category: Overlays & Feedback
title: Dropdown Menu
description: 由按钮触发的下拉菜单，支持分组项与快捷键提示。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Enter / Space / ↓ | 从触发器打开菜单并高亮首个可用项 |
| ↓ / ↑ | 循环切换选项并抑制鼠标指针悬停高亮 |
| Home / End | 直接跳转到首个 / 末尾可用项 |
| Enter / Space | 触发高亮项操作并关闭菜单 |
| Escape | 关闭菜单并将焦点返还触发元素 |
| Tab | 关闭菜单并将焦点移至下一个可交互元素 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | 下拉菜单的受控打开状态。 |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | 打开状态变化时调用的事件处理函数。 |
| `modal` | `boolean` | `true` | 是否渲染为捕获焦点的模态。 |
| `sideOffset` | `number` | `4` | 触发器至浮层内容的距离偏移。 |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | 沿触发器边缘的对齐方式。 |
```
