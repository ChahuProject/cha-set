// ChaSetThemeSettings.qml — Cross-Stack Theme Settings Component
// 100% Feature & API Parity with React ThemeSettings.tsx & spec/schemas/theme-config.schema.json
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property var config: ({
        version: 1,
        mode: "system",
        palette: { id: "neutral", customHex: "#30a0ff" },
        decoration: { styleId: "simple", level: 50, overrides: {} },
        typography: { familyId: "system", scaleId: "default" },
        uiScale: 1.0
    })

    property var textProvider: null
    property bool disabled: false
    property bool showReset: true
    property bool showExport: true
    property bool showImport: true
    property bool showTypography: false

    property bool showOverrides: false

    signal configChanged(var nextConfig)
    signal resetRequested()
    signal exportRequested(string jsonString)

    function trText(key, defaultText) {
        if (typeof textProvider === "function") {
            try {
                var res = textProvider(key, defaultText);
                if (res !== undefined && res !== null && res !== "") return res;
            } catch (e) {
                // fallback
            }
        }
        return defaultText;
    }

    readonly property var canonicalPalettes: [
        { id: "neutral", name: "Neutral", hex: "#30a0ff" },
        { id: "slate", name: "Slate", hex: "#64748b" },
        { id: "red", name: "Red", hex: "#ef4444" },
        { id: "orange", name: "Orange", hex: "#f97316" },
        { id: "yellow", name: "Yellow", hex: "#eab308" },
        { id: "green", name: "Green", hex: "#22c55e" },
        { id: "blue", name: "Blue", hex: "#3b82f6" },
        { id: "violet", name: "Violet", hex: "#8b5cf6" },
        { id: "rose", name: "Rose", hex: "#f43f5e" },
        { id: "custom", name: "Custom", hex: "#30a0ff" }
    ]

    function updateConfig(mutator) {
        if (root.disabled) return;
        var current = root.config ? JSON.parse(JSON.stringify(root.config)) : {};
        if (!current.version) current.version = 1;
        if (!current.mode) current.mode = "system";
        if (!current.palette) current.palette = { id: "neutral", customHex: "#30a0ff" };
        if (!current.decoration) current.decoration = { styleId: "simple", level: 50, overrides: {} };
        if (!current.typography) current.typography = { familyId: "system", scaleId: "default" };
        if (typeof current.uiScale !== "number") current.uiScale = 1.0;

        mutator(current);
        root.config = current;
        root.configChanged(current);
    }

    function requestReset() {
        if (root.disabled) return;
        var defaultConfig = {
            version: 1,
            mode: "system",
            palette: { id: "neutral", customHex: "#30a0ff" },
            decoration: { styleId: "simple", level: 50, overrides: {} },
            typography: { familyId: "system", scaleId: "default" },
            uiScale: 1.0
        };
        root.config = defaultConfig;
        root.resetRequested();
        root.configChanged(defaultConfig);
    }

    function exportConfig() {
        var str = JSON.stringify(root.config, null, 2);
        root.exportRequested(str);
        return str;
    }

    function importConfig(jsonString) {
        try {
            var parsed = JSON.parse(jsonString);
            if (typeof parsed !== "object" || parsed === null) return false;
            var validated = {
                version: 1,
                mode: (parsed.mode === "light" || parsed.mode === "dark" || parsed.mode === "system") ? parsed.mode : "system",
                palette: {
                    id: parsed.palette && parsed.palette.id ? parsed.palette.id : "neutral",
                    customHex: parsed.palette && parsed.palette.customHex ? parsed.palette.customHex : "#30a0ff"
                },
                decoration: {
                    styleId: parsed.decoration && (parsed.decoration.styleId === "expressive" || parsed.decoration.styleId === "simple") ? parsed.decoration.styleId : "simple",
                    level: parsed.decoration && typeof parsed.decoration.level === "number" ? Math.max(0, Math.min(100, Math.round(parsed.decoration.level))) : 50,
                    overrides: parsed.decoration && typeof parsed.decoration.overrides === "object" && parsed.decoration.overrides !== null ? parsed.decoration.overrides : {}
                },
                typography: {
                    familyId: parsed.typography && parsed.typography.familyId ? parsed.typography.familyId : "system",
                    scaleId: parsed.typography && parsed.typography.scaleId ? parsed.typography.scaleId : "default"
                },
                uiScale: typeof parsed.uiScale === "number" ? Math.max(0.75, Math.min(2.0, parsed.uiScale)) : 1.0
            };
            root.config = validated;
            root.configChanged(validated);
            return true;
        } catch (e) {
            return false;
        }
    }

    width: parent ? parent.width : implicitWidth
    implicitWidth: 460
    implicitHeight: _card.implicitHeight

    opacity: root.disabled ? 0.6 : 1.0

    Rectangle {
        id: _card
        width: parent.width
        implicitHeight: _contentCol.implicitHeight + 32
        radius: 12
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1

        Column {
            id: _contentCol
            x: 16
            y: 16
            width: parent.width - 32
            spacing: 12

            // Header Section
            Row {
                width: parent.width
                visible: root.showReset || root.showExport || root.showImport

                Row {
                    spacing: 8
                    anchors.verticalCenter: parent.verticalCenter

                    Text {
                        text: root.trText("theme.settings.title", "Theme Configuration")
                        color: ThemeTokens.text
                        font.pixelSize: Typography.sizeBody
                        font.bold: true
                        anchors.verticalCenter: parent.verticalCenter
                    }

                    ChaSetBadge {
                        text: "v" + (root.config?.version || 1)
                        variant: "secondary"
                        size: "sm"
                        anchors.verticalCenter: parent.verticalCenter
                    }
                }

                Item {
                    width: Math.max(8, parent.width - 280)
                    height: 1
                }

                Row {
                    spacing: 6
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter

                    ChaSetButton {
                        visible: root.showReset
                        size: "sm"
                        variant: "outline"
                        text: root.trText("theme.settings.reset", "Reset")
                        onClicked: root.requestReset()
                    }

                    ChaSetButton {
                        visible: root.showExport
                        size: "sm"
                        variant: "default"
                        text: root.trText("theme.settings.export", "Export JSON")
                        onClicked: root.exportConfig()
                    }
                }
            }

            ChaSetSeparator {
                visible: root.showReset || root.showExport || root.showImport
                width: parent.width
            }

            // 1. Appearance Mode
            ChaSetSettingRow {
                name: root.trText("theme.settings.mode.title", "Appearance Mode")
                description: root.trText("theme.settings.mode.desc", "Switch between Light, Dark, or System OS appearance")
                controlWidth: 260

                ChaSetSegmentedControl {
                    id: modeControl
                    size: "sm"
                    width: 250
                    value: root.config?.mode || "system"
                    options: [
                        { label: "☀️ " + root.trText("theme.mode.light", "Light"), value: "light" },
                        { label: "🌙 " + root.trText("theme.mode.dark", "Dark"), value: "dark" },
                        { label: "💻 " + root.trText("theme.mode.system", "System"), value: "system" }
                    ]
                    onValueSelected: function(val) {
                        root.updateConfig(function(cfg) { cfg.mode = val; });
                    }
                }
            }

            ChaSetSeparator { width: parent.width }

            // 2. Accent Palette
            ChaSetSettingRow {
                name: root.trText("theme.settings.palette.title", "Accent Palette")
                description: root.trText("theme.settings.palette.desc", "Choose from 10 canonical theme palettes or custom accent")
                controlWidth: 320

                Row {
                    spacing: 4
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter

                    Flow {
                        width: Math.min(270, parent.parent ? parent.parent.width : 270)
                        spacing: 4

                        Repeater {
                            model: root.canonicalPalettes
                            delegate: Rectangle {
                                required property int index
                                required property var modelData

                                readonly property bool isSelected: (root.config?.palette?.id || "neutral") === modelData.id
                                width: 22
                                height: 22
                                radius: 11
                                color: modelData.id === "custom"
                                       ? (root.config?.palette?.customHex || "#30a0ff")
                                       : modelData.hex
                                border.width: isSelected ? 2 : 1
                                border.color: isSelected ? ThemeTokens.accent : ThemeTokens.border

                                Rectangle {
                                    anchors.centerIn: parent
                                    width: 6
                                    height: 6
                                    radius: 3
                                    color: "#ffffff"
                                    visible: parent.isSelected
                                }

                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: {
                                        root.updateConfig(function(cfg) {
                                            if (!cfg.palette) cfg.palette = {};
                                            cfg.palette.id = modelData.id;
                                        });
                                    }
                                }
                            }
                        }
                    }

                    ChaSetColorPicker {
                        id: customPicker
                        visible: (root.config?.palette?.id || "neutral") === "custom"
                        size: "sm"
                        mode: "popover"
                        value: root.config?.palette?.customHex || "#30a0ff"
                        onColorChanged: function(c) {
                            root.updateConfig(function(cfg) {
                                if (!cfg.palette) cfg.palette = {};
                                cfg.palette.id = "custom";
                                cfg.palette.customHex = customPicker.hex;
                            });
                        }
                    }
                }
            }

            ChaSetSeparator { width: parent.width }

            // 3. Interface Style
            ChaSetSettingRow {
                name: root.trText("theme.settings.style.title", "Interface Style")
                description: root.trText("theme.settings.style.desc", "Simple flat presentation or expressive rich layered styling")
                controlWidth: 220

                ChaSetSegmentedControl {
                    size: "sm"
                    width: 200
                    value: root.config?.decoration?.styleId || "simple"
                    options: [
                        { label: root.trText("theme.style.simple", "Simple"), value: "simple" },
                        { label: root.trText("theme.style.expressive", "Expressive"), value: "expressive" }
                    ]
                    onValueSelected: function(val) {
                        root.updateConfig(function(cfg) {
                            if (!cfg.decoration) cfg.decoration = {};
                            cfg.decoration.styleId = val;
                        });
                    }
                }
            }

            ChaSetSeparator { width: parent.width }

            // 4. Decoration Intensity
            ChaSetSettingRow {
                name: root.trText("theme.settings.decoration.title", "Decoration Level")
                description: root.trText("theme.settings.decoration.desc", "Master slider (0-100) driving corner radii, shadows, and motion")
                badge: (root.config?.decoration?.level || 50) + "%"
                controlWidth: 260

                Row {
                    spacing: 8
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter
                    width: 250

                    ChaSetSlider {
                        width: 170
                        min: 0
                        max: 100
                        step: 1
                        value: root.config?.decoration?.level || 50
                        onValueMoved: function(val) {
                            root.updateConfig(function(cfg) {
                                if (!cfg.decoration) cfg.decoration = {};
                                cfg.decoration.level = Math.round(val);
                            });
                        }
                    }

                    ChaSetButton {
                        size: "sm"
                        variant: "ghost"
                        text: root.showOverrides
                              ? root.trText("theme.overrides.hide", "Hide")
                              : root.trText("theme.overrides.custom", "Overrides")
                        onClicked: root.showOverrides = !root.showOverrides
                    }
                }
            }

            // Overrides Sub-Panel
            Column {
                width: parent.width
                spacing: 8
                visible: root.showOverrides

                Rectangle {
                    width: parent.width
                    implicitHeight: overridesCol.implicitHeight + 16
                    radius: 8
                    color: ThemeTokens.hover

                    Column {
                        id: overridesCol
                        x: 12
                        y: 8
                        width: parent.width - 24
                        spacing: 8

                        // Radius override
                        Row {
                            width: parent.width
                            Text {
                                text: root.trText("theme.overrides.radius", "Corner Radius")
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeCaption
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            Item { width: Math.max(10, parent.width - 240); height: 1 }
                            ChaSetSlider {
                                width: 150
                                min: 0
                                max: 100
                                step: 1
                                value: root.config?.decoration?.overrides?.radius !== undefined
                                       ? root.config.decoration.overrides.radius
                                       : (root.config?.decoration?.level || 50)
                                onValueMoved: function(val) {
                                    root.updateConfig(function(cfg) {
                                        if (!cfg.decoration.overrides) cfg.decoration.overrides = {};
                                        cfg.decoration.overrides.radius = Math.round(val);
                                    });
                                }
                            }
                        }

                        // Shadow override
                        Row {
                            width: parent.width
                            Text {
                                text: root.trText("theme.overrides.shadow", "Shadow Elevation")
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeCaption
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            Item { width: Math.max(10, parent.width - 240); height: 1 }
                            ChaSetSlider {
                                width: 150
                                min: 0
                                max: 100
                                step: 1
                                value: root.config?.decoration?.overrides?.shadow !== undefined
                                       ? root.config.decoration.overrides.shadow
                                       : (root.config?.decoration?.level || 50)
                                onValueMoved: function(val) {
                                    root.updateConfig(function(cfg) {
                                        if (!cfg.decoration.overrides) cfg.decoration.overrides = {};
                                        cfg.decoration.overrides.shadow = Math.round(val);
                                    });
                                }
                            }
                        }

                        // Motion override
                        Row {
                            width: parent.width
                            Text {
                                text: root.trText("theme.overrides.motion", "Motion Duration")
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeCaption
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            Item { width: Math.max(10, parent.width - 240); height: 1 }
                            ChaSetSlider {
                                width: 150
                                min: 0
                                max: 100
                                step: 1
                                value: root.config?.decoration?.overrides?.motion !== undefined
                                       ? root.config.decoration.overrides.motion
                                       : (root.config?.decoration?.level || 50)
                                onValueMoved: function(val) {
                                    root.updateConfig(function(cfg) {
                                        if (!cfg.decoration.overrides) cfg.decoration.overrides = {};
                                        cfg.decoration.overrides.motion = Math.round(val);
                                    });
                                }
                            }
                        }
                    }
                }
            }

            ChaSetSeparator { width: parent.width }

            // 5. Interface Scale
            ChaSetSettingRow {
                name: root.trText("theme.settings.uiscale.title", "Interface Scale")
                description: root.trText("theme.settings.uiscale.desc", "Global display density and UI scaling factor")
                controlWidth: 260

                ChaSetSegmentedControl {
                    size: "sm"
                    width: 250
                    value: root.config?.uiScale || 1.0
                    options: [
                        { label: "75%", value: 0.75 },
                        { label: "90%", value: 0.9 },
                        { label: "100%", value: 1.0 },
                        { label: "125%", value: 1.25 },
                        { label: "150%", value: 1.5 }
                    ]
                    onValueSelected: function(val) {
                        root.updateConfig(function(cfg) { cfg.uiScale = Number(val); });
                    }
                }
            }
        }
    }
}
