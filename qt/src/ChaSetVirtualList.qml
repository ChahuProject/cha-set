// ChaSetVirtualList.qml — Cross-Stack Virtual List Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property alias model: listView.model
    property alias delegate: listView.delegate
    property alias currentIndex: listView.currentIndex
    property int itemHeight: 36
    property int estimateSize: 36
    property int gap: 0
    property int overscan: 8
    property bool searchable: false
    property bool searchDefaultOpen: false
    property string searchQuery: ""
    property string searchPlaceholder: qsTr("搜索...")
    property bool isSearchOpen: searchDefaultOpen || (searchQuery.length > 0)

    signal searchRequested(string query)

    function openSearch() {
        if (searchable) {
            isSearchOpen = true;
            searchField.forceActiveFocus();
        }
    }

    implicitWidth: ThemeTokens.dp(320)
    implicitHeight: ThemeTokens.dp(280)
    activeFocusOnTab: true

    Keys.onUpPressed: function(event) {
        event.accepted = true
        listView.decrementCurrentIndex()
    }

    Keys.onDownPressed: function(event) {
        event.accepted = true
        listView.incrementCurrentIndex()
    }

    Keys.onPressed: function(event) {
        if (event.key === Qt.Key_PageUp) {
            event.accepted = true
            for (var i = 0; i < 5; i++) listView.decrementCurrentIndex()
        } else if (event.key === Qt.Key_PageDown) {
            event.accepted = true
            for (var j = 0; j < 5; j++) listView.incrementCurrentIndex()
        } else if (event.key === Qt.Key_Home) {
            event.accepted = true
            listView.currentIndex = 0
        } else if (event.key === Qt.Key_End) {
            event.accepted = true
            listView.currentIndex = Math.max(0, listView.count - 1)
        } else if (root.searchable && !root.isSearchOpen && event.text.length === 1 && !event.modifiers) {
            event.accepted = true
            root.isSearchOpen = true
            root.searchQuery = event.text
            root.searchRequested(event.text)
            searchField.forceActiveFocus()
        }
    }

    Rectangle {
        anchors.fill: parent
        color: ThemeTokens.panel
        border.color: root.activeFocus ? ThemeTokens.focus : ThemeTokens.border
        border.width: root.activeFocus ? 2 : 1
        radius: ThemeTokens.dp(root.customRadius)
        clip: true

        Column {
            anchors.fill: parent

            // Search Box Header
            Item {
                id: searchHeader
                visible: root.searchable && root.isSearchOpen
                width: parent.width
                height: visible ? ThemeTokens.dp(36) : 0

                ChaSetInput {
                    id: searchField
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(3)
                    size: "sm"
                    text: root.searchQuery
                    placeholderText: root.searchPlaceholder
                    clearable: true
                    icon: "search"

                    onTextEdited: {
                        root.searchQuery = text
                        root.searchRequested(text)
                    }

                    onCleared: {
                        root.searchQuery = ""
                        root.searchRequested("")
                        if (!root.searchDefaultOpen) {
                            root.isSearchOpen = false
                        }
                    }

                    Keys.onEscapePressed: {
                        if (root.searchQuery.length > 0) {
                            root.searchQuery = ""
                            root.searchRequested("")
                        } else if (!root.searchDefaultOpen) {
                            root.isSearchOpen = false
                            root.forceActiveFocus()
                        }
                    }
                }
            }

            ListView {
                id: listView
                width: parent.width
                height: parent.height - (searchHeader.visible ? searchHeader.height : 0)
            boundsBehavior: Flickable.StopAtBounds
            clip: true
            reuseItems: true
            spacing: ThemeTokens.dp(root.gap)
            cacheBuffer: root.overscan * (root.estimateSize > 0 ? root.effectiveEstimateSize : root.effectiveItemHeight)

            ScrollBar.vertical: ChaSetScrollBar {
                orientation: Qt.Vertical
                policy: ScrollBar.AsNeeded
            }

            WheelHandler {
                target: listView
                onWheel: function(event) {
                    listView.flick(0, event.angleDelta.y * 5)
                }
            }
        }
    }
}
}
