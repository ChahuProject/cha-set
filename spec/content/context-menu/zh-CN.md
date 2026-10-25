---
id: context-menu
component: context-menu
category: Overlays & Feedback
title: Context Menu
description: 在右键或上下文手势的指针坐标处弹出的菜单。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Shift + F10 / Menu | 在聚焦元素位置打开右键上下文菜单 |
| ↓ / ↑ | 循环切换选项并抑制鼠标指针悬停高亮 |
| Enter / Space | 执行高亮菜单项并关闭菜单 |
| Escape | 关闭上下文菜单并将焦点返回触发源 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `modal` | `boolean` | `true` | 右键菜单是否为模态。 |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | 打开状态变化时触发的回调。 |
```
