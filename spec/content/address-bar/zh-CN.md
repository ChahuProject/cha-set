---
id: address-bar
component: address-bar
category: Composite Engines
title: Address Bar
description: 资源管理器与浏览器风格的地址导航栏，具备可交互的面包屑路径分段与行内路径即时编辑功能。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| Alt + D / Ctrl + L | 切换至路径编辑模式并全选文本 |
| Enter | 提交编辑后的路径并触发页面跳转 |
| Escape | 取消编辑模式并恢复为面包屑导航显示 |
| Alt + Left / Alt + Right | 触发历史后退或前进导航 |
| Alt + Up | 导航跳转至上一级父目录 |
| F5 / Ctrl + R | 刷新当前活动路径 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `path` | `string` | `''` | 在面包屑与编辑模式下渲染的当前路径字符串。 |
| `defaultValue` | `string` | `''` | 非受控用法下的初始路径字符串。 |
| `onNavigate` | `(path: string) => void` | `undefined` | 通过分段点击或 Enter 提交新路径时触发的回调。 |
| `showNavButtons` | `boolean` | `true` | 是否显示后退、前进、向上与刷新导航按钮。 |
| `canGoBack` | `boolean` | `false` | 启用后退历史导航按钮。 |
| `canGoForward` | `boolean` | `false` | 启用前进历史导航按钮。 |
| `suggestions` | `string[]` | `[]` | 下拉浮层中自动补全路径字符串列表。 |
| `history` | `string[]` | `[]` | 用于下拉展示的最近输入路径历史。 |
| `showSearch` | `boolean` | `false` | 是否在右侧显示集成搜索／过滤输入框。 |
| `fileSystemAdapter` | `AddressBarFileSystemAdapter` | `defaultVirtualFileSystemAdapter` | 提供子文件夹枚举与建议查询的文件系统适配器。 |
| `onNavigateWithSelection` | `(path: string, selectionPath: string) => void` | `undefined` | 选中特定文件项并导航时触发的回调。 |
| `disabled` | `boolean` | `false` | 禁用全部交互与输入编辑。 |
```
