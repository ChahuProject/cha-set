// ExportModal.qml — Multi-Stack Config Exporter
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

ChaSetDialog {
    id: root

    property string exportTab: "css"
    property int customRadius: 8
    property string mode: ThemeTokens.dark ? "dark" : "light"
    property string activeAccent: ""
    property string overridePrimary: ""
    property string overridePrimaryFg: ""
    property string overrideSecondary: ""
    property string overrideSecondaryFg: ""
    property string overrideDestructive: ""
    property string overrideBackground: ""
    property string overrideCard: ""
    property string overrideRing: ""

    title: "Export & Copy Theme Configuration"
    description: "One-click copy tailored styles and component code for your target framework."
    dialogWidth: ThemeTokens.dp(680)

    signal close()

    onClosed: root.close()
    onRejected: root.close()

    function buildCssSnippet() {
        var lines = [];
        lines.push("/* ChaSet Design Tokens — Custom Theme Config */");
        lines.push("/* Mode: " + root.mode + " | Accent: " + (root.activeAccent || "default") + " */");
        lines.push(":root {");
        if (root.customRadius !== 8) lines.push("  --radius: " + (root.customRadius / 16.0) + "rem;");
        if (root.overridePrimary !== "") lines.push("  --primary: " + root.overridePrimary + ";");
        if (root.overridePrimaryFg !== "") lines.push("  --primary-foreground: " + root.overridePrimaryFg + ";");
        if (root.overrideSecondary !== "") lines.push("  --secondary: " + root.overrideSecondary + ";");
        if (root.overrideSecondaryFg !== "") lines.push("  --secondary-foreground: " + root.overrideSecondaryFg + ";");
        if (root.overrideDestructive !== "") lines.push("  --destructive: " + root.overrideDestructive + ";");
        if (root.overrideBackground !== "") lines.push("  --background: " + root.overrideBackground + ";");
        if (root.overrideCard !== "") lines.push("  --card: " + root.overrideCard + ";");
        if (root.overrideRing !== "") lines.push("  --ring: " + root.overrideRing + ";");

        var hasAny = (root.customRadius !== 8) || (root.overridePrimary !== "") || (root.overridePrimaryFg !== "") ||
                     (root.overrideSecondary !== "") || (root.overrideSecondaryFg !== "") || (root.overrideDestructive !== "") ||
                     (root.overrideBackground !== "") || (root.overrideCard !== "") || (root.overrideRing !== "");
        if (!hasAny) {
            lines.push("  /* Default Theme Tokens active */");
            lines.push("  --primary: " + (ThemeTokens.dark ? "#30a0ff" : "#1d7ae0") + ";");
            lines.push("  --primary-foreground: #ffffff;");
            lines.push("  --radius: 0.5rem;");
        }
        lines.push("}");
        return lines.join("\n");
    }

    function buildTailwindSnippet() {
        return "@import \"tailwindcss\";\n" +
               "@import \"@chahu/cha-set/styles.css\";\n\n" +
               "@theme inline {\n" +
               "  --color-primary: var(--primary);\n" +
               "  --color-primary-foreground: var(--primary-foreground);\n" +
               "  --color-secondary: var(--secondary);\n" +
               "  --color-destructive: var(--destructive);\n" +
               "  --color-background: var(--background);\n" +
               "  --color-card: var(--card);\n" +
               "  --radius-sm: calc(var(--radius) - 0.25rem);\n" +
               "  --radius-md: calc(var(--radius) - 0.125rem);\n" +
               "  --radius-lg: var(--radius);\n" +
               "}";
    }

    function buildReactSnippet() {
        return "// 1. Install component library\n" +
               "// pnpm add @chahu/cha-set\n\n" +
               "import React from 'react';\n" +
               "import { Button } from '@chahu/cha-set';\n" +
               "import '@chahu/cha-set/styles.css';\n\n" +
               "export function ActionPanel() {\n" +
               "  return (\n" +
               "    <div className=\"flex gap-3\">\n" +
               "      <Button variant=\"default\" size=\"default\">\n" +
               "        Save Changes\n" +
               "      </Button>\n" +
               "      <Button variant=\"secondary\" size=\"default\">\n" +
               "        Cancel\n" +
               "      </Button>\n" +
               "      <Button variant=\"destructive\" size=\"default\">\n" +
               "        Delete\n" +
               "      </Button>\n" +
               "    </div>\n" +
               "  );\n" +
               "}";
    }

    function buildQtSnippet() {
        var pri = root.overridePrimary !== "" ? root.overridePrimary : (ThemeTokens.dark ? "#30a0ff" : "#1d7ae0");
        return "// ChaSet Qt / QML Integration\n" +
               "// 1. Import ThemeTokens and ChaSet components\n" +
               "import QtQuick 6.10\n" +
               "import ChaSet\n\n" +
               "ApplicationWindow {\n" +
               "    visible: true\n" +
               "    width: 600\n" +
               "    height: 400\n" +
               "    color: ThemeTokens.background\n\n" +
               "    Component.onCompleted: {\n" +
               "        ThemeTokens.dark = " + (ThemeTokens.dark ? "true" : "false") + "\n" +
               "    }\n\n" +
               "    Row {\n" +
               "        spacing: 12\n" +
               "        anchors.centerIn: parent\n\n" +
               "        ChaSetButton {\n" +
               "            variant: \"default\"\n" +
               "            size: \"default\"\n" +
               "            text: \"Save Changes\"\n" +
               "            onClicked: console.log(\"Default clicked\")\n" +
               "        }\n\n" +
               "        ChaSetButton {\n" +
               "            variant: \"secondary\"\n" +
               "            size: \"default\"\n" +
               "            text: \"Cancel\"\n" +
               "        }\n" +
               "    }\n" +
               "}";
    }

    function buildJsonSnippet() {
        var ov = {};
        if (root.customRadius !== 8) ov.radius = (root.customRadius / 16.0) + "rem";
        if (root.overridePrimary !== "") ov.primary = root.overridePrimary;
        if (root.overridePrimaryFg !== "") ov.primaryForeground = root.overridePrimaryFg;
        if (root.overrideSecondary !== "") ov.secondary = root.overrideSecondary;
        if (root.overrideSecondaryFg !== "") ov.secondaryForeground = root.overrideSecondaryFg;
        if (root.overrideDestructive !== "") ov.destructive = root.overrideDestructive;
        if (root.overrideBackground !== "") ov.background = root.overrideBackground;
        if (root.overrideCard !== "") ov.card = root.overrideCard;
        if (root.overrideRing !== "") ov.ring = root.overrideRing;

        var obj = {
            theme: {
                mode: root.mode,
                accent: root.activeAccent || "default",
                overrides: ov
            }
        };
        return JSON.stringify(obj, null, 2);
    }

    function getSnippet() {
        switch (root.exportTab) {
        case "css": return root.buildCssSnippet();
        case "tailwind": return root.buildTailwindSnippet();
        case "react": return root.buildReactSnippet();
        case "qt": return root.buildQtSnippet();
        case "json": return root.buildJsonSnippet();
        default: return root.buildCssSnippet();
        }
    }

    // Tabs
    ChaSetTabs {
        width: parent.width
        currentValue: root.exportTab
        onCurrentValueChanged: root.exportTab = currentValue

        ChaSetTabsList {
            ChaSetTabsTrigger { value: "css"; text: "CSS Variables" }
            ChaSetTabsTrigger { value: "tailwind"; text: "Tailwind v4" }
            ChaSetTabsTrigger { value: "react"; text: "React Code" }
            ChaSetTabsTrigger { value: "qt"; text: "Qt / QML" }
            ChaSetTabsTrigger { value: "json"; text: "JSON Spec" }
        }
    }

    function getLanguage() {
        switch (root.exportTab) {
        case "css": return "css";
        case "tailwind": return "css";
        case "react": return "tsx";
        case "qt": return "qml";
        case "json": return "json";
        default: return "css";
        }
    }

    ChaSetCodeBlock {
        width: parent.width
        code: root.getSnippet()
        language: root.getLanguage()
        maxHeight: ThemeTokens.dp(240)
        showCopy: true
        showLanguage: true
        showLineNumbers: true
    }

    Item {
        width: parent.width
        implicitHeight: Math.max(tipText.implicitHeight, footerBtns.implicitHeight)

        Text {
            id: tipText
            anchors.left: parent.left
            anchors.right: footerBtns.left
            anchors.rightMargin: ThemeTokens.dp(12)
            anchors.verticalCenter: parent.verticalCenter
            text: "Tip: Drop this configuration directly into your project's stylesheet or theme manager."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeCaption
            elide: Text.ElideRight
        }

        Row {
            id: footerBtns
            anchors.right: parent.right
            anchors.verticalCenter: parent.verticalCenter
            spacing: ThemeTokens.dp(8)

            ChaSetButton {
                size: "sm"
                variant: "secondary"
                text: "Close"
                onClicked: { root.close(); root.closeDialog() }
            }

            ChaSetCopyButton {
                size: "sm"
                variant: "default"
                text: root.getSnippet()
                label: "Copy to Clipboard"
            }
        }
    }
}
