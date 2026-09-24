// AddressBarDocPage.qml — Living Documentation for ChaSetAddressBar
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Layouts 6.10
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Address Bar"
    description: "Explorer and browser-style navigation bar with interactive breadcrumbs and inline path editing."

    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property string currentPath: "C:/Users/Development/Projects/cha-set"
    property var history: [
        "C:/",
        "C:/Users",
        "C:/Users/Development",
        "C:/Users/Development/Projects",
        "C:/Users/Development/Projects/cha-set"
    ]
    property int historyIndex: 4
    property int refreshCount: 0

    readonly property bool canGoBack: historyIndex > 0
    readonly property bool canGoForward: historyIndex < history.length - 1

    function navigateTo(newPath) {
        var trimmed = String(newPath).replace(/\\/g, "/");
        var newHistory = [];
        for (var i = 0; i <= historyIndex; i++) {
            newHistory.push(history[i]);
        }
        newHistory.push(trimmed);
        history = newHistory;
        historyIndex = newHistory.length - 1;
        currentPath = trimmed;
    }

    function handleBack() {
        if (canGoBack) {
            var nextIdx = historyIndex - 1;
            historyIndex = nextIdx;
            currentPath = history[nextIdx];
        }
    }

    function handleForward() {
        if (canGoForward) {
            var nextIdx = historyIndex + 1;
            historyIndex = nextIdx;
            currentPath = history[nextIdx];
        }
    }

    function handleRefresh() {
        refreshCount = refreshCount + 1;
    }

    // 1. Overview Section
    Item {
        id: overviewSection
        width: parent ? parent.width : 0
        height: overviewCol.implicitHeight

        Column {
            id: overviewCol
            width: parent.width
            spacing: 16

            DocText {
                text: "Interactive Overview"
                font.pixelSize: Typography.sizeTitleSm
                font.bold: true
                color: ThemeTokens.text
            }

            ComponentPreview {
                id: heroPreview
                width: parent.width
                title: "Address Bar Sandbox"
                reactCode: "<AddressBar\n  path={currentPath}\n  canGoBack={canGoBack}\n  canGoForward={canGoForward}\n  onNavigate={(newPath) => setCurrentPath(newPath)}\n  onBack={handleBack}\n  onForward={handleForward}\n  onRefresh={() => console.log('Refreshed')}\n  suggestions={[\n    'C:/Users/Development/cha-set',\n    'C:/Windows/System32',\n    'D:/Projects/qt-demo',\n    '/var/log/nginx',\n  ]}\n/>"

                controlsData: [
                    Row {
                        spacing: 8
                        DocText {
                            text: "Quick Locations:"
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeCaption
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        ChaSetButton {
                            size: "sm"
                            variant: "outline"
                            text: "Project Root"
                            onClicked: root.navigateTo("C:/Users/Development/cha-set")
                        }
                        ChaSetButton {
                            size: "sm"
                            variant: "outline"
                            text: "System32"
                            onClicked: root.navigateTo("C:/Windows/System32")
                        }
                        ChaSetButton {
                            size: "sm"
                            variant: "outline"
                            text: "POSIX /var/log"
                            onClicked: root.navigateTo("/var/log/nginx")
                        }
                    }
                ]

                Rectangle {
                    width: parent.width
                    height: ThemeTokens.dp(180)
                    color: ThemeTokens.panel
                    radius: ThemeTokens.dp(8)
                    border.color: ThemeTokens.border
                    border.width: 1

                    Column {
                        anchors.centerIn: parent
                        width: parent.width - ThemeTokens.dp(48)
                        spacing: ThemeTokens.dp(16)

                        ChaSetAddressBar {
                            id: bar
                            width: parent.width
                            path: root.currentPath
                            canGoBack: root.canGoBack
                            canGoForward: root.canGoForward
                            onNavigateRequested: function(p) {
                                root.navigateTo(p);
                            }
                            onBackRequested: root.handleBack()
                            onForwardRequested: root.handleForward()
                            onRefreshRequested: root.handleRefresh()
                        }

                        RowLayout {
                            width: parent.width

                            Text {
                                text: qsTr("Active Path: %1").arg(root.currentPath)
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeCaption
                                font.family: Typography.familyMono
                                Layout.fillWidth: true
                                elide: Text.ElideMiddle
                            }

                            Text {
                                text: qsTr("Refreshes: %1").arg(root.refreshCount)
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeCaption
                            }
                        }
                    }
                }
            }
        }
    }

    // 2. Installation Section
    Item {
        id: installationSection
        width: parent ? parent.width : 0
        height: instCol.implicitHeight

        Column {
            id: instCol
            width: parent.width
            spacing: 12

            DocText {
                text: "Installation"
                font.pixelSize: Typography.sizeTitleSm
                font.bold: true
                color: ThemeTokens.text
            }

            ChaSetCodeBlock {
                width: parent.width
                language: "bash"
                code: "pnpm add @chahu/cha-set"
            }
        }
    }

    // 3. Animations Section
    Item {
        id: animationsSection
        width: parent ? parent.width : 0
        height: animCol.implicitHeight

        Column {
            id: animCol
            width: parent.width
            spacing: 8

            DocText {
                text: "Animations"
                font.pixelSize: Typography.sizeTitleSm
                font.bold: true
                color: ThemeTokens.text
            }

            DocText {
                text: "Breadcrumb segment hover highlights transition over ThemeTokens.motionQuick (100ms) with ThemeTokens.easeStandard curve. Suggestions popover renders with an entry scale and fade animation over 120ms."
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
            }
        }
    }

    // 4. Keyboard Section
    Item {
        id: keyboardSection
        width: parent ? parent.width : 0
        height: kbCol.implicitHeight

        Column {
            id: kbCol
            width: parent.width
            spacing: 12

            DocText {
                text: "Keyboard Navigation"
                font.pixelSize: Typography.sizeTitleSm
                font.bold: true
                color: ThemeTokens.text
            }

            DocText {
                text: "Keyboard shortcuts and button activation patterns."
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
            }

            KeyboardShortcutsTable {
                width: parent.width
                componentId: "address-bar"
            }
        }
    }

    // 5. Props Section
    Item {
        id: propsSection
        width: parent ? parent.width : 0
        height: propsCol.implicitHeight

        Column {
            id: propsCol
            width: parent.width
            spacing: 12

            DocText {
                text: "Props Reference"
                font.pixelSize: Typography.sizeTitleSm
                font.bold: true
                color: ThemeTokens.text
            }

            PropsTable {
                width: parent.width
                props: [
                    { name: "path", type: "string", defaultVal: "''", description: "Current path string rendered in breadcrumb and edit modes." },
                    { name: "canGoBack", type: "bool", defaultVal: "false", description: "Enables the backward history navigation button." },
                    { name: "canGoForward", type: "bool", defaultVal: "false", description: "Enables the forward history navigation button." },
                    { name: "showNavButtons", type: "bool", defaultVal: "true", description: "Whether to show back, forward, up, and refresh navigation buttons." },
                    { name: "showRefresh", type: "bool", defaultVal: "true", description: "Whether to show the refresh button." },
                    { name: "suggestions", type: "var", defaultVal: "[]", description: "List of auto-complete or history path strings in the dropdown popover." },
                    { name: "disabled", type: "bool", defaultVal: "false", description: "Disables all interactions and input editing." }
                ]
            }
        }
    }
}
