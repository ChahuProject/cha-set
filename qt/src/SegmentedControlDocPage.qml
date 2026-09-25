// SegmentedControlDocPage.qml — Living Documentation for ChaSetSegmentedControl
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Segmented Control"
    description: "A compact pill-style segmented switch for toolbars, menus, and view toggles."

    property var viewOptions: [
        { label: "Grid", value: "grid", icon: "grid" },
        { label: "List", value: "list", icon: "list" },
        { label: "Gallery", value: "gallery", icon: "table", badge: 3 }
    ]

    property var selectedView: "grid"
    property string currentSize: "default"
    property bool disabledState: false

    ComponentPreview {
        id: heroPreview
        title: "Segmented Control Sandbox"
        reactCode: `<SegmentedControl
  size="${root.currentSize}"
  options={[
    { label: 'Grid', value: 'grid', icon: <GridIcon /> },
    { label: 'List', value: 'list', icon: <ListIcon /> },
    { label: 'Gallery', value: 'gallery', icon: <TableIcon />, badge: 3 }
  ]}
  value="${root.selectedView}"
  disabled={${root.disabledState}}
/>`
        qtCode: `ChaSetSegmentedControl {
    size: "${root.currentSize}"
    options: [
        { label: "Grid", value: "grid", icon: "grid" },
        { label: "List", value: "list", icon: "list" },
        { label: "Gallery", value: "gallery", icon: "table", badge: 3 }
    ]
    value: "${root.selectedView}"
    disabled: ${root.disabledState}
    onValueSelected: (val) => root.selectedView = val
}`

        // Stage Container
        Rectangle {
            anchors.fill: parent
            color: "transparent"

            Column {
                anchors.centerIn: parent
                spacing: 16

                ChaSetSegmentedControl {
                    anchors.horizontalCenter: parent.horizontalCenter
                    size: root.currentSize
                    options: root.viewOptions
                    value: root.selectedView
                    disabled: root.disabledState
                    onValueSelected: function(v) { root.selectedView = v; }
                }

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Selected value: " + root.selectedView
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }
            }
        }

        // Bottom Controls Bar
        controlsData: [
            Row {
                spacing: 12
                DocText {
                    text: "Size:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    anchors.verticalCenter: parent.verticalCenter
                }
                Repeater {
                    model: ["sm", "default", "lg"]
                    delegate: ChaSetButton {
                        required property var modelData
                        size: "sm"
                        variant: root.currentSize === modelData ? "default" : "outline"
                        text: modelData.toUpperCase()
                        onClicked: root.currentSize = modelData
                    }
                }
            },
            Row {
                spacing: 12
                ChaSetCheckbox {
                    size: "sm"
                    label: "Disabled"
                    checked: root.disabledState
                    onToggled: (val) => root.disabledState = val
                }
            }
        ]
    }

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetSegmentedControl {
    model: ["Day", "Week", "Month"]
    currentIndex: 0
}`
        reactCode: `import { SegmentedControl } from '@chahu/cha-set';

<SegmentedControl
  options={[
    { label: 'Day', value: 'day' },
    { label: 'Week', value: 'week' },
  ]}
  value="day"
  onValueChange={(v) => console.log(v)}
/>`
    }



    // Sizes
    DocText {
        text: "Sizes & Badges"
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
                spacing: 16
                width: parent.width

                Column {
                    spacing: 6
                    DocText { text: "Small (sm) - Compact menus & toolbars"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall; font.bold: true }
                    ChaSetSegmentedControl {
                        size: "sm"
                        options: root.viewOptions
                        value: "grid"
                    }
                }

                ChaSetSeparator { width: parent.width }

                Column {
                    spacing: 6
                    DocText { text: "Default - Standard controls"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall; font.bold: true }
                    ChaSetSegmentedControl {
                        size: "default"
                        options: root.viewOptions
                        value: "list"
                    }
                }

                ChaSetSeparator { width: parent.width }

                Column {
                    spacing: 6
                    DocText { text: "Large (lg) - Prominent tabs switch"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall; font.bold: true }
                    ChaSetSegmentedControl {
                        size: "lg"
                        options: root.viewOptions
                        value: "gallery"
                    }
                }
            }
        }
    }

    // Fixed Width & Truncation
    DocText {
        text: "Fixed Width & Truncation"
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
                spacing: 16
                width: parent.width

                Column {
                    spacing: 6
                    DocText { text: "Auto-fit width (hugs content)"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall; font.bold: true }
                    ChaSetSegmentedControl {
                        options: [
                            { label: "Compact", value: "compact" },
                            { label: "Very Long Option Text That Fits Comfortably", value: "long" },
                            { label: "Settings", value: "settings" }
                        ]
                        value: "compact"
                    }
                }

                ChaSetSeparator { width: parent.width }

                Column {
                    spacing: 6
                    DocText { text: "Fixed width with truncation (itemWidth: 120)"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall; font.bold: true }
                    ChaSetSegmentedControl {
                        itemWidth: ThemeTokens.dp(120)
                        options: [
                            { label: "Compact", value: "compact" },
                            { label: "Very Long Option Text That Truncates", value: "long" },
                            { label: "Settings", value: "settings" }
                        ]
                        value: "compact"
                    }
                }
            }
        }
    }

    // Menu & Inline Title
    DocText {
        text: "Menu & Inline Title"
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
            ChaSetSegmentedControl {
                title: "Grid Pattern:"
                size: "sm"
                options: [
                    { label: "Off", value: 0 },
                    { label: "Line", value: 1 },
                    { label: "Dot", value: 2 }
                ]
                value: 1
            }
        }
    }

    // Keyboard Navigation
        ComponentReference {
        name: "SegmentedControl"
        componentId: "segmented-control"
        propsModel: [
            { name: "options", type: "array", default: "[]", description: "Array of segment options: [{ label, value, icon?, badge?, disabled? }]" },
            { name: "value", type: "var", default: "undefined", description: "Currently active selected value" },
            { name: "size", type: "string", default: "'default'", description: "Size variant: 'sm', 'default', or 'lg'" },
            { name: "title", type: "string", default: "''", description: "Optional inline label displayed before the segments" },
            { name: "disabled", type: "bool", default: "false", description: "Whether the segmented control is disabled" },
            { name: "fullWidth", type: "bool", default: "false", description: "Whether segments expand equally across container width" },
            { name: "equalWidth", type: "bool", default: "false", description: "Whether all segments share an identical fixed width while hugging content" },
            { name: "itemWidth", type: "real", default: "undefined", description: "Explicit fixed width allocated to each segment option" }
        ]
    }
}