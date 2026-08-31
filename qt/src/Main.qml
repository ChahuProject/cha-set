import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

// ChaSet Qt Studio — Cross-Stack Theme & Component Workbench
// 100% Pixel-Perfect and Behavioral Parity with React Studio (packages/react/examples/basic).
ApplicationWindow {
    id: win
    width: (typeof harnessMode !== "undefined" && harnessMode === "button") ? 220 : 1100
    height: (typeof harnessMode !== "undefined" && harnessMode === "button") ? 80 : 1200
    visible: true
    title: "ChaSet Studio"
    color: ThemeTokens.dark ? "#020817" : "#ffffff"

    // ---- Reactive Theme State ----
    property bool showTuner: true
    property string activeAccent: ""
    property int customRadius: 8
    property string playgroundVariant: "primary"
    property string playgroundSize: "md"
    property string playgroundLabel: "Create Project"
    property bool playgroundLoading: false
    property bool playgroundDisabled: false
    property bool playgroundFullWidth: false
    property bool playgroundPolymorphic: false
    property int playgroundClicks: 0
    property bool exportModalOpen: false
    property string exportTab: "qt"
    property string activeNavSection: "playground"

    // Scroll Area Demo State
    property string scrollDemoMode: "vertical"
    property bool scrollShowButtons: true
    property bool scrollSmooth: true
    property int scrollHitSize: 8

    // Custom Color Overrides (Live)
    property string overridePrimary: ""
    property string overridePrimaryFg: ""
    property string overrideSecondary: ""
    property string overrideDestructive: ""
    property string overrideBackground: ""
    property string overrideCard: ""
    property string overrideRing: ""

    // Click event log
    property var clickLogs: []

    function pushLog(msg) {
        let logs = clickLogs.slice(0, 4)
        logs.unshift(msg)
        clickLogs = logs
    }

    function clearLogs() {
        clickLogs = []
    }

    // Dynamic Colors based on theme and mode
    readonly property color cBg: ThemeTokens.dark ? (overrideBackground !== "" ? overrideBackground : "#020817") : (overrideBackground !== "" ? overrideBackground : "#ffffff")
    readonly property color cCard: ThemeTokens.dark ? (overrideCard !== "" ? overrideCard : "#0f172a") : (overrideCard !== "" ? overrideCard : "#ffffff")
    readonly property color cBorder: ThemeTokens.dark ? "#1e293b" : "#e2e8f0"
    readonly property color cFg: ThemeTokens.dark ? "#f8fafc" : "#020817"
    readonly property color cMutedFg: ThemeTokens.dark ? "#94a3b8" : "#64748b"
    readonly property color cAccentBg: ThemeTokens.dark ? "#1e293b" : "#f1f5f9"
    readonly property color cPrimary: overridePrimary !== "" ? overridePrimary : (ThemeTokens.dark ? "#30a0ff" : "#1d7ae0")
    readonly property color cPrimaryFg: overridePrimaryFg !== "" ? overridePrimaryFg : "#ffffff"
    readonly property color cDestructive: overrideDestructive !== "" ? overrideDestructive : "#ef4444"
    readonly property color cRing: overrideRing !== "" ? overrideRing : cPrimary

    Component.onCompleted: {
        if (startupLight === true) ThemeTokens.dark = false
        else ThemeTokens.dark = false
    }

    Timer {
        id: shotTimer
        interval: (typeof harnessMode !== "undefined" && harnessMode !== "") ? 200 : 800
        running: typeof shotPath !== "undefined" && shotPath !== ""
        onTriggered: {
            rootCanvas.grabToImage(function(result) {
                result.saveToFile(shotPath);
                Qt.quit();
            });
        }
    }

    Rectangle {
        id: rootCanvas
        objectName: "rootCanvas"
        width: win.width
        height: win.height
        color: win.cBg

        // Isolated Component Harness Container (for visual unit tests)
        Rectangle {
            id: harnessContainer
            visible: typeof harnessMode !== "undefined" && harnessMode === "button"
            anchors.fill: parent
            color: "#ffffff"
            ChaSetButton {
                anchors.centerIn: parent
                variant: typeof harnessVariant !== "undefined" ? harnessVariant : "primary"
                size: typeof harnessSize !== "undefined" ? harnessSize : "md"
                text: typeof harnessLabel !== "undefined" ? harnessLabel : "Create Project"
                loading: typeof harnessLoading !== "undefined" ? harnessLoading : false
                disabled: typeof harnessDisabled !== "undefined" ? harnessDisabled : false
            }
        }

        Item {
            id: studioContainer
            visible: typeof harnessMode === "undefined" || harnessMode === ""
            anchors.fill: parent

        // ==============================================================
        // 1. TOP NAVBAR (Sticky, 60px height, 1px border bottom)
        // ==============================================================
        Rectangle {
            id: topbar
            width: parent.width
            height: 60
            z: 50
            color: win.cBg
            border.color: win.cBorder
            border.width: 1

            Row {
                anchors.left: parent.left
                anchors.leftMargin: 24
                anchors.verticalCenter: parent.verticalCenter
                spacing: 12

                Text {
                    text: "🍵"
                    font.pixelSize: 24
                    anchors.verticalCenter: parent.verticalCenter
                }

                Column {
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: 2
                    Text {
                        text: "ChaSet Studio"
                        color: win.cFg
                        font.pixelSize: 18
                        font.weight: Font.Bold
                        font.family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    }
                    Text {
                        text: "Theme Tuner & Component Showcase"
                        color: win.cMutedFg
                        font.pixelSize: 12
                        font.family: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    }
                }
            }

            Row {
                anchors.right: parent.right
                anchors.rightMargin: 24
                anchors.verticalCenter: parent.verticalCenter
                spacing: 8

                // Style Tuner Button
                Rectangle {
                    width: 106
                    height: 32
                    radius: win.customRadius
                    color: win.showTuner ? Qt.rgba(win.cPrimary.r, win.cPrimary.g, win.cPrimary.b, 0.12) : win.cCard
                    border.color: win.showTuner ? win.cPrimary : win.cBorder
                    border.width: 1

                    Row {
                        anchors.centerIn: parent
                        spacing: 5
                        Text { text: "🎨"; font.pixelSize: 12 }
                        Text {
                            text: "Style Tuner"
                            color: win.showTuner ? win.cFg : win.cMutedFg
                            font.pixelSize: 12
                            font.weight: Font.Medium
                        }
                    }
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: win.showTuner = !win.showTuner
                    }
                }

                // Dark/Light Mode Toggle Button
                Rectangle {
                    width: 86
                    height: 32
                    radius: win.customRadius
                    color: win.cCard
                    border.color: win.cBorder
                    border.width: 1

                    Text {
                        anchors.centerIn: parent
                        text: ThemeTokens.dark ? "🌙 Dark" : "☀️ Light"
                        color: win.cFg
                        font.pixelSize: 12
                        font.weight: Font.Medium
                    }
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: ThemeTokens.dark = !ThemeTokens.dark
                    }
                }

                // Export Button
                Rectangle {
                    width: 168
                    height: 32
                    radius: win.customRadius
                    color: win.cPrimary
                    border.color: win.cPrimary
                    border.width: 1

                    Row {
                        anchors.centerIn: parent
                        spacing: 6
                        Text { text: "📋"; font.pixelSize: 12 }
                        Text {
                            text: "Export & Copy Config"
                            color: win.cPrimaryFg
                            font.pixelSize: 12
                            font.weight: Font.DemiBold
                        }
                    }
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: win.exportModalOpen = true
                    }
                }
            }
        }

        // ==============================================================
        // 2. MAIN BODY (Sidebar + Scrollable Content)
        // ==============================================================
        Item {
            anchors.top: topbar.bottom
            anchors.bottom: parent.bottom
            anchors.left: parent.left
            anchors.right: parent.right

            // Left Navigation Sidebar (200px width)
            Item {
                id: sidebar
                width: 200
                anchors.left: parent.left
                anchors.leftMargin: 24
                anchors.top: parent.top
                anchors.topMargin: 24
                anchors.bottom: parent.bottom

                Column {
                    width: parent.width
                    spacing: 4

                    Text {
                        text: "NAVIGATION"
                        color: win.cMutedFg
                        font.pixelSize: 11
                        font.weight: Font.Bold
                        font.family: "Segoe UI, sans-serif"
                    }

                    Item { width: 1; height: 6 }

                    Repeater {
                        model: [
                            ["Interactive Sandbox", "playground", 0],
                            ["Button Matrix", "button", 400],
                            ["Scroll Area (New)", "scrollarea", 950],
                            ["Palette & Tokens", "colors", 1750],
                            ["Typography & Radius", "type", 2250]
                        ]
                        delegate: Rectangle {
                            required property var modelData
                            width: parent.width
                            height: 32
                            radius: win.customRadius > 6 ? 6 : win.customRadius
                            color: win.activeNavSection === modelData[1] ? win.cAccentBg : "transparent"

                            Text {
                                anchors.left: parent.left
                                anchors.leftMargin: 10
                                anchors.verticalCenter: parent.verticalCenter
                                text: parent.modelData[0]
                                color: win.activeNavSection === parent.modelData[1] ? win.cFg : win.cMutedFg
                                font.pixelSize: 13
                                font.weight: win.activeNavSection === parent.modelData[1] ? Font.DemiBold : Font.Normal
                            }

                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: {
                                    win.activeNavSection = parent.modelData[1]
                                    contentScroll.contentY = parent.modelData[2]
                                }
                            }
                        }
                    }
                }
            }

            // Main Scrollable Content Area (max-width: 820px)
            ChaSetScrollView {
                id: contentScroll
                anchors.left: sidebar.right
                anchors.leftMargin: 32
                anchors.right: parent.right
                anchors.rightMargin: 24
                anchors.top: parent.top
                anchors.bottom: parent.bottom
                contentWidth: contentCol.width
                contentHeight: contentCol.height + 60
                clip: true

                Column {
                    id: contentCol
                    y: 24
                    width: Math.min(contentScroll.width - 24, 820)
                    spacing: 24

                    // ==============================================================
                    // SECTION: 🎨 THEME & STYLE TUNER (Card)
                    // ==============================================================
                    Rectangle {
                        visible: win.showTuner
                        width: parent.width
                        height: tunerInnerCol.implicitHeight + 36
                        radius: win.customRadius
                        color: ThemeTokens.dark ? Qt.rgba(win.cCard.r, win.cCard.g, win.cCard.b, 0.95) : Qt.rgba(win.cPrimary.r, win.cPrimary.g, win.cPrimary.b, 0.04)
                        border.color: win.cPrimary
                        border.width: 1

                        Column {
                            id: tunerInnerCol
                            x: 20
                            y: 18
                            width: parent.width - 40
                            spacing: 16

                            // Tuner Header
                            Row {
                                width: parent.width
                                Text {
                                    text: "🎨 Theme & Style Tuner"
                                    color: win.cFg
                                    font.pixelSize: 15
                                    font.weight: Font.Bold
                                }
                                Item { width: parent.width - 340; height: 1 }
                                Row {
                                    spacing: 8
                                    Rectangle {
                                        width: 90
                                        height: 26
                                        radius: 4
                                        color: win.cCard
                                        border.color: win.cBorder
                                        Text { anchors.centerIn: parent; text: "📋 Copy Config"; color: win.cFg; font.pixelSize: 11 }
                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: win.exportModalOpen = true
                                        }
                                    }
                                }
                            }

                            Rectangle { width: parent.width; height: 1; color: win.cBorder }

                            // 1. Appearance & Mode
                            Column {
                                spacing: 6
                                Text { text: "APPEARANCE & MODE"; color: win.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold }
                                Row {
                                    spacing: 4
                                    Rectangle {
                                        width: 140
                                        height: 32
                                        radius: 6
                                        color: win.cAccentBg
                                        Row {
                                            anchors.centerIn: parent
                                            spacing: 4
                                            Rectangle {
                                                width: 66
                                                height: 26
                                                radius: 4
                                                color: !ThemeTokens.dark ? win.cCard : "transparent"
                                                Text { anchors.centerIn: parent; text: "☀️ Light"; color: win.cFg; font.pixelSize: 12 }
                                                MouseArea { anchors.fill: parent; onClicked: ThemeTokens.dark = false }
                                            }
                                            Rectangle {
                                                width: 66
                                                height: 26
                                                radius: 4
                                                color: ThemeTokens.dark ? win.cCard : "transparent"
                                                Text { anchors.centerIn: parent; text: "🌙 Dark"; color: win.cFg; font.pixelSize: 12 }
                                                MouseArea { anchors.fill: parent; onClicked: ThemeTokens.dark = true }
                                            }
                                        }
                                    }
                                }
                            }

                            // 2. Accent Theme Preset (9 Presets)
                            Column {
                                spacing: 6
                                Text { text: "ACCENT THEME PRESET"; color: win.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold }
                                Flow {
                                    width: parent.width
                                    spacing: 6
                                    Repeater {
                                        model: [
                                            ["Default", "#30a0ff"],
                                            ["Slate", "#64748b"],
                                            ["Red", "#ef4444"],
                                            ["Orange", "#f97316"],
                                            ["Yellow", "#eab308"],
                                            ["Green", "#22c55e"],
                                            ["Blue", "#3b82f6"],
                                            ["Violet", "#8b5cf6"],
                                            ["Rose", "#f43f5e"]
                                        ]
                                        delegate: Rectangle {
                                            required property var modelData
                                            width: chipRow.implicitWidth + 18
                                            height: 26
                                            radius: 13
                                            color: win.activeAccent === modelData[0] ? Qt.rgba(win.cPrimary.r, win.cPrimary.g, win.cPrimary.b, 0.15) : win.cCard
                                            border.color: win.activeAccent === modelData[0] ? win.cPrimary : win.cBorder
                                            border.width: win.activeAccent === modelData[0] ? 1.5 : 1

                                            Row {
                                                id: chipRow
                                                anchors.centerIn: parent
                                                spacing: 5
                                                Rectangle {
                                                    width: 8
                                                    height: 8
                                                    radius: 4
                                                    color: parent.parent.modelData[1]
                                                    anchors.verticalCenter: parent.verticalCenter
                                                }
                                                Text {
                                                    text: parent.parent.modelData[0]
                                                    color: win.cFg
                                                    font.pixelSize: 11
                                                    font.weight: Font.Medium
                                                    anchors.verticalCenter: parent.verticalCenter
                                                }
                                            }

                                            MouseArea {
                                                anchors.fill: parent
                                                cursorShape: Qt.PointingHandCursor
                                                onClicked: {
                                                    win.activeAccent = parent.modelData[0]
                                                    win.overridePrimary = parent.modelData[1]
                                                    win.pushLog("Accent preset: " + parent.modelData[0])
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            // 3. Corner Radius Slider
                            Column {
                                width: parent.width
                                spacing: 6
                                Row {
                                    width: parent.width
                                    Text { text: "CORNER RADIUS (--RADIUS)"; color: win.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold }
                                    Item { width: parent.width - 290; height: 1 }
                                    Text {
                                        text: win.customRadius === 8 ? "0.5rem (Default)" : (win.customRadius + "px")
                                        color: win.cMutedFg
                                        font.pixelSize: 11
                                        font.family: "Consolas, monospace"
                                    }
                                }

                                // Slider Bar
                                Rectangle {
                                    width: parent.width
                                    height: 8
                                    radius: 4
                                    color: win.cAccentBg
                                    border.color: win.cBorder

                                    Rectangle {
                                        width: (win.customRadius / 24) * parent.width
                                        height: parent.height
                                        radius: 4
                                        color: win.cPrimary
                                    }

                                    // Slider Handle
                                    Rectangle {
                                        x: (win.customRadius / 24) * (parent.width - 16)
                                        anchors.verticalCenter: parent.verticalCenter
                                        width: 16
                                        height: 16
                                        radius: 8
                                        color: win.cPrimary
                                        border.color: "#ffffff"
                                        border.width: 2
                                    }

                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onPositionChanged: (mouse) => {
                                            if (pressed) {
                                                let frac = Math.max(0, Math.min(1, mouse.x / width))
                                                win.customRadius = Math.round(frac * 24)
                                            }
                                        }
                                        onClicked: (mouse) => {
                                            let frac = Math.max(0, Math.min(1, mouse.x / width))
                                            win.customRadius = Math.round(frac * 24)
                                        }
                                    }
                                }

                                // Slider Ticks
                                Row {
                                    width: parent.width
                                    Text { text: "0px (Sharp)"; color: win.cMutedFg; font.pixelSize: 10 }
                                    Item { width: parent.width * 0.28; height: 1 }
                                    Text { text: "8px"; color: win.cMutedFg; font.pixelSize: 10 }
                                    Item { width: parent.width * 0.28; height: 1 }
                                    Text { text: "16px"; color: win.cMutedFg; font.pixelSize: 10 }
                                    Item { width: parent.width * 0.22; height: 1 }
                                    Text { text: "24px (Pill)"; color: win.cMutedFg; font.pixelSize: 10 }
                                }
                            }

                            // 4. Live Color Overrides (Grid of 7 items)
                            Column {
                                width: parent.width
                                spacing: 8
                                Text { text: "LIVE COLOR OVERRIDES"; color: win.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold }

                                Grid {
                                    columns: 3
                                    columnSpacing: 14
                                    rowSpacing: 8
                                    width: parent.width

                                    // Item 1: Primary Action
                                    Column {
                                        spacing: 3
                                        Text { text: "Primary Action"; color: win.cMutedFg; font.pixelSize: 11 }
                                        Row {
                                            spacing: 6
                                            Rectangle { width: 28; height: 28; radius: 4; color: win.cPrimary; border.color: win.cBorder }
                                            Rectangle {
                                                width: 180; height: 28; radius: 4; color: win.cBg; border.color: win.cBorder
                                                TextInput { anchors.fill: parent; anchors.margins: 5; text: win.overridePrimary !== "" ? win.overridePrimary : (ThemeTokens.dark ? "#30a0ff" : "#1d7ae0"); color: win.cFg; font.pixelSize: 11; onTextEdited: win.overridePrimary = text }
                                            }
                                        }
                                    }

                                    // Item 2: Primary Text
                                    Column {
                                        spacing: 3
                                        Text { text: "Primary Text"; color: win.cMutedFg; font.pixelSize: 11 }
                                        Row {
                                            spacing: 6
                                            Rectangle { width: 28; height: 28; radius: 4; color: win.cPrimaryFg; border.color: win.cBorder }
                                            Rectangle {
                                                width: 180; height: 28; radius: 4; color: win.cBg; border.color: win.cBorder
                                                TextInput { anchors.fill: parent; anchors.margins: 5; text: win.overridePrimaryFg !== "" ? win.overridePrimaryFg : "#ffffff"; color: win.cFg; font.pixelSize: 11; onTextEdited: win.overridePrimaryFg = text }
                                            }
                                        }
                                    }

                                    // Item 3: Secondary Bg
                                    Column {
                                        spacing: 3
                                        Text { text: "Secondary Bg"; color: win.cMutedFg; font.pixelSize: 11 }
                                        Row {
                                            spacing: 6
                                            Rectangle { width: 28; height: 28; radius: 4; color: win.cAccentBg; border.color: win.cBorder }
                                            Rectangle {
                                                width: 180; height: 28; radius: 4; color: win.cBg; border.color: win.cBorder
                                                TextInput { anchors.fill: parent; anchors.margins: 5; text: win.overrideSecondary !== "" ? win.overrideSecondary : "var(--secondary)"; color: win.cFg; font.pixelSize: 11; onTextEdited: win.overrideSecondary = text }
                                            }
                                        }
                                    }

                                    // Item 4: Destructive
                                    Column {
                                        spacing: 3
                                        Text { text: "Destructive"; color: win.cMutedFg; font.pixelSize: 11 }
                                        Row {
                                            spacing: 6
                                            Rectangle { width: 28; height: 28; radius: 4; color: win.cDestructive; border.color: win.cBorder }
                                            Rectangle {
                                                width: 180; height: 28; radius: 4; color: win.cBg; border.color: win.cBorder
                                                TextInput { anchors.fill: parent; anchors.margins: 5; text: win.overrideDestructive !== "" ? win.overrideDestructive : "var(--destructive)"; color: win.cFg; font.pixelSize: 11; onTextEdited: win.overrideDestructive = text }
                                            }
                                        }
                                    }

                                    // Item 5: Page Background
                                    Column {
                                        spacing: 3
                                        Text { text: "Page Background"; color: win.cMutedFg; font.pixelSize: 11 }
                                        Row {
                                            spacing: 6
                                            Rectangle { width: 28; height: 28; radius: 4; color: win.cBg; border.color: win.cBorder }
                                            Rectangle {
                                                width: 180; height: 28; radius: 4; color: win.cBg; border.color: win.cBorder
                                                TextInput { anchors.fill: parent; anchors.margins: 5; text: win.overrideBackground !== "" ? win.overrideBackground : "var(--background)"; color: win.cFg; font.pixelSize: 11; onTextEdited: win.overrideBackground = text }
                                            }
                                        }
                                    }

                                    // Item 6: Card / Panel
                                    Column {
                                        spacing: 3
                                        Text { text: "Card / Panel"; color: win.cMutedFg; font.pixelSize: 11 }
                                        Row {
                                            spacing: 6
                                            Rectangle { width: 28; height: 28; radius: 4; color: win.cCard; border.color: win.cBorder }
                                            Rectangle {
                                                width: 180; height: 28; radius: 4; color: win.cBg; border.color: win.cBorder
                                                TextInput { anchors.fill: parent; anchors.margins: 5; text: win.overrideCard !== "" ? win.overrideCard : "var(--card)"; color: win.cFg; font.pixelSize: 11; onTextEdited: win.overrideCard = text }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // ==============================================================
                    // SECTION 1: INTERACTIVE COMPONENT SANDBOX (2-Column Card)
                    // ==============================================================
                    Rectangle {
                        width: parent.width
                        height: sandboxCol.implicitHeight + 48
                        radius: win.customRadius
                        color: win.cCard
                        border.color: win.cBorder
                        border.width: 1

                        Column {
                            id: sandboxCol
                            x: 24
                            y: 20
                            width: parent.width - 48
                            spacing: 16

                            // Card Header
                            Column {
                                spacing: 4
                                Text { text: "Interactive Component Sandbox"; color: win.cFg; font.pixelSize: 17; font.weight: Font.DemiBold }
                                Text { text: "Adjust props live, interact with the component, and copy ready-to-use code directly into your app."; color: win.cMutedFg; font.pixelSize: 13 }
                            }

                            // 2-Column Layout
                            Row {
                                width: parent.width
                                spacing: 24

                                // Left Column: Controls (320px width)
                                Column {
                                    width: 320
                                    spacing: 14

                                    // Variant
                                    Column {
                                        spacing: 6
                                        Text { text: "Variant"; color: win.cMutedFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                                        Row {
                                            spacing: 6
                                            Repeater {
                                                model: ["primary", "secondary", "ghost", "destructive"]
                                                delegate: Rectangle {
                                                    required property string modelData
                                                    width: 72
                                                    height: 28
                                                    radius: win.customRadius > 6 ? 6 : win.customRadius
                                                    color: win.playgroundVariant === modelData ? win.cPrimary : win.cCard
                                                    border.color: win.playgroundVariant === modelData ? win.cPrimary : win.cBorder

                                                    Text {
                                                        anchors.centerIn: parent
                                                        text: parent.modelData
                                                        color: win.playgroundVariant === parent.modelData ? win.cPrimaryFg : win.cFg
                                                        font.pixelSize: 12
                                                        font.weight: Font.Medium
                                                    }
                                                    MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: win.playgroundVariant = parent.modelData }
                                                }
                                            }
                                        }
                                    }

                                    // Size
                                    Column {
                                        spacing: 6
                                        Text { text: "Size"; color: win.cMutedFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                                        Row {
                                            spacing: 6
                                            Repeater {
                                                model: ["sm", "md", "lg"]
                                                delegate: Rectangle {
                                                    required property string modelData
                                                    width: 58
                                                    height: 28
                                                    radius: win.customRadius > 6 ? 6 : win.customRadius
                                                    color: win.playgroundSize === modelData ? win.cPrimary : win.cCard
                                                    border.color: win.playgroundSize === modelData ? win.cPrimary : win.cBorder

                                                    Text {
                                                        anchors.centerIn: parent
                                                        text: parent.modelData.toUpperCase()
                                                        color: win.playgroundSize === parent.modelData ? win.cPrimaryFg : win.cFg
                                                        font.pixelSize: 12
                                                        font.weight: Font.Medium
                                                    }
                                                    MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: win.playgroundSize = parent.modelData }
                                                }
                                            }
                                        }
                                    }

                                    // Button Label
                                    Column {
                                        spacing: 6
                                        Text { text: "Button Label"; color: win.cMutedFg; font.pixelSize: 12; font.weight: Font.DemiBold }
                                        Rectangle {
                                            width: 300
                                            height: 34
                                            radius: win.customRadius > 6 ? 6 : win.customRadius
                                            color: win.cBg
                                            border.color: win.cBorder
                                            TextInput {
                                                anchors.fill: parent
                                                anchors.margins: 8
                                                text: win.playgroundLabel
                                                color: win.cFg
                                                font.pixelSize: 13
                                                onTextEdited: win.playgroundLabel = text
                                            }
                                        }
                                    }

                                    // State Checkboxes
                                    Column {
                                        spacing: 8
                                        Row {
                                            spacing: 8
                                            CheckBox { id: cbLoad; checked: win.playgroundLoading; onToggled: win.playgroundLoading = checked }
                                            Text { text: "Loading State"; color: win.cFg; font.pixelSize: 13; anchors.verticalCenter: parent.verticalCenter }
                                        }
                                        Row {
                                            spacing: 8
                                            CheckBox { id: cbDis; checked: win.playgroundDisabled; onToggled: win.playgroundDisabled = checked }
                                            Text { text: "Disabled"; color: win.cFg; font.pixelSize: 13; anchors.verticalCenter: parent.verticalCenter }
                                        }
                                        Row {
                                            spacing: 8
                                            CheckBox { id: cbFull; checked: win.playgroundFullWidth; onToggled: win.playgroundFullWidth = checked }
                                            Text { text: "Full Width"; color: win.cFg; font.pixelSize: 13; anchors.verticalCenter: parent.verticalCenter }
                                        }
                                        Row {
                                            spacing: 8
                                            CheckBox { id: cbPoly; checked: win.playgroundPolymorphic; onToggled: win.playgroundPolymorphic = checked }
                                            Text { text: "Polymorphic (`<a>` link via Base UI)"; color: win.cFg; font.pixelSize: 13; anchors.verticalCenter: parent.verticalCenter }
                                        }
                                    }
                                }

                                // Right Column: Stage & Code Block
                                Column {
                                    width: parent.width - 344
                                    spacing: 16

                                    // Stage Box (Dashed border)
                                    Rectangle {
                                        width: parent.width
                                        height: 170
                                        radius: win.customRadius
                                        color: win.cBg
                                        border.color: win.cBorder
                                        border.width: 1

                                        ChaSetButton {
                                            anchors.centerIn: parent
                                            variant: win.playgroundVariant
                                            size: win.playgroundSize
                                            text: win.playgroundLabel
                                            loading: win.playgroundLoading
                                            disabled: win.playgroundDisabled
                                            fullWidth: win.playgroundFullWidth
                                            customRadius: win.customRadius > 2 ? win.customRadius - 2 : win.customRadius
                                            onClicked: {
                                                win.playgroundClicks += 1
                                                win.pushLog("Sandbox button clicked (" + win.playgroundClicks + ")")
                                            }
                                        }

                                        Row {
                                            anchors.bottom: parent.bottom
                                            anchors.left: parent.left
                                            anchors.margins: 12
                                            spacing: 8
                                            Text {
                                                text: "Clicks: " + win.playgroundClicks
                                                color: win.cMutedFg
                                                font.pixelSize: 12
                                                font.family: "Consolas, monospace"
                                            }
                                        }
                                    }

                                    // Code Snippet Box
                                    Rectangle {
                                        width: parent.width
                                        height: 130
                                        radius: win.customRadius
                                        color: win.cCard
                                        border.color: win.cBorder
                                        border.width: 1

                                        Column {
                                            anchors.fill: parent
                                            Rectangle {
                                                width: parent.width
                                                height: 30
                                                color: win.cAccentBg
                                                radius: win.customRadius
                                                Text {
                                                    x: 12
                                                    anchors.verticalCenter: parent.verticalCenter
                                                    text: "React JSX Usage / QML"
                                                    color: win.cMutedFg
                                                    font.pixelSize: 11
                                                    font.weight: Font.Bold
                                                }
                                            }
                                            TextArea {
                                                readOnly: true
                                                width: parent.width - 24
                                                height: 90
                                                x: 12
                                                y: 35
                                                text: "<Button\n  variant=\"" + win.playgroundVariant + "\"\n  size=\"" + win.playgroundSize + "\"" + (win.playgroundLoading ? "\n  loading" : "") + (win.playgroundDisabled ? "\n  disabled" : "") + "\n>\n  " + win.playgroundLabel + "\n</Button>"
                                                color: win.cFg
                                                font.family: "Consolas, monospace"
                                                font.pixelSize: 11
                                                background: null
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // ==============================================================
                    // SECTION 2: COMPONENTS · BUTTON MATRIX (Card)
                    // ==============================================================
                    Rectangle {
                        width: parent.width
                        height: matrixCol.implicitHeight + 48
                        radius: win.customRadius
                        color: win.cCard
                        border.color: win.cBorder
                        border.width: 1

                        Column {
                            id: matrixCol
                            x: 24
                            y: 20
                            width: parent.width - 48
                            spacing: 16

                            Column {
                                spacing: 4
                                Text { text: "Components · Button Matrix"; color: win.cFg; font.pixelSize: 17; font.weight: Font.DemiBold }
                                Text { text: "Neutral contract (spec/components/button.ts) implemented via @base-ui/react. Full variant × size matrix, polymorphic link rendering, and asynchronous loading states."; color: win.cMutedFg; font.pixelSize: 13 }
                            }

                            Grid {
                                columns: 1
                                rowSpacing: 12
                                width: parent.width

                                Repeater {
                                    model: ["primary", "secondary", "ghost", "destructive"]
                                    delegate: Row {
                                        required property string modelData
                                        spacing: 12
                                        Text {
                                            text: modelData
                                            color: win.cMutedFg
                                            font.pixelSize: 13
                                            font.family: "Consolas, monospace"
                                            width: 100
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                        ChaSetButton { variant: parent.modelData; size: "sm"; text: parent.modelData + " sm"; customRadius: win.customRadius > 2 ? win.customRadius - 2 : win.customRadius; onClicked: win.pushLog(modelData + " sm clicked") }
                                        ChaSetButton { variant: parent.modelData; size: "md"; text: parent.modelData + " md"; customRadius: win.customRadius > 2 ? win.customRadius - 2 : win.customRadius; onClicked: win.pushLog(modelData + " md clicked") }
                                        ChaSetButton { variant: parent.modelData; size: "lg"; text: parent.modelData + " lg"; customRadius: win.customRadius > 2 ? win.customRadius - 2 : win.customRadius; onClicked: win.pushLog(modelData + " lg clicked") }
                                    }
                                }

                                // States Row
                                Row {
                                    spacing: 12
                                    Text {
                                        text: "states"
                                        color: win.cMutedFg
                                        font.pixelSize: 13
                                        font.family: "Consolas, monospace"
                                        width: 100
                                        anchors.verticalCenter: parent.verticalCenter
                                    }
                                    ChaSetButton { variant: "destructive"; text: "Delete Action"; customRadius: win.customRadius > 2 ? win.customRadius - 2 : win.customRadius; onClicked: win.pushLog("destructive clicked") }
                                    ChaSetButton { text: "Disabled Button"; disabled: true; customRadius: win.customRadius > 2 ? win.customRadius - 2 : win.customRadius }
                                    ChaSetButton {
                                        variant: "secondary"
                                        text: "Render as Link"
                                        customRadius: win.customRadius > 2 ? win.customRadius - 2 : win.customRadius
                                        onClicked: win.pushLog("polymorphic link clicked")
                                    }
                                }

                                // Async Simulation
                                Row {
                                    spacing: 12
                                    Text {
                                        text: "async"
                                        color: win.cMutedFg
                                        font.pixelSize: 13
                                        font.family: "Consolas, monospace"
                                        width: 100
                                        anchors.verticalCenter: parent.verticalCenter
                                    }
                                    ChaSetButton {
                                        id: btnAsync
                                        text: loading ? "Saving Changes…" : "Simulate Async Action"
                                        customRadius: win.customRadius > 2 ? win.customRadius - 2 : win.customRadius
                                        onClicked: {
                                            loading = true
                                            win.pushLog("Async action started (1.2s spinner)")
                                            timerAsync.restart()
                                        }
                                    }
                                    Timer {
                                        id: timerAsync
                                        interval: 1200
                                        onTriggered: {
                                            btnAsync.loading = false
                                            win.pushLog("Async action completed")
                                        }
                                    }
                                }

                                // Full Width Row
                                Row {
                                    spacing: 12
                                    width: parent.width
                                    Text {
                                        text: "fullWidth"
                                        color: win.cMutedFg
                                        font.pixelSize: 13
                                        font.family: "Consolas, monospace"
                                        width: 100
                                        anchors.verticalCenter: parent.verticalCenter
                                    }
                                    ChaSetButton {
                                        fullWidth: true
                                        width: 500
                                        text: "Full Width Block Action"
                                        customRadius: win.customRadius > 2 ? win.customRadius - 2 : win.customRadius
                                        onClicked: win.pushLog("fullWidth clicked")
                                    }
                                }

                                // Interaction Log Box
                                Rectangle {
                                    width: parent.width
                                    height: 80
                                    color: win.cBg
                                    radius: 4
                                    border.color: win.cBorder

                                    Column {
                                        anchors.fill: parent
                                        anchors.margins: 10
                                        spacing: 4
                                        Row {
                                            width: parent.width
                                            Text { text: "Interaction Log:"; color: win.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold }
                                            Item { width: 10; height: 1 }
                                            Text {
                                                text: "Clear"
                                                color: win.cPrimary
                                                font.pixelSize: 11
                                                MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: win.clearLogs() }
                                            }
                                        }
                                        Repeater {
                                            model: win.clickLogs
                                            delegate: Text {
                                                required property string modelData
                                                text: "• " + modelData
                                                color: win.cFg
                                                font.pixelSize: 11
                                                font.family: "Consolas, monospace"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // ==============================================================
                    // SECTION 2.5: COMPONENTS · SCROLL AREA SHOWCASE (Card)
                    // ==============================================================
                    Rectangle {
                        width: parent.width
                        height: scrollAreaShowcaseCol.implicitHeight + 48
                        radius: win.customRadius
                        color: win.cCard
                        border.color: win.cBorder
                        border.width: 1

                        Column {
                            id: scrollAreaShowcaseCol
                            x: 24
                            y: 20
                            width: parent.width - 48
                            spacing: 16

                            Column {
                                spacing: 4
                                Row {
                                    spacing: 8
                                    Text { text: "Components · Scroll Area Showcase"; color: win.cFg; font.pixelSize: 17; font.weight: Font.DemiBold }
                                    Rectangle {
                                        width: 46; height: 20; radius: 10
                                        color: Qt.rgba(win.cPrimary.r, win.cPrimary.g, win.cPrimary.b, 0.15)
                                        Text { anchors.centerIn: parent; text: "New"; color: win.cPrimary; font.pixelSize: 11; font.weight: Font.Bold }
                                    }
                                }
                                Text { text: "Augments native Flickable with custom styling, dynamic hot-zone expansion (0.5rem), accurate track-click jump, and interactive stepper navigation."; color: win.cMutedFg; font.pixelSize: 13 }
                            }

                            // Mode Selector Tabs & Controls
                            Row {
                                width: parent.width
                                spacing: 12

                                // 3 Mode Tabs
                                Row {
                                    spacing: 6
                                    Repeater {
                                        model: [
                                            ["Vertical List (120 Logs)", "vertical"],
                                            ["Horizontal Cards (24 Cards)", "horizontal"],
                                            ["Dual-Axis (100x8 Grid)", "both"]
                                        ]
                                        delegate: Rectangle {
                                            required property var modelData
                                            width: tabText.implicitWidth + 24
                                            height: 28
                                            radius: win.customRadius > 6 ? 6 : win.customRadius
                                            color: win.scrollDemoMode === modelData[1] ? win.cPrimary : win.cBg
                                            border.color: win.scrollDemoMode === modelData[1] ? win.cPrimary : win.cBorder

                                            Text {
                                                id: tabText
                                                anchors.centerIn: parent
                                                text: parent.modelData[0]
                                                color: win.scrollDemoMode === parent.modelData[1] ? win.cPrimaryFg : win.cFg
                                                font.pixelSize: 12
                                                font.weight: Font.Medium
                                            }
                                            MouseArea {
                                                anchors.fill: parent
                                                cursorShape: Qt.PointingHandCursor
                                                onClicked: {
                                                    win.scrollDemoMode = parent.modelData[1]
                                                    win.pushLog("Scroll mode: " + parent.modelData[0])
                                                }
                                            }
                                        }
                                    }
                                }

                                Item { width: parent.width - 660; height: 1 }

                                // Quick Controls
                                Row {
                                    spacing: 12
                                    anchors.verticalCenter: parent.verticalCenter

                                    Row {
                                        spacing: 6
                                        CheckBox {
                                            id: cbScrollBtns
                                            checked: win.scrollShowButtons
                                            onToggled: win.scrollShowButtons = checked
                                        }
                                        Text { text: "Steppers"; color: win.cFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                                    }

                                    Row {
                                        spacing: 6
                                        CheckBox {
                                            id: cbScrollSmooth
                                            checked: win.scrollSmooth
                                            onToggled: win.scrollSmooth = checked
                                        }
                                        Text { text: "Smooth"; color: win.cFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                                    }
                                }
                            }

                            // Stage Box
                            Rectangle {
                                width: parent.width
                                height: 300
                                radius: win.customRadius
                                color: win.cBg
                                border.color: win.cBorder
                                border.width: 1
                                clip: true

                                // Mode 1: Vertical List (120 Items)
                                ChaSetScrollView {
                                    id: demoScrollVert
                                    visible: win.scrollDemoMode === "vertical"
                                    anchors.fill: parent
                                    anchors.margins: 4
                                    showButtons: win.scrollShowButtons
                                    smoothScroll: win.scrollSmooth
                                    hitSize: win.scrollHitSize
                                    contentWidth: parent.width - 20
                                    contentHeight: vertListCol.implicitHeight + 16

                                    Column {
                                        id: vertListCol
                                        x: 8
                                        y: 8
                                        width: parent.width - 16
                                        spacing: 6

                                        Text {
                                            text: "Release Changelog (120 Releases — Test Page Up/Down & Jump)"
                                            color: win.cFg
                                            font.pixelSize: 13
                                            font.weight: Font.Bold
                                        }

                                        Repeater {
                                            model: 120
                                            delegate: Rectangle {
                                                required property int index
                                                width: vertListCol.width
                                                height: 38
                                                radius: 4
                                                color: index % 2 === 0 ? win.cCard : "transparent"
                                                border.color: win.cBorder
                                                border.width: 0.5

                                                Row {
                                                    anchors.fill: parent
                                                    anchors.leftMargin: 12
                                                    anchors.rightMargin: 12
                                                    spacing: 12

                                                    Text {
                                                        anchors.verticalCenter: parent.verticalCenter
                                                        text: "v" + (1 + Math.floor((120 - parent.parent.index) / 50)) + "." + (Math.floor(((120 - parent.parent.index) % 50) / 10)) + "." + ((120 - parent.parent.index) % 10) + "-build." + (120 - parent.parent.index)
                                                        color: win.cPrimary
                                                        font.pixelSize: 12
                                                        font.family: "Consolas, monospace"
                                                        font.weight: Font.Bold
                                                        width: 140
                                                    }

                                                    Rectangle {
                                                        anchors.verticalCenter: parent.verticalCenter
                                                        width: 70; height: 20; radius: 4
                                                        color: win.cAccentBg
                                                        Text {
                                                            anchors.centerIn: parent
                                                            text: ["Tokens", "Ergonomics", "Performance", "Desktop/Qt", "Visuals", "Architecture"][parent.parent.parent.index % 6]
                                                            color: win.cFg
                                                            font.pixelSize: 10
                                                            font.weight: Font.Medium
                                                        }
                                                    }

                                                    Text {
                                                        anchors.verticalCenter: parent.verticalCenter
                                                        text: "Patch #" + (120 - parent.parent.index) + ": Synchronized scrollbar precision, steppers, and boundary checks"
                                                        color: win.cMutedFg
                                                        font.pixelSize: 11
                                                        elide: Text.ElideRight
                                                        width: 320
                                                    }

                                                    Text {
                                                        anchors.verticalCenter: parent.verticalCenter
                                                        text: "2026-08-" + String((parent.parent.index % 28) + 1).padStart(2, '0')
                                                        color: win.cMutedFg
                                                        font.pixelSize: 11
                                                        font.family: "Consolas, monospace"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                // Mode 2: Horizontal Feature Cards (24 Cards)
                                ChaSetScrollView {
                                    id: demoScrollHoriz
                                    visible: win.scrollDemoMode === "horizontal"
                                    anchors.fill: parent
                                    anchors.margins: 12
                                    showVerticalScrollBar: false
                                    showHorizontalScrollBar: true
                                    showButtons: win.scrollShowButtons
                                    smoothScroll: win.scrollSmooth
                                    hitSize: win.scrollHitSize
                                    contentWidth: horizCardsRow.implicitWidth + 24
                                    contentHeight: parent.height - 24

                                    Row {
                                        id: horizCardsRow
                                        spacing: 12
                                        height: parent.height - 24

                                        Repeater {
                                            model: [
                                                ["Single Source of Truth", "spec/tokens shards drive CSS & Qt", "Architecture"],
                                                ["Pixel-Perfect Parity", "100% identical styling across platforms", "Visuals"],
                                                ["Dual-Box Hot Zone", "0.5rem hit zone with 0.25rem-0.5rem dynamic expand", "Ergonomics"],
                                                ["Stepper Navigation", "To-top, page-up, page-down, to-bottom", "Interaction"],
                                                ["Native Performance", "Zero Electron overhead, pure QML on Qt", "Desktop"],
                                                ["Tailwind v4 Theming", "Inline theme variables mapped to CSS tokens", "Web"],
                                                ["Theme Studio Tuner", "Live color manipulation and JSON exporter", "Tooling"],
                                                ["Cross-Stack Parity Gate", "CI verifies every required capability", "Quality"],
                                                ["Token Shard Engine", "Modular schemas for colors, space, motion", "Tokens"],
                                                ["Synchronized Palette", "Dual-mode dark & light automatic calibration", "Visuals"],
                                                ["Fluid Animation Curve", "150ms cubic easing for hot-zone hover states", "Motion"],
                                                ["Non-Intrusive Idle", "4px slim visual bar preserves screen estate", "Ergonomics"],
                                                ["Multi-Page Stepping", "85% viewport ratio smooth pagination jump", "Interaction"],
                                                ["Bi-Directional Bounds", "Thumb never overlaps stepper button clusters", "Robustness"],
                                                ["High Contrast A11y", "WCAG AAA verified state contrast ratios", "Accessibility"],
                                                ["Zero Dependency Core", "Headless primitives with minimal bundle size", "Performance"],
                                                ["QML Quick Integration", "Direct C++ token pipeline for 60fps Qt apps", "Desktop"],
                                                ["Visual Diff Conformance", "Automated pixelmatch snapshots on pull requests", "Quality"],
                                                ["Dual-Axis Sync Corner", "Seamless 2D grid matrix scrolling support", "Layout"],
                                                ["Polymorphic Component", "Custom render delegation via Base UI engine", "Architecture"],
                                                ["Touch & Pen Modality", "Smooth drag latch with touch gesture priority", "Interaction"],
                                                ["Zod API Schema", "Static typescript validation on design token types", "TypeSafety"],
                                                ["Dynamic CSS Variables", "Scoped custom properties for hot reload themes", "Web"],
                                                ["Release Artifact CI", "Generates headers, css, and tokens in one pass", "Tooling"]
                                            ]
                                            delegate: Rectangle {
                                                required property var modelData
                                                width: 220
                                                height: 240
                                                radius: win.customRadius > 6 ? 6 : win.customRadius
                                                color: win.cCard
                                                border.color: win.cBorder
                                                border.width: 1

                                                Column {
                                                    anchors.fill: parent
                                                    anchors.margins: 14
                                                    spacing: 10

                                                    Rectangle {
                                                        width: badgeText.implicitWidth + 12
                                                        height: 20
                                                        radius: 4
                                                        color: Qt.rgba(win.cPrimary.r, win.cPrimary.g, win.cPrimary.b, 0.15)
                                                        Text {
                                                            id: badgeText
                                                            anchors.centerIn: parent
                                                            text: parent.parent.parent.modelData[2]
                                                            color: win.cPrimary
                                                            font.pixelSize: 10
                                                            font.weight: Font.Bold
                                                        }
                                                    }

                                                    Text {
                                                        text: parent.parent.modelData[0]
                                                        color: win.cFg
                                                        font.pixelSize: 14
                                                        font.weight: Font.Bold
                                                        wrapMode: Text.WordWrap
                                                        width: parent.width
                                                    }

                                                    Text {
                                                        text: parent.parent.modelData[1]
                                                        color: win.cMutedFg
                                                        font.pixelSize: 12
                                                        wrapMode: Text.WordWrap
                                                        width: parent.width
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                // Mode 3: Dual-Axis 2D Matrix (100 Rows x 8 Columns)
                                ChaSetScrollView {
                                    id: demoScrollBoth
                                    visible: win.scrollDemoMode === "both"
                                    anchors.fill: parent
                                    anchors.margins: 4
                                    showVerticalScrollBar: true
                                    showHorizontalScrollBar: true
                                    showButtons: win.scrollShowButtons
                                    smoothScroll: win.scrollSmooth
                                    hitSize: win.scrollHitSize
                                    contentWidth: 920
                                    contentHeight: matrixRowsCol.implicitHeight + 20

                                    Column {
                                        id: matrixRowsCol
                                        x: 8
                                        y: 8
                                        spacing: 4

                                        // Matrix Table Header
                                        Row {
                                            spacing: 8
                                            Rectangle { width: 70; height: 26; color: win.cAccentBg; radius: 3; Text { anchors.centerIn: parent; text: "ID"; color: win.cFg; font.pixelSize: 11; font.weight: Font.Bold } }
                                            Rectangle { width: 260; height: 26; color: win.cAccentBg; radius: 3; Text { anchors.centerIn: parent; text: "Feature Name"; color: win.cFg; font.pixelSize: 11; font.weight: Font.Bold } }
                                            Rectangle { width: 110; height: 26; color: win.cAccentBg; radius: 3; Text { anchors.centerIn: parent; text: "Category"; color: win.cFg; font.pixelSize: 11; font.weight: Font.Bold } }
                                            Rectangle { width: 110; height: 26; color: win.cAccentBg; radius: 3; Text { anchors.centerIn: parent; text: "Target Stack"; color: win.cFg; font.pixelSize: 11; font.weight: Font.Bold } }
                                            Rectangle { width: 90; height: 26; color: win.cAccentBg; radius: 3; Text { anchors.centerIn: parent; text: "Status"; color: win.cFg; font.pixelSize: 11; font.weight: Font.Bold } }
                                            Rectangle { width: 80; height: 26; color: win.cAccentBg; radius: 3; Text { anchors.centerIn: parent; text: "Priority"; color: win.cFg; font.pixelSize: 11; font.weight: Font.Bold } }
                                            Rectangle { width: 100; height: 26; color: win.cAccentBg; radius: 3; Text { anchors.centerIn: parent; text: "Commit Hash"; color: win.cFg; font.pixelSize: 11; font.weight: Font.Bold } }
                                        }

                                        Repeater {
                                            model: 100
                                            delegate: Row {
                                                required property int index
                                                spacing: 8

                                                Rectangle { width: 70; height: 28; color: parent.index % 2 === 0 ? win.cCard : win.cBg; border.color: win.cBorder; radius: 3; Text { anchors.centerIn: parent; text: "#" + String(parent.parent.index + 1).padStart(3, '0'); color: win.cMutedFg; font.pixelSize: 11; font.family: "Consolas, monospace" } }
                                                Rectangle { width: 260; height: 28; color: parent.index % 2 === 0 ? win.cCard : win.cBg; border.color: win.cBorder; radius: 3; Text { anchors.left: parent.left; anchors.leftMargin: 8; anchors.verticalCenter: parent.verticalCenter; text: "Cross-stack test matrix item #" + (parent.parent.index + 1); color: win.cFg; font.pixelSize: 11; elide: Text.ElideRight; width: 240 } }
                                                Rectangle { width: 110; height: 28; color: parent.index % 2 === 0 ? win.cCard : win.cBg; border.color: win.cBorder; radius: 3; Text { anchors.centerIn: parent; text: ["Compiler", "Tokens", "Components", "Desktop", "Web"][parent.parent.index % 5]; color: win.cFg; font.pixelSize: 11 } }
                                                Rectangle { width: 110; height: 28; color: parent.index % 2 === 0 ? win.cCard : win.cBg; border.color: win.cBorder; radius: 3; Text { anchors.centerIn: parent; text: ["React & Qt", "React Only", "Qt Only"][parent.parent.index % 3]; color: win.cPrimary; font.pixelSize: 11 } }
                                                Rectangle { width: 90; height: 28; color: parent.index % 2 === 0 ? win.cCard : win.cBg; border.color: win.cBorder; radius: 3; Text { anchors.centerIn: parent; text: "Verified"; color: "#22c55e"; font.pixelSize: 11; font.weight: Font.DemiBold } }
                                                Rectangle { width: 80; height: 28; color: parent.index % 2 === 0 ? win.cCard : win.cBg; border.color: win.cBorder; radius: 3; Text { anchors.centerIn: parent; text: parent.parent.index % 3 === 0 ? "High" : "Normal"; color: win.cFg; font.pixelSize: 11 } }
                                                Rectangle { width: 100; height: 28; color: parent.index % 2 === 0 ? win.cCard : win.cBg; border.color: win.cBorder; radius: 3; Text { anchors.centerIn: parent; text: "a1b2c3d"; color: win.cMutedFg; font.pixelSize: 11; font.family: "Consolas, monospace" } }
                                            }
                                        }
                                    }
                                }
                            }

                            // Programmatic Trigger Actions Toolbar
                            Row {
                                spacing: 8
                                Text { text: "Quick Jump Actions:"; color: win.cMutedFg; font.pixelSize: 11; font.weight: Font.Bold; anchors.verticalCenter: parent.verticalCenter }
                                ChaSetButton {
                                    size: "sm"
                                    variant: "secondary"
                                    text: "⇡ To Top"
                                    onClicked: {
                                        if (win.scrollDemoMode === "vertical") demoScrollVert.scrollToTop()
                                        else if (win.scrollDemoMode === "horizontal") demoScrollHoriz.scrollToLeft()
                                        else demoScrollBoth.scrollToTop()
                                        win.pushLog("Triggered: To Top")
                                    }
                                }
                                ChaSetButton {
                                    size: "sm"
                                    variant: "secondary"
                                    text: "▴ Page Up"
                                    onClicked: {
                                        if (win.scrollDemoMode === "vertical") demoScrollVert.pageUp()
                                        else if (win.scrollDemoMode === "horizontal") demoScrollHoriz.pageLeft()
                                        else demoScrollBoth.pageUp()
                                        win.pushLog("Triggered: Page Up")
                                    }
                                }
                                ChaSetButton {
                                    size: "sm"
                                    variant: "secondary"
                                    text: "▾ Page Down"
                                    onClicked: {
                                        if (win.scrollDemoMode === "vertical") demoScrollVert.pageDown()
                                        else if (win.scrollDemoMode === "horizontal") demoScrollHoriz.pageRight()
                                        else demoScrollBoth.pageDown()
                                        win.pushLog("Triggered: Page Down")
                                    }
                                }
                                ChaSetButton {
                                    size: "sm"
                                    variant: "secondary"
                                    text: "⇣ To Bottom"
                                    onClicked: {
                                        if (win.scrollDemoMode === "vertical") demoScrollVert.scrollToBottom()
                                        else if (win.scrollDemoMode === "horizontal") demoScrollHoriz.scrollToRight()
                                        else demoScrollBoth.scrollToBottom()
                                        win.pushLog("Triggered: To Bottom")
                                    }
                                }
                            }
                        }
                    }

                    // ==============================================================
                    // SECTION 3: PALETTE · SEMANTIC CORE TOKENS (Card)
                    // ==============================================================
                    Rectangle {
                        width: parent.width
                        height: paletteCol.implicitHeight + 48
                        radius: win.customRadius
                        color: win.cCard
                        border.color: win.cBorder
                        border.width: 1

                        Column {
                            id: paletteCol
                            x: 24
                            y: 20
                            width: parent.width - 48
                            spacing: 16

                            Column {
                                spacing: 4
                                Text { text: "Palette · Semantic Core Tokens"; color: win.cFg; font.pixelSize: 17; font.weight: Font.DemiBold }
                                Text { text: "All derived from spec/tokens.json. Click any swatch to copy its CSS variable expression."; color: win.cMutedFg; font.pixelSize: 13 }
                            }

                            Grid {
                                columns: 5
                                columnSpacing: 12
                                rowSpacing: 12
                                width: parent.width

                                Repeater {
                                    model: [
                                        ["background", "window bg"], ["foreground", "text fg"],
                                        ["primary", "primary action"], ["primary-foreground", "primary text"],
                                        ["secondary", "secondary surface"], ["secondary-foreground", "secondary text"],
                                        ["muted", "muted bg"], ["muted-foreground", "muted text"],
                                        ["accent", "accent hue"], ["accent-foreground", "accent text"],
                                        ["destructive", "danger action"], ["destructive-foreground", "danger text"],
                                        ["border", "border stroke"], ["input", "input border"],
                                        ["ring", "focus ring"], ["card", "card surface"],
                                        ["popover", "popup surface"]
                                    ]
                                    delegate: Rectangle {
                                        required property var modelData
                                        width: 140
                                        height: 94
                                        radius: win.customRadius > 6 ? 6 : win.customRadius
                                        color: win.cCard
                                        border.color: win.cBorder
                                        clip: true

                                        Column {
                                            anchors.fill: parent
                                            Rectangle {
                                                width: parent.width
                                                height: 52
                                                color: ThemeTokens.color(parent.parent.modelData[0])
                                                border.color: win.cBorder
                                            }
                                            Column {
                                                x: 8
                                                y: 4
                                                spacing: 2
                                                Text {
                                                    text: "--" + parent.parent.parent.modelData[0]
                                                    color: win.cFg
                                                    font.pixelSize: 11
                                                    font.family: "Consolas, monospace"
                                                    font.weight: Font.Bold
                                                }
                                                Text {
                                                    text: parent.parent.parent.modelData[1]
                                                    color: win.cMutedFg
                                                    font.pixelSize: 10
                                                }
                                            }
                                        }

                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: win.pushLog("Copied token: --" + parent.modelData[0])
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // ==============================================================
                    // SECTION 4: TYPOGRAPHY / RADIUS / CHARTS (Card)
                    // ==============================================================
                    Rectangle {
                        width: parent.width
                        height: typeCol.implicitHeight + 48
                        radius: win.customRadius
                        color: win.cCard
                        border.color: win.cBorder
                        border.width: 1

                        Column {
                            id: typeCol
                            x: 24
                            y: 20
                            width: parent.width - 48
                            spacing: 16

                            Column {
                                spacing: 4
                                Text { text: "Typography / Radius / Charts"; color: win.cFg; font.pixelSize: 17; font.weight: Font.DemiBold }
                                Text { text: "Radii derived from --radius; font weights map to tokens.json primitives (500/600); chart five colors follow the accent."; color: win.cMutedFg; font.pixelSize: 13 }
                            }

                            // 4 Radius Boxes
                            Row {
                                spacing: 14
                                Repeater {
                                    model: [
                                        ["radius-sm", 4],
                                        ["radius-md", 6],
                                        ["radius-lg", 8],
                                        ["radius-xl", 12]
                                    ]
                                    delegate: Rectangle {
                                        required property var modelData
                                        width: 76
                                        height: 56
                                        radius: modelData[1]
                                        color: Qt.rgba(win.cPrimary.r, win.cPrimary.g, win.cPrimary.b, 0.12)
                                        border.color: win.cPrimary
                                        border.width: 1.5

                                        Text {
                                            anchors.centerIn: parent
                                            text: parent.modelData[0]
                                            color: win.cFg
                                            font.pixelSize: 11
                                            font.weight: Font.Medium
                                        }
                                    }
                                }
                            }

                            // Typography
                            Column {
                                spacing: 4
                                Text {
                                    text: "Medium 500 — Tea Set ChaSet, cross-stack component library"
                                    color: win.cFg
                                    font.pixelSize: 14
                                    font.weight: Font.Medium
                                }
                                Text {
                                    text: "Semibold 600 — Tea Set ChaSet, cross-stack component library"
                                    color: win.cFg
                                    font.pixelSize: 14
                                    font.weight: Font.DemiBold
                                }
                            }

                            // 5 Chart Bars
                            Row {
                                spacing: 8
                                height: 90
                                Repeater {
                                    model: [1, 2, 3, 4, 5]
                                    delegate: Rectangle {
                                        required property int modelData
                                        width: 48
                                        height: 28 + modelData * 12
                                        radius: 4
                                        color: win.cPrimary
                                        opacity: 0.35 + modelData * 0.13
                                        anchors.bottom: parent.bottom
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // ==============================================================
        // 3. EXPORT & COPY MODAL DIALOG
        // ==============================================================
        Rectangle {
            visible: win.exportModalOpen
            anchors.fill: parent
            z: 100
            color: Qt.rgba(0, 0, 0, 0.6)

            MouseArea { anchors.fill: parent; onClicked: win.exportModalOpen = false }

            Rectangle {
                width: 680
                height: 500
                radius: win.customRadius
                color: win.cCard
                border.color: win.cBorder
                border.width: 1
                anchors.centerIn: parent

                MouseArea { anchors.fill: parent }

                Column {
                    anchors.fill: parent
                    anchors.margins: 20
                    spacing: 16

                    Row {
                        width: parent.width
                        Text { text: "Export & Copy Theme Configuration"; color: win.cFg; font.pixelSize: 17; font.weight: Font.Bold }
                        Item { width: parent.width - 320; height: 1 }
                        Text {
                            text: "✕"
                            color: win.cMutedFg
                            font.pixelSize: 18
                            MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: win.exportModalOpen = false }
                        }
                    }

                    Row {
                        spacing: 8
                        Repeater {
                            model: [
                                ["qt", "Qt / QML"],
                                ["react", "React Code"],
                                ["css", "CSS Variables"],
                                ["tailwind", "Tailwind v4"],
                                ["json", "JSON Spec"]
                            ]
                            delegate: Rectangle {
                                required property var modelData
                                width: 100
                                height: 30
                                radius: 4
                                color: win.exportTab === modelData[0] ? win.cPrimary : win.cAccentBg
                                Text {
                                    anchors.centerIn: parent
                                    text: parent.modelData[1]
                                    color: win.exportTab === parent.modelData[0] ? win.cPrimaryFg : win.cFg
                                    font.pixelSize: 12
                                    font.weight: Font.Medium
                                }
                                MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: win.exportTab = parent.modelData[0] }
                            }
                        }
                    }

                    Rectangle {
                        width: parent.width
                        height: 300
                        color: win.cBg
                        border.color: win.cBorder
                        radius: 4

                        ScrollView {
                            anchors.fill: parent
                            anchors.margins: 12
                            TextArea {
                                readOnly: true
                                text: {
                                    if (win.exportTab === "qt") {
                                        return "// ChaSet Qt QML Component Usage\nimport QtQuick 6.10\nimport chaSet\n\nChaSetButton {\n    variant: \"" + win.playgroundVariant + "\"\n    size: \"" + win.playgroundSize + "\"\n    text: \"" + win.playgroundLabel + "\"\n    customRadius: " + win.customRadius + "\n    onClicked: console.log(\"Clicked\")\n}\n\n// Runtime Theme Toggle:\n// ThemeTokens.dark = " + (ThemeTokens.dark ? "true" : "false") + ";"
                                    }
                                    if (win.exportTab === "react") {
                                        return "import { Button } from '@chahu/cha-set';\nimport '@chahu/cha-set/styles.css';\n\n<Button variant=\"" + win.playgroundVariant + "\" size=\"" + win.playgroundSize + "\">\n  " + win.playgroundLabel + "\n</Button>"
                                    }
                                    if (win.exportTab === "css") {
                                        return ":root {\n  --radius: " + win.customRadius + "px;\n  --primary: " + (ThemeTokens.dark ? "#30a0ff" : "#1d7ae0") + ";\n  --background: " + (ThemeTokens.dark ? "#020817" : "#ffffff") + ";\n}"
                                    }
                                    if (win.exportTab === "tailwind") {
                                        return "@theme inline {\n  --color-primary: var(--primary);\n  --radius: " + win.customRadius + "px;\n}"
                                    }
                                    return "{\n  \"theme\": {\n    \"mode\": \"" + (ThemeTokens.dark ? "dark" : "light") + "\",\n    \"radius\": " + win.customRadius + "\n  }\n}"
                                }
                                color: win.cFg
                                font.family: "Consolas, monospace"
                                font.pixelSize: 12
                                background: null
                            }
                        }
                    }

                    Row {
                        anchors.right: parent.right
                        spacing: 10
                        ChaSetButton {
                            variant: "secondary"
                            size: "sm"
                            text: "Close"
                            customRadius: win.customRadius
                            onClicked: win.exportModalOpen = false
                        }
                        ChaSetButton {
                            variant: "primary"
                            size: "sm"
                            text: "✓ Done"
                            customRadius: win.customRadius
                            onClicked: win.exportModalOpen = false
                        }
                    }
                }
            }
        }
        }
    }
}
