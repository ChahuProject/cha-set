// ChaSet Qt Studio — Cross-Stack Theme & Component Workbench
// 100% Pixel-Perfect and Behavioral Parity with React Studio (packages/react/examples/basic).
import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

ApplicationWindow {
    id: win
    width: (typeof harnessMode !== "undefined" && harnessMode === "button") ? 220 : 1150
    height: (typeof harnessMode !== "undefined" && harnessMode === "button") ? 80 : 850
    visible: true
    title: "ChaSet Studio"
    color: win.cBg

    // ---- Reactive Theme State ----
    property string activePage: "intro"   // "intro" | "tokens" | "theme-tuner" | "button" | "scroll-area"
    property bool showTuner: activePage === "theme-tuner"
    property string activeAccent: ""
    property int customRadius: 8

    property bool searchModalOpen: false
    property bool exportModalOpen: false
    property string exportTab: "qt"

    // Custom Color Overrides (Live)
    property string overridePrimary: ""
    property string overridePrimaryFg: ""
    property string overrideSecondary: ""
    property string overrideDestructive: ""
    property string overrideBackground: ""
    property string overrideCard: ""

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

    // Dynamic Colors based on theme
    readonly property color cBg: ThemeTokens.dark ? (overrideBackground !== "" ? overrideBackground : "#020817") : (overrideBackground !== "" ? overrideBackground : "#ffffff")
    readonly property color cCard: ThemeTokens.dark ? (overrideCard !== "" ? overrideCard : "#0f172a") : (overrideCard !== "" ? overrideCard : "#ffffff")
    readonly property color cBorder: ThemeTokens.dark ? "#1e293b" : "#e2e8f0"
    readonly property color cFg: ThemeTokens.dark ? "#f8fafc" : "#020817"
    readonly property color cMutedFg: ThemeTokens.dark ? "#94a3b8" : "#64748b"
    readonly property color cAccentBg: ThemeTokens.dark ? "#1e293b" : "#f1f5f9"
    readonly property color cPrimary: overridePrimary !== "" ? overridePrimary : (ThemeTokens.dark ? "#30a0ff" : "#1d7ae0")
    readonly property color cPrimaryFg: overridePrimaryFg !== "" ? overridePrimaryFg : "#ffffff"
    readonly property color cDestructive: overrideDestructive !== "" ? overrideDestructive : "#ef4444"

    Component.onCompleted: {
        if (typeof startupLight !== "undefined" && startupLight === true) ThemeTokens.dark = false
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

    Timer {
        id: testScrollTimer
        interval: 150
        running: typeof testScrollMode !== "undefined" && testScrollMode === true
        onTriggered: {
            console.log("[qt-test] Starting Scroll & Viewport Behavioral Verification...");
            var maxScrollY = Math.max(0, contentScroll.flickableItem.contentHeight - contentScroll.height);
            console.log("[qt-test] contentHeight=" + contentScroll.flickableItem.contentHeight + ", height=" + contentScroll.height + ", maxScrollY=" + maxScrollY);
            if (maxScrollY <= 0) {
                console.log("[qt-test] FAIL: Viewport contentHeight is not overflowing height");
                Qt.exit(1);
                return;
            }
            contentScroll.flickableItem.contentY = 200;
            var afterDirectY = contentScroll.flickableItem.contentY;
            contentScroll.flickableItem.contentY = 0;
            var afterResetY = contentScroll.flickableItem.contentY;

            console.log("[qt-test] afterDirectY=" + afterDirectY + ", afterResetY=" + afterResetY);
            if (afterDirectY === 200 && afterResetY === 0) {
                console.log("[qt-test] OK — All scroll viewport interactions verified successfully!");
                Qt.exit(0);
            } else {
                console.log("[qt-test] FAIL — Scroll positions did not update correctly");
                Qt.exit(1);
            }
        }
    }

    // Global Search Shortcut (Ctrl+K / Cmd+K)
    Shortcut {
        sequence: "Ctrl+K"
        onActivated: win.searchModalOpen = true
    }

    Rectangle {
        id: rootCanvas
        objectName: "rootCanvas"
        anchors.fill: parent
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
            // 1. TOP NAVBAR (Sticky, 56px height, 1px border bottom)
            // ==============================================================
            Rectangle {
                id: topbar
                width: parent.width
                height: 56
                z: 50
                color: win.cBg
                border.color: win.cBorder
                border.width: 1

                Row {
                    anchors.left: parent.left
                    anchors.leftMargin: 20
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: 10

                    Text {
                        text: "🍵"
                        font.pixelSize: 20
                        anchors.verticalCenter: parent.verticalCenter
                    }

                    Text {
                        text: "ChaSet"
                        color: win.cFg
                        font.pixelSize: 16
                        font.weight: Font.Bold
                        anchors.verticalCenter: parent.verticalCenter
                    }

                    Rectangle {
                        width: 48
                        height: 20
                        radius: 4
                        color: win.cAccentBg
                        border.color: win.cBorder
                        anchors.verticalCenter: parent.verticalCenter
                        Text {
                            anchors.centerIn: parent
                            text: "v0.1.0"
                            color: win.cMutedFg
                            font.pixelSize: 10
                            font.family: "Consolas, monospace"
                            font.weight: Font.DemiBold
                        }
                    }
                }

                // Center Search Bar Trigger
                Rectangle {
                    width: Math.min(parent.width - 500, 320)
                    height: 32
                    radius: 6
                    color: win.cAccentBg
                    border.color: win.cBorder
                    anchors.centerIn: parent

                    Row {
                        anchors.fill: parent
                        anchors.leftMargin: 10
                        anchors.rightMargin: 8
                        spacing: 8

                        Text { text: "🔍"; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                        Text { text: "Search components & docs..."; color: win.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                        Item { width: parent.width - 240; height: 1 }
                        Rectangle {
                            width: 32; height: 18; radius: 3; color: win.cCard; border.color: win.cBorder
                            anchors.verticalCenter: parent.verticalCenter
                            Text { anchors.centerIn: parent; text: "⌘K"; color: win.cMutedFg; font.pixelSize: 10; font.family: "Consolas" }
                        }
                    }

                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: win.searchModalOpen = true
                    }
                }

                // Right Actions
                Row {
                    anchors.right: parent.right
                    anchors.rightMargin: 20
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: 8

                    // Style Tuner Button
                    ChaSetButton {
                        variant: win.activePage === "theme-tuner" ? "primary" : "secondary"
                        size: "sm"
                        text: "🎨 Studio Tuner"
                        onClicked: win.activePage = "theme-tuner"
                    }

                    // Export Button
                    ChaSetButton {
                        variant: "secondary"
                        size: "sm"
                        text: "📋 Export"
                        onClicked: win.exportModalOpen = true
                    }

                    Rectangle { width: 1; height: 18; color: win.cBorder; anchors.verticalCenter: parent.verticalCenter }

                    // Dark/Light Mode Toggle Button
                    Rectangle {
                        width: 32
                        height: 32
                        radius: 6
                        color: win.cCard
                        border.color: win.cBorder
                        border.width: 1

                        Text {
                            anchors.centerIn: parent
                            text: ThemeTokens.dark ? "🌙" : "☀️"
                            font.pixelSize: 14
                        }
                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: ThemeTokens.dark = !ThemeTokens.dark
                        }
                    }
                }
            }

            // ==============================================================
            // 2. MAIN BODY (Sidebar + Router Content)
            // ==============================================================
            Item {
                anchors.top: topbar.bottom
                anchors.bottom: parent.bottom
                anchors.left: parent.left
                anchors.right: parent.right

                // Left Navigation Sidebar (240px width)
                Rectangle {
                    id: sidebar
                    width: 240
                    anchors.left: parent.left
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    color: win.cBg
                    border.color: win.cBorder
                    border.width: 1

                    Column {
                        anchors.fill: parent
                        anchors.margins: 16
                        spacing: 20

                        // Category 1: GET STARTED
                        Column {
                            width: parent.width
                            spacing: 4

                            Text {
                                text: "GET STARTED"
                                color: win.cMutedFg
                                font.pixelSize: 11
                                font.weight: Font.Bold
                                font.family: "Segoe UI, sans-serif"
                            }

                            Item { width: 1; height: 4 }

                            Repeater {
                                model: [
                                    ["Introduction", "intro", ""],
                                    ["Theme & Tokens", "tokens", ""],
                                    ["Theme Studio", "theme-tuner", "Live"]
                                ]
                                delegate: Rectangle {
                                    required property var modelData
                                    width: parent.width
                                    height: 32
                                    radius: 6
                                    color: win.activePage === modelData[1] ? win.cAccentBg : "transparent"

                                    Row {
                                        anchors.fill: parent
                                        anchors.leftMargin: 10
                                        anchors.rightMargin: 10
                                        spacing: 8

                                        Text {
                                            anchors.verticalCenter: parent.verticalCenter
                                            text: parent.parent.modelData[0]
                                            color: win.activePage === parent.parent.modelData[1] ? win.cFg : win.cMutedFg
                                            font.pixelSize: 13
                                            font.weight: win.activePage === parent.parent.modelData[1] ? Font.DemiBold : Font.Normal
                                        }

                                        Item { width: 10; height: 1 }

                                        Rectangle {
                                            visible: parent.parent.modelData[2] !== ""
                                            width: 32; height: 16; radius: 8
                                            color: Qt.rgba(win.cPrimary.r, win.cPrimary.g, win.cPrimary.b, 0.15)
                                            anchors.verticalCenter: parent.verticalCenter
                                            Text { anchors.centerIn: parent; text: parent.parent.parent.modelData[2]; color: win.cPrimary; font.pixelSize: 9; font.weight: Font.Bold }
                                        }
                                    }

                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: win.activePage = parent.modelData[1]
                                    }
                                }
                            }
                        }

                        // Category 2: COMPONENTS
                        Column {
                            width: parent.width
                            spacing: 4

                            Text {
                                text: "COMPONENTS"
                                color: win.cMutedFg
                                font.pixelSize: 11
                                font.weight: Font.Bold
                                font.family: "Segoe UI, sans-serif"
                            }

                            Item { width: 1; height: 4 }

                            Repeater {
                                model: [
                                    ["Button", "button", ""],
                                    ["Scroll Area", "scroll-area", "New"]
                                ]
                                delegate: Rectangle {
                                    required property var modelData
                                    width: parent.width
                                    height: 32
                                    radius: 6
                                    color: win.activePage === modelData[1] ? win.cAccentBg : "transparent"

                                    Row {
                                        anchors.fill: parent
                                        anchors.leftMargin: 10
                                        anchors.rightMargin: 10
                                        spacing: 8

                                        Text {
                                            anchors.verticalCenter: parent.verticalCenter
                                            text: parent.parent.modelData[0]
                                            color: win.activePage === parent.parent.modelData[1] ? win.cFg : win.cMutedFg
                                            font.pixelSize: 13
                                            font.weight: win.activePage === parent.parent.modelData[1] ? Font.DemiBold : Font.Normal
                                        }

                                        Item { width: 10; height: 1 }

                                        Rectangle {
                                            visible: parent.parent.modelData[2] !== ""
                                            width: 34; height: 16; radius: 8
                                            color: Qt.rgba(win.cPrimary.r, win.cPrimary.g, win.cPrimary.b, 0.15)
                                            anchors.verticalCenter: parent.verticalCenter
                                            Text { anchors.centerIn: parent; text: parent.parent.parent.modelData[2]; color: win.cPrimary; font.pixelSize: 9; font.weight: Font.Bold }
                                        }
                                    }

                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: win.activePage = parent.modelData[1]
                                    }
                                }
                            }
                        }
                    }
                }

                // Center Main Content Area
                ChaSetScrollView {
                    id: contentScroll
                    anchors.left: sidebar.right
                    anchors.leftMargin: 32
                    anchors.right: parent.right
                    anchors.rightMargin: 32
                    anchors.top: parent.top
                    anchors.topMargin: 20
                    anchors.bottom: parent.bottom
                    contentWidth: pageContainer.width
                    contentHeight: pageContainer.implicitHeight + 40
                    clip: true

                    Item {
                        id: pageContainer
                        width: Math.min(contentScroll.width - 32, 860)
                        implicitHeight: {
                            if (win.activePage === "intro") return introPage.implicitHeight
                            if (win.activePage === "tokens") return tokensPage.implicitHeight
                            if (win.activePage === "theme-tuner") return tunerPage.implicitHeight
                            if (win.activePage === "button") return buttonPage.implicitHeight
                            if (win.activePage === "scroll-area") return scrollAreaPage.implicitHeight
                            return 800
                        }

                        // Page 1: Introduction
                        IntroductionPage {
                            id: introPage
                            visible: win.activePage === "intro"
                            width: parent.width
                            customRadius: win.customRadius
                            cFg: win.cFg
                            cMutedFg: win.cMutedFg
                            cCard: win.cCard
                            cBorder: win.cBorder
                            cPrimary: win.cPrimary
                            cAccentBg: win.cAccentBg
                            onOpenPage: function(pageId) { win.activePage = pageId }
                        }

                        // Page 2: Tokens & Theme
                        TokensPage {
                            id: tokensPage
                            visible: win.activePage === "tokens"
                            width: parent.width
                            customRadius: win.customRadius
                            cFg: win.cFg
                            cMutedFg: win.cMutedFg
                            cCard: win.cCard
                            cBorder: win.cBorder
                            cPrimary: win.cPrimary
                            cAccentBg: win.cAccentBg
                            onLogCopied: function(token) { win.pushLog("Copied: " + token) }
                        }

                        // Page 3: Theme Studio
                        ThemeTunerPage {
                            id: tunerPage
                            visible: win.activePage === "theme-tuner"
                            width: parent.width
                            customRadius: win.customRadius
                            cFg: win.cFg
                            cMutedFg: win.cMutedFg
                            cCard: win.cCard
                            cBorder: win.cBorder
                            cPrimary: win.cPrimary
                            cAccentBg: win.cAccentBg
                            activeAccent: win.activeAccent
                            onRequestExport: win.exportModalOpen = true
                            onLogAction: function(msg) { win.pushLog(msg) }
                        }

                        // Page 4: Button Doc Page
                        ButtonDocPage {
                            id: buttonPage
                            visible: win.activePage === "button"
                            width: parent.width
                            customRadius: win.customRadius
                            cFg: win.cFg
                            cMutedFg: win.cMutedFg
                            cCard: win.cCard
                            cBorder: win.cBorder
                            cPrimary: win.cPrimary
                            cAccentBg: win.cAccentBg
                            onLogAction: function(msg) { win.pushLog(msg) }
                        }

                        // Page 5: Scroll Area Doc Page
                        ScrollAreaDocPage {
                            id: scrollAreaPage
                            visible: win.activePage === "scroll-area"
                            width: parent.width
                            customRadius: win.customRadius
                            cFg: win.cFg
                            cMutedFg: win.cMutedFg
                            cCard: win.cCard
                            cBorder: win.cBorder
                            cPrimary: win.cPrimary
                            cAccentBg: win.cAccentBg
                            onLogAction: function(msg) { win.pushLog(msg) }
                        }
                    }
                }
            }

            // Command Search Modal (Ctrl+K)
            CommandSearchModal {
                visible: win.searchModalOpen
                onSelectPage: function(pageId) { win.activePage = pageId }
                onClose: win.searchModalOpen = false
            }

            // Export Config Modal
            ExportModal {
                visible: win.exportModalOpen
                customRadius: win.customRadius
                exportTab: win.exportTab
                onClose: win.exportModalOpen = false
            }
        }
    }
}
