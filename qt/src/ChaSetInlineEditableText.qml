// ChaSetInlineEditableText.qml — Cross-Stack Inline Editable Text Component
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string value: ""
    property string text: ""
    property string placeholder: ChaSetI18n.tr("components.inlineEditableText.placeholder", "Enter text...")
    property string hint: ""
    property bool editing: false
    property string tempText: ""
    property bool disabled: false
    property string size: "default" // "default" | "sm"
    property string trigger: "click" // "click" | "doubleClick"
    property bool _saveVeto: false
    property double _enterTime: 0
    property bool _syncing: false

    onValueChanged: {
        if (root._syncing)
            return
        if (root.text !== root.value) {
            root._syncing = true
            root.text = root.value
            root._syncing = false
        }
    }

    onTextChanged: {
        if (root._syncing)
            return
        if (root.value !== root.text) {
            root._syncing = true
            root.value = root.text
            root._syncing = false
        }
    }

    signal textCommitted(string newText)
    signal save(string newValue)
    signal editCancelled()

    readonly property bool isSm: root.size === "sm"
    readonly property int _pencilSize: root.isSm ? 12 : 14

    implicitWidth: Math.max(ThemeTokens.dp(120), root.editing ? editInput.implicitWidth + ThemeTokens.dp(56) : displayLabel.implicitWidth + ThemeTokens.dp(_pencilSize) + ThemeTokens.dp(6) + ThemeTokens.dp(8))
    implicitHeight: root.editing ? editRow.implicitHeight : displayBox.implicitHeight
    opacity: root.disabled ? 0.5 : 1.0

    function rejectSave() {
        root._saveVeto = true
    }

    onEditingChanged: {
        if (root.editing) {
            root.tempText = root.value
            root._saveVeto = false
            root._enterTime = Date.now()
            editInput.forceActiveFocus()
            editInput.selectAll()
        }
    }

    function commit() {
        if (!root.editing)
            return
        var trimmed = (root.tempText || "").trim()
        if (!trimmed || trimmed === root.value) {
            root.editing = false
            return
        }
        root._saveVeto = false
        root.textCommitted(trimmed)
        root.save(trimmed)
        if (root._saveVeto)
            return
        root.value = trimmed
        root.editing = false
    }

    function cancel() {
        if (!root.editing)
            return
        root.tempText = root.value
        root.editing = false
        root.editCancelled()
    }

    // Display Mode — hug height, cursor-text, hover muted wash
    Rectangle {
        id: displayBox
        visible: !root.editing
        anchors.fill: parent
        implicitHeight: displayLabel.implicitHeight + ThemeTokens.dp(8)
        color: (!root.disabled && (hoverMouse.containsMouse || displayBox.activeFocus)) ? ThemeTokens.hover : "transparent"
        radius: ThemeTokens.dp(6)
        border.color: (!root.disabled && displayBox.activeFocus) ? ThemeTokens.focus : ((!root.disabled && hoverMouse.containsMouse) ? ThemeTokens.border : "transparent")
        border.width: displayBox.activeFocus ? 2 : 1
        activeFocusOnTab: !root.disabled && !root.editing

        Behavior on color {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
        }
        Behavior on border.color {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
        }

        Keys.onReturnPressed: function(event) {
            if (!root.disabled) {
                event.accepted = true
                root.editing = true
            }
        }

        Keys.onEnterPressed: function(event) {
            if (!root.disabled) {
                event.accepted = true
                root.editing = true
            }
        }

        Keys.onSpacePressed: function(event) {
            if (!root.disabled) {
                event.accepted = true
                root.editing = true
            }
        }

        Row {
            id: displayRow
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.verticalCenter: parent.verticalCenter
            anchors.leftMargin: ThemeTokens.dp(4)
            anchors.rightMargin: ThemeTokens.dp(4)
            spacing: ThemeTokens.dp(6)

            Text {
                id: displayLabel
                anchors.verticalCenter: parent.verticalCenter
                width: Math.max(0, displayBox.width - ThemeTokens.dp(8) - ThemeTokens.dp(root._pencilSize) - ThemeTokens.dp(6))
                text: root.value.length > 0 ? root.value : root.placeholder
                elide: Text.ElideRight
                maximumLineCount: 1
                verticalAlignment: Text.AlignVCenter
                color: root.value.length > 0 ? ThemeTokens.text : ThemeTokens.subduedText
                font.pixelSize: root.isSm ? Typography.sizeSmall : Typography.sizeHeading
                font.weight: Font.Medium
            }

            ChaSetIcon {
                anchors.verticalCenter: parent.verticalCenter
                name: "pencil"
                size: root._pencilSize
                color: ThemeTokens.subduedText
                opacity: (!root.disabled && (hoverMouse.containsMouse || displayBox.activeFocus)) ? 0.7 : 0.0

                Behavior on opacity {
                    enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                    NumberAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
                }
            }
        }

        MouseArea {
            id: hoverMouse
            anchors.fill: parent
            hoverEnabled: true
            cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.IBeamCursor
            onDoubleClicked: {
                if (!root.disabled) root.editing = true
            }
            onClicked: {
                if (!root.disabled) {
                    if (root.trigger === "click") {
                        root.editing = true
                    } else {
                        displayBox.forceActiveFocus()
                    }
                }
            }
        }
    }

    // Edit Mode — underline input + 20px ghost confirm/cancel (React parity)
    Row {
        id: editRow
        visible: root.editing
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.verticalCenter: parent.verticalCenter
        anchors.leftMargin: ThemeTokens.dp(4)
        anchors.rightMargin: ThemeTokens.dp(4)
        spacing: ThemeTokens.dp(6)
        implicitHeight: Math.max(editFieldWrap.implicitHeight, ThemeTokens.dp(20)) + ThemeTokens.dp(8)

        Item {
            id: editFieldWrap
            width: Math.max(0, editRow.width - actionGroup.width - editRow.spacing)
            height: Math.max(editInput.implicitHeight + ThemeTokens.dp(5), ThemeTokens.dp(20))
            anchors.verticalCenter: parent.verticalCenter
            implicitHeight: editInput.implicitHeight + ThemeTokens.dp(5)

            TextInput {
                id: editInput
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                text: root.tempText
                font.pixelSize: root.isSm ? Typography.sizeSmall : Typography.sizeHeading
                font.weight: Font.Medium
                color: ThemeTokens.text
                selectionColor: ThemeTokens.accent
                selectedTextColor: ThemeTokens.primaryForeground
                selectByMouse: true
                selectByKeyboard: true
                cursorVisible: activeFocus
                enabled: !root.disabled
                onTextEdited: root.tempText = text
                Keys.onReturnPressed: root.commit()
                Keys.onEnterPressed: root.commit()
                Keys.onEscapePressed: root.cancel()
                onActiveFocusChanged: {
                    if (!activeFocus && root.editing && Date.now() - root._enterTime > 200)
                        root.commit()
                }
            }

            Rectangle {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.bottom: parent.bottom
                height: 1
                color: ThemeTokens.accent
                opacity: editInput.activeFocus ? 1.0 : 0.6
            }

            Text {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                text: root.placeholder
                font.pixelSize: root.isSm ? Typography.sizeSmall : Typography.sizeHeading
                font.weight: Font.Medium
                color: ThemeTokens.subduedText
                visible: editInput.text === ""
                elide: Text.ElideRight
            }

            HoverHandler {
                cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.IBeamCursor
            }
        }

        Row {
            id: actionGroup
            anchors.verticalCenter: parent.verticalCenter
            spacing: ThemeTokens.dp(2)

            Rectangle {
                id: confirmBtn
                width: ThemeTokens.dp(20)
                height: ThemeTokens.dp(20)
                radius: ThemeTokens.dp(4)
                color: confirmMouse.containsMouse ? ThemeTokens.hover : "transparent"
                anchors.verticalCenter: parent.verticalCenter

                ChaSetIcon {
                    anchors.centerIn: parent
                    name: "check"
                    size: root.isSm ? 12 : 14
                    color: confirmMouse.containsMouse ? ThemeTokens.text : ThemeTokens.subduedText
                }

                MouseArea {
                    id: confirmMouse
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: root.commit()
                }
            }

            Rectangle {
                id: cancelBtn
                width: ThemeTokens.dp(20)
                height: ThemeTokens.dp(20)
                radius: ThemeTokens.dp(4)
                color: cancelMouse.containsMouse ? ThemeTokens.hover : "transparent"
                anchors.verticalCenter: parent.verticalCenter

                ChaSetIcon {
                    anchors.centerIn: parent
                    name: "x"
                    size: root.isSm ? 12 : 14
                    color: cancelMouse.containsMouse ? ThemeTokens.text : ThemeTokens.subduedText
                }

                MouseArea {
                    id: cancelMouse
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: root.cancel()
                }
            }
        }
    }
}
