// SliderDocPage.qml — Documentation and interactive sandbox for ChaSetSlider
// Unified Slider covering Single Value, Range Interval, Snap Presets, and Commit-on-Release.
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Slider"
    description: ChaSetI18n.tr("components.slider.description", "An interactive control for selecting single numeric values, min-max ranges, or discrete presets along a track.")

    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent

    // Mode: single, range, snap
    property string demoMode: "single"

    // Single mode demo state
    property real demoSingle: 50
    property real committedSingle: 50

    // Range mode demo state
    property real demoRangeLow: 25
    property real demoRangeHigh: 75
    property real committedRangeLow: 25
    property real committedRangeHigh: 75

    // Snap mode demo state
    property int demoSnapIndex: 2
    property int committedSnapIndex: 2
    readonly property var snapLabels: ["0.5x", "1.0x", "1.5x", "2.0x", "3.0x"]

    // Controls state
    property real demoStep: 1
    property string demoSize: "default"
    property string demoOrientation: "horizontal"
    property bool demoCommitOnRelease: false
    property bool demoDisabled: false
    property bool demoReadOnly: false
    property bool demoShowTooltip: true
    property bool demoShowTicks: false

    // Card state for commit-on-release demo
    property real cardCommitLive: 60
    property real cardCommitted: 60

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: ChaSetI18n.tr("desktopComposite.slider.sandboxTitle", "Slider Sandbox")
        reactCode: root.demoMode === "range"
            ? `<Slider range value={[${root.demoRangeLow}, ${root.demoRangeHigh}]} min={0} max={100} step={${root.demoStep}} size="${root.demoSize}" commitOnRelease={${root.demoCommitOnRelease}} disabled={${root.demoDisabled}} readOnly={${root.demoReadOnly}} showTooltip={${root.demoShowTooltip}} showTicks={${root.demoShowTicks}} orientation="${root.demoOrientation}" onValueChange={setRange} />`
            : root.demoMode === "snap"
            ? `<Slider count={5} value={${root.demoSnapIndex}} labels={['0.5x', '1.0x', '1.5x', '2.0x', '3.0x']} leftLabel="${ChaSetI18n.tr("formsA.snapSlider.slow", "Slow")}" rightLabel="${ChaSetI18n.tr("formsA.snapSlider.fast", "Fast")}" showTicks size="${root.demoSize}" commitOnRelease={${root.demoCommitOnRelease}} disabled={${root.demoDisabled}} readOnly={${root.demoReadOnly}} onValueChange={setIndex} />`
            : `<Slider value={${root.demoSingle}} min={0} max={100} step={${root.demoStep}} size="${root.demoSize}" commitOnRelease={${root.demoCommitOnRelease}} disabled={${root.demoDisabled}} readOnly={${root.demoReadOnly}} showTooltip={${root.demoShowTooltip}} showTicks={${root.demoShowTicks}} orientation="${root.demoOrientation}" onValueChange={setValue} />`

        qtCode: root.demoMode === "range"
            ? `ChaSetSlider {\n    width: 420\n    range: true\n    firstValue: ${root.demoRangeLow}\n    secondValue: ${root.demoRangeHigh}\n    min: 0\n    max: 100\n    step: ${root.demoStep}\n    size: "${root.demoSize}"\n    commitOnRelease: ${root.demoCommitOnRelease}\n    disabled: ${root.demoDisabled}\n    readOnly: ${root.demoReadOnly}\n    showTooltip: ${root.demoShowTooltip}\n    showTicks: ${root.demoShowTicks}\n    orientation: "${root.demoOrientation}"\n    onValuesChanged: function(low, high) { /* ... */ }\n}`
            : root.demoMode === "snap"
            ? `ChaSetSlider {\n    width: 420\n    count: 5\n    value: ${root.demoSnapIndex}\n    labels: ["0.5x", "1.0x", "1.5x", "2.0x", "3.0x"]\n    leftLabel: "${ChaSetI18n.tr("formsA.snapSlider.slow", "Slow")}"\n    rightLabel: "${ChaSetI18n.tr("formsA.snapSlider.fast", "Fast")}"\n    showTicks: true\n    size: "${root.demoSize}"\n    commitOnRelease: ${root.demoCommitOnRelease}\n    disabled: ${root.demoDisabled}\n    readOnly: ${root.demoReadOnly}\n}`
            : `ChaSetSlider {\n    width: 420\n    value: ${root.demoSingle}\n    min: 0\n    max: 100\n    step: ${root.demoStep}\n    size: "${root.demoSize}"\n    commitOnRelease: ${root.demoCommitOnRelease}\n    disabled: ${root.demoDisabled}\n    readOnly: ${root.demoReadOnly}\n    showTooltip: ${root.demoShowTooltip}\n    showTicks: ${root.demoShowTicks}\n    orientation: "${root.demoOrientation}"\n    onValueMoved: function(val) { /* ... */ }\n}`

        stageData: [
            Item {
                anchors.centerIn: parent
                width: root.demoOrientation === "horizontal"
                    ? Math.min(parent.width - ThemeTokens.dp(48), ThemeTokens.dp(440))
                    : ThemeTokens.dp(60)
                height: root.demoOrientation === "horizontal" ? ThemeTokens.dp(80) : ThemeTokens.dp(220)

                Column {
                    anchors.centerIn: parent
                    spacing: ThemeTokens.dp(10)
                    width: root.demoOrientation === "horizontal" ? parent.width : undefined

                    // Telemetry Header
                    Item {
                        visible: root.demoOrientation === "horizontal"
                        width: parent.width
                        height: ThemeTokens.dp(18)

                        Text {
                            anchors.left: parent.left
                            anchors.verticalCenter: parent.verticalCenter
                            color: root.cMutedFg
                            font.pixelSize: Typography.sizeSmall
                            text: {
                                if (root.demoMode === "range") {
                                    return ChaSetI18n.tr("formsA.slider.rangeLabel", "Range: {{min}} - {{max}}", {
                                        min: Math.round(root.demoRangeLow),
                                        max: Math.round(root.demoRangeHigh)
                                    });
                                } else if (root.demoMode === "snap") {
                                    return ChaSetI18n.tr("formsA.snapSlider.presetLabel", "Preset:") + " " + root.snapLabels[root.demoSnapIndex];
                                } else {
                                    return root.demoCommitOnRelease
                                        ? ChaSetI18n.tr("formsA.slider.liveDrag", "Live Drag: {{value}}", { value: root.demoSingle })
                                        : ChaSetI18n.tr("formsA.slider.valueLabel", "Value:");
                                }
                            }
                        }

                        Text {
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                            color: root.cFg
                            font.pixelSize: Typography.sizeSmall
                            font.weight: Typography.weightSemibold
                            font.family: Typography.familyMono
                            text: {
                                if (root.demoMode === "range") {
                                    return root.demoCommitOnRelease
                                        ? ChaSetI18n.tr("formsA.slider.committed", "Committed: {{value}}", { value: "[" + root.committedRangeLow + ", " + root.committedRangeHigh + "]" })
                                        : "[" + Math.round(root.demoRangeLow) + ", " + Math.round(root.demoRangeHigh) + "]";
                                } else if (root.demoMode === "snap") {
                                    return root.demoCommitOnRelease
                                        ? ChaSetI18n.tr("formsA.slider.committed", "Committed: {{value}}", { value: root.snapLabels[root.committedSnapIndex] })
                                        : root.snapLabels[root.demoSnapIndex];
                                } else {
                                    return root.demoCommitOnRelease
                                        ? ChaSetI18n.tr("formsA.slider.committed", "Committed: {{value}}", { value: root.committedSingle })
                                        : root.demoSingle.toString();
                                }
                            }
                        }
                    }

                    // Sandbox Slider Instance
                    ChaSetSlider {
                        id: sandboxSlider
                        width: root.demoOrientation === "horizontal" ? parent.width : ThemeTokens.dp(20)
                        height: root.demoOrientation === "horizontal" ? ThemeTokens.dp(20) : ThemeTokens.dp(160)
                        range: root.demoMode === "range"
                        value: root.demoSingle
                        firstValue: root.demoRangeLow
                        secondValue: root.demoRangeHigh
                        min: 0
                        max: root.demoMode === "snap" ? 4 : 100
                        step: root.demoMode === "snap" ? 1 : root.demoStep
                        count: root.demoMode === "snap" ? 5 : 0
                        labels: root.demoMode === "snap" ? root.snapLabels : []
                        leftLabel: root.demoMode === "snap" ? ChaSetI18n.tr("formsA.snapSlider.slow", "Slow") : ""
                        rightLabel: root.demoMode === "snap" ? ChaSetI18n.tr("formsA.snapSlider.fast", "Fast") : ""
                        size: root.demoSize
                        orientation: root.demoOrientation
                        commitOnRelease: root.demoCommitOnRelease
                        disabled: root.demoDisabled
                        readOnly: root.demoReadOnly
                        showTooltip: root.demoShowTooltip
                        showTicks: root.demoShowTicks || (root.demoMode === "snap")

                        onValueMoved: function(val) {
                            if (root.demoMode === "snap") {
                                root.demoSnapIndex = Math.round(val);
                            } else {
                                root.demoSingle = val;
                            }
                        }
                        onValueCommitted: function(val) {
                            if (root.demoMode === "snap") {
                                root.committedSnapIndex = Math.round(val);
                            } else {
                                root.committedSingle = val;
                            }
                        }
                        onValuesChanged: function(low, high) {
                            root.demoRangeLow = low;
                            root.demoRangeHigh = high;
                        }
                        onValuesCommitted: function(low, high) {
                            root.committedRangeLow = low;
                            root.committedRangeHigh = high;
                        }
                    }

                    Text {
                        visible: root.demoOrientation === "vertical"
                        anchors.horizontalCenter: parent.horizontalCenter
                        color: root.cFg
                        font.pixelSize: Typography.sizeSmall
                        font.family: Typography.familyMono
                        text: root.demoMode === "range"
                            ? Math.round(root.demoRangeLow) + " - " + Math.round(root.demoRangeHigh)
                            : root.demoMode === "snap"
                            ? root.snapLabels[root.demoSnapIndex]
                            : root.demoSingle.toString()
                    }
                }
            }
        ]

        controlsData: [
            Row {
                spacing: ThemeTokens.dp(12)

                // Mode Selector
                Row {
                    spacing: ThemeTokens.dp(6)
                    DocText {
                        text: ChaSetI18n.tr("formsA.slider.modeLabel", "Mode:")
                        color: root.cMutedFg
                        font.pixelSize: Typography.sizeSmall
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetSegmentedControl {
                        anchors.verticalCenter: parent.verticalCenter
                        size: "sm"
                        value: root.demoMode
                        options: [
                            { label: ChaSetI18n.tr("formsA.slider.modeSingle", "Single"), value: "single" },
                            { label: ChaSetI18n.tr("formsA.slider.modeRange", "Range"), value: "range" },
                            { label: ChaSetI18n.tr("formsA.slider.modeSnap", "Snap"), value: "snap" }
                        ]
                        onValueSelected: function(val) { root.demoMode = val; }
                    }
                }

                // Size Selector
                Row {
                    spacing: ThemeTokens.dp(6)
                    DocText {
                        text: ChaSetI18n.tr("showcase.size", "Size:")
                        color: root.cMutedFg
                        font.pixelSize: Typography.sizeSmall
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetSegmentedControl {
                        anchors.verticalCenter: parent.verticalCenter
                        size: "sm"
                        value: root.demoSize
                        options: [
                            { label: ChaSetI18n.tr("formsA.slider.sizeDefault", "Default"), value: "default" },
                            { label: ChaSetI18n.tr("formsA.slider.sizeSm", "Small (sm)"), value: "sm" }
                        ]
                        onValueSelected: function(val) { root.demoSize = val; }
                    }
                }

                // Orientation Selector
                Row {
                    spacing: ThemeTokens.dp(6)
                    DocText {
                        text: ChaSetI18n.tr("formsA.slider.orientationLabel", "Orientation:")
                        color: root.cMutedFg
                        font.pixelSize: Typography.sizeSmall
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetSegmentedControl {
                        anchors.verticalCenter: parent.verticalCenter
                        size: "sm"
                        value: root.demoOrientation
                        options: [
                            { label: ChaSetI18n.tr("formsA.slider.horizontal", "Horizontal"), value: "horizontal" },
                            { label: ChaSetI18n.tr("formsA.slider.vertical", "Vertical"), value: "vertical" }
                        ]
                        onValueSelected: function(val) { root.demoOrientation = val; }
                    }
                }

                // Step Selector
                Row {
                    spacing: ThemeTokens.dp(6)
                    DocText {
                        text: ChaSetI18n.tr("formsA.slider.stepLabel", "Step:")
                        color: root.cMutedFg
                        font.pixelSize: Typography.sizeSmall
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetSegmentedControl {
                        anchors.verticalCenter: parent.verticalCenter
                        size: "sm"
                        value: String(root.demoStep)
                        options: [
                            { label: "1", value: "1" },
                            { label: "5", value: "5" },
                            { label: "10", value: "10" },
                            { label: "25", value: "25" }
                        ]
                        onValueSelected: function(val) { root.demoStep = parseFloat(val); }
                    }
                }
            },

            // Toggles Row
            Row {
                spacing: ThemeTokens.dp(16)

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.slider.commitOnRelease", "Commit on Release")
                    checked: root.demoCommitOnRelease
                    onToggled: function(val) { root.demoCommitOnRelease = val; }
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.slider.tooltip", "Tooltip")
                    checked: root.demoShowTooltip
                    onToggled: function(val) { root.demoShowTooltip = val; }
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.slider.ticks", "Ticks")
                    checked: root.demoShowTicks
                    onToggled: function(val) { root.demoShowTicks = val; }
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("formsA.slider.readOnly", "Read-Only")
                    checked: root.demoReadOnly
                    onToggled: function(val) { root.demoReadOnly = val; }
                    anchors.verticalCenter: parent.verticalCenter
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: ChaSetI18n.tr("common.disabled", "Disabled")
                    checked: root.demoDisabled
                    onToggled: function(val) { root.demoDisabled = val; }
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
        ]
    }

    // Section 2: Anatomy
    DocAnatomy {
        sectionId: "anatomy"
        width: parent.width
        qtCode: `import ChaSet\n\n// Single Value Slider\nChaSetSlider {\n    width: 320\n    value: 50\n    min: 0\n    max: 100\n    step: 1\n    showTooltip: true\n    onValueMoved: volume = value\n}\n\n// Range Interval Slider\nChaSetSlider {\n    width: 320\n    range: true\n    firstValue: 20\n    secondValue: 80\n    onValuesChanged: function(low, high) { /* ... */ }\n}`
        reactCode: `import { Slider } from '@chahu/cha-set';\n\n// Single Value Slider\n<Slider value={50} min={0} max={100} step={1} showTooltip onValueChange={setValue} />\n\n// Range Interval Slider\n<Slider range value={[20, 80]} min={0} max={100} onValueChange={setRange} />\n\n// Snap Preset Slider\n<Slider count={5} labels={['1x', '2x', '3x', '4x', '5x']} showTicks />`
    }

    // Section 3: Examples & States
    Column {
        property string sectionId: "states"
        width: parent.width
        spacing: ThemeTokens.dp(12)

        DocText {
            text: ChaSetI18n.tr("desktopComposite.slider.examplesTitle", "Examples & States")
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: ChaSetI18n.tr("formsA.slider.examplesSubtitle", "Visual matrix of common slider configurations, size scales, tooltips, and interactive states.")
            color: root.cMutedFg
            font.pixelSize: Typography.sizeBody
        }

        Grid {
            width: parent.width
            columns: 2
            spacing: ThemeTokens.dp(16)

            // Card 1: Floating Value Tooltip
            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("formsA.slider.floatingTooltipTitle", "Floating Value Tooltip"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    DocText { text: ChaSetI18n.tr("formsA.slider.floatingTooltipDesc", "Interactive formatted indicator on thumb drag and hover"); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                    Item { width: parent.width; height: ThemeTokens.dp(6) }
                    ChaSetSlider {
                        width: parent.width - ThemeTokens.dp(28)
                        value: 75
                        min: 0
                        max: 100
                        step: 1
                        showTooltip: true
                        formatValue: function(v) { return v + "%"; }
                    }
                }
            }

            // Card 2: Commit on Release (拖动撒手生效)
            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(6)

                    Item {
                        width: parent.width - ThemeTokens.dp(28)
                        height: ThemeTokens.dp(18)
                        DocText {
                            anchors.left: parent.left
                            anchors.verticalCenter: parent.verticalCenter
                            text: ChaSetI18n.tr("formsA.slider.commitOnReleaseTitle", "Commit on Release")
                            color: root.cFg
                            font.pixelSize: Typography.sizeSmall
                            font.weight: Typography.weightSemibold
                        }
                        DocText {
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                            text: ChaSetI18n.tr("formsA.slider.committed", "Committed: {{value}}", { value: root.cardCommitted })
                            color: root.cPrimary
                            font.pixelSize: Typography.sizeSmall
                            font.weight: Typography.weightSemibold
                            font.family: Typography.familyMono
                        }
                    }

                    DocText { text: ChaSetI18n.tr("formsA.slider.commitOnReleaseDesc", "Dragging updates live feedback while values only commit upon pointer release"); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                    DocText { text: ChaSetI18n.tr("formsA.slider.liveDrag", "Live Drag: {{value}}", { value: root.cardCommitLive }); color: root.cMutedFg; font.pixelSize: Typography.sizeMicro }
                    Item { width: parent.width; height: ThemeTokens.dp(2) }

                    ChaSetSlider {
                        width: parent.width - ThemeTokens.dp(28)
                        value: 60
                        min: 0
                        max: 100
                        commitOnRelease: true
                        showTooltip: true
                        onValueMoved: function(v) { root.cardCommitLive = v; }
                        onValueCommitted: function(v) { root.cardCommitted = v; }
                    }
                }
            }

            // Card 3: Dual-Thumb Range Slider
            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("formsA.slider.rangeTitle", "Dual-Thumb Range Slider"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    DocText { text: ChaSetI18n.tr("formsA.slider.rangeDesc", "Select min-max numerical intervals with collision prevention and active span fill"); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                    Item { width: parent.width; height: ThemeTokens.dp(6) }
                    ChaSetSlider {
                        width: parent.width - ThemeTokens.dp(28)
                        range: true
                        firstValue: 20
                        secondValue: 80
                        min: 0
                        max: 100
                        showTooltip: true
                        minStepsBetweenThumbs: 5
                    }
                }
            }

            // Card 4: Discrete Snap Slider with Presets
            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("formsA.slider.snapTitle", "Discrete Snap Slider with Presets"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    DocText { text: ChaSetI18n.tr("formsA.slider.snapDesc", "Snap to discrete stops with preset labels and step marks"); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                    Item { width: parent.width; height: ThemeTokens.dp(4) }
                    ChaSetSlider {
                        width: parent.width - ThemeTokens.dp(28)
                        count: 5
                        value: 1
                        labels: ["0.5x", "1.0x", "1.5x", "2.0x", "3.0x"]
                        leftLabel: ChaSetI18n.tr("formsA.snapSlider.slow", "Slow")
                        rightLabel: ChaSetI18n.tr("formsA.snapSlider.fast", "Fast")
                        showTicks: true
                    }
                }
            }

            // Card 5: Compact Size (sm)
            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("formsA.slider.compactTitle", "Compact Size (sm)"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    DocText { text: ChaSetI18n.tr("formsA.slider.compactDesc", "Reduced track thickness and thumb size for toolbars"); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                    Item { width: parent.width; height: ThemeTokens.dp(6) }
                    ChaSetSlider {
                        width: parent.width - ThemeTokens.dp(28)
                        size: "sm"
                        value: 40
                        min: 0
                        max: 100
                    }
                }
            }

            // Card 6: Discrete Stops with Ticks
            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("formsA.slider.ticksTitle", "Discrete Stops with Ticks"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    DocText { text: ChaSetI18n.tr("formsA.slider.ticksDesc", "Quantized stops with tick indicators and label marks"); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                    Item { width: parent.width; height: ThemeTokens.dp(6) }
                    ChaSetSlider {
                        width: parent.width - ThemeTokens.dp(28)
                        value: 50
                        min: 0
                        max: 100
                        step: 25
                        showTicks: true
                        marks: ["0%", "25%", "50%", "75%", "100%"]
                    }
                }
            }

            // Card 7: Read-Only State
            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("formsA.slider.readOnlyTitle", "Read-Only State"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    DocText { text: ChaSetI18n.tr("formsA.slider.readOnlyDesc", "Locked value without dimmed 50% opacity"); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                    Item { width: parent.width; height: ThemeTokens.dp(6) }
                    ChaSetSlider {
                        width: parent.width - ThemeTokens.dp(28)
                        readOnly: true
                        value: 60
                        min: 0
                        max: 100
                    }
                }
            }

            // Card 8: Disabled State
            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(14)
                    bottomPadding: ThemeTokens.dp(14)
                    leftPadding: ThemeTokens.dp(14)
                    rightPadding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: ChaSetI18n.tr("formsA.slider.disabledTitle", "Disabled State"); color: root.cFg; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    DocText { text: ChaSetI18n.tr("formsA.slider.disabledDesc", "Non-interactive with dimmed opacity for disabled controls"); color: root.cMutedFg; font.pixelSize: Typography.sizeCaption }
                    Item { width: parent.width; height: ThemeTokens.dp(6) }
                    ChaSetSlider {
                        width: parent.width - ThemeTokens.dp(28)
                        disabled: true
                        value: 45
                        min: 0
                        max: 100
                    }
                }
            }
        }
    }

    DocMarkdown {
        width: parent.width
        docId: "slider"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "slider"
        section: "props"
    }
}
