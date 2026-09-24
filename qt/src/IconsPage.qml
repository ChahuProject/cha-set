// IconsPage.qml — Icon specification contract for both stacks (React & Qt 1:1)
// Geometry lives in spec/icons/registry.json; this page only presents the resolved contract.
import QtQuick 6.10
import ChaSet

DocLayout {
    id: root
    category: "Get Started"
    pageTitle: "Icon System"
    description: "One icon specification for both stacks: single geometry source, one stroke weight, optical centring by construction, and how to switch specifications."
    tocItems: [
        { id: "specification", title: "Active Specification" },
        { id: "rules", title: "Governance Rules" },
        { id: "grids", title: "Grids, Weight & Size" },
        { id: "centering", title: "Optical Centring" },
        { id: "gallery", title: "Icon Gallery" },
        { id: "configuration", title: "External Configuration" },
        { id: "extensibility", title: "Extending the Specification" }
    ]

    readonly property var metrics: ChaSetIcons.metrics
    readonly property var specRows: [
        { label: "Grid", value: root.metrics.grid + " units" },
        { label: "Live area", value: root.metrics.liveArea + " units (safe margin " + (root.metrics.grid - root.metrics.liveArea) / 2 + ")" },
        { label: "Stroke", value: root.metrics.strokeWidth + " units, " + root.metrics.linecap + " caps, " + root.metrics.linejoin + " joins" },
        { label: "Fill policy", value: root.metrics.fillPolicy },
        { label: "Centring tolerance", value: root.metrics.opticalCenterTolerance + " units" },
        { label: "Colour", value: ChaSetIcons.colorPolicy.policy },
        { label: "Resolved through", value: ChaSetIcons.specSource }
    ]

    // The three Scale OSD controls whose glyph/weight drift motivated the whole rule set.
    readonly property var osdControls: ["minus", "plus", "rotate-ccw"]
    // Icons that are exactly centred on their grid, used as visible centring proofs.
    readonly property var centeringProof: ["minus", "plus", "rotate-ccw", "x", "stop", "window-close"]

    readonly property var precedence: [
        { label: "Environment variable CHASET_ICON_SPEC", value: "Highest priority — per shell, per CI job, no file edit." },
        { label: "chaset.config.json → icons.spec", value: "Project-level switch; committed, so the choice travels with the repository." },
        { label: "spec/icons/registry.json → activeSpec", value: "Library-level default when the host declares nothing." },
        { label: "First implemented specification", value: "Last resort, so a missing switch never breaks a build." }
    ]

    readonly property int inlineSvgTotal: {
        var total = 0;
        var sites = ChaSetIcons.adoption.inlineSvgSites;
        for (var i = 0; i < sites.length; i++) total += sites[i].count;
        return total;
    }

    // The tag name is escaped so this prose does not register as hand-authored artwork in
    // the adoption ratchet (which counts literal "<svg" occurrences in component sources).
    readonly property string svgTag: "\u003csvg\u003e"

    readonly property string configSnippet: "{\n  \"icons\": {\n    \"spec\": \"stroke-monoline\"\n  }\n}"
    readonly property string envSnippet: "# Pin every ChaSet icon in this build to one specification\nexport CHASET_ICON_SPEC=stroke-monoline\n\n# An id that is registered but not implemented fails loudly instead of silently\n# falling back — that is the point of the switch.\nexport CHASET_ICON_SPEC=duotone-fill\n#   -> unknown icon specification ... status \"planned\" and carries no geometry"
    readonly property string workflowSnippet: "# 1. Change the specification or the artwork (one place, both stacks)\n$EDITOR spec/icons/registry.json\n\n# 2. Emit the web + desktop artifacts from that geometry\npnpm gen:icons\n\n# 3. Prove the specification still holds\npnpm check:icons"
    readonly property string consumeSnippet: "// Web\n<Icon name=\"rotate-ccw\" className=\"size-4\" />\n<Icon name=\"window-close\" size={10} />   // dense chrome grid, hairline stroke\n\n// Desktop (QML)\nChaSetIcon { name: \"rotate-ccw\"; size: 16; color: ThemeTokens.text }"

    function offsetLabel(name) {
        var entry = ChaSetIcons.audit[name];
        if (entry === undefined || entry === null) return "n/a";
        return "dx " + Number(entry.offsetX).toFixed(2) + " · dy " + Number(entry.offsetY).toFixed(2);
    }

    function twoDigits(value) {
        return (value < 10 ? "0" : "") + value;
    }

    Column {
        width: parent.width
        spacing: ThemeTokens.dp(48)

        // Section 1: Active Specification
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(14)

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(4)
                DocText {
                    text: "Active Specification"
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: "Icons are declared once in spec/icons/registry.json and code-generated into both stacks. React renders the element vocabulary natively; Qt receives the same shapes compiled to path data. Neither stack owns artwork of its own, which is what makes the two platforms agree by construction rather than by review."
                    isMuted: true
                    font.pixelSize: Typography.sizeBody
                    width: parent.width
                    wrapMode: TextEdit.WordWrap
                    height: contentHeight
                }
            }

            Rectangle {
                width: parent.width
                implicitHeight: specCol.implicitHeight + ThemeTokens.dp(36)
                radius: ThemeTokens.dp(8)
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1

                Column {
                    id: specCol
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(12)

                    Row {
                        spacing: ThemeTokens.dp(8)
                        DocText {
                            text: ChaSetIcons.specTitle
                            textColor: ThemeTokens.text
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightSemibold
                        }
                        ChaSetBadge { text: ChaSetIcons.specId; variant: "secondary" }
                        ChaSetBadge { text: ChaSetIcons.names.length + " icons"; variant: "outline" }
                    }

                    Rectangle {
                        width: parent.width
                        height: 1
                        color: ThemeTokens.border
                    }

                    Column {
                        width: parent.width
                        spacing: ThemeTokens.dp(8)

                        Repeater {
                            model: root.specRows
                            delegate: Row {
                                required property var modelData
                                width: parent ? parent.width : 0
                                spacing: ThemeTokens.dp(16)

                                DocText {
                                    text: modelData.label
                                    width: ThemeTokens.dp(160)
                                    isMuted: true
                                    font.pixelSize: Typography.sizeMicro
                                }
                                DocText {
                                    text: modelData.value
                                    width: parent.width - ThemeTokens.dp(160) - parent.spacing
                                    textColor: ThemeTokens.text
                                    isMono: true
                                    font.pixelSize: Typography.sizeSmall
                                    wrapMode: TextEdit.WordWrap
                                    height: contentHeight
                                }
                            }
                        }
                    }
                }
            }
        }

        // Section 2: Governance Rules
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(14)

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(4)
                DocText {
                    text: "Governance Rules"
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: "Each rule below is enforced by pnpm check:icons, which also runs inside pnpm gate. A rule that is not machine-checked would only be a slogan, so the enforcement column names the assertion that fails."
                    isMuted: true
                    font.pixelSize: Typography.sizeBody
                    width: parent.width
                    wrapMode: TextEdit.WordWrap
                    height: contentHeight
                }
            }

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(12)

                Repeater {
                    model: ChaSetIcons.rules
                    delegate: Rectangle {
                        id: ruleCard
                        required property var modelData
                        required property int index
                        width: parent ? parent.width : 0
                        implicitHeight: ruleCol.implicitHeight + ThemeTokens.dp(32)
                        radius: ThemeTokens.dp(8)
                        color: ThemeTokens.panel
                        border.color: ThemeTokens.border
                        border.width: 1

                        Column {
                            id: ruleCol
                            anchors.fill: parent
                            anchors.margins: ThemeTokens.dp(16)
                            spacing: ThemeTokens.dp(8)

                            Row {
                                spacing: ThemeTokens.dp(8)
                                DocText {
                                    text: root.twoDigits(ruleCard.index + 1)
                                    isMuted: true
                                    isMono: true
                                    font.pixelSize: Typography.sizeMicro
                                }
                                DocText {
                                    text: ruleCard.modelData.title
                                    textColor: ThemeTokens.text
                                    font.pixelSize: Typography.sizeSmall
                                    font.weight: Typography.weightSemibold
                                }
                                DocText {
                                    text: ruleCard.modelData.enforcement
                                    isMono: true
                                    font.pixelSize: Typography.sizeMicro
                                    textColor: ThemeTokens.accent
                                }
                            }

                            DocText {
                                text: ruleCard.modelData.statement
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                                width: parent.width
                                wrapMode: TextEdit.WordWrap
                                height: contentHeight
                            }
                        }
                    }
                }
            }
        }

        // Section 3: Grids, Weight & Size
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(20)

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(4)
                DocText {
                    text: "Grids, Weight & Size"
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: "A grid pairs a drawing box with the stroke width that box expects. Two grids are declared: the default 24 unit grid for UI icons, and a dense 10 unit chrome grid whose 1 unit stroke stays hairline on window captions instead of collapsing to a sub-pixel smear. Because the ratio is declared rather than improvised, a 10 unit caption glyph and a 24 unit toolbar glyph end up with the same apparent weight."
                    isMuted: true
                    font.pixelSize: Typography.sizeBody
                    width: parent.width
                    wrapMode: TextEdit.WordWrap
                    height: contentHeight
                }
            }

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(12)

                Repeater {
                    model: ["default", "chrome"]
                    delegate: Rectangle {
                        id: gridCard
                        required property string modelData
                        readonly property var gridData: ChaSetIcons.grids[modelData]
                        readonly property int rampSize: modelData === "chrome" ? 24 : 20
                        width: parent ? parent.width : 0
                        implicitHeight: gridCol.implicitHeight + ThemeTokens.dp(32)
                        radius: ThemeTokens.dp(8)
                        color: ThemeTokens.panel
                        border.color: ThemeTokens.border
                        border.width: 1

                        Column {
                            id: gridCol
                            anchors.fill: parent
                            anchors.margins: ThemeTokens.dp(16)
                            spacing: ThemeTokens.dp(10)

                            Row {
                                spacing: ThemeTokens.dp(8)
                                DocText {
                                    text: gridCard.modelData
                                    textColor: ThemeTokens.text
                                    isMono: true
                                    font.pixelSize: Typography.sizeSmall
                                    font.weight: Typography.weightSemibold
                                }
                                ChaSetBadge {
                                    text: gridCard.gridData.size + " units · stroke " + gridCard.gridData.strokeWidth
                                    variant: "secondary"
                                }
                                DocText {
                                    text: "safe margin " + gridCard.gridData.safeMargin
                                    isMuted: true
                                    isMono: true
                                    font.pixelSize: Typography.sizeMicro
                                }
                            }

                            DocText {
                                text: gridCard.gridData.note
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                                width: parent.width
                                wrapMode: TextEdit.WordWrap
                                height: contentHeight
                            }

                            // The same two window-caption glyphs drawn at both densities: the
                            // 10 unit chrome grid keeps the hairline look the 24 unit grid cannot.
                            Row {
                                spacing: ThemeTokens.dp(24)

                                Repeater {
                                    model: ["window-maximize", "window-restore", "window-close"]
                                    delegate: Column {
                                        id: gridGlyph
                                        required property string modelData
                                        spacing: ThemeTokens.dp(6)

                                        ChaSetIcon {
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            name: gridGlyph.modelData
                                            size: gridCard.rampSize
                                            color: ThemeTokens.text
                                        }
                                        DocText {
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            text: gridGlyph.modelData
                                            isMuted: true
                                            isMono: true
                                            font.pixelSize: Typography.sizeMicro
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            Rectangle {
                width: parent.width
                implicitHeight: weightCol.implicitHeight + ThemeTokens.dp(36)
                radius: ThemeTokens.dp(8)
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1

                Column {
                    id: weightCol
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(12)

                    Row {
                        spacing: ThemeTokens.dp(8)
                        DocText {
                            text: "Weight"
                            textColor: ThemeTokens.text
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightSemibold
                        }
                        ChaSetBadge {
                            text: ChaSetIcons.weights.length + " permitted"
                            variant: "outline"
                        }
                    }

                    Rectangle {
                        width: parent.width
                        height: 1
                        color: ThemeTokens.border
                    }

                    Repeater {
                        model: ChaSetIcons.weights
                        delegate: Row {
                            required property var modelData
                            width: parent ? parent.width : 0
                            spacing: ThemeTokens.dp(16)

                            DocText {
                                text: modelData.label
                                width: ThemeTokens.dp(96)
                                isMuted: true
                                isMono: true
                                font.pixelSize: Typography.sizeMicro
                            }
                            DocText {
                                text: "stroke " + modelData.strokeWidth + " — " + modelData.usage
                                width: parent.width - ThemeTokens.dp(96) - parent.spacing
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeSmall
                                wrapMode: TextEdit.WordWrap
                                height: contentHeight
                            }
                        }
                    }

                    Rectangle {
                        width: parent.width
                        height: 1
                        color: ThemeTokens.border
                    }

                    DocText {
                        text: "Size ramp — one icon, every step of the scale, no hand scaling"
                        isMuted: true
                        font.pixelSize: Typography.sizeMicro
                        font.weight: Typography.weightMedium
                    }

                    Row {
                        spacing: ThemeTokens.dp(20)

                        Repeater {
                            model: ChaSetIcons.sizes.ramp
                            delegate: Column {
                                required property int modelData
                                spacing: ThemeTokens.dp(6)
                                ChaSetIcon {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    name: "search"
                                    size: modelData
                                    color: ThemeTokens.text
                                }
                                DocText {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    text: String(modelData)
                                    isMuted: true
                                    isMono: true
                                    font.pixelSize: Typography.sizeMicro
                                }
                            }
                        }
                    }

                    DocText {
                        text: "Desktop · " + ChaSetIcons.sizes.qt
                        isMuted: true
                        font.pixelSize: Typography.sizeMicro
                    }
                }
            }
        }

        // Section 4: Optical Centring
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(20)

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(4)
                DocText {
                    text: "Optical Centring"
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: "Centring is a property of the geometry, not something a component fixes afterwards. The gate measures the painted bounding box (artwork plus half the stroke) and fails when its centre drifts more than " + root.metrics.opticalCenterTolerance + " units from the grid centre. Anchor offsets and padding are deliberately not an accepted fix: they centre a box, not the ink inside it."
                    isMuted: true
                    font.pixelSize: Typography.sizeBody
                    width: parent.width
                    wrapMode: TextEdit.WordWrap
                    height: contentHeight
                }
            }

            Rectangle {
                width: parent.width
                implicitHeight: osdCol.implicitHeight + ThemeTokens.dp(36)
                radius: ThemeTokens.dp(8)
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1

                Column {
                    id: osdCol
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(16)

                    Row {
                        spacing: ThemeTokens.dp(8)
                        DocText {
                            text: "The Scale OSD control trio"
                            textColor: ThemeTokens.text
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightSemibold
                        }
                        ChaSetBadge { text: "ScaleOsd"; variant: "secondary" }
                    }

                    DocText {
                        text: "These three controls used to be typography: a bold plus, a bold minus sign and a regular reset arrow. Besides the mixed weight, a font's ascent and descent are not symmetric, so the arrow inherited a baseline that pushed it visibly low inside its pill. They are now three icons from this specification — same stroke, same grid, centred by geometry."
                        isMuted: true
                        font.pixelSize: Typography.sizeSmall
                        width: parent.width
                        wrapMode: TextEdit.WordWrap
                        height: contentHeight
                    }

                    Rectangle {
                        width: parent.width
                        height: 1
                        color: ThemeTokens.border
                    }

                    Row {
                        spacing: ThemeTokens.dp(24)

                        Repeater {
                            model: root.osdControls
                            delegate: Column {
                                id: miniProof
                                required property string modelData
                                spacing: ThemeTokens.dp(8)

                                Rectangle {
                                    width: ThemeTokens.dp(48)
                                    height: ThemeTokens.dp(48)
                                    radius: ThemeTokens.dp(6)
                                    color: ThemeTokens.background
                                    border.color: ThemeTokens.border
                                    border.width: 1
                                    anchors.horizontalCenter: parent.horizontalCenter

                                    // Grid centre guides: an icon is centred when both crosshairs pass through it.
                                    Rectangle {
                                        width: parent.width
                                        height: 1
                                        anchors.verticalCenter: parent.verticalCenter
                                        color: ThemeTokens.accent
                                        opacity: 0.45
                                    }
                                    Rectangle {
                                        height: parent.height
                                        width: 1
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        color: ThemeTokens.accent
                                        opacity: 0.45
                                    }

                                    ChaSetIcon {
                                        anchors.centerIn: parent
                                        name: miniProof.modelData
                                        size: 32
                                        color: ThemeTokens.text
                                    }
                                }

                                DocText {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    text: miniProof.modelData
                                    isMuted: true
                                    isMono: true
                                    font.pixelSize: Typography.sizeMicro
                                }
                                DocText {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    text: root.offsetLabel(miniProof.modelData)
                                    isMuted: true
                                    isMono: true
                                    font.pixelSize: Typography.sizeMicro
                                }
                            }
                        }
                    }
                }
            }

            Rectangle {
                width: parent.width
                implicitHeight: auditCol.implicitHeight + ThemeTokens.dp(36)
                radius: ThemeTokens.dp(8)
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1

                Column {
                    id: auditCol
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(12)

                    DocText {
                        text: "Measured offsets — painted centre minus grid centre, in grid units"
                        isMuted: true
                        font.pixelSize: Typography.sizeMicro
                        font.weight: Typography.weightMedium
                    }

                    Flow {
                        width: parent.width
                        spacing: ThemeTokens.dp(12)

                        Repeater {
                            model: root.centeringProof
                            delegate: Rectangle {
                                id: auditTile
                                required property string modelData
                                width: ThemeTokens.dp(112)
                                height: auditTileCol.implicitHeight + ThemeTokens.dp(24)
                                radius: ThemeTokens.dp(6)
                                color: "transparent"
                                border.color: ThemeTokens.border
                                border.width: 1

                                Column {
                                    id: auditTileCol
                                    anchors.fill: parent
                                    anchors.margins: ThemeTokens.dp(12)
                                    spacing: ThemeTokens.dp(6)

                                    ChaSetIcon {
                                        anchors.horizontalCenter: parent.horizontalCenter
                                        name: auditTile.modelData
                                        size: 24
                                        color: ThemeTokens.text
                                    }
                                    DocText {
                                        text: auditTile.modelData
                                        textColor: ThemeTokens.text
                                        isMono: true
                                        font.pixelSize: Typography.sizeMicro
                                    }
                                    DocText {
                                        text: root.offsetLabel(auditTile.modelData)
                                        isMuted: true
                                        isMono: true
                                        font.pixelSize: Typography.sizeMicro
                                    }
                                    DocText {
                                        text: {
                                            var entry = ChaSetIcons.audit[auditTile.modelData];
                                            return "grid " + (entry === undefined || entry === null ? "n/a" : entry.gridSize);
                                        }
                                        isMuted: true
                                        isMono: true
                                        font.pixelSize: Typography.sizeMicro
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Section 5: Icon Gallery
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(20)

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(4)
                DocText {
                    text: "Icon Gallery"
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: "Every icon of the active specification, rendered by name from the generated registry. Adding an icon to the registry makes it appear here on both stacks at once, and the gate refuses a name that has no geometry behind it."
                    isMuted: true
                    font.pixelSize: Typography.sizeBody
                    width: parent.width
                    wrapMode: TextEdit.WordWrap
                    height: contentHeight
                }
            }

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(16)

                Repeater {
                    model: ChaSetIcons.categories
                    delegate: Rectangle {
                        id: categoryCard
                        required property var modelData
                        width: parent ? parent.width : 0
                        implicitHeight: categoryCol.implicitHeight + ThemeTokens.dp(32)
                        radius: ThemeTokens.dp(8)
                        color: ThemeTokens.panel
                        border.color: ThemeTokens.border
                        border.width: 1

                        Column {
                            id: categoryCol
                            anchors.fill: parent
                            anchors.margins: ThemeTokens.dp(16)
                            spacing: ThemeTokens.dp(12)

                            Row {
                                spacing: ThemeTokens.dp(8)
                                DocText {
                                    text: categoryCard.modelData.title
                                    textColor: ThemeTokens.text
                                    font.pixelSize: Typography.sizeSmall
                                    font.weight: Typography.weightSemibold
                                }
                                ChaSetBadge {
                                    text: String(categoryCard.modelData.icons.length)
                                    variant: "secondary"
                                }
                                DocText {
                                    text: categoryCard.modelData.id
                                    isMuted: true
                                    isMono: true
                                    font.pixelSize: Typography.sizeMicro
                                }
                            }

                            Rectangle {
                                width: parent.width
                                height: 1
                                color: ThemeTokens.border
                            }

                            Flow {
                                width: parent.width
                                spacing: ThemeTokens.dp(6)

                                Repeater {
                                    model: categoryCard.modelData.icons
                                    delegate: Column {
                                        id: galleryTile
                                        required property string modelData
                                        width: ThemeTokens.dp(96)
                                        spacing: ThemeTokens.dp(8)

                                        ChaSetIcon {
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            name: galleryTile.modelData
                                            size: 20
                                            color: ThemeTokens.text
                                        }
                                        DocText {
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            text: galleryTile.modelData
                                            isMuted: true
                                            isMono: true
                                            font.pixelSize: Typography.sizeMicro
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Section 6: External Configuration
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(20)

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(4)
                DocText {
                    text: "External Configuration"
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: "A host that wants the whole of ChaSet pinned to one specification does not edit the library. It declares the id externally; the generator bakes the resolved id into both artifacts, so the choice is observable at runtime through ICON_SPEC_ID (web) and ChaSetIcons.specId (desktop)."
                    isMuted: true
                    font.pixelSize: Typography.sizeBody
                    width: parent.width
                    wrapMode: TextEdit.WordWrap
                    height: contentHeight
                }
            }

            Rectangle {
                width: parent.width
                implicitHeight: precedenceCol.implicitHeight + ThemeTokens.dp(36)
                radius: ThemeTokens.dp(8)
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1

                Column {
                    id: precedenceCol
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(12)

                    Row {
                        spacing: ThemeTokens.dp(8)
                        DocText {
                            text: "Resolution order"
                            textColor: ThemeTokens.text
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightSemibold
                        }
                        ChaSetBadge { text: "first match wins"; variant: "outline" }
                    }

                    Rectangle {
                        width: parent.width
                        height: 1
                        color: ThemeTokens.border
                    }

                    Repeater {
                        model: root.precedence
                        delegate: Row {
                            id: precedenceRow
                            required property var modelData
                            required property int index
                            width: parent ? parent.width : 0
                            spacing: ThemeTokens.dp(16)

                            DocText {
                                text: String(precedenceRow.index + 1)
                                width: ThemeTokens.dp(24)
                                isMuted: true
                                isMono: true
                                font.pixelSize: Typography.sizeMicro
                            }
                            DocText {
                                text: precedenceRow.modelData.label
                                width: ThemeTokens.dp(256)
                                textColor: ThemeTokens.text
                                isMono: true
                                font.pixelSize: Typography.sizeSmall
                                wrapMode: TextEdit.WordWrap
                                height: contentHeight
                            }
                            DocText {
                                text: precedenceRow.modelData.value
                                width: parent.width - ThemeTokens.dp(24) - ThemeTokens.dp(256) - parent.spacing * 2
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                                wrapMode: TextEdit.WordWrap
                                height: contentHeight
                            }
                        }
                    }

                    DocText {
                        text: "Currently resolved through " + ChaSetIcons.specSource + "."
                        isMuted: true
                        font.pixelSize: Typography.sizeSmall
                    }
                }
            }

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(16)

                Column {
                    width: parent.width
                    spacing: ThemeTokens.dp(8)

                    DocText {
                        text: "Project configuration file"
                        textColor: ThemeTokens.text
                        font.pixelSize: Typography.sizeCaption
                        font.weight: Typography.weightMedium
                    }
                    DocText {
                        text: "Commit this next to your package manifest to pin the specification for everyone building the project."
                        isMuted: true
                        font.pixelSize: Typography.sizeSmall
                        width: parent.width
                        wrapMode: TextEdit.WordWrap
                        height: contentHeight
                    }
                    ChaSetCodeBlock {
                        width: parent.width
                        filename: "chaset.config.json"
                        language: "json"
                        code: root.configSnippet
                    }
                }

                Column {
                    width: parent.width
                    spacing: ThemeTokens.dp(8)

                    DocText {
                        text: "Environment override"
                        textColor: ThemeTokens.text
                        font.pixelSize: Typography.sizeCaption
                        font.weight: Typography.weightMedium
                    }
                    DocText {
                        text: "Useful for CI matrices that build the same sources under several specifications."
                        isMuted: true
                        font.pixelSize: Typography.sizeSmall
                        width: parent.width
                        wrapMode: TextEdit.WordWrap
                        height: contentHeight
                    }
                    ChaSetCodeBlock {
                        width: parent.width
                        filename: "Terminal"
                        language: "bash"
                        code: root.envSnippet
                    }
                }

                Column {
                    width: parent.width
                    spacing: ThemeTokens.dp(8)

                    DocText {
                        text: "Consuming icons"
                        textColor: ThemeTokens.text
                        font.pixelSize: Typography.sizeCaption
                        font.weight: Typography.weightMedium
                    }
                    ChaSetCodeBlock {
                        width: parent.width
                        filename: "usage.tsx"
                        language: "tsx"
                        code: root.consumeSnippet
                    }
                }
            }
        }

        // Section 7: Extending the Specification
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(20)

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(4)
                DocText {
                    text: "Extending the Specification"
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: "The registry holds a list of specifications, not a single hard-coded one. A new specification is a new entry with its own grid, stroke and artwork; nothing in either stack needs to change, because both consume whichever entry the configuration selects."
                    isMuted: true
                    font.pixelSize: Typography.sizeBody
                    width: parent.width
                    wrapMode: TextEdit.WordWrap
                    height: contentHeight
                }
            }

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(12)

                Repeater {
                    model: ChaSetIcons.specs
                    delegate: Rectangle {
                        id: specCard
                        required property var modelData
                        width: parent ? parent.width : 0
                        implicitHeight: specEntryCol.implicitHeight + ThemeTokens.dp(32)
                        radius: ThemeTokens.dp(8)
                        color: ThemeTokens.panel
                        border.color: ThemeTokens.border
                        border.width: 1

                        Column {
                            id: specEntryCol
                            anchors.fill: parent
                            anchors.margins: ThemeTokens.dp(16)
                            spacing: ThemeTokens.dp(8)

                            Row {
                                spacing: ThemeTokens.dp(8)
                                DocText {
                                    text: specCard.modelData.title
                                    textColor: ThemeTokens.text
                                    font.pixelSize: Typography.sizeSmall
                                    font.weight: Typography.weightSemibold
                                }
                                ChaSetBadge {
                                    text: specCard.modelData.status
                                    variant: specCard.modelData.status === "implemented" ? "secondary" : "outline"
                                }
                                DocText {
                                    text: specCard.modelData.id
                                    isMuted: true
                                    isMono: true
                                    font.pixelSize: Typography.sizeMicro
                                }
                            }

                            DocText {
                                text: specCard.modelData.summary
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                                width: parent.width
                                wrapMode: TextEdit.WordWrap
                                height: contentHeight
                            }
                        }
                    }
                }
            }

            Rectangle {
                width: parent.width
                implicitHeight: workflowCol.implicitHeight + ThemeTokens.dp(36)
                radius: ThemeTokens.dp(8)
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1

                Column {
                    id: workflowCol
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(16)

                    DocText {
                        text: "Workflow"
                        textColor: ThemeTokens.text
                        font.pixelSize: Typography.sizeCaption
                        font.weight: Typography.weightMedium
                    }

                    ChaSetCodeBlock {
                        width: parent.width
                        filename: "Terminal"
                        language: "bash"
                        code: root.workflowSnippet
                    }

                    Row {
                        width: parent.width
                        spacing: ThemeTokens.dp(24)

                        Column {
                            width: (parent.width - parent.spacing) / 2
                            spacing: ThemeTokens.dp(6)
                            DocText {
                                text: "Adoption ratchet"
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeMicro
                                font.weight: Typography.weightMedium
                            }
                            DocText {
                                text: root.inlineSvgTotal + " hand-authored " + root.svgTag + " site(s) remain in the frozen migration backlog against a budget of " + ChaSetIcons.adoption.maxInlineSvgSites + ". The gate fails when that number grows, so the backlog can only shrink."
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                                width: parent.width
                                wrapMode: TextEdit.WordWrap
                                height: contentHeight
                            }
                        }

                        Column {
                            width: (parent.width - parent.spacing) / 2
                            spacing: ThemeTokens.dp(6)
                            DocText {
                                text: "Text glyphs used as icons"
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeMicro
                                font.weight: Typography.weightMedium
                            }
                            DocText {
                                text: ChaSetIcons.adoption.textGlyphSites.length + " remaining. Characters such as plus, minus sign and the reset arrow are typography: they inherit weight, size and baseline from surrounding copy — the mechanism behind both defects this specification was written to remove."
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                                width: parent.width
                                wrapMode: TextEdit.WordWrap
                                height: contentHeight
                            }
                        }
                    }
                }
            }
        }
    }
}
