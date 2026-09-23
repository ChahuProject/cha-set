// ChaSetGenericDataTable.qml — Cross-Stack Generic Data Table Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property var columns: [] // [{ key, header, width }]
    property var data: [] // array of record objects
    property string searchFilter: ""
    property string sortKey: ""
    property bool sortAsc: true
    property int currentPage: 1
    property int pageSize: 5
    property int customRadius: 6

    implicitWidth: ThemeTokens.dp(500)
    implicitHeight: ThemeTokens.dp(320)

    // Filtered data
    readonly property var filteredData: {
        let list = root.data || []
        if (root.searchFilter.length > 0) {
            let q = root.searchFilter.toLowerCase()
            list = list.filter(function(row) {
                return Object.values(row).some(function(val) {
                    return String(val).toLowerCase().indexOf(q) !== -1
                })
            })
        }
        if (root.sortKey !== "") {
            list = list.slice().sort(function(a, b) {
                let va = a[root.sortKey]
                let vb = b[root.sortKey]
                if (va < vb) return root.sortAsc ? -1 : 1
                if (va > vb) return root.sortAsc ? 1 : -1
                return 0
            })
        }
        return list
    }

    readonly property int totalPages: Math.max(1, Math.ceil(filteredData.length / pageSize))
    readonly property var pageData: {
        let start = (currentPage - 1) * pageSize
        return filteredData.slice(start, start + pageSize)
    }

    function toggleSort(key) {
        if (root.sortKey === key) {
            root.sortAsc = !root.sortAsc
        } else {
            root.sortKey = key
            root.sortAsc = true
        }
    }

    property int selectedRowIndex: -1
    activeFocusOnTab: true

    Keys.onDownPressed: function(event) {
        if (root.pageData.length > 0) {
            event.accepted = true
            root.selectedRowIndex = Math.min(root.pageData.length - 1, Math.max(0, root.selectedRowIndex + 1))
        }
    }

    Keys.onUpPressed: function(event) {
        if (root.pageData.length > 0) {
            event.accepted = true
            root.selectedRowIndex = Math.max(0, root.selectedRowIndex - 1)
        }
    }

    Keys.onLeftPressed: function(event) {
        if (root.currentPage > 1) {
            event.accepted = true
            root.currentPage--
            root.selectedRowIndex = 0
        }
    }

    Keys.onRightPressed: function(event) {
        if (root.currentPage < root.totalPages) {
            event.accepted = true
            root.currentPage++
            root.selectedRowIndex = 0
        }
    }

    Rectangle {
        anchors.fill: parent
        color: ThemeTokens.panel
        border.color: root.activeFocus ? ThemeTokens.focus : ThemeTokens.border
        border.width: root.activeFocus ? 2 : 1
        radius: ThemeTokens.dp(root.customRadius)
        clip: true

        // Table Header / Toolbar
        Rectangle {
            id: tableToolbar
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.right: parent.right
            height: ThemeTokens.dp(44)
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1

            Row {
                anchors.left: parent.left
                anchors.leftMargin: ThemeTokens.dp(12)
                anchors.verticalCenter: parent.verticalCenter
                spacing: ThemeTokens.dp(8)

                ChaSetIcon {
                    anchors.verticalCenter: parent.verticalCenter
                    name: "search"
                    size: ThemeTokens.dp(14)
                    color: ThemeTokens.subduedText
                }

                ChaSetInput {
                    width: ThemeTokens.dp(180)
                    height: ThemeTokens.dp(28)
                    placeholder: "Filter records..."
                    text: root.searchFilter
                    onTextEdited: {
                        root.searchFilter = text
                        root.currentPage = 1
                        root.selectedRowIndex = -1
                    }
                }
            }
        }

        // Columns Header
        Rectangle {
            id: columnsHeader
            anchors.top: tableToolbar.bottom
            anchors.left: parent.left
            anchors.right: parent.right
            height: ThemeTokens.dp(32)
            color: ThemeTokens.hover
            border.color: ThemeTokens.border
            border.width: 1

            Row {
                anchors.fill: parent
                anchors.leftMargin: ThemeTokens.dp(12)
                anchors.rightMargin: ThemeTokens.dp(12)

                Repeater {
                    model: root.columns
                    delegate: Item {
                        required property var modelData
                        width: ThemeTokens.dp(modelData.width || 120)
                        height: parent ? parent.height : 0

                        Row {
                            anchors.fill: parent
                            spacing: ThemeTokens.dp(4)

                            Text {
                                anchors.verticalCenter: parent.verticalCenter
                                text: parent.parent.modelData.header || ""
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeCaption
                                font.weight: Font.DemiBold
                            }

                            Text {
                                anchors.verticalCenter: parent.verticalCenter
                                text: root.sortKey === parent.parent.modelData.key ? (root.sortAsc ? "▲" : "▼") : ""
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeMicro
                            }
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: root.toggleSort(parent.modelData.key)
                        }
                    }
                }
            }
        }

        // Pagination Footer
        Rectangle {
            id: paginationFooter
            anchors.bottom: parent.bottom
            anchors.left: parent.left
            anchors.right: parent.right
            height: ThemeTokens.dp(40)
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1

            Text {
                anchors.left: parent.left
                anchors.leftMargin: ThemeTokens.dp(12)
                anchors.verticalCenter: parent.verticalCenter
                text: "Page " + root.currentPage + " of " + root.totalPages
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeCaption
            }

            Row {
                anchors.right: parent.right
                anchors.rightMargin: ThemeTokens.dp(12)
                anchors.verticalCenter: parent.verticalCenter
                spacing: ThemeTokens.dp(8)

                ChaSetButton {
                    text: "Previous"
                    size: "xs"
                    variant: "outline"
                    disabled: root.currentPage <= 1
                    onClicked: root.currentPage--
                }

                ChaSetButton {
                    text: "Next"
                    size: "xs"
                    variant: "outline"
                    disabled: root.currentPage >= root.totalPages
                    onClicked: root.currentPage++
                }
            }
        }

        // Table Body Rows
        ListView {
            id: bodyList
            anchors.top: columnsHeader.bottom
            anchors.bottom: paginationFooter.top
            anchors.left: parent.left
            anchors.right: parent.right
            model: root.pageData
            clip: true

            delegate: Rectangle {
                id: rowDelegate
                required property var modelData
                required property int index
                width: bodyList.width
                height: ThemeTokens.dp(32)
                readonly property bool isSelectedRow: root.selectedRowIndex === index
                color: isSelectedRow ? ThemeTokens.hover : (index % 2 === 0 ? ThemeTokens.panel : "transparent")
                border.color: isSelectedRow ? ThemeTokens.focus : "transparent"
                border.width: isSelectedRow ? 1 : 0

                Behavior on color {
                    enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                    ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
                }
                Behavior on border.color {
                    enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                    ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
                }

                Row {
                    anchors.fill: parent
                    anchors.leftMargin: ThemeTokens.dp(12)
                    anchors.rightMargin: ThemeTokens.dp(12)

                    Repeater {
                        model: root.columns
                        delegate: Item {
                            id: cellDelegate
                            required property var modelData
                            width: ThemeTokens.dp(modelData.width || 120)
                            height: parent.height

                            ChaSetBadge {
                                anchors.verticalCenter: parent.verticalCenter
                                visible: cellDelegate.modelData.key === "status"
                                variant: {
                                    const val = String(rowDelegate.modelData["status"] ?? "")
                                    if (val === "Healthy" || val === "Active") return "default"
                                    if (val === "Pending" || val === "Degraded") return "secondary"
                                    return "outline"
                                }
                                text: String(rowDelegate.modelData["status"] ?? "")
                            }

                            Text {
                                visible: cellDelegate.modelData.key !== "status"
                                anchors.verticalCenter: parent.verticalCenter
                                text: String(rowDelegate.modelData[cellDelegate.modelData.key] ?? "")
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeSmall
                                font.weight: rowDelegate.isSelectedRow ? Font.Medium : Font.Normal
                                elide: Text.ElideRight
                                width: parent.width - ThemeTokens.dp(8)
                            }
                        }
                    }
                }

                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        root.selectedRowIndex = parent.index
                        root.forceActiveFocus()
                    }
                }
            }
        }
    }
}
