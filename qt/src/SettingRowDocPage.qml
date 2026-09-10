// SettingRowDocPage.qml — Living Documentation for ChaSetSettingRow
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Interactive Controls"
    pageTitle: "Setting Row"
    description: "Standardized preferences and settings item row layout with title, description, embedded control zone, and anchor flash highlight."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "anchor", title: "Anchor Jump & Flash" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

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
        title: "Interactive Setting Row Sandbox"
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
                    name: "Hardware Acceleration"
                    icon: "⚡"
                    badge: "Recommended"
                    description: "Enable GPU-accelerated rasterization and smooth rendering."
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
                    name: "Auto-Check Updates"
                    icon: "🔄"
                    description: "Periodically verify semantic releases and download patches in background."
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
                    text: "Flash HW Accel"
                    onClicked: root.triggerJump("hw-accel")
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: "Flash Auto-Update"
                    onClicked: root.triggerJump("auto-update")
                }
            }
        ]
    }

    // Anchor Jump & Flash
    Text {
        text: "Anchor Jump & Flash"
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
                    text: "Setting rows support an anchor targeting mechanism. When highlightTarget matches highlightId, the border triggers a 3-cycle pulse flash animation, guiding the user's attention from dialogs or keyboard shortcuts."
                    color: ThemeTokens.text
                    font.pixelSize: 12
                }
            }
        }
    }

    // Keyboard Navigation
    Text {
        text: "Keyboard Navigation"
        font.pixelSize: 18
        font.bold: true
        color: ThemeTokens.text
    }

    KeyboardShortcutsTable {
        componentId: "setting-row"
    }

    // Props Reference
    PropsTable {
        title: "Props Reference"
        props: [
            { name: "name", type: "string", default: "''", description: "Primary title of the setting row" },
            { name: "description", type: "string", default: "''", description: "Secondary subtitle description text" },
            { name: "icon", type: "string", default: "''", description: "Optional leading icon" },
            { name: "badge", type: "string", default: "''", description: "Optional trailing badge tag next to title" },
            { name: "size", type: "string", default: "'default'", description: "Size variant ('default' or 'sm')" },
            { name: "highlightId", type: "string", default: "''", description: "Unique anchor ID for targeted highlighting" },
            { name: "highlightTarget", type: "string", default: "''", description: "Current active target ID to trigger flash pulse" },
            { name: "highlight", type: "bool", default: "false", description: "Boolean flag indicating if highlight animation is active" },
            { name: "disabled", type: "bool", default: "false", description: "Whether the row and controls are dimmed and disabled" }
        ]
    }
}

