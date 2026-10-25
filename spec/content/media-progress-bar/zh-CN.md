---
id: media-progress-bar
component: media-progress-bar
category: Forms & Inputs
title: MediaProgressBar
description: 通用媒体播放进度条，支持拖拽擦洗、点击定位、悬停预览、左下方位置/总长时间显示、点击翻转正/倒计时与右键格式菜单。
---

## 动效规范 {#animations}

交互状态的动效行为与时间节奏，严格遵循 ChaSet 令牌体系。

- 状态切换（悬停、按下、聚焦）在 `duration-quick` 时长内以 `ease-standard` 缓动曲线过渡。
- 动效时长与缓动直接解析自主题令牌，启用减弱动效偏好（`prefers-reduced-motion`）时将自动置零；Qt 端由 `ThemeTokens.animationsEnabled` 集中管控该开关。

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| ← / → | 按步长增量向前／向后快进快退 |
| Home / End | 直接跳转至媒体开头／末尾 |
| Space | 切换播放／暂停或触发进度跳转 |
| Tab / Shift + Tab | 在可交互控件之间移动焦点 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `ratio` | `number` | `0` | 播放进度比例（0.0 至 1.0）。 |
| `duration` | `number` | `0` | 媒体总时长（毫秒）。 |
| `position` | `number` | `0` | 当前播放位置（毫秒）。 |
| `frameRate` | `number` | `30` | 基于帧的时间格式所用的帧率。 |
| `timingMode` | `"elapsed" \| "remaining"` | `"elapsed"` | 计时模式：正计时或剩余倒计时。 |
| `timeFormat` | `"hms" \| "seconds" \| "frames"` | `"hms"` | 时间戳显示格式。 |
| `showTime` | `boolean` | `true` | 是否在下方显示时间读数。 |
| `showThumb` | `boolean` | `true` | 是否显示进度滑块手柄。 |
| `interactive` | `boolean` | `true` | 是否启用指针定位／拖拽。 |
| `disabled` | `boolean` | `false` | 禁用状态。 |
```
