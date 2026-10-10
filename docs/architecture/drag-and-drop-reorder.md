# Drag-and-Drop Reordering & Insertion Geometry Specification

> Cross-stack specification for list and tree drag-and-drop reordering, slot geometry, collinear insertion indicators, and visual affordances across React Web and Qt Quick Desktop.

---

## 1. 核心问题与设计原则

在列表与树形结构的拖拽重排中，传统粗糙实现常见两大体验缺陷：

1. **边框伪装与双重非共线指示线 (Dual Non-Collinear Lines)**：
   - 插入指示线仅以 2px 矩形简单贴在行项内部（如 \nchors.top: parent.top\ 或 \nchors.bottom: parent.bottom\）。
   - 由于行项具备圆角（\adius: 4\）与内边距，这看起来像高亮了元素本身的「边框」而非两项之间的「插入位置」。
   - 更严重的是：项 A 的底边处于 [Y - 2, Y]，项 B 的顶边处于 [Y, Y + 2]。当鼠标在两项中间微小晃动时，指示线在两个不同物理坐标之间来回跳跃，产生「两处能高亮的线」的不良体验。
2. **缺乏中线槽位二分判定 (Improper Hit Testing)**：
   - 仅检测鼠标是否处在元素内部，一旦落入元素内部就武断将其置于元素「上方」或「下方」。
   - 用户无法通过瞄准元素的下半部或上半部来自然决定插入项与该元素的前后相对关系。

### 规范四律

- **严格居中共线律**：两个相邻元素中间的插入指示线，物理中心必须精确对齐两元素之间的接缝（seam）。
- **中线分割槽位律**：列表项按几何垂直中心线（50% 高度）二分，上半部映射到上方缝隙，下半部映射到下方缝隙。
- **经典起点圆点特征律**：插入指示线左端附带实体圆点标记（\●──────────────\），明确传达「在此槽位插入」的语义，彻底区别于节点边框与选中框。
- **树结构三态命中区分割律**：容器节点区分内部收容（\inside\，中间 50% 区域高亮外框）与接缝重排（\efore\/\fter\，上下各 25% 缝隙居中线）。

---

## 2. 几何映射模型 (Geometric Mapping Model)

### 2.1 列表重排槽位模型 (0 .. N)

设有 N 个列表项（索引 0 .. N - 1），每项行高为 H。
整个列表共有 N + 1 个插入缝隙槽位（slot 0 .. N）：

| 槽位 (Slot) | 物理接缝 Y 坐标 | 插入语义 |
| :--- | :--- | :--- |
| **Slot 0** | Y = 0 | 插入到第 0 项之前（列表最顶端） |
| **Slot 1** | Y = H | 插入到第 0 项与第 1 项之间 |
| **Slot i** | Y = i * H | 插入到第 i-1 项与第 i 项之间 |
| **Slot N** | Y = N * H | 插入到第 N-1 项之后（列表最底端） |

#### 映射计算公式
当拖拽项中心或光标绝对场景 Y 坐标为 Y_scene 时：
slot = Math.max(0, Math.min(N, Math.round(Y_scene / H)))

- 当光标位于项 i 的上半部（[i * H, (i + 0.5) * H)）：round = i -> 映射到 Slot i（项 i 上方接缝）。
- 当光标位于项 i 的下半部（[(i + 0.5) * H, (i + 1) * H)）：round = i + 1 -> 映射到 Slot i + 1（项 i 下方接缝）。

#### 释放落点换算
当从源下标 from 拖动到目标插槽 slot 时：
- 若 slot === from || slot === from + 1：落点在原地，无需变动（指示线自动隐藏）。
- 若 from < slot（向下拖拽）：在移除源项后，目标下标为 targetIndex = slot - 1。
- 若 from > slot（向上拖拽）：目标下标为 targetIndex = slot。

---

## 3. 指示线视觉与共线实现规范

### 3.1 尺寸与样式
- **线宽与线高**：横向铺满内容区（或继承父容器边距），高度 D = 2px（ThemeTokens.dp(2)）。
- **起点圆点 (Bullet Notch)**：直径 6px（ThemeTokens.dp(6)），圆角 3px，垂直居中对齐于指示线，左端缩进对齐。
- **指示颜色**：ThemeTokens.focus（或 ThemeTokens.accent）。

### 3.2 Qt Quick (QML) 标准实现

\\\qml
// 顶部插入指示线（居中于顶缝，物理中心 Y = 0）
Rectangle {
    visible: isDropTarget && root.dropPosition === "before" && root.isDropValid
    anchors.top: parent.top
    anchors.topMargin: -Math.round(ThemeTokens.dp(2) / 2) // 关键：居中偏移
    anchors.left: parent.left
    anchors.right: parent.right
    height: ThemeTokens.dp(2)
    color: ThemeTokens.focus
    z: 20

    Rectangle {
        width: ThemeTokens.dp(6)
        height: ThemeTokens.dp(6)
        radius: ThemeTokens.dp(3)
        color: parent.color
        anchors.verticalCenter: parent.verticalCenter
        anchors.left: parent.left
        anchors.leftMargin: ThemeTokens.dp(-2)
    }
}

// 底部插入指示线（居中于底缝，物理中心 Y = H）
Rectangle {
    visible: isDropTarget && root.dropPosition === "after" && root.isDropValid
    anchors.bottom: parent.bottom
    anchors.bottomMargin: -Math.round(ThemeTokens.dp(2) / 2) // 关键：居中偏移
    anchors.left: parent.left
    anchors.right: parent.right
    height: ThemeTokens.dp(2)
    color: ThemeTokens.focus
    z: 20

    Rectangle {
        width: ThemeTokens.dp(6)
        height: ThemeTokens.dp(6)
        radius: ThemeTokens.dp(3)
        color: parent.color
        anchors.verticalCenter: parent.verticalCenter
        anchors.left: parent.left
        anchors.leftMargin: ThemeTokens.dp(-2)
    }
}
\\\

### 3.3 React (TSX / Tailwind) 标准实现

\\\	sx
{/* Top Seam Indicator */}
{isTarget && isDropValid && dropPos === 'before' && (
  <div
    data-slot="drop-indicator-before"
    className="absolute top-0 left-0 right-0 h-0.5 bg-primary z-20 pointer-events-none -translate-y-1/2 flex items-center"
  >
    <div className="size-1.5 rounded-full bg-primary -ml-0.5 shrink-0" />
  </div>
)}

{/* Bottom Seam Indicator */}
{isTarget && isDropValid && dropPos === 'after' && (
  <div
    data-slot="drop-indicator-after"
    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary z-20 pointer-events-none translate-y-1/2 flex items-center"
  >
    <div className="size-1.5 rounded-full bg-primary -ml-0.5 shrink-0" />
  </div>
)}
\\\

---

## 4. 树结构命中区分割 (Tree 3-State Hit Testing)

树节点根据其能力与展开状态，分为两套命中区策略：

1. **容器节点（带子项目录）**：
   - 顶部 25%：\efore\ 槽位，显示顶缝居中线。
   - 中间 50%：\inside\ 槽位，显示节点外框与微进度条（禁止显示线条）。
   - 底部 25%：若节点已展开，则放入首个子节点；若节点已折叠，显示底缝居中线。
2. **叶子节点（或仅重排列表）**：
   - 上半部 50%：\efore\ 槽位。
   - 下半部 50%：\fter\ 槽位。
   - 两者指示线均严格居中于接缝，保证鼠标掠过接缝时线条绝对共线无抖动。
