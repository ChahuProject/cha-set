// ThemeTunerPage.qml — Live Interactive Theme Studio matching React 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Get Started"
    pageTitle: "Theme Studio"
    description: ChaSetI18n.tr("components.theme-studio.description", "Live interactive theme tuner. Fine-tune colors, radiuses, and accents with real-time feedback and one-click config export.")
    tocItems: [
        { id: "tuner", title: ChaSetI18n.tr("showcase.toc.tuner", "Theme Controls") },
        { id: "playground", title: ChaSetI18n.tr("showcase.toc.playground", "Live Sandbox") }
    ]

    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: overridePrimary !== "" ? overridePrimary : (ThemeTokens.dark ? "#30a0ff" : "#1d7ae0")
    property color cAccentBg: ThemeTokens.hover

    property string activeAccent: ""
    property string overridePrimary: ""
    property string overridePrimaryFg: ""
    property string overrideSecondary: ""
    property string overrideDestructive: ""
    property string overrideBackground: ""
    property string overrideCard: ""
    property string overrideRing: ""

    readonly property bool hasOverrides: root.activeAccent !== "" ||
                                         root.customRadius !== 8 ||
                                         root.overridePrimary !== "" ||
                                         root.overridePrimaryFg !== "" ||
                                         root.overrideSecondary !== "" ||
                                         root.overrideDestructive !== "" ||
                                         root.overrideBackground !== "" ||
                                         root.overrideCard !== "" ||
                                         root.overrideRing !== ""

    property string themeMode: "system"
    signal changeThemeMode(string mode)
    signal requestExport()
    signal logAction(string msg)

    readonly property var colorSpecs: [
        { key: "primary", label: ChaSetI18n.tr("getStarted.themeTuner.tuner.primaryAction", "Primary Action"), placeholder: "e.g. #3b82f6", fallbackLight: "#1d7ae0", fallbackDark: "#30a0ff" },
        { key: "primaryFg", label: ChaSetI18n.tr("getStarted.themeTuner.tuner.primaryText", "Primary Text"), placeholder: "#ffffff", fallbackLight: "#ffffff", fallbackDark: "#ffffff" },
        { key: "secondary", label: ChaSetI18n.tr("getStarted.themeTuner.tuner.secondaryBg", "Secondary Bg"), placeholder: "var(--secondary)", fallbackLight: "#e8ecf3", fallbackDark: "#252d3d" },
        { key: "destructive", label: ChaSetI18n.tr("getStarted.themeTuner.tuner.destructive", "Destructive"), placeholder: "var(--destructive)", fallbackLight: "#dc2626", fallbackDark: "#ef4444" },
        { key: "background", label: ChaSetI18n.tr("getStarted.themeTuner.tuner.pageBackground", "Page Background"), placeholder: "var(--background)", fallbackLight: "#f4f6fa", fallbackDark: "#0a0c14" },
        { key: "card", label: ChaSetI18n.tr("getStarted.themeTuner.tuner.cardPanel", "Card / Panel"), placeholder: "var(--card)", fallbackLight: "#ffffff", fallbackDark: "#161b26" },
        { key: "ring", label: ChaSetI18n.tr("getStarted.themeTuner.tuner.focusRing", "Focus Ring"), placeholder: "var(--ring)", fallbackLight: "#30a0ff", fallbackDark: "#30a0ff" }
    ]

    function getColorOverride(key) {
        if (key === "primary") return root.overridePrimary
        if (key === "primaryFg") return root.overridePrimaryFg
        if (key === "secondary") return root.overrideSecondary
        if (key === "destructive") return root.overrideDestructive
        if (key === "background") return root.overrideBackground
        if (key === "card") return root.overrideCard
        if (key === "ring") return root.overrideRing
        return ""
    }

    function setColorOverride(key, val) {
        if (key === "primary") root.overridePrimary = val
        else if (key === "primaryFg") root.overridePrimaryFg = val
        else if (key === "secondary") root.overrideSecondary = val
        else if (key === "destructive") root.overrideDestructive = val
        else if (key === "background") root.overrideBackground = val
        else if (key === "card") root.overrideCard = val
        else if (key === "ring") root.overrideRing = val
    }

    function resetAll() {
        root.activeAccent = ""
        root.customRadius = 8
        root.overridePrimary = ""
        root.overridePrimaryFg = ""
        root.overrideSecondary = ""
        root.overrideDestructive = ""
        root.overrideBackground = ""
        root.overrideCard = ""
        root.overrideRing = ""
        ThemeTokens.dark = false
        ThemeTokens.animSpeed = 0.2
        if (typeof win !== "undefined" && win.resetThemeConfig) {
            win.resetThemeConfig()
        }
        root.logAction("Reset theme overrides to defaults")
    }

    // Section 1: Theme Controls
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(14)

        Rectangle {
            width: parent.width
            implicitHeight: tunerCol.implicitHeight + ThemeTokens.dp(36)
            radius: root.customRadius
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1

            Column {
                id: tunerCol
                x: ThemeTokens.dp(20)
                y: ThemeTokens.dp(18)
                width: parent.width - ThemeTokens.dp(40)
                spacing: ThemeTokens.dp(18)

                // Header
                Item {
                    width: parent.width
                    implicitHeight: Math.max(headerLeft.implicitHeight, headerRight.implicitHeight)

                    Row {
                        id: headerLeft
                        anchors.left: parent.left
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: ThemeTokens.dp(8)
                        ChaSetIcon {
                            name: "palette"
                            size: ThemeTokens.dp(22)
                            color: ThemeTokens.accent
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        DocText {
                            text: ChaSetI18n.tr("getStarted.themeTuner.tuner.title", "Theme & Style Tuner")
                            textColor: ThemeTokens.text
                            font.pixelSize: Typography.sizeHeading
                            font.weight: Typography.weightBold
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    Row {
                        id: headerRight
                        anchors.right: parent.right
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: ThemeTokens.dp(8)

                        ChaSetButton {
                            visible: root.hasOverrides
                            size: "sm"
                            variant: "secondary"
                            text: ChaSetI18n.tr("common.reset", "Reset")
                            onClicked: root.resetAll()
                        }

                        ChaSetButton {
                            size: "sm"
                            variant: "default"
                            icon: "copy"
                            text: ChaSetI18n.tr("getStarted.themeTuner.tuner.copyConfig", "Copy Config")
                            onClicked: root.requestExport()
                        }
                    }
                }

                Rectangle { width: parent.width; height: 1; color: ThemeTokens.border }

                // 1. Appearance & Mode
                Column {
                    width: parent.width
                    spacing: ThemeTokens.dp(6)
                    DocText {
                        text: ChaSetI18n.tr("getStarted.themeTuner.tuner.appearance", "APPEARANCE & MODE")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeCaption
                        font.weight: Typography.weightBold
                        font.letterSpacing: 0.5
                    }
                    ChaSetSegmentedControl {
                        size: "sm"
                        value: root.themeMode
                        onValueSelected: function(val) {
                            if (val !== root.themeMode) {
                                root.changeThemeMode(String(val));
                            }
                            root.logAction("Mode: " + val);
                        }
                        options: [
                            { label: ChaSetI18n.tr("common.light", "Light"), value: "light" },
                            { label: ChaSetI18n.tr("common.dark", "Dark"), value: "dark" },
                            { label: ChaSetI18n.tr("common.system", "System"), value: "system" }
                        ]
                    }
                }

                // 2. Accent Presets (9 Presets)
                Column {
                    width: parent.width
                    spacing: ThemeTokens.dp(6)
                    DocText {
                        text: ChaSetI18n.tr("getStarted.themeTuner.tuner.accentPreset", "ACCENT THEME PRESET")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeCaption
                        font.weight: Typography.weightBold
                        font.letterSpacing: 0.5
                    }
                    Flow {
                        width: parent.width
                        spacing: ThemeTokens.dp(6)
                        Repeater {
                            model: [
                                ["Default", ""], ["Slate", "slate"], ["Red", "red"],
                                ["Orange", "orange"], ["Yellow", "yellow"], ["Green", "green"],
                                ["Blue", "blue"], ["Violet", "violet"], ["Rose", "rose"]
                            ]
                            delegate: ChaSetButton {
                                required property var modelData
                                size: "sm"
                                variant: root.activeAccent === modelData[1] ? "default" : "outline"
                                text: "● " + modelData[0]
                                onClicked: {
                                    root.activeAccent = modelData[1]
                                    root.logAction("Accent preset: " + modelData[0])
                                }
                            }
                        }
                    }
                }

                // 3. Corner Radius Slider
                Column {
                    width: parent.width
                    spacing: ThemeTokens.dp(6)

                    Item {
                        width: parent.width
                        implicitHeight: Math.max(radiusLabel.implicitHeight, radiusBadge.implicitHeight)

                        DocText {
                            id: radiusLabel
                            anchors.left: parent.left
                            anchors.verticalCenter: parent.verticalCenter
                            text: ChaSetI18n.tr("getStarted.themeTuner.tuner.cornerRadius", "CORNER RADIUS (--RADIUS)")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeCaption
                            font.weight: Typography.weightBold
                            font.letterSpacing: 0.5
                        }

                        ChaSetBadge {
                            id: radiusBadge
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                            size: "sm"
                            variant: "secondary"
                            text: root.customRadius === 8 ? ChaSetI18n.tr("getStarted.themeTuner.tuner.radiusDefault", "0.5rem (Default)") : (root.customRadius + "px")
                        }
                    }

                    ChaSetSlider {
                        width: parent.width
                        min: 0
                        max: 24
                        step: 2
                        value: root.customRadius
                        onValueMoved: function(val) {
                            root.customRadius = Math.round(val)
                        }
                    }

                    Item {
                        width: parent.width
                        implicitHeight: ThemeTokens.dp(16)

                        DocText {
                            anchors.left: parent.left
                            anchors.verticalCenter: parent.verticalCenter
                            text: ChaSetI18n.tr("getStarted.themeTuner.tuner.radiusSharp", "0px (Sharp)")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeMicro
                        }
                        DocText {
                            anchors.horizontalCenter: parent.left
                            anchors.horizontalCenterOffset: parent.width * (8.0 / 24.0)
                            anchors.verticalCenter: parent.verticalCenter
                            text: "8px"
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeMicro
                        }
                        DocText {
                            anchors.horizontalCenter: parent.left
                            anchors.horizontalCenterOffset: parent.width * (16.0 / 24.0)
                            anchors.verticalCenter: parent.verticalCenter
                            text: "16px"
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeMicro
                        }
                        DocText {
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                            text: ChaSetI18n.tr("getStarted.themeTuner.tuner.radiusPill", "24px (Pill)")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeMicro
                        }
                    }
                }

                Rectangle { width: parent.width; height: 1; color: ThemeTokens.border }

                // 4. Live Color Overrides (Matching React 1:1)
                Column {
                    width: parent.width
                    spacing: ThemeTokens.dp(10)

                    DocText {
                        text: ChaSetI18n.tr("getStarted.themeTuner.tuner.liveColorOverrides", "LIVE COLOR OVERRIDES")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeCaption
                        font.weight: Typography.weightBold
                        font.letterSpacing: 0.5
                    }

                    Flow {
                        id: colorFlow
                        width: parent.width
                        spacing: ThemeTokens.dp(12)

                        Repeater {
                            model: root.colorSpecs

                            delegate: Column {
                                id: colorCol
                                required property var modelData
                                width: (colorFlow && colorFlow.width > ThemeTokens.dp(560)) ? Math.floor((colorFlow.width - ThemeTokens.dp(12)) / 2) : (colorFlow ? colorFlow.width : ThemeTokens.dp(280))
                                spacing: ThemeTokens.dp(4)

                                readonly property string currentVal: root.getColorOverride(colorCol.modelData.key)
                                readonly property string fallbackVal: ThemeTokens.dark ? colorCol.modelData.fallbackDark : colorCol.modelData.fallbackLight

                                DocText {
                                    text: colorCol.modelData.label
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeCaption
                                    font.weight: Typography.weightMedium
                                }

                                Row {
                                    width: parent.width
                                    spacing: ThemeTokens.dp(8)

                                    ChaSetColorPicker {
                                        id: cp
                                        mode: "popover"
                                        size: "sm"
                                        value: colorCol.currentVal !== "" ? colorCol.currentVal : colorCol.fallbackVal
                                        onHexChanged: {
                                            if (cp.hex !== colorCol.currentVal) {
                                                root.setColorOverride(colorCol.modelData.key, cp.hex)
                                                root.logAction("Override " + colorCol.modelData.label + ": " + cp.hex)
                                            }
                                        }
                                    }

                                    ChaSetInput {
                                        width: Math.max(ThemeTokens.dp(100), colorCol.width - cp.width - ThemeTokens.dp(8))
                                        height: ThemeTokens.dp(32)
                                        placeholder: colorCol.modelData.placeholder
                                        text: colorCol.currentVal
                                        onTextEdited: {
                                            root.setColorOverride(colorCol.modelData.key, text)
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                Rectangle { width: parent.width; height: 1; color: ThemeTokens.border }

                // 5. Motion & Animations
                Column {
                    width: parent.width
                    spacing: ThemeTokens.dp(12)

                    Item {
                        width: parent.width
                        implicitHeight: Math.max(motionTitle.implicitHeight, motionSwitch.implicitHeight)

                        DocText {
                            id: motionTitle
                            anchors.left: parent.left
                            anchors.verticalCenter: parent.verticalCenter
                            text: ChaSetI18n.tr("getStarted.themeTuner.tuner.motionTitle", "MOTION & ANIMATIONS")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeCaption
                            font.weight: Typography.weightBold
                            font.letterSpacing: 0.5
                        }

                        ChaSetSwitch {
                            id: motionSwitch
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                            checked: ThemeTokens.animationsEnabled
                            onToggled: function(val) {
                                ThemeTokens.animationsEnabled = val
                                root.logAction("Animations: " + (val ? "ON" : "OFF"))
                            }
                        }
                    }

                    Column {
                        width: parent.width
                        spacing: ThemeTokens.dp(6)
                        opacity: ThemeTokens.animationsEnabled ? 1.0 : 0.4
                        enabled: ThemeTokens.animationsEnabled

                        Item {
                            width: parent.width
                            implicitHeight: Math.max(speedLabel.implicitHeight, speedBadge.implicitHeight)

                            DocText {
                                id: speedLabel
                                anchors.left: parent.left
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("getStarted.themeTuner.tuner.animSpeedFactor", "ANIMATION SPEED DURATION FACTOR")
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeCaption
                                font.weight: Typography.weightBold
                                font.letterSpacing: 0.5
                            }

                            ChaSetBadge {
                                id: speedBadge
                                anchors.right: parent.right
                                anchors.verticalCenter: parent.verticalCenter
                                size: "sm"
                                variant: "secondary"
                                text: (Math.round(ThemeTokens.animSpeed * 1000)) + "ms (" + (Math.round(0.2 / ThemeTokens.animSpeed * 10) / 10) + "x)"
                            }
                        }

                        ChaSetSlider {
                            width: parent.width
                            min: 0.05
                            max: 0.8
                            step: 0.05
                            value: ThemeTokens.animSpeed
                            onValueMoved: function(val) {
                                ThemeTokens.animSpeed = Math.round(val * 100) / 100
                            }
                        }

                        Item {
                            width: parent.width
                            implicitHeight: ThemeTokens.dp(16)

                            DocText {
                                anchors.left: parent.left
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("getStarted.themeTuner.tuner.speedFast", "0.05s (Fast)")
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeMicro
                            }
                            DocText {
                                anchors.horizontalCenter: parent.left
                                anchors.horizontalCenterOffset: parent.width * ((0.20 - 0.05) / (0.80 - 0.05))
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("getStarted.themeTuner.tuner.speedDefault", "0.20s (Default)")
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeMicro
                            }
                            DocText {
                                anchors.right: parent.right
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("getStarted.themeTuner.tuner.speedSlow", "0.80s (Slow)")
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeMicro
                            }
                        }
                    }
                }
            }
        }
    }

    // Section 2: Live Sandbox Stage
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(12)

        Column {
            spacing: ThemeTokens.dp(4)
            DocText {
                text: ChaSetI18n.tr("getStarted.themeTuner.playground.titleQml", "Live Component Sandbox")
                color: ThemeTokens.text
                font.pixelSize: Typography.sizeTitleSm
                font.weight: Typography.weightBold
            }
            DocText {
                text: ChaSetI18n.tr("getStarted.themeTuner.playground.descQml", "Interact with components rendering live under your current style settings:")
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeBody
            }
        }

        Rectangle {
            width: parent.width
            implicitHeight: sandboxFlow.implicitHeight + ThemeTokens.dp(36)
            radius: root.customRadius
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1

            Flow {
                id: sandboxFlow
                x: ThemeTokens.dp(20)
                y: ThemeTokens.dp(18)
                width: parent.width - ThemeTokens.dp(40)
                spacing: ThemeTokens.dp(24)

                // Buttons Column
                Column {
                    width: Math.min(sandboxFlow.width, ThemeTokens.dp(520))
                    spacing: ThemeTokens.dp(12)
                    DocText {
                        text: ChaSetI18n.tr("getStarted.themeTuner.playground.buttons", "BUTTONS")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeCaption
                        font.weight: Typography.weightBold
                        font.letterSpacing: 0.5
                    }
                    Flow {
                        width: parent.width
                        spacing: ThemeTokens.dp(8)
                        ChaSetButton { variant: "default"; size: "default"; text: ChaSetI18n.tr("getStarted.themeTuner.playground.defaultActionLabel", "Default Action"); onClicked: root.logAction("Clicked sandbox default") }
                        ChaSetButton { variant: "outline"; size: "default"; text: ChaSetI18n.tr("getStarted.themeTuner.playground.outline", "Outline"); onClicked: root.logAction("Clicked sandbox outline") }
                        ChaSetButton { variant: "secondary"; size: "default"; text: ChaSetI18n.tr("getStarted.themeTuner.playground.secondary", "Secondary"); onClicked: root.logAction("Clicked sandbox secondary") }
                        ChaSetButton { variant: "destructive"; size: "default"; text: ChaSetI18n.tr("getStarted.themeTuner.playground.danger", "Danger"); onClicked: root.logAction("Clicked sandbox danger") }
                    }
                    Flow {
                        width: parent.width
                        spacing: ThemeTokens.dp(8)
                        ChaSetButton { variant: "ghost"; size: "sm"; text: ChaSetI18n.tr("getStarted.themeTuner.playground.ghostAction", "Ghost Action") }
                        ChaSetButton { variant: "link"; size: "sm"; text: ChaSetI18n.tr("getStarted.themeTuner.playground.linkAction", "Link Action") }
                        ChaSetButton { variant: "default"; size: "sm"; text: ChaSetI18n.tr("getStarted.themeTuner.playground.saving", "Saving..."); loading: true }
                        ChaSetButton { variant: "secondary"; size: "sm"; text: ChaSetI18n.tr("getStarted.themeTuner.playground.disabled", "Disabled"); disabled: true }
                    }
                }

                // Mini Scroll Viewport Column
                Column {
                    width: ThemeTokens.dp(240)
                    spacing: ThemeTokens.dp(12)
                    DocText {
                        text: ChaSetI18n.tr("getStarted.themeTuner.playground.miniScrollViewport", "MINI SCROLL VIEWPORT")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeCaption
                        font.weight: Typography.weightBold
                        font.letterSpacing: 0.5
                    }
                    ChaSetScrollArea {
                        width: ThemeTokens.dp(240)
                        height: ThemeTokens.dp(100)
                        showButtons: true
                        contentWidth: ThemeTokens.dp(220)
                        contentHeight: ThemeTokens.dp(280)
                        clip: true

                        Column {
                            spacing: ThemeTokens.dp(4)
                            Repeater {
                                model: 10
                                delegate: Rectangle {
                                    required property int index
                                    width: ThemeTokens.dp(220)
                                    height: ThemeTokens.dp(24)
                                    radius: ThemeTokens.dp(4)
                                    color: ThemeTokens.hover
                                    DocText {
                                        anchors.centerIn: parent
                                        text: ChaSetI18n.tr("getStarted.themeTuner.playground.viewportItem", "Item #{{index}}", { index: index + 1 })
                                        color: ThemeTokens.text
                                        font.pixelSize: Typography.sizeCaption
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
