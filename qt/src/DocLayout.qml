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
                    implicitHeight: Math.max(headerText.implicitHeight, copyBtn.height)

                    TextEdit {
                        id: headerText
                        anchors.left: parent.left
                        anchors.right: copyBtn.left
                        anchors.rightMargin: 16
                        anchors.top: parent.top
                        textFormat: TextEdit.RichText
                        wrapMode: TextEdit.WordWrap
                        text: {
                            var html = "<div style='line-height: 1.25;'>";
                            html += "<span style='font-size: 24pt; font-weight: bold; color: " + ThemeTokens.text + ";'>" + root.pageTitle + "</span>";
                            if (root.description) {
                                html += "<div style='margin-top: 6pt; font-size: 10.5pt; line-height: 1.5; color: " + ThemeTokens.subduedText + ";'>" + root.description + "</div>";
                            }
                            html += "</div>";
                            return html;
                        }
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

                        onSelectedTextChanged: {
                            if (selectedText.length > 0) SelectionHub.claim(headerText);
                            else if (SelectionHub.activeOwner === headerText) SelectionHub.clear(headerText);
                        }
                    }

                    ChaSetCopyButton {
                        id: copyBtn
                        anchors.top: parent.top
                        anchors.right: parent.right
                        variant: "outline"
                        size: "sm"
                        label: "Copy Link"
                        copiedLabel: "Copied!"
                        text: "https://cha-set.dev/#" + root.pageTitle.toLowerCase().replace(/ /g, "-")
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
