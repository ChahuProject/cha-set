---
id: shortcut-bar
component: shortcut-bar
category: Base Primitives
title: Shortcut Bar
description: 交互式多阶段响应式快捷键状态栏，在容器变窄时自动推进完整文字、紧凑符号、折叠徽章抽屉与小键盘图标形态。
---

## 动效规范 {#animations}

交互状态的动效行为与时间节奏，严格遵循 ChaSet 令牌体系。

- 宽度过渡与重排折叠在 `duration-short` 时长内以 `ease-standard` 缓动过渡。
- 溢出浮层与小图标抽屉的展开与收起使用 `duration-short` 及 `ease-entrance`。
- 动效时长与缓动直接解析自主题令牌，启用减弱动效偏好（`prefers-reduced-motion`）时将自动置零；Qt 端由 `ThemeTokens.animationsEnabled` 集中管控该开关。

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| `Tab` / `Shift+Tab` | 在快捷键栏各控制焦点间循环移动焦点 |
| `Enter` / `Space` | 当折叠为溢出徽章或紧凑小键盘图标形态时，激活弹出所有快捷键面板 |
| `Esc` | 关闭已打开的快捷键列表弹出浮层 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `mode` | `'auto' \| 'icon'` | `'auto'` | 呈现形态：`auto` 自动多阶段自适应（极窄空间折叠为小图标），`icon` 常驻小键盘图标形态。 |
| `items` | `ShortcutItem[]` | `[]` | 自定义快捷键项列表（包含键位、标签与优先级）。 |
| `preset` | `'dropdown' \| 'dialog' \| 'tree' \| 'table' \| 'address-bar'` | `undefined` | 内置的标准快捷键场景预设。 |
| `additionalShortcuts` | `ShortcutItem[]` | `[]` | 附加在内置预设后面的额外快捷键列表。 |
| `compact` | `'auto' \| 'always' \| 'never'` | `'auto'` | 修饰符显示模式（转换为紧凑符号或完整名称）。 |
| `size` | `'xs' \| 'sm' \| 'default' \| 'md'` | `'xs'` | 快捷键键帽与文本的尺寸规格。 |
| `variant` | `'outline' \| 'solid' \| 'subtle' \| 'inverted'` | `'outline'` | 键帽视觉变体。 |
| `showOverflowCount` | `boolean` | `true` | 是否在快捷键折叠时显示溢出数量徽章。 |
| `className` | `string` | `''` | 可选的额外 Tailwind CSS 类名（React）。 |
```
