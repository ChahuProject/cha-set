// ReadOnlyInputDocPage.qml — Living Documentation for ChaSetReadOnlyInput
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Interactive Controls"
    pageTitle: "Read-Only Input"
    description: "Protected display field for non-editable cryptographic tokens, resource IDs, and keys with an integrated one-click copy button."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    ComponentPreview {
        title: "Read-Only Input Preview"
        reactCode: `<ReadOnlyInput value="chaset_live_sec_994a28be401cb18" masked />`
        qtCode: `ChaSetReadOnlyInput {
    value: "chaset_live_sec_994a28be401cb18"
    masked: true
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 16

                Column {
                    spacing: 6
                    Text { text: "API Secret Key (Masked):"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                    ChaSetReadOnlyInput {
                        width: 340
                        value: "chaset_live_sec_994a28be401cb18"
                        masked: true
                    }
                }

                Column {
                    spacing: 6
                    Text { text: "Container Instance ID (Compact):"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                    ChaSetReadOnlyInput {
                        width: 340
                        size: "sm"
                        value: "sha256:d84f10928e3bca71059f1c7"
                    }
                }
            }
        }
    }

    ChaSetCodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetReadOnlyInput { value: \"token_123\"; masked: true }"
        language: "qml"
    }

    KeyboardShortcutsTable {
        componentId: "read-only-input"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "value", type: "string", default: "''", description: "The read-only token or string to be displayed and copied." },
            { name: "placeholder", type: "string", default: "''", description: "Placeholder text displayed when value is empty." },
            { name: "masked", type: "bool", default: "false", description: "Whether to obscure characters for secrets/passwords." },
            { name: "showMaskToggle", type: "bool", default: "true", description: "Whether to render the reveal eye toggle button." },
            { name: "maskChar", type: "string", default: "'•'", description: "Character used for masking." },
            { name: "size", type: "string", default: "'default'", description: "Size variant: 'default' | 'sm'." },
            { name: "disabled", type: "bool", default: "false", description: "Whether user interaction is disabled." },
            { name: "showCopy", type: "bool", default: "true", description: "Whether to display the copy-to-clipboard button." },
            { name: "colorScheme", type: "string", default: "'default'", description: "Color theme variant: 'default', 'destructive', 'warning', 'success'." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the input container." }
        ]
    }
}
