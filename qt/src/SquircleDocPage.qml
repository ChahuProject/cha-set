// SquircleDocPage.qml — Documentation and interactive sandbox for ChaSetSquircle
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Squircle"
    description: "iOS 连续曲率超椭圆圆角（G2 连续律）。消除了传统圆弧角在直线与切点处曲率突变导致的生硬折痕，为整个项目提供平滑、有机的现代圆角设计。"

    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property int customRadius: 16
    property real customSmoothing: 0.6

    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Squircle Sandbox & Curvature Comparison"
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
                                text: "Squircle\n(Smoothing: " + Math.round(root.customSmoothing * 100) + "%)"
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeSmall
                                font.weight: Font.DemiBold
                            }
                        }

                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: "iOS Continuous Curvature (G2)"
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
                                text: "Classic Arc\n(Smoothing: 0%)"
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeSmall
                                font.weight: Font.DemiBold
                            }
                        }

                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: "Standard Circular Arc (G1)"
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
                                    text: "Corner Smoothing"
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
                                    text: "Corner Radius"
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
                        text: "FULL-PROJECT DEFAULT ADOPTION PREVIEW"
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeNano
                        font.weight: Font.Bold
                    }

                    Row {
                        spacing: ThemeTokens.dp(10)

                        ChaSetButton {
                            text: "Squircle Button"
                            variant: "default"
                        }

                        ChaSetButton {
                            text: "Outline Button"
                            variant: "outline"
                        }

                        ChaSetBadge {
                            text: "Status Pill"
                            variant: "default"
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        ChaSetBadge {
                            text: "Secondary Badge"
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
        property string sectionTitle: "Installation"
        width: parent.width
        spacing: ThemeTokens.dp(20)

        Column {
            width: parent.width
            spacing: ThemeTokens.dp(6)

            DocText {
                text: "Installation"
                role: "h2"
            }

            DocText {
                text: "Package installation and CMake / QML module linkage."
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
                    text: "项目全局接入指南 (Global Adoption Guide for External Projects)"
                    role: "h3"
                }

                DocText {
                    text: "外部项目接入 ChaSet iOS 连续曲率超椭圆体系指南。在 Web 侧支持原生 CSS corner-shape 与 <Squircle> 容器渐进增强；在 Qt Quick 桌面端中，ChaSetSquircle (ChaSetSmoothRectangle) 实现了对标准 Rectangle 的 100% 属性超集无缝替换。"
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
                            text: "策略一"
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        DocText {
                            text: "Universal CSS Acceleration (全局 CSS 连续曲率加速)"
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightSemibold
                            color: ThemeTokens.text
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    DocText {
                        text: "在宿主项目的全局样式表（如 globals.css 或 index.css）中加入 CSS 特性查询。所有基于 Tailwind CSS rounded-* 类的元素将即刻提升为 iOS 连续曲率超椭圆，平滑消除边缘生硬折痕。"
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
                            text: "策略二"
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        DocText {
                            text: "CMake 模块链接与 ChaSetSquircle 无缝替换 (Desktop Drop-in Replacement)"
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightSemibold
                            color: ThemeTokens.text
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    DocText {
                        text: "在桌面宿主项目的 CMakeLists.txt 中链接 ChaSet 插件模块。在 QML 视图中将原有 Rectangle 直接替换为 ChaSetSquircle (或别名 ChaSetSmoothRectangle)，即可获得 iOS G2 连续平滑曲率与单边独立圆角能力："
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
                            text: "策略三"
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        DocText {
                            text: "Design Tokens 全局主题曲率配置 (Theme Tokens Configuration)"
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightSemibold
                            color: ThemeTokens.text
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    DocText {
                        text: "ChaSet 核心设计令牌内置了曲率控制变量。宿主可在全局主题管理器或 ThemeTokens 中调整 cornerSmoothing 参数 (0.0 为传统圆弧，0.6 为 Apple iOS 标准，1.0 为极限超椭圆)："
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
