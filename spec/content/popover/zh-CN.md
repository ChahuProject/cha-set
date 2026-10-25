---
id: popover
component: popover
category: Overlays & Feedback
title: Popover
description: 在锚定于触发器的浮动 Portal 中展示富交互内容，具备无障碍焦点管理。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Enter / Space | 从触发器切换气泡弹窗显示状态 |
| Tab | 将键盘焦点移入气泡弹窗交互内容中 |
| Escape | 关闭气泡弹窗并恢复焦点至触发器 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `open` | `boolean` | `undefined` | 受控打开状态。 |
| `defaultOpen` | `boolean` | `false` | 非受控模式下的默认打开状态。 |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | 打开状态变化处理函数。 |
| `modal` | `boolean` | `false` | 是否以带背景遮罩的模态形式渲染气泡弹窗。 |
| `side` | `'top' \| 'bottom' \| 'left' \| 'right'` | `'bottom'` | 相对触发器的放置方位。 |
| `align` | `'start' \| 'center' \| 'end'` | `'start'` | 沿锚定边的对齐方式。 |
| `sideOffset` | `number` | `8` | 距触发器的距离偏移。 |
| `alignOffset` | `number` | `0` | 沿对齐边的偏移距离。 |
| `arrow` | `boolean` | `false` | 是否渲染锚定指向箭头。 |
| `movable` | `boolean` | `false` | 是否启用通过手柄拖拽位移。 |
| `moveLabel` | `string` | `'Drag to move'` | 拖拽手柄按钮的无障碍标签。 |
```
