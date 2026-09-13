// ScaleOsdDocPage.qml — Living Documentation for ChaSetScaleOsd
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Layouts 6.10
import ChaSet

DocLayout {
    id: root
    category: "Interactive Controls"
    pageTitle: "Scale OSD"
    description: "Floating on-screen display pill for canvas zoom and scale adjustments with auto-hide."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property real demoScale: 1.0

    ComponentPreview {
        title: "Scale OSD Sandbox"
        reactCode: `<ScaleOsd
  value={scale}
  step={0.1}
  min={0.2}
  max={3.0}
  visible={visible}
  autoHideDuration={1400}
  onChange={setScale}
/>`
        qtCode: `ChaSetScaleOsd {
    value: 1.0
    step: 0.1
    min: 0.2
    max: 3.0
    autoHideDuration: 1400
    onValueChanged: function(val) { console.log(val) }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 24
                width: 320

                Rectangle {
                    width: 96
                    height: 96
                    radius: 8
                    color: ThemeTokens.hover
                    border.color: ThemeTokens.accent
                    border.width: 1
                    anchors.horizontalCenter: parent.horizontalCenter
                    scale: root.demoScale

                    Behavior on scale {
                        enabled: ThemeTokens.animationsEnabled
                        NumberAnimation {
                            duration: ThemeTokens.motionShort
                            easing.type: ThemeTokens.easeStandard
                        }
                    }

                    Text {
                        anchors.centerIn: parent
                        text: "Preview Box"
                        color: ThemeTokens.accent
                        font.pixelSize: Typography.sizeSmall
                        font.bold: true
                    }
                }

                ChaSetScaleOsd {
                    anchors.horizontalCenter: parent.horizontalCenter
                    value: root.demoScale
                    autoHideDuration: 2500
                    onValueChanged: function(val) {
                        root.demoScale = val
                    }
                }
            }
        }
    }

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
                text: "OSD enter and exit transitions animate smoothly over ThemeTokens.motionShort (120ms) using ThemeTokens.easeStandard. Auto-hide timer runs with a 1400ms countdown, pausing on mouse hover."
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
            }
        }
    }

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
                componentId: "scale-osd"
            }
        }
    }

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
                    { name: "value", type: "real", defaultVal: "1.0", description: "Current scale ratio (e.g. 1.0 represents 100%)." },
                    { name: "step", type: "real", defaultVal: "0.1", description: "Step increment applied on +/- button click." },
                    { name: "min", type: "real", defaultVal: "0.2", description: "Minimum allowed zoom scale ratio." },
                    { name: "max", type: "real", defaultVal: "3.0", description: "Maximum allowed zoom scale ratio." },
                    { name: "autoHideDuration", type: "int", defaultVal: "1400", description: "Duration in ms before auto-hiding (pauses on hover)." },
                    { name: "showControls", type: "bool", defaultVal: "true", description: "Whether to display +/- and reset buttons." },
                    { name: "disabled", type: "bool", defaultVal: "false", description: "Disables all controls and user interaction." }
                ]
            }
        }
    }
}
