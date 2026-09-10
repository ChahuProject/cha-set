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

    implicitWidth: 500
    implicitHeight: 320

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
        radius: root.customRadius
        clip: true

        Column {
            anchors.fill: parent

            // Table Header / Toolbar
            Rectangle {
                width: parent.width
                height: 44
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1

                Row {
                    anchors.left: parent.left
                    anchors.leftMargin: 12
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: 8

                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        text: "🔍"
                        font.pixelSize: 12
                    }

                    ChaSetInput {
                        width: 180
                        height: 28
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
                width: parent.width
                height: 32
                color: ThemeTokens.hover
                border.color: ThemeTokens.border
                border.width: 1

                Row {
                    anchors.fill: parent
                    anchors.leftMargin: 12
                    anchors.rightMargin: 12

                    Repeater {
                        model: root.columns
                        delegate: Item {
                            required property var modelData
                            width: modelData.width || 120
                            height: parent.height

                            Row {
                                anchors.fill: parent
                                spacing: 4

                                Text {
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: parent.parent.modelData.header || ""
                                    color: ThemeTokens.subduedText
                                    font.pixelSize: 11
                                    font.weight: Font.DemiBold
                                }

                                Text {
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: root.sortKey === parent.parent.modelData.key ? (root.sortAsc ? "▲" : "▼") : ""
                                    color: ThemeTokens.text
                                    font.pixelSize: 10
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

            // Table Body Rows
            ListView {
                id: bodyList
                width: parent.width
                height: parent.height - 44 - 32 - 40
                model: root.pageData
                clip: true

                delegate: Rectangle {
                    required property var modelData
                    required property int index
                    width: bodyList.width
                    height: 32
                    readonly property bool isSelectedRow: root.selectedRowIndex === index
                    color: isSelectedRow ? ThemeTokens.hover : (index % 2 === 0 ? ThemeTokens.panel : "transparent")
                    border.color: isSelectedRow ? ThemeTokens.focus : "transparent"
                    border.width: isSelectedRow ? 1 : 0

                    Row {
                        anchors.fill: parent
                        anchors.leftMargin: 12
                        anchors.rightMargin: 12

                        Repeater {
                            model: root.columns
                            delegate: Item {
                                required property var modelData
                                width: modelData.width || 120
                                height: parent.height

                                Text {
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: String(parent.parent.parent.modelData[parent.modelData.key] ?? "")
                                    color: ThemeTokens.text
                                    font.pixelSize: 12
                                    font.weight: parent.parent.parent.isSelectedRow ? Font.Medium : Font.Normal
                                    elide: Text.ElideRight
                                    width: parent.width - 8
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

            // Pagination Footer
            Rectangle {
                width: parent.width
                height: 40
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1

                Text {
                    anchors.left: parent.left
                    anchors.leftMargin: 12
                    anchors.verticalCenter: parent.verticalCenter
                    text: "Page " + root.currentPage + " of " + root.totalPages
                    color: ThemeTokens.subduedText
                    font.pixelSize: 11
                }

                Row {
                    anchors.right: parent.right
                    anchors.rightMargin: 12
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: 8

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
        }
    }
}
