// SelectDocPage.qml — Living Documentation for ChaSetSelect
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Select"
    description: "Displays a list of options for the user to pick from — triggered by a button with chevron and checked indicators."

    property string selectedFruit: "apple"

    ComponentPreview {
        title: "Select Sandbox"
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
                spacing: ThemeTokens.dp(16)

                ChaSetSelect {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: ThemeTokens.dp(200)
                    height: ThemeTokens.dp(32)
                    value: root.selectedFruit
                    placeholder: "Select fruit..."
                    options: [
                        { value: "apple", label: "Apple" },
                        { value: "banana", label: "Banana" },
                        { value: "cherry", label: "Cherry" },
                        { value: "dragonfruit", label: "Dragonfruit (Disabled)", disabled: true }
                    ]
                    onValueChanged: root.selectedFruit = value
                }

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Selected value: " + root.selectedFruit
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                    font.family: Typography.familyMono
                }
            }
        }
    }

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetSelect {
    model: ["Apple", "Banana", "Orange"]
    currentText: "Apple"
}`
        reactCode: `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@chahu/cha-set';

<Select defaultValue="apple">
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Select fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectContent>
</Select>`
    }



    ComponentReference {
        name: "Select"
        componentId: "select"
        propsModel: [
            { name: "value", type: "string", default: "''", description: "The currently selected option value." },
            { name: "placeholder", type: "string", default: "'Select an option...'", description: "Placeholder label displayed when no value is chosen." },
            { name: "options", type: "var[]", default: "[]", description: "Array of selectable option objects: { value, label, disabled }." },
            { name: "disabled", type: "bool", default: "false", description: "Whether the select control is disabled." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the select trigger." }
        ]
    }
}
        ]
    }
}
