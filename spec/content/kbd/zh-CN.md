---
id: kbd
component: kbd
category: Base Primitives
title: Kbd
description: 显示键盘快捷键、组合键及键帽徽章，具备智能紧凑截断功能。
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
| — | 非交互视觉指示徽章，用于呈现键盘快捷键与组合按键 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `variant` | `'outline' \| 'solid' \| 'subtle' \| 'inverted'` | `'outline'` | 与容器表面匹配的视觉呈现变体。 |
| `size` | `'xs' \| 'sm' \| 'default' \| 'md'` | `'default'` | 控制键帽高度、内边距与字号的尺寸规格。 |
| `compact` | `'auto' \| 'always' \| 'never'` | `'auto'` | 是否将冗长修饰符转换为紧凑符号（Ctrl 转为 ⌃）。 |
| `overflow` | `'collapse' \| 'hide' \| 'visible'` | `'collapse'` | 窄容器空间受限时的溢出策略。 |
| `shortcut` | `string` | `''` | 自动解析的序列化快捷键组合字符串。 |
| `separator` | `string` | `'+'` | 组合键之间的自定义分隔符。 |
| `className` | `string` | `''` | 可选的额外 Tailwind CSS 类名。 |
```
