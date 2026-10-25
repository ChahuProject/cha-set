---
id: floating-notice
component: floating-notice
category: Overlays & Feedback
title: Floating Notice
description: 悬浮在视口顶上或底下的紧凑提示胶囊，支持优先级排序、卡片轮播排队与内容插槽扩展。
---

## 动效规范 {#animations}

浮动通知在悬停缩放与卡片切换时遵循 ChaSet 动效令牌规范。

- 悬停缩放采用 `duration-short`（120ms）配合 `ease-standard` 缓动。
- 通知轮播与指示点切换采用 `duration-quick`（90ms）。
- 关闭与移除通知时平滑淡出并滑动退出。

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Escape | 关闭当前活动的提示 |
| ← / → | 在排队中的提示之间循环切换 |
| Tab / Shift + Tab | 在关闭按钮与提示内的交互操作之间移动焦点 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `notices` | `FloatingNoticeItem[]` | `[]` | 要显示和排队的提示项列表。 |
| `placement` | `'top' \| 'bottom'` | `'top'` | 浮动提示容器的视口锚定边缘。 |
| `offset` | `number` | `16` | 距离锚定视口边缘的内边距偏移（逻辑 dp）。 |
| `gap` | `number` | `undefined (adaptive: 12dp / 10dp / 7dp)` | 堆叠提示卡片之间的间距（逻辑 dp 单位）。省略时将根据提示项数量自适应调节间距。 |
| `defaultDuration` | `number` | `3000` | 未指定持续时间时的默认显示时长（毫秒）。 |
| `pauseOnHover` | `boolean` | `true` | 鼠标悬停时是否暂停轮换与倒计时。 |
| `zoomOnHover` | `boolean` | `true` | 鼠标悬停时是否以 1.05 倍平滑微缩放提示。 |
| `closable` | `boolean` | `true` | 悬停时是否显示关闭按钮。 |
| `renderContent` | `(item: FloatingNoticeItem) => ReactNode` | `undefined` | 用于提示内容槽位的可选自定义渲染回调或委托。 |
```
