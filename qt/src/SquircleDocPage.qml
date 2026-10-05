// SquircleDocPage.qml — Documentation and interactive sandbox for ChaSetSquircle
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Squircle"
    description: "iOS 连续曲率超椭圆圆角（G2 连续律）。消除了传统圆弧角在直线与切点处曲率突变导致的生硬折痕，为整个项目提供平滑、有机的现代圆角设计。"

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
