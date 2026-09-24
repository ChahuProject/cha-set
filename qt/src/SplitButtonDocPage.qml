// SplitButtonDocPage.qml — Living Documentation for ChaSetSplitButton
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Split Button"
    description: "Combines a primary direct action button with an adjoining chevron menu trigger for secondary options."

    property string lastTriggered: "None"

    ComponentPreview {
        title: "Split Button Sandbox"
        reactCode: `<SplitButton
  text="Deploy to Production"
  variant="default"
  menuItems={[
    { label: "Deploy to Staging", onSelect: () => {} },
    { label: "Create Release Tag", onSelect: () => {} }
  ]}
  onClick={() => {}}
/>`
        qtCode: `ChaSetSplitButton {
    text: "Deploy to Production"
    variant: "default"
    menuItems: [
        { id: "staging", label: "Deploy to Staging" },
        { id: "tag", label: "Create Release Tag" },
        { id: "rollback", label: "Rollback Build", destructive: true }
    ]
    onClicked: console.log("Primary action")
    onMenuItemClicked: function(id) { console.log(id) }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 16

                ChaSetSplitButton {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Deploy Build #142"
                    variant: "default"
                    menuItems: [
                        { id: "staging", label: "Deploy to Staging", icon: "rocket" },
                        { id: "tag", label: "Tag Release v1.2.0", icon: "tag" },
                        { id: "archive", label: "Archive Artifact", icon: "package" },
                        { id: "abort", label: "Abort Pipeline", icon: "stop", destructive: true }
                    ]
                    onClicked: root.lastTriggered = "Primary Action: Deploy Build triggered"
                    onMenuItemClicked: function(id) {
                        root.lastTriggered = "Menu Action: " + id + " triggered"
                    }
                }

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Event: " + root.lastTriggered
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                    font.family: Typography.familyMono
                }
            }
        }
    }

    DocAnatomy {
        width: parent.width
        qtCode: "import ChaSet\n\nChaSetSplitButton {\n    text: \"Deploy\"\n    variant: \"default\"\n    menuItems: [\n        { id: \"staging\", label: \"Deploy to Staging\" }\n    ]\n}"
        reactCode: "import { SplitButton } from '@chahu/cha-set';\n\n<SplitButton\n  text=\"Deploy\"\n  variant=\"default\"\n  menuItems={[{ label: 'Deploy to Staging', onSelect: () => {} }]}\n/>"
    }

        // Animations
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(8)

        DocText {
            text: "Animations"
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
            color: ThemeTokens.text
        }

        DocText {
            text: "State changes (hover, press, focus) animate over duration-quick with standard easing curves. Durations and easing resolve from theme tokens; prefers-reduced-motion zeroes them automatically (governed by ThemeTokens.animationsEnabled)."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentReference {
        name: "SplitButton"
        componentId: "split-button"
        propsModel: [
            { name: "text", type: "string", default: "'Action'", description: "Label text for the primary button." },
            { name: "variant", type: "string", default: "'default'", description: "Visual variant style: 'default', 'secondary', 'outline', 'destructive'." },
            { name: "size", type: "string", default: "'default'", description: "Size scaling preset: 'sm', 'default', 'lg'." },
            { name: "menuItems", type: "var[]", default: "[]", description: "List of secondary options for the dropdown popup." },
            { name: "disabled", type: "bool", default: "false", description: "Whether the split button is disabled." }
        ]
    }
    }
}