// ScaleOsdDocPage.qml — Living Documentation for ChaSetScaleOsd
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Layouts 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Scale OSD"
    description: "Floating on-screen display pill for canvas zoom and scale adjustments with auto-hide."
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
                spacing: ThemeTokens.dp(24)
                width: ThemeTokens.dp(320)

                Rectangle {
                    width: ThemeTokens.dp(96)
                    height: ThemeTokens.dp(96)
                    radius: ThemeTokens.dp(8)
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
                    defaultVisible: true
                    onValueChanged: function(val) {
                        root.demoScale = val
                    }
                }
            }
        }
    }

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetScaleOsd {
    scale: 100
}`
        reactCode: `import { ScaleOsd } from '@chahu/cha-set';

<ScaleOsd scale={100} onZoomIn={() => {}} onZoomOut={() => {}} onReset={() => {}} />`
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
                width: parent.width
                wrap: true
                text: "OSD enter and exit transitions animate smoothly over ThemeTokens.motionShort (120ms) using ThemeTokens.easeStandard. Auto-hide timer runs with a 1400ms countdown, pausing on mouse hover."
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
            }
        }
    }

    ComponentReference {
        name: "ScaleOsd"
        componentId: "scale-osd"
        propsModel: [
            { name: "value", type: "real", defaultVal: "1.0", description: "Current scale ratio (e.g. 1.0 represents 100%)." },
            { name: "step", type: "real", defaultVal: "0.1", description: "Step increment applied on +/- button click." },
            { name: "min", type: "real", defaultVal: "0.2", description: "Minimum allowed zoom scale ratio." },
            { name: "max", type: "real", defaultVal: "3.0", description: "Maximum allowed zoom scale ratio." },
            { name: "steps", type: "var", defaultVal: "[]", description: "Discrete scale steps array (e.g. CANONICAL_SCALE_STEPS)." },
            { name: "size", type: "string", defaultVal: "\"default\"", description: "Visual scale variant (desktop launcher 42px or standard 40px)." },
            { name: "ignoreUiScale", type: "bool", defaultVal: "true", description: "Locks physical pixel size and renders invariant regardless of interface scaling." },
            { name: "autoHideDuration", type: "int", defaultVal: "1400", description: "Duration in ms before auto-hiding (pauses on hover)." },
            { name: "showControls", type: "bool", defaultVal: "true", description: "Whether to display +/- and reset buttons." },
            { name: "showTooltips", type: "bool", defaultVal: "true", description: "Whether to display hover tooltip hints for control buttons." },
            { name: "disabled", type: "bool", defaultVal: "false", description: "Disables all controls and user interaction." }
        ]
    }
}
