// InlineEditableTextDocPage.qml — Living Documentation for ChaSetInlineEditableText
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Interactive Controls"
    pageTitle: "Inline Editable Text"
    description: "Seamless inline text label that dynamically transforms into an input field on double-click or edit trigger."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    property string currentTitle: "Project Apollo Architecture"

    ComponentPreview {
        title: "Inline Editable Text Preview"
        reactCode: `<InlineEditableText
  value={text}
  onSave={(val) => setText(val)}
  placeholder="Click to edit title..."
/>`
        qtCode: `ChaSetInlineEditableText {
    value: "Project Apollo Architecture"
    onSave: function(newVal) { console.log(newVal) }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 16

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Click or double-click the label below to edit in place:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                }

                ChaSetInlineEditableText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: 260
                    value: root.currentTitle
                    onSave: function(newVal) {
                        root.currentTitle = newVal
                    }
                }

                ChaSetInlineEditableText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: 260
                    size: "sm"
                    value: "Compact Tag: release-v1.4"
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Persisted Value: \"" + root.currentTitle + "\""
                    color: ThemeTokens.text
                    font.pixelSize: 12
                    font.family: "monospace"
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetInlineEditableText { value: \"Sample Title\" }"
        language: "qml"
    }

    KeyboardShortcutsTable {
        componentId: "inline-editable-text"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "value", type: "string", default: "'Click to edit'", description: "The active text value displayed and edited." },
            { name: "text", type: "string", default: "''", description: "Alias for value property." },
            { name: "placeholder", type: "string", default: "'Enter text...'", description: "Fallback text when the value property is empty." },
            { name: "trigger", type: "string", default: "'click'", description: "Activation trigger: 'click' or 'doubleClick'." },
            { name: "size", type: "string", default: "'default'", description: "Density and sizing variant: 'default' | 'sm'." },
            { name: "disabled", type: "bool", default: "false", description: "Whether inline editing interaction is disabled." },
            { name: "editing", type: "bool", default: "false", description: "Whether the component is currently in input edit mode." }
        ]
    }
}
