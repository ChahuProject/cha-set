---
id: table-of-contents
component: table-of-contents
category: Surfaces & Layout
title: 目录树
description: 带导轨线、激活指示器与横幅偏移适配的层级大纲导航树。
---

## 动效规范 {#animations}

交互状态的动效行为与时间节奏，严格遵循 ChaSet 令牌体系。

- 状态切换（悬停、按下、聚焦）在 `duration-quick` 时长内以 `ease-standard` 缓动曲线过渡。
- 动效时长与缓动直接解析自主题令牌，启用减弱动效偏好（`prefers-reduced-motion`）时将自动置零；Qt 端由 `ThemeTokens.animationsEnabled` 集中管控该开关。

## 键盘导航 {#keyboard}

整棵大纲只占一个 Tab 停靠点。聚焦后用 [[↑]] / [[↓]] 在条目间移动，[[Home]] / [[End]] 直达首尾，[[Space]] 或 [[Enter]] 激活并滚动到目标章节，[[Tab]] / [[Shift+Tab]] 移入移出导航。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| [[↑]] / [[↓]] | 在大纲条目间移动选中项 |
| [[Home]] / [[End]] | 直接跳到第一个 / 最后一个条目 |
| [[Space]] / [[Enter]] | 激活选中条目并滚动到目标章节 |
| [[Tab]] / [[Shift+Tab]] | 移入 / 移出大纲导航 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名，Qt 侧见 `ChaSetTableOfContents`。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `items` | `TocItem[]` | `[]` | 带层级与嵌套子项的大纲条目数组。 |
| `activeId` | `string` | `""` | 当前激活的章节 ID。 |
| `topOffset` | `number \| string` | `0` | 吸顶定位的上方偏移，用于适配全局公告横幅。 |
| `targetOffset` | `number` | `0` | 安全滚动偏移，确保标题不被顶部横幅遮挡。 |
| `variant` | `"default" \| "track" \| "flat"` | `"default"` | 大纲容器的视觉样式变体。 |
| `size` | `"default" \| "sm"` | `"default"` | 大纲标签的尺寸密度与字号缩放。 |
| `showTrack` | `boolean` | `true` | 是否渲染垂直导轨与激活指示标记。 |
| `showTitle` | `boolean` | `true` | 是否显示头部标题标签。 |
| `title` | `string` | `"On this page"` | 显示于大纲条目上方的头部标题文本。 |
| `onSelect` | `(item: TocItem, event) => void` | — | 选中或激活大纲条目时触发的回调。 |
```

