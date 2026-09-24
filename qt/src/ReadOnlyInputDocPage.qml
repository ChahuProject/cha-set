// ReadOnlyInputDocPage.qml — Living Documentation for ChaSetReadOnlyInput
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Read-Only Input"
    description: "Protected display field for non-editable cryptographic tokens, resource IDs, and keys with an integrated one-click copy button."

    ComponentPreview {
        title: "Read-Only Input Sandbox"
        reactCode: `<ReadOnlyInput
  value="cs_live_94817264810294827104"
  showCopy
  masked
  maskChar="•"
/>`
        qtCode: `ChaSetReadOnlyInput {
    value: "cs_live_94817264810294827104"
    masked: true
    showCopy: true
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(16)
                width: ThemeTokens.dp(360)

                Column {
                    spacing: ThemeTokens.dp(6)
                    width: parent.width
                    DocText { text: "API Secret Key (Masked with Copy):"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetReadOnlyInput {
                        width: parent.width
                        value: "cs_live_94817264810294827104"
                        masked: true
                        showCopy: true
                    }
                }

                Column {
                    spacing: ThemeTokens.dp(6)
                    width: parent.width
                    DocText { text: "GitHub Personal Access Token (Masked):"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                    ChaSetReadOnlyInput {
                        width: parent.width
                        value: "ghp_3847291847291048291048291840"
                        masked: true
                        showCopy: true
                    }
                }
            }
        }
    }

    DocAnatomy {
        sectionId: "anatomy"
        width: parent.width
        qtCode: `import ChaSet

ChaSetReadOnlyInput {
    value: "api_key_secret_12345"
    label: "API Key"
}`
        reactCode: `import { ReadOnlyInput } from '@chahu/cha-set';

<ReadOnlyInput value="api_key_secret_12345" label="API Key" />`
    }

    ComponentPreview {
        property string sectionId: "variants"
        title: "Sizes & Status Variants"
        reactCode: `<ReadOnlyInput value="default_token_val_1" size="default" />
<ReadOnlyInput value="compact_sm_token_2" size="sm" />
<ReadOnlyInput value="destructive_secret_3" colorScheme="destructive" />
<ReadOnlyInput value="warning_token_4" colorScheme="warning" />
<ReadOnlyInput value="success_token_5" colorScheme="success" />`
        qtCode: `ChaSetReadOnlyInput { value: "chaset_default_token_preview"; size: "default" }
ChaSetReadOnlyInput { value: "chaset_compact_sm_token_preview"; size: "sm" }
ChaSetReadOnlyInput { value: "chaset_destructive_revoked"; colorScheme: "destructive" }
ChaSetReadOnlyInput { value: "chaset_warning_expiring_soon"; colorScheme: "warning" }
ChaSetReadOnlyInput { value: "chaset_success_verified"; colorScheme: "success" }`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(10)
                width: ThemeTokens.dp(360)

                ChaSetReadOnlyInput { width: parent.width; value: "chaset_default_token_preview"; size: "default" }
                ChaSetReadOnlyInput { width: parent.width; value: "chaset_compact_sm_token_preview"; size: "sm" }
                ChaSetReadOnlyInput { width: parent.width; value: "chaset_destructive_revoked"; colorScheme: "destructive" }
                ChaSetReadOnlyInput { width: parent.width; value: "chaset_warning_expiring_soon"; colorScheme: "warning" }
                ChaSetReadOnlyInput { width: parent.width; value: "chaset_success_verified"; colorScheme: "success" }
            }
        }
    }

    ComponentReference {
        name: "ReadOnlyInput"
        componentId: "read-only-input"
        propsModel: [
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
