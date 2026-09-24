// InlineEditableTextDocPage.qml — Living Documentation for ChaSetInlineEditableText
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Inline Editable Text"
    description: "Seamless inline text label that dynamically transforms into an input field on double-click or edit trigger."

    property string currentTitle: "Project Apollo Architecture"

    ComponentPreview {
        title: "Inline Editable Text Sandbox"
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
                spacing: ThemeTokens.dp(16)

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Click or double-click the label below to edit in place:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }

                ChaSetInlineEditableText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: ThemeTokens.dp(260)
                    value: root.currentTitle
                    onSave: function(newVal) {
                        root.currentTitle = newVal
                    }
                }

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Persisted Value: \"" + root.currentTitle + "\""
                    color: ThemeTokens.text
                    font.pixelSize: Typography.sizeSmall
                    font.family: Typography.familyMono
                }
            }
        }
    }

    DocAnatomy {
        sectionId: "anatomy"
        width: parent.width
        qtCode: `import ChaSet

ChaSetInlineEditableText {
    text: "Project Title"
    onAccepted: (val) => console.log(val)
}`
        reactCode: `import { InlineEditableText } from '@chahu/cha-set';

<InlineEditableText value="Project Title" onSave={(val) => console.log(val)} />`
    }

    ComponentPreview {
        property string sectionId: "variants"
        property string sectionTitle: "Sizes & Interaction Triggers"
        title: "Sizes & Interaction Triggers"
        reactCode: `<InlineEditableText value="Single Click to Edit" trigger="click" size="default" />
<InlineEditableText value="Double Click to Edit" trigger="doubleClick" size="default" />
<InlineEditableText value="Compact sm Tier Label" size="sm" />
<InlineEditableText value="Read-only Disabled Text" disabled />`
        qtCode: `ChaSetInlineEditableText { value: "Project Architecture Doc"; trigger: "click"; size: "default" }
ChaSetInlineEditableText { value: "Database Connection URI"; trigger: "doubleClick"; size: "default" }
ChaSetInlineEditableText { value: "Sprint-42-Review"; size: "sm" }
ChaSetInlineEditableText { value: "System Protected File"; disabled: true }`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(14)
                width: ThemeTokens.dp(280)

                Column {
                    spacing: 4
                    width: parent.width
                    DocText { text: "Single Click Activation (Default)"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    ChaSetInlineEditableText { width: parent.width; value: "Project Architecture Doc"; trigger: "click"; size: "default" }
                }

                Column {
                    spacing: 4
                    width: parent.width
                    DocText { text: "Double Click Activation"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    ChaSetInlineEditableText { width: parent.width; value: "Database Connection URI"; trigger: "doubleClick"; size: "default" }
                }

                Column {
                    spacing: 4
                    width: parent.width
                    DocText { text: "Compact sm Size"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    ChaSetInlineEditableText { width: parent.width; value: "Sprint-42-Review"; size: "sm" }
                }

                Column {
                    spacing: 4
                    width: parent.width
                    DocText { text: "Disabled State"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    ChaSetInlineEditableText { width: parent.width; value: "System Protected File"; disabled: true }
                }
            }
        }
    }

    ComponentReference {
        name: "InlineEditableText"
        componentId: "inline-editable-text"
        propsModel: [
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
