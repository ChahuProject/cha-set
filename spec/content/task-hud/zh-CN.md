---
id: task-hud
component: task-hud
category: Overlays & Feedback
title: Task HUD
description: 后台任务浮动执行栈，支持进度展示、溢出收纳与折叠摘要。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Tab | 以单个 Tab 制表位进入任务堆叠区并聚焦最近的卡片 |
| ↑ / ↓ | 在堆叠卡片之间轮转切换巡回焦点 |
| Home / End | 跳转至堆叠中首张或末张卡片 |
| Space / Enter | 激活当前聚焦卡片的关闭或取消控件 |
| Escape | 离开展开列表，并将任务堆叠收起为摘要行 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `tasks` | `TaskItem[]` | `[]` | 要呈现的后台执行，最旧在前；最新卡片最靠近锚点。 |
| `onDismiss` | `(id: string) => void` | `undefined` | 渲染每卡片的关闭控件；省略则卡片不可关闭。 |
| `onCancel` | `(id: string) => void` | `undefined` | 为标记为可取消的运行中任务渲染取消控件。 |
| `maxVisible` | `number` | `3` | 堆栈溢出为“show all”胶囊前渲染的卡片数。 |
| `autoHideDelay` | `number` | `600` | 清空后的 HUD 在淡出前于屏幕停留的宽限期（毫秒）。 |
| `placement` | `"top-left" \| "top-center" \| "top-right" \| "left-center" \| "right-center" \| "bottom-left" \| "bottom-center" \| "bottom-right"` | `'bottom-right'` | 视口锚点。卡片经由锚定边进入与退出。 |
| `offset` | `number` | `16` | 距锚定视口边缘的内缩距离（逻辑单位）。 |
| `collapsible` | `boolean` | `true` | 提供折叠为汇总行控件。 |
| `defaultCollapsed` | `boolean` | `false` | 首次绘制时以折叠状态渲染堆栈。 |
| `forceVisible` | `boolean` | `false` | 无任务运行时仍保持 HUD 挂载（用于静态沙盒）。 |
| `label` | `string` | `'Task Progress HUD'` | HUD 区域的无障碍名称。 |
```

每个 TaskItem 携带 id、title、可选 detail、状态（queued｜running｜success｜warning｜error｜cancelled）、进度比例（或不定）、total／done 步骤计数与 elapsedMs。
