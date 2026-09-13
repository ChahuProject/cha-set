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
                text: "Docs / " + root.category + " / " + root.pageTitle
                color: ThemeTokens.subduedText
                font.pixelSize: 12
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
            }

            // Page Header with Copy Link
            Column {
                width: parent.width
                spacing: 8

                Item {
                    width: parent.width
                    height: Math.max(titleText.implicitHeight, copyBtn.height)

                    TextEdit {
                        id: titleText
                        anchors.left: parent.left
                        anchors.right: copyBtn.left
                        anchors.rightMargin: 16
                        anchors.verticalCenter: parent.verticalCenter
                        text: root.pageTitle
                        color: ThemeTokens.text
                        font.pixelSize: 32
                        font.weight: Font.Bold
                        font.letterSpacing: -0.5
                        height: contentHeight
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
                    }

                    ChaSetCopyButton {
                        id: copyBtn
                        anchors.right: parent.right
                        anchors.verticalCenter: parent.verticalCenter
                        variant: "outline"
                        size: "sm"
                        label: "Copy Link"
                        copiedLabel: "Copied!"
                        text: "https://cha-set.dev/#" + root.pageTitle.toLowerCase().replace(/ /g, "-")
                    }
                }

                TextEdit {
                    id: descText
                    visible: root.description !== ""
                    text: root.description
                    color: ThemeTokens.subduedText
                    font.pixelSize: 14
                    wrapMode: TextEdit.WordWrap
                    width: parent.width
                    height: contentHeight
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
                }

                ChaSetSeparator {}
            }

            // Page Dynamic Content
            Column {
                id: pageContentCol
                width: parent.width
                spacing: 28
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
                font.pixelSize: 11
                font.weight: Font.DemiBold
                font.letterSpacing: 0.5
            }

            Repeater {
                model: root.tocItems
                delegate: Text {
                    required property var modelData
                    text: modelData.title
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
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
