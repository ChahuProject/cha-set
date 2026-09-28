// ChaSetHistoryInput.qml — Cross-Stack Input with History Suggestions Dropdown
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property string text: ""
    property string placeholderText: ""
    property alias placeholder: root.placeholderText
    property string size: "default"
    property bool disabled: false
    property bool readOnly: false
    property bool invalid: false
    property bool clearable: true
    property var history: []
    property int maxHistoryItems: 8
    property int highlightedIndex: -1
    property string icon: ""
    property string iconPosition: "left"
    property bool reserveIconSlot: false

    signal textEdited()
    signal accepted()
    signal cleared()
    signal selectHistory(string item)

    implicitWidth: inputField.implicitWidth
    implicitHeight: inputField.implicitHeight

    function forceActiveFocus() {
        inputField.forceActiveFocus();
    }

    readonly property var filteredHistory: {
        if (!root.history || root.history.length === 0) return [];
        var q = root.text.trim().toLowerCase();
        var res = [];
        for (var i = 0; i < root.history.length; i++) {
            var item = String(root.history[i]);
            if (!q || item.toLowerCase().indexOf(q) >= 0) {
                res.push(item);
                if (res.length >= root.maxHistoryItems) break;
            }
        }
        return res;
    }

    ChaSetInput {
        id: inputField
        anchors.fill: parent
        text: root.text
        placeholderText: root.placeholderText
        size: root.size
        disabled: root.disabled
        readOnly: root.readOnly
        invalid: root.invalid
        clearable: root.clearable
        icon: root.icon
        iconPosition: root.iconPosition
        reserveIconSlot: root.reserveIconSlot

        onTextEdited: {
            root.text = text;
            root.textEdited();
            if (root.filteredHistory.length > 0 && inputField.inputItem.activeFocus) {
                historyPopup.open();
                root.highlightedIndex = 0;
            } else {
                historyPopup.close();
            }
        }

        onAccepted: {
            if (historyPopup.opened && root.highlightedIndex >= 0 && root.highlightedIndex < root.filteredHistory.length) {
                chooseItem(root.filteredHistory[root.highlightedIndex]);
            } else {
                root.accepted();
            }
        }

        onCleared: {
            root.text = "";
            root.cleared();
            historyPopup.close();
        }

        inputItem.onActiveFocusChanged: {
            if (inputField.inputItem.activeFocus) {
                if (root.filteredHistory.length > 0) {
                    historyPopup.open();
                    root.highlightedIndex = -1;
                }
            } else {
                historyPopup.close();
            }
        }

        Keys.onPressed: (event) => {
            if (event.key === Qt.Key_Escape) {
                if (historyPopup.opened) {
                    event.accepted = true;
                    historyPopup.close();
                    root.highlightedIndex = -1;
                }
            } else if (event.key === Qt.Key_Down) {
                if (root.filteredHistory.length > 0) {
                    event.accepted = true;
                    if (!historyPopup.opened) {
                        historyPopup.open();
                        root.highlightedIndex = 0;
                    } else {
                        root.highlightedIndex = Math.min(root.highlightedIndex + 1, root.filteredHistory.length - 1);
                    }
                }
            } else if (event.key === Qt.Key_Up) {
                if (historyPopup.opened && root.filteredHistory.length > 0) {
                    event.accepted = true;
                    root.highlightedIndex = Math.max(root.highlightedIndex - 1, 0);
                }
            }
        }
    }

    function chooseItem(item) {
        root.text = item;
        inputField.text = item;
        historyPopup.close();
        root.selectHistory(item);
        root.accepted();
    }

    Popup {
        id: historyPopup
        y: root.height + ThemeTokens.dp(4)
        width: root.width
        height: Math.min(ThemeTokens.dp(220), historyList.contentHeight + ThemeTokens.dp(10))
        padding: ThemeTokens.dp(4)
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

        background: Rectangle {
            color: ThemeTokens.panel
            radius: ThemeTokens.dp(6)
            border.color: ThemeTokens.border
            border.width: 1
        }

        contentItem: ListView {
            id: historyList
            clip: true
            model: root.filteredHistory
            ScrollBar.vertical: ChaSetScrollBar {}

            delegate: Rectangle {
                id: itemRect
                required property var modelData
                required property int index

                width: historyList.width
                height: ThemeTokens.dp(32)
                radius: ThemeTokens.dp(4)
                color: itemRect.index === root.highlightedIndex ? ThemeTokens.hover : "transparent"

                Row {
                    anchors.fill: parent
                    anchors.leftMargin: ThemeTokens.dp(8)
                    anchors.rightMargin: ThemeTokens.dp(8)
                    spacing: ThemeTokens.dp(8)

                    ChaSetIcon {
                        name: "clock"
                        size: 14
                        color: ThemeTokens.subduedText
                        anchors.verticalCenter: parent.verticalCenter
                    }

                    Text {
                        text: String(itemRect.modelData)
                        color: ThemeTokens.text
                        font.pixelSize: Typography.sizeSmall
                        elide: Text.ElideRight
                        verticalAlignment: Text.AlignVCenter
                        anchors.verticalCenter: parent.verticalCenter
                        width: parent.width - ThemeTokens.dp(30)
                    }
                }

                HoverHandler {
                    cursorShape: Qt.PointingHandCursor
                    onHoveredChanged: {
                        if (hovered) {
                            root.highlightedIndex = itemRect.index;
                        }
                    }
                }

                TapHandler {
                    onTapped: {
                        chooseItem(itemRect.modelData);
                    }
                }
            }
        }
    }
}
