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
    property int customRadius: 6
    property bool searchable: false
    property bool searchDefaultOpen: false
    property string searchQuery: ""
    property string searchPlaceholder: qsTr("搜索...")
    property bool isSearchOpen: searchDefaultOpen || (searchQuery.length > 0)

    readonly property int effectiveItemHeight: ThemeTokens.dp(root.itemHeight)
    readonly property int effectiveEstimateSize: ThemeTokens.dp(root.estimateSize)
    readonly property int effectiveRadius: ThemeTokens.dp(root.customRadius)

    property alias count: listView.count
    property alias listView: listView

    signal searchRequested(string query)

    function scrollToIndex(index, align) {
        if (!listView) return
        var idx = Math.floor(Number(index))
        if (isNaN(idx)) return
        var totalCount = listView.count
        if (totalCount <= 0) {
            if (typeof root.model === "number") {
                totalCount = root.model
            } else if (root.model && typeof root.model.length === "number") {
                totalCount = root.model.length
            }
        }
        var maxIdx = totalCount > 0 ? totalCount - 1 : 0
        var targetIndex = Math.max(0, Math.min(idx, maxIdx))
        var posMode = ListView.Beginning
        if (align === "center") {
            posMode = ListView.Center
        } else if (align === "end") {
            posMode = ListView.End
        } else if (align === "auto" || align === "visible" || align === "contain") {
            posMode = ListView.Contain
        }
        listView.positionViewAtIndex(targetIndex, posMode)
        listView.currentIndex = targetIndex
    }

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
            listView.positionViewAtIndex(0, ListView.Beginning)
        } else if (event.key === Qt.Key_End) {
            event.accepted = true
            var lastIdx = Math.max(0, listView.count - 1)
            listView.currentIndex = lastIdx
            listView.positionViewAtIndex(lastIdx, ListView.End)
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
        border.color: (root.activeFocus || (searchField && searchField.activeFocus)) ? ThemeTokens.focus : ThemeTokens.border
        border.width: (root.activeFocus || (searchField && searchField.activeFocus)) ? 2 : 1
        radius: root.effectiveRadius
        clip: true

        Item {
            id: searchHeader
            visible: root.searchable && root.isSearchOpen
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.right: parent.right
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
            anchors.top: searchHeader.bottom
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.bottom: parent.bottom
            contentWidth: width
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
