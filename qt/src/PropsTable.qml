// PropsTable.qml — Standard Component API Reference Table matching React PropsTable.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Column {
    id: root
    width: parent ? parent.width : ThemeTokens.dp(760)
    spacing: ThemeTokens.dp(10)

    property string title: ""
    property var propsModel: []
    property alias props: root.propsModel

    TextEdit {
        id: propTitleEdit
        visible: root.title !== ""
        text: root.title
        color: ThemeTokens.text
        font.family: Typography.familySans
        font.pixelSize: Typography.sizeHeading
        font.weight: Typography.weightSemibold
        font.letterSpacing: -0.2
        readOnly: true
        selectByMouse: true
        selectByKeyboard: true
        cursorVisible: false
        activeFocusOnPress: true
        textMargin: 0
        padding: 0
        selectionColor: ThemeTokens.accent
        selectedTextColor: "#ffffff"
        height: contentHeight

        HoverHandler {
            cursorShape: Qt.IBeamCursor
        }

        onSelectedTextChanged: {
            if (selectedText.length > 0) SelectionHub.claim(propTitleEdit);
            else if (SelectionHub.activeOwner === propTitleEdit) SelectionHub.clear(propTitleEdit);
        }

        TapHandler {
            acceptedButtons: Qt.RightButton
            onTapped: function(eventPoint) {
                var scenePos = eventPoint.scenePosition;
                SelectionHub.showContextMenu(scenePos.x, scenePos.y, propTitleEdit);
            }
        }
    }

    ChaSetTable {
        width: parent.width
        interactive: false
        columns: [
            { key: "prop", title: "PROP", width: 170, code: true },
            { key: "type", title: "TYPE", width: 180, badge: true },
            { key: "defaultVal", title: "DEFAULT", width: 100, code: true },
            { key: "description", title: "DESCRIPTION", wrap: true }
        ]
        rows: {
            var res = []
            if (!root.propsModel) return res
            for (var i = 0; i < root.propsModel.length; i++) {
                var m = root.propsModel[i]
                var name = m.name || m.propName || m[0] || ""
                var req = !!(m.required || m[4])
                var type = m.type || m.propType || m[1] || ""
                var def = (m.default !== undefined) ? m.default : (m.defaultValue !== undefined ? m.defaultValue : (m.propDefault !== undefined ? m.propDefault : (m[2] !== undefined ? m[2] : "—")))
                var desc = m.description || m.propDescription || m[3] || ""
                res.push({
                    prop: name + (req ? " *" : ""),
                    type: type,
                    defaultVal: def,
                    description: desc
                })
            }
            return res
        }
    }
}
