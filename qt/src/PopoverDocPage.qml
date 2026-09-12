// PopoverDocPage.qml — Living Documentation for ChaSetPopover
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Popover"
    description: "Displays rich interactive content in a floating portal anchored to a trigger button."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    property int layerWidth: 100
    property int layerHeight: 200
    property string demoSide: "bottom"
    property string demoAlign: "start"
    property bool demoArrow: true
    property bool demoMovable: false

    ComponentPreview {
        title: "Popover Preview"
        reactCode: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent side="${root.demoSide}" align="${root.demoAlign}" arrow={${root.demoArrow}} movable={${root.demoMovable}} className="w-80">
    <div className="grid gap-4">
      <h4>Dimensions</h4>
      <Input defaultValue="100%" />
    </div>
  </PopoverContent>
</Popover>`
        qtCode: `ChaSetButton {
    id: triggerBtn
    text: "Open Popover"
    variant: "outline"
    onClicked: pop.open = !pop.open

    ChaSetPopover {
        id: pop
        side: "${root.demoSide}"
        align: "${root.demoAlign}"
        arrow: ${root.demoArrow}
        movable: ${root.demoMovable}
        popoverWidth: 260
        popoverHeight: 160
        // ...popover content...
    }
}`

        controlsData: [
            Row {
                spacing: 16

                // Side Selector
                Row {
                    spacing: 8
                    Text { text: "Side:"; color: ThemeTokens.subduedText; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoSide
                        onCurrentValueChanged: root.demoSide = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "top"; text: "Top" }
                            ChaSetTabsTrigger { value: "bottom"; text: "Bottom" }
                            ChaSetTabsTrigger { value: "left"; text: "Left" }
                            ChaSetTabsTrigger { value: "right"; text: "Right" }
                        }
                    }
                }

                // Align Selector
                Row {
                    spacing: 8
                    Text { text: "Align:"; color: ThemeTokens.subduedText; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.demoAlign
                        onCurrentValueChanged: root.demoAlign = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "start"; text: "Start" }
                            ChaSetTabsTrigger { value: "center"; text: "Center" }
                            ChaSetTabsTrigger { value: "end"; text: "End" }
                        }
                    }
                }

                // Arrow Toggle
                ChaSetCheckbox {
                    size: "sm"
                    label: "Arrow"
                    checked: root.demoArrow
                    onToggled: (val) => root.demoArrow = val
                    anchors.verticalCenter: parent.verticalCenter
                }

                // Movable Toggle
                ChaSetCheckbox {
                    size: "sm"
                    label: "Movable"
                    checked: root.demoMovable
                    onToggled: (val) => root.demoMovable = val
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
        ]

        stageData: [
            Item {
                anchors.fill: parent

                ChaSetButton {
                    id: triggerBtn
                    anchors.centerIn: parent
                    text: "Open Popover"
                    variant: "outline"
                    onClicked: pop.open = !pop.open

                    ChaSetPopover {
                        id: pop
                        side: root.demoSide
                        align: root.demoAlign
                        arrow: root.demoArrow
                        movable: root.demoMovable
                        popoverWidth: 260
                        popoverHeight: 160

                        Column {
                            anchors.fill: parent
                            spacing: 12

                            Text {
                                text: "Dimensions Settings"
                                color: ThemeTokens.text
                                font.pixelSize: 13
                                font.weight: Font.DemiBold
                            }

                            Text {
                                text: "Set the width and height layers for the active canvas."
                                color: ThemeTokens.subduedText
                                font.pixelSize: 11
                                wrapMode: Text.WordWrap
                                width: parent.width
                            }

                            Row {
                                spacing: 8
                                width: parent.width

                                Text {
                                    text: "Width:"
                                    color: ThemeTokens.text
                                    font.pixelSize: 12
                                    anchors.verticalCenter: parent.verticalCenter
                                    width: 50
                                }

                                ChaSetInput {
                                    width: 160
                                    height: 28
                                    text: "" + root.layerWidth
                                    onTextEdited: root.layerWidth = parseInt(text) || 0
                                }
                            }

                            Row {
                                spacing: 8
                                width: parent.width

                                Text {
                                    text: "Height:"
                                    color: ThemeTokens.text
                                    font.pixelSize: 12
                                    anchors.verticalCenter: parent.verticalCenter
                                    width: 50
                                }

                                ChaSetInput {
                                    width: 160
                                    height: 28
                                    text: "" + root.layerHeight
                                    onTextEdited: root.layerHeight = parseInt(text) || 0
                                }
                            }
                        }
                    }
                }
            }
        ]
    }

    ChaSetCodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetPopover { ... }"
        language: "qml"
    }

    
    KeyboardShortcutsTable {
        componentId: "popover"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "open", type: "bool", default: "false", description: "Whether the popover is currently visible." },
            { name: "side", type: "string", default: "'bottom'", description: "Placement anchor side: 'top' | 'bottom' | 'left' | 'right'." },
            { name: "align", type: "string", default: "'start'", description: "Alignment along the anchor edge: 'start' | 'center' | 'end'." },
            { name: "sideOffset", type: "int", default: "8", description: "Distance offset between trigger and popover bubble." },
            { name: "arrow", type: "bool", default: "false", description: "Whether to render an anchored directional arrow." },
            { name: "movable", type: "bool", default: "false", description: "Enables dragging popover position via grip handle." },
            { name: "modal", type: "bool", default: "false", description: "Whether popover is modal with backdrop overlay." },
            { name: "popoverWidth", type: "int", default: "260", description: "Width of the popover content." },
            { name: "popoverHeight", type: "int", default: "160", description: "Height of the popover content." },
            { name: "customRadius", type: "int", default: "8", description: "Corner radius of the popover border." }
        ]
    }
}
