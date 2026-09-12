// SplitButtonDocPage.qml — Living Documentation for ChaSetSplitButton
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Interactive Controls"
    pageTitle: "Split Button"
    description: "Combines a primary direct action button with an adjoining chevron menu trigger for secondary options."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    property string lastTriggered: "None"

    ComponentPreview {
        title: "Split Button Preview"
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
                        { id: "staging", label: "Deploy to Staging", icon: "🚀" },
                        { id: "tag", label: "Tag Release v1.2.0", icon: "🏷️" },
                        { id: "archive", label: "Archive Artifact", icon: "📦" },
                        { id: "abort", label: "Abort Pipeline", icon: "🛑", destructive: true }
                    ]
                    onClicked: root.lastTriggered = "Primary Action: Deploy Build triggered"
                    onMenuItemClicked: function(id) {
                        root.lastTriggered = "Menu Action: " + id + " triggered"
                    }
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Event: " + root.lastTriggered
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                    font.family: "monospace"
                }
            }
        }
    }

    ChaSetCodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetSplitButton { text: \"Deploy\"; menuItems: [...] }"
        language: "qml"
    }

    
    KeyboardShortcutsTable {
        componentId: "split-button"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "text", type: "string", default: "'Action'", description: "Label text for the primary button." },
            { name: "variant", type: "string", default: "'default'", description: "Visual variant style: 'default', 'secondary', 'outline', 'destructive'." },
            { name: "size", type: "string", default: "'default'", description: "Size scaling preset: 'sm', 'default', 'lg'." },
            { name: "menuItems", type: "var[]", default: "[]", description: "List of secondary options for the dropdown popup." },
            { name: "disabled", type: "bool", default: "false", description: "Whether the split button is disabled." }
        ]
    }
}
