// ThemeSettingsDocPage.qml — Living Documentation for ChaSetThemeSettings
import QtQuick 6.10
import QtQuick.Controls 6.10
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
        stageHeight: Math.max(620, settingsComp.implicitHeight + 48)
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
                anchors.topMargin: 24
                anchors.horizontalCenter: parent.horizontalCenter
                width: Math.min(parent.width - 48, 520)

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



    // Animations Section
    Column {
        width: parent.width
        spacing: 8

        DocText {
            text: ChaSetI18n.tr("showcase.animations", "Animations")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            width: parent.width
            text: ChaSetI18n.tr("desktopComposite.themeSettings.animFull", "ThemeSettings uses unified motion tokens for smooth state transitions across buttons, segmented controls, color pickers, and override drawers. Transitions use ThemeTokens.motionQuick and ThemeTokens.easeStandard. Respects ThemeTokens.animationsEnabled as global kill switch.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: Text.Wrap
        }
    }

    ComponentReference {
        name: "ThemeSettings"
        componentId: "theme-settings"
        propsModel: [
            { name: "config", type: "var", defaultVal: "{}", description: ChaSetI18n.tr("components.themeSettings.configQtDesc", "Canonical theme configuration object matching ThemeConfig schema.") },
            { name: "controlled", type: "bool", defaultVal: "false", description: ChaSetI18n.tr("components.themeSettings.controlledDesc", "Controlled mode: the component never writes back to `config`; every edit is emitted through configModified only. Enable it when the host drives `config` from its own state (a declarative binding), so a local snapshot can never overwrite host-owned fields such as uiScale.") },
            { name: "variant", type: "string", defaultVal: "\"card\"", description: ChaSetI18n.tr("components.themeSettings.variantQtDesc", "Container treatment: \"card\" wraps the rows in a panel, \"embedded\" renders them bare.") },
            { name: "disabled", type: "bool", defaultVal: "false", description: ChaSetI18n.tr("components.themeSettings.disabledDesc", "Disables all interactive controls and dims opacity.") },
            { name: "showReset", type: "bool", defaultVal: "true", description: ChaSetI18n.tr("components.themeSettings.showResetDesc", "Whether to display the reset button in header.") },
            { name: "showExport", type: "bool", defaultVal: "true", description: ChaSetI18n.tr("components.themeSettings.showExportDesc", "Whether to display the export JSON button in header.") },
            { name: "showImport", type: "bool", defaultVal: "true", description: ChaSetI18n.tr("components.themeSettings.showImportDesc", "Whether to display the import button in header.") },
            { name: "showTypography", type: "bool", defaultVal: "false", description: ChaSetI18n.tr("components.themeSettings.showTypographyQtDesc", "Whether to render typography selection rows.") },
            { name: "textProvider", type: "var", defaultVal: "undefined", description: ChaSetI18n.tr("components.themeSettings.textProviderQtDesc", "Optional i18n string resolver function.") }
        ]
    }
}
