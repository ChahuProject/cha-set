---
id: sidebar
component: sidebar
category: Surfaces & Layout
title: Sidebar
description: 可组合、响应式、可调尺寸的桌面级侧边栏导航系统，支持图标折叠、抽屉模式与自定义 rem 尺寸。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Ctrl + B / ⌘ + B | 在展开与收起模式之间切换侧边栏 |
| Tab / Shift + Tab | 在导航菜单项之间周转遍历 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `collapsible` | `'offcanvas' \| 'icon' \| 'none'` | `'offcanvas'` | 桌面端关闭时的折叠行为模式。 |
| `variant` | `'sidebar' \| 'floating' \| 'inset'` | `'sidebar'` | 视觉容器样式变体。 |
| `side` | `'left' \| 'right'` | `'left'` | 侧边栏布局的停靠方位。 |
| `defaultOpen` | `boolean` | `true` | SidebarProvider 的初始展开状态。 |
```
