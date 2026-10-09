// KeybindingRecorderDocPage.qml — Living Documentation for ChaSetKeybindingRecorder
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Keybinding Recorder"
    description: ChaSetI18n.tr("components.keybinding-recorder.description", "Interactive keyboard sequence recorder that captures desktop accelerator combinations (Ctrl, Alt, Shift, Meta).")

    property string boundKey: "Ctrl+Shift+P"
    property string compactKey: "Ctrl+K"

    Column {
        property string sectionId: "overview"
        width: parent.width
        spacing: ThemeTokens.dp(8)
        DocText { text: ChaSetI18n.tr("desktopComposite.keybindingRecorder.overviewHeading", "Interactive Overview"); color: ThemeTokens.text; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold }
        DocText { width: parent.width; wrapMode: Text.WordWrap; text: ChaSetI18n.tr("desktopComposite.keybindingRecorder.overviewDesc", "Click the recorder box below and press any key combination (e.g. Ctrl+Alt+S)."); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeBody }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.keybindingRecorder.sandboxTitle", "Keybinding Recorder Sandbox")
        reactCode: `<KeybindingRecorder
  value={binding}
  onValueChange={setBinding}
  placeholder="Click to record shortcut..."
/>`
        qtCode: `ChaSetKeybindingRecorder {
    width: 240
    value: "Ctrl+Shift+P"
    size: "default"
    clearable: true
    onKeybindingRecorded: function(b) { console.log(b) }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(16)

                Column {
                    spacing: ThemeTokens.dp(6)
                    anchors.horizontalCenter: parent.horizontalCenter
                    DocText { text: ChaSetI18n.tr("components.keybindingRecorder.clickToRecord", "Click recorder box and press shortcut combination:"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetKeybindingRecorder {
                        width: ThemeTokens.dp(240)
                        value: root.boundKey
                        clearable: true
                        onKeybindingRecorded: function(val) {
                            root.boundKey = val
                        }
                    }
                }

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: ChaSetI18n.tr("components.keybindingRecorder.recordedAccelerator", "Recorded accelerator:") + " " + root.boundKey
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

ChaSetKeybindingRecorder {
    keySequence: "Ctrl+Shift+P"
    onKeySequenceChanged: (k) => console.log(k)
}`
        reactCode: `import { KeybindingRecorder } from '@chahu/cha-set';

<KeybindingRecorder value="Ctrl+Shift+P" onChange={(k) => console.log(k)} />`
    }

    Column {
        property string sectionId: "variants"
        width: parent.width
        spacing: ThemeTokens.dp(8)
        DocText { text: ChaSetI18n.tr("components.keybindingRecorder.sizesAndStates", "Sizes & States"); color: ThemeTokens.text; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold }
        DocText { width: parent.width; wrapMode: Text.WordWrap; text: ChaSetI18n.tr("components.keybindingRecorder.sizesAndStatesDesc", "Available in default and sm sizing tiers, with optional clearing and disabled states."); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeBody }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("components.keybindingRecorder.sizesAndStates", "Sizes & States")
        reactCode: `<KeybindingRecorder value="Ctrl+K" size="default" />
<KeybindingRecorder value="Ctrl+Shift+P" size="sm" />
<KeybindingRecorder value="Alt+F4" clearable={false} />
<KeybindingRecorder value="Ctrl+C" disabled />`
        qtCode: `ChaSetKeybindingRecorder { value: "Ctrl+K"; size: "default" }
ChaSetKeybindingRecorder { value: "Ctrl+Shift+P"; size: "sm" }
ChaSetKeybindingRecorder { value: "Alt+F4"; clearable: false }
ChaSetKeybindingRecorder { value: "Ctrl+C"; enabled: false }`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(14)
                width: ThemeTokens.dp(384)

                Column {
                    spacing: ThemeTokens.dp(6)
                    width: parent.width
                    DocText { text: ChaSetI18n.tr("components.keybindingRecorder.defaultWithClear", "Default Size (with Clear)"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetKeybindingRecorder { width: parent.width; value: "Ctrl+K"; size: "default"; clearable: true }
                }

                Column {
                    spacing: ThemeTokens.dp(6)
                    width: parent.width
                    DocText { text: ChaSetI18n.tr("components.keybindingRecorder.compactSm", "Compact sm Tier"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetKeybindingRecorder { width: parent.width; value: "Ctrl+Shift+P"; size: "sm"; clearable: true }
                }

                Column {
                    spacing: ThemeTokens.dp(6)
                    width: parent.width
                    DocText { text: ChaSetI18n.tr("components.keybindingRecorder.withoutClear", "Without Clear Button"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetKeybindingRecorder { width: parent.width; value: "Alt+F4"; clearable: false }
                }

                Column {
                    spacing: ThemeTokens.dp(6)
                    width: parent.width
                    DocText { text: ChaSetI18n.tr("components.keybindingRecorder.disabledTitle", "Disabled State"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetKeybindingRecorder { width: parent.width; value: "Ctrl+C"; enabled: false }
                }
            }
        }
    }

    ComponentReference {
        name: "KeybindingRecorder"
        componentId: "keybinding-recorder"
        propsModel: [
            { name: "value", type: "string", default: "'Ctrl+K'", description: ChaSetI18n.tr("components.keybindingRecorder.valueShortDesc", "The serialized shortcut string representation (e.g. 'Ctrl+Shift+P').") },
            { name: "keybinding", type: "string", default: "'Ctrl+K'", description: ChaSetI18n.tr("components.keybindingRecorder.aliasDesc", "Alias for value.") },
            { name: "size", type: "'default' | 'sm'", default: "'default'", description: ChaSetI18n.tr("components.keybindingRecorder.sizeDesc", "Size preset variant for regular or compact density.") },
            { name: "clearable", type: "bool", default: "true", description: ChaSetI18n.tr("components.keybindingRecorder.clearableDesc", "Whether to display a clear button when a shortcut is set.") },
            { name: "recording", type: "bool", default: "false", description: ChaSetI18n.tr("components.keybindingRecorder.recordingDesc", "Whether the recorder is actively listening for key combinations.") },
            { name: "disabled", type: "bool", default: "false", description: ChaSetI18n.tr("components.keybindingRecorder.disabledDesc", "Whether the recorder is disabled.") },
            { name: "customRadius", type: "int", default: "6", description: ChaSetI18n.tr("components.keybindingRecorder.cornerRadiusDesc", "Corner radius of the input container.") }
        ]
    }
}

