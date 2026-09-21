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
    property string variant: "card" // "card" | "embedded"

    property bool showOverrides: false

    signal configModified(var nextConfig)
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
        return ChaSetI18n.tr(key, defaultText);
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
        root.configModified(current);
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
        root.configModified(defaultConfig);
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
    height: implicitHeight
    implicitWidth: 480
    implicitHeight: _card.implicitHeight

    opacity: root.disabled ? 0.6 : 1.0

    readonly property bool isEmbedded: root.variant === "embedded"

    Rectangle {
        id: _card
        width: parent.width
        height: implicitHeight
        implicitHeight: _contentCol.implicitHeight + (root.isEmbedded ? 0 : 32)
        radius: root.isEmbedded ? 0 : 12
        color: root.isEmbedded ? "transparent" : ThemeTokens.panel
        border.color: root.isEmbedded ? "transparent" : ThemeTokens.border
        border.width: root.isEmbedded ? 0 : 1

        Column {
            id: _contentCol
            x: root.isEmbedded ? 0 : 16
            y: root.isEmbedded ? 0 : 16
            width: root.isEmbedded ? parent.width : (parent.width - 32)
            spacing: 14

            // Header Section (Only rendered in card mode)
            Item {
                width: parent.width
                implicitHeight: 32
                visible: !root.isEmbedded && (root.showReset || root.showExport || root.showImport)

                Row {
                    anchors.left: parent.left
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: 8

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

                Row {
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: 6

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
                visible: !root.isEmbedded && (root.showReset || root.showExport || root.showImport)
                width: parent.width
            }

            // 1. Appearance Mode — Visual Mockup Cards (Zero Emojis)
            ChaSetSettingRow {
                name: root.trText("theme.settings.mode.title", "Appearance Mode")
                description: root.trText("theme.settings.mode.desc", "Switch between Light, Dark, or System OS appearance")
                controlWidth: 260

                Row {
                    spacing: 8
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter

                    Repeater {
                        model: [
                            { id: "light", label: root.trText("theme.mode.light", "Light") },
                            { id: "dark", label: root.trText("theme.mode.dark", "Dark") },
                            { id: "system", label: root.trText("theme.mode.system", "System") }
                        ]

                        delegate: Rectangle {
                            id: modeCard
                            required property int index
                            required property var modelData

                            readonly property bool isSelected: (root.config?.mode || "system") === modelData.id
                            width: 78
                            height: 68
                            radius: 8
                            color: isSelected ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.08) : ThemeTokens.panel
                            border.width: isSelected ? 2 : 1
                            border.color: isSelected ? ThemeTokens.accent : ThemeTokens.border

                            Column {
                                anchors.centerIn: parent
                                spacing: 4

                                // Mini Mockup Window Frame
                                Rectangle {
                                    width: 66
                                    height: 36
                                    radius: 4
                                    clip: true
                                    border.width: 1
                                    border.color: modelData.id === "light" ? "#e2e8f0" : (modelData.id === "dark" ? "#27272a" : "#52525b")
                                    color: modelData.id === "light" ? "#ffffff" : (modelData.id === "dark" ? "#09090b" : "#ffffff")

                                    // Light Window Mock
                                    Item {
                                        anchors.fill: parent
                                        visible: modelData.id === "light"

                                        Rectangle {
                                            id: lightTitle
                                            width: parent.width; height: 7; color: "#f4f4f5"
                                            Row {
                                                x: 3; y: 2; spacing: 2
                                                Rectangle { width: 3; height: 3; radius: 1.5; color: "#f87171" }
                                                Rectangle { width: 3; height: 3; radius: 1.5; color: "#fbbf24" }
                                                Rectangle { width: 3; height: 3; radius: 1.5; color: "#34d399" }
                                            }
                                        }
                                        Rectangle {
                                            anchors.top: lightTitle.bottom; anchors.left: parent.left; anchors.bottom: parent.bottom
                                            width: 14; color: "#f4f4f5"
                                        }
                                        Column {
                                            anchors.left: parent.left; anchors.leftMargin: 18
                                            anchors.top: lightTitle.bottom; anchors.topMargin: 4
                                            spacing: 2
                                            Rectangle { width: 38; height: 2; radius: 1; color: "#e4e4e7" }
                                            Rectangle { width: 24; height: 2; radius: 1; color: "#e4e4e7" }
                                        }
                                    }

                                    // Dark Window Mock
                                    Item {
                                        anchors.fill: parent
                                        visible: modelData.id === "dark"

                                        Rectangle {
                                            id: darkTitle
                                            width: parent.width; height: 7; color: "#18181b"
                                            Row {
                                                x: 3; y: 2; spacing: 2
                                                Rectangle { width: 3; height: 3; radius: 1.5; color: "#52525b" }
                                                Rectangle { width: 3; height: 3; radius: 1.5; color: "#52525b" }
                                                Rectangle { width: 3; height: 3; radius: 1.5; color: "#52525b" }
                                            }
                                        }
                                        Rectangle {
                                            anchors.top: darkTitle.bottom; anchors.left: parent.left; anchors.bottom: parent.bottom
                                            width: 14; color: "#18181b"
                                        }
                                        Column {
                                            anchors.left: parent.left; anchors.leftMargin: 18
                                            anchors.top: darkTitle.bottom; anchors.topMargin: 4
                                            spacing: 2
                                            Rectangle { width: 38; height: 2; radius: 1; color: "#27272a" }
                                            Rectangle { width: 24; height: 2; radius: 1; color: "#27272a" }
                                        }
                                    }

                                    // System Split Window Mock
                                    Item {
                                        anchors.fill: parent
                                        visible: modelData.id === "system"

                                        // Left half light
                                        Rectangle {
                                            anchors.left: parent.left; anchors.top: parent.top; anchors.bottom: parent.bottom
                                            width: parent.width / 2; color: "#ffffff"
                                            Rectangle { width: parent.width; height: 7; color: "#f4f4f5" }
                                            Rectangle { anchors.left: parent.left; anchors.top: parent.top; anchors.topMargin: 7; anchors.bottom: parent.bottom; width: 7; color: "#f4f4f5" }
                                        }
                                        // Right half dark
                                        Rectangle {
                                            anchors.right: parent.right; anchors.top: parent.top; anchors.bottom: parent.bottom
                                            width: parent.width / 2; color: "#09090b"
                                            Rectangle { width: parent.width; height: 7; color: "#18181b" }
                                            Rectangle { anchors.left: parent.left; anchors.top: parent.top; anchors.topMargin: 7; anchors.bottom: parent.bottom; width: 7; color: "#18181b" }
                                        }
                                    }
                                }

                                Text {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    text: modelData.label
                                    font.pixelSize: Typography.sizeCaption
                                    font.bold: modeCard.isSelected
                                    color: modeCard.isSelected ? ThemeTokens.accent : ThemeTokens.subduedText
                                }
                            }

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: {
                                    root.updateConfig(function(cfg) { cfg.mode = modelData.id; });
                                }
                            }
                        }
                    }
                }
            }

            ChaSetSeparator { width: parent.width }

            // 2. Accent Palette — Tactile Swatches with Contrast Checks
            ChaSetSettingRow {
                name: root.trText("theme.settings.palette.title", "Accent Palette")
                description: root.trText("theme.settings.palette.desc", "Choose from 10 canonical theme palettes or custom accent")
                controlWidth: 320

                Row {
                    spacing: 6
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter

                    Flow {
                        width: Math.min(270, parent.parent ? parent.parent.width : 270)
                        spacing: 6

                        Repeater {
                            model: root.canonicalPalettes
                            delegate: Rectangle {
                                id: swatchItem
                                required property int index
                                required property var modelData

                                readonly property bool isSelected: (root.config?.palette?.id || "neutral") === modelData.id
                                width: 26
                                height: 26
                                radius: 13
                                color: modelData.id === "neutral"
                                       ? "#475569"
                                       : (modelData.id === "custom"
                                          ? (root.config?.palette?.customHex || "#30a0ff")
                                          : modelData.hex)
                                border.width: isSelected ? 2 : 1
                                border.color: isSelected ? ThemeTokens.accent : Qt.rgba(0, 0, 0, 0.2)
                                scale: isSelected ? 1.1 : 1.0

                                Behavior on scale {
                                    NumberAnimation { duration: ThemeTokens.motionQuick; easing.type: Easing.OutQuad }
                                }

                                // Centered Checkmark Icon Canvas
                                Canvas {
                                    id: checkCanvas
                                    anchors.centerIn: parent
                                    width: 10
                                    height: 8
                                    visible: swatchItem.isSelected
                                    onPaint: {
                                        var ctx = getContext("2d");
                                        ctx.reset();
                                        ctx.strokeStyle = (modelData.id === "yellow") ? "#18181b" : "#ffffff";
                                        ctx.lineWidth = 2;
                                        ctx.lineCap = "round";
                                        ctx.lineJoin = "round";
                                        ctx.beginPath();
                                        ctx.moveTo(1, 4);
                                        ctx.lineTo(4, 7);
                                        ctx.lineTo(9, 1);
                                        ctx.stroke();
                                    }
                                    Connections {
                                        target: swatchItem
                                        function onIsSelectedChanged() { checkCanvas.requestPaint(); }
                                    }
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

                    // Custom Color Popover Trigger
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
                              ? root.trText("theme.overrides.hide", "Details")
                              : root.trText("theme.overrides.custom", "Tune")
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
                controlWidth: 160

                ChaSetSelect {
                    width: 140
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter
                    value: String(root.config?.uiScale || 1.0)
                    options: [
                        { label: "75%", value: "0.75" },
                        { label: "90%", value: "0.9" },
                        { label: "100%", value: "1" },
                        { label: "110%", value: "1.1" },
                        { label: "125%", value: "1.25" },
                        { label: "150%", value: "1.5" },
                        { label: "175%", value: "1.75" },
                        { label: "200%", value: "2" }
                    ]
                    onValueChanged: {
                        var num = Number(value);
                        if (!isNaN(num) && num > 0 && num !== (root.config?.uiScale || 1.0)) {
                            root.updateConfig(function(cfg) { cfg.uiScale = num; });
                        }
                    }
                }
            }
        }
    }
}
