---
id: badge
component: badge
category: Base Primitives
title: Badge
description: 展示徽章或具有徽章外观的组件，用于高亮状态、标签和计数。
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
| Tab | 可交互时将焦点移动至徽标 |
| Space / Enter | 可交互时触发点击操作 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `variant` | `'default' \| 'secondary' \| 'destructive' \| 'outline' \| 'ghost' \| 'link'` | `'default'` | 与核心颜色令牌对应的视觉风格变体。 |
| `size` | `'default' \| 'sm'` | `'default'` | 决定胶囊高度、内边距与字体规格的尺寸变体。 |
| `dot` | `boolean` | `false` | 是否显示前置状态指示圆点。 |
| `dotColor` | `string` | `undefined` | 状态圆点的自定义颜色类（例如 bg-emerald-500）。 |
| `removable` | `boolean` | `false` | 是否显示行内关闭／移除操作按钮。 |
| `onRemove` | `() => void` | `undefined` | 触发关闭／移除操作时执行的回调。 |
| `interactive` | `boolean` | `false` | 徽标是否响应交互光标与点击效果。 |
| `className` | `string` | `''` | 可选的附加 Tailwind CSS 类名。 |
```
