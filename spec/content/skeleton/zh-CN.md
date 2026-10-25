---
id: skeleton
component: skeleton
category: Base Primitives
title: Skeleton
description: 在内容加载期间显示占位骨架屏，具有平滑的 CSS 脉冲与波纹闪烁动画。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| — | 非交互占位骨架元素，用于呈现内容加载状态 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `animation` | `'pulse' \| 'wave' \| 'none'` | `'pulse'` | 占位加载效果的动画样式。 |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | 占位形状的圆角预设。 |
| `animate` | `boolean` | `true` | 切换动画开或关的便捷布尔开关。 |
| `className` | `string` | `''` | 用于高度、宽度与背景造型的自定义 CSS 类名。 |
```
