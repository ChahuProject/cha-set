// SplitButtonDocPage.qml — Living Documentation for ChaSetSplitButton
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Split Button"
    description: ChaSetI18n.tr("components.split-button.description", "Dual-action button with primary direct click and secondary attached dropdown menu.")

    property string lastTriggered: ChaSetI18n.tr("components.split-button.none", "None")

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.splitButton.sandboxTitle", "Split Button Sandbox")
        reactCode: `<SplitButton
  text="Deploy to Production"
  variant="default"
  menuItems={[
    { label: "Deploy to Staging", onSelect: () => {} },
    { label: "Create Release Tag", onSelect: () => {} }
  ]}
  onClick={() => {}}
/>`
        qtCode: `ChaSetSplitButton {
    text: "Deploy to Production"
    variant: "default"
    menuItems: [
        { id: "staging", label: "Deploy to Staging" },
        { id: "tag", label: "Create Release Tag" },
        { id: "rollback", label: "Rollback Build", destructive: true }
    ]
    onClicked: console.log("Primary action")
    onMenuItemClicked: function(id) { console.log(id) }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 16

                ChaSetSplitButton {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: ChaSetI18n.tr("components.split-button.deployBuild", "Deploy Build #142")
                    variant: "default"
                    menuItems: [
                        { id: "staging", label: ChaSetI18n.tr("components.split-button.deployStaging", "Deploy to Staging"), icon: "rocket" },
                        { id: "tag", label: ChaSetI18n.tr("components.split-button.tagRelease", "Tag Release v1.2.0"), icon: "tag" },
                        { id: "archive", label: ChaSetI18n.tr("components.split-button.archiveArtifact", "Archive Artifact"), icon: "package" },
                        { id: "abort", label: ChaSetI18n.tr("components.split-button.abortPipeline", "Abort Pipeline"), icon: "stop", destructive: true }
                    ]
                    onClicked: root.lastTriggered = ChaSetI18n.tr("components.split-button.deployBuild", "Deploy Build #142")
                    onMenuItemClicked: function(id) {
                        root.lastTriggered = id
                    }
                }

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: ChaSetI18n.tr("components.split-button.eventMsg", "Event: {{event}}", { "event": root.lastTriggered })
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                    font.family: Typography.familyMono
                }
            }
        }
    }

        DocAnatomy {
        width: parent.width
        qtCode: "import ChaSet\n\nChaSetSplitButton {\n    text: \"Deploy\"\n    variant: \"default\"\n    menuItems: [\n        { id: \"staging\", label: \"Deploy to Staging\" }\n    ]\n}"
        reactCode: "import { SplitButton } from '@chahu/cha-set';\n\n<SplitButton\n  text=\"Deploy\"\n  variant=\"default\"\n  menuItems={[{ label: 'Deploy to Staging', onSelect: () => {} }]}\n/>"
    }

        // Animations
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(8)

        DocText {
            text: ChaSetI18n.tr("showcase.animations", "Animations")
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
            color: ThemeTokens.text
        }

        DocText {
            text: ChaSetI18n.tr("showcase.animationsDescQml", "State changes (hover, press, focus) animate over duration-quick with standard easing curves. Durations and easing resolve from theme tokens; prefers-reduced-motion zeroes them automatically (governed by ThemeTokens.animationsEnabled).")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    DocMarkdown {
        width: parent.width
        docId: "split-button"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "split-button"
        section: "props"
    }
    }
