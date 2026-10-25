---
id: skeleton
component: skeleton
category: Base Primitives
title: Skeleton
description: 在内容加载期间显示占位骨架屏，具有平滑的 CSS 脉冲与波纹闪烁动画。
---

## 动效规范 {#animations}

交互状态的动效行为与时间节奏，严格遵循 ChaSet 令牌体系。

- 状态切换（悬停、按下、聚焦）在 `duration-quick` 时长内以 `ease-standard` 缓动曲线过渡。
- 动效时长与缓动直接解析自主题令牌，启用减弱动效偏好（`prefers-reduced-motion`）时将自动置零；Qt 端由 `ThemeTokens.animationsEnabled` 集中管控该开关。

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
