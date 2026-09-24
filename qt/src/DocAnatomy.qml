// DocAnatomy.qml — Cross-Stack Component Anatomy / Import Viewer
// Standardized Dual-Tab Anatomy viewer matching React DocAnatomy.tsx
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Column {
    id: root
    width: parent ? parent.width : ThemeTokens.dp(760)
    spacing: ThemeTokens.dp(12)

    property string sectionId: "anatomy"
    property string pageTitle: "Anatomy"
    property string description: "Import and structure definition for Qt Quick and React."
    property string reactCode: ""
    property string qtCode: ""
    property string activeTab: "qt" // Qt showcase defaults to Qt QML tab

    Column {
        width: parent.width
        spacing: ThemeTokens.dp(4)

        DocText {
            text: root.pageTitle
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
            color: ThemeTokens.text
        }

        DocText {
            visible: root.description.length > 0
            text: root.description
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
        }
    }

    ChaSetCard {
        width: parent.width
        clip: true

        Column {
            width: parent.width
            spacing: 0

            // Header strip
            Rectangle {
                width: parent.width
                height: ThemeTokens.dp(44)
                color: ThemeTokens.dark ? Qt.rgba(30/255, 41/255, 59/255, 0.4) : Qt.rgba(241/255, 245/255, 249/255, 0.4)

                Rectangle {
                    anchors.bottom: parent.bottom
                    width: parent.width
                    height: 1
                    color: ThemeTokens.border
                }

                ChaSetSegmentedControl {
                    anchors.left: parent.left
                    anchors.leftMargin: ThemeTokens.dp(12)
                    anchors.verticalCenter: parent.verticalCenter
                    size: "default"
                    value: root.activeTab
                    options: [
                        { label: "Qt Quick (QML)", value: "qt" },
                        ...(root.reactCode !== "" ? [{ label: "React (TSX)", value: "react" }] : [])
                    ]
                    onValueSelected: function(val) {
                        root.activeTab = val
                    }
                }
            }

            // QML Code Block
            ChaSetCodeBlock {
                visible: root.activeTab === "qt"
                width: parent.width
                code: root.qtCode.trim()
                language: "qml"
                radius: 0
            }

            // React Code Block
            ChaSetCodeBlock {
                visible: root.activeTab === "react" && root.reactCode !== ""
                width: parent.width
                code: root.reactCode.trim()
                language: "tsx"
                radius: 0
            }
        }
    }
}
