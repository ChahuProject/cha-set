// ChaSetVirtualTree.qml — Cross-Stack Virtual Tree Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property var nodes: [] // [{ id, label, children: [...] }]
    property string selectedId: ""
    property var expandedIds: ({})
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
            let isExp = !!root.expandedIds[n.id]
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
        copy[id] = !copy[id]
        root.expandedIds = copy
    }

    Rectangle {
        anchors.fill: parent
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        radius: root.customRadius
        clip: true

        ListView {
            id: treeList
            anchors.fill: parent
            model: root.flatItems
            boundsBehavior: Flickable.StopAtBounds
            clip: true

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
                width: treeList.width
                height: 28
                color: root.selectedId === modelData.id ? ThemeTokens.hover : (rowMouse.containsMouse ? ThemeTokens.hover : "transparent")

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
                    onClicked: {
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
