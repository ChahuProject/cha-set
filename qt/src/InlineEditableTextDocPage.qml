// InlineEditableTextDocPage.qml — Living Documentation for ChaSetInlineEditableText
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Inline Editable Text"
    description: ChaSetI18n.tr("components.inline-editable-text.description", "Text element that switches seamlessly to an input field on double-click or edit trigger, supporting Enter to save and Escape to cancel.")

    property string currentTitle: "Project Apollo Architecture"

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.inlineEditableText.sandboxTitle", "Inline Editable Text Sandbox")
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
                    text: ChaSetI18n.tr("components.inlineEditableText.clickToEdit", "Click or double-click the label below to edit in place:")
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
                    text: ChaSetI18n.tr("components.inlineEditableText.persistedValue", "Persisted Value: ") + "\"" + root.currentTitle + "\""
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
        property string sectionTitle: ChaSetI18n.tr("components.inlineEditableText.sizesAndTriggers", "Sizes & Interaction Triggers")
        title: ChaSetI18n.tr("components.inlineEditableText.sizesAndTriggers", "Sizes & Interaction Triggers")
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
                    DocText { text: ChaSetI18n.tr("components.inlineEditableText.singleClickActivation", "Single Click Activation (Default)"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    ChaSetInlineEditableText { width: parent.width; value: ChaSetI18n.tr("components.inlineEditableText.demoSingleClick", "Project Architecture Doc"); trigger: "click"; size: "default" }
                }

                Column {
                    spacing: 4
                    width: parent.width
                    DocText { text: ChaSetI18n.tr("components.inlineEditableText.doubleClickActivation", "Double Click Activation"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    ChaSetInlineEditableText { width: parent.width; value: ChaSetI18n.tr("components.inlineEditableText.demoDoubleClick", "Database Connection URI"); trigger: "doubleClick"; size: "default" }
                }

                Column {
                    spacing: 4
                    width: parent.width
                    DocText { text: ChaSetI18n.tr("components.inlineEditableText.compactSm", "Compact sm Size"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    ChaSetInlineEditableText { width: parent.width; value: ChaSetI18n.tr("components.inlineEditableText.demoCompact", "Sprint-42-Review"); size: "sm" }
                }

                Column {
                    spacing: 4
                    width: parent.width
                    DocText { text: ChaSetI18n.tr("components.inlineEditableText.disabledTitle", "Disabled State"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    ChaSetInlineEditableText { width: parent.width; value: ChaSetI18n.tr("components.inlineEditableText.demoDisabled", "System Protected File"); disabled: true }
                }
            }
        }
    }

    ComponentReference {
        name: "InlineEditableText"
        componentId: "inline-editable-text"
        propsModel: [
            { name: "value", type: "string", default: "'Click to edit'", description: ChaSetI18n.tr("components.inlineEditableText.valueDescQt", "The active text value displayed and edited.") },
            { name: "text", type: "string", default: "''", description: ChaSetI18n.tr("components.inlineEditableText.textDescQt", "Alias for value property.") },
            { name: "placeholder", type: "string", default: "'Enter text...'", description: ChaSetI18n.tr("components.inlineEditableText.placeholderDescQt", "Fallback text when the value property is empty.") },
            { name: "trigger", type: "string", default: "'click'", description: ChaSetI18n.tr("components.inlineEditableText.triggerDescQt", "Activation trigger: 'click' or 'doubleClick'.") },
            { name: "size", type: "string", default: "'default'", description: ChaSetI18n.tr("components.inlineEditableText.sizeDescQt", "Density and sizing variant: 'default' | 'sm'.") },
            { name: "disabled", type: "bool", default: "false", description: ChaSetI18n.tr("components.inlineEditableText.disabledDescQt", "Whether inline editing interaction is disabled.") },
            { name: "editing", type: "bool", default: "false", description: ChaSetI18n.tr("components.inlineEditableText.editingDesc", "Whether the component is currently in input edit mode.") }
        ]
    }
}
