// ComponentPreview.qml — Visual Component Sandbox matching React ComponentPreview.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

ChaSetCard {
    id: root
    width: parent ? parent.width : ThemeTokens.dp(760)
    implicitHeight: previewContainer.height
    height: implicitHeight
    clip: true

    property string title: ""
    property string reactCode: ""
    property string qtCode: ""
    property string activeTab: "preview"
    property int stageHeight: 280

    readonly property string effectiveQtCode: (root.qtCode && root.qtCode.trim() !== "") ? root.qtCode : ("// Qt QML code for " + (root.title !== "" ? root.title : "this component") + " is being aligned.\nimport ChaSet\n")
    readonly property string effectiveReactCode: (root.reactCode && root.reactCode.trim() !== "") ? root.reactCode : ("// React code for " + (root.title !== "" ? root.title : "this component") + " is being aligned.\nimport { ... } from '@chahu/cha-set';\n")

    default property alias stageData: stageContainer.data
    property alias controlsData: controlsContainer.data

    readonly property real activeContentHeight: {
        if (root.activeTab === "qt") {
            return qtCodeBlock.height;
        } else if (root.activeTab === "code") {
            return reactCodeBlock.height;
        } else {
            return previewContent.height;
        }
    }

    Column {
        id: previewContainer
        width: parent.width
        height: headerRect.height + contentContainer.height

        // Tab Navigation Header (44px height matching React px-3 py-2 with default size SegmentedControl)
        ChaSetSquircle {
            id: headerRect
            width: parent.width
            height: ThemeTokens.dp(44)
            color: root.isDark ? Qt.rgba(30/255, 41/255, 59/255, 0.4) : Qt.rgba(241/255, 245/255, 249/255, 0.4)
            radius: root.radius
            roundTop: true
            roundBottom: false
            border.width: 0

            // Bottom border matching React border-b border-border
            Rectangle {
                anchors.bottom: parent.bottom
                width: parent.width
                height: 1
                color: root.cBorder
            }

            ChaSetSegmentedControl {
                anchors.left: parent.left
                anchors.leftMargin: ThemeTokens.dp(12)
                anchors.verticalCenter: parent.verticalCenter
                size: "default"
                value: root.activeTab
                options: [
                    { label: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("showcase.preview", "Preview") : "Preview", value: "preview" },
                    { label: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("showcase.qtQml", "Qt QML") : "Qt QML", value: "qt" },
                    { label: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("showcase.reactCode", "React Code") : "React Code", value: "code" }
                ]
                onValueSelected: function(val) {
                    root.activeTab = val
                }
            }

            TextEdit {
                id: previewTitleText
                visible: root.title !== ""
                anchors.right: parent.right
                anchors.rightMargin: ThemeTokens.dp(14)
                anchors.verticalCenter: parent.verticalCenter
                text: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("showcase.previewTitles." + root.title, root.title) : root.title
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
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
                    if (selectedText.length > 0) SelectionHub.claim(previewTitleText);
                    else if (SelectionHub.activeOwner === previewTitleText) SelectionHub.clear(previewTitleText);
                }

                Keys.onPressed: function(event) {
                    if (event.matches(StandardKey.Copy) || (event.key === Qt.Key_C && (event.modifiers & (Qt.ControlModifier | Qt.MetaModifier)))) {
                        SelectionHub.copyActiveSelection();
                        event.accepted = true;
                    }
                }

                TapHandler {
                    acceptedButtons: Qt.RightButton
                    onTapped: function(eventPoint) {
                        var scenePos = eventPoint.scenePosition;
                        SelectionHub.showContextMenu(scenePos.x, scenePos.y, previewTitleText);
                    }
                }
            }
        }

        // Active Tab Content Container
        Item {
            id: contentContainer
            width: parent.width
            implicitHeight: root.activeContentHeight
            height: implicitHeight
            clip: true

            // Preview Mode Content
            Column {
                id: previewContent
                visible: root.activeTab === "preview"
                width: parent.width
                height: stageContainer.height + (controlsBar.visible ? controlsBar.height : 0)

                // Center Stage
                Item {
                    id: stageContainer
                    width: parent.width
                    height: ThemeTokens.dp(root.stageHeight)
                    implicitHeight: height
                    clip: true
                }

                // Controls Bar (matching React border-t border-border/40 bg-muted/20)
                ChaSetSquircle {
                    id: controlsBar
                    visible: controlsContainer.children.length > 0
                    width: parent.width
                    implicitHeight: controlsContainer.implicitHeight + ThemeTokens.dp(24)
                    height: implicitHeight
                    clip: true
                    color: root.isDark ? Qt.rgba(30/255, 41/255, 59/255, 0.2) : Qt.rgba(241/255, 245/255, 249/255, 0.2)
                    radius: root.radius
                    roundTop: false
                    roundBottom: true
                    border.width: 0

                    // Top border divider matching React border-t
                    Rectangle {
                        anchors.top: parent.top
                        width: parent.width
                        height: 1
                        color: root.cBorder
                    }

                    Flow {
                        id: controlsContainer
                        width: parent.width - ThemeTokens.dp(32)
                        anchors.horizontalCenter: parent.horizontalCenter
                        anchors.top: parent.top
                        anchors.topMargin: ThemeTokens.dp(12)
                        spacing: ThemeTokens.dp(16)

                        function triggerReflow() {
                            controlsContainer.flow = Flow.TopToBottom;
                            controlsContainer.flow = Flow.LeftToRight;
                        }

                        onChildrenChanged: {
                            for (var i = 0; i < children.length; ++i) {
                                var child = children[i];
                                if (child && child.widthChanged !== undefined) {
                                    child.widthChanged.connect(reflowTimer.restart);
                                }
                            }
                            reflowTimer.restart();
                        }

                        Component.onCompleted: Qt.callLater(triggerReflow)

                        Timer {
                            id: reflowTimer
                            interval: 16
                            repeat: false
                            onTriggered: controlsContainer.triggerReflow()
                        }
                    }
                }
            }

            // Qt QML Code Tab
            ChaSetCodeBlock {
                id: qtCodeBlock
                visible: root.activeTab === "qt"
                width: parent.width
                code: root.effectiveQtCode
                language: "qml"
                radius: root.radius
                roundTop: false
                roundBottom: true
                border.width: 0
            }

            // React Code Tab
            ChaSetCodeBlock {
                id: reactCodeBlock
                visible: root.activeTab === "code"
                width: parent.width
                code: root.effectiveReactCode
                language: "tsx"
                radius: root.radius
                roundTop: false
                roundBottom: true
                border.width: 0
            }
        }
    }
}
