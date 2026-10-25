// LanguageSettingsDocPage.qml — Living Documentation for ChaSetLanguageSettings
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Language Settings"
    description: ChaSetI18n.tr("components.language-settings.description", "Cross-stack language configuration card with system detection and cultural poetry quotes.")

    property string demoPref: ChaSetI18n.preference

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        title: ChaSetI18n.tr("desktopComposite.languageSettings.sandboxTitle", "Interactive Language Settings")
        // langSettingsComp.implicitHeight is already uiScale-scaled pixels; convert back
        // to logical units before passing into stageHeight (ComponentPreview re-applies dp()).
        stageHeight: Math.max(380, langSettingsComp.implicitHeight / ThemeTokens.uiScale + 48)
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
                anchors.topMargin: ThemeTokens.dp(24)
                anchors.horizontalCenter: parent.horizontalCenter
                width: Math.min(parent.width - ThemeTokens.dp(48), ThemeTokens.dp(540))

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
        spacing: ThemeTokens.dp(8)

        DocText {
            text: ChaSetI18n.tr("showcase.animations", "Animations")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeHeading
            font.bold: true
        }

        DocText {
            width: parent.width
            text: ChaSetI18n.tr("desktopComposite.languageSettings.animFull", "LanguageSettings utilizes smooth token transitions for card focus, active selection rings, and checkmark badge states. Transitions use ThemeTokens.motionQuick and ThemeTokens.easeStandard. Respects ThemeTokens.animationsEnabled as global kill switch.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: Text.Wrap
        }
    }

    // Section 4: Keyboard Navigation & Props Reference
    DocMarkdown {
        width: parent.width
        docId: "language-settings"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "language-settings"
        section: "props"
    }
}
