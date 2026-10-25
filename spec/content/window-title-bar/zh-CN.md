---
id: window-title-bar
component: window-title-bar
category: Desktop & Virtualization
title: Window Title Bar
description: 桌面端无边框窗口标题栏组件，包含应用标识、标题、拖拽移动区域以及最小化/最大化/关闭系统控制按钮。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Alt + Space | 打开系统窗口控制菜单 |
| Alt + F4 | 关闭应用程序窗口 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `title` | `ReactNode` | `undefined` | 窗口标题标签或元素。 |
| `icon` | `ReactNode` | `undefined` | 渲染于左缘的应用图标。 |
| `onMinimize` | `() => void` | `undefined` | 最小化按钮点击回调。 |
| `onMaximize` | `() => void` | `undefined` | 最大化按钮点击回调。 |
| `onClose` | `() => void` | `undefined` | 关闭按钮点击回调。 |
```
