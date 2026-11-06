// SpacingGuidePage.qml — Spacing and information density guidelines matching React 1:1
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Get Started"
    pageTitle: ChaSetI18n.tr("getStarted.spacing.title", "Spacing & Density")
    description: ChaSetI18n.tr("getStarted.spacing.desc", "Desktop space aesthetics, spacing scale, information density, and form layout guidelines for React & Qt.")
    tocItems: [
        { id: "principles", title: ChaSetI18n.tr("showcase.toc.principles", "Core Principles") },
        { id: "scale", title: ChaSetI18n.tr("showcase.toc.scale", "Spacing Scale") },
        { id: "forms", title: ChaSetI18n.tr("showcase.toc.forms", "Form Patterns") },
        { id: "containers", title: ChaSetI18n.tr("showcase.toc.containers", "Container Sizes") },
        { id: "checklist", title: ChaSetI18n.tr("showcase.toc.checklist", "Checklist") }
    ]

    readonly property var scaleSteps: ShowcaseData.spacingScale.scaleSteps
    readonly property var modalTiers: ShowcaseData.spacingScale.modalTiers

    Column {
        width: parent.width
        spacing: ThemeTokens.dp(36)

        // Section 1: Principles
        Column {
            property string sectionId: "principles"
            width: parent.width
            spacing: ThemeTokens.dp(12)

            DocText {
                text: ChaSetI18n.tr("getStarted.spacing.principles.title", "Desktop Space Aesthetics: Four Golden Laws")
                textColor: ThemeTokens.text
                font.pixelSize: Typography.sizeTitleSm
                font.weight: Typography.weightBold
            }

            DocText {
                text: ChaSetI18n.tr("getStarted.spacing.principles.desc", "Negative space is a tool for hierarchical grouping and visual breathing. In desktop applications, negative space must never devolve into an empty dead void. Eliminate hollow voids and horizontal asymmetry while preserving compact, orderly density.")
                isMuted: true
                font.pixelSize: Typography.sizeBody
                width: parent.width
                wrap: true
            }

            Grid {
                columns: 2
                spacing: ThemeTokens.dp(14)
                width: parent.width

                ChaSetCard {
                    width: (parent.width - ThemeTokens.dp(14)) / 2
                    customRadius: 8
                    Column {
                        width: parent.width
                        padding: ThemeTokens.dp(16)
                        spacing: ThemeTokens.dp(8)

                        Row {
                            spacing: ThemeTokens.dp(8)
                            ChaSetBadge {
                                text: ChaSetI18n.tr("getStarted.spacing.principles.law1", "Law 1")
                                variant: "outline"
                            }
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.principles.law1Title", "Hug-Content First")
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
                            }
                        }
                        DocText {
                            text: ChaSetI18n.tr("getStarted.spacing.principles.law1Desc", "Dialogs, sheets, and cards must auto-hug content vertically by default. Fixed heights that create cavernous dead space are strictly prohibited.")
                            isMuted: true
                            font.pixelSize: Typography.sizeSmall
                            width: parent.width - ThemeTokens.dp(32)
                            wrap: true
                        }
                    }
                }

                ChaSetCard {
                    width: (parent.width - ThemeTokens.dp(14)) / 2
                    customRadius: 8
                    Column {
                        width: parent.width
                        padding: ThemeTokens.dp(16)
                        spacing: ThemeTokens.dp(8)

                        Row {
                            spacing: ThemeTokens.dp(8)
                            ChaSetBadge {
                                text: ChaSetI18n.tr("getStarted.spacing.principles.law2", "Law 2")
                                variant: "outline"
                            }
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.principles.law2Title", "Top-Aligned Scan Flow")
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
                            }
                        }
                        DocText {
                            text: ChaSetI18n.tr("getStarted.spacing.principles.law2Desc", "Lightweight modal forms enforce top-aligned labels with full-width inputs, preventing left-side margin waste and horizontal visual rupture.")
                            isMuted: true
                            font.pixelSize: Typography.sizeSmall
                            width: parent.width - ThemeTokens.dp(32)
                            wrap: true
                        }
                    }
                }

                ChaSetCard {
                    width: (parent.width - ThemeTokens.dp(14)) / 2
                    customRadius: 8
                    Column {
                        width: parent.width
                        padding: ThemeTokens.dp(16)
                        spacing: ThemeTokens.dp(8)

                        Row {
                            spacing: ThemeTokens.dp(8)
                            ChaSetBadge {
                                text: ChaSetI18n.tr("getStarted.spacing.principles.law3", "Law 3")
                                variant: "outline"
                            }
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.principles.law3Title", "Compact Rhythm & Density")
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
                            }
                        }
                        DocText {
                            text: ChaSetI18n.tr("getStarted.spacing.principles.law3Desc", "Say goodbye to bloated mobile-style p-8 paddings. Standard desktop container padding converges to p-5 (20px) with cohesive, proportional rhythm.")
                            isMuted: true
                            font.pixelSize: Typography.sizeSmall
                            width: parent.width - ThemeTokens.dp(32)
                            wrap: true
                        }
                    }
                }

                ChaSetCard {
                    width: (parent.width - ThemeTokens.dp(14)) / 2
                    customRadius: 8
                    Column {
                        width: parent.width
                        padding: ThemeTokens.dp(16)
                        spacing: ThemeTokens.dp(8)

                        Row {
                            spacing: ThemeTokens.dp(8)
                            ChaSetBadge {
                                text: ChaSetI18n.tr("getStarted.spacing.principles.law4", "Law 4")
                                variant: "outline"
                            }
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.principles.law4Title", "Single Divider & Surface Elevation")
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
                            }
                        }
                        DocText {
                            text: ChaSetI18n.tr("getStarted.spacing.principles.law4Desc", "Keep exactly one soft divider between content and footer. Double borders are banned, and footer padding is compact (py-3.5) for a sturdy finish.")
                            isMuted: true
                            font.pixelSize: Typography.sizeSmall
                            width: parent.width - ThemeTokens.dp(32)
                            wrap: true
                        }
                    }
                }
            }
        }

        // Section 2: Spacing Scale Table
        Column {
            property string sectionId: "scale"
            width: parent.width
            spacing: ThemeTokens.dp(12)

            DocText {
                text: ChaSetI18n.tr("getStarted.spacing.scale.title", "Standard Spacing Scale")
                textColor: ThemeTokens.text
                font.pixelSize: Typography.sizeTitleSm
                font.weight: Typography.weightBold
            }

            DocText {
                text: ChaSetI18n.tr("getStarted.spacing.scale.desc", "Unified spatial metrics mapped 1:1 across React Tailwind rem and Qt ThemeTokens.dp scale.")
                isMuted: true
                font.pixelSize: Typography.sizeBody
                width: parent.width
                wrap: true
            }

            ChaSetCard {
                width: parent.width
                customRadius: 8

                Column {
                    id: scaleTableCol
                    width: parent.width

                    // Table Header
                    Rectangle {
                        width: parent.width
                        height: ThemeTokens.dp(38)
                        color: ThemeTokens.mutedBackground
                        border.color: ThemeTokens.border
                        border.width: 1

                        Row {
                            anchors.fill: parent
                            anchors.leftMargin: ThemeTokens.dp(16)
                            anchors.rightMargin: ThemeTokens.dp(16)
                            spacing: ThemeTokens.dp(12)

                            DocText {
                                width: ThemeTokens.dp(130)
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("getStarted.spacing.scale.colLevel", "Level")
                                font.weight: Typography.weightMedium
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                            }
                            DocText {
                                width: ThemeTokens.dp(100)
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("getStarted.spacing.scale.colRem", "Rem / Dp")
                                font.weight: Typography.weightMedium
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                            }
                            DocText {
                                width: ThemeTokens.dp(90)
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("getStarted.spacing.scale.colPx", "Physical Base")
                                font.weight: Typography.weightMedium
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                            }
                            DocText {
                                width: ThemeTokens.dp(140)
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("getStarted.spacing.scale.colSpecimen", "Thickness Specimen")
                                font.weight: Typography.weightMedium
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                            }
                            DocText {
                                width: scaleTableCol.width - ThemeTokens.dp(480)
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("getStarted.spacing.scale.colUsage", "Typical Application")
                                font.weight: Typography.weightMedium
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                            }
                        }
                    }

                    // Table Rows
                    Repeater {
                        model: root.scaleSteps
                        delegate: Rectangle {
                            required property var modelData
                            required property int index
                            width: scaleTableCol.width
                            height: ThemeTokens.dp(44)
                            color: index % 2 === 0 ? "transparent" : ThemeTokens.mutedBackground
                            border.color: ThemeTokens.border
                            border.width: 1

                            Row {
                                anchors.fill: parent
                                anchors.leftMargin: ThemeTokens.dp(16)
                                anchors.rightMargin: ThemeTokens.dp(16)
                                spacing: ThemeTokens.dp(12)

                                Row {
                                    width: ThemeTokens.dp(130)
                                    anchors.verticalCenter: parent.verticalCenter
                                    spacing: ThemeTokens.dp(4)
                                    DocText {
                                        text: modelData.name
                                        textColor: ThemeTokens.text
                                        font.weight: Typography.weightMedium
                                        font.pixelSize: Typography.sizeSmall
                                    }
                                    DocText {
                                        text: "(" + modelData.nameZh + ")"
                                        isMuted: true
                                        font.pixelSize: Typography.sizeMicro
                                    }
                                }

                                DocText {
                                    width: ThemeTokens.dp(100)
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: modelData.rem
                                    textColor: ThemeTokens.accent
                                    font.pixelSize: Typography.sizeSmall
                                }

                                DocText {
                                    width: ThemeTokens.dp(90)
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: modelData.px + "px"
                                    isMuted: true
                                    font.pixelSize: Typography.sizeSmall
                                }

                                Item {
                                    width: ThemeTokens.dp(140)
                                    height: parent.height
                                    Rectangle {
                                        anchors.verticalCenter: parent.verticalCenter
                                        width: ThemeTokens.dp(modelData.px)
                                        height: ThemeTokens.dp(12)
                                        radius: 2
                                        color: ThemeTokens.accent
                                    }
                                }

                                DocText {
                                    width: scaleTableCol.width - ThemeTokens.dp(480)
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: ChaSetI18n.locale.startsWith("zh") ? modelData.usageZh : modelData.usage
                                    isMuted: true
                                    font.pixelSize: Typography.sizeSmall
                                    elide: Text.ElideRight
                                }
                            }
                        }
                    }
                }
            }
        }

        // Section 3: Forms Patterns (Recommended vs Anti-Pattern)
        Column {
            property string sectionId: "forms"
            width: parent.width
            spacing: ThemeTokens.dp(12)

            DocText {
                text: ChaSetI18n.tr("getStarted.spacing.forms.title", "Form Layout Patterns: Best Practice vs Anti-Pattern")
                textColor: ThemeTokens.text
                font.pixelSize: Typography.sizeTitleSm
                font.weight: Typography.weightBold
            }

            DocText {
                text: ChaSetI18n.tr("getStarted.spacing.forms.desc", "Visual comparison illustrating why top-aligned labels eliminate whitespace defects in dialogs.")
                isMuted: true
                font.pixelSize: Typography.sizeBody
                width: parent.width
                wrap: true
            }

            Row {
                width: parent.width
                spacing: ThemeTokens.dp(20)

                // Recommended Box
                ChaSetCard {
                    width: (parent.width - ThemeTokens.dp(20)) / 2
                    customRadius: 8
                    Column {
                        width: parent.width
                        padding: ThemeTokens.dp(18)
                        spacing: ThemeTokens.dp(14)

                        Row {
                            spacing: ThemeTokens.dp(8)
                            ChaSetBadge {
                                text: ChaSetI18n.tr("getStarted.spacing.forms.recommended", "Recommended")
                                variant: "default"
                            }
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.forms.topAlignedTitle", "Top-Aligned Single-Track")
                                textColor: ThemeTokens.text
                                font.weight: Typography.weightSemibold
                                font.pixelSize: Typography.sizeBody
                            }
                        }

                        // Form demo preview
                        Rectangle {
                            width: parent.width - ThemeTokens.dp(36)
                            implicitHeight: formRecCol.implicitHeight + ThemeTokens.dp(24)
                            height: implicitHeight
                            radius: 6
                            color: ThemeTokens.background
                            border.color: ThemeTokens.border
                            border.width: 1

                            Column {
                                id: formRecCol
                                width: parent.width - ThemeTokens.dp(24)
                                anchors.centerIn: parent
                                spacing: ThemeTokens.dp(12)

                                Column {
                                    width: parent.width
                                    spacing: ThemeTokens.dp(6)

                                    DocText {
                                        text: ChaSetI18n.tr("getStarted.spacing.forms.nameLabel", "Name")
                                        font.pixelSize: Typography.sizeSmall
                                        font.weight: Typography.weightMedium
                                    }

                                    ChaSetInput {
                                        width: parent.width
                                        text: ChaSetI18n.tr("getStarted.spacing.forms.sampleName", "Alex Rivera")
                                        readOnly: true
                                    }
                                }

                                Column {
                                    width: parent.width
                                    spacing: ThemeTokens.dp(6)

                                    DocText {
                                        text: ChaSetI18n.tr("getStarted.spacing.forms.usernameLabel", "Username")
                                        font.pixelSize: Typography.sizeSmall
                                        font.weight: Typography.weightMedium
                                    }

                                    ChaSetInput {
                                        width: parent.width
                                        text: ChaSetI18n.tr("getStarted.spacing.forms.sampleUsername", "@arivera")
                                        readOnly: true
                                    }
                                }
                            }
                        }

                        DocText {
                            text: "• " + ChaSetI18n.tr("getStarted.spacing.forms.recPoint1", "Direct vertical eye scanning with zero zig-zag") + "\n• " + ChaSetI18n.tr("getStarted.spacing.forms.recPoint2", "Full width input with zero wasted horizontal margin") + "\n• " + ChaSetI18n.tr("getStarted.spacing.forms.recPoint3", "Naturally resilient to multi-language string expansion")
                            isMuted: true
                            font.pixelSize: Typography.sizeSmall
                            lineHeight: 1.4
                            width: parent.width - ThemeTokens.dp(36)
                            wrap: true
                        }
                    }
                }

                // Anti-pattern Box
                ChaSetCard {
                    width: (parent.width - ThemeTokens.dp(20)) / 2
                    customRadius: 8
                    Column {
                        width: parent.width
                        padding: ThemeTokens.dp(18)
                        spacing: ThemeTokens.dp(14)

                        Row {
                            spacing: ThemeTokens.dp(8)
                            ChaSetBadge {
                                text: ChaSetI18n.tr("getStarted.spacing.forms.antiPattern", "Anti-Pattern")
                                variant: "destructive"
                            }
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.forms.gridTitle", "Rigid Percentage Grid")
                                textColor: ThemeTokens.text
                                font.weight: Typography.weightSemibold
                                font.pixelSize: Typography.sizeBody
                            }
                        }

                        // Form demo preview
                        Rectangle {
                            width: parent.width - ThemeTokens.dp(36)
                            height: ThemeTokens.dp(146)
                            radius: 6
                            color: ThemeTokens.background
                            border.color: ThemeTokens.border
                            border.width: 1

                            Column {
                                anchors.fill: parent
                                anchors.margins: ThemeTokens.dp(14)
                                spacing: ThemeTokens.dp(10)

                                Row {
                                    width: parent.width
                                    spacing: ThemeTokens.dp(10)
                                    DocText {
                                        width: ThemeTokens.dp(70)
                                        anchors.verticalCenter: parent.verticalCenter
                                        horizontalAlignment: Text.AlignRight
                                        text: ChaSetI18n.tr("getStarted.spacing.forms.nameLabel", "Name") + ":"
                                        textColor: ThemeTokens.destructive
                                        font.pixelSize: Typography.sizeSmall
                                        font.weight: Typography.weightMedium
                                    }
                                    ChaSetInput {
                                        width: parent.width - ThemeTokens.dp(80)
                                        text: ChaSetI18n.tr("getStarted.spacing.forms.sampleName", "Alex Rivera")
                                        readOnly: true
                                        opacity: 0.6
                                    }
                                }

                                Row {
                                    width: parent.width
                                    spacing: ThemeTokens.dp(10)
                                    DocText {
                                        width: ThemeTokens.dp(70)
                                        anchors.verticalCenter: parent.verticalCenter
                                        horizontalAlignment: Text.AlignRight
                                        text: ChaSetI18n.tr("getStarted.spacing.forms.usernameLabel", "Username") + ":"
                                        textColor: ThemeTokens.destructive
                                        font.pixelSize: Typography.sizeSmall
                                        font.weight: Typography.weightMedium
                                    }
                                    ChaSetInput {
                                        width: parent.width - ThemeTokens.dp(80)
                                        text: ChaSetI18n.tr("getStarted.spacing.forms.sampleUsername", "@arivera")
                                        readOnly: true
                                        opacity: 0.6
                                    }
                                }
                            }
                        }

                        DocText {
                            text: "• " + ChaSetI18n.tr("getStarted.spacing.forms.antiPoint1", "Wastes 100px+ of dead space to the left of short labels") + "\n• " + ChaSetI18n.tr("getStarted.spacing.forms.antiPoint2", "Forces asymmetric form weight heavily to the right") + "\n• " + ChaSetI18n.tr("getStarted.spacing.forms.antiPoint3", "Interrupts natural reading flow from title to input fields")
                            isMuted: true
                            font.pixelSize: Typography.sizeSmall
                            lineHeight: 1.4
                            width: parent.width - ThemeTokens.dp(36)
                            wrap: true
                        }
                    }
                }
            }
        }

        // Section 4: Modal & Container Sizing Tiers
        Column {
            property string sectionId: "containers"
            width: parent.width
            spacing: ThemeTokens.dp(12)

            DocText {
                text: ChaSetI18n.tr("getStarted.spacing.containers.title", "Modal & Container Sizing Guidelines")
                textColor: ThemeTokens.text
                font.pixelSize: Typography.sizeTitleSm
                font.weight: Typography.weightBold
            }

            DocText {
                text: ChaSetI18n.tr("getStarted.spacing.containers.desc", "Pre-calibrated width tiers paired with mandatory vertical auto-hug containment.")
                isMuted: true
                font.pixelSize: Typography.sizeBody
                width: parent.width
                wrap: true
            }

            ChaSetCard {
                width: parent.width
                customRadius: 8

                Column {
                    id: modalTableCol
                    width: parent.width

                    // Table Header
                    Rectangle {
                        width: parent.width
                        height: ThemeTokens.dp(38)
                        color: ThemeTokens.mutedBackground
                        border.color: ThemeTokens.border
                        border.width: 1

                        Row {
                            anchors.fill: parent
                            anchors.leftMargin: ThemeTokens.dp(16)
                            anchors.rightMargin: ThemeTokens.dp(16)
                            spacing: ThemeTokens.dp(12)

                            DocText {
                                width: ThemeTokens.dp(150)
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("getStarted.spacing.containers.colTier", "Size Tier")
                                font.weight: Typography.weightMedium
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                            }
                            DocText {
                                width: ThemeTokens.dp(130)
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("getStarted.spacing.containers.colWidthRem", "Width Range")
                                font.weight: Typography.weightMedium
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                            }
                            DocText {
                                width: ThemeTokens.dp(120)
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("getStarted.spacing.containers.colWidthPx", "Physical Base")
                                font.weight: Typography.weightMedium
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                            }
                            DocText {
                                width: ThemeTokens.dp(160)
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("getStarted.spacing.containers.colCapacity", "Form Capacity")
                                font.weight: Typography.weightMedium
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                            }
                            DocText {
                                width: modalTableCol.width - ThemeTokens.dp(590)
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("getStarted.spacing.containers.colUseCase", "Typical Use Cases")
                                font.weight: Typography.weightMedium
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                            }
                        }
                    }

                    // Table Rows
                    Repeater {
                        model: root.modalTiers
                        delegate: Rectangle {
                            required property var modelData
                            required property int index
                            width: modalTableCol.width
                            height: ThemeTokens.dp(44)
                            color: index % 2 === 0 ? "transparent" : ThemeTokens.mutedBackground
                            border.color: ThemeTokens.border
                            border.width: 1

                            Row {
                                anchors.fill: parent
                                anchors.leftMargin: ThemeTokens.dp(16)
                                anchors.rightMargin: ThemeTokens.dp(16)
                                spacing: ThemeTokens.dp(12)

                                DocText {
                                    width: ThemeTokens.dp(150)
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: modelData.size
                                    textColor: ThemeTokens.text
                                    font.weight: Typography.weightMedium
                                    font.pixelSize: Typography.sizeSmall
                                }

                                DocText {
                                    width: ThemeTokens.dp(130)
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: modelData.widthRem
                                    textColor: ThemeTokens.accent
                                    font.pixelSize: Typography.sizeSmall
                                }

                                DocText {
                                    width: ThemeTokens.dp(120)
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: modelData.widthPx
                                    isMuted: true
                                    font.pixelSize: Typography.sizeSmall
                                }

                                DocText {
                                    width: ThemeTokens.dp(160)
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: ChaSetI18n.locale.startsWith("zh") ? modelData.capZh : modelData.cap
                                    textColor: ThemeTokens.text
                                    font.pixelSize: Typography.sizeSmall
                                    elide: Text.ElideRight
                                }

                                DocText {
                                    width: modalTableCol.width - ThemeTokens.dp(590)
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: ChaSetI18n.locale.startsWith("zh") ? modelData.useCaseZh : modelData.useCase
                                    isMuted: true
                                    font.pixelSize: Typography.sizeSmall
                                    elide: Text.ElideRight
                                }
                            }
                        }
                    }
                }
            }
        }

        // Section 5: Design & Code Review Checklist
        Column {
            property string sectionId: "checklist"
            width: parent.width
            spacing: ThemeTokens.dp(12)

            DocText {
                text: ChaSetI18n.tr("getStarted.spacing.checklist.title", "Design & Code Review Checklist")
                textColor: ThemeTokens.text
                font.pixelSize: Typography.sizeTitleSm
                font.weight: Typography.weightBold
            }

            DocText {
                text: ChaSetI18n.tr("getStarted.spacing.checklist.desc", "Verify every pull request against these five spatial health checks before merging:")
                isMuted: true
                font.pixelSize: Typography.sizeBody
                width: parent.width
                wrap: true
            }

            ChaSetCard {
                width: parent.width
                customRadius: 8

                Column {
                    width: parent.width
                    padding: ThemeTokens.dp(20)
                    spacing: ThemeTokens.dp(14)

                    // Item 1
                    Row {
                        width: parent.width - ThemeTokens.dp(40)
                        spacing: ThemeTokens.dp(12)

                        Rectangle {
                            width: ThemeTokens.dp(22)
                            height: ThemeTokens.dp(22)
                            radius: 11
                            color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.15)
                            border.color: ThemeTokens.accent
                            border.width: 1
                            DocText {
                                anchors.centerIn: parent
                                text: "1"
                                textColor: ThemeTokens.accent
                                font.weight: Typography.weightBold
                                font.pixelSize: Typography.sizeMicro
                            }
                        }

                        Column {
                            width: parent.width - ThemeTokens.dp(34)
                            spacing: ThemeTokens.dp(2)
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.checklist.item1Title", "Does the container hug its content tightly?")
                                textColor: ThemeTokens.text
                                font.weight: Typography.weightSemibold
                                font.pixelSize: Typography.sizeSmall
                            }
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.checklist.item1Desc", "Verify the modal shrinks automatically when content is sparse, preventing 60px+ dead voids.")
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                                width: parent.width
                                wrap: true
                            }
                        }
                    }

                    ChaSetSeparator { width: parent.width - ThemeTokens.dp(40) }

                    // Item 2
                    Row {
                        width: parent.width - ThemeTokens.dp(40)
                        spacing: ThemeTokens.dp(12)

                        Rectangle {
                            width: ThemeTokens.dp(22)
                            height: ThemeTokens.dp(22)
                            radius: 11
                            color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.15)
                            border.color: ThemeTokens.accent
                            border.width: 1
                            DocText {
                                anchors.centerIn: parent
                                text: "2"
                                textColor: ThemeTokens.accent
                                font.weight: Typography.weightBold
                                font.pixelSize: Typography.sizeMicro
                            }
                        }

                        Column {
                            width: parent.width - ThemeTokens.dp(34)
                            spacing: ThemeTokens.dp(2)
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.checklist.item2Title", "Are percentage-grid inline labels avoided?")
                                textColor: ThemeTokens.text
                                font.weight: Typography.weightSemibold
                                font.pixelSize: Typography.sizeSmall
                            }
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.checklist.item2Desc", "Top-aligned labels are the primary choice; inline labels require fixed narrow widths.")
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                                width: parent.width
                                wrap: true
                            }
                        }
                    }

                    ChaSetSeparator { width: parent.width - ThemeTokens.dp(40) }

                    // Item 3
                    Row {
                        width: parent.width - ThemeTokens.dp(40)
                        spacing: ThemeTokens.dp(12)

                        Rectangle {
                            width: ThemeTokens.dp(22)
                            height: ThemeTokens.dp(22)
                            radius: 11
                            color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.15)
                            border.color: ThemeTokens.accent
                            border.width: 1
                            DocText {
                                anchors.centerIn: parent
                                text: "3"
                                textColor: ThemeTokens.accent
                                font.weight: Typography.weightBold
                                font.pixelSize: Typography.sizeMicro
                            }
                        }

                        Column {
                            width: parent.width - ThemeTokens.dp(34)
                            spacing: ThemeTokens.dp(2)
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.checklist.item3Title", "Is padding disciplined to desktop-grade p-5 (20px)?")
                                textColor: ThemeTokens.text
                                font.weight: Typography.weightSemibold
                                font.pixelSize: Typography.sizeSmall
                            }
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.checklist.item3Desc", "Avoid bloated mobile paddings (p-8/p-6), retaining high-density desktop refinement.")
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                                width: parent.width
                                wrap: true
                            }
                        }
                    }

                    ChaSetSeparator { width: parent.width - ThemeTokens.dp(40) }

                    // Item 4
                    Row {
                        width: parent.width - ThemeTokens.dp(40)
                        spacing: ThemeTokens.dp(12)

                        Rectangle {
                            width: ThemeTokens.dp(22)
                            height: ThemeTokens.dp(22)
                            radius: 11
                            color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.15)
                            border.color: ThemeTokens.accent
                            border.width: 1
                            DocText {
                                anchors.centerIn: parent
                                text: "4"
                                textColor: ThemeTokens.accent
                                font.weight: Typography.weightBold
                                font.pixelSize: Typography.sizeMicro
                            }
                        }

                        Column {
                            width: parent.width - ThemeTokens.dp(34)
                            spacing: ThemeTokens.dp(2)
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.checklist.item4Title", "Is the footer divider clean and singular?")
                                textColor: ThemeTokens.text
                                font.weight: Typography.weightSemibold
                                font.pixelSize: Typography.sizeSmall
                            }
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.checklist.item4Desc", "Ensure only one soft divider border separates body and footer, avoiding stacked borders.")
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                                width: parent.width
                                wrap: true
                            }
                        }
                    }

                    ChaSetSeparator { width: parent.width - ThemeTokens.dp(40) }

                    // Item 5
                    Row {
                        width: parent.width - ThemeTokens.dp(40)
                        spacing: ThemeTokens.dp(12)

                        Rectangle {
                            width: ThemeTokens.dp(22)
                            height: ThemeTokens.dp(22)
                            radius: 11
                            color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.15)
                            border.color: ThemeTokens.accent
                            border.width: 1
                            DocText {
                                anchors.centerIn: parent
                                text: "5"
                                textColor: ThemeTokens.accent
                                font.weight: Typography.weightBold
                                font.pixelSize: Typography.sizeMicro
                            }
                        }

                        Column {
                            width: parent.width - ThemeTokens.dp(34)
                            spacing: ThemeTokens.dp(2)
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.checklist.item5Title", "Is component dogfooding enforced?")
                                textColor: ThemeTokens.text
                                font.weight: Typography.weightSemibold
                                font.pixelSize: Typography.sizeSmall
                            }
                            DocText {
                                text: ChaSetI18n.tr("getStarted.spacing.checklist.item5Desc", "Form labels must use the native ChaSet Label primitive, strictly avoiding bare unstyled label tags.")
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                                width: parent.width
                                wrap: true
                            }
                        }
                    }
                }
            }
        }
    }
}
