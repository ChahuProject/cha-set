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

    Rectangle {
        anchors.fill: parent
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        radius: root.customRadius
        clip: true

        Column {
            anchors.fill: parent

            // Toolbar with Search Input
            Rectangle {
                width: parent.width
                height: 44
                color: ThemeTokens.panel

                ChaSetInput {
                    anchors.left: parent.left
                    anchors.leftMargin: 10
                    anchors.verticalCenter: parent.verticalCenter
                    width: 220
                    height: 28
                    placeholder: "Filter records..."
                    onTextEdited: {
                        root.searchFilter = text
                        root.currentPage = 1
                    }
                }

                Text {
                    anchors.right: parent.right
                    anchors.rightMargin: 10
                    anchors.verticalCenter: parent.verticalCenter
                    text: root.filteredData.length + " rows"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 11
                }
            }

            // Header Row
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
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: 4

                                Text {
                                    text: parent.parent.modelData.header || parent.parent.modelData.key
                                    color: ThemeTokens.text
                                    font.pixelSize: 12
                                    font.weight: Font.DemiBold
                                }

                                Text {
                                    visible: root.sortKey === parent.parent.modelData.key
                                    text: root.sortAsc ? "▲" : "▼"
                                    color: ThemeTokens.accent
                                    font.pixelSize: 9
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
                    color: index % 2 === 0 ? ThemeTokens.hover : "transparent"

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
                                    elide: Text.ElideRight
                                    width: parent.width - 8
                                }
                            }
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
