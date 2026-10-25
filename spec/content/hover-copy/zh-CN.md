---
id: hover-copy
component: hover-copy
category: Base Primitives
title: Hover Copy
description: 为任意内容提供悬浮变暗遮罩与居中复制按钮，点击遮罩任意位置即可复制，成功显示勾选图标。
---

## 动效规范 {#animations}

悬停复制浮层与图标状态切换遵循 ChaSet 动效令牌规范。

- 遮罩层显隐在 `duration-quick` 内以 `ease-standard` 缓动曲线平滑过渡（Qt 端对应 `ThemeTokens.motionQuick` + `easeStandard`）。
- 静息到复制成功图标切换采用 `duration-short` 令牌。
- 动效时长与缓动由 `ThemeTokens.animationsEnabled` 与 `prefers-reduced-motion` 集中管控，恢复倒计时为逻辑时间不受动效开关影响。

## 键盘导航 {#keyboard}

Tab 聚焦居中按钮，Enter 或 Space 执行复制，点击遮罩任意位置同样复制，移开焦点后遮罩消失。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Tab | 将焦点移至居中复制按钮（浮出遮罩） |
| Space / Enter | 复制所配置的文本并显示勾选图标 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `text` | `string` | `''` | 要复制的文本，可与展示内容不同（展示可被截断）。 |
| `children` | `ReactNode` | `undefined` | 被遮罩包裹的任意内容，不对子标签做任何假设。 |
| `dim` | `number` | `0.45` | 悬浮遮罩的黑色蒙版透明度，范围 0 到 1，默认 0.45。 |
| `radius` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | 遮罩圆角语义值：none、sm、md、lg 或 full（pill）。 |
| `icon` | `'copy' \| 'check'` | `'copy'` | 常态浮层图标语义名，默认 copy。 |
| `copiedIcon` | `'copy' \| 'check'` | `'check'` | 复制成功后的图标语义名，默认 check。 |
| `resetTime` | `number` | `1000` | 复制成功后恢复常态的间隔毫秒数，默认 1000。 |
| `disabled` | `boolean` | `false` | 禁用后不显示浮层且不触发复制。 |
| `onCopy` | `(text: string) => void` | `undefined` | 复制成功回调，参数为被复制的文本。 |
| `onError` | `(error: unknown) => void` | `undefined` | 复制失败回调。 |
```
