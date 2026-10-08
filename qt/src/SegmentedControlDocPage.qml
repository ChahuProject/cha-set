// SegmentedControlDocPage.qml — Living Documentation for ChaSetSegmentedControl
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Segmented Control"
    description: ChaSetI18n.tr("components.segmentedControl.description", "A compact pill-style segmented switch for toolbars, menus, and view toggles with icon and badge support.")

    property var viewOptions: [
        { label: ChaSetI18n.tr("formsA.segmentedControl.grid", "Grid"), value: "grid", icon: "grid", tooltip: { text: ChaSetI18n.tr("desktopComposite.segmentedControl.gridTip", "Grid layout"), shortcut: "Ctrl+1" } },
        { label: ChaSetI18n.tr("formsA.segmentedControl.list", "List"), value: "list", icon: "list", tooltip: { text: ChaSetI18n.tr("desktopComposite.segmentedControl.listTip", "List layout"), shortcut: "Ctrl+2" } },
        { label: ChaSetI18n.tr("formsA.segmentedControl.gallery", "Gallery"), value: "gallery", icon: "table", badge: 3, tooltip: { text: ChaSetI18n.tr("desktopComposite.segmentedControl.galleryTip", "Gallery view"), shortcut: "Ctrl+3" } }
    ]

    property var selectedView: "grid"
    property string currentSize: "default"
    property bool disabledState: false

    ComponentPreview {
        id: heroPreview
        title: ChaSetI18n.tr("desktopComposite.segmentedControl.sandboxTitle", "Segmented Control Sandbox")
        reactCode: `<SegmentedControl
  size="${root.currentSize}"
  options={[
    { label: 'Grid', value: 'grid', icon: <GridIcon />, tooltip: { content: 'Grid layout', shortcut: 'Ctrl+1' } },
    { label: 'List', value: 'list', icon: <ListIcon />, tooltip: { content: 'List layout', shortcut: 'Ctrl+2' } },
    { label: 'Gallery', value: 'gallery', icon: <TableIcon />, badge: 3, tooltip: { content: 'Gallery view', shortcut: 'Ctrl+3' } },
  ]}
  value="${root.selectedView}"
  disabled={${root.disabledState}}
/>`
        qtCode: `ChaSetSegmentedControl {
    size: "${root.currentSize}"
    options: [
        { label: "Grid", value: "grid", icon: "grid", tooltip: { text: "Grid layout", shortcut: "Ctrl+1" } },
        { label: "List", value: "list", icon: "list", tooltip: { text: "List layout", shortcut: "Ctrl+2" } },
        { label: "Gallery", value: "gallery", icon: "table", badge: 3, tooltip: { text: "Gallery view", shortcut: "Ctrl+3" } }
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
                    text: ChaSetI18n.tr("formsA.segmentedControl.selectedValue", "Selected value: {{value}}", { value: root.selectedView })
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
                    text: ChaSetI18n.tr("showcase.size", "Size:")
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
                    label: ChaSetI18n.tr("common.disabled", "Disabled")
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
        text: ChaSetI18n.tr("desktopComposite.segmentedControl.sizesBadgesTitle", "Sizes & Badges")
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
                    DocText { text: ChaSetI18n.tr("formsA.segmentedControl.smDesc", "Small (sm) - Compact menus & toolbars"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall; font.bold: true }
                    ChaSetSegmentedControl {
                        size: "sm"
                        options: root.viewOptions
                        value: "grid"
                    }
                }

                ChaSetSeparator { width: parent.width }

                Column {
                    spacing: 6
                    DocText { text: ChaSetI18n.tr("formsA.segmentedControl.defaultDesc", "Default - Standard controls"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall; font.bold: true }
                    ChaSetSegmentedControl {
                        size: "default"
                        options: root.viewOptions
                        value: "list"
                    }
                }

                ChaSetSeparator { width: parent.width }

                Column {
                    spacing: 6
                    DocText { text: ChaSetI18n.tr("formsA.segmentedControl.lgDesc", "Large (lg) - Prominent tabs switch"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall; font.bold: true }
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
        text: ChaSetI18n.tr("desktopComposite.segmentedControl.fixedWidthTitle", "Fixed Width & Truncation")
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
                spacing: ThemeTokens.dp(16)
                width: parent.width

                Column {
                    spacing: ThemeTokens.dp(6)
                    DocText { text: ChaSetI18n.tr("formsA.segmentedControl.autoAdaptiveTitle", "Auto-fit width (hugs content)"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall; font.bold: true }
                    ChaSetSegmentedControl {
                        options: [
                            { label: ChaSetI18n.tr("formsA.segmentedControl.optCompact", "Compact"), value: "compact" },
                            { label: ChaSetI18n.tr("formsA.segmentedControl.optFitComfortably", "Very Long Option Text That Fits Comfortably"), value: "long" },
                            { label: ChaSetI18n.tr("formsA.segmentedControl.optSettings", "Settings"), value: "settings" }
                        ]
                        value: "compact"
                    }
                }

                ChaSetSeparator { width: parent.width }

                Column {
                    spacing: ThemeTokens.dp(6)
                    DocText { text: ChaSetI18n.tr("formsA.segmentedControl.fixedWidthTitle", "Fixed width with truncation (itemWidth: 120)"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall; font.bold: true }
                    ChaSetSegmentedControl {
                        itemWidth: 120
                        options: [
                            { label: ChaSetI18n.tr("formsA.segmentedControl.optCompact", "Compact"), value: "compact" },
                            { label: ChaSetI18n.tr("formsA.segmentedControl.optTruncate", "Very Long Option Text That Truncates"), value: "long" },
                            { label: ChaSetI18n.tr("formsA.segmentedControl.optSettings", "Settings"), value: "settings" }
                        ]
                        value: "compact"
                    }
                }
            }
        }
    }

    // Menu & Inline Title
    DocText {
        text: ChaSetI18n.tr("desktopComposite.segmentedControl.menuInlineTitle", "Menu & Inline Title")
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
                title: ChaSetI18n.tr("formsA.segmentedControl.gridPatternTitle", "Grid Pattern:")
                size: "sm"
                options: [
                    { label: ChaSetI18n.tr("formsA.segmentedControl.off", "Off"), value: 0 },
                    { label: ChaSetI18n.tr("formsA.segmentedControl.line", "Line"), value: 1 },
                    { label: ChaSetI18n.tr("formsA.segmentedControl.dot", "Dot"), value: 2 }
                ]
                value: 1
            }
        }
    }

    // Tooltips & Custom Hints
    DocText {
        text: ChaSetI18n.tr("desktopComposite.segmentedControl.tooltipsHintsTitle", "Tooltips & Custom Hints")
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
                spacing: ThemeTokens.dp(16)
                width: parent.width

                Column {
                    spacing: ThemeTokens.dp(6)
                    DocText { text: ChaSetI18n.tr("desktopComposite.segmentedControl.perOptionTitle", "Per-Option Tooltips with Shortcuts & Arrows"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall; font.bold: true }
                    ChaSetSegmentedControl {
                        options: [
                            { label: ChaSetI18n.tr("desktopComposite.segmentedControl.dayLabel", "Day"), value: "day", tooltip: { text: ChaSetI18n.tr("desktopComposite.segmentedControl.dailyTip", "Daily summary view"), shortcut: "Ctrl+D", arrow: true } },
                            { label: ChaSetI18n.tr("desktopComposite.segmentedControl.weekLabel", "Week"), value: "week", tooltip: { text: ChaSetI18n.tr("desktopComposite.segmentedControl.weeklyTip", "Weekly timeline view"), shortcut: "Ctrl+W", arrow: true } },
                            { label: ChaSetI18n.tr("desktopComposite.segmentedControl.monthLabel", "Month"), value: "month", tooltip: { text: ChaSetI18n.tr("desktopComposite.segmentedControl.monthlyTip", "Monthly overview calendar"), shortcut: "Ctrl+M", arrow: true } },
                            { label: ChaSetI18n.tr("desktopComposite.segmentedControl.yearLabel", "Year"), value: "year", disabled: true, tooltip: { text: ChaSetI18n.tr("desktopComposite.segmentedControl.annualTip", "Annual archive (Requires Pro plan)"), arrow: true } }
                        ]
                        value: "day"
                    }
                }

                ChaSetSeparator { width: parent.width }

                Column {
                    spacing: ThemeTokens.dp(6)
                    DocText { text: ChaSetI18n.tr("desktopComposite.segmentedControl.globalFormatterTitle", "Global tooltipFormatter Customization"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeSmall; font.bold: true }
                    ChaSetSegmentedControl {
                        options: [
                            { label: ChaSetI18n.tr("desktopComposite.segmentedControl.autoLabel", "Auto"), value: "auto" },
                            { label: ChaSetI18n.tr("desktopComposite.segmentedControl.darkLabel", "Dark"), value: "dark" },
                            { label: ChaSetI18n.tr("desktopComposite.segmentedControl.lightLabel", "Light"), value: "light" }
                        ]
                        value: "auto"
                        tooltipSide: "bottom"
                        tooltipFormatter: function(opt) {
                            return { text: ChaSetI18n.tr("desktopComposite.segmentedControl.themeTooltipFormat", "Theme: {{label}} — Switch application color scheme", { label: opt.label }) }
                        }
                    }
                }
            }
        }
    }

    ComponentReference {
        name: "SegmentedControl"
        componentId: "segmented-control"
        propsModel: [
            { name: "options", type: "array", default: "[]", description: ChaSetI18n.tr("components.segmentedControl.optionsDesc", "Array of option objects ({ label, value, icon?, badge?, disabled?, tooltip? }).") },
            { name: "value", type: "var", default: "undefined", description: ChaSetI18n.tr("components.segmentedControl.valueDesc", "Controlled active value.") },
            { name: "size", type: "string", default: "'default'", description: ChaSetI18n.tr("components.segmentedControl.sizeDesc", "Physical dimension variant ('sm', 'default', 'lg').") },
            { name: "title", type: "string", default: "''", description: ChaSetI18n.tr("components.segmentedControl.titleDesc", "Optional prefix label displayed before the segments.") },
            { name: "disabled", type: "bool", default: "false", description: ChaSetI18n.tr("components.segmentedControl.disabledDesc", "Whether the entire segmented control is disabled.") },
            { name: "fullWidth", type: "bool", default: "false", description: ChaSetI18n.tr("components.segmentedControl.fullWidthDesc", "Whether segments expand equally to fill the parent container.") },
            { name: "equalWidth", type: "bool", default: "false", description: ChaSetI18n.tr("components.segmentedControl.equalWidthDesc", "Whether all segments share an identical fixed width while hugging content.") },
            { name: "itemWidth", type: "real", default: "undefined", description: ChaSetI18n.tr("components.segmentedControl.itemWidthDesc", "Explicit fixed width allocated to each segment option.") },
            { name: "tooltipSide", type: "string", default: "'top'", description: ChaSetI18n.tr("components.segmentedControl.tooltipSideDesc", "Default side placement for option tooltips.") },
            { name: "tooltipDelay", type: "int", default: "200", description: ChaSetI18n.tr("components.segmentedControl.tooltipDelayDesc", "Default hover delay duration in ms before displaying option tooltips.") },
            { name: "tooltipFormatter", type: "var", default: "null", description: ChaSetI18n.tr("components.segmentedControl.tooltipFormatterDesc", "Custom formatting function (opt) => text|object for option tooltips") },
            { name: "tooltipDelegate", type: "Component", default: "null", description: ChaSetI18n.tr("components.segmentedControl.tooltipDelegateDesc", "Custom QML Component delegate for rendering rich custom tooltips") }
        ]
    }
}