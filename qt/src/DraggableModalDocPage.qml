// DraggableModalDocPage.qml — Living Documentation for ChaSetDraggableModal
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Draggable Modal"
    description: ChaSetI18n.tr("components.draggableModal.description", "Desktop floating window with dragging title bar and bound viewport constraints.")

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
    <div className="space-y-3 p-4">Memory & Shader Diagnostics</div>
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
    title: "Floating Tools"
    open: true
    initialPositionMode: "center"
}`
        reactCode: `import { DraggableModal, Button } from '@chahu/cha-set';

<DraggableModal
  title="Floating Tools"
  open={open}
  onOpenChange={setOpen}
>
  <div className="p-4">Floating window content</div>
</DraggableModal>`
    }

    ComponentReference {
        name: "DraggableModal"
        componentId: "draggable-modal"
        propsModel: [
            { name: "title", type: "string", default: "'Inspector Window'", description: ChaSetI18n.tr("components.draggableModal.titleDesc", "Headline text in the drag bar.") },
            { name: "open", type: "bool", default: "true", description: ChaSetI18n.tr("components.draggableModal.openDesc", "Whether the floating window is currently visible.") },
            { name: "customRadius", type: "int", default: "8", description: ChaSetI18n.tr("components.draggableModal.radiusDesc", "Corner radius of the floating window.") },
            { name: "initialPositionMode", type: "string", default: "'center'", description: ChaSetI18n.tr("components.draggableModal.initialPositionModeDesc", "Initial placement mode: centered or top-anchored.") },
            { name: "topMargin", type: "int", default: "72", description: ChaSetI18n.tr("components.draggableModal.topMarginDesc", "Top offset margin when in top position mode.") },
            { name: "sizeOptions", type: "var", default: "[]", description: ChaSetI18n.tr("components.draggableModal.sizeOptionsDesc", "Preset size options for the top-right dropdown switcher.") },
            { name: "sizeMenuTooltip", type: "string", default: "'Adjust Size'", description: ChaSetI18n.tr("components.draggableModal.sizeMenuTooltipDesc", "Hover tooltip text for the size menu button.") },
            { name: "remBase", type: "real", default: "16", description: ChaSetI18n.tr("components.draggableModal.remBaseDesc", "Base ratio for rem conversion.") },
            { name: "showEscBadge", type: "bool", default: "false", description: ChaSetI18n.tr("components.draggableModal.showEscBadgeDesc", "Whether to show the ESC hint badge in the top-right corner.") },
            { name: "fixedFooter", type: "Item", default: "null", description: ChaSetI18n.tr("components.draggableModal.fixedFooterDesc", "Pinned bottom action area that does not scroll with content.") },
            { name: "topControls", type: "Item", default: "null", description: ChaSetI18n.tr("components.draggableModal.topControlsDesc", "Extra controls rendered in the top-right action bar (e.g. close button).") }
        ]
    }
}
