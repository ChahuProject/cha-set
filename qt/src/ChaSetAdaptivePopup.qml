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
//   5. 【坐标系必须统一：clamp 边界与期望位置必须同处一个空间】
//      期望位置（anchorRect / desiredLeft）在**父项局部坐标**，
//      窗口边界（viewportInParent）必须**换算到同一父项坐标系**后再比较。
//      严禁把窗口坐标系的边界直接作用于父项局部坐标的期望位置：
//      两者错位量恰为父项原点的全局偏移（本例 1864px），
//      会把本应合法的 -344 误判为越界并顶成 +12 → 弹窗整体右移冲出右缘。
//   6. 【换算必须能被重算：mapToItem 的结果不会自动失效】
//      `mapToItem()` 内部读取的祖先几何**不登记 QML 依赖**，
//      所以视口矩形会永久冻结在「父项还在 (0,0)」的首帧求值值上；
//      而且「依赖属性值没变 ⇒ 下游不重算」，仅仅自增一个 revision 计数器
//      是**推不动**任何下游绑定的。
//      正解：用「定位依赖令牌」把锚点几何 + 父项祖先链几何 + 版本号打包成
//      一个可判别的数组，令牌一变，所有几何绑定必然重算。
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
    /// **首选锚定契约**：直接给出触发弹窗的控件（按钮），由本组件负责把它
    /// 映射成父项坐标并 clamp。宿主**严禁**再手算 anchorX/anchorY ——
    /// 历史回归的根因正是宿主在绑定里调用 `mapToItem`：布局未完成时它求值到
    /// (0,0)，而 `mapToItem` 内部的属性读取不会登记 QML 依赖，于是绑定的
    /// 「旧坐标」永久冻结，弹窗整体飞到窗口左上角（或右边缘之外）。
    property Item anchorItem: null
    /// 锚点控件与弹窗之间的间距
    property real gap: ThemeTokens.dp(4)
    /// 水平对齐（仅 anchorItem 生效）："start" 左对齐｜"end" 右对齐｜"center" 居中
    property string anchorAlign: "end"
    /// 可选显式容器视口（默认为 null，即顶层窗口）。
    /// 当设置了 container 时，弹窗将被限制在该容器内部自适应伸缩与 clamp，
    /// 不会超出容器边界。
    property Item container: null
    /// 旧契约（保留兼容：拖拽浮层 / 居中弹窗仍可显式声明坐标）。
    /// 期望左上角（宿主父项坐标系）。x/y 由本组件按可用空间 clamp 后写入。
    /// placement "down"：anchorY 是期望**顶边**；placement "up"：anchorY 是期望**底边**。
    /// 只要 anchorItem 有效就优先使用 anchorItem，本组属性不参与计算。
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
    /// 弹窗圆角半径
    property real customRadius: ThemeTokens.dp(8)

    /// 记录最近一次由于外部点击触发关闭的时间戳（毫秒）
    property double lastOutsideCloseMsecs: 0

    /// 便捷切换方法（内建外部点击防重开守卫）
    function toggle() {
        if (Date.now() - root.lastOutsideCloseMsecs < 400) {
            root.lastOutsideCloseMsecs = 0
            return
        }
        if (root.visible) {
            root.close()
        } else {
            root.open()
        }
    }

    closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

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

    /// 打开 / 关闭 / 视口变化时自增，强制定位绑定复算一次真实 mapToItem。
    property int anchorRevision: 0

    /// 【定位依赖令牌】把「锚点几何 + 父项祖先链几何 + 打开版本号」打包成一个
    /// **每次求值都必然不同**的令牌。
    ///
    /// 为什么必须是「令牌」而不是几个 real：
    ///   QML 的绑定传播规则是「依赖属性的**值**变了才通知下游」。
    ///   旧实现把 revision 读进 binding 后丢弃（`const _depRev = root.anchorRevision`），
    ///   revision 自增后 anchorDependency 的**值没变** → 下游 viewportInParent /
    ///   desiredLeft 根本不重算 → 弹窗永远停在**首帧求值**时的旧坐标。
    ///   历史症状：查看器设置面板整体右移 1864px，右缘冲到 2256px（窗口仅 1920px）。
    ///
    /// 另一个要点：`mapToItem()` 内部读取的祖先几何**不会**登记 QML 依赖，
    /// 所以祖先链必须在这里显式读一遍 —— 祖先一动，令牌就变，定位必然重算。
    /// 少了这一段，视口矩形会永久冻结在「父项还在 (0,0)」时算出的旧值。
    ///
    /// 令牌用**数组**而非数值求和：求和会碰撞（祖先左移 10px 与窗口收窄 20px
    /// 可能抵成同一个和），数组则是逐元素可判别、且每次求值都是新对象。
    readonly property var positionDependency: {
        const it = root.anchorItem
        const tok = [root.anchorRevision]
        tok.push(it ? it.x : 0, it ? it.y : 0, it ? it.width : 0, it ? it.height : 0)
        const ct = root.container
        if (ct)
            tok.push(ct.x, ct.y, ct.width, ct.height)
        let node = root.parent
        let guard = 0
        while (node && guard < 64) {
            const nx = node.x
            const ny = node.y
            const nw = node.width
            const nh = node.height
            if (nx !== undefined && ny !== undefined)
                tok.push(nx, ny)
            if (nw !== undefined && nh !== undefined)
                tok.push(nw, nh)
            // 注意：必须沿 QML `parent` 链上溯，**不能**用 `parentItem`：
            // Qt 6 的 Item 在 QML 侧 **没有** parentItem 属性
            // （实测 `typeof item.parentItem === "undefined"`），
            // 用它会让链条在第一层就断掉 —— 父项平移/改尺寸永远不触发重算，
            // 弹窗的 clamp 边界会停留在旧值，越界时拉不回窗口内。
            // 非 Item 节点（窗口等）没有 x/width，被上面的 undefined 守卫跳过。
            node = node.parent
            ++guard
        }
        return tok
    }

    /// 显式依赖：锚点控件自身几何 + 打开态 + 祖先链几何。
    /// 数值里混入 revision，保证「版本变了 ⇒ 值变了 ⇒ 下游必然重算」。
    readonly property real anchorDependency: {
        const tok = root.positionDependency
        if (!root.anchorItem)
            return tok[0] * 100000 - 1
        return tok[0] * 100000 + tok[1] + tok[2] + tok[3] + tok[4]
    }
    // 用 Connections 而非 onOpened/onClosed：派生组件常自带 onOpened 处理器，
    // 那会整体覆盖基类的同名处理器，导致打开瞬间的复算被悄悄吞掉。
    // aboutToShow 在真正显示前触发 —— 在这里复算，弹窗第一帧就落在正确位置，
    // 不会先出现在旧坐标再跳一下。
    Connections {
        target: root
        function onAboutToShow() { root.anchorRevision++ }
        function onOpened() { root.anchorRevision++ }
        function onClosed() {
            root.anchorRevision++
            root.lastOutsideCloseMsecs = Date.now()
        }
    }

    /// 锚点矩形（**父项坐标系**）。anchorItem 优先；无 anchorItem 时退化为
    /// 旧契约的 (anchorX, anchorY) 零点。
    readonly property rect anchorRect: {
        const _tok = root.positionDependency
        const it = root.anchorItem
        const p = root.parent
        if (it && p && typeof it.mapToItem === "function") {
            const q = it.mapToItem(p, 0, 0)
            if (q && !isNaN(q.x) && !isNaN(q.y))
                return Qt.rect(q.x, q.y, it.width, it.height)
        }
        return Qt.rect(root.anchorX, root.anchorY, 0, 0)
    }

    /// 期望顶边（父项局部坐标）。向上展开时由「底边 - 自身高度」推出。
    readonly property real anchorTop: root.placement === "up"
                                      ? root.desiredBottom - root.height
                                      : root.desiredTop
    /// 期望顶边（placement "down"）：锚点底边 + gap
    readonly property real desiredTop: root.anchorItem
                                       ? root.anchorRect.y + root.anchorRect.height + root.gap
                                       : root.anchorY
    /// 期望底边（placement "up"）：锚点顶边 - gap
    readonly property real desiredBottom: root.anchorItem
                                          ? root.anchorRect.y - root.gap
                                          : root.anchorY
    /// 期望左边（父项局部坐标）
    readonly property real desiredLeft: {
        const _tok = root.positionDependency
        if (!root.anchorItem)
            return root.anchorX
        const r = root.anchorRect
        if (root.anchorAlign === "start")
            return r.x
        if (root.anchorAlign === "center")
            return r.x + (r.width - root.width) / 2
        return r.x + r.width - root.width         // "end"：右边缘对齐
    }

    // ---- 宿主可用视口（Viewport）与空间 ----
    // 唯一可信的可用视口 = **顶层窗口的内容项**。
    // 历史事故：曾用「沿 parent 链取面积最大的祖先」当视口 —— 只要链上存在
    // 一个比窗口还大的容器（横向滚动的画布/工作区节点），hostBandWidth 就会
    // 大于真实窗口，clamp 上限被放宽到窗口之外，弹窗于是贴着右边缘冲出去。
    // 视口与窗口尺寸必须是同一个真相源，故这里只认窗口内容项（无窗口时退回
    // Overlay，再退回父项）。
    readonly property Item hostViewport: {
        if (root.container)
            return root.container
        const p = root.parent
        let win = null
        if (p) {
            // Item 自带的 window 属性（QQuickItem::window），无需额外 import，
            // 且在「弹窗尚未挂进窗口」时也不会抛异常。
            win = p.window || null
            if (!win && p.Window && p.Window.window)
                win = p.Window.window
        }
        if (win && win.contentItem)
            return win.contentItem
        try {
            if (Overlay.overlay)
                return Overlay.overlay
        } catch (e) {}
        return p
    }

    /// 视口在**父项坐标系**中的矩形。
    /// 用「两个角点分别投影」而不是「视口宽度 + 原点偏移」：父链上存在
    /// transform 时（全局 UI 缩放就是挂在内容根上的 Scale），宽度与坐标分属
    /// 不同单位，直接拿 `viewport.width` 当父项单位会整体偏掉一个缩放倍率，
    /// 于是 clamp 上限落错位置 —— 弹窗要么提前贴边、要么冲出窗口。
    readonly property rect viewportInParent: {
        const vp = root.hostViewport
        // 直接依赖令牌：令牌每次求值都是新对象 ⇒ 这里必然随「打开 / 锚点移动 /
        // 祖先移动」重算，绝不会冻结在首帧的旧坐标上。
        const _tok = root.positionDependency
        const p = root.parent
        if (!vp || !p || typeof vp.mapToItem !== "function")
            return Qt.rect(0, 0, 0, 0)
        try {
            const a = vp.mapToItem(p, 0, 0)
            const b = vp.mapToItem(p, vp.width, vp.height)
            if (isNaN(a.x) || isNaN(a.y) || isNaN(b.x) || isNaN(b.y))
                return Qt.rect(0, 0, 0, 0)
            return Qt.rect(a.x, a.y, b.x - a.x, b.y - a.y)
        } catch (e) {}
        return Qt.rect(0, 0, 0, 0)
    }

    readonly property real hostBandHeight: {
        const h = root.viewportInParent.height
        if (h !== 0)
            return h
        if (root.parent && root.parent.height > 0)
            return root.parent.height
        return 0
    }

    readonly property real hostBandWidth: {
        const w = root.viewportInParent.width
        if (w !== 0)
            return w
        if (root.parent && root.parent.width > 0)
            return root.parent.width
        return 0
    }

    /// 父项原点在宿主视口坐标系中的 y（= 视口顶边在父项坐标中的偏移取反）。
    /// 刻意与 anchorX/anchorY **解耦**（恒定值），使宿主可以把 anchorY 写成
    /// `-height - gap` 而不会形成「高度↔位置」绑定回环。
    readonly property real parentOriginInHost: {
        const _tok = root.positionDependency
        return -root.viewportInParent.y
    }

    /// 父项原点在宿主视口坐标系中的 x。
    /// 刻意与 anchorX/anchorY 解耦（恒定值）。
    readonly property real parentOriginInHostX: {
        const _tok = root.positionDependency
        return -root.viewportInParent.x
    }

    /// 锚点边缘在宿主窗口坐标系中的 y（"down" 取期望顶边，"up" 取期望底边）。
    /// 刻意**不含自身 height**，否则会形成「高度 ↔ 位置」绑定回环。
    readonly property real anchorInHost: {
        const oy = root.parentOriginInHost
        return oy + (root.placement === "up" ? root.desiredBottom : root.desiredTop)
    }

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
        const left = root.desiredLeft
        if (root.hostBandWidth <= 0)
            return left
        // 把窗口坐标系的左右边界换算回父项坐标系
        const offset = root.parentOriginInHostX
        const minLeft = root.edgeMargin - offset
        const maxLeft = root.hostBandWidth - root.width - root.edgeMargin - offset
        if (maxLeft < minLeft)
            return left
        return Math.max(minLeft, Math.min(left, maxLeft))
    }
    y: {
        const top = root.anchorTop
        if (root.hostBandHeight <= 0)
            return top
        // 把窗口坐标系的上下边界换算回父项坐标系
        const offset = root.parentOriginInHost
        const minTop = root.edgeMargin - offset
        const maxTop = root.hostBandHeight - root.height - root.edgeMargin - offset
        if (maxTop < minTop)
            return top
        return Math.max(minTop, Math.min(top, maxTop))
    }

    padding: 0
    topPadding: 0
    bottomPadding: 0
    leftPadding: 0
    rightPadding: 0

    background: ChaSetSquircle {
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        radius: root.customRadius
    }

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
