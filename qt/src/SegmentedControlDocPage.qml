// SegmentedControlDocPage.qml — Living Documentation for ChaSetSegmentedControl
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Segmented Control"
    description: "A compact pill-style segmented switch for toolbars, menus, and view toggles."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "sizes", title: "Sizes" },
        { id: "menu", title: "Menu & Inline Title" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property var viewOptions: [
        { label: "Grid", value: "grid" },
        { label: "List", value: "list" },
        { label: "Gallery", value: "gallery" }
    ]

    property var selectedView: "grid"
    property string currentSize: "default"
    property bool disabledState: false

    ComponentPreview {
        id: heroPreview
        title: "Interactive Sandbox"
        reactCode: `<SegmentedControl
  size="${root.currentSize}"
  options={[
    { label: 'Grid', value: 'grid' },
    { label: 'List', value: 'list' },
    { label: 'Gallery', value: 'gallery' }
  ]}
  value="${root.selectedView}"
  disabled={${root.disabledState}}
/>`
        qtCode: `ChaSetSegmentedControl {
    size: "${root.currentSize}"
    options: [
        { label: "Grid", value: "grid" },
        { label: "List", value: "list" },
        { label: "Gallery", value: "gallery" }
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

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Selected value: " + root.selectedView
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                }
            }
        }

        // Bottom Controls Bar
        controlsData: [
            Row {
                spacing: 12
                Text {
                    text: "Size:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 11
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

    // Sizes
    Text {
        text: "Sizes"
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
                spacing: 16
                width: parent.width

                Column {
                    spacing: 6
                    Text { text: "Small (22px) - Compact menus & toolbars"; color: ThemeTokens.subduedText; font.pixelSize: 12; font.bold: true }
                    ChaSetSegmentedControl {
                        size: "sm"
                        options: root.viewOptions
                        value: "grid"
                    }
                }

                ChaSetSeparator { width: parent.width }

                Column {
                    spacing: 6
                    Text { text: "Default (28px) - Standard controls"; color: ThemeTokens.subduedText; font.pixelSize: 12; font.bold: true }
                    ChaSetSegmentedControl {
                        size: "default"
                        options: root.viewOptions
                        value: "list"
                    }
                }

                ChaSetSeparator { width: parent.width }

                Column {
                    spacing: 6
                    Text { text: "Large (36px) - Prominent tabs switch"; color: ThemeTokens.subduedText; font.pixelSize: 12; font.bold: true }
                    ChaSetSegmentedControl {
                        size: "lg"
                        options: root.viewOptions
                        value: "gallery"
                    }
                }
            }
        }
    }

    // Menu & Inline Title
    Text {
        text: "Menu & Inline Title"
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
    Text {
        text: "Keyboard Navigation"
        font.pixelSize: 18
        font.bold: true
        color: ThemeTokens.text
    }

    KeyboardShortcutsTable {
        componentId: "segmented-control"
    }

    // Props Reference
    PropsTable {
        title: "Props Reference"
        props: [
            { name: "options", type: "array", default: "[]", description: "Array of segment options: [{ label, value, disabled? }]" },
            { name: "value", type: "var", default: "undefined", description: "Currently active selected value" },
            { name: "size", type: "string", default: "'default'", description: "Size variant: 'sm' (22px), 'default' (28px), or 'lg' (36px)" },
            { name: "title", type: "string", default: "''", description: "Optional inline label displayed before the segments" },
            { name: "disabled", type: "bool", default: "false", description: "Whether the segmented control is disabled" },
            { name: "fullWidth", type: "bool", default: "false", description: "Whether segments expand equally across container width" }
        ]
    }
}
