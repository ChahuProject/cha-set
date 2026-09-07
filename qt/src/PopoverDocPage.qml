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
        { id: "props", title: "API Reference" }
    ]

    property int layerWidth: 100
    property int layerHeight: 200

    ComponentPreview {
        title: "Popover Preview"
        reactCode: `<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent className="w-80">
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
        side: "bottom"
        popoverWidth: 260
        popoverHeight: 160
        // ...popover content...
    }
}`

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
                    side: "bottom"
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
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetPopover { ... }"
        language: "qml"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "open", type: "bool", default: "false", description: "Whether the popover is currently visible." },
            { name: "side", type: "string", default: "'bottom'", description: "Placement anchor side: 'top' | 'bottom' | 'left' | 'right'." },
            { name: "popoverWidth", type: "int", default: "260", description: "Width of the popover content in pixels." },
            { name: "popoverHeight", type: "int", default: "160", description: "Height of the popover content in pixels." },
            { name: "customRadius", type: "int", default: "8", description: "Corner radius of the popover border." }
        ]
    }
}
