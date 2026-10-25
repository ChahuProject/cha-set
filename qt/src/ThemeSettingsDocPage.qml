// ThemeSettingsDocPage.qml — Living Documentation for ChaSetThemeSettings
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Theme Settings"
    description: ChaSetI18n.tr("components.theme-settings.description", "Cross-stack theme settings controller managing mode, accent palette, decoration level, and UI density.")

    property var demoConfig: ({
        version: 1,
        mode: "system",
        palette: { id: "neutral", customHex: "#30a0ff" },
        decoration: { styleId: "simple", level: 50, overrides: {} },
        typography: { familyId: "system", scaleId: "default" },
        uiScale: 1.0
    })

    property var activeConfig: root.demoConfig
    signal configModified(var nextConfig)
    signal resetRequested()

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        title: ChaSetI18n.tr("desktopComposite.themeSettings.sandboxTitle", "Interactive Theme Settings")
        // settingsComp.implicitHeight is already uiScale-scaled pixels; convert back
        // to logical units before passing into stageHeight (ComponentPreview re-applies dp()).
        stageHeight: Math.max(620, settingsComp.implicitHeight / ThemeTokens.uiScale + 48)
        reactCode: `<ThemeSettings
  config={demoConfig}
  onChange={(next) => setDemoConfig(next)}
  onReset={() => console.log('Reset triggered')}
/>`
        qtCode: `ChaSetThemeSettings {
    config: root.demoConfig
    onConfigModified: function(next) {
        console.log("Theme updated:", JSON.stringify(next))
    }
}`

        Rectangle {
            anchors.fill: parent
            color: "transparent"

            Column {
                anchors.top: parent.top
                anchors.topMargin: ThemeTokens.dp(24)
                anchors.horizontalCenter: parent.horizontalCenter
                width: Math.min(parent.width - ThemeTokens.dp(48), ThemeTokens.dp(520))

                ChaSetThemeSettings {
                    id: settingsComp
                    width: parent.width
                    config: root.activeConfig
                    onConfigModified: function(next) {
                        root.demoConfig = next;
                        root.configModified(next);
                    }
                    onResetRequested: function() {
                        root.resetRequested();
                    }
                }

                Binding {
                    target: settingsComp
                    property: "config"
                    value: root.activeConfig
                }
            }
        }
    }

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetThemeSettings {
    width: parent.width
}`
        reactCode: `import { ThemeSettings } from '@chahu/cha-set';

<ThemeSettings />`
    }

    DocMarkdown {
        width: parent.width
        docId: "theme-settings"
        section: "animations"
    }

    DocMarkdown {
        width: parent.width
        docId: "theme-settings"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "theme-settings"
        section: "props"
    }
}
