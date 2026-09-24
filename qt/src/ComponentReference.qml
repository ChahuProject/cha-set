// ComponentReference.qml — Standard Showcase Component Reference Container for Qt Quick
// Encapsulates Keyboard Navigation on top and Properties on bottom, matching React ComponentReference.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Column {
    id: root
    width: parent ? parent.width : ThemeTokens.dp(760)
    spacing: ThemeTokens.dp(32)

    property string name: ""
    property string componentId: ""
    property var shortcutsModel: []
    property var propsModel: []
    property alias props: root.propsModel
    property string description: ""
    property bool isSubComponent: false

    readonly property string keyboardSectionId: root.isSubComponent
        ? (root.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-keyboard")
        : "keyboard"

    readonly property string propsSectionId: root.isSubComponent
        ? (root.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-props")
        : "props"

    readonly property var activeShortcuts: {
        if (root.shortcutsModel && root.shortcutsModel.length > 0) return root.shortcutsModel;
        if (root.componentId !== "" && ShowcaseData.keyboardShortcuts && ShowcaseData.keyboardShortcuts[root.componentId]) {
            return ShowcaseData.keyboardShortcuts[root.componentId];
        }
        return [];
    }

    readonly property bool hasShortcuts: activeShortcuts.length > 0

    readonly property string propTableTitle: {
        if (!root.name || root.name === "") return "Properties";
        if (root.name.indexOf("ChaSet") === 0) return root.name + " Properties";
        return "ChaSet" + root.name + " Properties";
    }

    readonly property string kbTitle: root.isSubComponent
        ? (root.name + " Keyboard Navigation & Shortcuts")
        : "Keyboard Navigation"

    // Exposed sub-items for DocLayout section scanner / scroll target
    readonly property Item kbItem: kbCol
    readonly property Item propsItem: propsCol

    // 1. Keyboard Navigation Section (Top)
    Column {
        id: kbCol
        visible: root.hasShortcuts
        width: parent.width
        spacing: ThemeTokens.dp(8)
        objectName: root.keyboardSectionId

        DocText {
            text: root.kbTitle
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
            color: ThemeTokens.text
        }

        DocText {
            text: "Keyboard shortcuts and interaction patterns for this component."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
        }

        KeyboardShortcutsTable {
            width: parent.width
            componentId: root.componentId
            shortcutsModel: root.shortcutsModel
            title: "" // suppress redundant internal title
        }
    }

    // 2. Props Section (Bottom)
    Column {
        id: propsCol
        width: parent.width
        spacing: ThemeTokens.dp(12)
        objectName: root.propsSectionId

        DocText {
            visible: !root.isSubComponent
            text: "Props Reference"
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

        PropsTable {
            width: parent.width
            title: root.propTableTitle
            propsModel: root.propsModel
        }
    }
}
