---
id: squircle
component: squircle
category: Base Primitives
title: Squircle
description: iOS 连续曲率超椭圆圆角（G2 连续律）。消除了传统圆弧角在直线与切点处曲率突变导致的生硬折痕，为整个项目提供平滑、有机的现代圆角设计。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| — | 非交互几何容器，呈现连续曲率超椭圆圆角 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `radius` | `number` | `8` | 逻辑单位下的圆角半径。 |
| `smoothing` | `number` | `0.6` | 曲率平滑系数，0.0 为圆弧角至 1.0 为完整超椭圆，0.6 为 Apple iOS 标准。 |
| `cornerSmoothing` | `number` | `0.6` | 符合中性规范的 smoothing 别名。 |
| `topLeftRadius` | `number` | `undefined` | 左上角圆角覆盖值。 |
| `topRightRadius` | `number` | `undefined` | 右上角圆角覆盖值。 |
| `bottomLeftRadius` | `number` | `undefined` | 左下角圆角覆盖值。 |
| `bottomRightRadius` | `number` | `undefined` | 右下角圆角覆盖值。 |
| `roundLeft` | `boolean` | `true` | 左侧圆角是否生效。 |
| `roundRight` | `boolean` | `true` | 右侧圆角是否生效。 |
| `roundTop` | `boolean` | `true` | 顶部圆角是否生效。 |
| `roundBottom` | `boolean` | `true` | 底部圆角是否生效。 |
| `borderWidth` | `number` | `0` | 逻辑单位下的边框描边宽度。 |
| `borderColor` | `string` | `undefined` | 连续曲率描边的边框颜色。 |
| `color` | `string` | `undefined` | 背景表面填充颜色。 |
| `width` | `number` | `undefined` | 逻辑单位下的显式宽度（缺省时经由 ResizeObserver 自动测量）。 |
| `height` | `number` | `undefined` | 逻辑单位下的显式高度（缺省时经由 ResizeObserver 自动测量）。 |
| `as` | `React.ElementType` | `'div'` | 底层渲染的 HTML 标签或组件。 |
```
