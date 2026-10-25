---
id: language-settings
component: language-settings
category: Composite Engines
title: Language Settings
description: 跨端语言偏好设置卡片，提供系统语言自动检测、即时生效切换与文化诗词意境引语。
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
| Tab / Shift + Tab | 在跟随系统与语言选择卡片之间导航 |
| Space / Enter | 选中当前聚焦的语言卡片并应用语言偏好 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `preference` | `LocalePreference ("system" \| string)` | `"system"` | 当前语言偏好，“system”或明确的语言代码。 |
| `onPreferenceChange` | `(next: LocalePreference) => void` | — | 用户选择其他语言或切换系统模式时触发的回调。 |
| `showFollowSystem` | `boolean` | `true` | 是否显示带系统检测的 Follow System 突出选项卡片。 |
| `variant` | `"card" \| "embedded"` | `"card"` | 视觉容器变体。“card”渲染带标题的外层边框卡片；“embedded”渲染无外框内联内容。 |
| `disabled` | `boolean` | `false` | 语言选择控件是否禁用。 |
| `textProvider` | `(key: string, defaultText?: string) => string` | — | 用于覆盖组件文案的可选自定义翻译函数。 |
```
