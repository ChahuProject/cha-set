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
        title: ChaSetI18n.tr("desktopComposite.draggableModal.sandboxTitle", "Draggable Modal Sandbox")
        reactCode: `<DraggableModal
  title="Floating Tools"
  initialPositionMode="center"
  showEscBadge
  sizeOptions={[
    { name: "默认", special: "default" },
    { name: "宽屏", widthRem: 32, heightRem: 20 },
    { name: "全窗口", special: "fullscreen" }
  ]}
>
  <div className="p-4">Inspect active rendering targets</div>
</DraggableModal>`
        qtCode: `ChaSetDraggableModal {
    title: "Floating Tools"
    initialPositionMode: "center"
    showEscBadge: true
    sizeOptions: [
        { name: "默认", special: "default" },
        { name: "宽屏", widthRem: 32, heightRem: 20 },
        { name: "全窗口", special: "fullscreen" }
    ]
    width: 300
    height: 200
}`

        Item {
            anchors.fill: parent

            Rectangle {
                anchors.fill: parent
                color: ThemeTokens.hover
                border.color: ThemeTokens.border
                border.width: 1
                radius: 8

                DocText {
                    anchors.centerIn: parent
                    text: ChaSetI18n.tr("overlays.draggableModal.canvasHint", "Drag the modal around within this bounded canvas")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }

                ChaSetDraggableModal {
                    x: ThemeTokens.dp(40)
                    y: ThemeTokens.dp(30)
                    width: ThemeTokens.dp(300)
                    height: ThemeTokens.dp(200)
                    title: ChaSetI18n.tr("overlays.draggableModal.shaderDebuggerTitle", "Shader Debugger")
                    showEscBadge: true
                    initialPositionMode: "center"
                    sizeOptions: [
                        { name: ChaSetI18n.tr("overlays.draggableModal.presetDefault", "Default"), special: "default" },
                        { name: ChaSetI18n.tr("overlays.draggableModal.presetWidescreenQt", "Widescreen"), widthRem: 22, heightRem: 14 },
                        { name: ChaSetI18n.tr("overlays.draggableModal.presetFullscreen", "Fullscreen"), special: "fullscreen" }
                    ]

                    Column {
                        anchors.fill: parent
                        anchors.margins: ThemeTokens.dp(16)
                        spacing: ThemeTokens.dp(8)

                        Row {
                            spacing: 8
                            DocText {
                                text: ChaSetI18n.tr("overlays.draggableModal.activePass", "Active Pass:")
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeSmall
                                anchors.verticalCenter: parent.verticalCenter
                            }
                            ChaSetBadge {
                                text: ChaSetI18n.tr("overlays.draggableModal.gbufferDepth", "G-Buffer Depth")
                                size: "sm"
                                variant: "secondary"
                            }
                        }

                        DocText { text: ChaSetI18n.tr("overlays.draggableModal.format", "Format: R32G32B32A32_FLOAT"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption; font.family: Typography.familyMono }
                        DocText { text: ChaSetI18n.tr("overlays.draggableModal.dimensions", "Dimensions: 2560 x 1440"); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                        ChaSetButton { text: ChaSetI18n.tr("overlays.draggableModal.exportBuffer", "Export Buffer"); size: "xs"; variant: "outline" }
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
