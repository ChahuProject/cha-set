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
        { id: "ramp", title: "Cross-Script Size Ramp" },
        { id: "integration", title: "Host Integration" }
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
                    width: parent ? parent.width : 0
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
                    width: parent ? parent.width : 0
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
                            height: Math.max(quoteLabels.implicitHeight, attribution.implicitHeight)

                            Row {
                                id: quoteLabels
                                anchors.left: parent.left
                                anchors.verticalCenter: parent.verticalCenter
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
                                anchors.verticalCenter: parent.verticalCenter
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

        // Section 3: Host Integration
        Column {
            width: parent.width
            spacing: ThemeTokens.dp(20)

            Column {
                width: parent.width
                spacing: ThemeTokens.dp(4)
                DocText {
                    text: "Host Integration"
                    textColor: ThemeTokens.text
                    font.pixelSize: Typography.sizeTitleSm
                    font.weight: Typography.weightBold
                }
                DocText {
                    text: "How host applications configure and initialize ChaSet's typography subsystem across desktop and web runtimes."
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

                // Desktop · Qt Card
                Rectangle {
                    width: parent.width
                    implicitHeight: qtCol.implicitHeight + ThemeTokens.dp(40)
                    radius: ThemeTokens.dp(8)
                    color: ThemeTokens.panel
                    border.color: ThemeTokens.border
                    border.width: 1

                    Column {
                        id: qtCol
                        anchors.fill: parent
                        anchors.margins: ThemeTokens.dp(20)
                        spacing: ThemeTokens.dp(16)

                        Row {
                            spacing: ThemeTokens.dp(8)
                            DocText {
                                text: "Desktop · Qt Quick (C++ / QML)"
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
                            }
                            ChaSetBadge { text: "Qt"; variant: "secondary" }
                        }

                        DocText {
                            text: "Desktop applications initialize the typography system via ChaSet::FontSystem. Two calls in main.cpp configure DirectWrite pure alpha grayscale antialiasing, vertical hinting, and inject CJK fallback tables into QFontDatabase to eliminate bitmap SimSun degradation."
                            isMuted: true
                            font.pixelSize: Typography.sizeSmall
                            width: parent.width
                            wrapMode: TextEdit.WordWrap
                            height: contentHeight
                        }

                        Column {
                            width: parent.width
                            spacing: ThemeTokens.dp(6)

                            DocText {
                                text: "1. CMake Target Linkage"
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeCaption
                                font.weight: Typography.weightMedium
                            }

                            ChaSetCodeBlock {
                                width: parent.width
                                filename: "CMakeLists.txt"
                                language: "bash"
                                code: "target_link_libraries(YourApp PRIVATE ChaSet)"
                            }
                        }

                        Column {
                            width: parent.width
                            spacing: ThemeTokens.dp(6)

                            DocText {
                                text: "2. C++ Initialization (main.cpp)"
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeCaption
                                font.weight: Typography.weightMedium
                            }

                            ChaSetCodeBlock {
                                width: parent.width
                                filename: "main.cpp"
                                language: "ts"
                                code: "#include <ChaSet/ChaSetFontSystem.h>\n\nint main(int argc, char* argv[]) {\n    // 1. Must precede QGuiApplication: resolves CHASET_TEXT_RENDER policy\n    ChaSet::FontSystem::applyTextRenderType();\n\n    QGuiApplication app(argc, argv);\n\n    // 2. Injects CJK fallback substitution tables and configures grayscale antialiasing\n    ChaSet::FontSystem::initialize(&app);\n\n    QQmlApplicationEngine engine;\n    // ...\n    return app.exec();\n}"
                            }
                        }

                        Column {
                            width: parent.width
                            spacing: ThemeTokens.dp(6)

                            DocText {
                                text: "3. Environment Variable Control (CHASET_TEXT_RENDER)"
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeCaption
                                font.weight: Typography.weightMedium
                            }

                            DocText {
                                text: "The window-level text rasterization policy is controlled dynamically before startup via the CHASET_TEXT_RENDER environment variable:\n• qt (default): Qt glyph outline rasterizer (QtTextRendering). Smooth grayscale outline coverage without OS pixel grid-fitting; curves remain smooth when scaled.\n• native: Operating-system rasterizer (DirectWrite / CoreText, NativeTextRendering). Crisp pixel-grid fitting for small upright text; staircasing on curves when scaled.\n• curve: Hardware GPU curve rasterizer (CurveTextRendering, Qt 6.7+). Scale-invariant GPU curve rendering; automatically degrades to qt when a software rasterizer is active."
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
                                code: "# Default: Qt's own outline rasterizer (smooth vector AA, curves scale smoothly)\nexport CHASET_TEXT_RENDER=qt\n./YourApp\n\n# Native: DirectWrite (Windows) / CoreText (macOS) (crisp grid-fitting for small upright text)\nexport CHASET_TEXT_RENDER=native\n./YourApp\n\n# Curve: Hardware GPU curve rasterizer (Qt 6.7+, scale-invariant GPU curve rendering)\nexport CHASET_TEXT_RENDER=curve\n./YourApp"
                            }
                        }
                    }
                }

                // Web · React Card
                Rectangle {
                    width: parent.width
                    implicitHeight: webCol.implicitHeight + ThemeTokens.dp(40)
                    radius: ThemeTokens.dp(8)
                    color: ThemeTokens.panel
                    border.color: ThemeTokens.border
                    border.width: 1

                    Column {
                        id: webCol
                        anchors.fill: parent
                        anchors.margins: ThemeTokens.dp(20)
                        spacing: ThemeTokens.dp(16)

                        Row {
                            spacing: ThemeTokens.dp(8)
                            DocText {
                                text: "Web · Chromium (React / CSS)"
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
                            }
                            ChaSetBadge { text: "React"; variant: "secondary" }
                        }

                        DocText {
                            text: "Web applications in Chromium / browsers automatically inherit grayscale antialiasing (-webkit-font-smoothing: antialiased) and CJK fallback chains through CSS variables. Environment variables and C++ initialization do not apply to the Web stack."
                            isMuted: true
                            font.pixelSize: Typography.sizeSmall
                            width: parent.width
                            wrapMode: TextEdit.WordWrap
                            height: contentHeight
                        }

                        Column {
                            width: parent.width
                            spacing: ThemeTokens.dp(6)

                            DocText {
                                text: "CSS Tokens & Font Family Overrides"
                                textColor: ThemeTokens.text
                                font.pixelSize: Typography.sizeCaption
                                font.weight: Typography.weightMedium
                            }

                            DocText {
                                text: "Reference var(--cs-font-sans) and var(--cs-font-mono) when customizing font stacks to preserve the prioritized Chinese fallback chain:"
                                isMuted: true
                                font.pixelSize: Typography.sizeSmall
                                width: parent.width
                                wrapMode: TextEdit.WordWrap
                                height: contentHeight
                            }

                            ChaSetCodeBlock {
                                width: parent.width
                                filename: "styles.css"
                                language: "css"
                                code: "@import \"@chahu/cha-set/theme.css\";\n\n:root {\n  /* Custom primary font family while inheriting prioritized CJK fallback */\n  --font-sans: 'Inter', var(--cs-font-sans);\n  --font-mono: 'JetBrains Mono', var(--cs-font-mono);\n}"
                            }
                        }
                    }
                }
            }
        }
    }
}