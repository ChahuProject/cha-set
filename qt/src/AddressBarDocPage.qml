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
                qtCode: "ChaSetAddressBar {\n    width: parent.width\n    path: currentPath\n    canGoBack: canGoBack\n    canGoForward: canGoForward\n    onNavigateRequested: (path) => navigateTo(path)\n    onBackRequested: handleBack()\n    onForwardRequested: handleForward()\n    onRefreshRequested: handleRefresh()\n}"

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

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetAddressBar {
    width: parent.width
    path: "/home/project"
    canGoBack: false
    canGoForward: false
    onNavigateRequested: (path) => console.log(path)
}`
        reactCode: `import { AddressBar } from '@chahu/cha-set';

<AddressBar
  path="/home/project"
  canGoBack={false}
  canGoForward={false}
  onNavigate={(path) => console.log(path)}
/>`
    }

    // Animations Section
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
                width: parent.width
                wrap: true
                text: "Breadcrumb segment hover highlights transition over ThemeTokens.motionQuick (100ms) with ThemeTokens.easeStandard curve. Suggestions popover renders with an entry scale and fade animation over 120ms."
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
            }
        }
    }

    ComponentReference {
        name: "AddressBar"
        componentId: "address-bar"
        propsModel: [
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
