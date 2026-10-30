// ChaSetAdaptivePopup.qml — Content-Driven Adaptive Height Popup
//
// 契约（Non-Necessary-No-Scrollbar）：
//   空间够显示 → 弹窗撑到内容自然高度，**绝不出滚动条**；
//   空间不够 → 才按宿主可用空间封顶并启用滚动。
//
// 设计要点（四条硬性不变量，缺一不可）：
//   1. 【高度必须是量出来的，不是估出来的】
//      高度一律取「头部自然高 + 内容自然高 + 页脚自然高」，禁止按分支手算、
//      禁止硬编码兜底常量（历史教训：非激活 tab 的 Column 自身不可见时
//      implicitHeight 量到脏值；硬编码兜底又比真实值还大，导致误封顶）。
//   2. 【内容测量容器必须是常驻可见的 Column】
//      Qt 的 Positioner 只对**可见**子项求和，故 Column.implicitHeight 天然等于
//      「当前可见的那一项」的高度；而 childrenRect.height 会把不可见子项也算进去
//      （实测：可见 100 / 隐藏 300 / 隐藏 500 → implicitHeight=100，childrenRect=500）。
//   3. 【定位必须是绑定，不能是命令式赋值】
//      x/y 一律写成 clamp 绑定。命令式 `root.y = ...` 会永久销毁宿主的 y 绑定，
//      窗口缩放后弹窗停在陈旧位置 → 可用空间被低估 → 长期卡在封顶态。
//      **可拖拽浮层请改 anchorX/anchorY（而非 x/y），这样绑定不会被销毁。**
//   4. 【换算一律走「父项原点在窗口坐标系的偏移」，与锚点解耦】
//      旧实现把 anchorY 本身映射进窗口坐标，一旦宿主把 anchorY 写成
//      `-height - gap`（向上展开）就会形成「高度↔位置」回环。
//      这里改用恒定的 parentOriginInHost，从根源断开回环。
//
// 用法：
//   ChaSetAdaptivePopup {
//       anchorY: btn.y + btn.height + 4      // placement "down"：期望顶边
//       anchorX: btn.x
//       width: ThemeTokens.dp(400)
//
//       headerItems: [ RowLayout { ... } ]    // 头部（固定不滚动）
//       // ↓ 默认属性，进入可滚动内容区
//       Column { visible: tabs.currentValue === "a"; ... }
//       footerItems: [ RowLayout { ... } ]    // 页脚（固定不滚动）
//   }
//
// 向上展开（紧贴锚点上方，例如状态栏详情）：
//   placement: "up"
//   anchorY: -ThemeTokens.dp(4)              // 期望**底边**（相对父项顶边）
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import ChaSet

Popup {
    id: root

    // ---- 尺寸与定位契约 ----
    /// 封顶保护下限（宿主空间极端不足时不至于塌成一条）
    property real minHeight: ThemeTokens.dp(120)
    /// 显式封顶（<=0 表示完全交给宿主空间自动计算）
    property real maxHeight: -1
    /// 期望左上角（宿主父项坐标系）。x/y 由本组件按可用空间 clamp 后写入。
    /// placement "down"：anchorY 是期望**顶边**；placement "up"：anchorY 是期望**底边**。
    property real anchorX: 0
    property real anchorY: 0
    /// 展开方向："down" 向下（默认）；"up" 向上（浮层底边贴 anchorY，向上延展）。
    property string placement: "down"
    /// 与宿主边缘的安全间距
    property real edgeMargin: ThemeTokens.dp(12)
    /// 内容区左右内缩
    property real contentInset: ThemeTokens.dp(16)
    /// true：可用高度取整条宿主纵向可用带（必要时会把弹窗上移吃掉上方空间）；
    /// false：只取「锚点一侧」的剩余空间（锚点固定不动，更保守）。
    property bool useFullHostBand: true

    // ---- 内容挂载点（头 / 体 / 尾 三段式）----
    /// 固定头部区（不随内容滚动）。用 ColumnLayout，以便子项可用 Layout.* 附加属性。
    property alias headerItems: headerHost.data
    /// 固定页脚区（不随内容滚动）。同上。
    property alias footerItems: footerHost.data
    /// 可滚动内容区（默认属性）。必须是**常驻可见**的容器，
    /// 由内部子项各自的 visible 决定谁参与测量。
    default property alias contentItems: contentHost.data
    /// 供宿主调用 scrollToTop() 等
    readonly property alias scrollArea: viewport
    /// 三个宿主容器的直接句柄（便于宿主做程序化装配与测试断言）
    readonly property alias headerRoot: headerHost
    readonly property alias footerRoot: footerHost
    readonly property alias contentRoot: contentHost

    // ---- 测量（全部只读、全部响应式）----
    readonly property real headerHeight: headerHost.implicitHeight
    readonly property real footerHeight: footerHost.implicitHeight
    readonly property real contentNaturalHeight: contentHost.implicitHeight
    /// 内容完整显示所需的总高（向上取整，杜绝亚像素误差触发滚动条）
    readonly property real desiredHeight: Math.ceil(root.headerHeight
                                                   + root.contentNaturalHeight
                                                   + root.footerHeight)

    /// 期望顶边（父项局部坐标）。向上展开时由「底边 - 自身高度」推出。
    readonly property real anchorTop: root.placement === "up"
                                      ? root.anchorY - root.height
                                      : root.anchorY

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

    /// 父项原点在宿主窗口坐标系中的 y。
    /// 刻意与 anchorX/anchorY **解耦**（恒定值），使宿主可以把 anchorY 写成
    /// `-height - gap` 而不会形成「高度↔位置」绑定回环。
    readonly property real parentOriginInHost: {
        const win = root.hostWindow
        if (win && win.contentItem && root.parent && typeof root.parent.mapToItem === "function") {
            const m = root.parent.mapToItem(win.contentItem, 0, 0)
            if (m && typeof m.y === "number" && !isNaN(m.y))
                return m.y
        }
        return 0
    }

    /// 锚点在宿主窗口坐标系中的 y
    readonly property real anchorInHost: root.parentOriginInHost + root.anchorY

    /// 可用高度上限（避开 Popup 的 FINAL availableHeight）。刻意只依赖
    /// hostBandHeight / anchorInHost / maxHeight，**不依赖 root.y 与 root.height**。
    readonly property real hostAvailableHeight: {
        let usable
        if (root.hostBandHeight <= 0) {
            // 宿主空间不可知（尚未挂到窗口 / 无父项）→ 不封顶，按内容自然展开。
            // 绝不可退化成 minHeight：那会把内容挤成一团并凭空多出滚动条。
            usable = root.desiredHeight
        } else if (root.useFullHostBand) {
            usable = root.hostBandHeight - root.edgeMargin * 2
        } else if (root.placement === "up") {
            // 只吃「窗口顶 ~ 锚点」这一段
            usable = Math.max(root.edgeMargin, root.anchorInHost) - root.edgeMargin
        } else {
            usable = root.hostBandHeight - Math.max(root.edgeMargin, root.anchorInHost) - root.edgeMargin
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
        const top = root.anchorTop
        if (root.hostBandHeight <= 0)
            return top
        // 把窗口坐标系的上下边界换算回父项坐标系
        const offset = root.parentOriginInHost
        const minTop = root.edgeMargin - offset
        const maxTop = root.hostBandHeight - root.height - root.edgeMargin - offset
        return Math.max(minTop, Math.min(top, Math.max(minTop, maxTop)))
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
        // 用 ColumnLayout 而非 Column：宿主子项惯用 Layout.* 附加属性。
        ColumnLayout {
            id: headerHost
            width: parent.width
            height: implicitHeight
            spacing: 0
        }

        // ---- 内容滚动视口 ----
        ChaSetScrollArea {
            id: viewport
            y: headerHost.height
            width: parent.width
            height: Math.max(0, parent.height - headerHost.height - footerHost.height)
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

        // ---- 固定页脚（不参与滚动）----
        ColumnLayout {
            id: footerHost
            y: Math.max(headerHost.height, parent.height - implicitHeight)
            width: parent.width
            height: implicitHeight
            spacing: 0
        }
    }
}
