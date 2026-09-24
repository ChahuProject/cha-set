// ChaSetVirtualTree.qml — Cross-Stack Virtual Tree Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    focus: true
    activeFocusOnTab: true

    property var nodes: [] // [{ id, label, children: [...] }]
    property string selectedId: ""
    property var selectedIds: []
    property string selectionMode: "single" // "single" | "multiple" | "none"
    property var dimmedIds: []
    property var copiedIds: []
    property var expandedIds: ({})
    property int defaultExpandDepth: 0
    property int estimateSize: 28
    readonly property int effectiveEstimateSize: ThemeTokens.dp(estimateSize)
    property int gap: 0
    property int overscan: 10
    property int customRadius: 6
    readonly property int effectiveRadius: ThemeTokens.dp(customRadius)

    // Drag and Drop properties
    property bool enableDnd: false
    property bool isDragging: false
    property bool isCtrlHeld: false
    property string draggedId: ""
    property var draggedIds: []
    property string dropTargetId: ""
    property string dropPosition: "" // "before" | "inside" | "after"
    property bool isDropValid: true

    property int anchorIndex: -1

    signal nodeSelected(string nodeId)
    signal nodeCut(var ids)
    signal nodeCopied(var ids)
    signal nodePasted(string targetId, string position)
    signal nodeDeleted(var ids)
    signal nodeDropped(var sourceIds, string targetId, string position, bool isCopy)

    implicitWidth: ThemeTokens.dp(320)
    implicitHeight: ThemeTokens.dp(280)

    // Flatten tree items based on active expansion state
    function flatten(list, depth) {
        let res = []
        if (!list) return res
        for (let i = 0; i < list.length; i++) {
            let n = list[i]
            let hasCh = !!(n.children && n.children.length > 0)
            let isExp = root.expandedIds[n.id] !== undefined ? !!root.expandedIds[n.id] : (depth < root.defaultExpandDepth)
            res.push({
                id: n.id,
                label: n.label,
                depth: depth,
                hasChildren: hasCh,
                isExpanded: isExp
            })
            if (hasCh && isExp) {
                let sub = flatten(n.children, depth + 1)
                for (let j = 0; j < sub.length; j++) res.push(sub[j])
            }
        }
        return res
    }

    readonly property var flatItems: flatten(root.nodes, 0)

    function isSelected(id) {
        if (root.selectionMode === "multiple") {
            return root.selectedIds && root.selectedIds.indexOf(id) !== -1
        }
        return root.selectedId === id
    }

    function isDimmed(id) {
        return root.dimmedIds && root.dimmedIds.indexOf(id) !== -1
    }

    function isCopied(id) {
        return root.copiedIds && root.copiedIds.indexOf(id) !== -1
    }

    function selectAll() {
        if (root.selectionMode !== "multiple") return
        var ids = []
        for (var i = 0; i < root.flatItems.length; i++) {
            ids.push(root.flatItems[i].id)
        }
        root.selectedIds = ids
        if (ids.length > 0) root.selectedId = ids[0]
    }

    function clearSelection() {
        root.selectedIds = []
        root.selectedId = ""
        root.anchorIndex = -1
    }

    function handleNodeClick(nodeIndex, modifiers) {
        if (root.selectionMode === "none" || nodeIndex < 0 || nodeIndex >= root.flatItems.length) return
        var item = root.flatItems[nodeIndex]
        root.currentIndex = nodeIndex

        if (root.selectionMode === "single") {
            root.selectedId = item.id
            root.selectedIds = [item.id]
            root.anchorIndex = nodeIndex
            root.nodeSelected(item.id)
            return
        }

        // Multiple selection mode
        var isShift = (modifiers & Qt.ShiftModifier)
        var isCtrl = (modifiers & Qt.ControlModifier) || (modifiers & Qt.MetaModifier)

        if (isShift && root.anchorIndex >= 0) {
            var start = Math.min(root.anchorIndex, nodeIndex)
            var end = Math.max(root.anchorIndex, nodeIndex)
            var newIds = isCtrl ? root.selectedIds.slice() : []
            for (var i = start; i <= end; i++) {
                var currId = root.flatItems[i].id
                if (newIds.indexOf(currId) === -1) newIds.push(currId)
            }
            root.selectedIds = newIds
            root.selectedId = item.id
            root.nodeSelected(item.id)
        } else if (isCtrl) {
            var copy = root.selectedIds.slice()
            var idx = copy.indexOf(item.id)
            if (idx !== -1) {
                copy.splice(idx, 1)
            } else {
                copy.push(item.id)
            }
            root.selectedIds = copy
            root.selectedId = item.id
            root.anchorIndex = nodeIndex
            root.nodeSelected(item.id)
        } else {
            root.selectedIds = [item.id]
            root.selectedId = item.id
            root.anchorIndex = nodeIndex
            root.nodeSelected(item.id)
        }
    }

    function isDescendantOrSelf(ancestorId, targetId) {
        if (!ancestorId || !targetId) return false
        if (ancestorId === targetId) return true
        function checkNode(node) {
            if (node.id === ancestorId) {
                function scanSub(child) {
                    if (child.id === targetId) return true
                    if (child.children) {
                        for (var j = 0; j < child.children.length; j++) {
                            if (scanSub(child.children[j])) return true
                        }
                    }
                    return false
                }
                if (node.children) {
                    for (var i = 0; i < node.children.length; i++) {
                        if (scanSub(node.children[i])) return true
                    }
                }
                return false
            }
            if (node.children) {
                for (var k = 0; k < node.children.length; k++) {
                    if (checkNode(node.children[k])) return true
                }
            }
            return false
        }
        for (var r = 0; r < root.nodes.length; r++) {
            if (checkNode(root.nodes[r])) return true
        }
        return false
    }

    function isDropValidFor(targetId) {
        if (!targetId) return false
        var srcList = root.draggedIds.length > 0 ? root.draggedIds : (root.draggedId ? [root.draggedId] : [])
        for (var i = 0; i < srcList.length; i++) {
            if (root.isDescendantOrSelf(srcList[i], targetId)) return false
        }
        return true
    }

    function resetDragState() {
        root.isDragging = false
        root.draggedId = ""
        root.draggedIds = []
        root.dropTargetId = ""
        root.dropPosition = ""
        root.isCtrlHeld = false
    }

    function executeDrop(forceCopy) {
        if (!root.enableDnd || !root.isDragging) {
            root.resetDragState()
            return
        }

        var canDrop = root.isDropValid && root.dropTargetId !== ""
        var targetId = root.dropTargetId
        var targetPos = root.dropPosition
        var srcList = root.draggedIds.length > 0 ? root.draggedIds.slice() : (root.draggedId ? [root.draggedId] : [])
        var isCopy = root.isCtrlHeld || (forceCopy === true)

        if (canDrop && targetPos === "inside") {
            let expCopy = Object.assign({}, root.expandedIds)
            expCopy[targetId] = true
            root.expandedIds = expCopy
        }

        // Clean up all drag states on root BEFORE emitting nodeDropped!
        // This ensures that when consumer mutates treeNodes and ListView rebuilds delegates,
        // all new delegates initialize with isDropTarget: false, eliminating any stuck insertion lines.
        root.resetDragState()

        if (canDrop && srcList.length > 0 && targetId !== "") {
            root.nodeDropped(srcList, targetId, targetPos, isCopy)
        }
    }

    function toggleExpand(id) {
        let copy = Object.assign({}, root.expandedIds)
        let currentExp = copy[id]
        if (currentExp === undefined) {
            let found = false
            function findDepth(list, d) {
                if (!list || found) return
                for (let i = 0; i < list.length; i++) {
                    if (list[i].id === id) {
                        currentExp = d < root.defaultExpandDepth
                        found = true
                        return
                    }
                    if (list[i].children) findDepth(list[i].children, d + 1)
                }
            }
            findDepth(root.nodes, 0)
        }
        copy[id] = !currentExp
        root.expandedIds = copy
    }

    function expandAll() {
        let all = {}
        function collect(list) {
            if (!list) return
            for (let i = 0; i < list.length; i++) {
                let n = list[i]
                if (n.children && n.children.length > 0) {
                    all[n.id] = true
                    collect(n.children)
                }
            }
        }
        collect(root.nodes)
        root.expandedIds = all
    }

    function collapseAll() {
        root.expandedIds = ({})
    }

    function scrollToIndex(index) {
        if (treeList) {
            treeList.positionViewAtIndex(index, ListView.Beginning)
            root.currentIndex = index
        }
    }

    property int currentIndex: -1
    property string modality: "keyboard"
    property real lastPointerX: -1
    property real lastPointerY: -1

    Keys.onDownPressed: function(event) {
        event.accepted = true
        root.modality = "keyboard"
        if (root.flatItems.length > 0) {
            var nextIdx = Math.min(root.flatItems.length - 1, Math.max(0, root.currentIndex + 1))
            root.currentIndex = nextIdx
            if (event.modifiers & Qt.ShiftModifier && root.selectionMode === "multiple") {
                if (root.anchorIndex < 0) root.anchorIndex = root.currentIndex
                root.handleNodeClick(nextIdx, event.modifiers)
            } else {
                root.selectedId = root.flatItems[root.currentIndex].id
                root.selectedIds = [root.selectedId]
                root.nodeSelected(root.selectedId)
            }
            treeList.positionViewAtIndex(root.currentIndex, ListView.Contain)
        }
    }

    Keys.onUpPressed: function(event) {
        event.accepted = true
        root.modality = "keyboard"
        if (root.flatItems.length > 0) {
            var prevIdx = Math.max(0, root.currentIndex - 1)
            root.currentIndex = prevIdx
            if (event.modifiers & Qt.ShiftModifier && root.selectionMode === "multiple") {
                if (root.anchorIndex < 0) root.anchorIndex = root.currentIndex
                root.handleNodeClick(prevIdx, event.modifiers)
            } else {
                root.selectedId = root.flatItems[root.currentIndex].id
                root.selectedIds = [root.selectedId]
                root.nodeSelected(root.selectedId)
            }
            treeList.positionViewAtIndex(root.currentIndex, ListView.Contain)
        }
    }

    Keys.onRightPressed: function(event) {
        if (root.currentIndex >= 0 && root.currentIndex < root.flatItems.length) {
            event.accepted = true
            let curr = root.flatItems[root.currentIndex]
            if (curr.hasChildren) {
                if (!curr.isExpanded) {
                    root.toggleExpand(curr.id)
                } else if (root.currentIndex + 1 < root.flatItems.length) {
                    root.currentIndex += 1
                    root.selectedId = root.flatItems[root.currentIndex].id
                    root.selectedIds = [root.selectedId]
                    root.nodeSelected(root.selectedId)
                    treeList.positionViewAtIndex(root.currentIndex, ListView.Contain)
                }
            }
        }
    }

    Keys.onLeftPressed: function(event) {
        if (root.currentIndex >= 0 && root.currentIndex < root.flatItems.length) {
            event.accepted = true
            let curr = root.flatItems[root.currentIndex]
            if (curr.hasChildren && curr.isExpanded) {
                root.toggleExpand(curr.id)
            } else if (curr.depth > 0) {
                // Find parent node
                for (let i = root.currentIndex - 1; i >= 0; i--) {
                    if (root.flatItems[i].depth === curr.depth - 1) {
                        root.currentIndex = i
                        root.selectedId = root.flatItems[i].id
                        root.selectedIds = [root.selectedId]
                        root.nodeSelected(root.selectedId)
                        treeList.positionViewAtIndex(root.currentIndex, ListView.Contain)
                        break
                    }
                }
            }
        }
    }

    Keys.onPressed: function(event) {
        if (!event) return
        if (event.key === Qt.Key_Control || event.key === Qt.Key_Meta) {
            root.isCtrlHeld = true
        }
        var isCtrl = (event.modifiers & Qt.ControlModifier) || (event.modifiers & Qt.MetaModifier)
        if (isCtrl && (event.key === Qt.Key_A)) {
            event.accepted = true
            root.selectAll()
            return
        }
        if (isCtrl && (event.key === Qt.Key_X)) {
            event.accepted = true
            var targetCutIds = root.selectedIds.length > 0 ? root.selectedIds : (root.selectedId ? [root.selectedId] : [])
            root.nodeCut(targetCutIds)
            return
        }
        if (isCtrl && (event.key === Qt.Key_C)) {
            event.accepted = true
            var targetCopyIds = root.selectedIds.length > 0 ? root.selectedIds : (root.selectedId ? [root.selectedId] : [])
            root.nodeCopied(targetCopyIds)
            return
        }
        if (isCtrl && (event.key === Qt.Key_V)) {
            event.accepted = true
            var targetId = root.selectedId ? root.selectedId : (root.selectedIds.length > 0 ? root.selectedIds[root.selectedIds.length - 1] : "")
            var currNode = null
            if (targetId) {
                for (var f = 0; f < root.flatItems.length; f++) {
                    if (root.flatItems[f].id === targetId) {
                        currNode = root.flatItems[f]
                        break
                    }
                }
            }
            if (!currNode && root.currentIndex >= 0 && root.currentIndex < root.flatItems.length) {
                currNode = root.flatItems[root.currentIndex]
            }
            root.nodePasted(currNode ? currNode.id : "", currNode && currNode.hasChildren ? "inside" : "after")
            return
        }
        if (event.key === Qt.Key_Escape) {
            event.accepted = true
            root.resetDragState()
            root.nodeCut([])
            root.nodeCopied([])
            return
        }
        if (event.key === Qt.Key_Delete || event.key === Qt.Key_Backspace) {
            var targetDelIds = root.selectedIds.length > 0 ? root.selectedIds : (root.selectedId ? [root.selectedId] : [])
            if (targetDelIds.length > 0) {
                event.accepted = true
                root.nodeDeleted(targetDelIds)
                return
            }
        }
        if (event.key === Qt.Key_Space) {
            if (root.currentIndex >= 0 && root.currentIndex < root.flatItems.length) {
                event.accepted = true
                let curr = root.flatItems[root.currentIndex]
                root.handleNodeClick(root.currentIndex, event.modifiers)
                if (curr.hasChildren) {
                    root.toggleExpand(curr.id)
                }
            }
        } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
            if (root.currentIndex >= 0 && root.currentIndex < root.flatItems.length) {
                event.accepted = true
                let curr = root.flatItems[root.currentIndex]
                root.handleNodeClick(root.currentIndex, event.modifiers)
                if (curr.hasChildren) {
                    root.toggleExpand(curr.id)
                }
            }
        }
    }

    Keys.onReleased: function(event) {
        if (!event) return
        if (event.key === Qt.Key_Control || event.key === Qt.Key_Meta) {
            root.isCtrlHeld = false
        }
    }

    Rectangle {
        anchors.fill: parent
        color: ThemeTokens.panel
        border.color: root.activeFocus ? ThemeTokens.focus : ThemeTokens.border
        border.width: root.activeFocus ? 2 : 1
        radius: root.customRadius
        clip: true

        ListView {
            id: treeList
            anchors.fill: parent
            anchors.margins: ThemeTokens.dp(8)
            model: root.flatItems
            boundsBehavior: Flickable.StopAtBounds
            clip: true
            spacing: root.gap > 0 ? ThemeTokens.dp(root.gap) : ThemeTokens.dp(2)
            cacheBuffer: root.overscan * root.estimateSize

            ScrollBar.vertical: ChaSetScrollBar {
                orientation: Qt.Vertical
                policy: ScrollBar.AsNeeded
            }

            WheelHandler {
                target: treeList
                onWheel: function(event) {
                    treeList.flick(0, event.angleDelta.y * 5)
                }
            }

            delegate: Rectangle {
                id: delegateRow
                required property var modelData
                required property int index
                width: treeList.width
                height: root.effectiveEstimateSize

                readonly property bool isHovered: root.modality === "pointer" && (rowMouse.containsMouse || chevronMouse.containsMouse)
                readonly property bool isKeyboardFocused: root.modality === "keyboard" && root.currentIndex === index
                readonly property bool isSelected: root.isSelected(modelData.id)
                readonly property bool isDimmed: root.isDimmed(modelData.id)
                readonly property bool isCopied: root.isCopied(modelData.id)
                readonly property bool isDropTarget: root.enableDnd && root.isDragging && root.dropTargetId === modelData.id

                color: isSelected
                    ? (isHovered ? Qt.rgba(ThemeTokens.focus.r, ThemeTokens.focus.g, ThemeTokens.focus.b, 0.20) : Qt.rgba(ThemeTokens.focus.r, ThemeTokens.focus.g, ThemeTokens.focus.b, 0.15))
                    : (isHovered ? ThemeTokens.hover : (isCopied ? Qt.rgba(ThemeTokens.focus.r, ThemeTokens.focus.g, ThemeTokens.focus.b, 0.10) : "transparent"))
                border.color: isSelected
                    ? Qt.rgba(ThemeTokens.focus.r, ThemeTokens.focus.g, ThemeTokens.focus.b, 0.35)
                    : (isCopied ? ThemeTokens.focus : (isKeyboardFocused ? ThemeTokens.focus : "transparent"))
                border.width: isSelected || isCopied || isKeyboardFocused ? 1 : 0
                radius: ThemeTokens.dp(4)
                opacity: isDimmed ? 0.4 : 1.0

                Behavior on color {
                    enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                    ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
                }

                Behavior on opacity {
                    enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                    NumberAnimation { duration: ThemeTokens.motionQuick }
                }

                // Drop Indicator: Before Line
                Rectangle {
                    visible: isDropTarget && root.dropPosition === "before" && root.isDropValid
                    anchors.top: parent.top
                    anchors.left: parent.left
                    anchors.right: parent.right
                    height: ThemeTokens.dp(2)
                    color: ThemeTokens.focus
                    z: 20
                }

                // Drop Indicator: After Line
                Rectangle {
                    visible: isDropTarget && root.dropPosition === "after" && root.isDropValid
                    anchors.bottom: parent.bottom
                    anchors.left: parent.left
                    anchors.right: parent.right
                    height: ThemeTokens.dp(2)
                    color: ThemeTokens.focus
                    z: 20
                }

                // Drop Indicator: Inside Highlight
                Rectangle {
                    visible: isDropTarget && root.dropPosition === "inside" && root.isDropValid
                    anchors.fill: parent
                    color: Qt.rgba(ThemeTokens.focus.r, ThemeTokens.focus.g, ThemeTokens.focus.b, 0.15)
                    border.color: ThemeTokens.focus
                    border.width: 1
                    radius: ThemeTokens.dp(4)
                    z: 20
                }

                // Drop Indicator: Invalid Target
                Rectangle {
                    visible: isDropTarget && !root.isDropValid
                    anchors.fill: parent
                    color: Qt.rgba(ThemeTokens.conflict.r, ThemeTokens.conflict.g, ThemeTokens.conflict.b, 0.1)
                    border.color: ThemeTokens.conflict
                    border.width: 1
                    radius: ThemeTokens.dp(4)
                    z: 20
                }

                Row {
                    id: contentRow
                    anchors.left: parent.left
                    anchors.leftMargin: ThemeTokens.dp(8) + modelData.depth * ThemeTokens.dp(16)
                    anchors.right: dirBadge.visible ? dirBadge.left : parent.right
                    anchors.rightMargin: ThemeTokens.dp(8)
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: ThemeTokens.dp(6)
                    z: 2

                    Item {
                        width: ThemeTokens.dp(16)
                        height: ThemeTokens.dp(24)
                        anchors.verticalCenter: parent.verticalCenter
                        visible: !!modelData.hasChildren

                        Text {
                            anchors.centerIn: parent
                            text: modelData.isExpanded ? "▾" : "▸"
                            color: chevronMouse.containsMouse ? ThemeTokens.text : ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeCaption
                        }

                        MouseArea {
                            id: chevronMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            z: 10
                            onClicked: function(mouse) {
                                mouse.accepted = true
                                root.forceActiveFocus()
                                root.toggleExpand(modelData.id)
                            }
                        }
                    }

                    Text {
                        visible: !modelData.hasChildren
                        anchors.verticalCenter: parent.verticalCenter
                        text: "•"
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeCaption
                        width: ThemeTokens.dp(16)
                        horizontalAlignment: Text.AlignHCenter
                    }

                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        text: modelData.label
                        color: isSelected ? ThemeTokens.focus : ThemeTokens.text
                        font.pixelSize: Typography.sizeSmall
                        font.family: Typography.familyMono
                        font.weight: isSelected ? Typography.weightMedium : Font.Normal
                        font.italic: isDimmed
                    }
                }

                ChaSetBadge {
                    id: dirBadge
                    visible: !!modelData.hasChildren
                    size: "sm"
                    variant: "outline"
                    text: "dir"
                    anchors.right: parent.right
                    anchors.rightMargin: ThemeTokens.dp(8)
                    anchors.verticalCenter: parent.verticalCenter
                    z: 2
                }

                DropArea {
                    id: rowDropArea
                    anchors.fill: parent
                    enabled: root.enableDnd

                    onPositionChanged: function(drag) {
                        if (!root.isDragging) return
                        var ratio = drag.y / parent.height
                        var pos = "inside"
                        if (ratio < 0.25) pos = "before"
                        else if (ratio > 0.75) pos = "after"
                        else pos = modelData.hasChildren ? "inside" : (ratio < 0.5 ? "before" : "after")

                        root.dropTargetId = modelData.id
                        root.dropPosition = pos
                        root.isDropValid = root.isDropValidFor(modelData.id)
                        if (drag.accept) {
                            drag.accept(root.isCtrlHeld ? Qt.CopyAction : Qt.MoveAction)
                        }
                    }

                    onExited: {
                        if (root.dropTargetId === modelData.id) {
                            root.dropTargetId = ""
                            root.dropPosition = ""
                        }
                    }

                    onDropped: function(drop) {
                        if (drop) drop.acceptProposedAction()
                        root.executeDrop()
                    }
                }

                Item {
                    id: dragProxy
                    width: ThemeTokens.dp(20)
                    height: ThemeTokens.dp(20)
                    Drag.active: rowMouse.drag.active
                    Drag.source: delegateRow
                    Drag.hotSpot.x: ThemeTokens.dp(10)
                    Drag.hotSpot.y: ThemeTokens.dp(10)
                    onXChanged: {
                        if (rowMouse.drag.active && !root.isDragging) root.isDragging = true
                    }
                    onYChanged: {
                        if (rowMouse.drag.active && !root.isDragging) root.isDragging = true
                    }
                }

                MouseArea {
                    id: rowMouse
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: root.enableDnd ? (drag.active ? Qt.ClosedHandCursor : Qt.PointingHandCursor) : Qt.PointingHandCursor
                    drag.target: root.enableDnd ? dragProxy : undefined
                    preventStealing: root.enableDnd && (drag.active || root.isDragging)

                    onPressed: function(mouse) {
                        dragProxy.x = 0
                        dragProxy.y = 0
                        root.forceActiveFocus()
                        if (root.enableDnd) {
                            root.draggedId = parent.modelData.id
                            root.draggedIds = root.selectedIds.length > 0 && root.selectedIds.indexOf(parent.modelData.id) !== -1 ? root.selectedIds : [parent.modelData.id]
                            if ((mouse.modifiers & Qt.ControlModifier) !== 0 || (mouse.modifiers & Qt.MetaModifier) !== 0) {
                                root.isCtrlHeld = true
                            }
                        }
                    }

                    onReleased: function(mouse) {
                        dragProxy.x = 0
                        dragProxy.y = 0
                        if (root.enableDnd && root.isDragging) {
                            var isCopy = root.isCtrlHeld || ((mouse.modifiers & Qt.ControlModifier) !== 0) || ((mouse.modifiers & Qt.MetaModifier) !== 0)
                            dragProxy.Drag.drop()
                            root.executeDrop(isCopy)
                        } else {
                            root.resetDragState()
                        }
                    }

                    onCanceled: {
                        dragProxy.x = 0
                        dragProxy.y = 0
                        root.resetDragState()
                    }

                    onPositionChanged: function(mouse) {
                        if (drag.active && !root.isDragging) {
                            root.isDragging = true
                        }
                        if ((mouse.modifiers & Qt.ControlModifier) !== 0 || (mouse.modifiers & Qt.MetaModifier) !== 0) {
                            root.isCtrlHeld = true
                        }
                        if (root.modality !== "pointer") {
                            var dx = Math.abs(mouse.x - root.lastPointerX)
                            var dy = Math.abs(mouse.y - root.lastPointerY)
                            if (root.lastPointerX >= 0 && (dx > 1 || dy > 1)) {
                                root.modality = "pointer"
                            }
                        }
                        root.lastPointerX = mouse.x
                        root.lastPointerY = mouse.y
                    }

                    onClicked: function(mouse) {
                        root.forceActiveFocus()
                        root.handleNodeClick(parent.index, mouse.modifiers)
                    }
                }
            }
        }

        // Floating Drag Modifier HUD Tooltip
        Rectangle {
            id: dragHud
            visible: root.enableDnd && root.isDragging && root.draggedId !== ""
            anchors.bottom: parent.bottom
            anchors.right: parent.right
            anchors.margins: ThemeTokens.dp(8)
            height: ThemeTokens.dp(24)
            width: hudRow.implicitWidth + ThemeTokens.dp(16)
            radius: ThemeTokens.dp(4)
            color: ThemeTokens.panelRaised
            border.color: ThemeTokens.border
            border.width: 1
            z: 100

            Row {
                id: hudRow
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(4)
                Text {
                    text: root.isCtrlHeld ? "Copying (Ctrl held)" : "Moving (Hold Ctrl to copy)"
                    color: ThemeTokens.text
                    font.pixelSize: Typography.sizeSmall
                }
            }
        }
    }
}
