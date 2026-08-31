// CommandSearchModal.qml — Quick Command & Page Search (Ctrl+K)
import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

Rectangle {
    id: root
    anchors.fill: parent
    z: 200
    color: Qt.rgba(0, 0, 0, 0.6)

    property var allItems: [
        { id: "intro", title: "Introduction", category: "Get Started", desc: "Architecture overview & philosophy" },
        { id: "tokens", title: "Theme & Tokens", category: "Get Started", desc: "Design tokens, color palette, typography" },
        { id: "theme-tuner", title: "Theme Studio", category: "Get Started", desc: "Live theme tuner and config exporter" },
        { id: "button", title: "Button", category: "Components", desc: "Variants, sizes, loading & link states" },
        { id: "scroll-area", title: "Scroll Area", category: "Components", desc: "Hot-zone expansion, steppers, dual-axis" }
    ]

    property string query: ""
    property int selectedIndex: 0

    readonly property var filteredItems: {
        if (!query || query.trim() === "") return allItems
        var q = query.toLowerCase()
        return allItems.filter(function(item) {
            return item.title.toLowerCase().indexOf(q) >= 0 || item.desc.toLowerCase().indexOf(q) >= 0
        })
    }

    signal selectPage(string pageId)
    signal close()

    MouseArea { anchors.fill: parent; onClicked: root.close() }

    Rectangle {
        width: Math.min(parent.width - 40, 560)
        height: Math.min(parent.height - 80, 380)
        radius: 8
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        anchors.centerIn: parent

        MouseArea { anchors.fill: parent }

        Column {
            anchors.fill: parent
            anchors.margins: 14
            spacing: 10

            // Search Input
            Row {
                width: parent.width
                spacing: 8
                Text { text: "🔍"; font.pixelSize: 14; anchors.verticalCenter: parent.verticalCenter }
                TextInput {
                    id: searchInput
                    width: parent.width - 50
                    height: 32
                    font.pixelSize: 14
                    color: ThemeTokens.text
                    selectByMouse: true
                    focus: true
                    onTextChanged: { root.query = text; root.selectedIndex = 0 }
                    Keys.onEscapePressed: root.close()
                    Keys.onReturnPressed: {
                        if (root.filteredItems.length > 0 && root.selectedIndex < root.filteredItems.length) {
                            root.selectPage(root.filteredItems[root.selectedIndex].id)
                            root.close()
                        }
                    }
                    Keys.onDownPressed: {
                        if (root.selectedIndex < root.filteredItems.length - 1) root.selectedIndex++
                    }
                    Keys.onUpPressed: {
                        if (root.selectedIndex > 0) root.selectedIndex--
                    }
                }
            }

            Rectangle { width: parent.width; height: 1; color: ThemeTokens.border }

            // Results List
            ListView {
                width: parent.width
                height: parent.height - 70
                clip: true
                model: root.filteredItems
                delegate: Rectangle {
                    required property var modelData
                    required property int index
                    width: parent.width
                    height: 48
                    radius: 6
                    color: root.selectedIndex === index ? ThemeTokens.hover : "transparent"

                    Row {
                        anchors.fill: parent
                        anchors.margins: 8
                        spacing: 10
                        Column {
                            anchors.verticalCenter: parent.verticalCenter
                            spacing: 2
                            Row {
                                spacing: 6
                                Text { text: parent.parent.parent.parent.modelData.title; color: ThemeTokens.text; font.pixelSize: 13; font.weight: Font.Bold }
                                Text { text: "• " + parent.parent.parent.parent.modelData.category; color: ThemeTokens.subduedText; font.pixelSize: 11 }
                            }
                            Text { text: parent.parent.parent.modelData.desc; color: ThemeTokens.subduedText; font.pixelSize: 11 }
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        hoverEnabled: true
                        onEntered: root.selectedIndex = parent.index
                        onClicked: {
                            root.selectPage(parent.modelData.id)
                            root.close()
                        }
                    }
                }
            }
        }
    }
}
