// IconsPage.qml — Icon specification contract for both stacks (React & Qt 1:1)
// Geometry lives in spec/icons/registry.json; this page only presents the resolved contract.
import QtQuick 6.10
import ChaSet

DocLayout {
    id: root
    category: "Get Started"
    pageTitle: "Icon System"
    description: ChaSetI18n.tr("components.icon-system.description", "One icon specification for both stacks: single geometry source, one stroke weight, optical centring by construction, and how to switch specifications.")
    tocItems: [
        { id: "specification", title: ChaSetI18n.tr("getStarted.icons.specification.title", "Active Specification") },
        { id: "rules", title: ChaSetI18n.tr("getStarted.icons.rules.title", "Governance Rules") },
        { id: "grids", title: ChaSetI18n.tr("getStarted.icons.grids.title", "Grids, Weight & Size") },
        { id: "centering", title: ChaSetI18n.tr("getStarted.icons.centering.title", "Optical Centring") },
        { id: "gallery", title: ChaSetI18n.tr("getStarted.icons.gallery.title", "Icon Gallery") },
        { id: "configuration", title: ChaSetI18n.tr("getStarted.icons.configuration.title", "External Configuration") },
        { id: "extensibility", title: ChaSetI18n.tr("getStarted.icons.extensibility.title", "Extending the Specification") }
    ]

    readonly property var metrics: ChaSetIcons.metrics
    readonly property var specRows: [
        { label: ChaSetI18n.tr("getStarted.icons.specification.rowGrid", "Grid"), value: ChaSetI18n.tr("getStarted.icons.specification.valGrid", "{{grid}} units", { grid: root.metrics.grid }) },
        { label: ChaSetI18n.tr("getStarted.icons.specification.rowLive", "Live area"), value: ChaSetI18n.tr("getStarted.icons.specification.valLive", "{{liveArea}} units (safe margin {{margin}})", { liveArea: root.metrics.liveArea, margin: (root.metrics.grid - root.metrics.liveArea) / 2 }) },
        { label: ChaSetI18n.tr("getStarted.icons.specification.rowStroke", "Stroke"), value: ChaSetI18n.tr("getStarted.icons.specification.valStroke", "{{strokeWidth}} units, {{linecap}} caps, {{linejoin}} joins", { strokeWidth: root.metrics.strokeWidth, linecap: root.metrics.linecap, linejoin: root.metrics.linejoin }) },
        { label: ChaSetI18n.tr("getStarted.icons.specification.rowFill", "Fill policy"), value: root.metrics.fillPolicy },
        { label: ChaSetI18n.tr("getStarted.icons.specification.rowTolerance", "Centring tolerance"), value: ChaSetI18n.tr("getStarted.icons.specification.valTolerance", "{{tolerance}} units", { tolerance: root.metrics.opticalCenterTolerance }) },
        { label: ChaSetI18n.tr("getStarted.icons.specification.rowColour", "Colour"), value: ChaSetIcons.colorPolicy.policy },
        { label: ChaSetI18n.tr("getStarted.icons.specification.rowResolved", "Resolved through"), value: ChaSetIcons.specSource }
    ]

    // The three Scale OSD controls whose glyph/weight drift motivated the whole rule set.
    readonly property var osdControls: ["minus", "plus", "rotate-ccw"]
    // Icons that are exactly centred on their grid, used as visible centring proofs.
    readonly property var centeringProof: ["minus", "plus", "rotate-ccw", "x", "stop", "window-close"]

    readonly property var precedence: [
        { label: ChaSetI18n.tr("getStarted.icons.configuration.stepEnvLabel", "Environment variable CHASET_ICON_SPEC"), value: ChaSetI18n.tr("getStarted.icons.configuration.stepEnvVal", "Highest priority — per shell, per CI job, no file edit.") },
        { label: ChaSetI18n.tr("getStarted.icons.configuration.stepConfigLabel", "chaset.config.json → icons.spec"), value: ChaSetI18n.tr("getStarted.icons.configuration.stepConfigVal", "Project-level switch; committed, so the choice travels with the repository.") },
        { label: ChaSetI18n.tr("getStarted.icons.configuration.stepRegistryLabel", "spec/icons/registry.json → activeSpec"), value: ChaSetI18n.tr("getStarted.icons.configuration.stepRegistryVal", "Library-level default when the host declares nothing.") },
        { label: ChaSetI18n.tr("getStarted.icons.configuration.stepFallbackLabel", "First implemented specification"), value: ChaSetI18n.tr("getStarted.icons.configuration.stepFallbackVal", "Last resort, so a missing switch never breaks a build.") }
    ]

    readonly property int inlineSvgTotal: {
        var total = 0;
        var sites = ChaSetIcons.adoption.inlineSvgSites;
        for (var i = 0; i < sites.length; i++) total += sites[i].count;
        return total;
    }

    readonly property int exemptTotal: {
        var total = 0;
        var sites = ChaSetIcons.adoption.inlineSvgSites;
        for (var i = 0; i < sites.length; i++) total += (sites[i].exempted || 0);
        return total;
    }

    // Exempt sites are surfaced rather than hidden: an escape hatch nobody can see is an
    // escape hatch nobody audits.
    function exemptSummary() {
        var sites = ChaSetIcons.adoption.inlineSvgSites;
        var parts = [];
        for (var i = 0; i < sites.length; i++) {
            var site = sites[i];
            if (!site.exempted) continue;
            var reasons = site.reasons || [];
            for (var j = 0; j < reasons.length; j++) parts.push(site.file + " — " + reasons[j]);
        }
        return parts.length > 0
            ? parts.join("\n")
            : ChaSetI18n.tr("getStarted.icons.extensibility.excusedNone", "None. Every inline artwork site in the repository owes a migration.");
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
                    text: ChaSetI18n.tr("getStarted.icons.specification.title", "Active Specification")
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: ChaSetI18n.tr("getStarted.icons.specification.desc", "Icons are declared once in spec/icons/registry.json and code-generated into both stacks. React renders the element vocabulary natively; Qt receives the same shapes compiled to path data. Neither stack owns artwork of its own, which is what makes the two platforms agree by construction rather than by review.")
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
                        ChaSetBadge {
                            text: ChaSetI18n.tr("getStarted.icons.specification.iconsCount", "{{count}} icons", { count: ChaSetIcons.names.length })
                            variant: "outline"
                        }
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
                    text: ChaSetI18n.tr("getStarted.icons.rules.title", "Governance Rules")
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: ChaSetI18n.tr("getStarted.icons.rules.desc", "Each rule below is enforced by pnpm check:icons, which also runs inside pnpm gate. A rule that is not machine-checked would only be a slogan, so the enforcement column names the assertion that fails.")
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
                    text: ChaSetI18n.tr("getStarted.icons.grids.title", "Grids, Weight & Size")
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: ChaSetI18n.tr("getStarted.icons.grids.desc", "A grid pairs a drawing box with the stroke width that box expects, and states the render size it was drawn for. Two grids are declared: the default 24 unit grid for UI icons, drawn for a 16px render, and a dense 10 unit chrome grid whose 1 unit stroke stays hairline on window captions instead of collapsing to a sub-pixel smear. Because the ratio and the target are declared rather than improvised, a 10 unit caption glyph and a 24 unit toolbar glyph end up with the same apparent weight — and a glyph rendered below its grid's target is a number the gate can name instead of a defect a reviewer has to notice.")
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
                                    text: ChaSetI18n.tr("getStarted.icons.grids.gridBadge", "{{size}} units · stroke {{strokeWidth}}", { size: gridCard.gridData.size, strokeWidth: gridCard.gridData.strokeWidth })
                                    variant: "secondary"
                                }
                                DocText {
                                    text: ChaSetI18n.tr("getStarted.icons.grids.safeMargin", "safe margin {{margin}}", { margin: gridCard.gridData.safeMargin })
                                    isMuted: true
                                    isMono: true
                                    font.pixelSize: Typography.sizeMicro
                                }
                                DocText {
                                    text: ChaSetI18n.tr("getStarted.icons.grids.drawnFor", "drawn for {{renderSize}}px → {{stroke}}px stroke", { renderSize: gridCard.gridData.renderSize, stroke: gridCard.gridData.strokeAtRenderSize })
                                    isMuted: true
                                    isMono: true
                                    font.pixelSize: Typography.sizeMicro
                                }
                                DocText {
                                    text: ChaSetI18n.tr("getStarted.icons.grids.floor", "floor {{size}} / {{strokeWidth}} = {{floor}}px", { size: gridCard.gridData.size, strokeWidth: gridCard.gridData.strokeWidth, floor: gridCard.gridData.strokeFloor })
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

                            DocText {
                                text: ChaSetI18n.tr("getStarted.icons.grids.gridDesc", "{{renderSize}}px is the size this grid was drawn for, where its stroke paints {{stroke}}px — the weight the artwork was proportioned to carry. Under {{floor}}px that stroke is under a pixel and the glyph ships lighter than its artwork declares, so the steps this grid is honest at are {{sizes}}. A size outside that list is not a smaller icon, it is a lighter one — measured rather than banned, because a 2x display forgives it, so the gate lists every reference below its floor and each one is a decision instead of an accident.", {
                                    renderSize: gridCard.gridData.renderSize,
                                    stroke: gridCard.gridData.strokeAtRenderSize,
                                    floor: gridCard.gridData.strokeFloor,
                                    sizes: gridCard.gridData.renderSizes.join(", ")
                                })
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
                implicitHeight: familyCol.implicitHeight + ThemeTokens.dp(32)
                radius: ThemeTokens.dp(8)
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1

                Column {
                    id: familyCol
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(12)

                    Row {
                        spacing: ThemeTokens.dp(8)
                        DocText {
                            text: ChaSetI18n.tr("getStarted.icons.grids.familiesTitle", "Control families")
                            textColor: ThemeTokens.text
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightSemibold
                        }
                        ChaSetBadge {
                            text: ChaSetI18n.tr("getStarted.icons.grids.familiesDeclared", "{{count}} declared", { count: ChaSetIcons.families.length })
                            variant: "outline"
                        }
                    }

                    DocText {
                        text: ChaSetI18n.tr("getStarted.icons.grids.familiesDesc", "A family names icons that render together inside one control. Their grid is then a promise about the control rather than about any single icon, which is what the caption close button broke: every icon involved was individually valid, and the row was still wrong. The gate asserts that no family spans two grids.")
                        isMuted: true
                        font.pixelSize: Typography.sizeSmall
                        width: parent.width
                        wrapMode: TextEdit.WordWrap
                        height: contentHeight
                    }

                    Repeater {
                        model: ChaSetIcons.families
                        delegate: Rectangle {
                            id: familyCard
                            required property var modelData
                            width: parent ? parent.width : 0
                            implicitHeight: memberCol.implicitHeight + ThemeTokens.dp(24)
                            radius: ThemeTokens.dp(6)
                            color: ThemeTokens.background
                            border.color: ThemeTokens.border
                            border.width: 1

                            readonly property string familyGrid: {
                                var members = familyCard.modelData.icons;
                                if (!members || members.length === 0) return "default";
                                var audit = ChaSetIcons.audit[members[0]];
                                return audit ? audit.grid : "default";
                            }

                            Column {
                                id: memberCol
                                anchors.fill: parent
                                anchors.margins: ThemeTokens.dp(12)
                                spacing: ThemeTokens.dp(10)

                                Row {
                                    spacing: ThemeTokens.dp(8)
                                    DocText {
                                        text: familyCard.modelData.id
                                        isMono: true
                                        font.pixelSize: Typography.sizeMicro
                                    }
                                    DocText {
                                        text: familyCard.modelData.title
                                        isMuted: true
                                        font.pixelSize: Typography.sizeMicro
                                    }
                                    ChaSetBadge {
                                        text: ChaSetI18n.tr("getStarted.icons.grids.unitGridBadge", "{{size}} unit grid", { size: ChaSetIcons.grids[familyCard.familyGrid].size })
                                        variant: "secondary"
                                    }
                                }

                                Flow {
                                    width: parent.width
                                    spacing: ThemeTokens.dp(12)
                                    Repeater {
                                        model: familyCard.modelData.icons
                                        delegate: Row {
                                            id: familyMember
                                            required property string modelData
                                            spacing: ThemeTokens.dp(6)

                                            readonly property string memberGrid: {
                                                var audit = ChaSetIcons.audit[familyMember.modelData];
                                                return audit ? audit.grid : "default";
                                            }

                                            ChaSetIcon {
                                                anchors.verticalCenter: parent.verticalCenter
                                                name: familyMember.modelData
                                                size: ChaSetIcons.grids[familyMember.memberGrid].strokeFloor
                                                color: ThemeTokens.text
                                            }
                                            DocText {
                                                anchors.verticalCenter: parent.verticalCenter
                                                text: familyMember.modelData
                                                isMuted: true
                                                isMono: true
                                                font.pixelSize: Typography.sizeMicro
                                            }
                                        }
                                    }
                                }

                                DocText {
                                    text: familyCard.modelData.note
                                    isMuted: true
                                    font.pixelSize: Typography.sizeMicro
                                    width: parent.width
                                    wrapMode: TextEdit.WordWrap
                                    height: contentHeight
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
                            text: ChaSetI18n.tr("getStarted.icons.grids.weightTitle", "Weight")
                            textColor: ThemeTokens.text
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightSemibold
                        }
                        ChaSetBadge {
                            text: ChaSetI18n.tr("getStarted.icons.grids.weightPermitted", "{{count}} permitted", { count: ChaSetIcons.weights.length })
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
                                text: ChaSetI18n.tr("getStarted.icons.grids.weightStrokePrefix", "stroke {{strokeWidth}} — ", { strokeWidth: modelData.strokeWidth }) + modelData.usage
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
                        text: ChaSetI18n.tr("getStarted.icons.grids.sizeRampTitle", "Size ramp — one icon, every step of the scale, no hand scaling")
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
                        text: ChaSetI18n.tr("getStarted.icons.grids.desktopLabel", "Desktop · {{size}}", { size: ChaSetIcons.sizes.qt })
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
                    text: ChaSetI18n.tr("getStarted.icons.centering.title", "Optical Centring")
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: ChaSetI18n.tr("getStarted.icons.centering.desc", "Centring is a property of the geometry, not something a component fixes afterwards. The gate measures the painted bounding box (artwork plus half the stroke) and fails when its centre drifts more than {{tolerance}} units from the grid centre. Anchors offsets and padding are deliberately not an accepted fix: they centre a box, not the ink inside it.", { tolerance: root.metrics.opticalCenterTolerance })
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
                            text: ChaSetI18n.tr("getStarted.icons.centering.osdTrioTitle", "The Scale OSD control trio")
                            textColor: ThemeTokens.text
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightSemibold
                        }
                        ChaSetBadge { text: "ScaleOsd"; variant: "secondary" }
                    }

                    DocText {
                        text: ChaSetI18n.tr("getStarted.icons.centering.osdTrioDesc", "These three controls used to be typography: a bold plus, a bold minus sign and a regular reset arrow. Besides the mixed weight, a font's ascent and descent are not symmetric, so the arrow inherited a baseline that pushed it visibly low inside its pill. They are now three icons from this specification — same stroke, same grid, centred by geometry.")
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
                        text: ChaSetI18n.tr("getStarted.icons.centering.measuredOffsetsTitle", "Measured offsets — painted centre minus grid centre, in grid units")
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
                    text: ChaSetI18n.tr("getStarted.icons.gallery.title", "Icon Gallery")
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: ChaSetI18n.tr("getStarted.icons.gallery.desc", "Every icon of the active specification, rendered by name from the generated registry. Adding an icon to the registry makes it appear here on both stacks at once, and the gate refuses a name that has no geometry behind it.")
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
                                    delegate: Rectangle {
                                        id: galleryTile
                                        required property string modelData
                                        width: ThemeTokens.dp(100)
                                        height: ThemeTokens.dp(64)
                                        radius: ThemeTokens.dp(6)
                                        color: tileHover.hovered ? ThemeTokens.hover : "transparent"
                                        border.color: tileHover.hovered ? ThemeTokens.border : "transparent"
                                        border.width: 1

                                        HoverHandler { id: tileHover }

                                        Column {
                                            anchors.centerIn: parent
                                            spacing: ThemeTokens.dp(6)

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
        }

        // Section 6: External Configuration
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(20)

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(4)
                DocText {
                    text: ChaSetI18n.tr("getStarted.icons.configuration.title", "External Configuration")
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: ChaSetI18n.tr("getStarted.icons.configuration.desc", "A host that wants the whole of ChaSet pinned to one specification does not edit the library. It declares the id externally; the generator bakes the resolved id into both artifacts, so the choice is observable at runtime through ICON_SPEC_ID (web) and ChaSetIcons.specId (desktop).")
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
                            text: ChaSetI18n.tr("getStarted.icons.configuration.resolutionOrder", "Resolution order")
                            textColor: ThemeTokens.text
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightSemibold
                        }
                        ChaSetBadge {
                            text: ChaSetI18n.tr("getStarted.icons.configuration.firstMatchWins", "first match wins")
                            variant: "outline"
                        }
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
                        text: ChaSetI18n.tr("getStarted.icons.configuration.currentlyResolved", "Currently resolved through {{source}}.", { source: ChaSetIcons.specSource })
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
                        text: ChaSetI18n.tr("getStarted.icons.configuration.projectConfigFile", "Project configuration file")
                        textColor: ThemeTokens.text
                        font.pixelSize: Typography.sizeCaption
                        font.weight: Typography.weightMedium
                    }
                    DocText {
                        text: ChaSetI18n.tr("getStarted.icons.configuration.projectConfigDesc", "Commit this next to your package manifest to pin the specification for everyone building the project.")
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
                        text: ChaSetI18n.tr("getStarted.icons.configuration.envOverride", "Environment override")
                        textColor: ThemeTokens.text
                        font.pixelSize: Typography.sizeCaption
                        font.weight: Typography.weightMedium
                    }
                    DocText {
                        text: ChaSetI18n.tr("getStarted.icons.configuration.envOverrideDesc", "Useful for CI matrices that build the same sources under several specifications.")
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
                        text: ChaSetI18n.tr("getStarted.icons.configuration.consumingIcons", "Consuming icons")
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
                    text: ChaSetI18n.tr("getStarted.icons.extensibility.title", "Extending the Specification")
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: ChaSetI18n.tr("getStarted.icons.extensibility.desc", "The registry holds a list of specifications, not a single hard-coded one. A new specification is a new entry with its own grid, stroke and artwork; nothing in either stack needs to change, because both consume whichever entry the configuration selects.")
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
                        text: ChaSetI18n.tr("getStarted.icons.extensibility.workflow", "Workflow")
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
                                text: ChaSetI18n.tr("getStarted.icons.extensibility.adoptionRatchet", "Adoption ratchet")
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeMicro
                                font.weight: Typography.weightMedium
                            }
                            DocText {
                                text: ChaSetI18n.tr("getStarted.icons.extensibility.adoptionRatchetDesc", "{{total}} hand-authored <svg> site(s) remain in the frozen migration backlog against a budget of {{budget}}. The gate fails when that number grows, so the backlog can only shrink.", { total: root.inlineSvgTotal, budget: ChaSetIcons.adoption.maxInlineSvgSites })
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
                                text: ChaSetI18n.tr("getStarted.icons.extensibility.textGlyphsTitle", "Text glyphs used as icons")
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeMicro
                                font.weight: Typography.weightMedium
                            }
                            DocText {
                                text: ChaSetI18n.tr("getStarted.icons.extensibility.textGlyphsDesc", "{{count}} remaining. Characters such as plus, minus sign and the reset arrow are typography: they inherit weight, size and baseline from surrounding copy — the mechanism behind both defects this specification was written to remove.", { count: ChaSetIcons.adoption.textGlyphSites.length })
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                                width: parent.width
                                wrapMode: TextEdit.WordWrap
                                height: contentHeight
                            }
                        }
                    }

                    Column {
                        width: parent.width
                        spacing: ThemeTokens.dp(6)
                        DocText {
                            text: ChaSetI18n.tr("getStarted.icons.extensibility.excusedTitle", "Excused as non-iconography ({{total}})", { total: root.exemptTotal })
                            textColor: ThemeTokens.text
                            font.pixelSize: Typography.sizeMicro
                            font.weight: Typography.weightMedium
                        }
                        DocText {
                            text: root.exemptSummary()
                            isMuted: true
                            font.pixelSize: Typography.sizeSmall
                            width: parent.width
                            wrapMode: TextEdit.WordWrap
                            height: contentHeight
                        }
                        DocText {
                            text: ChaSetI18n.tr("getStarted.icons.extensibility.excusedFootnote", "Parametric vector art has no 24-grid stroke representation, so leaving it inside the budget would make the budget permanently unreachable. It is excluded instead — visibly, and only through a marker that carries a reason and must sit directly above the artwork it excuses. A marker that is unreasoned, dangling, or not attached to a following <svg> fails the gate.")
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
