// ChaSetLabel.qml — Cross-Stack Accessible Label Component
// 100% Parity with React Label.tsx
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property string text: ""
    property string size: "default"     // "default" | "sm"
    property bool disabled: false
    property bool required: false
    property bool optional: false
    property bool invalid: false
    property string description: ""
    property string tooltip: ""
    property bool forceHover: false
    property bool forceActive: false
    property alias horizontalAlignment: labelText.horizontalAlignment

    signal clicked()

    readonly property bool isSm: root.size === "sm"
    readonly property int pixelSize: isSm ? 12 : 14
    readonly property bool isDark: ThemeTokens.dark

    implicitWidth: layoutCol.implicitWidth
    implicitHeight: Math.max(isSm ? 16 : 20, layoutCol.implicitHeight)

    opacity: root.disabled ? 0.5 : (root.forceActive ? 0.7 : (root.forceHover ? 0.8 : 1.0))

    Column {
        id: layoutCol
        spacing: 3
        anchors.verticalCenter: parent.verticalCenter

        Row {
            id: contentRow
            spacing: 4

            Text {
                id: labelText
                text: root.text
                font.pixelSize: root.pixelSize
                font.weight: Font.Medium
                color: root.disabled
                    ? ThemeTokens.disabledText
                    : (root.invalid ? ThemeTokens.danger : ThemeTokens.text)
                verticalAlignment: Text.AlignVCenter
            }

            Text {
                id: requiredStar
                text: "*"
                font.pixelSize: root.pixelSize
                font.weight: Font.DemiBold
                color: ThemeTokens.danger
                visible: root.required
                verticalAlignment: Text.AlignVCenter
            }

            Text {
                id: optionalLabel
                text: "(optional)"
                font.pixelSize: root.isSm ? 10 : 12
                font.weight: Font.Normal
                color: ThemeTokens.subduedText
                visible: root.optional && !root.required
                verticalAlignment: Text.AlignVCenter
            }

            Item {
                id: tooltipIcon
                visible: root.tooltip !== ""
                width: root.isSm ? 12 : 14
                height: root.isSm ? 12 : 14
                anchors.verticalCenter: parent.verticalCenter

                Text {
                    anchors.centerIn: parent
                    text: "ⓘ"
                    font.pixelSize: root.isSm ? 11 : 13
                    color: ThemeTokens.subduedText
                }

                ToolTip {
                    visible: tooltipMouseArea.containsMouse && root.tooltip !== ""
                    text: root.tooltip
                    delay: 300
                }

                MouseArea {
                    id: tooltipMouseArea
                    anchors.fill: parent
                    hoverEnabled: true
                }
            }
        }

        Text {
            id: descText
            text: root.description
            visible: root.description !== ""
            font.pixelSize: root.isSm ? 10 : 12
            font.weight: Font.Normal
            color: ThemeTokens.subduedText
            wrapMode: Text.WordWrap
        }
    }

    MouseArea {
        id: mouseArea
        anchors.fill: parent
        enabled: !root.disabled
        cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.ArrowCursor
        onClicked: root.clicked()
    }
}
