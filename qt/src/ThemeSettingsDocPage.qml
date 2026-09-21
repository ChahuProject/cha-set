// ThemeSettingsDocPage.qml — Living Documentation for ChaSetThemeSettings
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Theme Settings"
    description: "Cross-stack theme settings controller managing mode, accent palette, decoration level, and UI density."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property var demoConfig: ({
        version: 1,
        mode: "system",
        palette: { id: "neutral", customHex: "#30a0ff" },
        decoration: { styleId: "simple", level: 50, overrides: {} },
        typography: { familyId: "system", scaleId: "default" },
        uiScale: 1.0
    })

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        title: "Interactive Theme Settings"
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
                    config: root.demoConfig
                    onConfigModified: function(next) {
                        root.demoConfig = next;
                    }
                }
            }
        }
    }

    // Section 2: Installation
    ChaSetCodeBlock {
        title: "Installation"
        code: `import ChaSet 1.0

ChaSetThemeSettings {
    config: currentConfig
    onConfigModified: function(next) {
        themeManager.applyThemeConfig(next)
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
            text: "ThemeSettings uses unified motion tokens for smooth state transitions across buttons, segmented controls, color pickers, and override drawers. Transitions use ThemeTokens.motionQuick and ThemeTokens.easeStandard. Respects ThemeTokens.animationsEnabled as global kill switch."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: Text.Wrap
        }
    }

    // Section 4: Keyboard Navigation
    Column {
        width: parent.width
        spacing: 8

        DocText {
            text: "Keyboard Navigation"
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeHeading
            font.bold: true
        }

        KeyboardShortcutsTable {
            width: parent.width
            componentId: "theme-settings"
        }
    }

    // Section 5: Props Reference
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: "Props Reference"
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeHeading
            font.bold: true
        }

        Rectangle {
            width: parent.width
            implicitHeight: propsCol.implicitHeight + 24
            radius: 8
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1

            Column {
                id: propsCol
                x: 16
                y: 12
                width: parent.width - 32
                spacing: 12

                DocText { text: "• config: var — Canonical theme configuration object matching ThemeConfig schema."; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall }
                DocText { text: "• disabled: bool — Disables all interactive controls and dims opacity. Default: false."; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall }
                DocText { text: "• showReset: bool — Whether to display the reset button in header. Default: true."; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall }
                DocText { text: "• showExport: bool — Whether to display the export JSON button in header. Default: true."; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall }
                DocText { text: "• showImport: bool — Whether to display the import button in header. Default: true."; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall }
                DocText { text: "• showTypography: bool — Whether to render typography selection rows. Default: false."; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall }
                DocText { text: "• textProvider: var — Optional i18n string resolver function (key, defaultText) => string."; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall }
                DocText { text: "• signal configChanged(var nextConfig) — Emitted when configuration values change."; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                DocText { text: "• signal resetRequested() — Emitted when reset is clicked."; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
                DocText { text: "• signal exportRequested(string jsonString) — Emitted when export is clicked."; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall }
            }
        }
    }
}
