// TabsDocPage.qml — Comprehensive Tabs Documentation matching React 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Tabs"
    description: ChaSetI18n.tr("components.tabs.description", "A set of layered content sections known as tab panels, displayed one at a time.")
    tocItems: [
        { id: "overview", title: ChaSetI18n.tr("showcase.interactiveOverview", "Interactive Overview") },
        { id: "keyboard", title: ChaSetI18n.tr("showcase.keyboardNavigation", "Keyboard Navigation") },
        { id: "installation", title: ChaSetI18n.tr("showcase.installation", "Installation") },
        { id: "anatomy", title: ChaSetI18n.tr("showcase.anatomy", "Anatomy") },
        { id: "examples", title: ChaSetI18n.tr("showcase.examplesVariants", "Examples & Variants") },
        { id: "props", title: ChaSetI18n.tr("showcase.propsReference", "Props Reference") }
    ]

    property string demoTab: "account"
    property string demoOrientation: "horizontal"
    property string demoVariant: "default"
    property string demoSize: "default"
    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    // 1. Interactive Preview Hero
    Column {
        property string sectionId: "overview"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("showcase.interactiveOverview", "Interactive Overview")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.tabs.overviewDesc", "Test interactive tab switching, pill vs line underline styles, size scaling, and keyboard arrow navigation.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.tabs.sandboxTitle", "Tabs Sandbox")
        reactCode: `<Tabs defaultValue="account" variant="${root.demoVariant}" size="${root.demoSize}" orientation="${root.demoOrientation}">
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
    variant: "${root.demoVariant}"
    size: "${root.demoSize}"
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
            width: Math.min(parent.width - ThemeTokens.dp(40), ThemeTokens.dp(440))
            implicitHeight: sandboxTabsCol.implicitHeight
            customRadius: root.customRadius

            Column {
                id: sandboxTabsCol
                x: ThemeTokens.dp(20)
                topPadding: ThemeTokens.dp(20)
                bottomPadding: ThemeTokens.dp(20)
                width: parent.width - ThemeTokens.dp(40)
                spacing: ThemeTokens.dp(16)

                ChaSetTabs {
                    id: heroTabs
                    width: parent.width
                    currentValue: root.demoTab
                    variant: root.demoVariant
                    size: root.demoSize
                    orientation: root.demoOrientation
                    onCurrentValueChanged: root.demoTab = currentValue

                    ChaSetTabsList {
                        orientation: root.demoOrientation
                        variant: root.demoVariant
                        size: root.demoSize
                        ChaSetTabsTrigger { value: "account"; text: ChaSetI18n.tr("surfaces.tabs.account", "Account") }
                        ChaSetTabsTrigger { value: "password"; text: ChaSetI18n.tr("surfaces.tabs.password", "Password") }
                        ChaSetTabsTrigger { value: "settings"; text: ChaSetI18n.tr("surfaces.tabs.settings", "Settings") }
                    }
                }

                Rectangle {
                    width: parent.width
                    implicitHeight: sandboxInnerCol.implicitHeight + ThemeTokens.dp(24)
                    height: Math.max(ThemeTokens.dp(80), implicitHeight)
                    radius: ThemeTokens.dp(6)
                    color: Qt.rgba(root.cAccentBg.r, root.cAccentBg.g, root.cAccentBg.b, 0.5)
                    border.color: root.cBorder
                    border.width: 0.5

                    Column {
                        id: sandboxInnerCol
                        anchors.centerIn: parent
                        width: parent.width - ThemeTokens.dp(24)
                        spacing: ThemeTokens.dp(4)

                        DocText {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: root.demoTab === "account" ? ChaSetI18n.tr("surfaces.tabs.accountTitle", "Account Information") : (root.demoTab === "password" ? ChaSetI18n.tr("surfaces.tabs.passwordTitle", "Security Credentials") : ChaSetI18n.tr("surfaces.tabs.settingsTitle", "App Settings"))
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightBold
                            color: root.cFg
                        }
                        DocText {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: root.demoTab === "account" ? ChaSetI18n.tr("surfaces.tabs.accountDesc", "Make changes to your account here. Click save when you're done.") : (root.demoTab === "password" ? ChaSetI18n.tr("surfaces.tabs.passwordDesc", "Change your password here. After saving, you'll be logged out.") : ChaSetI18n.tr("surfaces.tabs.settingsDesc", "Manage your notification frequency and display preferences."))
                            font.pixelSize: Typography.sizeCaption
                            color: root.cMutedFg
                            wrap: true
                        }
                    }
                }
            }
        }

        controlsData: [
            Flow {
                width: parent.width
                spacing: 16

                Row {
                    spacing: 8
                    DocText { text: ChaSetI18n.tr("showcase.variant", "Variant:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetSegmentedControl {
                        anchors.verticalCenter: parent.verticalCenter
                        size: "sm"
                        value: root.demoVariant
                        onValueSelected: function(v) { root.demoVariant = String(v); }
                        options: [
                            { label: ChaSetI18n.tr("surfaces.tabs.pill", "Pill (default)"), value: "default" },
                            { label: ChaSetI18n.tr("surfaces.tabs.line", "Line"), value: "line" }
                        ]
                    }
                }

                Row {
                    spacing: 8
                    DocText { text: ChaSetI18n.tr("showcase.size", "Size:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetSegmentedControl {
                        anchors.verticalCenter: parent.verticalCenter
                        size: "sm"
                        value: root.demoSize
                        onValueSelected: function(v) { root.demoSize = String(v); }
                        options: [
                            { label: ChaSetI18n.tr("common.default", "Default"), value: "default" },
                            { label: ChaSetI18n.tr("surfaces.tabs.small", "Small (sm)"), value: "sm" }
                        ]
                    }
                }

                Row {
                    spacing: 8
                    DocText { text: ChaSetI18n.tr("surfaces.tabs.orientation", "Orientation:"); color: root.cMutedFg; font.pixelSize: Typography.sizeSmall; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetSegmentedControl {
                        anchors.verticalCenter: parent.verticalCenter
                        size: "sm"
                        value: root.demoOrientation
                        onValueSelected: function(v) { root.demoOrientation = String(v); }
                        options: [
                            { label: ChaSetI18n.tr("surfaces.tabs.horizontal", "Horizontal"), value: "horizontal" },
                            { label: ChaSetI18n.tr("surfaces.tabs.vertical", "Vertical"), value: "vertical" }
                        ]
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

            DocText { text: ChaSetI18n.tr("showcase.installation", "Installation"); font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }
            ChaSetCodeBlock {
                width: parent.width
                language: "bash"
                code: "pnpm add @chahu/cha-set"
            }
        }
    }

    // 3. Anatomy
    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet\n\nChaSetTabs {\n    currentValue: "overview"\n    ChaSetTabsList {\n        ChaSetTabsTrigger { value: "overview"; text: "Overview" }\n        ChaSetTabsTrigger { value: "analytics"; text: "Analytics" }\n        ChaSetTabsTrigger { value: "reports"; text: "Reports" }\n    }\n}`
        reactCode: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@chahu/cha-set';\n\n<Tabs defaultValue="overview">\n  <TabsList>\n    <TabsTrigger value="overview">Overview</TabsTrigger>\n    <TabsTrigger value="analytics">Analytics</TabsTrigger>\n    <TabsTrigger value="reports">Reports</TabsTrigger>\n  </TabsList>\n  <TabsContent value="overview">Overview pane</TabsContent>\n  <TabsContent value="analytics">Analytics pane</TabsContent>\n  <TabsContent value="reports">Reports pane</TabsContent>\n</Tabs>`
    }

    // 4. Examples & Variants
    Rectangle {
        width: parent.width
        implicitHeight: examplesCol.implicitHeight + 20
        color: "transparent"

        Column {
            id: examplesCol
            width: parent.width
            spacing: 12

            DocText { text: ChaSetI18n.tr("showcase.examplesVariants", "Examples & Variants"); font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }
            DocText { text: ChaSetI18n.tr("desktopComposite.tabs.examplesDesc", "Visual matrix of tab variants, sizes, badges, and disabled states."); font.pixelSize: Typography.sizeBody; color: root.cMutedFg }

            Grid {
                width: parent.width
                columns: 2
                spacing: ThemeTokens.dp(16)

                ChaSetCard {
                    width: (parent.width - ThemeTokens.dp(16)) / 2
                    customRadius: 8
                    Column {
                        width: parent.width
                        topPadding: ThemeTokens.dp(14)
                        bottomPadding: ThemeTokens.dp(14)
                        leftPadding: ThemeTokens.dp(14)
                        rightPadding: ThemeTokens.dp(14)
                        spacing: ThemeTokens.dp(8)
                        DocText { text: ChaSetI18n.tr("surfaces.tabs.lineVariantTitle", "Line Variant (Underline)"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                        DocText { text: ChaSetI18n.tr("surfaces.tabs.lineVariantDesc", "Full-width bottom accent border for navigation headers"); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                        ChaSetTabs {
                            currentValue: "all"
                            variant: "line"
                            ChaSetTabsList {
                                ChaSetTabsTrigger { value: "all"; text: ChaSetI18n.tr("surfaces.tabs.allItems", "All Items") }
                                ChaSetTabsTrigger { value: "pending"; text: ChaSetI18n.tr("surfaces.tabs.pending", "Pending") }
                                ChaSetTabsTrigger { value: "completed"; text: ChaSetI18n.tr("surfaces.tabs.completed", "Completed") }
                            }
                        }
                    }
                }

                ChaSetCard {
                    width: (parent.width - ThemeTokens.dp(16)) / 2
                    customRadius: 8
                    Column {
                        width: parent.width
                        topPadding: ThemeTokens.dp(14)
                        bottomPadding: ThemeTokens.dp(14)
                        leftPadding: ThemeTokens.dp(14)
                        rightPadding: ThemeTokens.dp(14)
                        spacing: ThemeTokens.dp(8)
                        DocText { text: ChaSetI18n.tr("surfaces.tabs.badgesCountsTitle", "With Badges & Counts"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                        DocText { text: ChaSetI18n.tr("surfaces.tabs.badgesCountsDesc", "Integrated status counters and notification count tags"); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                        ChaSetTabs {
                            currentValue: "inbox"
                            ChaSetTabsList {
                                ChaSetTabsTrigger { value: "inbox"; text: ChaSetI18n.tr("surfaces.tabs.inbox", "Inbox"); badge: "12" }
                                ChaSetTabsTrigger { value: "unread"; text: ChaSetI18n.tr("surfaces.tabs.unread", "Unread"); badge: "3" }
                                ChaSetTabsTrigger { value: "archived"; text: ChaSetI18n.tr("surfaces.tabs.archived", "Archived") }
                            }
                        }
                    }
                }

                ChaSetCard {
                    width: (parent.width - ThemeTokens.dp(16)) / 2
                    customRadius: 8
                    Column {
                        width: parent.width
                        topPadding: ThemeTokens.dp(14)
                        bottomPadding: ThemeTokens.dp(14)
                        leftPadding: ThemeTokens.dp(14)
                        rightPadding: ThemeTokens.dp(14)
                        spacing: ThemeTokens.dp(8)
                        DocText { text: ChaSetI18n.tr("surfaces.tabs.compactTitle", "Compact Size (sm)"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                        DocText { text: ChaSetI18n.tr("surfaces.tabs.compactDesc", "High-density tab triggers for compact headers and toolbars"); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                        ChaSetTabs {
                            currentValue: "code"
                            size: "sm"
                            ChaSetTabsList {
                                ChaSetTabsTrigger { value: "code"; text: ChaSetI18n.tr("surfaces.tabs.code", "Code") }
                                ChaSetTabsTrigger { value: "issues"; text: ChaSetI18n.tr("surfaces.tabs.issues", "Issues") }
                                ChaSetTabsTrigger { value: "pulls"; text: ChaSetI18n.tr("surfaces.tabs.pulls", "Pull Requests") }
                            }
                        }
                    }
                }

                ChaSetCard {
                    width: (parent.width - ThemeTokens.dp(16)) / 2
                    customRadius: 8
                    Column {
                        width: parent.width
                        topPadding: ThemeTokens.dp(14)
                        bottomPadding: ThemeTokens.dp(14)
                        leftPadding: ThemeTokens.dp(14)
                        rightPadding: ThemeTokens.dp(14)
                        spacing: ThemeTokens.dp(8)
                        DocText { text: ChaSetI18n.tr("surfaces.tabs.disabledTriggerTitle", "Disabled Trigger"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                        DocText { text: ChaSetI18n.tr("surfaces.tabs.disabledTriggerDesc", "Individual tab triggers blocked with 50% opacity"); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                        ChaSetTabs {
                            currentValue: "active"
                            ChaSetTabsList {
                                ChaSetTabsTrigger { value: "active"; text: ChaSetI18n.tr("surfaces.tabs.activeTab", "Active Tab") }
                                ChaSetTabsTrigger { value: "disabled"; text: ChaSetI18n.tr("surfaces.tabs.disabledTab", "Disabled Tab"); disabled: true }
                            }
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

            DocText { text: ChaSetI18n.tr("showcase.propsReference", "Props Reference"); font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold; color: root.cFg }

            PropsTable {
                width: parent.width
                propsModel: [
                    { name: "currentValue", type: "string", defaultValue: "''", desc: "The controlled value of the currently active tab." },
                    { name: "orientation", type: "'horizontal' | 'vertical'", defaultValue: "'horizontal'", desc: "Orientation layout for tab list and panels." },
                    { name: "variant", type: "'default' | 'line'", defaultValue: "'default'", desc: "Visual presentation style: pill container (default) or underline tab bar (line)." },
                    { name: "size", type: "'default' | 'sm'", defaultValue: "'default'", desc: "Size scale of the tabs triggers and container." },
                    { name: "value", type: "string", defaultValue: "''", desc: "On ChaSetTabsTrigger and Content: identifier matching currentValue." },
                    { name: "disabled", type: "bool", defaultValue: "false", desc: "When true on ChaSetTabsTrigger, prevents click and keyboard interaction." },
                    { name: "badge", type: "string", defaultValue: "''", desc: "Optional count badge or status tag rendered inside the trigger." },
                    { name: "iconSource", type: "string", defaultValue: "''", desc: "Optional leading icon source path rendered inside the trigger." }
                ]
            }
        }
    }
}
