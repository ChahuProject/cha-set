// SmoothWheelHandlerDocPage.qml — Living Documentation for ChaSetSmoothWheelHandler
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Smooth Wheel Handler"
    description: "Desktop kinematic scrolling helper providing continuous physical momentum damping, Shift+wheel horizontal conversion, and gesture mutex."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "kinematics", title: "Kinematic Architecture" },
        { id: "keyboard", title: "Keyboard & Wheel Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property real demoSpeed: 1.2
    property int demoDuration: 200
    property bool demoMapShift: false

    ComponentPreview {
        id: heroPreview
        title: "Interactive Kinematics Sandbox"
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
                width: Math.min(parent.width - 48, 380)
                height: 220
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
                    spacing: 8

                    Repeater {
                        model: 18
                        delegate: Rectangle {
                            required property int index
                            width: demoCol.width
                            height: 42
                            radius: 6
                            color: ThemeTokens.dark ? Qt.rgba(30/255, 41/255, 59/255, 0.5) : Qt.rgba(241/255, 245/255, 249/255, 0.8)
                            border.color: ThemeTokens.border
                            border.width: 1

                            Item {
                                anchors.fill: parent
                                anchors.leftMargin: 12
                                anchors.rightMargin: 12

                                Text {
                                    anchors.left: parent.left
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: "Kinematic Scroll Item #" + (index + 1)
                                    color: ThemeTokens.text
                                    font.pixelSize: 12
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
                Text {
                    text: "Speed Multiplier:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 11
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
                Text {
                    text: "Damping Duration:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 11
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

    // Kinematic Architecture
    Text {
        text: "Kinematic Architecture"
        font.pixelSize: 18
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

                Text {
                    width: parent.width
                    wrapMode: Text.Wrap
                    text: "• Momentum Accumulation: Consecutive wheel clicks accumulate linearly to targetPos rather than interrupting or jerking the active transition."
                    color: ThemeTokens.text
                    font.pixelSize: 12
                }
                Text {
                    width: parent.width
                    wrapMode: Text.Wrap
                    text: "• Gesture Decoupling: Automatically listens to targetItem.moving and targetItem.flicking. When the user touches or drags the view, smooth animations abort instantly to prevent motion fight."
                    color: ThemeTokens.text
                    font.pixelSize: 12
                }
                Text {
                    width: parent.width
                    wrapMode: Text.Wrap
                    text: "• Universal Drop-In: Targets any Flickable / ListView / GridView or ChaSetScrollArea without modifying existing visual hierarchies."
                    color: ThemeTokens.text
                    font.pixelSize: 12
                }
            }
        }
    }

    // Keyboard & Wheel Navigation
    Text {
        text: "Keyboard & Wheel Navigation"
        font.pixelSize: 18
        font.bold: true
        color: ThemeTokens.text
    }

    KeyboardShortcutsTable {
        componentId: "smooth-wheel-handler"
    }

    // Props Reference
    PropsTable {
        title: "Props Reference"
        props: [
            { name: "targetItem", type: "Item", default: "parent", description: "Target scrollable item (Flickable, ListView, GridView, etc.)" },
            { name: "scrollOrientation", type: "int", default: "Qt.Vertical", description: "Scroll axis: Qt.Vertical or Qt.Horizontal" },
            { name: "mapVerticalToHorizontal", type: "bool", default: "false", description: "Whether vertical mouse wheel rolls horizontally" },
            { name: "speedMultiplier", type: "real", default: "1.2", description: "Velocity scaling factor applied to raw wheel delta" },
            { name: "duration", type: "int", default: "200", description: "Transition damping duration in milliseconds" },
            { name: "fixedStepSize", type: "real", default: "0", description: "Optional fixed quantization step per tick (0 for dynamic)" },
            { name: "consumeEvent", type: "bool", default: "true", description: "Whether to accept wheel event to stop propagation" }
        ]
    }
}
