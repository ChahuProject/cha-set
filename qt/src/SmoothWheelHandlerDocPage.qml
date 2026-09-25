// SmoothWheelHandlerDocPage.qml — Living Documentation for ChaSetSmoothWheelHandler
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Smooth Wheel Handler"
    description: "Desktop kinematic scrolling helper providing continuous physical momentum damping, Shift+wheel horizontal conversion, and gesture mutex."

    property real demoSpeed: 1.2
    property int demoDuration: 200
    property bool demoMapShift: false

    ComponentPreview {
        id: heroPreview
        title: "Smooth Wheel Handler Sandbox"
        reactCode: `<SmoothWheelHandler
  scrollOrientation="vertical"
  speedMultiplier={${root.demoSpeed}}
  duration={${root.demoDuration}}
  className="h-64 border rounded-lg p-3"
>
  {/* Items */}
</SmoothWheelHandler>`
        qtCode: `Flickable {
    width: parent.width
    height: 240
    contentHeight: contentCol.implicitHeight
    clip: true

    ChaSetSmoothWheelHandler {
        targetItem: parent
        speedMultiplier: ${root.demoSpeed}
        duration: ${root.demoDuration}
        mapVerticalToHorizontal: ${root.demoMapShift}
    }

    Column {
        id: contentCol
        spacing: 8
        Repeater {
            model: 20
            ChaSetCard {
                width: 320
                ChaSetCardContent {
                    topPadding: 12
                    bottomPadding: 12
                    horizontalPadding: 12
                    Text { text: "Kinematic Item #" + (index + 1); color: ThemeTokens.text }
                }
            }
        }
    }
}`

        // Stage Container
        Rectangle {
            anchors.fill: parent
            color: "transparent"

            Flickable {
                id: demoFlickable
                anchors.centerIn: parent
                width: Math.min(parent.width - ThemeTokens.dp(48), ThemeTokens.dp(380))
                height: ThemeTokens.dp(220)
                contentHeight: demoCol.implicitHeight
                clip: true

                ChaSetSmoothWheelHandler {
                    targetItem: demoFlickable
                    speedMultiplier: root.demoSpeed
                    duration: root.demoDuration
                    mapVerticalToHorizontal: root.demoMapShift
                }

                Column {
                    id: demoCol
                    width: parent.width
                    spacing: ThemeTokens.dp(8)

                    Repeater {
                        model: 18
                        delegate: Rectangle {
                            required property int index
                            width: demoCol.width
                            height: ThemeTokens.dp(42)
                            radius: ThemeTokens.dp(6)
                            color: ThemeTokens.dark ? Qt.rgba(30/255, 41/255, 59/255, 0.5) : Qt.rgba(241/255, 245/255, 249/255, 0.8)
                            border.color: ThemeTokens.border
                            border.width: 1

                            Item {
                                anchors.fill: parent
                                anchors.leftMargin: ThemeTokens.dp(12)
                                anchors.rightMargin: ThemeTokens.dp(12)

                                DocText {
                                    anchors.left: parent.left
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: "Kinematic Scroll Item #" + (index + 1)
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeSmall
                                    font.bold: true
                                }

                                ChaSetBadge {
                                    anchors.right: parent.right
                                    anchors.verticalCenter: parent.verticalCenter
                                    variant: "outline"
                                    text: "Item #" + (index + 1)
                                }
                            }
                        }
                    }
                }
            }
        }

        controlsData: [
            Row {
                spacing: 12
                DocText {
                    text: "Speed Multiplier:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    anchors.verticalCenter: parent.verticalCenter
                }
                Repeater {
                    model: [1.0, 1.2, 1.5, 2.0]
                    delegate: ChaSetButton {
                        required property var modelData
                        size: "sm"
                        variant: root.demoSpeed === modelData ? "default" : "outline"
                        text: modelData + "x"
                        onClicked: root.demoSpeed = modelData
                    }
                }
            },
            Row {
                spacing: 12
                DocText {
                    text: "Damping Duration:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    anchors.verticalCenter: parent.verticalCenter
                }
                Repeater {
                    model: [100, 200, 350]
                    delegate: ChaSetButton {
                        required property var modelData
                        size: "sm"
                        variant: root.demoDuration === modelData ? "default" : "outline"
                        text: modelData + "ms"
                        onClicked: root.demoDuration = modelData
                    }
                }
            }
        ]
    }

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetSmoothWheelHandler {
    target: flickableItem
}`
        reactCode: `import { SmoothWheelHandler } from '@chahu/cha-set';

<SmoothWheelHandler onWheelScroll={(dx, dy) => console.log(dx, dy)} />`
    }



    // Kinematic Architecture
    Column {
        property string sectionId: "kinematics"
        width: parent.width
        spacing: 12

        DocText {
            text: "Kinematic Architecture"
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        ChaSetCard {
            width: parent.width

            ChaSetCardContent {
                topPadding: 16
                bottomPadding: 16
                horizontalPadding: 16

                Column {
                    spacing: 12
                    width: parent.width

                    DocText {
                        width: parent.width
                        wrapMode: TextEdit.Wrap
                        text: "• Momentum Accumulation: Consecutive wheel clicks accumulate linearly to targetPos rather than interrupting or jerking the active transition."
                        color: ThemeTokens.text
                        font.pixelSize: Typography.sizeSmall
                    }
                    DocText {
                        width: parent.width
                        wrapMode: TextEdit.Wrap
                        text: "• Gesture Decoupling: Automatically listens to targetItem.moving and targetItem.flicking. When the user touches or drags the view, smooth animations abort instantly to prevent motion fight."
                        color: ThemeTokens.text
                        font.pixelSize: Typography.sizeSmall
                    }
                    DocText {
                        width: parent.width
                        wrapMode: TextEdit.Wrap
                        text: "• Universal Drop-In: Targets any Flickable / ListView / GridView or ChaSetScrollArea without modifying existing visual hierarchies."
                        color: ThemeTokens.text
                        font.pixelSize: Typography.sizeSmall
                    }
                }
            }
        }
    }

    ComponentReference {
        name: "SmoothWheelHandler"
        componentId: "smooth-wheel-handler"
        propsModel: [
            { name: "targetItem", type: "Item", defaultValue: "parent", description: "Target scrollable item (Flickable, ListView, GridView, etc.)" },
            { name: "scrollOrientation", type: "int", defaultValue: "Qt.Vertical", description: "Scroll axis: Qt.Vertical or Qt.Horizontal" },
            { name: "mapVerticalToHorizontal", type: "bool", defaultValue: "false", description: "Whether vertical mouse wheel rolls horizontally" },
            { name: "speedMultiplier", type: "real", defaultValue: "1.2", description: "Velocity scaling factor applied to raw wheel delta" },
            { name: "duration", type: "int", defaultValue: "200", description: "Transition damping duration in milliseconds" },
            { name: "fixedStepSize", type: "real", defaultValue: "0", description: "Optional fixed quantization step per tick (0 for dynamic)" },
            { name: "consumeEvent", type: "bool", defaultValue: "true", description: "Whether to accept wheel event to stop propagation" }
        ]
    }
}