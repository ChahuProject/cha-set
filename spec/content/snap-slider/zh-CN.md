---
id: snap-slider
component: snap-slider
category: Forms & Inputs
title: Snap Slider
description: 按预设档位吸附的离散步进滑块，支持刻度标记与标签行。
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
| ← / ↓ | 步进至上一个离散吸附点 |
| → / ↑ | 步进至下一个离散吸附点 |
| Home / End | 直接跳转至第一个或最后一个刻度吸附点 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `value` | `number` | `0` | 受控的当前吸附档位索引。 |
| `defaultValue` | `number` | `0` | 非受控模式下的默认初始吸附档位索引。 |
| `count` | `number` | `5` | 离散档位总数（若提供 `labels` 则默认为其长度）。 |
| `labels` | `string[]` | `[]` | 各档位标签数组，显示于激活居中位置。 |
| `leftLabel` | `string` | `""` | 左下边缘的边界标签。 |
| `rightLabel` | `string` | `""` | 右下边缘的边界标签。 |
| `showTicks` | `boolean` | `true` | 是否在滑块轨道上显示刻度标记。 |
| `size` | `"default" \| "sm"` | `"default"` | 视觉尺寸变体。 |
| `disabled` | `boolean` | `false` | 滑块是否禁用。 |
| `readOnly` | `boolean` | `false` | 滑块是否为只读。 |
| `onChange` | `(index: number) => void` | `undefined` | 选中档位索引变化时触发的回调。 |
```
