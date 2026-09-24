// CopyButtonDocPage.qml — Living Documentation for ChaSetCopyButton
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Copy Button"
    description: "One-click clipboard copy button with transient feedback state and configurable timeouts."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property string copyStatus: "Click the copy button to test"

    ComponentPreview {
        title: "Copy Button Sandbox"
        reactCode: `<div className="flex items-center gap-4">\n  <CopyButton text="pnpm add @chahu/cha-set" />\n  <CopyButton text="https://chahu.design" label="Copy Link" />\n  <CopyButton text="export const SECRET = 'sk_live_948271';" variant="default" label="Copy Secret" />\n</div>`
        qtCode: `Row {\n    spacing: 12\n    ChaSetCopyButton {\n        text: "pnpm add @chahu/cha-set"\n        onCopiedToClipboard: function(txt) { console.log("Copied: " + txt) }\n    }\n    ChaSetCopyButton {\n        text: "https://chahu.design"\n        label: "Copy Link"\n        variant: "outline"\n    }\n    ChaSetCopyButton {\n        text: "export const SECRET = 'sk_live_948271';"\n        label: "Copy Secret"\n        variant: "default"\n    }\n}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(16)

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: ThemeTokens.dp(12)

                    Rectangle {
                        width: ThemeTokens.dp(240)
                        height: ThemeTokens.dp(32)
                        color: ThemeTokens.panel
                        border.color: ThemeTokens.border
                        border.width: 1
                        radius: ThemeTokens.dp(6)

                        DocText {
                            anchors.verticalCenter: parent.verticalCenter
                            anchors.left: parent.left
                            anchors.leftMargin: ThemeTokens.dp(10)
                            text: "pnpm add @chahu/cha-set"
                            color: ThemeTokens.text
                            font.pixelSize: Typography.sizeSmall
                            font.family: Typography.familyMono
                        }
                    }

                    ChaSetCopyButton {
                        text: "pnpm add @chahu/cha-set"
                        size: "icon-sm"
                        onCopiedToClipboard: function(txt) {
                            root.copyStatus = "Successfully copied: " + txt
                        }
                    }

                    ChaSetCopyButton {
                        text: "https://chahu.design"
                        label: "Copy Link"
                        variant: "outline"
                        onCopiedToClipboard: function(txt) {
                            root.copyStatus = "Successfully copied: " + txt
                        }
                    }

                    ChaSetCopyButton {
                        text: "export const SECRET = 'sk_live_948271';"
                        label: "Copy Secret"
                        variant: "default"
                        onCopiedToClipboard: function(txt) {
                            root.copyStatus = "Successfully copied: " + txt
                        }
                    }
                }

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: root.copyStatus
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                    font.family: Typography.familyMono
                }
            }
        }
    }

    ChaSetCodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetCopyButton { text: \"Hello\"; label: \"Copy\" }"
        language: "qml"
    }

    KeyboardShortcutsTable {
        componentId: "copy-button"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "text", type: "string", default: "''", description: "The string content sent to the clipboard when clicked (alias: textToCopy)." },
            { name: "label", type: "string", default: "''", description: "Optional companion label text displayed next to the copy icon." },
            { name: "copiedLabel", type: "string", default: "'Copied!'", description: "Feedback label text displayed after successfully copying." },
            { name: "timeout", type: "int", default: "2000", description: "Duration in milliseconds that the success check icon persists." },
            { name: "variant", type: "string", default: "'outline'", description: "Visual variant style: 'outline' | 'ghost' | 'default' | 'secondary'." },
            { name: "size", type: "string", default: "'icon-xs'", description: "Button sizing preset: 'icon-xs', 'icon-sm', 'sm', 'default'." }
        ]
    }
}
