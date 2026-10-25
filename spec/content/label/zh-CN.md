---
id: label
component: label
category: Base Primitives
title: Label
description: 渲染与表单控件相关联的可访问性文本标签。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Click / Space | 将焦点转移至关联的表单控件 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `size` | `'default' \| 'sm'` | `'default'` | 文本尺寸变体（默认或紧凑 sm）。 |
| `disabled` | `boolean` | `false` | 非交互表单元素的半透明淡化效果 |
| `required` | `boolean` | `false` | 红色星号表示必填输入字段 |
| `optional` | `boolean` | `false` | 浅灰色标记表示非必填项 |
| `invalid` | `boolean` | `false` | 红色破坏性文字高亮显示校验错误的字段 |
| `description` | `ReactNode` | `undefined` | 渲染于标签下方的辅助说明文本。 |
| `tooltip` | `ReactNode` | `undefined` | 随 info 图标展示的上下文帮助提示文案。 |
| `htmlFor` | `string` | `undefined` | 标签所绑定的表单元素 ID。 |
| `className` | `string` | `''` | 额外的自定义 CSS 类名。 |
```
