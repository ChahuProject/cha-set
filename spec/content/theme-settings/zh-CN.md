---
id: theme-settings
component: theme-settings
category: Composite Engines
title: Theme Settings
description: 跨端主题配置面板，统一管控外观模式、强调色调色板、装饰圆角阴影级别与界面缩放密度。
---

## 动效规范 {#animations}

主题配置界面在按钮、分段控件、取色器与抽屉切换时使用统一动效令牌。

- 状态过渡在 `duration-quick` 时长内以 `ease-standard` 缓动过渡。
- 动效支持减弱动效偏好，由 Web 端的 `prefers-reduced-motion` 和 Qt 端的 `ThemeTokens.animationsEnabled` 作为全局开关。

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Tab / Shift + Tab | 在设置行与可交互控件之间导航 |
| Space / Enter | 切换分段控制器，触发重置或导出操作 |
| ← / → / ↑ / ↓ | 调整滑块数值或选取调色板色样 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `config` | `ThemeConfig` | `DEFAULT_THEME_CONFIG` | 包含 mode、palette、decoration、typography 与 uiScale 的规范主题配置对象。 |
| `onChange` | `(next: ThemeConfig) => void` | `undefined` | 任一主题属性变化时触发的回调。 |
| `onReset` | `() => void` | `undefined` | 重置按钮被激活时触发的回调。 |
| `onExport` | `(configJson: string) => void` | `undefined` | 导出配置 JSON 时触发的回调。 |
| `onImport` | `(jsonString: string) => boolean \| void` | `undefined` | 导入并解析配置 JSON 时触发的回调。 |
| `disabled` | `boolean` | `false` | 禁用全部交互控件并降低不透明度。 |
| `showReset` | `boolean` | `true` | 是否在头部显示重置按钮。 |
| `showExport` | `boolean` | `true` | 是否在头部显示导出 JSON 按钮。 |
| `showImport` | `boolean` | `true` | 是否在头部显示导入按钮。 |
| `showTypography` | `boolean` | `false` | 是否渲染字体家族与缩放选择行。 |
| `textProvider` | `(key: string, defaultText: string) => string` | `undefined` | 可选国际化字符串解析回调。 |
```
