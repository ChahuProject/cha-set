// AdaptivePopupDocPage.qml — Living Documentation for ChaSetAdaptivePopup
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Adaptive Popup"
    description: ChaSetI18n.tr("components.adaptivePopup.description", "Content-driven adaptive height popup with zero unnecessary scrollbars and 3-tier layout.")

    property string demoPlacement: "down"
    property int demoMaxHeight: -1
    property int demoItemCount: 5

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.adaptivePopup.sandboxTitle", "Adaptive Popup Sandbox")
        reactCode: `<AdaptivePopup
  open={${triggerBtn.popupOpen}}
  onOpenChange={setOpen}
  placement="${root.demoPlacement}"
  maxHeight={${root.demoMaxHeight}}
  anchorRef={triggerRef}
  className="w-80"
  header={
    <div className="p-3">
      <h4 className="text-xs font-semibold text-foreground">Select Render Target</h4>
    </div>
  }
  footer={
    <div className="p-2 flex justify-end gap-2">
      <Button size="sm" variant="outline" onClick={() => setOpen(false)}>Close</Button>
    </div>
  }
>
  <div className="py-2 space-y-1">
    {items.map(item => (
      <div key={item.id} className="p-2 rounded hover:bg-muted/40 text-xs flex justify-between">
        <span>{item.name}</span>
        <Badge variant="outline" size="sm">{item.type}</Badge>
      </div>
    ))}
  </div>
</AdaptivePopup>`
        qtCode: `ChaSetButton {
    id: triggerBtn
    text: "Toggle Adaptive Popup"
    variant: "outline"
    onClicked: popup.open()

    ChaSetAdaptivePopup {
        id: popup
        placement: "${root.demoPlacement}"
        maxHeight: ${root.demoMaxHeight}
        anchorY: triggerBtn.height + 4
        width: 320

        headerItems: [
            RowLayout {
                Text { text: "Select Render Target" }
            }
        ]

        Column {
            Repeater {
                model: ${root.demoItemCount}
                Text { text: "Render Layer #" + (index + 1) }
            }
        }

        footerItems: [
            RowLayout {
                ChaSetButton { text: "Close"; onClicked: popup.close() }
            }
        ]
    }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(16)
                width: ThemeTokens.dp(360)

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: ThemeTokens.dp(16)

                    Row {
                        spacing: ThemeTokens.dp(8)
                        DocText {
                            text: ChaSetI18n.tr("overlays.adaptivePopup.placement", "Placement:")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeSmall
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        ChaSetSegmentedControl {
                            anchors.verticalCenter: parent.verticalCenter
                            size: "sm"
                            value: root.demoPlacement
                            options: [
                                { label: ChaSetI18n.tr("overlays.adaptivePopup.down", "Down"), value: "down" },
                                { label: ChaSetI18n.tr("overlays.adaptivePopup.up", "Up"), value: "up" }
                            ]
                            onValueSelected: function(val) { root.demoPlacement = String(val); }
                        }
                    }

                    Row {
                        spacing: ThemeTokens.dp(8)
                        DocText {
                            text: ChaSetI18n.tr("overlays.adaptivePopup.maxHeight", "Max Height:")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeSmall
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        ChaSetSegmentedControl {
                            anchors.verticalCenter: parent.verticalCenter
                            size: "sm"
                            value: String(root.demoMaxHeight)
                            options: [
                                { label: ChaSetI18n.tr("overlays.adaptivePopup.auto", "Auto"), value: "-1" },
                                { label: "200", value: "200" }
                            ]
                            onValueSelected: function(val) { root.demoMaxHeight = parseInt(val, 10); }
                        }
                    }
                }

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: ThemeTokens.dp(8)

                    ChaSetButton {
                        size: "sm"
                        variant: "outline"
                        text: ChaSetI18n.tr("overlays.adaptivePopup.removeItems", "-2 Items")
                        onClicked: root.demoItemCount = Math.max(1, root.demoItemCount - 2)
                    }

                    ChaSetBadge {
                        text: root.demoItemCount + " Items"
                        variant: "outline"
                        anchors.verticalCenter: parent.verticalCenter
                    }

                    ChaSetButton {
                        size: "sm"
                        variant: "outline"
                        text: ChaSetI18n.tr("overlays.adaptivePopup.addItems", "+3 Items")
                        onClicked: root.demoItemCount = root.demoItemCount + 3
                    }
                }

                Item {
                    width: parent.width
                    height: ThemeTokens.dp(44)

                    ChaSetButton {
                        id: triggerBtn
                        property bool popupOpen: demoPopup.visible
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: popupOpen ? ChaSetI18n.tr("overlays.adaptivePopup.closePopup", "Close Adaptive Popup") : ChaSetI18n.tr("overlays.adaptivePopup.openPopup", "Open Adaptive Popup")
                        variant: "default"
                        onClicked: {
                            if (demoPopup.visible) {
                                demoPopup.close();
                            } else {
                                demoPopup.open();
                            }
                        }

                        ChaSetAdaptivePopup {
                            id: demoPopup
                            width: ThemeTokens.dp(320)
                            placement: root.demoPlacement
                            maxHeight: root.demoMaxHeight > 0 ? ThemeTokens.dp(root.demoMaxHeight) : -1
                            anchorX: (triggerBtn.width - width) / 2
                            anchorY: root.demoPlacement === "up" ? -ThemeTokens.dp(6) : triggerBtn.height + ThemeTokens.dp(6)

                            headerItems: [
                                RowLayout {
                                    width: parent.width
                                    DocText {
                                        Layout.fillWidth: true
                                        Layout.leftMargin: ThemeTokens.dp(12)
                                        Layout.topMargin: ThemeTokens.dp(10)
                                        Layout.bottomMargin: ThemeTokens.dp(10)
                                        text: ChaSetI18n.tr("desktopComposite.adaptivePopup.headerTitle", "Active Render Targets")
                                        font.pixelSize: Typography.sizeSmall
                                        font.bold: true
                                        color: ThemeTokens.text
                                    }
                                    ChaSetBadge {
                                        Layout.rightMargin: ThemeTokens.dp(12)
                                        text: String(root.demoItemCount)
                                        variant: "secondary"
                                    }
                                }
                            ]

                            Column {
                                width: parent.width
                                spacing: ThemeTokens.dp(6)
                                topPadding: ThemeTokens.dp(8)
                                bottomPadding: ThemeTokens.dp(8)

                                Repeater {
                                    model: root.demoItemCount
                                    Rectangle {
                                        width: parent.width
                                        height: ThemeTokens.dp(32)
                                        radius: ThemeTokens.dp(4)
                                        color: ThemeTokens.color("panelRaised")
                                        border.width: 1
                                        border.color: ThemeTokens.border

                                        DocText {
                                            anchors.left: parent.left
                                            anchors.leftMargin: ThemeTokens.dp(8)
                                            anchors.verticalCenter: parent.verticalCenter
                                            text: ChaSetI18n.tr("desktopComposite.adaptivePopup.itemPrefix", "Render Layer #") + (index + 1)
                                            color: ThemeTokens.text
                                            font.pixelSize: Typography.sizeSmall
                                        }

                                        ChaSetBadge {
                                            anchors.right: parent.right
                                            anchors.rightMargin: ThemeTokens.dp(8)
                                            anchors.verticalCenter: parent.verticalCenter
                                            text: index % 2 === 0 ? "Color Attachment" : "Depth Stencil"
                                            variant: "outline"
                                        }
                                    }
                                }
                            }

                            footerItems: [
                                RowLayout {
                                    width: parent.width
                                    DocText {
                                        Layout.leftMargin: ThemeTokens.dp(12)
                                        Layout.topMargin: ThemeTokens.dp(8)
                                        Layout.bottomMargin: ThemeTokens.dp(8)
                                        text: root.demoPlacement === "up" ? "Placement: Up" : "Placement: Down"
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeMicro
                                    }
                                    Item { Layout.fillWidth: true }
                                    ChaSetButton {
                                        Layout.rightMargin: ThemeTokens.dp(12)
                                        size: "sm"
                                        variant: "outline"
                                        text: ChaSetI18n.tr("overlays.adaptivePopup.done", "Done")
                                        onClicked: demoPopup.close()
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        }
    }

    DocAnatomy {
        sectionId: "anatomy"
        width: parent.width
        reactCode: `import { AdaptivePopup } from '@chahu/cha-set';

<AdaptivePopup open={open} placement="down">
  <div>Content</div>
</AdaptivePopup>`
        qtCode: `import ChaSet

ChaSetAdaptivePopup {
    placement: "down"
    width: 320
}`
    }

    // Section: Variants & Placement
    Column {
        property string sectionId: "variants"
        width: parent.width
        spacing: ThemeTokens.dp(12)

        DocText {
            text: ChaSetI18n.tr("desktopComposite.adaptivePopup.variantsTitle", "Variants & Placement")
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.adaptivePopup.variantsDesc", "Demonstrates downward and upward adaptive expansion and explicit maxHeight capping.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
        }

        Grid {
            width: parent.width
            columns: 2
            spacing: ThemeTokens.dp(16)

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    padding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText {
                        text: ChaSetI18n.tr("overlays.adaptivePopup.downwardTitle", "Downward Natural Sizing (Placement: Down)")
                        color: ThemeTokens.text
                        font.pixelSize: Typography.sizeSmall
                        font.weight: Typography.weightSemibold
                    }
                    DocText {
                        text: ChaSetI18n.tr("overlays.adaptivePopup.downwardDesc", "Default mode. Expands down from anchor coordinates and clamps before reaching the bottom edge of the host.")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeMicro
                        wrapMode: Text.WordWrap
                        width: parent.width - ThemeTokens.dp(28)
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(16)) / 2
                customRadius: 8
                Column {
                    width: parent.width
                    padding: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText {
                        text: ChaSetI18n.tr("overlays.adaptivePopup.upwardTitle", "Upward Clamping (Placement: Up)")
                        color: ThemeTokens.text
                        font.pixelSize: Typography.sizeSmall
                        font.weight: Typography.weightSemibold
                    }
                    DocText {
                        text: ChaSetI18n.tr("overlays.adaptivePopup.upwardDesc", "Useful for taskbars and status items. AnchorY represents the desired bottom edge, expanding upward into the window.")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeMicro
                        wrapMode: Text.WordWrap
                        width: parent.width - ThemeTokens.dp(28)
                    }
                }
            }
        }
    }

    // Section: Animations
    Column {
        property string sectionId: "animations"
        width: parent.width
        spacing: ThemeTokens.dp(12)

        DocText {
            text: ChaSetI18n.tr("desktopComposite.adaptivePopup.animationsTitle", "Animations")
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.adaptivePopup.animationsDesc", "Entrance and exit utilize short duration entrance easings, automatically disabled when animationsEnabled is false.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
        }
    }

    DocMarkdown {
        width: parent.width
        docId: "adaptive-popup"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "adaptive-popup"
        section: "props"
    }
}
