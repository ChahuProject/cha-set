// BreadcrumbDocPage.qml — Living documentation for ChaSetBreadcrumb
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Breadcrumb"
    description: ChaSetI18n.tr("components.breadcrumb.description", "Hierarchical path navigation trail with overflow ellipsis and dropdown subfolder browsing.")

    readonly property var initialSegments: [
        { label: ChaSetI18n.tr("surfaces.breadcrumb.computer", "Computer"), path: "/", isRoot: true, icon: "monitor" },
        { label: ChaSetI18n.tr("surfaces.breadcrumb.systemC", "System (C:)"), path: "C:/", isDrive: true, icon: "package" },
        { label: ChaSetI18n.tr("surfaces.breadcrumb.users", "Users"), path: "C:/Users", icon: "folder" },
        { label: ChaSetI18n.tr("surfaces.breadcrumb.developer", "Developer"), path: "C:/Users/Developer", icon: "folder" },
        { label: ChaSetI18n.tr("surfaces.breadcrumb.workspace", "Workspace"), path: "C:/Users/Developer/Workspace", icon: "folder" },
        { label: "ChaSet", path: "C:/Users/Developer/Workspace/ChaSet", icon: "folder" },
        { label: ChaSetI18n.tr("surfaces.breadcrumb.packages", "packages"), path: "C:/Users/Developer/Workspace/ChaSet/packages", icon: "folder" },
        { label: ChaSetI18n.tr("surfaces.breadcrumb.react", "react"), path: "C:/Users/Developer/Workspace/ChaSet/packages/react", icon: "folder" }
    ]

    property var demoSegments: root.initialSegments.slice()
    property bool demoDisabled: false
    property string lastNavigatedPath: ""

    function handleNavigate(path) {
        root.lastNavigatedPath = path
        var idx = -1
        for (var i = 0; i < root.demoSegments.length; ++i) {
            if (root.demoSegments[i].path === path) {
                idx = i
                break
            }
        }
        if (idx >= 0) {
            root.demoSegments = root.demoSegments.slice(0, idx + 1)
        }
    }

    function resetPath() {
        root.demoSegments = root.initialSegments.slice()
        root.lastNavigatedPath = ""
    }

    ComponentPreview {
        id: previewContainer
        width: parent.width
        title: ChaSetI18n.tr("surfaces.breadcrumb.sandboxTitle", "Breadcrumb Interactive Sandbox")
        stageHeight: ThemeTokens.dp(220)
        reactCode: `<Breadcrumb
  segments={segments}
  activePath="C:/Users/Developer/Workspace/ChaSet/packages/react"
  disabled={${root.demoDisabled}}
  onNavigate={(path) => handleNavigate(path)}
/>`
        qtCode: `ChaSetBreadcrumb {
    width: parent.width
    segments: demoSegments
    disabled: ${root.demoDisabled}
    onNavigateRequested: function(path) {
        handleNavigate(path)
    }
}`

        controlsData: [
            Row {
                spacing: ThemeTokens.dp(8)

                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("surfaces.breadcrumb.resetPath", "Reset Path")
                    onClicked: root.resetPath()
                }

                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: root.demoDisabled ? "Enable" : "Disable"
                    onClicked: root.demoDisabled = !root.demoDisabled
                }
            }
        ]

        Column {
            anchors.centerIn: parent
            width: Math.min(parent.width - ThemeTokens.dp(32), ThemeTokens.dp(640))
            spacing: ThemeTokens.dp(12)

            Rectangle {
                width: parent.width
                implicitHeight: ThemeTokens.dp(44)
                radius: ThemeTokens.dp(8)
                color: ThemeTokens.panel
                border.width: 1
                border.color: ThemeTokens.border

                ChaSetBreadcrumb {
                    id: breadcrumbInst
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(4)
                    segments: root.demoSegments
                    disabled: root.demoDisabled
                    onNavigateRequested: function(path) {
                        root.handleNavigate(path)
                    }
                }
            }

            DocText {
                visible: root.lastNavigatedPath.length > 0
                text: ChaSetI18n.tr("surfaces.breadcrumb.navigatedTo", "Navigated to: %1").arg(root.lastNavigatedPath)
                font.pixelSize: Typography.sizeSmall
                color: ThemeTokens.subduedText
            }
        }
    }

    DocAnatomy {
        sectionId: "anatomy"
        width: parent.width
        reactCode: `import { Breadcrumb } from '@chahu/cha-set';

<Breadcrumb
  segments={[
    { label: 'Home', path: '/', isRoot: true, icon: 'monitor' },
    { label: 'Workspace', path: '/workspace', icon: 'folder' },
    { label: 'ChaSet', path: '/workspace/chaset', icon: 'folder' },
  ]}
  activePath="/workspace/chaset"
  onNavigate={(path) => console.log(path)}
/>`
        qtCode: `import ChaSet

ChaSetBreadcrumb {
    segments: [
        { label: "Home", path: "/", isRoot: true, icon: "monitor" },
        { label: "Workspace", path: "/workspace", icon: "folder" },
        { label: "ChaSet", path: "/workspace/chaset", icon: "folder" }
    ]
    onNavigateRequested: function(path) {
        console.log(path)
    }
}`
    }

    DocText {
        text: ChaSetI18n.tr("surfaces.breadcrumb.animationsTitle", "Animations")
        font.pixelSize: Typography.sizeH2
        font.weight: Typography.weightBold
        color: ThemeTokens.text
    }
    DocText {
        text: ChaSetI18n.tr("surfaces.breadcrumb.animationsDesc", "Segment hover and dropdown menus follow standard motion duration and entrance curves.")
        font.pixelSize: Typography.sizeSmall
        color: ThemeTokens.subduedText
    }
    DocMarkdown {
        width: parent.width
        docId: "breadcrumb"
        section: "animations"
    }

    DocText {
        text: ChaSetI18n.tr("showcase.keyboardNavigation", "Keyboard Navigation")
        font.pixelSize: Typography.sizeH2
        font.weight: Typography.weightBold
        color: ThemeTokens.text
    }
    DocMarkdown {
        width: parent.width
        docId: "breadcrumb"
        section: "keyboard"
    }

    DocText {
        text: ChaSetI18n.tr("showcase.propsReference", "Props Reference")
        font.pixelSize: Typography.sizeH2
        font.weight: Typography.weightBold
        color: ThemeTokens.text
    }
    DocMarkdown {
        width: parent.width
        docId: "breadcrumb"
        section: "props"
    }
}
