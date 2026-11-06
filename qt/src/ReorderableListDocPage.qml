// ReorderableListDocPage.qml — Living Documentation for ChaSetReorderableList
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Reorderable List"
    description: ChaSetI18n.tr("components.reorderableList.description", "Drag-and-drop reorderable action list with insertion slot indicators and Alt solo toggles.")
    tocItems: [
        { id: "overview", title: ChaSetI18n.tr("showcase.interactiveOverview", "Interactive Overview") },
        { id: "installation", title: ChaSetI18n.tr("showcase.installation", "Installation") },
        { id: "animations", title: ChaSetI18n.tr("showcase.animations", "Animations") },
        { id: "keyboard", title: ChaSetI18n.tr("showcase.keyboardNavigation", "Keyboard Navigation") },
        { id: "props", title: ChaSetI18n.tr("showcase.propsReference", "Props Reference") }
    ]

    readonly property var initialItems: [
        { id: "name", label: ChaSetI18n.tr("desktopComposite.reorderableList.fieldName", "File Name"), visible: true },
        { id: "size", label: ChaSetI18n.tr("desktopComposite.reorderableList.fieldSize", "File Size"), visible: true },
        { id: "type", label: ChaSetI18n.tr("desktopComposite.reorderableList.fieldType", "Item Type"), visible: true },
        { id: "date", label: ChaSetI18n.tr("desktopComposite.reorderableList.fieldDate", "Modified Date"), visible: true },
        { id: "tags", label: ChaSetI18n.tr("desktopComposite.reorderableList.fieldTags", "Tags"), visible: false },
        { id: "author", label: ChaSetI18n.tr("desktopComposite.reorderableList.fieldAuthor", "Author"), visible: false }
    ]

    property var demoItems: root.initialItems.slice()
    property bool listReorderable: true

    function toggleReorderable() {
        root.listReorderable = !root.listReorderable
    }

    function addItem() {
        var copy = root.demoItems.slice()
        copy.push({
            id: "custom_" + (copy.length + 1),
            label: ChaSetI18n.tr("desktopComposite.reorderableList.fieldName", "File Name") + " (" + (copy.length + 1) + ")",
            visible: true
        })
        root.demoItems = copy
    }

    function resetItems() {
        root.demoItems = root.initialItems.slice()
        root.listReorderable = true
    }

    ComponentPreview {
        id: previewContainer
        width: parent ? parent.width : ThemeTokens.dp(500)
        title: ChaSetI18n.tr("desktopComposite.reorderableList.sandboxTitle", "Reorderable List Sandbox")
        stageHeight: ThemeTokens.dp(280)
        reactCode: `<ReorderableList
  items={[
    { id: "name", label: "${ChaSetI18n.tr("desktopComposite.reorderableList.fieldName", "File Name")}", visible: true },
    { id: "size", label: "${ChaSetI18n.tr("desktopComposite.reorderableList.fieldSize", "File Size")}", visible: true },
    { id: "type", label: "${ChaSetI18n.tr("desktopComposite.reorderableList.fieldType", "Item Type")}", visible: true },
    { id: "date", label: "${ChaSetI18n.tr("desktopComposite.reorderableList.fieldDate", "Modified Date")}", visible: true },
    { id: "tags", label: "${ChaSetI18n.tr("desktopComposite.reorderableList.fieldTags", "Tags")}", visible: false },
  ]}
  reorderable={${root.listReorderable}}
  onItemsEdited={(newItems) => console.log("Items edited:", newItems)}
/>`
        qtCode: `ChaSetReorderableList {
    width: parent.width
    reorderable: ${root.listReorderable}
    items: [
        { id: "name", label: "${ChaSetI18n.tr("desktopComposite.reorderableList.fieldName", "File Name")}", visible: true },
        { id: "size", label: "${ChaSetI18n.tr("desktopComposite.reorderableList.fieldSize", "File Size")}", visible: true },
        { id: "type", label: "${ChaSetI18n.tr("desktopComposite.reorderableList.fieldType", "Item Type")}", visible: true },
        { id: "date", label: "${ChaSetI18n.tr("desktopComposite.reorderableList.fieldDate", "Modified Date")}", visible: true },
        { id: "tags", label: "${ChaSetI18n.tr("desktopComposite.reorderableList.fieldTags", "Tags")}", visible: false }
    ]
    onItemsEdited: (newItems) => console.log("Items edited:", newItems)
}`

        Column {
            anchors.centerIn: parent
            spacing: ThemeTokens.dp(16)
            width: ThemeTokens.dp(360)

            Row {
                anchors.horizontalCenter: parent.horizontalCenter
                spacing: ThemeTokens.dp(8)

                ChaSetButton {
                    variant: "outline"
                    size: "sm"
                    text: ChaSetI18n.tr("desktopComposite.reorderableList.toggleReorderable", "Toggle Reorderable")
                    onClicked: root.toggleReorderable()
                }

                ChaSetButton {
                    variant: "outline"
                    size: "sm"
                    text: ChaSetI18n.tr("desktopComposite.reorderableList.addItem", "Add Item")
                    onClicked: root.addItem()
                }

                ChaSetButton {
                    variant: "secondary"
                    size: "sm"
                    text: ChaSetI18n.tr("desktopComposite.reorderableList.resetList", "Reset Items")
                    onClicked: root.resetItems()
                }
            }

            Rectangle {
                width: parent.width
                height: reorderList.implicitHeight + ThemeTokens.dp(24)
                color: ThemeTokens.card
                border.color: ThemeTokens.border
                border.width: 1
                radius: ThemeTokens.panelRadius

                ChaSetReorderableList {
                    id: reorderList
                    anchors.centerIn: parent
                    width: parent.width - ThemeTokens.dp(24)
                    reorderable: root.listReorderable
                    items: root.demoItems
                    onItemsEdited: (newItems) => {
                        root.demoItems = newItems
                    }
                }
            }
        }
    }

    DocMarkdown {
        width: parent.width
        docId: "reorderable-list"
        section: "animations"
    }

    DocMarkdown {
        width: parent.width
        docId: "reorderable-list"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "reorderable-list"
        section: "props"
    }
}
