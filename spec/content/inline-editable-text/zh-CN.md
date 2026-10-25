---
id: inline-editable-text
component: inline-editable-text
category: Forms & Inputs
title: Inline Editable Text
description: 双击或触发编辑态即可无缝切换为输入框的文本元素。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Enter | 聚焦时进入编辑模式；编辑中则提交变更 |
| Escape | 取消编辑并恢复原始文本内容 |
| Tab | 提交当前编辑内容并将焦点推进至下一个元素 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value` | `string` | `''` | 当前文本值。 |
| `onValueChange` | `(v: string) => void` | `undefined` | 确认编辑时调用的回调。 |
| `onSave` | `(v: string) => void \| boolean \| Promise<void \| boolean>` | `undefined` | 异步保存处理函数；返回 false 则保持编辑模式。 |
| `trigger` | `"click" \| "doubleClick"` | `"click"` | 打开行内输入框的鼠标手势。 |
| `size` | `"default" \| "sm"` | `"default"` | 密度与尺寸变体。 |
| `placeholder` | `string` | `''` | 值为空时的占位符。 |
| `hint` | `string` | `''` | 悬停提示气泡。 |
| `disabled` | `boolean` | `false` | 是否禁用行内编辑。 |
```
