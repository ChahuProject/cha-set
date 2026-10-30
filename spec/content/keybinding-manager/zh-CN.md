---
id: keybinding-manager
component: keybinding-manager
category: Composite Engines
title: 快捷键管理器
description: 跨栈快捷键管理与设置界面组件，支持逆向按键搜索、多键位绑定、冲突检测与原厂重置。
---

## 动效设计 {#animations}

KeybindingManager 使用统一的动效令牌，在搜索框、作用域筛选器、按键录制胶囊及冲突解决浮层之间提供平滑的状态流转。

- 微交互（悬停、聚焦与胶囊点击）采用 `duration-quick` 与 `ease-standard`。
- 录制中的脉冲呼吸动画与冲突警示态接入项目标准关键帧动效。
- 全局降级开关：遵循 Web 端的 `prefers-reduced-motion` 与 Qt 端的 `ThemeTokens.animationsEnabled`。

## 键盘导航 {#keyboard}

本组件支持的键盘交互操作，在无鼠标操作时提供完整的可访问性支持。

```table shortcuts
| 按键 | 交互行为 |
| --- | --- |
| Tab / Shift + Tab | 在搜索输入框、作用域下拉框、动作行及各功能按钮间循环导航 |
| Space / Enter | 激活当前选中的快捷键胶囊进入录制状态，或触发操作按钮 |
| Escape | 取消当前的按键录制，保持原有快捷键不变 |
| Backspace / Delete | 清空聚焦的快捷键组合 |
| ↑ / ↓ | 在过滤后的动作列表中上下移动焦点 |
```

## 属性参考 {#props}

双端属性名称与语义完全对齐；`Type` 给出对应的 TypeScript 类型签名。

```table props
| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `actions` | `KeybindingActionItem[]` | `[]` | 动作项目列表，包含 id、name、chords、defaultChords 等数据。 |
| `scopes` | `KeybindingScope[]` | `[]` | 可用的应用程序作用域列表，用于过滤和冲突判定。 |
| `sections` | `KeybindingSection[]` | `[]` | 动作逻辑分组，用于渲染分类标题。 |
| `onBindingChange` | `(actionId: string, chordIndex: number, newKey: string) => void` | `undefined` | 动作快捷键修改或清空时触发的回调函数。 |
| `onResetAction` | `(actionId: string) => void` | `undefined` | 重置指定动作为默认快捷键时触发的回调。 |
| `onResetAll` | `() => void` | `undefined` | 恢复所有快捷键为出厂默认值时触发的回调。 |
| `onExportCheatSheet` | `(markdown: string) => void` | `undefined` | 导出快捷键速查表 Markdown 文本时触发的回调。 |
| `searchable` | `boolean` | `true` | 是否显示顶栏搜索框（支持普通文本与逆向快捷键搜索）。 |
| `allowMultiChord` | `boolean` | `true` | 是否允许单个动作绑定多个备选快捷键。 |
| `allowResetAll` | `boolean` | `true` | 是否显示恢复全部默认快捷键按钮。 |
| `allowExportCheatSheet` | `boolean` | `true` | 是否显示导出速查表按钮。 |
| `showSourceBadge` | `boolean` | `true` | 是否在动作行显示【用户】/【内置】来源徽章。 |
| `showScopeBadge` | `boolean` | `true` | 是否在动作行显示所属作用域徽章。 |
| `layout` | `'grouped-list' \| 'flat-table'` | `'grouped-list'` | 布局形态：分组卡片列表或平铺表格。 |
| `disabled` | `boolean` | `false` | 是否禁用整个快捷键管理界面。 |
| `className` | `string` | `undefined` | 附加到容器顶层的 CSS 类名。 |
```
