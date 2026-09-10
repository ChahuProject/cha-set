// SelectDocPage.qml — Living Documentation for ChaSetSelect
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Select"
    description: "Displays a list of options for the user to pick from — triggered by a button with chevron and checked indicators."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "installation", title: "Installation" },
        { id: "props", title: "API Reference" }
    ]

    property string selectedFruit: "apple"

    ComponentPreview {
        title: "Select Preview"
        reactCode: `<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Choose fruit..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="cherry">Cherry</SelectItem>
  </SelectContent>
</Select>`
        qtCode: `ChaSetSelect {
    value: "apple"
    placeholder: "Choose fruit..."
    options: [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "cherry", label: "Cherry" }
    ]
    onValueChanged: function(val) { console.log(val) }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 16

                ChaSetSelect {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: 200
                    height: 32
                    value: root.selectedFruit
                    placeholder: "Select fruit..."
                    options: [
                        { value: "apple", label: "🍎 Apple" },
                        { value: "banana", label: "🍌 Banana" },
                        { value: "cherry", label: "🍒 Cherry" },
                        { value: "dragonfruit", label: "🐉 Dragonfruit (Disabled)", disabled: true }
                    ]
                    onValueChanged: root.selectedFruit = value
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Selected value: " + root.selectedFruit
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                    font.family: "monospace"
                }
            }
        }
    }

    KeyboardShortcutsTable {
        componentId: "select"
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetSelect { ... }"
        language: "qml"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "value", type: "string", default: "''", description: "The currently selected option value." },
            { name: "placeholder", type: "string", default: "'Select an option...'", description: "Placeholder label displayed when no value is chosen." },
            { name: "options", type: "var[]", default: "[]", description: "Array of selectable option objects: { value, label, disabled }." },
            { name: "disabled", type: "bool", default: "false", description: "Whether the select control is disabled." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the select trigger." }
        ]
    }
}
