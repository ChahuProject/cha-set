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
    text: "Project Apollo Architecture"
    onTextCommitted: function(newVal) { console.log(newVal) }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 16

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Double-click the label below to edit in place:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                }

                ChaSetInlineEditableText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: 260
                    text: root.currentTitle
                    onTextCommitted: function(newVal) {
                        root.currentTitle = newVal
                    }
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
        code: "import ChaSet 1.0\n\nChaSetInlineEditableText { text: \"Sample Title\" }"
        language: "qml"
    }

    
    KeyboardShortcutsTable {
        componentId: "inline-editable-text"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "text", type: "string", default: "'Double click to edit'", description: "The active text value displayed and edited." },
            { name: "placeholder", type: "string", default: "'Enter text...'", description: "Fallback text when the text property is empty." },
            { name: "editing", type: "bool", default: "false", description: "Whether the component is currently in input edit mode." }
        ]
    }
}
