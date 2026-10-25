---
id: splitter-handle
component: splitter-handle
category: Surfaces & Layout
title: Splitter Handle
description: 边缘拖拽调整手柄，具备参考项坐标防抖与最小/最大尺寸钳制。
---

## 动效规范 {#animations}

分隔手柄状态切换与指示器动效规范。

- 激活指示器颜色与不透明度在 `duration-quick`（150ms）内以 `ease-standard` 曲线平滑过渡。
- 手柄拖拽过程严格无动效，保证确定性 60fps 实时指针跟踪。
- 动效时长与缓动由 `ThemeTokens.animationsEnabled` 与 `prefers-reduced-motion` 集中管控。

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| ← / → / ↑ / ↓ | 按 10 像素增量调整目标面板尺寸 |
| Home | 将面板尺寸吸附至最小限制 minSize |
| End | 将面板尺寸吸附至最大限制 maxSize |
| Enter / Double Click | 将面板重置为默认尺寸 defaultSize |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `edge` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'left'` | 控制目标面板哪条边缘的缩放手柄。 |
| `targetSize` | `number` | `200` | 被缩放目标元素的当前尺寸（宽或高）。 |
| `minSize` | `number` | `100` | 允许的最小尺寸边界。 |
| `maxSize` | `number` | `1000` | 允许的最大尺寸边界。 |
| `defaultSize` | `number` | — | 双击或按 Enter 时恢复的尺寸。 |
| `liveUpdate` | `boolean` | `true` | 拖拽过程中是否连续触发尺寸更新。 |
| `hitThickness` | `number` | `6` | 鼠标交互热区的厚度。 |
| `visualThickness` | `number` | `1` | 静息态可见细线的厚度。 |
| `activeVisualThickness` | `number` | `2` | 悬停或拖拽时高亮可见细线的厚度。 |
| `disabled` | `boolean` | `false` | 是否禁用手柄缩放。 |
```
