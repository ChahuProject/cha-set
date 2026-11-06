---
id: filter-popup
component: filter-popup
category: Overlays & Feedback
title: Filter Popup
description: Multi-dimensional facet filtering popup with search, exclusions, ratings and shortcuts.
---

## Keyboard Navigation {#keyboard}

组件支持的无指针键盘操作，与常规交互行为保持严格对齐。

```table shortcuts
| Key | Behavior |
| --- | --- |
| Printable Char | 输入任意可打印字符，即刻展开并激活搜索框 |
| Escape | 第一按清除搜索框关键字，第二按关闭弹窗 |
| Left Click | 左键单击切换包含过滤 |
| Right Click | 右键单击切换排除过滤（红色叉叉视觉标记） |
| ArrowUp / ArrowDown | 上下方向键遍历过滤条目 |
```

## Props {#props}

双端属性名称与语义完全一致；`Type` 为 TypeScript 签名类型。

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `""` | 弹窗顶部标题栏文案。 |
| `icon` | `string` | `""` | 标题前置图标名称。 |
| `items` | `FilterPopupItem[]` | `[]` | 过滤条目数组。 |
| `open` | `boolean` | `false` | 受控的弹窗开启/关闭状态。 |
| `searchEnabled` | `boolean` | `true` | 是否启用搜索功能。 |
| `searchVisibility` | `'autoHidden' \| 'always'` | `'autoHidden'` | 搜索栏展现模式（自动隐藏按键展开或常驻）。 |
| `showLogicToggle` | `boolean` | `false` | 是否显示 AND / OR 逻辑切换分段器。 |
| `logicMode` | `'and' \| 'or'` | `'and'` | 激活的布尔筛选逻辑模式。 |
| `hasActive` | `boolean` | `false` | 本维度是否有生效的过滤条件。 |
```
