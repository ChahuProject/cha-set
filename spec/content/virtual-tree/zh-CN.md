---
id: virtual-tree
component: virtual-tree
category: Desktop & Virtualization
title: Virtual Tree
description: 虚拟化层级树视图组件，支持节点动态折叠展开、多选/单选、剪切复制粘贴及键盘空间导航。
---

## 键盘导航 {#keyboard}

本节列出该组件支持的键盘操作，与无鼠标操作时的行为一致。

```table shortcuts
| 按键 | 行为 |
| --- | --- |
| ↑ / ↓ | 在可见树节点之间移动虚拟焦点 |
| Shift + ↑ / ↓ | 在树节点之间扩展多选范围 |
| → | 展开折叠的文件夹节点或进入首个子节点 |
| ← | 折叠已展开的文件夹节点或跳转至父级节点 |
| Space | 切换当前聚焦节点的选中状态 |
| Enter | 展开／折叠文件夹节点或激活叶子节点 |
| Ctrl + C | 复制选中节点并保持高亮提示 |
| Ctrl + X | 剪切选中节点并显示虚线暗化高亮 |
| Ctrl + V | 将复制或剪切的节点粘贴至选中文件夹 |
| Escape | 取消当前剪切或复制的剪贴板状态 |
| Delete | 从虚拟树层级中删除选中节点 |
| Home / End | 直接跳转至虚拟树中首个／末尾节点 |
```

## 属性 {#props}

属性名与语义在两端一致；`类型` 列给的是 TypeScript 签名。

```table props
| 属性 | 类型 | 默认值 | 描述 |
| --- | --- | --- | --- |
| `rootNodes` | `readonly T[]` | `[]` | 顶层层级节点数组。 |
| `nodes` | `readonly T[]` | `[]` | rootNodes 的别名。 |
| `getChildren` | `(node: T) => readonly T[]` | `(node) => node.children` | 返回节点子节点的访问器。 |
| `getNodeKey` | `(node: T) => string` | `(node) => node.id` | 节点的唯一标识访问器。 |
| `selectionMode` | `'single' \| 'multiple' \| 'none'` | `'single'` | 当前的选择交互模式。 |
| `selectedId` | `string \| null` | `null` | 当前选中节点的标识（单选模式）。 |
| `selectedIds` | `readonly string[]` | `[]` | 已选中节点标识数组（多选模式）。 |
| `dimmedIds` | `readonly string[]` | `[]` | 以半透明剪切态渲染的节点 ID 数组。 |
| `stickyItems` | `readonly VirtualTreeStickyItem[]` | `[]` | 展开节点祖先链，置顶于滚动区上方以保持父级可见。 |
| `onStickySelect` | `(item: VirtualTreeStickyItem) => void` | `undefined` | 点击置顶行时触发的回调（仅导航，永不切换展开）。 |
| `onStickyToggle` | `(item: VirtualTreeStickyItem) => void` | `undefined` | 激活置顶行折叠箭头时触发的回调。 |
| `enableDnd` | `boolean` | `false` | 启用拖拽重排与文件夹嵌套。 |
| `onSelectionChange` | `(ids: string[], nodes: T[]) => void` | `undefined` | 选中节点变化时触发的回调。 |
| `onDropNode` | `(evt: VirtualTreeDropEvent<T>) => void` | `undefined` | 节点被放置时触发的回调。 |
| `onCut` | `(nodes: T[], ids: string[]) => void` | `undefined` | 按下 Ctrl+X 剪切快捷键时触发的回调。 |
| `onPaste` | `(target: T \| null, pos: string) => void` | `undefined` | 按下 Ctrl+V 粘贴快捷键时触发的回调。 |
| `defaultExpandDepth` | `number` | `0` | 子分支的默认展开层级。 |
| `estimateSize` | `number` | `32` | 虚拟计算用的预估行高。 |
| `gap` | `number` | `0` | 相邻行之间的间距。 |
| `overscan` | `number` | `10` | 可视边界外渲染的缓冲节点数。 |
| `renderRow` | `(context: VirtualTreeRowContext<T>) => ReactNode` | `undefined` | 自定义行渲染函数。 |
| `emptyNode` | `ReactNode` | `null` | 树为空时展示的内容。 |
| `ref` | `Ref<VirtualTreeHandle>` | `undefined` | 暴露 expandAll()、collapseAll()、selectAll()、scrollToIndex() 的句柄。 |
```
