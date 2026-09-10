// TabsDocPage.qml — Comprehensive Tabs Documentation matching React 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Tabs"
    description: "A set of layered content sections known as tab panels, displayed one at a time."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "installation", title: "Installation" },
        { id: "anatomy", title: "Anatomy" },
        { id: "disabled", title: "Disabled State" },
        { id: "props", title: "Props Reference" }
    ]

    property string demoTab: "account"
    property string demoOrientation: "horizontal"
    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    // 1. Interactive Preview Hero
    ComponentPreview {
        title: "Interactive Tabs Sandbox"
        reactCode: `<Tabs defaultValue="account" orientation="${root.demoOrientation}">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account pane</TabsContent>
  <TabsContent value="password">Password pane</TabsContent>
  <TabsContent value="settings">Settings pane</TabsContent>
</Tabs>`
        qtCode: `ChaSetTabs {
    currentValue: "${root.demoTab}"
    orientation: "${root.demoOrientation}"

    ChaSetTabsList {
        ChaSetTabsTrigger { value: "account"; text: "Account" }
        ChaSetTabsTrigger { value: "password"; text: "Password" }
        ChaSetTabsTrigger { value: "settings"; text: "Settings" }
    }

    ChaSetTabsContent {
        value: "account"
        Text { text: "Account Information" }
    }
    ChaSetTabsContent {
        value: "password"
        Text { text: "Security Credentials" }
    }
    ChaSetTabsContent {
        value: "settings"
        Text { text: "App Settings" }
    }
}`

        // Sandbox Stage
        ChaSetCard {
            anchors.centerIn: parent
            width: Math.min(parent.width - 40, 420)
            implicitHeight: sandboxTabsCol.implicitHeight
            customRadius: root.customRadius

            Column {
                id: sandboxTabsCol
                anchors.horizontalCenter: parent.horizontalCenter
                topPadding: 20
                bottomPadding: 20
                width: parent.width - 40
                spacing: 16

                ChaSetTabs {
                    id: heroTabs
                    width: parent.width
                    currentValue: root.demoTab
                    orientation: root.demoOrientation
                    onCurrentValueChanged: root.demoTab = currentValue

                    ChaSetTabsList {
                        orientation: root.demoOrientation
                        ChaSetTabsTrigger { value: "account"; text: "Account" }
                        ChaSetTabsTrigger { value: "password"; text: "Password" }
                        ChaSetTabsTrigger { value: "settings"; text: "Settings" }
                    }
                }

                Rectangle {
                    width: parent.width
                    height: 80
                    radius: 6
                    color: Qt.rgba(root.cAccentBg.r, root.cAccentBg.g, root.cAccentBg.b, 0.5)
                    border.color: root.cBorder
                    border.width: 0.5

                    Column {
                        anchors.centerIn: parent
                        spacing: 4

                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: root.demoTab === "account" ? "Account Information" : (root.demoTab === "password" ? "Security Credentials" : "App Settings")
                            font.pixelSize: 13
                            font.weight: Font.Bold
                            color: root.cFg
                        }
                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: root.demoTab === "account" ? "Make changes to your account here." : (root.demoTab === "password" ? "Change your password credentials." : "Manage your notification preferences.")
                            font.pixelSize: 11
                            color: root.cMutedFg
                        }
                    }
                }
            }
        }

        controlsData: [
            Row {
                spacing: 8
                Text { text: "Orientation:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                ChaSetTabs {
                    anchors.verticalCenter: parent.verticalCenter
                    currentValue: root.demoOrientation
                    onCurrentValueChanged: root.demoOrientation = currentValue
                    ChaSetTabsList {
                        ChaSetTabsTrigger { value: "horizontal"; text: "Horizontal" }
                        ChaSetTabsTrigger { value: "vertical"; text: "Vertical" }
                    }
                }
            }
        ]
    }

    KeyboardShortcutsTable {
        componentId: "tabs"
    }

    // 2. Installation
    Rectangle {
        width: parent.width
        implicitHeight: instCol.implicitHeight + 20
        color: "transparent"

        Column {
            id: instCol
            width: parent.width
            spacing: 8

            Text { text: "Installation"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }
            Text { text: "Link the ChaSet library in CMakeLists.txt:"; font.pixelSize: 13; color: root.cMutedFg }
            CodeBlock {
                width: parent.width
                language: "cmake"
                code: "target_link_libraries(YourApp PRIVATE ChaSet)"
            }
        }
    }

    // 3. Anatomy
    Rectangle {
        width: parent.width
        implicitHeight: anatomyCol.implicitHeight + 20
        color: "transparent"

        Column {
            id: anatomyCol
            width: parent.width
            spacing: 8

            Text { text: "Anatomy"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }
            Text { text: "Tabs components follow the shadcn compound structure:"; font.pixelSize: 13; color: root.cMutedFg }
            CodeBlock {
                width: parent.width
                language: "qml"
                code: `ChaSetTabs {
    currentValue: "overview"

    ChaSetTabsList {
        ChaSetTabsTrigger { value: "overview"; text: "Overview" }
        ChaSetTabsTrigger { value: "analytics"; text: "Analytics" }
    }

    ChaSetTabsContent { value: "overview"; Text { text: "Overview Pane" } }
    ChaSetTabsContent { value: "analytics"; Text { text: "Analytics Pane" } }
}`
            }
        }
    }

    // 4. Disabled State
    Rectangle {
        width: parent.width
        implicitHeight: disCol.implicitHeight + 20
        color: "transparent"

        Column {
            id: disCol
            width: parent.width
            spacing: 8

            Text { text: "Disabled State"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }
            Text { text: "Individual tab triggers can be disabled to prevent user interaction:"; font.pixelSize: 13; color: root.cMutedFg }

            ChaSetCard {
                width: parent.width
                height: 70
                customRadius: root.customRadius

                Item {
                    width: parent.width
                    height: 70

                    ChaSetTabs {
                        anchors.centerIn: parent
                        currentValue: "active"

                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "active"; text: "Active Tab" }
                            ChaSetTabsTrigger { value: "disabled"; text: "Disabled Tab"; disabled: true }
                        }
                    }
                }
            }
        }
    }

    // 5. Props Reference
    Rectangle {
        width: parent.width
        implicitHeight: propsCol.implicitHeight + 20
        color: "transparent"

        Column {
            id: propsCol
            width: parent.width
            spacing: 8

            Text { text: "Props Reference"; font.pixelSize: 18; font.weight: Font.Bold; color: root.cFg }

            PropsTable {
                width: parent.width
                propsModel: [
                    { name: "currentValue", type: "string", defaultValue: "''", desc: "The controlled value of the currently active tab." },
                    { name: "orientation", type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", desc: "Orientation layout for tab list and panels." },
                    { name: "value", type: "string", defaultValue: "''", desc: "On ChaSetTabsTrigger and Content: identifier matching currentValue." },
                    { name: "disabled", type: "bool", defaultValue: "false", desc: "When true on ChaSetTabsTrigger, prevents click and keyboard interaction." }
                ]
            }
        }
    }
}
