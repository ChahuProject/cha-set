---
id: draggable-modal
component: draggable-modal
category: Overlays & Feedback
title: Draggable Modal
description: 桌面级浮动窗口，支持标题栏拖拽移动与视口边界约束。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Tab / Shift + Tab | 将焦点严格限制在模态窗口边界内循环 |
| Escape | 关闭模态窗口并将焦点恢复至触发源 |
| Alt + Arrow Keys | 无需鼠标直接平移调整模态窗口偏移量 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `children` | `ReactNode` | `undefined` | 弹窗内容主体（可滚动容器）。 |
| `initialPositionMode` | `'center' \| 'top' \| '居中' \| '顶部靠上'` | `'center'` | 初始定位模式：居中或靠顶显示。 |
| `sizeOptions` | `DraggableModalSizeOption[]` | `undefined` | 右上角尺寸切换档位列表。 |
| `sizeMenuTooltip` | `string` | `'调整弹窗尺寸'` | 尺寸菜单按钮的悬浮提示文本。 |
| `fixedFooter` | `ReactNode` | `undefined` | 固定在底部的操作区域（不随内容滚动）。 |
| `topControls` | `ReactNode` | `undefined` | 渲染在右上角操作栏内的附加控件（如关闭按钮）。 |
| `rootExtra` | `ReactNode` | `undefined` | 根容器内部的附加内容（如浮动面板）。 |
| `autoFitHeight` | `boolean` | `true` | 是否根据内容自然高度动态自适应贴高。 |
| `showEscBadge` | `boolean` | `false` | 是否在右上角显示 ESC 键提示徽章。 |
| `bounds` | `string \| Element` | `'window'` | 弹窗的拖拽边界：窗口级浮动或父容器限界画布。 |
| `defaultWidthRem` | `number` | `undefined` | 初始宽度（rem 单位）。 |
| `defaultHeightRem` | `number` | `undefined` | 初始高度（rem 单位）。 |
| `defaultWidth` | `number` | `500` | 初始宽度。 |
| `defaultHeight` | `number` | `400` | 初始高度。 |
| `topMarginRem` | `number` | `4.5` | 靠顶模式下的顶部外边距（rem 单位）。 |
| `remBase` | `number` | `16` | rem 换算基准比例。 |
```
