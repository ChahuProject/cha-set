---
id: breadcrumb
component: breadcrumb
category: Surfaces & Layout
title: Breadcrumb
description: 路径分级层级导航栏，支持图标标识、省略溢出收纳与子目录下拉菜单。
---

## 动效规范 {#animations}

面包屑导航项悬停、下拉展开与溢出收纳动效规范。

- 分段悬停微交互背景色在 `duration-quick`（90ms）内通过 `ease-standard` 平滑过渡。
- 子目录下拉弹窗及溢出菜单在 `duration-short`（180ms）内通过 `ease-entrance` 淡入与展开。
- 窗口尺寸收缩或溢出重排时，受限节点平滑折叠为省略号胶囊按钮。
- 在 Web 端遵循 `prefers-reduced-motion`，在 Qt 端由 `ThemeTokens.animationsEnabled` 管控。

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘交互操作。

```table shortcuts
| 按键 | 交互行为 |
| --- | --- |
| Tab / Shift+Tab | 在可见的面包屑分段与下拉箭头之间移动焦点 |
| Space / Enter | 激活当前聚焦的面包屑分段以导航到对应路径，或展开子目录下拉菜单 |
| ↑ / ↓ | 在子目录或溢出下拉菜单中上下切换高亮选项 |
| Escape | 关闭已打开的子目录下拉菜单并恢复焦点至对应分段 |
```

## 属性 {#props}

双端属性名称与语义完全一致；`类型` 为 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `segments` | `PathSegment[]` | `[]` | 路径分段数组，包含路径、显示名称与图标属性。 |
| `activePath` | `string` | `undefined` | 当前激活的高亮完整路径字符串。 |
| `disabled` | `boolean` | `false` | 是否禁用交互点击与下拉菜单。 |
| `openSegmentIndex` | `number` | `-1` | 受控打开子目录下拉菜单的分段索引（-1 为无）。 |
| `maxVisibleItems` | `number` | `5` | 折叠为省略号前最大直接展示的分段数量。 |
```
