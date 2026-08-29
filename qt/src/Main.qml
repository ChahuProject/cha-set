import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

// ChaSet Qt Studio — Cross-Stack Theme & Component Workbench
// 100% visual, behavioral, and feature parity with React Studio (packages/react/examples/basic).
ApplicationWindow {
    id: win
    width: 1100
    height: 980
    visible: true
    title: "🍵 ChaSet Studio — Qt Component & Theme Workbench"
    color: ThemeTokens.background

    // ---- Reactive State ----
    property bool showTuner: true
    property string activeAccent: ""
    property int customRadius: 8
    property string playgroundVariant: "primary"
    property string playgroundSize: "md"
    property string playgroundLabel: "Create Project"
    property bool playgroundLoading: false
    property bool playgroundDisabled: false
    property bool playgroundFullWidth: false
    property int playgroundClicks: 0
    property bool exportModalOpen: false
    property string exportTab: "qt"
    property string lastCopiedNotice: ""

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

    Component.onCompleted: {
        if (startupLight === true) ThemeTokens.dark = false
    }

    // ---- Reusable UI Components ----

    // Card Component
    component Card: Rectangle {
        id: cardRoot
        property string title
        property string subtitle: ""
        default property alias contentData: contentCol.data
        radius: win.customRadius
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        implicitWidth: contentCol.implicitWidth + 32
        implicitHeight: contentCol.implicitHeight + 48

        Column {
            id: contentCol
            x: 18
            y: 16
            spacing: 12
            width: cardRoot.width - 36

            Text {
                text: cardRoot.title
                color: ThemeTokens.text
                font.pixelSize: 15
                font.weight: Font.DemiBold
                font.family: "Segoe UI, -apple-system, sans-serif"
            }
            Text {
                visible: cardRoot.subtitle.length > 0
                text: cardRoot.subtitle
                color: ThemeTokens.subduedText
                font.pixelSize: 12
                font.family: "Segoe UI, -apple-system, sans-serif"
            }
        }
    }

    // Swatch Component
    component SwatchItem: Rectangle {
        property string tokenName
        property string label
        property string hexValue
        width: 140
        height: 96
        radius: Math.max(2, win.customRadius - 2)
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        clip: true

        Column {
            anchors.fill: parent

            Rectangle {
                width: parent.width
                height: 52
                color: ThemeTokens.color(tokenName)
                border.color: ThemeTokens.border
                border.width: 1
            }

            Column {
                x: 8
                y: 4
                spacing: 2
                Text {
                    text: tokenName
                    color: ThemeTokens.text
                    font.pixelSize: 11
                    font.family: "Consolas, ui-monospace, monospace"
                    font.weight: Font.DemiBold
                }
                Text {
                    text: label
                    color: ThemeTokens.subduedText
                    font.pixelSize: 10
                    font.family: "Segoe UI, sans-serif"
                }
            }
        }

        MouseArea {
            anchors.fill: parent
            cursorShape: Qt.PointingHandCursor
            onClicked: {
                win.pushLog("Token copied: " + tokenName)
            }
        }
    }

    // Top Navigation Bar
    Rectangle {
        id: topbar
        width: parent.width
        height: 60
        z: 10
        color: Qt.rgba(ThemeTokens.background.r, ThemeTokens.background.g, ThemeTokens.background.b, 0.9)
        border.color: ThemeTokens.border
        border.width: 1

        Row {
            anchors.left: parent.left
            anchors.leftMargin: 20
            anchors.verticalCenter: parent.verticalCenter
            spacing: 12

            Text {
                text: "🍵"
                font.pixelSize: 22
                anchors.verticalCenter: parent.verticalCenter
            }

            Column {
                anchors.verticalCenter: parent.verticalCenter
                spacing: 1
                Text {
                    text: "ChaSet Studio"
                    color: ThemeTokens.text
                    font.pixelSize: 16
                    font.weight: Font.Bold
                    font.family: "Segoe UI, -apple-system, sans-serif"
                }
                Text {
                    text: "Theme Tuner & Component Showcase (Qt Quick)"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 11
                    font.family: "Segoe UI, sans-serif"
                }
            }
        }

        Row {
            anchors.right: parent.right
            anchors.rightMargin: 20
            anchors.verticalCenter: parent.verticalCenter
            spacing: 10

            // Toggle Tuner
            Rectangle {
                width: 110
                height: 32
                radius: win.customRadius
                color: win.showTuner ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.15) : ThemeTokens.panel
                border.color: win.showTuner ? ThemeTokens.accent : ThemeTokens.border
                border.width: 1

                Row {
                    anchors.centerIn: parent
                    spacing: 6
                    Text { text: "🎨"; font.pixelSize: 12 }
                    Text {
                        text: "Style Tuner"
                        color: ThemeTokens.text
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

            // Dark/Light Toggle
            Rectangle {
                width: 90
                height: 32
                radius: win.customRadius
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1

                Text {
                    anchors.centerIn: parent
                    text: ThemeTokens.dark ? "🌙 Dark" : "☀️ Light"
                    color: ThemeTokens.text
                    font.pixelSize: 12
                    font.weight: Font.Medium
                }
                MouseArea {
                    anchors.fill: parent
                    cursorShape: Qt.PointingHandCursor
                    onClicked: ThemeTokens.dark = !ThemeTokens.dark
                }
            }

            // Export Config Button
            ChaSetButton {
                variant: "primary"
                size: "sm"
                text: "📋 Export & Copy Config"
                customRadius: win.customRadius
                onClicked: win.exportModalOpen = true
            }
        }
    }

    // Main Scrollable Area
    ScrollView {
        anchors.top: topbar.bottom
        anchors.bottom: parent.bottom
        anchors.left: parent.left
        anchors.right: parent.right
        contentWidth: mainCol.width + 40
        contentHeight: mainCol.height + 60
        clip: true

        Column {
            id: mainCol
            x: 20
            y: 20
            width: Math.min(win.width - 40, 1020)
            spacing: 20

            // ==========================================
            // 1. THEME & STYLE TUNER (Collapsible)
            // ==========================================
            Rectangle {
                visible: win.showTuner
                width: parent.width
                height: tunerCol.implicitHeight + 32
                radius: win.customRadius
                color: Qt.rgba(ThemeTokens.panel.r, ThemeTokens.panel.g, ThemeTokens.panel.b, 0.95)
                border.color: ThemeTokens.accent
                border.width: 1

                Column {
                    id: tunerCol
                    x: 18
                    y: 16
                    width: parent.width - 36
                    spacing: 14

                    // Header
                    Row {
                        width: parent.width
                        spacing: 10
                        Text {
                            text: "🎨 Theme & Style Tuner"
                            color: ThemeTokens.text
                            font.pixelSize: 14
                            font.weight: Font.Bold
                        }
                        Item { width: 10; height: 1 }
                        Text {
                            text: "Adjust mode, accent presets, and radius in real-time."
                            color: ThemeTokens.subduedText
                            font.pixelSize: 12
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    Rectangle { width: parent.width; height: 1; color: ThemeTokens.border }

                    // Appearance Mode
                    Row {
                        spacing: 16
                        Text {
                            text: "APPEARANCE"
                            color: ThemeTokens.subduedText
                            font.pixelSize: 11
                            font.weight: Font.DemiBold
                            width: 120
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        Row {
                            spacing: 6
                            Rectangle {
                                width: 80
                                height: 28
                                radius: 4
                                color: !ThemeTokens.dark ? ThemeTokens.panelRaised : ThemeTokens.panel
                                border.color: !ThemeTokens.dark ? ThemeTokens.accent : ThemeTokens.border
                                border.width: !ThemeTokens.dark ? 2 : 1
                                Text {
                                    anchors.centerIn: parent
                                    text: "☀️ Light"
                                    color: ThemeTokens.text
                                    font.pixelSize: 12
                                }
                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: ThemeTokens.dark = false
                                }
                            }
                            Rectangle {
                                width: 80
                                height: 28
                                radius: 4
                                color: ThemeTokens.dark ? ThemeTokens.panelRaised : ThemeTokens.panel
                                border.color: ThemeTokens.dark ? ThemeTokens.accent : ThemeTokens.border
                                border.width: ThemeTokens.dark ? 2 : 1
                                Text {
                                    anchors.centerIn: parent
                                    text: "🌙 Dark"
                                    color: ThemeTokens.text
                                    font.pixelSize: 12
                                }
                                MouseArea {
                                    anchors.fill: parent
                                    cursorShape: Qt.PointingHandCursor
                                    onClicked: ThemeTokens.dark = true
                                }
                            }
                        }
                    }

                    // Accent Presets (9 Presets aligned with Web)
                    Row {
                        spacing: 16
                        Text {
                            text: "ACCENT PRESET"
                            color: ThemeTokens.subduedText
                            font.pixelSize: 11
                            font.weight: Font.DemiBold
                            width: 120
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        Flow {
                            width: parent.parent.width - 140
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
                                    width: 80
                                    height: 26
                                    radius: 13
                                    color: win.activeAccent === modelData[0] ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.2) : ThemeTokens.panel
                                    border.color: win.activeAccent === modelData[0] ? modelData[1] : ThemeTokens.border
                                    border.width: win.activeAccent === modelData[0] ? 2 : 1

                                    Row {
                                        anchors.centerIn: parent
                                        spacing: 5
                                        Rectangle {
                                            width: 8
                                            height: 8
                                            radius: 4
                                            color: parent.parent.modelData[1]
                                        }
                                        Text {
                                            text: parent.parent.modelData[0]
                                            color: ThemeTokens.text
                                            font.pixelSize: 11
                                        }
                                    }

                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: {
                                            win.activeAccent = parent.modelData[0]
                                            win.pushLog("Accent preset: " + parent.modelData[0])
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Corner Radius Stepper/Slider
                    Row {
                        spacing: 16
                        Text {
                            text: "CORNER RADIUS"
                            color: ThemeTokens.subduedText
                            font.pixelSize: 11
                            font.weight: Font.DemiBold
                            width: 120
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        Row {
                            spacing: 8
                            Repeater {
                                model: [
                                    ["0px (Sharp)", 0],
                                    ["4px (Small)", 4],
                                    ["8px (Default)", 8],
                                    ["12px (Large)", 12],
                                    ["20px (Pill)", 20]
                                ]
                                delegate: Rectangle {
                                    required property var modelData
                                    width: 100
                                    height: 26
                                    radius: 4
                                    color: win.customRadius === modelData[1] ? ThemeTokens.panelRaised : ThemeTokens.panel
                                    border.color: win.customRadius === modelData[1] ? ThemeTokens.accent : ThemeTokens.border
                                    border.width: win.customRadius === modelData[1] ? 2 : 1

                                    Text {
                                        anchors.centerIn: parent
                                        text: parent.modelData[0]
                                        color: ThemeTokens.text
                                        font.pixelSize: 11
                                    }

                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: {
                                            win.customRadius = parent.modelData[1]
                                            win.pushLog("Radius changed to: " + parent.modelData[1] + "px")
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            // ==========================================
            // 2. INTERACTIVE COMPONENT SANDBOX
            // ==========================================
            Card {
                title: "Interactive Component Sandbox"
                subtitle: "Adjust props live, interact with the button, and copy ready-to-use QML code directly into your app."
                width: parent.width

                Row {
                    width: parent.width
                    spacing: 24

                    // Left Column: Controls
                    Column {
                        width: 320
                        spacing: 14

                        // Variant Selector
                        Column {
                            spacing: 6
                            Text { text: "Variant"; color: ThemeTokens.subduedText; font.pixelSize: 12; font.weight: Font.DemiBold }
                            Row {
                                spacing: 6
                                Repeater {
                                    model: ["primary", "secondary", "ghost", "destructive"]
                                    delegate: Rectangle {
                                        required property string modelData
                                        width: 74
                                        height: 28
                                        radius: win.customRadius
                                        color: win.playgroundVariant === modelData ? ThemeTokens.accent : ThemeTokens.panelRaised
                                        border.color: win.playgroundVariant === modelData ? ThemeTokens.accent : ThemeTokens.border

                                        Text {
                                            anchors.centerIn: parent
                                            text: parent.modelData
                                            color: win.playgroundVariant === parent.modelData ? ThemeTokens.onAccent : ThemeTokens.text
                                            font.pixelSize: 11
                                            font.weight: Font.Medium
                                        }
                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: win.playgroundVariant = parent.modelData
                                        }
                                    }
                                }
                            }
                        }

                        // Size Selector
                        Column {
                            spacing: 6
                            Text { text: "Size"; color: ThemeTokens.subduedText; font.pixelSize: 12; font.weight: Font.DemiBold }
                            Row {
                                spacing: 6
                                Repeater {
                                    model: ["sm", "md", "lg"]
                                    delegate: Rectangle {
                                        required property string modelData
                                        width: 60
                                        height: 28
                                        radius: win.customRadius
                                        color: win.playgroundSize === modelData ? ThemeTokens.accent : ThemeTokens.panelRaised
                                        border.color: win.playgroundSize === modelData ? ThemeTokens.accent : ThemeTokens.border

                                        Text {
                                            anchors.centerIn: parent
                                            text: parent.modelData.toUpperCase()
                                            color: win.playgroundSize === parent.modelData ? ThemeTokens.onAccent : ThemeTokens.text
                                            font.pixelSize: 11
                                            font.weight: Font.Medium
                                        }
                                        MouseArea {
                                            anchors.fill: parent
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: win.playgroundSize = parent.modelData
                                        }
                                    }
                                }
                            }
                        }

                        // Label Input
                        Column {
                            spacing: 6
                            Text { text: "Button Label"; color: ThemeTokens.subduedText; font.pixelSize: 12; font.weight: Font.DemiBold }
                            Rectangle {
                                width: 310
                                height: 32
                                radius: win.customRadius
                                color: ThemeTokens.background
                                border.color: ThemeTokens.border
                                TextInput {
                                    anchors.fill: parent
                                    anchors.margins: 6
                                    text: win.playgroundLabel
                                    color: ThemeTokens.text
                                    font.pixelSize: 12
                                    onTextChanged: win.playgroundLabel = text
                                }
                            }
                        }

                        // State Toggles
                        Column {
                            spacing: 8
                            Row {
                                spacing: 8
                                CheckBox {
                                    id: chkLoading
                                    checked: win.playgroundLoading
                                    onToggled: win.playgroundLoading = checked
                                }
                                Text { text: "Loading State"; color: ThemeTokens.text; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                            }
                            Row {
                                spacing: 8
                                CheckBox {
                                    id: chkDisabled
                                    checked: win.playgroundDisabled
                                    onToggled: win.playgroundDisabled = checked
                                }
                                Text { text: "Disabled"; color: ThemeTokens.text; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                            }
                            Row {
                                spacing: 8
                                CheckBox {
                                    id: chkFullWidth
                                    checked: win.playgroundFullWidth
                                    onToggled: win.playgroundFullWidth = checked
                                }
                                Text { text: "Full Width"; color: ThemeTokens.text; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                            }
                        }
                    }

                    // Right Column: Canvas + Live Code Preview
                    Column {
                        width: parent.width - 350
                        spacing: 12

                        // Canvas Box
                        Rectangle {
                            width: parent.width
                            height: 160
                            radius: win.customRadius
                            color: ThemeTokens.background
                            border.color: ThemeTokens.border
                            border.width: 1

                            ChaSetButton {
                                anchors.centerIn: parent
                                variant: win.playgroundVariant
                                size: win.playgroundSize
                                text: win.playgroundLabel
                                loading: win.playgroundLoading
                                disabled: win.playgroundDisabled
                                fullWidth: win.playgroundFullWidth
                                customRadius: win.customRadius
                                onClicked: {
                                    win.playgroundClicks += 1
                                    win.pushLog("Sandbox button clicked (" + win.playgroundClicks + ")")
                                }
                            }

                            Row {
                                anchors.bottom: parent.bottom
                                anchors.left: parent.left
                                anchors.margins: 10
                                spacing: 8
                                Text {
                                    text: "Clicks: " + win.playgroundClicks
                                    color: ThemeTokens.subduedText
                                    font.pixelSize: 11
                                }
                                Rectangle {
                                    visible: win.playgroundLoading
                                    width: 120
                                    height: 18
                                    radius: 9
                                    color: ThemeTokens.panelRaised
                                    Text { anchors.centerIn: parent; text: "Loading active"; color: ThemeTokens.accent; font.pixelSize: 10 }
                                }
                            }
                        }

                        // Code Snippet Box
                        Rectangle {
                            width: parent.width
                            height: 120
                            radius: win.customRadius
                            color: ThemeTokens.background
                            border.color: ThemeTokens.border

                            Column {
                                anchors.fill: parent
                                Rectangle {
                                    width: parent.width
                                    height: 28
                                    color: ThemeTokens.panelRaised
                                    radius: win.customRadius
                                    Text {
                                        x: 10
                                        anchors.verticalCenter: parent.verticalCenter
                                        text: "QML Usage"
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: 11
                                        font.weight: Font.DemiBold
                                    }
                                }
                                TextArea {
                                    readOnly: true
                                    width: parent.width - 20
                                    height: 80
                                    text: "ChaSetButton {\n    variant: \"" + win.playgroundVariant + "\"\n    size: \"" + win.playgroundSize + "\"\n    text: \"" + win.playgroundLabel + "\"" + (win.playgroundLoading ? "\n    loading: true" : "") + (win.playgroundDisabled ? "\n    disabled: true" : "") + "\n}"
                                    color: ThemeTokens.text
                                    font.family: "Consolas, monospace"
                                    font.pixelSize: 11
                                    background: null
                                }
                            }
                        }
                    }
                }
            }

            // ==========================================
            // 3. COMPONENT MATRIX
            // ==========================================
            Card {
                title: "Components · ChaSetButton Matrix"
                subtitle: "Full cross-stack variant × size matrix (32px / 36px / 40px), async loading states, and block layout."
                width: parent.width

                Grid {
                    columns: 1
                    rowSpacing: 10
                    width: parent.width

                    Repeater {
                        model: ["primary", "secondary", "ghost", "destructive"]
                        delegate: Row {
                            required property string modelData
                            spacing: 12
                            Text {
                                text: modelData
                                color: ThemeTokens.subduedText
                                font.pixelSize: 12
                                font.family: "Consolas, monospace"
                                width: 90
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            ChaSetButton { variant: parent.modelData; size: "sm"; text: parent.modelData + " sm"; customRadius: win.customRadius; onClicked: win.pushLog(modelData + " sm clicked") }
                            ChaSetButton { variant: parent.modelData; size: "md"; text: parent.modelData + " md"; customRadius: win.customRadius; onClicked: win.pushLog(modelData + " md clicked") }
                            ChaSetButton { variant: parent.modelData; size: "lg"; text: parent.modelData + " lg"; customRadius: win.customRadius; onClicked: win.pushLog(modelData + " lg clicked") }
                        }
                    }

                    // States Row
                    Row {
                        spacing: 12
                        Text {
                            text: "states"
                            color: ThemeTokens.subduedText
                            font.pixelSize: 12
                            font.family: "Consolas, monospace"
                            width: 90
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        ChaSetButton { variant: "destructive"; text: "Delete Action"; customRadius: win.customRadius; onClicked: win.pushLog("destructive clicked") }
                        ChaSetButton { text: "Disabled Button"; disabled: true; customRadius: win.customRadius }
                        ChaSetButton {
                            variant: "secondary"
                            text: "Render as Secondary"
                            customRadius: win.customRadius
                            onClicked: win.pushLog("secondary action clicked")
                        }
                    }

                    // Async Simulation & Block
                    Row {
                        spacing: 12
                        Text {
                            text: "async & block"
                            color: ThemeTokens.subduedText
                            font.pixelSize: 12
                            font.family: "Consolas, monospace"
                            width: 90
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        ChaSetButton {
                            id: saveBtn
                            text: loading ? "Saving Changes…" : "Simulate Async Action"
                            customRadius: win.customRadius
                            onClicked: {
                                loading = true
                                win.pushLog("Async action started (1.2s spinner)")
                                resetTimer.restart()
                            }
                        }
                        Timer {
                            id: resetTimer
                            interval: 1200
                            onTriggered: {
                                saveBtn.loading = false
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
                            color: ThemeTokens.subduedText
                            font.pixelSize: 12
                            font.family: "Consolas, monospace"
                            width: 90
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        ChaSetButton {
                            fullWidth: true
                            width: 460
                            text: "Full Width Block Action"
                            customRadius: win.customRadius
                            onClicked: win.pushLog("fullWidth clicked")
                        }
                    }

                    // Interaction Log Panel
                    Rectangle {
                        width: parent.width
                        height: 70
                        color: ThemeTokens.background
                        radius: 4
                        border.color: ThemeTokens.border

                        Column {
                            anchors.fill: parent
                            anchors.margins: 8
                            spacing: 4
                            Row {
                                width: parent.width
                                Text { text: "Interaction Log:"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.DemiBold }
                                Item { width: 10; height: 1 }
                                Text {
                                    text: "Clear"
                                    color: ThemeTokens.accent
                                    font.pixelSize: 11
                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: win.clearLogs()
                                    }
                                }
                            }
                            Repeater {
                                model: win.clickLogs
                                delegate: Text {
                                    required property string modelData
                                    text: "• " + modelData
                                    color: ThemeTokens.text
                                    font.pixelSize: 11
                                    font.family: "Consolas, monospace"
                                }
                            }
                        }
                    }
                }
            }

            // ==========================================
            // 4. PALETTE & SEMANTIC TOKENS
            // ==========================================
            Card {
                title: "Palette · Semantic Core Tokens"
                subtitle: "Derived from spec/tokens.json. Bound live to ThemeTokens singleton."
                width: parent.width

                Grid {
                    columns: 6
                    columnSpacing: 12
                    rowSpacing: 12
                    Repeater {
                        model: [
                            ["background", "window bg"], ["panel", "card panel"],
                            ["panelRaised", "raised panel"], ["selection", "selection"],
                            ["hover", "hover surface"], ["pressed", "pressed surface"],
                            ["accent", "primary action"], ["onAccent", "primary text"],
                            ["border", "border stroke"], ["text", "foreground text"],
                            ["subduedText", "muted text"], ["danger", "destructive"],
                            ["dangerHover", "danger hover"], ["focus", "ring indicator"],
                            ["overlayScrim", "scrim mask"], ["conflict", "conflict orange"],
                            ["blocked", "blocked grey"], ["pendingAccent", "pending amber"]
                        ]
                        delegate: SwatchItem {
                            required property var modelData
                            tokenName: modelData[0]
                            label: modelData[1]
                        }
                    }
                }
            }

            // ==========================================
            // 5. TYPOGRAPHY, RADIUS & CHARTS
            // ==========================================
            Card {
                title: "Typography / Radius / Charts"
                subtitle: "Radii derived from token spec; typography weights map to 500/600; 5 chart accents."
                width: parent.width

                Column {
                    spacing: 16
                    width: parent.width

                    // Radius row
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
                                width: 84
                                height: 56
                                radius: modelData[1]
                                color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.12)
                                border.color: ThemeTokens.accent
                                border.width: 1.5
                                Text {
                                    anchors.centerIn: parent
                                    text: parent.modelData[0]
                                    color: ThemeTokens.text
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
                            color: ThemeTokens.text
                            font.pixelSize: 14
                            font.weight: Font.Medium
                        }
                        Text {
                            text: "Semibold 600 — Tea Set ChaSet, cross-stack component library"
                            color: ThemeTokens.subduedText
                            font.pixelSize: 14
                            font.weight: Font.DemiBold
                        }
                    }

                    // Chart Bars
                    Row {
                        spacing: 8
                        height: 90
                        Repeater {
                            model: [1, 2, 3, 4, 5]
                            delegate: Rectangle {
                                required property int modelData
                                width: 44
                                height: 30 + modelData * 12
                                radius: 4
                                color: ThemeTokens.accent
                                opacity: 0.4 + modelData * 0.12
                                anchors.bottom: parent.bottom
                            }
                        }
                    }
                }
            }
        }
    }

    // ==========================================
    // EXPORT & COPY MODAL DIALOG (Qt Implementation)
    // ==========================================
    Rectangle {
        visible: win.exportModalOpen
        anchors.fill: parent
        z: 100
        color: Qt.rgba(0, 0, 0, 0.65)

        MouseArea {
            anchors.fill: parent
            onClicked: win.exportModalOpen = false
        }

        Rectangle {
            width: 640
            height: 480
            radius: win.customRadius
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1
            anchors.centerIn: parent

            MouseArea { anchors.fill: parent } // block click through

            Column {
                anchors.fill: parent
                anchors.margins: 18
                spacing: 14

                // Header
                Row {
                    width: parent.width
                    Text {
                        text: "Export & Copy Theme Configuration"
                        color: ThemeTokens.text
                        font.pixelSize: 16
                        font.weight: Font.Bold
                    }
                    Item { width: 10; height: 1 }
                    Text {
                        anchors.right: parent.right
                        text: "✕"
                        color: ThemeTokens.subduedText
                        font.pixelSize: 16
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: win.exportModalOpen = false
                        }
                    }
                }

                // Tabs
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
                            height: 28
                            radius: 4
                            color: win.exportTab === modelData[0] ? ThemeTokens.accent : ThemeTokens.panelRaised
                            Text {
                                anchors.centerIn: parent
                                text: parent.modelData[1]
                                color: win.exportTab === parent.modelData[0] ? ThemeTokens.onAccent : ThemeTokens.text
                                font.pixelSize: 11
                                font.weight: Font.Medium
                            }
                            MouseArea {
                                anchors.fill: parent
                                cursorShape: Qt.PointingHandCursor
                                onClicked: win.exportTab = parent.modelData[0]
                            }
                        }
                    }
                }

                // Code Area
                Rectangle {
                    width: parent.width
                    height: 280
                    color: ThemeTokens.background
                    border.color: ThemeTokens.border
                    radius: 4

                    ScrollView {
                        anchors.fill: parent
                        anchors.margins: 10
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
                                    return ":root {\n  --radius: " + win.customRadius + "px;\n  --primary: " + (ThemeTokens.dark ? "#30a0ff" : "#1d7ae0") + ";\n  --background: " + (ThemeTokens.dark ? "#0a0c14" : "#f4f6fa") + ";\n}"
                                }
                                if (win.exportTab === "tailwind") {
                                    return "@theme inline {\n  --color-primary: var(--primary);\n  --radius: " + win.customRadius + "px;\n}"
                                }
                                return "{\n  \"theme\": {\n    \"mode\": \"" + (ThemeTokens.dark ? "dark" : "light") + "\",\n    \"radius\": " + win.customRadius + "\n  }\n}"
                            }
                            color: ThemeTokens.text
                            font.family: "Consolas, monospace"
                            font.pixelSize: 11
                            background: null
                        }
                    }
                }

                // Footer Actions
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
