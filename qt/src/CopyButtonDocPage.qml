// CopyButtonDocPage.qml — Living Documentation for ChaSetCopyButton
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Copy Button"
    description: "One-click clipboard copy button with transient feedback state and configurable timeouts."

    property string copyStatus: "Click the copy button to test"

    ComponentPreview {
        title: "Copy Button Sandbox"
        reactCode: `<div className="flex items-center gap-4">\n  <CopyButton text="pnpm add @chahu/cha-set" />\n  <CopyButton text="https://chahu.design" label="Copy Link" />\n  <CopyButton text="export const SECRET = 'sk_live_948271';" variant="default" label="Copy Secret" />\n</div>`
        qtCode: `Row {\n    spacing: 12\n    ChaSetCopyButton {\n        text: "pnpm add @chahu/cha-set"\n        onCopiedToClipboard: function(txt) { console.log("Copied: " + txt) }\n    }\n    ChaSetCopyButton {\n        text: "https://chahu.design"\n        label: "Copy Link"\n        variant: "outline"\n    }\n    ChaSetCopyButton {\n        text: "export const SECRET = 'sk_live_948271';"\n        label: "Copy Secret"\n        variant: "default"\n    }\n}`

        Item {
            anchors.fill: parent

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

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetCopyButton {
    text: "pnpm add @chahu/cha-set"
    label: "Copy Command"
    onCopiedToClipboard: (txt) => console.log("Copied:", txt)
}`
        reactCode: `import { CopyButton } from '@chahu/cha-set';

<CopyButton text="pnpm add @chahu/cha-set" label="Copy Command" />`
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

    "
        language: "qml"
    }

    ComponentReference {
        name: "CopyButton"
        componentId: "copy-button"
        propsModel: [
            { name: "text", type: "string", default: "''", description: "The string content sent to the clipboard when clicked (alias: textToCopy)." },
            { name: "label", type: "string", default: "''", description: "Optional companion label text displayed next to the copy icon." },
            { name: "copiedLabel", type: "string", default: "'Copied!'", description: "Feedback label text displayed after successfully copying." },
            { name: "timeout", type: "int", default: "2000", description: "Duration in milliseconds that the success check icon persists." },
            { name: "variant", type: "string", default: "'outline'", description: "Visual variant style: 'outline' | 'ghost' | 'default' | 'secondary'." },
            { name: "size", type: "string", default: "'icon-xs'", description: "Button sizing preset: 'icon-xs', 'icon-sm', 'sm', 'default'." }
        ]
    }
}
        ]
    }
}
