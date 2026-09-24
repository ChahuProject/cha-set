// LanguageSettingsDocPage.qml — Living Documentation for ChaSetLanguageSettings
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Language Settings"
    description: "Cross-stack language configuration card with system detection and cultural poetry quotes."

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

    DocAnatomy {
        sectionId: "anatomy"
        width: parent.width
        qtCode: `import ChaSet

ChaSetLanguageSettings {
    currentLocale: "en-US"
    onLocaleChanged: (l) => console.log(l)
}`
        reactCode: `import { LanguageSettings } from '@chahu/cha-set';

<LanguageSettings currentLocale="en-US" onLocaleChange={(l) => console.log(l)} />`
    }

    // Section 3: Animations
    Column {
        property string sectionId: "animations"
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

    // Section 4: Keyboard Navigation & Props Reference
    ComponentReference {
        name: "LanguageSettings"
        componentId: "language-settings"
        propsModel: [
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
