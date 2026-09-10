// KeyboardShortcutsTable.qml — Keyboard Navigation & Shortcut Reference Table for ChaSet DocPages
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Column {
    id: root
    width: parent ? parent.width : 760
    spacing: 10

    property string title: "Keyboard Navigation & Shortcuts"
    property string componentId: ""
    property var shortcutsModel: []

    readonly property var activeShortcuts: {
        if (root.shortcutsModel && root.shortcutsModel.length > 0) {
            return root.shortcutsModel
        }
        if (root.componentId !== "" && ShowcaseData.keyboardShortcuts && ShowcaseData.keyboardShortcuts[root.componentId]) {
            return ShowcaseData.keyboardShortcuts[root.componentId]
        }
        return []
    }

    visible: activeShortcuts.length > 0

    Text {
        visible: root.title !== ""
        text: root.title
        color: ThemeTokens.text
        font.pixelSize: 15
        font.weight: Font.Bold
        font.letterSpacing: -0.2
    }

    ChaSetTable {
        width: parent.width
        columns: [
            { key: "key", title: "KEY SHORTCUT", width: 220 },
            { key: "action", title: "ACTION / BEHAVIOR" }
        ]
        rows: {
            var res = []
            var list = root.activeShortcuts
            for (var i = 0; i < list.length; i++) {
                var it = list[i]
                res.push({
                    key: it.key || "",
                    action: it.action || ""
                })
            }
            return res
        }
    }
}
