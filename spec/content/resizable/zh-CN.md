---
id: resizable
component: resizable
category: Surfaces & Layout
title: Resizable
description: 无障碍可调面板分组与布局分隔器。
---

## 动效规范 {#animations}

分栏尺寸调整行为遵循 ChaSet 令牌体系，拖拽调整过程严格禁用动效以保证实时跟手。

- 分栏手柄的悬停与激活状态过渡在 `duration-quick` 时长内完成。
- 面板拖拽调整过程严格无动效，保证确定性 60fps 实时指针跟踪。
- 在 Web 端遵循 `prefers-reduced-motion`，在 Qt 端由 `ThemeTokens.animationsEnabled` 统一管控。

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Arrow Keys | 沿当前拖拽边缘调整面板尺寸 |
| Home / End | 将面板吸附至最小／最大允许尺寸 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `direction` | `'horizontal' \| 'vertical'` | `'horizontal'` | 面板布局方向（亦支持 orientation 属性）。 |
| `defaultSize` | `number` | `undefined` | 分配给面板的初始百分比尺寸（0-100）。 |
| `minSize` | `number` | `0` | 允许的最小百分比尺寸约束。 |
| `maxSize` | `number` | `100` | 允许的最大百分比尺寸约束。 |
| `collapsible` | `boolean` | `false` | 面板是否可越过最小尺寸完全折叠。 |
| `withHandle` | `boolean` | `false` | 是否在分隔条上渲染无障碍触觉可视抓握手柄。 |
```
