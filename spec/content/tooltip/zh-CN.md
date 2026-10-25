---
id: tooltip
component: tooltip
category: Overlays & Feedback
title: Tooltip
description: 当元素获得键盘焦点或鼠标悬停时展示与之相关信息的浮层。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Focus | 当触发元素获得键盘焦点时展示文字提示 |
| Escape | 立即隐藏文字提示气泡 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `content` | `ReactNode \| string` | `''` | 在浮动提示气泡内渲染的内容。 |
| `shortcut` | `string` | `''` | 在提示气泡内渲染的键盘快捷键徽章。 |
| `arrow` | `boolean` | `false` | 是否渲染指向触发器的方向箭头。 |
| `side` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'top'` | 相对触发器的首选放置方位。 |
| `avoidCollisions` | `boolean` | `true` | 溢出时是否将气泡移回视口内；为 false 时固定精确的方位放置。 |
| `delayDuration` | `number` | `200` | 悬停至提示打开的延迟（毫秒）。 |
| `disabled` | `boolean` | `false` | 悬停或聚焦时阻止提示打开。 |
| `asChild` | `boolean` | `false` | 将触发器属性与事件处理直接合并至单个子元素。 |
| `open` | `boolean` | `undefined` | 提示的受控打开状态。 |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | 打开状态变化时执行的回调。 |
| `className` | `string` | `''` | 应用于元素的额外 CSS 类名。 |
```
