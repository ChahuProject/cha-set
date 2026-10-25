---
id: copy-button
component: copy-button
category: Base Primitives
title: Copy Button
description: 一键剪贴板复制按钮，带有短暂的成功对勾反馈和可自定义的超时时长。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Space / Enter | 复制目标文本内容至系统剪贴板 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `text` | `string \| (() => string \| Promise<string>)` | `''` | 点击时写入剪贴板的文本字符串。 |
| `label` | `string` | `''` | 图标旁的可选伴随标签。 |
| `copiedLabel` | `string` | `'Copied!'` | 复制成功后显示的标签文本。 |
| `timeout` | `number` | `2000` | 以毫秒为单位显示已复制勾选状态的时长。 |
| `variant` | `'ghost' \| 'outline' \| 'default' \| 'secondary'` | `'ghost'` | 按钮视觉变体。 |
| `size` | `'icon-xs' \| 'icon-sm' \| 'sm' \| 'default'` | `label ? 'sm' : 'icon-xs'` | 按钮尺寸预设。 |
| `onCopy` | `(copiedText: string) => void` | `undefined` | 文本复制时触发的回调。 |
```
