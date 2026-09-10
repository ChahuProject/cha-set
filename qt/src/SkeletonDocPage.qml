// SkeletonDocPage.qml — Living Documentation for ChaSetSkeleton
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Skeleton"
    description: "Used to show a placeholder while content is loading, utilizing a subtle looping pulse animation."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    property string animationMode: "pulse"

    ComponentPreview {
        title: "Skeleton Preview"
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
                spacing: 16

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: 8

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
                    spacing: 16

                    ChaSetSkeleton {
                        width: 52
                        height: 52
                        rounded: "full"
                        animation: root.animationMode
                    }

                    Column {
                        spacing: 10
                        anchors.verticalCenter: parent.verticalCenter

                        ChaSetSkeleton {
                            width: 220
                            height: 16
                            rounded: "md"
                            animation: root.animationMode
                        }

                        ChaSetSkeleton {
                            width: 160
                            height: 14
                            rounded: "md"
                            animation: root.animationMode
                        }

                        ChaSetSkeleton {
                            width: 100
                            height: 12
                            rounded: "md"
                            animation: root.animationMode
                        }
                    }
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetSkeleton { width: 200; height: 20; rounded: 'md' }"
        language: "qml"
    }

    KeyboardShortcutsTable {
        componentId: "skeleton"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "animation", type: "string", default: "'pulse'", description: "Animation mode: 'pulse' | 'wave' | 'none'." },
            { name: "rounded", type: "string", default: "'md'", description: "Corner radius preset: 'none' | 'sm' | 'md' | 'lg' | 'full'." },
            { name: "customRadius", type: "int", default: "-1", description: "Custom corner radius override." },
            { name: "animate", type: "bool", default: "true", description: "Convenience flag to enable or disable animation." }
        ]
    }
}
