// DocFooterSections.qml — Standardized Showcase Footer Container for Qt Quick
// Encapsulates Animations, Keyboard Navigation, and Props Reference matching React DocFooterSections.tsx
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Column {
    id: root
    width: parent ? parent.width : ThemeTokens.dp(760)
    spacing: ThemeTokens.dp(36)

    property string componentId: ""
    property var propsModel: []
    property var subComponents: []
    property string customAnimations: ""

    // 1. Animations Section
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(8)
        objectName: "animations"

        DocText {
            text: "Animations"
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
            color: ThemeTokens.text
        }

        DocText {
            text: root.customAnimations !== ""
                ? root.customAnimations
                : "State changes (hover, press, focus) animate over duration-quick with standard easing curves. Durations and easing resolve from theme tokens; prefers-reduced-motion zeroes them automatically (governed by ThemeTokens.animationsEnabled)."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    // 2. Keyboard Navigation Section
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(8)
        objectName: "keyboard"

        DocText {
            text: "Keyboard Navigation"
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
            color: ThemeTokens.text
        }

        DocText {
            width: parent.width
            wrap: true
            text: "Keyboard shortcuts and interaction patterns for this component."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
        }

        KeyboardShortcutsTable {
            width: parent.width
            componentId: root.componentId
            title: "" // Suppress internal redundant title
        }
    }

    // 3. Props Reference Section
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(12)
        objectName: "props"

        DocText {
            text: "Props Reference"
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
            color: ThemeTokens.text
        }

        // Single primary component props table
        PropsTable {
            visible: root.propsModel && root.propsModel.length > 0
            width: parent.width
            propsModel: root.propsModel
            title: "" // Suppress internal redundant title
        }

        // Multiple subcomponents props tables
        Repeater {
            model: root.subComponents
            delegate: Column {
                required property var modelData
                width: parent.width
                spacing: ThemeTokens.dp(6)

                DocText {
                    text: modelData.title || ""
                    font.pixelSize: Typography.sizeHeading
                    font.weight: Typography.weightSemibold
                    color: ThemeTokens.text
                }

                DocText {
                    visible: Boolean(modelData.description && modelData.description.length > 0)
                    text: modelData.description || ""
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }

                PropsTable {
                    width: parent.width
                    propsModel: modelData.props || []
                    title: ""
                }
            }
        }
    }
}
