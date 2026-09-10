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

    ComponentPreview {
        title: "Skeleton Preview"
        reactCode: `<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>`
        qtCode: `Row {
    spacing: 12
    ChaSetSkeleton { width: 48; height: 48; customRadius: 24 }
    Column {
        spacing: 8
        ChaSetSkeleton { width: 200; height: 16 }
        ChaSetSkeleton { width: 140; height: 16 }
    }
}`

        Item {
            anchors.fill: parent

            Row {
                anchors.centerIn: parent
                spacing: 16

                ChaSetSkeleton {
                    width: 52
                    height: 52
                    customRadius: 26
                }

                Column {
                    spacing: 10
                    anchors.verticalCenter: parent.verticalCenter

                    ChaSetSkeleton {
                        width: 220
                        height: 16
                        customRadius: 4
                    }

                    ChaSetSkeleton {
                        width: 160
                        height: 14
                        customRadius: 4
                    }

                    ChaSetSkeleton {
                        width: 100
                        height: 12
                        customRadius: 4
                    }
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetSkeleton { width: 200; height: 20 }"
        language: "qml"
    }

    
    KeyboardShortcutsTable {
        componentId: "skeleton"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "customRadius", type: "int", default: "4", description: "Corner radius of the skeleton element." },
            { name: "animate", type: "bool", default: "true", description: "Whether the pulse animation is active." }
        ]
    }
}
