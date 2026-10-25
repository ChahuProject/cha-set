---
id: separator
component: separator
category: Base Primitives
title: Separator
description: 在列表、表单或区域中在视觉或语义上分隔内容。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| — | 非交互式视觉与语义边界分割线 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | 分隔线的方向。 |
| `variant` | `'solid' \| 'dashed' \| 'dotted'` | `'solid'` | 分隔线的线型样式。 |
| `label` | `ReactNode` | `undefined` | 嵌入分隔线中的可选标签或注释文本。 |
| `labelPosition` | `'left' \| 'center' \| 'right'` | `'center'` | 嵌入标签的水平对齐方式。 |
| `decorative` | `boolean` | `true` | 该元素是纯装饰还是传达语义结构。 |
| `className` | `string` | `''` | 用于自定义宽度、高度、边距或颜色覆盖的额外 CSS 类名。 |
```
