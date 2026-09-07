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
        { id: "props", title: "API Reference" }
    ]

    ComponentPreview {
        title: "Read-Only Input Preview"
        reactCode: `<ReadOnlyInput value="chaset_live_sk_948f98a2e4c19" />`
        qtCode: `ChaSetReadOnlyInput {
    value: "chaset_live_sk_948f98a2e4c19"
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 16

                Column {
                    spacing: 6
                    Text { text: "API Secret Key:"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                    ChaSetReadOnlyInput {
                        width: 340
                        value: "chaset_live_sec_994a28be401cb18"
                    }
                }

                Column {
                    spacing: 6
                    Text { text: "Container Instance ID:"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                    ChaSetReadOnlyInput {
                        width: 340
                        value: "sha256:d84f10928e3bca71059f1c7"
                    }
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetReadOnlyInput { value: \"token_123\" }"
        language: "qml"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "value", type: "string", default: "''", description: "The read-only token or string to be displayed and copied." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the input container." }
        ]
    }
}
