// qt/src/ChaSetBreadcrumb.qml
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Layouts 6.10
import ChaSet

Item {
    id: root

    property var segments: []
    property bool disabled: false
    property int openSegmentIndex: -1
    property int firstVisibleIndex: 0
    property bool overflowVisible: false
    readonly property bool isAnyPopupOpen: overflowPopup.opened

    // —— 分段拖放状态（拖拽文件悬停到某一级面包屑即把该级目录作为投放目标）——
    property int activeDropSegmentIndex: -1
    property var activeDraggedPaths: []
    property real dropPointerX: 0
    readonly property bool isDropActive: activeDropSegmentIndex >= 0
    readonly property string activeDropPath: segmentPathAt(activeDropSegmentIndex)

    // 拖拽修饰键（Ctrl=复制）响应式追踪：宿主注入 dragModifierState 上下文属性时
    // 直接绑定其 ctrlHeld；独立运行/测试环境回退到 manualCtrlHeld（由宿主手动赋值）。
    property var dragModifierTracker: (typeof dragModifierState !== "undefined") ? dragModifierState : null
    property bool manualCtrlHeld: false
    readonly property bool dragCopyModifier: dragModifierTracker ? dragModifierTracker.ctrlHeld : manualCtrlHeld

    function closePopups() {
        overflowPopup.close()
    }

    signal navigateRequested(string path)
    signal openSubfoldersRequested(int index, string path, Item chevronItem)
    signal dropRequested(string targetPath, var urls)
    signal blankAreaClicked()

    // 解析拖拽载荷中的本地文件路径：OS 拖入优先 urls；内部拖拽（QQuick Drag）回退
    // 宿主注入路径或多行文本载荷（每行一条路径）。
    function extractDropPaths(drag) {
        var paths = []
        if (root.activeDraggedPaths && root.activeDraggedPaths.length > 0) {
            return root.activeDraggedPaths
        }
        if (drag && drag.source) {
            if (drag.source.draggedPaths && drag.source.draggedPaths.length > 0) {
                return drag.source.draggedPaths
            }
            if (drag.source.viewDraggedPaths && drag.source.viewDraggedPaths.length > 0) {
                return drag.source.viewDraggedPaths
            }
            if (drag.source.draggedIds && drag.source.draggedIds.length > 0) {
                return drag.source.draggedIds
            }
            if (drag.source.itemPath) {
                return [drag.source.itemPath]
            }
            if (drag.source.draggedId) {
                return [drag.source.draggedId]
            }
        }
        if (!drag) return paths
        if (drag.hasUrls && drag.urls && drag.urls.length > 0) {
            for (var u = 0; u < drag.urls.length; ++u) {
                var raw = String(drag.urls[u])
                var local = raw.replace(/^file:\/\/\//i, "").replace(/^file:\/\//i, "")
                if (local.length > 0) paths.push(decodeURIComponent(local))
            }
            return paths
        }
        var text = ""
        if (typeof drag.getDataAsString === "function") {
            text = drag.getDataAsString("application/x-dunting-path") || drag.getDataAsString("text/plain") || ""
        }
        if (!text && drag.text) text = drag.text
        if (text) {
            var lines = text.split("\n")
            for (var i = 0; i < lines.length; ++i) {
                var line = lines[i].replace(/\r$/, "")
                if (line.length > 0) paths.push(line)
            }
        }
        return paths
    }

    function segmentPathAt(index) {
        if (!root.segments || index < 0 || index >= root.segments.length) return ""
        var seg = root.segments[index]
        return String(seg.realPath || seg.path || "")
    }

    // 拖拽悬停到某分段：命中则记录为当前投放目标并返回其路径（宿主据此校验/高亮）。
    function updateSegmentDrop(index, drag) {
        var target = root.disabled ? "" : segmentPathAt(index)
        if (target === "" || extractDropPaths(drag).length === 0) {
            clearSegmentDrop()
            return ""
        }
        root.activeDropSegmentIndex = index
        return target
    }

    function clearSegmentDrop() {
        root.activeDropSegmentIndex = -1
    }

    // 提交投放：向宿主发出 dropRequested(targetPath, urls)，返回是否已提交。
    function commitSegmentDrop(index, drag) {
        var paths = extractDropPaths(drag)
        var target = root.disabled ? "" : segmentPathAt(index)
        clearSegmentDrop()
        if (target === "" || paths.length === 0) return false
        root.dropRequested(target, paths)
        return true
    }

    implicitHeight: ThemeTokens.dp(30)
    implicitWidth: {
        var total = 0
        if (root.segments) {
            for (var i = 0; i < root.segments.length; i++) {
                total += getSegmentWidth(i)
            }
        }
        return total
    }

    FontMetrics {
        id: segFontMetrics
        font.pixelSize: Typography.sizeSmall
        font.weight: Typography.weightRegular
    }

    FontMetrics {
        id: segBoldFontMetrics
        font.pixelSize: Typography.sizeSmall
        font.weight: Typography.weightSemibold
    }

    function getSegmentWidth(index) {
        if (!root.segments || index < 0 || index >= root.segments.length)
            return 0
        var seg = root.segments[index]
        var name = String(seg.displayName || seg.label || "")
        var fm = (index === root.segments.length - 1) ? segBoldFontMetrics : segFontMetrics
        var textW = fm.advanceWidth(name)
        var pillW = textW + ThemeTokens.dp(12)
        var hasChevron = (index < root.segments.length - 1) || (root.segments.length === 1) || Boolean(seg.hasSubfolders)
        var chevronW = hasChevron ? ThemeTokens.dp(20) : 0
        return pillW + chevronW
    }

    function relayoutSegments() {
        var count = root.segments ? root.segments.length : 0
        if (count <= 1) {
            root.firstVisibleIndex = 0
            root.overflowVisible = false
            return
        }
        var avail = root.width
        if (avail <= 0) {
            root.firstVisibleIndex = 0
            root.overflowVisible = false
            return
        }

        var overflowW = ThemeTokens.dp(26)
        var lastW = getSegmentWidth(count - 1)
        var total = lastW
        var first = count - 1

        for (var i = count - 2; i >= 0; --i) {
            var w = getSegmentWidth(i)
            var neededOverflow = (i > 0) ? overflowW : 0
            if (total + w + neededOverflow > avail) {
                break
            }
            total += w
            first = i
        }

        root.firstVisibleIndex = first
        root.overflowVisible = (first > 0)
    }

    onWidthChanged: relayoutSegments()
    onSegmentsChanged: relayoutSegments()
    Component.onCompleted: relayoutSegments()

    RowLayout {
        id: crumbsRow
        objectName: "crumbsRow"
        anchors.fill: parent
        spacing: 0

        // Overflow ellipsis button
        Rectangle {
            id: overflowBtn
            objectName: "overflowBtn"
            visible: root.overflowVisible
            Layout.preferredWidth: ThemeTokens.dp(24)
            Layout.preferredHeight: ThemeTokens.dp(26)
            Layout.alignment: Qt.AlignVCenter
            radius: ThemeTokens.dp(4)
            color: overflowMouse.containsMouse && !root.disabled ? ThemeTokens.hover : "transparent"

            Text {
                anchors.centerIn: parent
                text: "…"
                color: ThemeTokens.text
                font.pixelSize: Typography.sizeSmall
                font.bold: true
            }

            MouseArea {
                id: overflowMouse
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: !root.disabled ? Qt.PointingHandCursor : Qt.ForbiddenCursor
                onClicked: {
                    if (!root.disabled) {
                        overflowPopup.open()
                    }
                }
            }

            ChaSetTooltip {
                target: overflowBtn
                text: qsTr("显示隐藏的祖先文件夹")
                side: "bottom"
                delay: 400
                disabled: root.disabled
            }
        }

        Repeater {
            id: segRepeater
            objectName: "segRepeater"
            model: root.segments

            delegate: Item {
                id: segItem
                required property var modelData
                required property int index

                readonly property string segPath: modelData.realPath || modelData.path || ""
                readonly property string segName: modelData.displayName || modelData.label || ""
                readonly property string segIcon: modelData.icon || "folder"
                readonly property bool segHasSubfolders: Boolean(modelData.hasSubfolders)
                readonly property bool isCurrent: segItem.index === (root.segments.length - 1)
                readonly property bool isMenuOpen: segItem.index === root.openSegmentIndex
                readonly property bool isDropTarget: root.activeDropSegmentIndex === segItem.index

                visible: segItem.index >= root.firstVisibleIndex
                Layout.preferredWidth: segPill.implicitWidth + (chevronBox.visible ? chevronBox.width : 0)
                Layout.fillHeight: true

                Row {
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter
                    height: ThemeTokens.dp(26)
                    spacing: 0

                    // Segment Pill (No leading icon, auto-expanding content width)
                        Rectangle {
                            id: segPill
                            width: pillContent.implicitWidth + ThemeTokens.dp(12)
                            height: parent.height
                            implicitWidth: width
                            radius: ThemeTokens.dp(4)
                            color: segItem.isDropTarget
                                ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.22)
                                : ((pillMouse.containsMouse && !root.disabled) ? ThemeTokens.hover : "transparent")
                            // 拖拽悬停到该级：描边与背景双重高亮，明确「松手即投放到此目录」
                            border.width: segItem.isDropTarget ? 1.5 : 0
                            border.color: ThemeTokens.accent

                            Row {
                                id: pillContent
                                anchors.centerIn: parent
                                spacing: ThemeTokens.dp(4)

                                // 拖拽到该级且按住 Ctrl（复制模式）时不在面包屑内显示任何图标：
                                // 复制意图已由拖拽跟随幽灵（pageDragGhost）的 content_copy 图标表达，
                                // 面包屑内再出现复制图标属于重复示意，故移除。
                                Text {
                                    text: segItem.segName
                                    color: segItem.isDropTarget ? ThemeTokens.accent : (segItem.isCurrent ? ThemeTokens.text : ThemeTokens.subduedText)
                                    font.pixelSize: Typography.sizeSmall
                                    // 拖拽高亮严禁切换字重：Regular↔Semibold 翻转会改变文本宽度，
                                    // pill 随内容自适应加宽导致后续面包屑整体位移。高亮仅通过
                                    // 背景 / 描边 / 文字颜色表达（几何零变化），且必须与
                                    // getSegmentWidth 的度量口径（仅末级 Semibold）保持一致。
                                    font.weight: segItem.isCurrent ? Typography.weightSemibold : Typography.weightRegular
                                    verticalAlignment: Text.AlignVCenter
                                    anchors.verticalCenter: parent.verticalCenter
                                }
                            }

                            MouseArea {
                                id: pillMouse
                                objectName: "pillMouse"
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: !root.disabled ? Qt.PointingHandCursor : Qt.ForbiddenCursor
                                onClicked: {
                                    if (!root.disabled) {
                                        if (segItem.isCurrent) {
                                            root.blankAreaClicked()
                                        } else {
                                            root.navigateRequested(segItem.segPath)
                                        }
                                    }
                                }
                            }

                            ChaSetTooltip {
                                target: segPill
                                text: segItem.segPath || segItem.segName
                                side: "bottom"
                                delay: 400
                                disabled: root.disabled
                            }
                        }

                        // Independent Chevron dropdown
                        Item {
                            id: chevronBox
                            width: ThemeTokens.dp(20)
                            height: parent.height
                            visible: segItem.index < (root.segments.length - 1) || root.segments.length === 1 || segItem.segHasSubfolders

                            Rectangle {
                                anchors.fill: parent
                                radius: ThemeTokens.dp(4)
                                color: (chevronMouse.containsMouse || segItem.isMenuOpen) && !root.disabled ? ThemeTokens.hover : "transparent"
                            }

                            ChaSetIcon {
                                id: chevronIcon
                                objectName: "segChevronIcon"
                                name: "chevron-right"
                                size: 14
                                color: (chevronMouse.containsMouse || segItem.isMenuOpen) ? ThemeTokens.text : ThemeTokens.subduedText
                                anchors.centerIn: parent

                                transform: Rotation {
                                    origin.x: ThemeTokens.dp(7)
                                    origin.y: ThemeTokens.dp(7)
                                    angle: segItem.isMenuOpen ? 90 : 0
                                    Behavior on angle {
                                        NumberAnimation {
                                            duration: 120
                                            easing.type: Easing.OutCubic
                                        }
                                    }
                                }
                            }

                            MouseArea {
                                id: chevronMouse
                                objectName: "chevronMouse"
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: !root.disabled ? Qt.PointingHandCursor : Qt.ForbiddenCursor
                                onClicked: {
                                    if (!root.disabled) {
                                        if (root.openSegmentIndex === segItem.index) {
                                            root.openSegmentIndex = -1
                                        } else {
                                            root.openSegmentIndex = segItem.index
                                            root.openSubfoldersRequested(segItem.index, segItem.segPath, chevronBox)
                                        }
                                    }
                                }
                            }

                            ChaSetTooltip {
                                target: chevronBox
                                text: qsTr("展开 %1 的子文件夹").arg(segItem.segName)
                                side: "bottom"
                                delay: 400
                                disabled: root.disabled
                            }
                        }
                    }

                    // 该级分段的投放区：拖拽文件悬停即高亮，松手后由宿主把文件移动/复制到该级目录
                    DropArea {
                        id: segDropArea
                        objectName: "breadcrumbSegmentDropArea"
                        anchors.fill: parent

                        // 记录当前悬停的 drag 对象：Ctrl 按下/松开时无需移动鼠标即可重算接受状态
                        property var currentDrag: null

                        function dragIsCopy(drag) {
                            if (typeof windowUi !== "undefined" && windowUi && typeof windowUi.isCtrlDown === "function") {
                                return windowUi.isCtrlDown()
                            }
                            if (drag && drag.keyboardModifiers !== undefined) {
                                return ((drag.keyboardModifiers & Qt.ControlModifier) !== 0
                                        || (drag.keyboardModifiers & Qt.MetaModifier) !== 0)
                            }
                            return ((Qt.application.keyboardModifiers & Qt.ControlModifier) !== 0)
                                || ((Qt.application.keyboardModifiers & Qt.MetaModifier) !== 0)
                        }

                        function acceptIfTargeted(drag) {
                            var target = root.updateSegmentDrop(segItem.index, drag)
                            if (target !== "" && drag && drag.accept) {
                                drag.accept((root.dragCopyModifier || dragIsCopy(drag)) ? Qt.CopyAction : Qt.MoveAction)
                            } else if (drag && drag.accept) {
                                drag.accept(Qt.IgnoreAction)
                            }
                        }

                        Connections {
                            target: root
                            function onDragCopyModifierChanged() {
                                if (segDropArea.currentDrag) {
                                    segDropArea.acceptIfTargeted(segDropArea.currentDrag)
                                }
                            }
                        }

                        onEntered: (drag) => {
                            segDropArea.currentDrag = drag
                            var pt = segDropArea.mapToItem(root, drag.x, drag.y)
                            root.dropPointerX = pt.x
                            acceptIfTargeted(drag)
                        }
                        onPositionChanged: (drag) => {
                            segDropArea.currentDrag = drag
                            var pt = segDropArea.mapToItem(root, drag.x, drag.y)
                            root.dropPointerX = pt.x
                            acceptIfTargeted(drag)
                        }
                        onExited: {
                            segDropArea.currentDrag = null
                            root.clearSegmentDrop()
                        }
                        onDropped: (drop) => {
                            if (root.commitSegmentDrop(segItem.index, drop)
                                    && drop && typeof drop.acceptProposedAction === "function") {
                                drop.acceptProposedAction()
                            }
                        }
                    }
            }
        }

        // Blank space filler to click into edit mode or drop onto current folder
        Item {
            id: blankCrumbFiller
            Layout.fillWidth: true
            Layout.fillHeight: true

            MouseArea {
                anchors.fill: parent
                cursorShape: !root.disabled ? Qt.IBeamCursor : Qt.ForbiddenCursor
                onClicked: {
                    if (!root.disabled) {
                        root.blankAreaClicked()
                    }
                }
            }

            DropArea {
                id: blankFillerDropArea
                objectName: "breadcrumbBlankFillerDropArea"
                anchors.fill: parent
                enabled: !root.disabled

                // 记录当前悬停的 drag 对象：Ctrl 按下/松开时无需移动鼠标即可重算接受状态
                property var currentDrag: null

                function dragIsCopy(drag) {
                    if (typeof windowUi !== "undefined" && windowUi && typeof windowUi.isCtrlDown === "function") {
                        return windowUi.isCtrlDown()
                    }
                    if (drag && drag.keyboardModifiers !== undefined) {
                        return ((drag.keyboardModifiers & Qt.ControlModifier) !== 0
                                || (drag.keyboardModifiers & Qt.MetaModifier) !== 0)
                    }
                    return ((Qt.application.keyboardModifiers & Qt.ControlModifier) !== 0)
                        || ((Qt.application.keyboardModifiers & Qt.MetaModifier) !== 0)
                }

                function acceptIfTargeted(drag) {
                    var lastIdx = root.segments ? root.segments.length - 1 : -1
                    if (lastIdx < 0) return
                    var target = root.updateSegmentDrop(lastIdx, drag)
                    if (target !== "" && drag && drag.accept) {
                        drag.accept((root.dragCopyModifier || dragIsCopy(drag)) ? Qt.CopyAction : Qt.MoveAction)
                    } else if (drag && drag.accept) {
                        drag.accept(Qt.IgnoreAction)
                    }
                }

                Connections {
                    target: root
                    function onDragCopyModifierChanged() {
                        if (blankFillerDropArea.currentDrag) {
                            blankFillerDropArea.acceptIfTargeted(blankFillerDropArea.currentDrag)
                        }
                    }
                }

                onEntered: (drag) => {
                    blankFillerDropArea.currentDrag = drag
                    var pt = blankFillerDropArea.mapToItem(root, drag.x, drag.y)
                    root.dropPointerX = pt.x
                    acceptIfTargeted(drag)
                }
                onPositionChanged: (drag) => {
                    blankFillerDropArea.currentDrag = drag
                    var pt = blankFillerDropArea.mapToItem(root, drag.x, drag.y)
                    root.dropPointerX = pt.x
                    acceptIfTargeted(drag)
                }
                onExited: {
                    blankFillerDropArea.currentDrag = null
                    root.clearSegmentDrop()
                }
                onDropped: (drop) => {
                    var lastIdx = root.segments ? root.segments.length - 1 : -1
                    if (lastIdx >= 0 && root.commitSegmentDrop(lastIdx, drop)
                            && drop && typeof drop.acceptProposedAction === "function") {
                        drop.acceptProposedAction()
                    }
                }
            }
        }
    }

    ChaSetAddressBarOverflowPopup {
        id: overflowPopup
        items: {
            var list = []
            for (var i = 0; i < root.firstVisibleIndex; i++) {
                if (root.segments[i]) list.push(root.segments[i])
            }
            return list
        }
        onNavigateRequested: (targetPath) => {
            root.navigateRequested(targetPath)
        }
    }
}
