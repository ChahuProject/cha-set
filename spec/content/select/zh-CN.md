---
id: select
component: select
category: Forms & Inputs
title: Select
description: 显示供用户挑选的下拉选项列表，由带箭头与选中指示器的触发按钮呼出。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Enter / Space / ↓ | 打开选项弹窗并高亮当前选中值 |
| ↓ / ↑ | 循环浏览选项并抑制鼠标指针高亮 |
| Home / End | 直接跳转至首个 / 最后一个可用选项 |
| Enter / Space | 选中高亮选项并关闭弹出层 |
| Escape | 关闭选项弹出层且不改变当前选择 |
| A-Z / 0-9 | 拼写快速搜索并跳转至首个匹配项 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value` | `string` | `undefined` | 受控选中值。 |
| `defaultValue` | `string` | `undefined` | 非受控用法的初始值。 |
| `onValueChange` | `(value: string) => void` | `undefined` | 数值变化时触发的回调。 |
| `disabled` | `boolean` | `false` | 选择器是否禁用。 |
```
