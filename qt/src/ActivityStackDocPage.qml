// ActivityStackDocPage.qml — Living documentation for ChaSetActivityStack
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Activity Stack"
    description: ChaSetI18n.tr("components.activityStack.description", "Floating viewport-anchored stack of activity cards with 8-way placement, overflow, and collapse.")

    property string demoPlacement: "bottom-right"
    property int demoMaxVisible: 3

    property var cardList: [
        {
            id: "task-1",
            tone: "neutral",
            title: ChaSetI18n.tr("overlays.activityStack.sampleTaskTitle", "Sync Pipeline"),
            detail: ChaSetI18n.tr("overlays.activityStack.sampleTaskDetail", "Pushing changes to remote branch"),
            meta: "2.4s",
            progress: 0.65,
            dismissible: true
        },
        {
            id: "task-2",
            tone: "success",
            title: ChaSetI18n.tr("overlays.activityStack.sampleSuccessTitle", "Build Succeeded"),
            detail: ChaSetI18n.tr("overlays.activityStack.sampleSuccessDetail", "Artifacts passed all unit tests"),
            meta: "Done",
            progress: 1.0,
            dismissible: true
        },
        {
            id: "task-3",
            tone: "warning",
            title: ChaSetI18n.tr("overlays.activityStack.sampleWarningTitle", "Dependency Warning"),
            detail: ChaSetI18n.tr("overlays.activityStack.sampleWarningDetail", "Detected 3 deprecated API calls"),
            meta: "Warn",
            progress: -1,
            dismissible: true
        },
        {
            id: "task-4",
            tone: "danger",
            title: ChaSetI18n.tr("overlays.activityStack.sampleDangerTitle", "Build Failed"),
            detail: ChaSetI18n.tr("overlays.activityStack.sampleDangerDetail", "Linker error: undefined symbol _main"),
            meta: "Error",
            progress: -1,
            dismissible: true
        }
    ]

    function dismissCard(id) {
        var next = []
        for (var i = 0; i < root.cardList.length; ++i) {
            if (root.cardList[i].id !== id) next.push(root.cardList[i])
        }
        root.cardList = next
    }

    function addCard() {
        var tones = ["neutral", "success", "warning", "danger"]
        var nextIdx = root.cardList.length + 1
        var tone = tones[nextIdx % tones.length]
        var next = root.cardList.slice()
        next.push({
            id: "task-" + Date.now(),
            tone: tone,
            title: ChaSetI18n.tr("overlays.activityStack.jobPrefix", "Job #") + nextIdx,
            detail: "Execution step " + nextIdx + " in progress",
            meta: nextIdx + "s",
            progress: tone === "success" ? 1.0 : 0.4,
            dismissible: true
        })
        root.cardList = next
    }

    function removeCard() {
        if (root.cardList.length === 0) return
        var next = root.cardList.slice(0, root.cardList.length - 1)
        root.cardList = next
    }

    ComponentPreview {
        id: previewContainer
        width: parent.width
        title: ChaSetI18n.tr("overlays.activityStack.sandboxTitle", "Activity Stack Interactive Sandbox")
        stageHeight: ThemeTokens.dp(440)
        reactCode: `<ActivityStack
  placement="${root.demoPlacement}"
  maxVisible={${root.demoMaxVisible}}
  collapsible
  label="Activity Stack"
  entries={[
    {
      id: "card-1",
      node: (
        <ActivityCard
          itemId="card-1"
          tone="neutral"
          title="${ChaSetI18n.tr("overlays.activityStack.sampleTaskTitle", "Sync Pipeline")}"
          detail="${ChaSetI18n.tr("overlays.activityStack.sampleTaskDetail", "Pushing changes to remote branch")}"
          progress={0.65}
          onDismiss={() => removeCard("card-1")}
        />
      ),
    },
  ]}
/>`
        qtCode: `ChaSetActivityStack {
    anchorItem: sandboxBox
    placement: "${root.demoPlacement}"
    maxVisible: ${root.demoMaxVisible}
    collapsible: true
    entries: [
        {
            id: "card-1",
            tone: "neutral",
            title: "${ChaSetI18n.tr("overlays.activityStack.sampleTaskTitle", "Sync Pipeline")}",
            detail: "${ChaSetI18n.tr("overlays.activityStack.sampleTaskDetail", "Pushing changes to remote branch")}",
            progress: 0.65,
            dismissible: true
        }
    ]
}`

        controlsData: [
            Row {
                spacing: ThemeTokens.dp(8)

                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("overlays.activityStack.addCard", "Add Card")
                    onClicked: root.addCard()
                }

                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("overlays.activityStack.removeCard", "Remove Card")
                    enabled: root.cardList.length > 0
                    onClicked: root.removeCard()
                }

                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("overlays.activityStack.toggleCollapse", "Toggle Collapse")
                    onClicked: stackInst.collapsed = !stackInst.collapsed
                }

                Row {
                    spacing: ThemeTokens.dp(4)
                    DocText {
                        text: ChaSetI18n.tr("overlays.activityStack.placement", "Placement:")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeCaption
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetSegmentedControl {
                        size: "sm"
                        value: root.demoPlacement
                        options: [
                            { label: ChaSetI18n.tr("overlays.activityStack.bottomRight", "Bottom Right"), value: "bottom-right" },
                            { label: ChaSetI18n.tr("overlays.activityStack.bottomLeft", "Bottom Left"), value: "bottom-left" },
                            { label: ChaSetI18n.tr("overlays.activityStack.topRight", "Top Right"), value: "top-right" },
                            { label: ChaSetI18n.tr("overlays.activityStack.topLeft", "Top Left"), value: "top-left" },
                            { label: ChaSetI18n.tr("overlays.activityStack.bottomCenter", "Bottom Center"), value: "bottom-center" }
                        ]
                        onValueChanged: function(val) { root.demoPlacement = val }
                    }
                }

                Row {
                    spacing: ThemeTokens.dp(4)
                    DocText {
                        text: ChaSetI18n.tr("overlays.activityStack.maxVisible", "Max Visible:")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeCaption
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetSegmentedControl {
                        size: "sm"
                        value: String(root.demoMaxVisible)
                        options: [
                            { label: "2", value: "2" },
                            { label: "3", value: "3" },
                            { label: "4", value: "4" }
                        ]
                        onValueChanged: function(val) { root.demoMaxVisible = parseInt(val, 10) }
                    }
                }
            }
        ]

        Rectangle {
            id: sandboxBox
            anchors.fill: parent
            anchors.margins: ThemeTokens.dp(16)
            radius: ThemeTokens.dp(12)
            clip: true
            color: Qt.rgba(ThemeTokens.panelRaised.r, ThemeTokens.panelRaised.g, ThemeTokens.panelRaised.b, 0.2)
            border.width: 1
            border.color: Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.7)

            Text {
                anchors.centerIn: parent
                text: ChaSetI18n.tr("overlays.activityStack.activeCardsCount", "Active cards: %1").arg(root.cardList.length)
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
                font.family: Typography.familySans
            }

            ChaSetActivityStack {
                id: stackInst
                anchorItem: sandboxBox
                placement: root.demoPlacement
                maxVisible: root.demoMaxVisible
                collapsible: true
                summaryLabel: "active tasks"
                entries: root.cardList
                onDismissed: function(id) {
                    root.dismissCard(id)
                }
            }
        }
    }

    DocAnatomy {
        sectionId: "anatomy"
        width: parent.width
        reactCode: `import { ActivityStack } from '@chahu/cha-set';

<ActivityStack
  entries={entries}
  placement="bottom-right"
  maxVisible={3}
  collapsible
  onDismissed={(id) => handleDismiss(id)}
/>`
        qtCode: `import ChaSet

ChaSetActivityStack {
    anchorItem: viewportItem
    placement: "bottom-right"
    maxVisible: 3
    collapsible: true
    entries: demoEntries
    onDismissed: function(id) {
        dismissCard(id)
    }
}`
    }

    DocText {
        text: ChaSetI18n.tr("overlays.activityStack.animationsTitle", "Animations")
        font.pixelSize: Typography.sizeH2
        font.weight: Typography.weightBold
        color: ThemeTokens.text
    }
    DocText {
        text: ChaSetI18n.tr("overlays.activityStack.animationsDesc", "Card entry/exit and summary row collapse use standard motion tokens and respect prefers-reduced-motion.")
        font.pixelSize: Typography.sizeSmall
        color: ThemeTokens.subduedText
    }
    DocMarkdown {
        width: parent.width
        docId: "activity-stack"
        section: "animations"
    }

    DocText {
        text: ChaSetI18n.tr("showcase.keyboardNavigation", "Keyboard Navigation")
        font.pixelSize: Typography.sizeH2
        font.weight: Typography.weightBold
        color: ThemeTokens.text
    }
    DocMarkdown {
        width: parent.width
        docId: "activity-stack"
        section: "keyboard"
    }

    DocText {
        text: ChaSetI18n.tr("showcase.propsReference", "Props Reference")
        font.pixelSize: Typography.sizeH2
        font.weight: Typography.weightBold
        color: ThemeTokens.text
    }
    DocMarkdown {
        width: parent.width
        docId: "activity-stack"
        section: "props"
    }
}
