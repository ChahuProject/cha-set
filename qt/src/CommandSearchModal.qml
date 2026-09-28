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

    onVisibleChanged: {
        if (visible) {
            searchInput.forceActiveFocus()
            searchInput.selectAll()
        }
    }

    MouseArea { anchors.fill: parent; onClicked: root.close() }

    ChaSetCard {
        id: searchCard
        width: Math.min(parent.width - ThemeTokens.dp(40), ThemeTokens.dp(560))
        height: Math.min(parent.height - ThemeTokens.dp(80), ThemeTokens.dp(420))
        customRadius: ThemeTokens.dp(8)
        anchors.centerIn: parent

        Item {
            anchors.fill: parent
            clip: true

            MouseArea { anchors.fill: parent }

            // Search Input with search icon, clearable, borderless
            ChaSetInput {
                id: searchInput
                anchors.top: parent.top
                anchors.topMargin: ThemeTokens.dp(10)
                anchors.left: parent.left
                anchors.leftMargin: ThemeTokens.dp(12)
                anchors.right: parent.right
                anchors.rightMargin: ThemeTokens.dp(12)
                height: ThemeTokens.dp(34)
                placeholderText: qsTr("搜索组件与文档...")
                text: root.query
                bordered: false
                clearable: true
                icon: "search"
                selectByMouse: true
                onTextEdited: {
                    root.query = searchInput.text
                    root.selectedIndex = 0
                }
                onCleared: {
                    root.query = ""
                    searchInput.text = ""
                    root.selectedIndex = 0
                }
                onAccepted: {
                    if (root.filteredItems.length > 0 && root.selectedIndex < root.filteredItems.length) {
                        root.selectPage(root.filteredItems[root.selectedIndex].id)
                        root.close()
                    }
                }
                Keys.onEscapePressed: root.close()
                Keys.onDownPressed: {
                    if (root.selectedIndex < root.filteredItems.length - 1) {
                        root.selectedIndex++
                        resultsList.positionViewAtIndex(root.selectedIndex, ListView.Contain)
                    }
                }
                Keys.onUpPressed: {
                    if (root.selectedIndex > 0) {
                        root.selectedIndex--
                        resultsList.positionViewAtIndex(root.selectedIndex, ListView.Contain)
                    }
                }
                Component.onCompleted: forceActiveFocus()
            }

            ChaSetSeparator {
                id: searchSeparator
                anchors.top: searchInput.bottom
                anchors.topMargin: ThemeTokens.dp(8)
                anchors.left: parent.left
                anchors.right: parent.right
            }

            // Results List (Virtualized via Qt Quick ListView)
            ListView {
                id: resultsList
                anchors.top: searchSeparator.bottom
                anchors.topMargin: ThemeTokens.dp(4)
                anchors.bottom: footerBar.top
                anchors.left: parent.left
                anchors.leftMargin: ThemeTokens.dp(8)
                anchors.right: parent.right
                anchors.rightMargin: ThemeTokens.dp(8)
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
                    height: ThemeTokens.dp(50)
                    radius: ThemeTokens.dp(6)
                    color: root.selectedIndex === itemDelegate.index ? ThemeTokens.hover : "transparent"

                    // Top-right anchored category badge (independent of content, never overflows)
                    ChaSetBadge {
                        id: categoryBadge
                        anchors.top: parent.top
                        anchors.topMargin: ThemeTokens.dp(6)
                        anchors.right: parent.right
                        anchors.rightMargin: ThemeTokens.dp(8)
                        size: "sm"
                        variant: "outline"
                        text: itemDelegate.modelData ? (itemDelegate.modelData.category || "") : ""
                    }

                    // Content column constrained between left and categoryBadge
                    Column {
                        anchors.left: parent.left
                        anchors.leftMargin: ThemeTokens.dp(10)
                        anchors.right: categoryBadge.left
                        anchors.rightMargin: ThemeTokens.dp(10)
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: ThemeTokens.dp(2)

                        Text {
                            text: itemDelegate.modelData ? (itemDelegate.modelData.title || "") : ""
                            color: root.selectedIndex === itemDelegate.index ? ThemeTokens.accent : ThemeTokens.text
                            font.family: Typography.familySans
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightBold
                            elide: Text.ElideRight
                            width: parent.width
                        }

                        Text {
                            text: itemDelegate.modelData ? (itemDelegate.modelData.desc || "") : ""
                            color: ThemeTokens.subduedText
                            font.family: Typography.familySans
                            font.pixelSize: Typography.sizeCaption
                            elide: Text.ElideRight
                            width: parent.width
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

            // Bottom Keyboard Shortcut & Result Count Footer Bar (Matching React styling)
            Rectangle {
                id: footerBar
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.bottom: parent.bottom
                height: ThemeTokens.dp(34)
                color: ThemeTokens.panelRaised

                Rectangle {
                    anchors.top: parent.top
                    anchors.left: parent.left
                    anchors.right: parent.right
                    height: 1
                    color: ThemeTokens.border
                }

                Row {
                    anchors.left: parent.left
                    anchors.leftMargin: ThemeTokens.dp(14)
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: ThemeTokens.dp(16)

                    Row {
                        spacing: ThemeTokens.dp(6)
                        anchors.verticalCenter: parent.verticalCenter
                        Rectangle {
                            width: upTxt.implicitWidth + ThemeTokens.dp(8)
                            height: ThemeTokens.dp(18)
                            radius: ThemeTokens.dp(3)
                            color: ThemeTokens.panel
                            border.width: 1
                            border.color: ThemeTokens.border
                            Text {
                                id: upTxt
                                anchors.centerIn: parent
                                text: "Up"
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeNano
                                font.family: Typography.familyMono
                            }
                        }
                        Rectangle {
                            width: downTxt.implicitWidth + ThemeTokens.dp(8)
                            height: ThemeTokens.dp(18)
                            radius: ThemeTokens.dp(3)
                            color: ThemeTokens.panel
                            border.width: 1
                            border.color: ThemeTokens.border
                            Text {
                                id: downTxt
                                anchors.centerIn: parent
                                text: "Down"
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeNano
                                font.family: Typography.familyMono
                            }
                        }
                        Text {
                            text: qsTr("导航")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeMicro
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    Row {
                        spacing: ThemeTokens.dp(6)
                        anchors.verticalCenter: parent.verticalCenter
                        Rectangle {
                            width: entTxt.implicitWidth + ThemeTokens.dp(8)
                            height: ThemeTokens.dp(18)
                            radius: ThemeTokens.dp(3)
                            color: ThemeTokens.panel
                            border.width: 1
                            border.color: ThemeTokens.border
                            Text {
                                id: entTxt
                                anchors.centerIn: parent
                                text: "Enter"
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeNano
                                font.family: Typography.familyMono
                            }
                        }
                        Text {
                            text: qsTr("打开")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeMicro
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    Row {
                        spacing: ThemeTokens.dp(6)
                        anchors.verticalCenter: parent.verticalCenter
                        Rectangle {
                            width: escTxt.implicitWidth + ThemeTokens.dp(8)
                            height: ThemeTokens.dp(18)
                            radius: ThemeTokens.dp(3)
                            color: ThemeTokens.panel
                            border.width: 1
                            border.color: ThemeTokens.border
                            Text {
                                id: escTxt
                                anchors.centerIn: parent
                                text: "Esc"
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeNano
                                font.family: Typography.familyMono
                            }
                        }
                        Text {
                            text: qsTr("关闭")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeMicro
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }
                }

                Text {
                    anchors.right: parent.right
                    anchors.rightMargin: ThemeTokens.dp(14)
                    anchors.verticalCenter: parent.verticalCenter
                    text: qsTr("%1 个结果").arg(root.filteredItems.length)
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeMicro
                }
            }
        }
    }
}
