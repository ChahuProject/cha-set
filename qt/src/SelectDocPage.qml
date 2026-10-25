// SelectDocPage.qml — Living Documentation for ChaSetSelect
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Select"
    description: ChaSetI18n.tr("components.select.description", "Displays a list of options for the user to pick from, triggered by a button with item indicators and scroll buttons.")

    property string selectedFruit: "apple"

    Column {
        property string sectionId: "overview"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("desktopComposite.select.overviewHeading", "Interactive Overview")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("formsA.select.overviewDesc", "Select an item from the menu. Selected value: {{value}}", { "value": root.selectedFruit })
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.select.sandboxTitle", "Select Sandbox")
        reactCode: `<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Choose fruit..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple" tooltip="Fuji crisp apples">Apple</SelectItem>
    <SelectItem value="banana" tooltip="Cavendish sweet bananas">Banana</SelectItem>
    <SelectItem value="cherry" tooltip="Rich in antioxidants">Cherry</SelectItem>
  </SelectContent>
</Select>`
        qtCode: `ChaSetSelect {
    value: "apple"
    placeholder: "Choose fruit..."
    options: [
        { value: "apple", label: "Apple", tooltip: "Fuji crisp apples" },
        { value: "banana", label: "Banana", tooltip: "Cavendish sweet bananas" },
        { value: "cherry", label: "Cherry", tooltip: "Rich in antioxidants" }
    ]
    onValueChanged: function(val) { console.log(val) }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(16)

                ChaSetSelect {
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: ThemeTokens.dp(200)
                    height: ThemeTokens.dp(32)
                    value: root.selectedFruit
                    placeholder: ChaSetI18n.tr("formsA.select.placeholder", "Select a fruit...")
                    options: [
                        { value: "apple", label: ChaSetI18n.tr("formsA.select.apple", "Apple"), tooltip: ChaSetI18n.tr("formsA.select.appleTooltip", "Fuji crisp apples") },
                        { value: "banana", label: ChaSetI18n.tr("formsA.select.banana", "Banana"), tooltip: ChaSetI18n.tr("formsA.select.bananaTooltip", "Cavendish sweet bananas") },
                        { value: "cherry", label: ChaSetI18n.tr("formsA.select.cherry", "Cherry"), tooltip: ChaSetI18n.tr("formsA.select.cherryTooltip", "Fresh sweet cherries") },
                        { value: "dragonfruit", label: ChaSetI18n.tr("formsA.select.dragonfruitDisabled", "Dragonfruit (Disabled)"), disabled: true, tooltip: ChaSetI18n.tr("formsA.select.dragonfruitTooltip", "Currently out of stock") }
                    ]
                    onValueChanged: root.selectedFruit = value
                }

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: ChaSetI18n.tr("formsA.select.selectedLabel", "Selected value: {{value}}", { value: root.selectedFruit })
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                    font.family: Typography.familyMono
                }
            }
        }
    }

        DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetSelect {
    model: ["Apple", "Banana", "Orange"]
    currentText: "Apple"
}`
        reactCode: `import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@chahu/cha-set';

<Select defaultValue="apple">
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Select fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectContent>
</Select>`
    }



    DocMarkdown {
        width: parent.width
        docId: "select"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "select"
        section: "props"
    }
}
