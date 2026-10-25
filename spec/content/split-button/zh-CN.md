---
id: split-button
component: split-button
category: Base Primitives
title: Split Button
description: 双操作按钮，结合主要直接点击操作与次要附属下拉菜单。
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
| Space / Enter | 触发主按钮分段的主要操作 |
| ↓ / Enter | 从下拉分段按钮打开次要操作下拉菜单 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `label` | `ReactNode` | `undefined` | 主操作按钮上的标签。 |
| `onClick` | `() => void` | `undefined` | 点击主操作时触发的回调。 |
| `menuContent` | `ReactNode` | `undefined` | 点击下拉箭头渲染的下拉菜单项。 |
| `variant` | `ButtonVariant` | `'default'` | 按钮样式变体。 |
| `size` | `ButtonSize` | `'default'` | 按钮尺寸变体。 |
```
