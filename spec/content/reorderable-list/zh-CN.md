---
id: reorderable-list
component: reorderable-list
category: Composite Engines
title: Reorderable List
description: 支持拖拽排序、缝隙对齐指示线与 Alt 独占切换的可重排操作列表。
---

## Animations {#animations}

拖拽重排与操作切换的动效与交互反馈规范。

- 在拖拽抓取过程中，被提升的行项在 `duration-quick`（90ms）内通过 `ease-standard` 平滑应用悬浮阴影与背景高亮。
- 接缝插入指示线（带圆点标记）在计算的目标槽位实时跟随光标渲染，零延迟响应位置映射。
- 操作图标在激活强调色与非激活弱化色之间通过 `duration-quick`（90ms）平滑切换。
- 完整遵从 Web 端的 `prefers-reduced-motion` 与 Qt 桌面端的 `ThemeTokens.animationsEnabled`。

## Keyboard Navigation {#keyboard}

组件支持的键盘交互与快捷键规范。

```table shortcuts
| Key | Interaction |
| --- | --- |
| Tab / Shift+Tab | 在列表项与末尾操作按钮之间循环切换焦点 |
| Space / Enter | 切换当前聚焦的操作按钮开关状态 |
| Alt+单击 / Alt+Enter | 触发单项独占（Solo）或全量反转切换 |
| ↑ / ↓ | 在连续的列表行项之间垂直移动焦点 |
```

## Props Reference {#props}

跨端属性遵循统一的名称与语义；`Type` 对应 TypeScript 类型签名。

```table props
| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `ReorderableListItem[]` | `[]` | 列表数据项对象数组，包含 id、label/name、可选 icon 及操作布尔字段。 |
| `rowHeight` | `number` | `30` | 每行逻辑行高（单位为设备无关像素）。 |
| `reorderable` | `boolean` | `true` | 是否允许通过拖拽手柄调整列表项顺序。 |
| `actionColumns` | `ReorderableActionColumn[]` | `[]` | 末尾操作按钮列配置，包含图标、Tooltip 与快捷键定义。 |
| `defaultActionKey` | `string` | `'visible'` | 当未显式指定 actionColumns 时默认绑定的布尔属性键。 |
| `onItemsEdited` | `(items: ReorderableListItem[]) => void` | `undefined` | 当顺序改变或任一操作列状态变动时触发的回调，回抛最新完整 items 数组。 |
| `onItemsReordered` | `(from: number, to: number, items: ReorderableListItem[]) => void` | `undefined` | 拖拽重排完成时触发的回调。 |
| `onActionTriggered` | `(index: number, key: string, value: boolean) => void` | `undefined` | 单个操作按钮被点击切换时触发的回调。 |
```
