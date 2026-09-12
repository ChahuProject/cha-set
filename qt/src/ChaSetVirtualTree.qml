// ChaSetVirtualTree.qml — Cross-Stack Virtual Tree Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property var nodes: [] // [{ id, label, children: [...] }]
    property string selectedId: ""
    property var expandedIds: ({})
    property int defaultExpandDepth: 0
    property int estimateSize: 28
    property int gap: 0
    property int overscan: 10
    property int customRadius: 6

    signal nodeSelected(string nodeId)

    implicitWidth: 320
    implicitHeight: 280

    // Flatten tree items based on active expansion state
    function flatten(list, depth) {
        let res = []
        if (!list) return res
        for (let i = 0; i < list.length; i++) {
            let n = list[i]
            let hasCh = n.children && n.children.length > 0
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

    activeFocusOnTab: true

    Keys.onDownPressed: function(event) {
        event.accepted = true
        root.modality = "keyboard"
        if (root.flatItems.length > 0) {
            root.currentIndex = Math.min(root.flatItems.length - 1, Math.max(0, root.currentIndex + 1))
            root.selectedId = root.flatItems[root.currentIndex].id
            root.nodeSelected(root.selectedId)
            treeList.positionViewAtIndex(root.currentIndex, ListView.Contain)
        }
    }

    Keys.onUpPressed: function(event) {
        event.accepted = true
        root.modality = "keyboard"
        if (root.flatItems.length > 0) {
            root.currentIndex = Math.max(0, root.currentIndex - 1)
            root.selectedId = root.flatItems[root.currentIndex].id
            root.nodeSelected(root.selectedId)
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
                        root.nodeSelected(root.selectedId)
                        treeList.positionViewAtIndex(root.currentIndex, ListView.Contain)
                        break
                    }
                }
            }
        }
    }

    Keys.onSpacePressed: function(event) {
        if (root.currentIndex >= 0 && root.currentIndex < root.flatItems.length) {
            event.accepted = true
            let curr = root.flatItems[root.currentIndex]
            if (curr.hasChildren) {
                root.toggleExpand(curr.id)
            }
        }
    }

    Keys.onReturnPressed: function(event) {
        if (root.currentIndex >= 0 && root.currentIndex < root.flatItems.length) {
            event.accepted = true
            let curr = root.flatItems[root.currentIndex]
            if (curr.hasChildren) {
                root.toggleExpand(curr.id)
            }
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
            model: root.flatItems
            boundsBehavior: Flickable.StopAtBounds
            clip: true
            spacing: root.gap
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
                required property var modelData
                required property int index
                width: treeList.width
                height: 28

                readonly property bool isHighlighted: (root.modality === "keyboard" && root.currentIndex === index) || (root.modality === "pointer" && rowMouse.containsMouse)
                color: root.selectedId === modelData.id ? ThemeTokens.hover : (isHighlighted ? ThemeTokens.hover : "transparent")

                Behavior on color {
                    enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                    ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
                }

                Row {
                    anchors.fill: parent
                    anchors.leftMargin: 8 + modelData.depth * 16
                    anchors.rightMargin: 8
                    spacing: 6

                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        text: modelData.hasChildren ? (modelData.isExpanded ? "▾" : "▸") : "•"
                        color: ThemeTokens.subduedText
                        font.pixelSize: 11
                    }

                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        text: modelData.label
                        color: ThemeTokens.text
                        font.pixelSize: 12
                        font.family: "monospace"
                    }
                }

                MouseArea {
                    id: rowMouse
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onPositionChanged: function(mouse) {
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
                    onClicked: {
                        root.currentIndex = parent.index
                        if (parent.modelData.hasChildren) {
                            root.toggleExpand(parent.modelData.id)
                        }
                        root.selectedId = parent.modelData.id
                        root.nodeSelected(parent.modelData.id)
                    }
                }
            }
        }
    }
}
