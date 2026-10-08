// SquircleDocPage.qml — Documentation and interactive sandbox for ChaSetSquircle
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Squircle"
    description: ChaSetI18n.tr("components.squircle.description", "iOS continuous curvature superellipse rounded corners (G2 continuity). Eliminates harsh creases caused by abrupt curvature transitions in classic circular arcs, providing smooth, organic modern corners across the design system.")

    tocItems: [
        { id: "overview", title: ChaSetI18n.tr("desktopComposite.squircle.overviewHeading", "Interactive Overview") },
        { id: "installation", title: ChaSetI18n.tr("desktopComposite.squircle.installHeading", "Installation") },
        { id: "animations", title: ChaSetI18n.tr("showcase.animations", "Animations") },
        { id: "keyboard", title: ChaSetI18n.tr("showcase.keyboardNavigation", "Keyboard Navigation") },
        { id: "props", title: ChaSetI18n.tr("showcase.propsReference", "Props Reference") }
    ]

    property int customRadius: 16
    property real customSmoothing: 0.6

    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: ChaSetI18n.tr("desktopComposite.squircle.sandboxTitle", "Squircle Sandbox & Curvature Comparison")
        reactCode: `<Squircle
  radius={${root.customRadius}}
  smoothing={${root.customSmoothing.toFixed(2)}}
  className="w-48 h-32 bg-primary/10 border border-primary/30 flex items-center justify-center p-4 text-center text-sm font-medium"
>
  iOS Continuous Squircle (${Math.round(root.customSmoothing * 100)}%)
</Squircle>`
        qtCode: `ChaSetSquircle {
    width: 192
    height: 128
    radius: ${root.customRadius}
    cornerSmoothing: ${root.customSmoothing.toFixed(2)}
    color: Qt.rgba(48/255, 160/255, 255/255, 0.1)
    border.color: ThemeTokens.accent
    border.width: 1

    Text {
        anchors.centerIn: parent
        text: "iOS Continuous Squircle (${Math.round(root.customSmoothing * 100)}%)"
        color: ThemeTokens.text
    }
}`

        stageData: [
            Column {
                anchors.centerIn: parent
                width: Math.min(parent.width - ThemeTokens.dp(40), ThemeTokens.dp(540))
                spacing: ThemeTokens.dp(24)

                // Comparison Display Area
                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: ThemeTokens.dp(32)

                    // Continuous Squircle
                    Column {
                        spacing: ThemeTokens.dp(8)

                        ChaSetSquircle {
                            width: ThemeTokens.dp(180)
                            height: ThemeTokens.dp(120)
                            radius: ThemeTokens.dp(root.customRadius)
                            cornerSmoothing: root.customSmoothing
                            color: Qt.rgba(48/255, 160/255, 255/255, 0.15)
                            border.color: ThemeTokens.accent
                            border.width: 2

                            Text {
                                anchors.centerIn: parent
                                width: parent.width - ThemeTokens.dp(20)
                                horizontalAlignment: Text.AlignHCenter
                                wrapMode: Text.WordWrap
                                text: ChaSetI18n.tr("components.squircle.squircleLabel", "Squircle (Smoothing: {{smoothing}}%)", { "smoothing": Math.round(root.customSmoothing * 100) })
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeSmall
                                font.weight: Font.DemiBold
                            }
                        }

                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: ChaSetI18n.tr("components.squircle.g2Label", "iOS Continuous Curvature (G2)")
                            color: ThemeTokens.accent
                            font.pixelSize: Typography.sizeCaption
                            font.weight: Font.Medium
                        }
                    }

                    // Traditional Circular Arc
                    Column {
                        spacing: ThemeTokens.dp(8)

                        Rectangle {
                            width: ThemeTokens.dp(180)
                            height: ThemeTokens.dp(120)
                            radius: ThemeTokens.dp(root.customRadius)
                            color: Qt.rgba(120/255, 130/255, 150/255, 0.15)
                            border.color: ThemeTokens.border
                            border.width: 2

                            Text {
                                anchors.centerIn: parent
                                width: parent.width - ThemeTokens.dp(20)
                                horizontalAlignment: Text.AlignHCenter
                                wrapMode: Text.WordWrap
                                text: ChaSetI18n.tr("components.squircle.classicArc", "Classic Arc (Smoothing: 0%)")
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeSmall
                                font.weight: Font.DemiBold
                            }
                        }

                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: ChaSetI18n.tr("components.squircle.g1Label", "Standard Circular Arc (G1)")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeCaption
                            font.weight: Font.Medium
                        }
                    }
                }

                // Interactive Controls
                Column {
                    width: parent.width
                    spacing: ThemeTokens.dp(12)

                    Row {
                        width: parent.width
                        spacing: ThemeTokens.dp(16)

                        Column {
                            width: (parent.width - ThemeTokens.dp(16)) / 2
                            spacing: ThemeTokens.dp(4)

                            Item {
                                width: parent.width
                                height: ThemeTokens.dp(16)
                                Text {
                                    anchors.left: parent.left
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: ChaSetI18n.tr("components.squircle.cornerSmoothing", "Corner Smoothing")
                                    color: ThemeTokens.subduedText
                                    font.pixelSize: Typography.sizeCaption
                                }
                                Text {
                                    anchors.right: parent.right
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: Math.round(root.customSmoothing * 100) + "% (iOS: 60%)"
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeCaption
                                    font.weight: Font.DemiBold
                                }
                            }

                            ChaSetSlider {
                                width: parent.width
                                min: 0.0
                                max: 1.0
                                step: 0.05
                                value: root.customSmoothing
                                onValueMoved: (v) => root.customSmoothing = v
                            }
                        }

                        Column {
                            width: (parent.width - ThemeTokens.dp(16)) / 2
                            spacing: ThemeTokens.dp(4)

                            Item {
                                width: parent.width
                                height: ThemeTokens.dp(16)
                                Text {
                                    anchors.left: parent.left
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: ChaSetI18n.tr("components.squircle.cornerRadius", "Corner Radius")
                                    color: ThemeTokens.subduedText
                                    font.pixelSize: Typography.sizeCaption
                                }
                                Text {
                                    anchors.right: parent.right
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: "" + root.customRadius
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeCaption
                                    font.weight: Font.DemiBold
                                }
                            }

                            ChaSetSlider {
                                width: parent.width
                                min: 4
                                max: 48
                                step: 2
                                value: root.customRadius
                                onValueMoved: (v) => root.customRadius = Math.round(v)
                            }
                        }
                    }
                }

                // Component Adoption Preview
                Column {
                    width: parent.width
                    spacing: ThemeTokens.dp(10)

                    Text {
                        text: ChaSetI18n.tr("components.squircle.adoptionPreview", "FULL-PROJECT DEFAULT ADOPTION PREVIEW").toUpperCase()
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeNano
                        font.weight: Font.Bold
                    }

                    Row {
                        spacing: ThemeTokens.dp(10)

                        ChaSetButton {
                            text: ChaSetI18n.tr("desktopComposite.squircle.demoButton", "Squircle Button")
                            variant: "default"
                        }

                        ChaSetButton {
                            text: ChaSetI18n.tr("desktopComposite.squircle.demoOutline", "Outline Button")
                            variant: "outline"
                        }

                        ChaSetBadge {
                            text: ChaSetI18n.tr("desktopComposite.squircle.demoPill", "Status Pill")
                            variant: "default"
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        ChaSetBadge {
                            text: ChaSetI18n.tr("desktopComposite.squircle.demoBadge", "Secondary Badge")
                            variant: "secondary"
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }
                }
            }
        ]
    }

    // 2. Installation & Global Adoption Guide
    Column {
        id: installationSection
        objectName: "installation"
        property string sectionId: "installation"
        property string sectionTitle: ChaSetI18n.tr("desktopComposite.squircle.installHeading", "Installation")
        width: parent.width
        spacing: ThemeTokens.dp(20)

        Column {
            width: parent.width
            spacing: ThemeTokens.dp(6)

            DocText {
                text: ChaSetI18n.tr("desktopComposite.squircle.installHeading", "Installation")
                role: "h2"
            }

            DocText {
                text: ChaSetI18n.tr("desktopComposite.squircle.installDesc", "Package installation and CMake / QML module linkage.")
                role: "p"
                isMuted: true
            }
        }

        ChaSetCodeBlock {
            width: parent.width
            language: "bash"
            code: "pnpm add @chahu/cha-set"
        }

        Column {
            width: parent.width
            spacing: ThemeTokens.dp(16)

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(4)

                DocText {
                    text: ChaSetI18n.tr("desktopComposite.squircle.guideTitle", "Global Adoption Guide for External Projects")
                    role: "h3"
                }

                DocText {
                    text: ChaSetI18n.tr("desktopComposite.squircle.guideDesc", "External projects adopt the ChaSet iOS continuous-curvature system via two progressive enhancement strategies: the base layer accelerates all Tailwind utilities at zero cost through modern browser CSS features; legacy environments or high-precision bordered geometry fall back to guaranteed rendering through the primitive component.")
                    role: "p"
                    isMuted: true
                }
            }

            // Strategy 1: Universal CSS Acceleration
            ChaSetCard {
                width: parent.width
                customRadius: 8

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)
                    leftPadding: ThemeTokens.dp(20)
                    rightPadding: ThemeTokens.dp(20)
                    spacing: ThemeTokens.dp(12)

                    Row {
                        spacing: ThemeTokens.dp(8)
                        ChaSetBadge {
                            variant: "default"
                            text: ChaSetI18n.tr("desktopComposite.squircle.strategyBadge1", "Strategy 1")
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        DocText {
                            text: ChaSetI18n.tr("desktopComposite.squircle.strategy1Title", "Universal CSS Acceleration (Global CSS Continuous-Curvature Acceleration)")
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightSemibold
                            color: ThemeTokens.text
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    DocText {
                        text: ChaSetI18n.tr("desktopComposite.squircle.strategy1Desc", "Add a CSS feature query in the host project global stylesheet (e.g. globals.css or index.css). Every element based on Tailwind rounded-* utilities is instantly promoted to iOS continuous-curvature superellipses, smoothly eliminating harsh edge creases.")
                        role: "p"
                        isMuted: true
                    }

                    ChaSetCodeBlock {
                        width: parent.width
                        language: "css"
                        filename: "globals.css"
                        code: "/* globals.css — 全局 CSS 连续曲率超椭圆加速 */\n@supports (corner-shape: squircle) {\n  *,\n  ::before,\n  ::after {\n    corner-shape: squircle;\n  }\n\n  /* 保持纯圆 Pill / Avatar 徽章不受连续曲率形变影响 */\n  .rounded-full,\n  [data-shape=\"round\"] {\n    corner-shape: round;\n  }\n}"
                    }
                }
            }

            // Strategy 2: CMake Linkage & Drop-in Replacement for Desktop
            ChaSetCard {
                width: parent.width
                customRadius: 8

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)
                    leftPadding: ThemeTokens.dp(20)
                    rightPadding: ThemeTokens.dp(20)
                    spacing: ThemeTokens.dp(12)

                    Row {
                        spacing: ThemeTokens.dp(8)
                        ChaSetBadge {
                            variant: "secondary"
                            text: ChaSetI18n.tr("desktopComposite.squircle.strategyBadge2", "Strategy 2")
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        DocText {
                            text: ChaSetI18n.tr("desktopComposite.squircle.strategy2Title", "Guaranteed Progressive Enhancement (Container Progressive Enhancement)")
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightSemibold
                            color: ThemeTokens.text
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    DocText {
                        text: ChaSetI18n.tr("desktopComposite.squircle.strategy2Desc", "For dialogs (Dialog/Sheet), highlight cards, or browser engines without CSS corner-shape support, wrap content with the ChaSet component. Internally it clips via SVG clipPath with ResizeObserver-driven geometry, guaranteeing 100% cross-platform pixel-smooth rendering.")
                        role: "p"
                        isMuted: true
                    }

                    ChaSetCodeBlock {
                        width: parent.width
                        language: "cmake"
                        filename: "CMakeLists.txt"
                        code: "find_package(ChaSet REQUIRED) # 或 FetchContent / add_subdirectory\ntarget_link_libraries(my_desktop_app PRIVATE ChaSetPlugin)"
                    }

                    ChaSetCodeBlock {
                        width: parent.width
                        language: "qml"
                        filename: "ContinuousCard.qml"
                        code: "import QtQuick 6.10\nimport ChaSet 1.0\n\nChaSetSquircle {\n    width: ThemeTokens.dp(320)\n    height: ThemeTokens.dp(180)\n    radius: ThemeTokens.dp(16)\n    // cornerSmoothing 默认继承 ThemeTokens.cornerSmoothing (0.6)\n    color: ThemeTokens.panel\n    border.color: ThemeTokens.border\n    border.width: 1\n\n    // 支持独立单边圆角 (常用于分栏或停靠面板)\n    roundLeft: true\n    roundRight: false\n\n    Text {\n        anchors.centerIn: parent\n        text: \"Continuous Curvature Panel\"\n        color: ThemeTokens.text\n    }\n}"
                    }
                }
            }

            // Strategy 3: Global Design Tokens Configuration
            ChaSetCard {
                width: parent.width
                customRadius: 8

                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)
                    leftPadding: ThemeTokens.dp(20)
                    rightPadding: ThemeTokens.dp(20)
                    spacing: ThemeTokens.dp(12)

                    Row {
                        spacing: ThemeTokens.dp(8)
                        ChaSetBadge {
                            variant: "outline"
                            text: ChaSetI18n.tr("desktopComposite.squircle.strategyBadge3", "Strategy 3")
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        DocText {
                            text: ChaSetI18n.tr("desktopComposite.squircle.strategy3Title", "Design Tokens Configuration (Global Design-Token Setup)")
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightSemibold
                            color: ThemeTokens.text
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    DocText {
                        text: ChaSetI18n.tr("desktopComposite.squircle.strategy3Desc", "ChaSet core design tokens ship built-in curvature variables. Host projects may define --cs-corner-shape and --cs-corner-smoothing at the root level, and the full component library automatically inherits the matching curvature.")
                        role: "p"
                        isMuted: true
                    }

                    ChaSetCodeBlock {
                        width: parent.width
                        language: "qml"
                        filename: "ThemeConfig.qml"
                        code: "// Qt Quick 桌面端主题配置\nThemeTokens.cornerSmoothing = 0.6 // Apple iOS G2 连续曲率标准"
                    }

                    ChaSetCodeBlock {
                        width: parent.width
                        language: "css"
                        filename: "tokens.css"
                        code: "/* Web 跨端设计令牌配置 */\n:root {\n  --cs-corner-shape: squircle;\n  --cs-corner-smoothing: 0.6;\n}"
                    }
                }
            }
        }
    }

    DocFooterSections {
        width: parent.width
        componentId: "squircle"
        propsModel: [
            { "name": "radius", "type": "real", "defaultValue": "0", "description": "Global corner radius." },
            { "name": "cornerSmoothing", "type": "real", "defaultValue": "0.6", "description": "Curvature smoothing factor from 0.0 (circle arc) to 1.0 (full squircle). 0.6 is the Apple iOS standard." },
            { "name": "topLeftRadius", "type": "real", "defaultValue": "-1", "description": "Top-left corner radius override (-1 falls back to radius)." },
            { "name": "topRightRadius", "type": "real", "defaultValue": "-1", "description": "Top-right corner radius override (-1 falls back to radius)." },
            { "name": "bottomLeftRadius", "type": "real", "defaultValue": "-1", "description": "Bottom-left corner radius override (-1 falls back to radius)." },
            { "name": "bottomRightRadius", "type": "real", "defaultValue": "-1", "description": "Bottom-right corner radius override (-1 falls back to radius)." },
            { "name": "roundLeft", "type": "bool", "defaultValue": "true", "description": "Whether left corners are rounded." },
            { "name": "roundRight", "type": "bool", "defaultValue": "true", "description": "Whether right corners are rounded." },
            { "name": "roundTop", "type": "bool", "defaultValue": "true", "description": "Whether top corners are rounded." },
            { "name": "roundBottom", "type": "bool", "defaultValue": "true", "description": "Whether bottom corners are rounded." },
            { "name": "border.color", "type": "color", "defaultValue": "\"transparent\"", "description": "Border stroke color." },
            { "name": "border.width", "type": "real", "defaultValue": "0", "description": "Border stroke width." },
            { "name": "color", "type": "color", "defaultValue": "\"transparent\"", "description": "Background surface fill color." }
        ]
    }
}
