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
        width: Math.min(parent.width - ThemeTokens.dp(40), ThemeTokens.dp(560))
        height: Math.min(parent.height - ThemeTokens.dp(80), ThemeTokens.dp(380))
        customRadius: ThemeTokens.dp(8)
        anchors.centerIn: parent

        Item {
            width: parent.width
            height: searchCard.height

            MouseArea { anchors.fill: parent }

            Column {
                anchors.fill: parent
                anchors.margins: ThemeTokens.dp(14)
                spacing: ThemeTokens.dp(10)

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

                ChaSetSeparator {
                    id: searchSeparator
                }

                // Results List
                ListView {
                    id: resultsList
                    width: parent.width
                    height: Math.max(0, parent.height - searchInput.height - searchSeparator.height - ThemeTokens.dp(20))
                    clip: true
                    model: root.filteredItems
                    ScrollBar.vertical: ChaSetScrollBar {
                        showButtons: false
                    }
                    delegate: Rectangle {
                        id: itemDelegate
                        required property var modelData
                        required property int index
                        width: resultsList.width
                        height: ThemeTokens.dp(48)
                        radius: ThemeTokens.dp(6)
                        color: root.selectedIndex === itemDelegate.index ? ThemeTokens.hover : "transparent"

                        Row {
                            anchors.fill: parent
                            anchors.margins: ThemeTokens.dp(8)
                            spacing: ThemeTokens.dp(10)
                            Column {
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: ThemeTokens.dp(2)
                                Row {
                                    spacing: ThemeTokens.dp(6)
                                    Text {
                                        text: itemDelegate.modelData ? (itemDelegate.modelData.title || "") : ""
                                        color: ThemeTokens.text
                                        font.family: Typography.familySans
                                        font.pixelSize: Typography.sizeBody
                                        font.weight: Typography.weightBold
                                        anchors.verticalCenter: parent.verticalCenter
                                    }
                                    ChaSetBadge {
                                        size: "sm"
                                        variant: "outline"
                                        text: itemDelegate.modelData ? (itemDelegate.modelData.category || "") : ""
                                        anchors.verticalCenter: parent.verticalCenter
                                    }
                                }
                                Text {
                                    text: itemDelegate.modelData ? (itemDelegate.modelData.desc || "") : ""
                                    color: ThemeTokens.subduedText
                                    font.family: Typography.familySans
                                    font.pixelSize: Typography.sizeCaption
                                    elide: Text.ElideRight
                                    width: Math.max(0, resultsList.width - ThemeTokens.dp(24))
                                }
                            }
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            hoverEnabled: true
                            onEntered: root.selectedIndex = itemDelegate.index
                            onClicked: {
                                if (itemDelegate.modelData) {
                                    root.selectPage(itemDelegate.modelData.id)
                                    root.close()
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
