// PropsTable.qml — Standard Component API Reference Table matching React PropsTable.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Column {
    id: root
    width: parent ? parent.width : 760
    spacing: 10

    property string title: ""
    property var propsModel: []

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
            { key: "prop", title: "PROP", width: 160 },
            { key: "type", title: "TYPE", width: 140 },
            { key: "defaultVal", title: "DEFAULT", width: 90 },
            { key: "description", title: "DESCRIPTION" }
        ]
        rows: {
            var res = []
            if (!root.propsModel) return res
            for (var i = 0; i < root.propsModel.length; i++) {
                var m = root.propsModel[i]
                var name = m.name || m[0] || ""
                var req = !!(m.required || m[4])
                var type = m.type || m[1] || ""
                var def = (m.default || m.defaultValue || m[2]) ? (m.default || m.defaultValue || m[2]) : "—"
                var desc = m.description || m[3] || ""
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
