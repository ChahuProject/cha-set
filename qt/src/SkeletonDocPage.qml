// SkeletonDocPage.qml — Living Documentation for ChaSetSkeleton
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Skeleton"
    description: "Used to show a placeholder while content is loading, utilizing a subtle looping pulse animation."

    property string animationMode: "pulse"

    ComponentPreview {
        title: "Skeleton Sandbox"
        reactCode: `<div className="flex items-center space-x-4">
  <Skeleton animation="${root.animationMode}" rounded="full" className="size-12" />
  <div className="space-y-2">
    <Skeleton animation="${root.animationMode}" className="h-4 w-64" />
    <Skeleton animation="${root.animationMode}" className="h-4 w-48" />
  </div>
</div>`
        qtCode: `Row {
    spacing: 12
    ChaSetSkeleton { width: 48; height: 48; rounded: "full"; animation: "${root.animationMode}" }
    Column {
        spacing: 8
        ChaSetSkeleton { width: 200; height: 16; rounded: "md"; animation: "${root.animationMode}" }
        ChaSetSkeleton { width: 140; height: 16; rounded: "md"; animation: "${root.animationMode}" }
    }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(16)

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: ThemeTokens.dp(8)

                    ChaSetButton {
                        text: "pulse"
                        variant: root.animationMode === "pulse" ? "default" : "outline"
                        size: "sm"
                        onClicked: root.animationMode = "pulse"
                    }

                    ChaSetButton {
                        text: "wave"
                        variant: root.animationMode === "wave" ? "default" : "outline"
                        size: "sm"
                        onClicked: root.animationMode = "wave"
                    }

                    ChaSetButton {
                        text: "none"
                        variant: root.animationMode === "none" ? "default" : "outline"
                        size: "sm"
                        onClicked: root.animationMode = "none"
                    }
                }

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: ThemeTokens.dp(16)

                    ChaSetSkeleton {
                        width: ThemeTokens.dp(52)
                        height: ThemeTokens.dp(52)
                        rounded: "full"
                        animation: root.animationMode
                    }

                    Column {
                        spacing: ThemeTokens.dp(10)
                        anchors.verticalCenter: parent.verticalCenter

                        ChaSetSkeleton {
                            width: ThemeTokens.dp(220)
                            height: ThemeTokens.dp(16)
                            rounded: "md"
                            animation: root.animationMode
                        }

                        ChaSetSkeleton {
                            width: ThemeTokens.dp(160)
                            height: ThemeTokens.dp(14)
                            rounded: "md"
                            animation: root.animationMode
                        }

                        ChaSetSkeleton {
                            width: ThemeTokens.dp(100)
                            height: ThemeTokens.dp(12)
                            rounded: "md"
                            animation: root.animationMode
                        }
                    }
                }
            }
        }
    }

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

Column {
    spacing: 8
    ChaSetSkeleton { width: 192; height: 16 }
    ChaSetSkeleton { width: 128; height: 16 }
}`
        reactCode: `import { Skeleton } from '@chahu/cha-set';

<div className="space-y-2">
  <Skeleton className="h-4 w-48" />
  <Skeleton className="h-4 w-32" />
</div>`
    }



    "
        language: "qml"
    }

    // Animations
    Column {
        width: parent.width
        spacing: 12

        DocText { text: "Animations"; color: ThemeTokens.text; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold }

        DocText { text: "Motion behavior for the loading placeholder effects."; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }

        DocText { text: "• pulse animates a SequentialAnimation over opacity; wave moves a linear NumberAnimation over x for the shimmer sweep."; color: ThemeTokens.text; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }
        DocText { text: "• All animations stop when ThemeTokens.animationsEnabled is false, keeping the skeleton static."; color: ThemeTokens.text; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }
    }

    ComponentReference {
        name: "Skeleton"
        componentId: "skeleton"
        propsModel: [
            { name: "animation", type: "string", default: "'pulse'", description: "Animation mode: 'pulse' | 'wave' | 'none'." },
            { name: "rounded", type: "string", default: "'md'", description: "Corner radius preset: 'none' | 'sm' | 'md' | 'lg' | 'full'." },
            { name: "customRadius", type: "int", default: "-1", description: "Custom corner radius override." },
            { name: "animate", type: "bool", default: "true", description: "Convenience flag to enable or disable animation." }
        ]
    }
}
        ]
    }
}
