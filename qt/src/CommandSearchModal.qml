// CommandSearchModal.qml — Quick Command & Page Search (Ctrl+K)
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root
    anchors.fill: parent
    z: 200
    color: Qt.rgba(0, 0, 0, 0.6)

    property var allItems: {
        var items = []
        var nav = ShowcaseData.navigation || []
        for (var i = 0; i < nav.length; i++) {
            var cat = nav[i]
            var catItems = cat.items || []
            for (var j = 0; j < catItems.length; j++) {
                var it = catItems[j]
                items.push({
                    id: it.id,
                    title: it.title,
                    category: cat.title,
                    desc: it.desc || ""
                })
            }
        }
        return items
    }

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

    ChaSetCard {
        id: searchCard
        width: Math.min(parent.width - 40, 560)
        height: Math.min(parent.height - 80, 380)
        customRadius: 8
        anchors.centerIn: parent

        Item {
            width: parent.width
            height: searchCard.height

            MouseArea { anchors.fill: parent }

            Column {
                anchors.fill: parent
                anchors.margins: 14
                spacing: 10

            // Search Input
            ChaSetInput {
                id: searchInput
                width: parent.width
                placeholderText: "Search components & docs..."
                text: root.query
                selectByMouse: true
                onTextEdited: { root.query = text; root.selectedIndex = 0 }
                onAccepted: {
                    if (root.filteredItems.length > 0 && root.selectedIndex < root.filteredItems.length) {
                        root.selectPage(root.filteredItems[root.selectedIndex].id)
                        root.close()
                    }
                }
                Keys.onEscapePressed: root.close()
                Keys.onDownPressed: {
                    if (root.selectedIndex < root.filteredItems.length - 1) root.selectedIndex++
                }
                Keys.onUpPressed: {
                    if (root.selectedIndex > 0) root.selectedIndex--
                }
                Component.onCompleted: forceActiveFocus()
            }

            ChaSetSeparator {}

            // Results List
            ListView {
                id: resultsList
                width: parent.width
                height: parent.height - 70
                clip: true
                model: root.filteredItems
                ScrollBar.vertical: ChaSetScrollBar {
                    showButtons: false
                }
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
                                Text { text: parent.parent.parent.parent.modelData.title; color: ThemeTokens.text; font.pixelSize: 13; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                                ChaSetBadge { size: "sm"; variant: "outline"; text: parent.parent.parent.parent.modelData.category; anchors.verticalCenter: parent.verticalCenter }
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
}
