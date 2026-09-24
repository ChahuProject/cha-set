// ChaSetCardHeader.qml — Header container for Card
// Matching React: flex flex-col space-y-1.5 p-6
import QtQuick 6.10
import ChaSet

Item {
    id: root

    function findCard() {
        var p = root.parent;
        while (p) {
            if (p.size !== undefined && p.variant !== undefined) return p;
            p = p.parent;
        }
        return null;
    }
    readonly property Item parentCard: findCard()
    readonly property bool isSm: parentCard && parentCard.size === "sm"

    property int padding: ThemeTokens.dp(isSm ? 16 : 24)
    property int spacing: ThemeTokens.dp(isSm ? 4 : 6)

    property string title: ""
    property string description: ""

    default property alias contentData: col.data

    implicitWidth: col.implicitWidth + padding * 2
    implicitHeight: col.implicitHeight + padding * 2
    width: parent ? parent.width : implicitWidth
    height: implicitHeight

    Column {
        id: col
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.leftMargin: root.padding
        anchors.rightMargin: root.padding
        anchors.topMargin: root.padding
        spacing: root.spacing

        TextEdit {
            id: richHeaderText
            visible: root.title !== "" || root.description !== ""
            width: parent.width
            textFormat: TextEdit.RichText
            wrapMode: TextEdit.WordWrap
            text: {
                if (!root.title && !root.description) return "";
                var isDark = ThemeTokens.dark;
                var titleCol = isDark ? "rgb(248, 250, 252)" : "rgb(2, 8, 23)";
                var descCol = isDark ? "rgb(148, 163, 184)" : "rgb(100, 116, 139)";
                var html = "<div style='line-height: 1.25;'>";
                if (root.title) {
                    html += "<div style='font-size: 13.5pt; font-weight: 600; color: " + titleCol + ";'>" + root.title + "</div>";
                }
                if (root.description) {
                    html += "<div style='margin-top: 3pt; font-size: 10.5pt; line-height: 1.4; color: " + descCol + ";'>" + root.description + "</div>";
                }
                html += "</div>";
                return html;
            }
            height: visible ? contentHeight : 0
            readOnly: true
            selectByMouse: true
            selectByKeyboard: true
            cursorVisible: false
            activeFocusOnPress: true
            textMargin: 0
            padding: 0
            selectionColor: ThemeTokens.accent
            selectedTextColor: "#ffffff"

            HoverHandler {
                cursorShape: Qt.IBeamCursor
            }

            onSelectedTextChanged: {
                if (selectedText.length > 0) SelectionHub.claim(richHeaderText);
                else if (SelectionHub.activeOwner === richHeaderText) SelectionHub.clear(richHeaderText);
            }

            Keys.onPressed: function(event) {
                if (event.matches(StandardKey.Copy) || (event.key === Qt.Key_C && (event.modifiers & (Qt.ControlModifier | Qt.MetaModifier)))) {
                    SelectionHub.copyActiveSelection();
                    event.accepted = true;
                }
            }

            TapHandler {
                acceptedButtons: Qt.RightButton
                onTapped: function(eventPoint) {
                    var scenePos = eventPoint.scenePosition;
                    SelectionHub.showContextMenu(scenePos.x, scenePos.y, richHeaderText);
                }
            }
        }
    }
}
