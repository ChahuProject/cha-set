// LanguageSettingsDocPage.qml — Living Documentation for ChaSetLanguageSettings
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Language Settings"
    description: "Cross-stack language configuration card with system detection and cultural poetry quotes."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property string demoPref: ChaSetI18n.preference

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        title: "Interactive Language Settings"
        stageHeight: Math.max(380, langSettingsComp.implicitHeight + 48)
        reactCode: `<LanguageSettings
  preference="${root.demoPref}"
  onPreferenceChange={(next) => console.log('Language changed:', next)}
  showFollowSystem={true}
/>`
        qtCode: `ChaSetLanguageSettings {
    preference: "${root.demoPref}"
    showFollowSystem: true
    onPreferenceChanged: function(next) {
        console.log("Language changed:", next)
    }
}`

        Rectangle {
            anchors.fill: parent
            color: "transparent"

            Column {
                anchors.top: parent.top
                anchors.topMargin: 24
                anchors.horizontalCenter: parent.horizontalCenter
                width: Math.min(parent.width - 48, 540)

                ChaSetLanguageSettings {
                    id: langSettingsComp
                    width: parent.width
                    preference: root.demoPref
                    onPreferenceModified: function(next) {
                        root.demoPref = next;
                    }
                }
            }
        }
    }

    // Section 2: Installation
    ChaSetCodeBlock {
        title: "Installation"
        code: `import ChaSet 1.0

ChaSetLanguageSettings {
    preference: ChaSetI18n.preference
    showFollowSystem: true
    onPreferenceChanged: function(next) {
        ChaSetI18n.setPreference(next)
    }
}`
        language: "qml"
    }

    // Section 3: Animations
    Column {
        width: parent.width
        spacing: 8

        DocText {
            text: "Animations & Transitions"
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeHeading
            font.bold: true
        }

        DocText {
            width: parent.width
            text: "LanguageSettings utilizes smooth token transitions for card focus, active selection rings, and checkmark badge states. Transitions use ThemeTokens.motionQuick and ThemeTokens.easeStandard. Respects ThemeTokens.animationsEnabled as global kill switch."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: Text.Wrap
        }
    }

    // Section 4: Keyboard Navigation
    KeyboardShortcutsTable {
        componentId: "language-settings"
    }

    // Section 5: Props Reference
    Column {
        width: parent.width
        spacing: 8

        DocText {
            text: "Props Reference"
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeHeading
            font.bold: true
        }

        PropsTable {
            width: parent.width
            props: [
                {
                    name: "preference",
                    type: "string",
                    defaultValue: "\"system\"",
                    description: "Active language preference, either \"system\" or an explicit language code."
                },
                {
                    name: "showFollowSystem",
                    type: "bool",
                    defaultValue: "true",
                    description: "Whether to show the prominent Follow System option card with system detection."
                },
                {
                    name: "variant",
                    type: "string",
                    defaultValue: "\"card\"",
                    description: "Visual container variant. \"card\" renders an outer bordered card with header; \"embedded\" renders inline content without outer frame."
                },
                {
                    name: "disabled",
                    type: "bool",
                    defaultValue: "false",
                    description: "Whether the language selection controls are disabled."
                },
                {
                    name: "textProvider",
                    type: "var",
                    defaultValue: "null",
                    description: "Optional custom translation function for overriding component strings."
                }
            ]
        }
    }
}
