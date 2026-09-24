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
    property string description: "Import and structure definition for React and Qt Quick."
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
        id: card
        width: parent.width
        clip: true

        Column {
            id: body
            width: parent.width
            spacing: 0

            // Header strip. Qt's Rectangle clip is square, so every full-bleed
            // child that touches a card corner must re-apply the card radius and
            // square off the interior side with a same-colored patch.
            Rectangle {
                id: header
                width: parent.width
                height: ThemeTokens.dp(44)
                radius: card.radius
                color: card.isDark ? Qt.rgba(30/255, 41/255, 59/255, 0.4) : Qt.rgba(241/255, 245/255, 249/255, 0.4)

                // Squares the bottom corners; the card owns the top rounding.
                Rectangle {
                    anchors.bottom: parent.bottom
                    width: parent.width
                    height: parent.radius
                    color: parent.color
                }

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

            // QML Code Block — rounded on the bottom corner (flush with the card),
            // squared on the top interior edge by a same-colored patch inset by the
            // card hairline so the card's side border stays unbroken.
            ChaSetCodeBlock {
                id: qtBlock
                visible: root.activeTab === "qt"
                width: parent.width
                code: root.qtCode.trim()
                language: "qml"
                radius: card.radius

                Rectangle {
                    z: -1
                    anchors.top: parent.top
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.leftMargin: 1
                    anchors.rightMargin: 1
                    height: card.radius
                    color: parent.color
                }
            }

            // React Code Block
            ChaSetCodeBlock {
                id: reactBlock
                visible: root.activeTab === "react" && root.reactCode !== ""
                width: parent.width
                code: root.reactCode.trim()
                language: "tsx"
                radius: card.radius

                Rectangle {
                    z: -1
                    anchors.top: parent.top
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.leftMargin: 1
                    anchors.rightMargin: 1
                    height: card.radius
                    color: parent.color
                }
            }
        }
    }
}