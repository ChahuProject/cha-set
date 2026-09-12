// ChaSetSelect.qml — Cross-Stack Select Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property string value: ""
    property string placeholder: "Select an option..."
    property var options: [] // [{ value: "apple", label: "Apple", disabled: false }]
    property bool disabled: false
    property int customRadius: 6
    property int highlightedIndex: -1
    property string modality: "pointer" // "pointer" | "keyboard"
    property real lastPointerSceneX: -1
    property real lastPointerSceneY: -1

    implicitWidth: 160
    implicitHeight: 32

    activeFocusOnTab: !root.disabled

    readonly property var currentOption: {
        for (let i = 0; i < options.length; i++) {
            if (String(options[i].value) === String(root.value)) return options[i]
        }
        return null
    }

    function handlePointerMove(idx, sceneX, sceneY) {
        if (Math.abs(sceneX - lastPointerSceneX) < 1.5 && Math.abs(sceneY - lastPointerSceneY) < 1.5) {
            return
        }
        lastPointerSceneX = sceneX
        lastPointerSceneY = sceneY
        modality = "pointer"
        highlightedIndex = idx
    }

    function openPopup() {
        if (root.disabled) return
        initHighlight()
        selectPopup.open()
    }

    function initHighlight() {
        let selectedIdx = -1
        for (let i = 0; i < options.length; i++) {
            if (String(options[i].value) === String(root.value)) {
                selectedIdx = i
                break
            }
        }
        if (selectedIdx >= 0 && (!options[selectedIdx] || !options[selectedIdx].disabled)) {
            highlightedIndex = selectedIdx
        } else {
            highlightedIndex = findFirstEnabledIndex()
        }
    }

    function findNextEnabledIndex(startIndex, direction) {
        if (!options || options.length === 0) return -1
        let count = options.length
        let idx = startIndex + direction
        for (let step = 0; step < count; step++) {
            if (idx < 0) idx = count - 1
            else if (idx >= count) idx = 0
            if (options[idx] && !options[idx].disabled) {
                return idx
            }
            idx += direction
        }
        return -1
    }

    function findFirstEnabledIndex() {
        if (!options || options.length === 0) return -1
        for (let i = 0; i < options.length; i++) {
            if (!options[i] || !options[i].disabled) return i
        }
        return -1
    }

    function findLastEnabledIndex() {
        if (!options || options.length === 0) return -1
        for (let i = options.length - 1; i >= 0; i--) {
            if (!options[i] || !options[i].disabled) return i
        }
        return -1
    }

    function selectHighlighted() {
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            const opt = options[highlightedIndex]
            if (opt && !opt.disabled) {
                root.value = String(opt.value)
                root.valueChanged()
                selectPopup.close()
                root.forceActiveFocus()
            }
        }
    }

    function handleKeyEvent(event) {
        if (!selectPopup.visible) {
            if (event.key === Qt.Key_Space || event.key === Qt.Key_Return || event.key === Qt.Key_Enter || event.key === Qt.Key_Down) {
                event.accepted = true
                openPopup()
            }
            return
        }

        if (event.key === Qt.Key_Down) {
            event.accepted = true
            modality = "keyboard"
            highlightedIndex = findNextEnabledIndex(highlightedIndex, 1)
        } else if (event.key === Qt.Key_Up) {
            event.accepted = true
            modality = "keyboard"
            highlightedIndex = findNextEnabledIndex(highlightedIndex, -1)
        } else if (event.key === Qt.Key_Home) {
            event.accepted = true
            modality = "keyboard"
            highlightedIndex = findFirstEnabledIndex()
        } else if (event.key === Qt.Key_End) {
            event.accepted = true
            modality = "keyboard"
            highlightedIndex = findLastEnabledIndex()
        } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter || event.key === Qt.Key_Space) {
            event.accepted = true
            selectHighlighted()
        } else if (event.key === Qt.Key_Escape) {
            event.accepted = true
            selectPopup.close()
            root.forceActiveFocus()
        }
    }

    Keys.onPressed: (event) => handleKeyEvent(event)

    Rectangle {
        id: triggerBox
        anchors.fill: parent
        radius: root.customRadius
        color: ThemeTokens.panel
        border.color: (selectPopup.visible || root.activeFocus) ? ThemeTokens.accent : (triggerMouse.containsMouse ? ThemeTokens.border : ThemeTokens.border)
        border.width: 1
        opacity: root.disabled ? 0.5 : 1.0

        Behavior on border.color {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
        }

        Row {
            anchors.fill: parent
            anchors.leftMargin: 10
            anchors.rightMargin: 10
            spacing: 6

            Text {
                id: labelText
                anchors.verticalCenter: parent.verticalCenter
                width: parent.width - 20
                elide: Text.ElideRight
                text: root.currentOption ? root.currentOption.label : root.placeholder
                color: root.currentOption ? ThemeTokens.text : ThemeTokens.subduedText
                font.pixelSize: 13
            }

            Text {
                anchors.verticalCenter: parent.verticalCenter
                text: selectPopup.visible ? "▴" : "▾"
                color: ThemeTokens.subduedText
                font.pixelSize: 11
            }
        }

        MouseArea {
            id: triggerMouse
            anchors.fill: parent
            hoverEnabled: !root.disabled
            cursorShape: root.disabled ? Qt.ArrowCursor : Qt.PointingHandCursor
            onClicked: {
                if (root.disabled) return
                root.forceActiveFocus()
                if (selectPopup.visible) selectPopup.close()
                else root.openPopup()
            }
        }
    }

    Popup {
        id: selectPopup
        y: root.height + 4
        width: Math.max(root.width, 160)
        padding: 4
        modal: false
        focus: true
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

        onOpened: {
            root.initHighlight()
            selectPopup.contentItem.forceActiveFocus()
        }
        onClosed: {
            root.highlightedIndex = -1
        }

        background: Rectangle {
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1
            radius: root.customRadius
            opacity: selectPopup.visible ? 1.0 : 0.0
            scale: selectPopup.visible ? 1.0 : 0.95

            Behavior on opacity {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeEntrance }
            }
            Behavior on scale {
                enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeEntrance }
            }
        }

        contentItem: Column {
            spacing: 2
            width: parent.width
            focus: true
            Keys.onPressed: (event) => root.handleKeyEvent(event)

            Repeater {
                model: root.options
                delegate: Rectangle {
                    required property var modelData
                    required property int index
                    width: parent.width
                    height: 28
                    radius: 4
                    readonly property bool isSelected: String(modelData.value) === String(root.value)
                    readonly property bool isHighlighted: index === root.highlightedIndex
                    color: isHighlighted ? ThemeTokens.hover : "transparent"
                    opacity: modelData.disabled ? 0.4 : 1.0

                    Behavior on color {
                        enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
                        ColorAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
                    }

                    Text {
                        anchors.left: parent.left
                        anchors.leftMargin: 8
                        anchors.right: checkText.visible ? checkText.left : parent.right
                        anchors.rightMargin: 8
                        anchors.verticalCenter: parent.verticalCenter
                        text: parent.modelData.label || ""
                        color: ThemeTokens.text
                        font.pixelSize: 12
                        font.weight: parent.isSelected ? Font.DemiBold : Font.Normal
                        elide: Text.ElideRight
                    }

                    Text {
                        id: checkText
                        anchors.right: parent.right
                        anchors.rightMargin: 8
                        anchors.verticalCenter: parent.verticalCenter
                        visible: parent.isSelected
                        text: "✓"
                        color: ThemeTokens.accent
                        font.pixelSize: 11
                    }

                    MouseArea {
                        id: optMouse
                        anchors.fill: parent
                        hoverEnabled: !parent.modelData.disabled
                        cursorShape: parent.modelData.disabled ? Qt.ArrowCursor : Qt.PointingHandCursor
                        onPositionChanged: (mouse) => {
                            var p = optMouse.mapToItem(null, mouse.x, mouse.y)
                            root.handlePointerMove(parent.index, p.x, p.y)
                        }
                        onEntered: {
                            if (root.modality === "pointer" && !parent.modelData.disabled) {
                                root.highlightedIndex = parent.index
                            }
                        }
                        onClicked: {
                            if (parent.modelData.disabled) return
                            root.value = String(parent.modelData.value)
                            root.valueChanged()
                            selectPopup.close()
                            root.forceActiveFocus()
                        }
                    }
                }
            }
        }
    }
}
