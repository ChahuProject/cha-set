// SnapSliderDocPage.qml — Living Documentation for ChaSetSnapSlider
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Layouts 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Snap Slider"
    description: "Stepped discrete slider that snaps to defined stops with ticks and label row."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property int demoIndex: 1
    readonly property var demoLabels: ["0.5x", "1.0x", "1.5x", "2.0x", "3.0x"]

    ComponentPreview {
        title: "Snap Slider Sandbox"
        reactCode: `<SnapSlider
  count={5}
  labels={["0.5x", "1.0x", "1.5x", "2.0x", "3.0x"]}
  leftLabel="Slow"
  rightLabel="Fast"
  value={value}
  onChange={setValue}
/>`
        qtCode: `ChaSetSnapSlider {
    count: 5
    labels: ["0.5x", "1.0x", "1.5x", "2.0x", "3.0x"]
    leftLabel: "Slow"
    rightLabel: "Fast"
    currentIndex: 1
    onIndexChanged: function(idx) { console.log(idx) }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(20)
                width: ThemeTokens.dp(280)

                ChaSetSnapSlider {
                    width: parent.width
                    count: 5
                    labels: root.demoLabels
                    leftLabel: "Slow"
                    rightLabel: "Fast"
                    currentIndex: root.demoIndex
                    onIndexChanged: function(idx) {
                        root.demoIndex = idx
                    }
                }
            }
        }
    }

    Item {
        id: installationSection
        width: parent ? parent.width : 0
        height: instCol.implicitHeight

        Column {
            id: instCol
            width: parent.width
            spacing: 12

            DocText {
                text: "Installation"
                font.pixelSize: Typography.sizeTitleSm
                font.bold: true
                color: ThemeTokens.text
            }

            ChaSetCodeBlock {
                width: parent.width
                language: "bash"
                code: "pnpm add @chahu/cha-set"
            }
        }
    }

    Item {
        id: animationsSection
        width: parent ? parent.width : 0
        height: animCol.implicitHeight

        Column {
            id: animCol
            width: parent.width
            spacing: 8

            DocText {
                text: "Animations"
                font.pixelSize: Typography.sizeTitleSm
                font.bold: true
                color: ThemeTokens.text
            }

            DocText {
                text: "Thumb hover and focus transitions animate over ThemeTokens.motionQuick (90ms) with ThemeTokens.easeStandard. Dragging tracks pointer without lag in 60fps."
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
            }
        }
    }

    Item {
        id: keyboardSection
        width: parent ? parent.width : 0
        height: kbCol.implicitHeight

        Column {
            id: kbCol
            width: parent.width
            spacing: 12

            DocText {
                text: "Keyboard Navigation"
                font.pixelSize: Typography.sizeTitleSm
                font.bold: true
                color: ThemeTokens.text
            }

            DocText {
                text: "Keyboard shortcuts and discrete step navigation patterns."
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
            }

            KeyboardShortcutsTable {
                width: parent.width
                componentId: "snap-slider"
            }
        }
    }

    Item {
        id: propsSection
        width: parent ? parent.width : 0
        height: propsCol.implicitHeight

        Column {
            id: propsCol
            width: parent.width
            spacing: 12

            DocText {
                text: "Props Reference"
                font.pixelSize: Typography.sizeTitleSm
                font.bold: true
                color: ThemeTokens.text
            }

            PropsTable {
                width: parent.width
                props: [
                    { name: "currentIndex", type: "int", defaultVal: "0", description: "Current selected stop index (aliased as value)." },
                    { name: "count", type: "int", defaultVal: "5", description: "Total number of discrete snap stops." },
                    { name: "labels", type: "var", defaultVal: "[]", description: "List of labels for each stop." },
                    { name: "leftLabel", type: "string", defaultVal: '""', description: "Boundary label on the bottom-left edge." },
                    { name: "rightLabel", type: "string", defaultVal: '""', description: "Boundary label on the bottom-right edge." },
                    { name: "showTicks", type: "bool", defaultVal: "true", description: "Displays tick mark indicators for stops." },
                    { name: "disabled", type: "bool", defaultVal: "false", description: "Disables interaction and dims opacity." },
                    { name: "readOnly", type: "bool", defaultVal: "false", description: "Prevents changes while maintaining contrast." },
                    { name: "size", type: "string", defaultVal: '"default"', description: 'Density variant ("default" | "sm").' }
                ]
            }
        }
    }
}
