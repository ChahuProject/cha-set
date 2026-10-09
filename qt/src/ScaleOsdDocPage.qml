// ScaleOsdDocPage.qml — Living Documentation for ChaSetScaleOsd
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Layouts 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Scale OSD"
    description: ChaSetI18n.tr("components.scaleOsd.description", "Floating on-screen display pill for canvas zoom and scale adjustments with auto-hide.")
    property real demoScale: 1.0
    property bool delayEnabled: true

    onDemoScaleChanged: {
        if (scaleOsd && Math.abs(scaleOsd.value - demoScale) > 0.001) {
            scaleOsd.value = demoScale;
            scaleOsd.show();
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.scaleOsd.sandboxTitle", "Scale OSD Sandbox")
        reactCode: `<ScaleOsd
  value={scale}
  step={0.1}
  min={0.2}
  max={3.0}
  visible={visible}
  contained={true}
  autoHideDuration={${root.delayEnabled ? 2000 : 0}}
  onChange={setScale}
/>`
        qtCode: `ChaSetScaleOsd {
    value: 1.0
    step: 0.1
    min: 0.2
    max: 3.0
    autoHideDuration: ${root.delayEnabled ? 2000 : 0}
    onValueChanged: {
        if (Math.abs(root.demoScale - value) > 0.001) {
            root.demoScale = value;
        }
    }
}`

        controlsData: [
            Row {
                width: childrenRect.width
                spacing: ThemeTokens.dp(8)

                Text {
                    anchors.verticalCenter: parent.verticalCenter
                    text: ChaSetI18n.tr("overlays.scaleOsd.quickZoom", "Quick Zoom:")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }

                ChaSetButton {
                    text: "50%"
                    variant: "outline"
                    size: "sm"
                    onClicked: {
                        root.demoScale = 0.5;
                        scaleOsd.show();
                    }
                }

                ChaSetButton {
                    text: "100%"
                    variant: "outline"
                    size: "sm"
                    onClicked: {
                        root.demoScale = 1.0;
                        scaleOsd.show();
                    }
                }

                ChaSetButton {
                    text: "200%"
                    variant: "outline"
                    size: "sm"
                    onClicked: {
                        root.demoScale = 2.0;
                        scaleOsd.show();
                    }
                }

                ChaSetButton {
                    text: scaleOsd.osdVisible ? ChaSetI18n.tr("overlays.scaleOsd.hideOsd", "Hide OSD") : ChaSetI18n.tr("overlays.scaleOsd.showOsd", "Show OSD")
                    variant: "outline"
                    size: "sm"
                    onClicked: {
                        if (scaleOsd.osdVisible) {
                            scaleOsd.hide();
                        } else {
                            scaleOsd.show();
                        }
                    }
                }

                ChaSetCheckbox {
                    anchors.verticalCenter: parent.verticalCenter
                    label: ChaSetI18n.tr("overlays.scaleOsd.delayLabel", "Auto-hide Delay (2s)")
                    checked: root.delayEnabled
                    onToggled: (val) => {
                        root.delayEnabled = val;
                    }
                }
            }
        ]

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
                        text: ChaSetI18n.tr("overlays.scaleOsd.previewBox", "Preview Box")
                        color: ThemeTokens.accent
                        font.pixelSize: Typography.sizeSmall
                        font.bold: true
                    }
                }

                ChaSetScaleOsd {
                    id: scaleOsd
                    anchors.horizontalCenter: parent.horizontalCenter
                    value: root.demoScale
                    autoHideDuration: root.delayEnabled ? 2000 : 0
                    defaultVisible: true
                    onValueChanged: {
                        if (Math.abs(root.demoScale - value) > 0.001) {
                            root.demoScale = value;
                        }
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
                text: ChaSetI18n.tr("showcase.animations", "Animations")
                font.pixelSize: Typography.sizeTitleSm
                font.bold: true
                color: ThemeTokens.text
            }

            DocText {
                width: parent.width
                wrap: true
                text: ChaSetI18n.tr("desktopComposite.scaleOsd.animationsDesc", "OSD enter and exit transitions run over duration-short (120ms) with the ease-standard curve (Qt: ThemeTokens.motionShort / ThemeTokens.easeStandard). The 1400ms auto-hide countdown pauses deterministically on hover.")
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
            }
        }
    }

    ComponentReference {
        name: "ScaleOsd"
        componentId: "scale-osd"
        propsModel: [
            { name: "value", type: "real", defaultVal: "1.0", description: ChaSetI18n.tr("components.scaleOsd.valueDesc", "Current scale ratio (e.g. 1.0 represents 100%).") },
            { name: "step", type: "real", defaultVal: "0.1", description: ChaSetI18n.tr("components.scaleOsd.stepDesc", "Step increment applied on +/- button click.") },
            { name: "min", type: "real", defaultVal: "0.2", description: ChaSetI18n.tr("components.scaleOsd.minDesc", "Minimum allowed zoom scale ratio.") },
            { name: "max", type: "real", defaultVal: "3.0", description: ChaSetI18n.tr("components.scaleOsd.maxDesc", "Maximum allowed zoom scale ratio.") },
            { name: "steps", type: "var", defaultVal: "[]", description: ChaSetI18n.tr("components.scaleOsd.stepsDesc", "Discrete scale steps array (e.g. CANONICAL_SCALE_STEPS).") },
            { name: "size", type: "string", defaultVal: "\"default\"", description: ChaSetI18n.tr("components.scaleOsd.sizeDesc", "Visual scale variant (desktop launcher 42px or standard 40px).") },
            { name: "ignoreUiScale", type: "bool", defaultVal: "true", description: ChaSetI18n.tr("components.scaleOsd.ignoreUiScaleDesc", "Locks physical pixel size and renders invariant regardless of interface scaling.") },
            { name: "autoHideDuration", type: "int", defaultVal: "1400", description: ChaSetI18n.tr("components.scaleOsd.autoHideDurationDesc", "Duration in ms before auto-hiding (pauses on hover).") },
            { name: "showControls", type: "bool", defaultVal: "true", description: ChaSetI18n.tr("components.scaleOsd.showControlsDesc", "Whether to display +/- and reset buttons.") },
            { name: "showTooltips", type: "bool", defaultVal: "true", description: ChaSetI18n.tr("components.scaleOsd.showTooltipsDesc", "Whether to display hover tooltip hints for control buttons.") },
            { name: "contained", type: "bool", defaultVal: "false", description: ChaSetI18n.tr("components.scaleOsd.containedDesc", "Whether to position OSD absolutely within its parent container instead of fixed to the global viewport.") },
            { name: "disabled", type: "bool", defaultVal: "false", description: ChaSetI18n.tr("components.scaleOsd.disabledDesc", "Disables all controls and user interaction.") }
        ]
    }
}
