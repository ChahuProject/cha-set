// SettingRowDocPage.qml — Living Documentation for ChaSetSettingRow
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Setting Row"
    description: ChaSetI18n.tr("components.settingRow.description", "Standardized preferences and settings item row layout with title, description, embedded control zone, and anchor flash highlight.")

    property bool hwAccel: true
    property string activeHighlightTarget: ""

    Timer {
        id: resetTimer
        interval: 1800
        onTriggered: root.activeHighlightTarget = ""
    }

    function triggerJump(id) {
        root.activeHighlightTarget = id;
        resetTimer.restart();
    }

    ComponentPreview {
        id: heroPreview
        title: ChaSetI18n.tr("desktopComposite.settingRow.sandboxTitle", "Setting Row Sandbox")
        reactCode: `<SettingRow
  name="Hardware Acceleration"
  description="Enable GPU-accelerated rasterization and smooth rendering."
  highlightId="hw-accel"
  highlightTarget="${root.activeHighlightTarget}"
>
  <Switch checked={${root.hwAccel}} />
</SettingRow>`
        qtCode: `ChaSetSettingRow {
    name: "Hardware Acceleration"
    description: "Enable GPU-accelerated rasterization and smooth rendering."
    highlightId: "hw-accel"
    highlightTarget: "${root.activeHighlightTarget}"

    ChaSetSwitch {
        anchors.right: parent.right
        anchors.verticalCenter: parent.verticalCenter
        checked: ${root.hwAccel}
        onToggled: (val) => root.hwAccel = val
    }
}`

        // Stage Container
        Rectangle {
            anchors.fill: parent
            color: "transparent"

            Column {
                anchors.centerIn: parent
                width: Math.min(parent.width - 48, 440)
                spacing: 4

                ChaSetSettingRow {
                    name: ChaSetI18n.tr("surfaces.settingRow.hwAccelName")
                    icon: "zap"
                    badge: ChaSetI18n.tr("surfaces.settingRow.recommended")
                    description: ChaSetI18n.tr("surfaces.settingRow.hwAccelDesc")
                    highlightId: "hw-accel"
                    highlightTarget: root.activeHighlightTarget

                    ChaSetSwitch {
                        anchors.right: parent.right
                        anchors.verticalCenter: parent.verticalCenter
                        checked: root.hwAccel
                        onToggled: function(val) { root.hwAccel = val; }
                    }
                }

                ChaSetSeparator { width: parent.width }

                ChaSetSettingRow {
                    name: ChaSetI18n.tr("surfaces.settingRow.autoUpdateName")
                    icon: "rotate-ccw"
                    description: ChaSetI18n.tr("surfaces.settingRow.autoUpdateDesc")
                    highlightId: "auto-update"
                    highlightTarget: root.activeHighlightTarget

                    ChaSetSwitch {
                        anchors.right: parent.right
                        anchors.verticalCenter: parent.verticalCenter
                        checked: true
                    }
                }
            }
        }

        controlsData: [
            Row {
                spacing: 12
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("surfaces.settingRow.flashHwAccel")
                    onClicked: root.triggerJump("hw-accel")
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("surfaces.settingRow.flashAutoUpdate")
                    onClicked: root.triggerJump("auto-update")
                }
            }
        ]
    }

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetSettingRow {
    width: parent.width
    title: "Automatic Sync"
    description: "Sync files automatically in the background"
}`
        reactCode: `import { SettingRow, Switch } from '@chahu/cha-set';

<SettingRow
  title="Automatic Sync"
  description="Sync files automatically in the background"
  control={<Switch checked={true} />}
/>`
    }



    // Anchor Jump & Flash
    DocText {
        property string sectionId: "anchor-jump-flash"
        property string sectionTitle: ChaSetI18n.tr("surfaces.settingRow.anchorJumpTitle", "Anchor Jump & Flash")
        text: ChaSetI18n.tr("surfaces.settingRow.anchorJumpTitle")
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
                    text: ChaSetI18n.tr("surfaces.settingRow.anchorJumpDesc")
                    color: ThemeTokens.text
                    font.pixelSize: Typography.sizeSmall
                }
            }
        }
    }

    // Keyboard Navigation
        ComponentReference {
        name: "SettingRow"
        componentId: "setting-row"
        propsModel: [
            { name: "name", type: "string", default: "''", description: ChaSetI18n.tr("components.settingRow.nameDesc", "Primary title label for the setting item.") },
            { name: "description", type: "string", default: "''", description: ChaSetI18n.tr("components.settingRow.descriptionDesc", "Secondary explanatory subtitle text.") },
            { name: "icon", type: "string", default: "''", description: ChaSetI18n.tr("components.settingRow.iconDesc", "Optional leading icon or badge avatar.") },
            { name: "badge", type: "string", default: "''", description: ChaSetI18n.tr("components.settingRow.badgeDesc", "Optional trailing badge tag next to title.") },
            { name: "size", type: "string", default: "'default'", description: ChaSetI18n.tr("components.settingRow.sizeDesc", "Density size variant ('default' or 'sm').") },
            { name: "highlightId", type: "string", default: "''", description: ChaSetI18n.tr("components.settingRow.highlightIdDesc", "Unique identifier used for anchor jump targeting.") },
            { name: "highlightTarget", type: "string", default: "''", description: ChaSetI18n.tr("components.settingRow.highlightTargetDesc", "Active target identifier. When matching highlightId, triggers pulse.") },
            { name: "highlight", type: "bool", default: "false", description: ChaSetI18n.tr("components.settingRow.highlightDesc", "Direct boolean override to force active highlight animation.") },
            { name: "disabled", type: "bool", default: "false", description: ChaSetI18n.tr("components.settingRow.disabledDesc", "Whether the setting row and controls are dimmed and disabled.") }
        ]
    }
}