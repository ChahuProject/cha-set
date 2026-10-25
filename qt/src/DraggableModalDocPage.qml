// DraggableModalDocPage.qml — Living Documentation for ChaSetDraggableModal
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Draggable Modal"
    description: ChaSetI18n.tr("components.draggableModal.description", "Desktop floating window with dragging title bar and bound viewport constraints.")

    Column {
        property string sectionId: "overview"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("desktopComposite.draggableModal.overviewHeading", "Interactive Overview")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.draggableModal.overviewDesc", "Click the button below to open the draggable modal window, supporting size presets, drag repositioning, and auto-fitting height.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        stageHeight: 360
        title: ChaSetI18n.tr("desktopComposite.draggableModal.sandboxTitle", "Draggable Modal Sandbox")
        reactCode: `{open && (
  <DraggableModal
    bounds="parent"
    initialPositionMode="center"
    defaultWidthRem={18.75}
    defaultHeightRem={12.5}
    sizeOptions={[
      { name: "Default", special: "default" },
      { name: "Compact (24rem x 18rem)", widthRem: 24, heightRem: 18 },
      { name: "Widescreen (40rem x 24rem)", widthRem: 40, heightRem: 24 },
      { name: "Fullscreen", special: "fullscreen" }
    ]}
    sizeMenuTooltip="Adjust window size"
    showCloseButton
    onClose={() => setOpen(false)}
  >
    <div className="space-y-3 p-4">` + ChaSetI18n.tr("overlays.draggableModal.diagnosticsTitle", "Memory & Shader Diagnostics") + `</div>
  </DraggableModal>
)}`
        qtCode: `ChaSetDraggableModal {
    initialPositionMode: "center"
    sizeOptions: [
        { name: "Default", special: "default" },
        { name: "Compact (24rem x 18rem)", widthRem: 24, heightRem: 18 },
        { name: "Widescreen (40rem x 24rem)", widthRem: 40, heightRem: 24 },
        { name: "Fullscreen", special: "fullscreen" }
    ]
    width: 300
    height: 200
}`

        Column {
            anchors.fill: parent
            spacing: ThemeTokens.dp(12)

            ChaSetButton {
                id: reopenBtn
                anchors.horizontalCenter: parent.horizontalCenter
                variant: "outline"
                text: demoModal.open ? ChaSetI18n.tr("overlays.draggableModal.modalOpen", "Modal is open") : ChaSetI18n.tr("overlays.draggableModal.openModal", "Open Draggable Diagnostic Window")
                onClicked: demoModal.open = true
            }

            Rectangle {
                width: parent.width
                height: parent.height - reopenBtn.height - ThemeTokens.dp(12)
                color: ThemeTokens.hover
                border.color: ThemeTokens.border
                border.width: 1
                radius: ThemeTokens.dp(8)
                clip: true

                DocText {
                    anchors.centerIn: parent
                    width: parent.width - ThemeTokens.dp(48)
                    horizontalAlignment: Text.AlignHCenter
                    wrapMode: Text.WordWrap
                    text: ChaSetI18n.tr("overlays.draggableModal.canvasHint", "Drag the modal around within this bounded canvas")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }

                ChaSetDraggableModal {
                    id: demoModal
                    width: ThemeTokens.dp(300)
                    height: ThemeTokens.dp(200)
                    title: ChaSetI18n.tr("overlays.draggableModal.diagnosticsTitle", "Memory & Shader Diagnostics")
                    initialPositionMode: "center"
                    sizeOptions: [
                        { name: ChaSetI18n.tr("overlays.draggableModal.presetDefault", "Default"), special: "default" },
                        { name: ChaSetI18n.tr("overlays.draggableModal.presetCompact", "Compact (24rem x 18rem)"), widthRem: 24, heightRem: 18 },
                        { name: ChaSetI18n.tr("overlays.draggableModal.presetWidescreen", "Widescreen (40rem x 24rem)"), widthRem: 40, heightRem: 24 },
                        { name: ChaSetI18n.tr("overlays.draggableModal.presetFullscreen", "Fullscreen"), special: "fullscreen" }
                    ]
                    sizeMenuTooltip: ChaSetI18n.tr("overlays.draggableModal.adjustSize", "Adjust window size")
                    fixedFooter: Item {
                        width: demoModal.width
                        height: ThemeTokens.dp(48)
                        ChaSetButton {
                            anchors.right: parent.right
                            anchors.rightMargin: ThemeTokens.dp(12)
                            anchors.verticalCenter: parent.verticalCenter
                            size: "xs"
                            variant: "secondary"
                            text: ChaSetI18n.tr("common.close", "Close")
                            onClicked: demoModal.open = false
                        }
                    }

                    Column {
                        anchors.fill: parent
                        anchors.margins: ThemeTokens.dp(16)
                        spacing: ThemeTokens.dp(8)

                        DocText {
                            text: ChaSetI18n.tr("overlays.draggableModal.diagnosticsTitle", "Memory & Shader Diagnostics")
                            color: ThemeTokens.text
                            font.pixelSize: Typography.sizeBody
                            font.weight: Font.DemiBold
                        }
                        DocText {
                            text: ChaSetI18n.tr("overlays.draggableModal.diagnosticsDesc", "Drag anywhere on the modal surface not occupied by controls to move; drag borders to resize.")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeSmall
                            wrapMode: Text.WordWrap
                            width: parent.width
                        }

                        Row {
                            spacing: ThemeTokens.dp(8)
                            DocText {
                                text: ChaSetI18n.tr("overlays.draggableModal.heapUsed", "Heap Memory Used:")
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeSmall
                                font.family: Typography.familyMono
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            ChaSetBadge {
                                text: "42.8 MB"
                                size: "sm"
                                variant: "outline"
                            }
                        }

                        Row {
                            spacing: ThemeTokens.dp(8)
                            DocText {
                                text: ChaSetI18n.tr("overlays.draggableModal.activeTextures", "Active Textures:")
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeSmall
                                font.family: Typography.familyMono
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            ChaSetBadge {
                                text: ChaSetI18n.tr("desktopComposite.draggableModal.allocBadge", "128 alloc")
                                size: "sm"
                                variant: "secondary"
                            }
                        }
                    }
                }
            }
        }
    }

        DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetDraggableModal {
    title: "` + ChaSetI18n.tr("overlays.draggableModal.floatingTools", "Floating Tools") + `"
    open: true
    initialPositionMode: "center"
}`
        reactCode: `import { DraggableModal, Button } from '@chahu/cha-set';

<DraggableModal
  title="` + ChaSetI18n.tr("overlays.draggableModal.floatingTools", "Floating Tools") + `"
  open={open}
  onOpenChange={setOpen}
>
  <div className="p-4">Floating window content</div>
</DraggableModal>`
    }

    DocMarkdown {
        width: parent.width
        docId: "draggable-modal"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "draggable-modal"
        section: "props"
    }
}
