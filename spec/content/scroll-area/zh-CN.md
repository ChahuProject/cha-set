---
id: scroll-area
component: scroll-area
category: Surfaces & Layout
title: Scroll Area
description: 支持热区扩展与步进按钮的自定义滚动容器。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| ↑ / ↓ | 视口垂直滚动一行 |
| PageUp / PageDown | 视口垂直滚动一页 |
| Home / End | 直接滚动至内容顶部 / 底部 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `size` | `'default' \| 'sm'` | `'default'` | 滚动条密度与尺寸。 |
| `showVerticalScrollBar` | `boolean` | `true` | 是否渲染垂直滚动条。 |
| `showHorizontalScrollBar` | `boolean` | `false` | 是否渲染水平滚动条。 |
| `showButtons` | `boolean` | `true` | 悬停滚动条时是否显示步进导航按钮。 |
| `pageStepRatio` | `number` | `0.85` | 点击向上/向下翻页时使用的视口尺寸比例。 |
| `smoothScroll` | `boolean` | `true` | 步进按钮是否使用平滑滚动行为。 |
| `floating` | `boolean` | `true` | 滚动条是悬浮于视口内容之上还是占据专用沟槽布局空间。 |
| `viewportClassName` | `string` | `undefined` | 内部滚动视口元素的额外 CSS 类。 |
```

## ScrollBar 属性 {#scroll-bar-props}

ScrollBar 是 Scroll Area 为其滚动条渲染的子组件；直接组合使用时适用以下属性。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | 滚动条方向轴。 |
| `size` | `'default' \| 'sm'` | `'default'` | 滚动条密度与尺寸。 |
| `floating` | `boolean` | `true` | 滚动条是悬浮于视口内容之上还是占据专用沟槽布局空间。 |
| `hitSize` | `number \| string` | `8` | 透明指针捕获热区的厚度。 |
| `collapsedSize` | `number \| string` | `4` | 静息时视觉指示器的厚度。 |
| `expandedSize` | `number \| string` | `8` | 悬停时视觉指示器的厚度。 |
```
