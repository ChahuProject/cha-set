---
id: setting-row
component: setting-row
category: Surfaces & Layout
title: Setting Row
description: 设置表单项布局，包含标题、描述、控件槽位与锚点闪烁定位。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Tab / Shift + Tab | 聚焦设置行内部的嵌入控件 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `name` | `ReactNode \| string` | — | 设置项的主要标题标签。 |
| `description` | `ReactNode \| string` | — | 次要说明性副标题文本。 |
| `icon` | `ReactNode \| string` | — | 可选的前置图标或徽标头像。 |
| `badge` | `ReactNode \| string` | — | 标题旁可选的尾随徽标标签。 |
| `size` | `'default' \| 'sm'` | `'default'` | 密度尺寸变体（'default' 或 'sm'）。 |
| `highlightId` | `string` | — | 用于锚点跳转定位的唯一标识。 |
| `highlightTarget` | `string` | — | 当前激活目标标识；与 highlightId 匹配时触发脉冲。 |
| `highlight` | `boolean` | `false` | 直接强制激活高亮动画的布尔覆盖。 |
| `disabled` | `boolean` | `false` | 设置行与控件是否置灰禁用。 |
```
