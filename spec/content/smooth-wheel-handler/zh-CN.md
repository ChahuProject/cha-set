---
id: smooth-wheel-handler
component: smooth-wheel-handler
category: Desktop & Virtualization
title: Smooth Wheel Handler
description: 桌面端平滑滚轮运动学辅助组件，提供连续物理动量阻尼累加、Shift+滚轮水平转置及触控拖拽解耦互斥。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Mouse Wheel | 带惯性阻尼的连续平滑滚动 |
| Shift + Wheel | 将鼠标垂直滚轮映射为水平滚动 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `scrollOrientation` | `'vertical' \| 'horizontal'` | `'vertical'` | 目标视口滚动的主方向。 |
| `mapVerticalToHorizontal` | `boolean` | `false` | 是否将垂直滚轮映射为横向移动。 |
| `speedMultiplier` | `number` | `1.2` | 作用于原始增量的滚动速度倍率。 |
| `duration` | `number` | `200` | OutCubic 阻尼过渡的时长（毫秒）。 |
| `fixedStepSize` | `number` | `0` | 每滚轮刻度的可选量化步进（0 为动态）。 |
| `consumeEvent` | `boolean` | `true` | 是否阻止已处理的滚轮事件向父窗口传播。 |
```
