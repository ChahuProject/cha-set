// TypographyPage.qml — Text rasterizer policy and cross-script size ramp matching React 1:1
import QtQuick 6.10
import ChaSet

DocLayout {
    id: root
    category: "Get Started"
    pageTitle: "Typography Rendering"
    description: "Global text rasterizer policy and a five-script size ramp previewing every type scale step."
    tocItems: [
        { id: "rasterizer", title: "Rasterization Path" },
        { id: "ramp", title: "Cross-Script Size Ramp" }
    ]

    readonly property var scaleSteps: ShowcaseData.typographyRamp.scaleSteps
    readonly property var quotes: ShowcaseData.typographyRamp.quotes

    // Resolved by ChaSet::FontSystem::applyTextRenderType() before the window exists.
    readonly property string renderPolicy:
        (typeof textRenderPolicy !== "undefined" && textRenderPolicy !== "") ? textRenderPolicy : "qt"

    readonly property var webRows: [
        { label: "Rasterizer", value: "Grayscale alpha antialiasing" },
        { label: "Font smoothing", value: "antialiased · grayscale" },
        { label: "Outline fitting", value: "None — text shaper follows the outline" },
        { label: "Interface scale", value: "Root font size multiplier" }
    ]
    readonly property var qtRows: [
        { label: "Rasterizer", value: root.renderPolicy },
        { label: "Policies", value: "qt (default) · native · curve" },
        { label: "Subpixel AA", value: "Disabled — grayscale only" },
        { label: "Hinting", value: "Vertical only" },
        { label: "Interface scale", value: "uiScale multiplier on every size token" }
    ]

    Column {
        width: parent.width
        spacing: ThemeTokens.dp(48)

        // Section 1: Rasterization Path
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(14)

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(4)
                DocText {
                    text: "Rasterization Path"
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: "The two stacks reach the same glyph outlines through different rasterizers. Web asks Chromium for grayscale antialiasing with no grid fitting; Desktop resolves one policy for the whole process before the first window exists."
                    isMuted: true
                    font.pixelSize: Typography.sizeBody
                    width: parent.width
                    wrapMode: TextEdit.WordWrap
                    height: contentHeight
                }
            }

            Repeater {
                model: [
                    { title: "Web · Chromium", badge: "React", rows: root.webRows },
                    { title: "Desktop · Qt Quick", badge: "Qt", rows: root.qtRows }
                ]
                delegate: Rectangle {
                    id: stackCard
                    required property var modelData
                    width: parent.width
                    implicitHeight: stackCol.implicitHeight + ThemeTokens.dp(32)
                    radius: ThemeTokens.dp(8)
                    color: ThemeTokens.panel
                    border.color: ThemeTokens.border
                    border.width: 1

                    Column {
                        id: stackCol
                        anchors.fill: parent
                        anchors.margins: ThemeTokens.dp(16)
                        spacing: ThemeTokens.dp(12)

                        Row {
                            spacing: ThemeTokens.dp(8)
                            DocText {
                                text: stackCard.modelData.title
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
                            }
                            ChaSetBadge { text: stackCard.modelData.badge; variant: "secondary" }
                        }

                        Column {
                            width: parent.width
                            spacing: ThemeTokens.dp(8)

                            Repeater {
                                model: stackCard.modelData.rows
                                delegate: Row {
                                    required property var modelData
                                    width: parent.width
                                    spacing: ThemeTokens.dp(16)

                                    DocText {
                                        text: modelData.label
                                        width: ThemeTokens.dp(128)
                                        isMuted: true
                                        font.pixelSize: Typography.sizeMicro
                                    }
                                    DocText {
                                        text: modelData.value
                                        width: parent.width - ThemeTokens.dp(128) - parent.spacing
                                        textColor: ThemeTokens.text
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
        }

        // Section 2: Cross-Script Size Ramp
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(20)

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(4)
                DocText {
                    text: "Cross-Script Size Ramp"
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: "Five script portals, each rendered once per type scale step. The passage never changes inside a block, so strokes can be compared across the whole ramp — including the rounded CJK and Hangul curves that reveal grid fitting first. Sizes follow the type scale and the interface scale, so they are named by token instead of by unit."
                    isMuted: true
                    font.pixelSize: Typography.sizeBody
                    width: parent.width
                    wrapMode: TextEdit.WordWrap
                    height: contentHeight
                }
            }

            Repeater {
                model: root.quotes
                delegate: Rectangle {
                    id: quoteCard
                    required property var modelData
                    readonly property string quoteText: modelData.text
                    width: parent.width
                    implicitHeight: quoteCol.implicitHeight + ThemeTokens.dp(40)
                    radius: ThemeTokens.dp(8)
                    color: ThemeTokens.panel
                    border.color: ThemeTokens.border
                    border.width: 1

                    Column {
                        id: quoteCol
                        anchors.fill: parent
                        anchors.margins: ThemeTokens.dp(20)
                        spacing: ThemeTokens.dp(12)

                        Item {
                            width: parent.width
                            implicitHeight: Math.max(quoteLabels.implicitHeight, attribution.implicitHeight)

                            Row {
                                id: quoteLabels
                                spacing: ThemeTokens.dp(8)

                                DocText {
                                    text: quoteCard.modelData.label
                                    textColor: ThemeTokens.text
                                    font.pixelSize: Typography.sizeBody
                                    font.weight: Typography.weightSemibold
                                }
                                DocText {
                                    text: quoteCard.modelData.native
                                    isMuted: true
                                    font.pixelSize: Typography.sizeCaption
                                }
                            }

                            DocText {
                                id: attribution
                                anchors.right: parent.right
                                text: quoteCard.modelData.attribution
                                isMuted: true
                                isMono: true
                                font.pixelSize: Typography.sizeCaption
                            }
                        }

                        Rectangle {
                            width: parent.width
                            height: 1
                            color: ThemeTokens.border
                        }

                        Column {
                            width: parent.width
                            spacing: ThemeTokens.dp(12)

                            Repeater {
                                model: root.scaleSteps
                                delegate: Row {
                                    required property string modelData
                                    width: parent.width
                                    spacing: ThemeTokens.dp(16)

                                    DocText {
                                        text: modelData
                                        width: ThemeTokens.dp(96)
                                        isMuted: true
                                        isMono: true
                                        font.pixelSize: Typography.sizeMicro
                                    }
                                    DocText {
                                        text: quoteCard.quoteText
                                        width: parent.width - ThemeTokens.dp(96) - parent.spacing
                                        textColor: ThemeTokens.text
                                        font.pixelSize: Typography.size(modelData)
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
    }
}