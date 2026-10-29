// ChaSetAdaptivePopup.qml — Content-Driven Adaptive Height Popup
//
// 契约（Non-Necessary-No-Scrollbar）：
//   空间够显示 → 弹窗撑到内容自然高度，**绝不出滚动条**；
//   空间不够 → 才按宿主可用空间封顶并启用滚动。
//
// 设计要点（三条硬性不变量，缺一不可）：
//   1. 【高度必须是量出来的，不是估出来的】
//      高度一律取「头部自然高 + 内容自然高」，禁止按分支手算、禁止硬编码兜底常量。
//      过去各宿主自己写 `desiredTotalHeight`（按 tab 分支 + 写死 330/520/580 兜底），
//      只要某个时刻内容尚未排版就取到兜底值，导致「明明放得下却被封顶」。
//   2. 【内容测量容器必须是常驻可见的 Column】
//      Qt 的 Positioner 只对**可见**子项求和，故 Column.implicitHeight 天然等于
//      「当前可见的那一项」的高度；而 childrenRect.height 会把不可见子项也算进去
//      （实测：可见 100 / 隐藏 300 / 隐藏 500 → implicitHeight=100，childrenRect=500）。
//      因此 tab 面板必须是 Column 的**子项**并由各自 visible 切换，
//      禁止把 Column 自身设为不可见（那样量到的是脏值）。
//   3. 【定位必须是绑定，不能是命令式赋值】
//      x/y 一律写成 clamp 绑定。命令式 `root.y = ...` 会永久销毁宿主的 y 绑定，
//      窗口缩放后弹窗停在陈旧位置 → 可用空间被低估 → 长期卡在封顶态。
//
// 用法：
//   ChaSetAdaptivePopup {
//       anchorY: btn.y + btn.height + 4      // 期望顶部（宿主坐标系）
//       anchorX: btn.x
//       width: ThemeTokens.dp(400)
//
//       RowLayout { ... }                     // 头部（固定不滚动）
//       // ↓ 以下为默认属性，进入可滚动内容区
//       Column { visible: tabs.currentValue === "a"; ... }
//       Column { visible: tabs.currentValue === "b"; ... }
//   }
import QtQuick
import QtQuick.Controls
import ChaSet

Popup {
    id: root

    // ---- 尺寸与定位契约 ----
    /// 封顶保护下限（宿主空间极端不足时不至于塌成一条）
    property real minHeight: ThemeTokens.dp(120)
    /// 显式封顶（<=0 表示完全交给宿主空间自动计算）
    property real maxHeight: -1
    /// 期望左上角（宿主父项坐标系）。x/y 由本组件按可用空间 clamp 后写入。
    property real anchorX: 0
    property real anchorY: 0
    /// 与宿主边缘的安全间距
    property real edgeMargin: ThemeTokens.dp(12)
    /// 内容区左右内缩
    property real contentInset: ThemeTokens.dp(16)
    /// true：可用高度取整条宿主纵向可用带（必要时会把弹窗上移吃掉上方空间）；
    /// false：只取「锚点以下」的剩余空间（锚点固定不动，更保守）。
    property bool useFullHostBand: true

    // ---- 内容挂载点 ----
    /// 固定头部区（不随内容滚动）
    property alias headerItems: headerHost.data
    /// 可滚动内容区（默认属性）。必须是**常驻可见**的容器，
    /// 由内部子项各自的 visible 决定谁参与测量。
    default property alias contentItems: contentHost.data
    /// 供宿主调用 scrollToTop() 等
    readonly property alias scrollArea: viewport
    /// 两个宿主容器的直接句柄（便于宿主做程序化装配与测试断言）
    readonly property alias headerRoot: headerHost
    readonly property alias contentRoot: contentHost

    // ---- 测量（全部只读、全部响应式）----
    readonly property real headerHeight: headerHost.implicitHeight
    readonly property real contentNaturalHeight: contentHost.implicitHeight
    /// 内容完整显示所需的总高（向上取整，杜绝亚像素误差触发滚动条）
    readonly property real desiredHeight: Math.ceil(root.headerHeight + root.contentNaturalHeight)

    // ---- 宿主可用空间 ----
    // Popup 不是 Item，禁止对它取 `root.Window.window`（Qt 报
    // "Window.window only supports types derived from Item"）。合法路径只有
    // Overlay 浮层（同窗口）或自身是 Item 的父项附加属性。
    readonly property var hostWindow: {
        const ov = Overlay.overlay
        if (ov && ov.Window && ov.Window.window)
            return ov.Window.window
        if (root.parent && root.parent.Window)
            return root.parent.Window.window
        return null
    }

    readonly property real hostBandHeight: {
        const win = root.hostWindow
        if (win && win.height > 0)
            return win.height
        if (root.parent && root.parent.height > 0)
            return root.parent.height
        return 0
    }

    readonly property real hostBandWidth: {
        const win = root.hostWindow
        if (win && win.width > 0)
            return win.width
        if (root.parent && root.parent.width > 0)
            return root.parent.width
        return 0
    }

    /// 锚点在宿主窗口坐标系中的 y（用于把窗口空间换算回父项坐标系）
    readonly property real anchorTopInHost: {
        const win = root.hostWindow
        if (win && win.contentItem && root.parent && typeof root.parent.mapToItem === "function") {
            const m = root.parent.mapToItem(win.contentItem, root.anchorX, root.anchorY)
            if (m && typeof m.y === "number" && !isNaN(m.y))
                return m.y
        }
        return root.anchorY
    }

    /// 可用高度上限（避开 Popup 的 FINAL availableHeight）。刻意只依赖 hostBandHeight / anchorTopInHost / maxHeight，
    /// **不依赖 root.y 与 root.height**，从根源断开「高度↔位置」的绑定回环。
    readonly property real hostAvailableHeight: {
        let usable
        if (root.hostBandHeight <= 0) {
            usable = 0
        } else if (root.useFullHostBand) {
            usable = root.hostBandHeight - root.edgeMargin * 2
        } else {
            usable = root.hostBandHeight - Math.max(root.edgeMargin, root.anchorTopInHost) - root.edgeMargin
        }
        if (root.maxHeight > 0)
            usable = Math.min(usable, root.maxHeight)
        return Math.max(root.minHeight, usable)
    }

    height: Math.max(root.minHeight, Math.min(root.desiredHeight, root.hostAvailableHeight))
    implicitHeight: root.height

    /// 是否真的被宿主空间截断了 —— 滚动条出现的唯一合法依据。
    readonly property bool heightCapped: root.height < root.desiredHeight - 1.0

    // 定位一律为绑定：绝不命令式写 root.x / root.y（会销毁宿主的绑定）。
    x: {
        if (root.hostBandWidth <= 0)
            return root.anchorX
        const maxX = root.hostBandWidth - root.width - root.edgeMargin
        return Math.max(root.edgeMargin, Math.min(root.anchorX, Math.max(root.edgeMargin, maxX)))
    }
    y: {
        // 窗口坐标系下允许的最低顶边 → 换算回父项坐标系
        const maxYInHost = root.hostBandHeight - root.height - root.edgeMargin
        const offset = root.anchorTopInHost - root.anchorY
        const maxYInParent = maxYInHost - offset
        return Math.max(root.edgeMargin, Math.min(root.anchorY, Math.max(root.edgeMargin, maxYInParent)))
    }

    padding: 0
    topPadding: 0
    bottomPadding: 0
    leftPadding: 0
    rightPadding: 0

    contentItem: Item {
        width: root.width
        // 用 Popup 内建的 availableHeight（= height - 上下 padding），
        // 而非本组件的 hostAvailableHeight（那是宿主窗口可用带）。
        height: root.height - root.topPadding - root.bottomPadding
        implicitHeight: root.desiredHeight

        // ---- 固定头部（不参与滚动）----
        Column {
            id: headerHost
            width: parent.width
            height: implicitHeight
        }

        // ---- 内容滚动视口 ----
        ChaSetScrollArea {
            id: viewport
            y: headerHost.height
            width: parent.width
            height: Math.max(0, parent.height - headerHost.height)
            clip: true
            floating: true
            // 必须闭合横向度量：ChaSetScrollArea 默认 contentWidth 派生自
            // childrenRect，而面板内容宽度又派生自 scrollArea.width，两者构成回环
            // （Qt 报 "Binding loop detected for property contentWidth"）。
            contentWidth: availableWidth
            contentHeight: contentHost.implicitHeight

            // 内容宿主：**常驻可见**的 Column。
            // 不可见子项被 Positioner 跳过 ⇒ implicitHeight 恒等于当前可见项高度。
            Column {
                id: contentHost
                x: root.contentInset
                width: Math.max(0, viewport.width - root.contentInset * 2)
            }
        }
    }
}
