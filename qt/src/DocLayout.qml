// DocLayout.qml — Standard Documentation Page Template matching React DocLayout.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root
    width: parent ? parent.width : 1000
    implicitHeight: layoutRow.implicitHeight + 60

    property string category: "Components"
    property string pageTitle: "Button"
    property string description: ""
    property var tocItems: []
    default property alias contentData: pageContentCol.data

    MouseArea {
        anchors.fill: parent
        z: -1
        onClicked: SelectionHub.clearAll()
    }

    Row {
        id: layoutRow
        anchors.horizontalCenter: parent.horizontalCenter
        width: Math.min(parent.width - 48, 1000)
        spacing: 32

        // Main Center Content Column (max-w-4xl)
        Column {
            id: mainCol
            width: root.tocItems && root.tocItems.length > 0 ? (layoutRow.width - 180 - layoutRow.spacing) : layoutRow.width
            spacing: 24

            // Breadcrumb
            TextEdit {
                id: breadcrumbText
                text: "Docs / " + root.category + " / " + root.pageTitle
                color: ThemeTokens.subduedText
                font.family: Typography.familySans
                font.pixelSize: Typography.sizeSmall
                readOnly: true
                selectByMouse: true
                selectByKeyboard: true
                cursorVisible: false
                activeFocusOnPress: false
                textMargin: 0
                padding: 0
                selectionColor: ThemeTokens.accent
                selectedTextColor: "#ffffff"
                width: contentWidth
                height: contentHeight

                HoverHandler {
                    cursorShape: Qt.IBeamCursor
                }

                onSelectedTextChanged: {
                    if (selectedText.length > 0) SelectionHub.claim(breadcrumbText);
                    else if (SelectionHub.activeOwner === breadcrumbText) SelectionHub.clear(breadcrumbText);
                }
            }

            // Page Header with Copy Link (Single RichText flow allowing continuous drag-selection)
            Column {
                width: parent.width
                spacing: 8

                Item {
                    width: parent.width
                    implicitHeight: Math.max(titleText.implicitHeight, copyBtn.height)

                    TextEdit {
                        id: titleText
                        anchors.left: parent.left
                        anchors.right: copyBtn.left
                        anchors.rightMargin: 16
                        anchors.verticalCenter: copyBtn.verticalCenter
                        text: root.pageTitle
                        color: ThemeTokens.text
                        font.family: Typography.familySans
                        font.pixelSize: Typography.sizeDisplay
                        font.weight: Typography.weightBold
                        readOnly: true
                        selectByMouse: true
                        selectByKeyboard: true
                        cursorVisible: false
                        activeFocusOnPress: true
                        textMargin: 0
                        padding: 0
                        selectionColor: ThemeTokens.accent
                        selectedTextColor: "#ffffff"
                        height: contentHeight

                        HoverHandler {
                            cursorShape: Qt.IBeamCursor
                        }

                        onSelectedTextChanged: {
                            if (selectedText.length > 0) SelectionHub.claim(titleText);
                            else if (SelectionHub.activeOwner === titleText) SelectionHub.clear(titleText);
                        }
                    }

                    ChaSetCopyButton {
                        id: copyBtn
                        anchors.right: parent.right
                        anchors.top: parent.top
                        text: "qt-page://" + root.pageTitle.toLowerCase().replace(/\s+/g, '-')
                        label: "Copy Link"
                        variant: "outline"
                        size: "sm"
                    }
                }

                TextEdit {
                    id: descText
                    visible: root.description !== ""
                    width: parent.width
                    text: root.description
                    color: ThemeTokens.subduedText
                    font.family: Typography.familySans
                    font.pixelSize: Typography.sizeHeading
                    wrapMode: TextEdit.WordWrap
                    readOnly: true
                    selectByMouse: true
                    selectByKeyboard: true
                    cursorVisible: false
                    activeFocusOnPress: true
                    textMargin: 0
                    padding: 0
                    selectionColor: ThemeTokens.accent
                    selectedTextColor: "#ffffff"

                    HoverHandler {
                        cursorShape: Qt.IBeamCursor
                    }

                    onSelectedTextChanged: {
                        if (selectedText.length > 0) SelectionHub.claim(descText);
                        else if (SelectionHub.activeOwner === descText) SelectionHub.clear(descText);
                    }
                }
            }

            // Divider matching React's Separator mb-8
            ChaSetSeparator {
                width: parent.width
            }

            // Page Body Content Slot
            Column {
                id: pageContentCol
                width: parent.width
                spacing: 32
            }
        }

        // Right Table of Contents (TOC, 180px width)
        Column {
            id: tocCol
            visible: root.tocItems && root.tocItems.length > 0
            width: 180
            spacing: 12

            DocText {
                text: "ON THIS PAGE"
                textColor: ThemeTokens.subduedText
                font.family: Typography.familySans
                font.pixelSize: Typography.sizeCaption
                font.weight: Typography.weightSemibold
                font.letterSpacing: Typography.trackingPx(Typography.sizeCaption, "wider")
            }

            Repeater {
                model: root.tocItems
                delegate: Text {
                    required property var modelData
                    text: modelData.title
                    color: ThemeTokens.subduedText
                    font.family: Typography.familySans
                    font.pixelSize: Typography.sizeSmall
                    wrapMode: Text.WordWrap
                    width: tocCol.width
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                    }
                }
            }
        }
    }
}
