// ChaSetDurationInput.qml — Cross-Stack Segmented Duration Input Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property int value: 0
    property int maxHours: 99
    property string size: "default" // "sm" | "default" | "lg"
    property bool disabled: false
    property bool showPresets: true
    property bool showLabels: true
    property string hoursLabel: "Hours"
    property string minutesLabel: "Minutes"
    property string secondsLabel: "Seconds"
    property string presetsLabel: "Presets"
    property int customRadius: 6

    property var presets: [
        {
            label: "Seconds",
            items: [{ label: "30s", seconds: 30 }]
        },
        {
            label: "Minutes",
            items: [
                { label: "1m", seconds: 60 },
                { label: "5m", seconds: 300 },
                { label: "15m", seconds: 900 },
                { label: "30m", seconds: 1800 }
            ]
        },
        {
            label: "Hours",
            items: [
                { label: "1h", seconds: 3600 },
                { label: "2h", seconds: 7200 },
                { label: "6h", seconds: 21600 },
                { label: "12h", seconds: 43200 }
            ]
        }
    ]

    readonly property int boxHeight: size === "sm" ? 28 : (size === "lg" ? 36 : 32)
    readonly property int inputWidth: size === "sm" ? 32 : (size === "lg" ? 48 : 40)
    readonly property int stepperWidth: size === "sm" ? 14 : (size === "lg" ? 18 : 16)
    readonly property int fontSize: size === "sm" ? 11 : (size === "lg" ? 13 : 12)
    readonly property int labelFontSize: size === "sm" ? 9 : (size === "lg" ? 11 : 10)
    readonly property int segmentBoxWidth: inputWidth + stepperWidth

    property bool isEditing: false

    implicitWidth: mainColumn.implicitWidth
    implicitHeight: mainColumn.implicitHeight

    function splitSeconds(totalSeconds) {
        var s = Math.max(0, Math.floor(totalSeconds));
        return {
            h: Math.floor(s / 3600),
            m: Math.floor((s % 3600) / 60),
            sec: s % 60
        };
    }

    function syncInputsFromValue() {
        var parts = splitSeconds(root.value);
        hoursInput.text = String(parts.h);
        minutesInput.text = String(parts.m).padStart(2, "0");
        secondsInput.text = String(parts.sec).padStart(2, "0");
    }

    function syncValueFromInputs() {
        var h = parseInt(hoursInput.text, 10) || 0;
        var m = parseInt(minutesInput.text, 10) || 0;
        var s = parseInt(secondsInput.text, 10) || 0;
        root.value = h * 3600 + m * 60 + s;
    }

    function stepHours(delta) {
        if (root.disabled) return;
        var cur = parseInt(hoursInput.text, 10) || 0;
        var next = Math.min(Math.max(cur + delta, 0), root.maxHours);
        hoursInput.text = String(next);
        syncValueFromInputs();
    }

    function stepMinutes(delta) {
        if (root.disabled) return;
        var cur = parseInt(minutesInput.text, 10) || 0;
        var next = Math.min(Math.max(cur + delta, 0), 59);
        minutesInput.text = String(next).padStart(2, "0");
        syncValueFromInputs();
    }

    function stepSeconds(delta) {
        if (root.disabled) return;
        var cur = parseInt(secondsInput.text, 10) || 0;
        var next = Math.min(Math.max(cur + delta, 0), 59);
        secondsInput.text = String(next).padStart(2, "0");
        syncValueFromInputs();
    }

    onValueChanged: {
        if (!isEditing) {
            syncInputsFromValue();
        }
    }

    Component.onCompleted: {
        syncInputsFromValue();
    }

    Timer {
        id: repeatTimer
        interval: 400
        repeat: true
        property var stepFunc: null
        property int stepCount: 0
        onTriggered: {
            if (stepFunc) stepFunc();
            stepCount++;
            if (stepCount > 2) {
                interval = Math.max(30, Math.floor(interval * 0.85));
            }
        }
    }

    function startRepeat(func) {
        if (root.disabled) return;
        func();
        repeatTimer.stepCount = 0;
        repeatTimer.interval = 400;
        repeatTimer.stepFunc = func;
        repeatTimer.start();
    }

    function stopRepeat() {
        repeatTimer.stop();
        repeatTimer.stepFunc = null;
    }

    Column {
        id: mainColumn
        spacing: 4

        // Top Row: Segments and Presets Button
        Row {
            id: controlsRow
            spacing: 6

            // Hours Segment Box
            Rectangle {
                id: hoursBox
                width: root.segmentBoxWidth
                height: root.boxHeight
                radius: root.customRadius
                color: "transparent"
                border.color: hoursInput.activeFocus ? ThemeTokens.accent : ThemeTokens.border
                border.width: 1
                opacity: root.disabled ? 0.5 : 1.0

                TextInput {
                    id: hoursInput
                    anchors.left: parent.left
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    width: root.inputWidth
                    horizontalAlignment: TextInput.AlignHCenter
                    verticalAlignment: TextInput.AlignVCenter
                    color: ThemeTokens.text
                    font.pixelSize: root.fontSize
                    font.family: "monospace"
                    enabled: !root.disabled
                    selectByMouse: true
                    inputMethodHints: Qt.ImhDigitsOnly
                    validator: RegularExpressionValidator { regularExpression: /^[0-9]{1,3}$/ }

                    onTextEdited: {
                        root.isEditing = true;
                        root.syncValueFromInputs();
                    }
                    onEditingFinished: {
                        root.isEditing = false;
                        var val = Math.min(Math.max(parseInt(text, 10) || 0, 0), root.maxHours);
                        text = String(val);
                        root.syncValueFromInputs();
                    }
                    Keys.onUpPressed: function(e) { e.accepted = true; root.stepHours(1); }
                    Keys.onDownPressed: function(e) { e.accepted = true; root.stepHours(-1); }
                    Keys.onRightPressed: function(e) { e.accepted = true; minutesInput.forceActiveFocus(); }
                }

                // Steppers column
                Rectangle {
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    width: root.stepperWidth
                    color: "transparent"
                    border.color: ThemeTokens.border
                    border.width: 0

                    Rectangle {
                        anchors.left: parent.left
                        anchors.top: parent.top
                        anchors.bottom: parent.bottom
                        width: 1
                        color: ThemeTokens.border
                    }

                    Item {
                        id: hoursUpBtn
                        anchors.top: parent.top
                        anchors.left: parent.left
                        anchors.right: parent.right
                        height: parent.height / 2

                        Text {
                            anchors.centerIn: parent
                            text: "▴"
                            font.pixelSize: 8
                            color: hoursUpMouse.containsMouse ? ThemeTokens.text : ThemeTokens.subduedText
                        }
                        MouseArea {
                            id: hoursUpMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            enabled: !root.disabled
                            cursorShape: Qt.PointingHandCursor
                            onPressed: root.startRepeat(function() { root.stepHours(1); })
                            onReleased: root.stopRepeat()
                            onCanceled: root.stopRepeat()
                        }
                    }

                    Rectangle {
                        anchors.top: hoursUpBtn.bottom
                        anchors.left: parent.left
                        anchors.right: parent.right
                        height: 1
                        color: ThemeTokens.border
                    }

                    Item {
                        anchors.bottom: parent.bottom
                        anchors.left: parent.left
                        anchors.right: parent.right
                        height: parent.height / 2

                        Text {
                            anchors.centerIn: parent
                            text: "▾"
                            font.pixelSize: 8
                            color: hoursDownMouse.containsMouse ? ThemeTokens.text : ThemeTokens.subduedText
                        }
                        MouseArea {
                            id: hoursDownMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            enabled: !root.disabled
                            cursorShape: Qt.PointingHandCursor
                            onPressed: root.startRepeat(function() { root.stepHours(-1); })
                            onReleased: root.stopRepeat()
                            onCanceled: root.stopRepeat()
                        }
                    }
                }
            }

            // Colon separator
            Text {
                anchors.verticalCenter: parent.verticalCenter
                text: ":"
                font.pixelSize: root.fontSize
                font.weight: Font.Bold
                color: ThemeTokens.subduedText
            }

            // Minutes Segment Box
            Rectangle {
                id: minutesBox
                width: root.segmentBoxWidth
                height: root.boxHeight
                radius: root.customRadius
                color: "transparent"
                border.color: minutesInput.activeFocus ? ThemeTokens.accent : ThemeTokens.border
                border.width: 1
                opacity: root.disabled ? 0.5 : 1.0

                TextInput {
                    id: minutesInput
                    anchors.left: parent.left
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    width: root.inputWidth
                    horizontalAlignment: TextInput.AlignHCenter
                    verticalAlignment: TextInput.AlignVCenter
                    color: ThemeTokens.text
                    font.pixelSize: root.fontSize
                    font.family: "monospace"
                    enabled: !root.disabled
                    selectByMouse: true
                    inputMethodHints: Qt.ImhDigitsOnly
                    validator: RegularExpressionValidator { regularExpression: /^[0-9]{1,2}$/ }

                    onTextEdited: {
                        root.isEditing = true;
                        root.syncValueFromInputs();
                    }
                    onEditingFinished: {
                        root.isEditing = false;
                        var val = Math.min(Math.max(parseInt(text, 10) || 0, 0), 59);
                        text = String(val).padStart(2, "0");
                        root.syncValueFromInputs();
                    }
                    Keys.onUpPressed: function(e) { e.accepted = true; root.stepMinutes(1); }
                    Keys.onDownPressed: function(e) { e.accepted = true; root.stepMinutes(-1); }
                    Keys.onLeftPressed: function(e) { e.accepted = true; hoursInput.forceActiveFocus(); }
                    Keys.onRightPressed: function(e) { e.accepted = true; secondsInput.forceActiveFocus(); }
                }

                // Steppers column
                Rectangle {
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    width: root.stepperWidth
                    color: "transparent"

                    Rectangle {
                        anchors.left: parent.left
                        anchors.top: parent.top
                        anchors.bottom: parent.bottom
                        width: 1
                        color: ThemeTokens.border
                    }

                    Item {
                        id: minUpBtn
                        anchors.top: parent.top
                        anchors.left: parent.left
                        anchors.right: parent.right
                        height: parent.height / 2

                        Text {
                            anchors.centerIn: parent
                            text: "▴"
                            font.pixelSize: 8
                            color: minUpMouse.containsMouse ? ThemeTokens.text : ThemeTokens.subduedText
                        }
                        MouseArea {
                            id: minUpMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            enabled: !root.disabled
                            cursorShape: Qt.PointingHandCursor
                            onPressed: root.startRepeat(function() { root.stepMinutes(1); })
                            onReleased: root.stopRepeat()
                            onCanceled: root.stopRepeat()
                        }
                    }

                    Rectangle {
                        anchors.top: minUpBtn.bottom
                        anchors.left: parent.left
                        anchors.right: parent.right
                        height: 1
                        color: ThemeTokens.border
                    }

                    Item {
                        anchors.bottom: parent.bottom
                        anchors.left: parent.left
                        anchors.right: parent.right
                        height: parent.height / 2

                        Text {
                            anchors.centerIn: parent
                            text: "▾"
                            font.pixelSize: 8
                            color: minDownMouse.containsMouse ? ThemeTokens.text : ThemeTokens.subduedText
                        }
                        MouseArea {
                            id: minDownMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            enabled: !root.disabled
                            cursorShape: Qt.PointingHandCursor
                            onPressed: root.startRepeat(function() { root.stepMinutes(-1); })
                            onReleased: root.stopRepeat()
                            onCanceled: root.stopRepeat()
                        }
                    }
                }
            }

            // Colon separator
            Text {
                anchors.verticalCenter: parent.verticalCenter
                text: ":"
                font.pixelSize: root.fontSize
                font.weight: Font.Bold
                color: ThemeTokens.subduedText
            }

            // Seconds Segment Box
            Rectangle {
                id: secondsBox
                width: root.segmentBoxWidth
                height: root.boxHeight
                radius: root.customRadius
                color: "transparent"
                border.color: secondsInput.activeFocus ? ThemeTokens.accent : ThemeTokens.border
                border.width: 1
                opacity: root.disabled ? 0.5 : 1.0

                TextInput {
                    id: secondsInput
                    anchors.left: parent.left
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    width: root.inputWidth
                    horizontalAlignment: TextInput.AlignHCenter
                    verticalAlignment: TextInput.AlignVCenter
                    color: ThemeTokens.text
                    font.pixelSize: root.fontSize
                    font.family: "monospace"
                    enabled: !root.disabled
                    selectByMouse: true
                    inputMethodHints: Qt.ImhDigitsOnly
                    validator: RegularExpressionValidator { regularExpression: /^[0-9]{1,2}$/ }

                    onTextEdited: {
                        root.isEditing = true;
                        root.syncValueFromInputs();
                    }
                    onEditingFinished: {
                        root.isEditing = false;
                        var val = Math.min(Math.max(parseInt(text, 10) || 0, 0), 59);
                        text = String(val).padStart(2, "0");
                        root.syncValueFromInputs();
                    }
                    Keys.onUpPressed: function(e) { e.accepted = true; root.stepSeconds(1); }
                    Keys.onDownPressed: function(e) { e.accepted = true; root.stepSeconds(-1); }
                    Keys.onLeftPressed: function(e) { e.accepted = true; minutesInput.forceActiveFocus(); }
                }

                // Steppers column
                Rectangle {
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    width: root.stepperWidth
                    color: "transparent"

                    Rectangle {
                        anchors.left: parent.left
                        anchors.top: parent.top
                        anchors.bottom: parent.bottom
                        width: 1
                        color: ThemeTokens.border
                    }

                    Item {
                        id: secUpBtn
                        anchors.top: parent.top
                        anchors.left: parent.left
                        anchors.right: parent.right
                        height: parent.height / 2

                        Text {
                            anchors.centerIn: parent
                            text: "▴"
                            font.pixelSize: 8
                            color: secUpMouse.containsMouse ? ThemeTokens.text : ThemeTokens.subduedText
                        }
                        MouseArea {
                            id: secUpMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            enabled: !root.disabled
                            cursorShape: Qt.PointingHandCursor
                            onPressed: root.startRepeat(function() { root.stepSeconds(1); })
                            onReleased: root.stopRepeat()
                            onCanceled: root.stopRepeat()
                        }
                    }

                    Rectangle {
                        anchors.top: secUpBtn.bottom
                        anchors.left: parent.left
                        anchors.right: parent.right
                        height: 1
                        color: ThemeTokens.border
                    }

                    Item {
                        anchors.bottom: parent.bottom
                        anchors.left: parent.left
                        anchors.right: parent.right
                        height: parent.height / 2

                        Text {
                            anchors.centerIn: parent
                            text: "▾"
                            font.pixelSize: 8
                            color: secDownMouse.containsMouse ? ThemeTokens.text : ThemeTokens.subduedText
                        }
                        MouseArea {
                            id: secDownMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            enabled: !root.disabled
                            cursorShape: Qt.PointingHandCursor
                            onPressed: root.startRepeat(function() { root.stepSeconds(-1); })
                            onReleased: root.stopRepeat()
                            onCanceled: root.stopRepeat()
                        }
                    }
                }
            }

            // Presets Dropdown Button
            Rectangle {
                id: presetBtn
                visible: root.showPresets
                height: root.boxHeight
                width: presetBtnRow.implicitWidth + 16
                radius: root.customRadius
                color: presetMouse.containsMouse ? ThemeTokens.hover : "transparent"
                border.color: ThemeTokens.border
                border.width: 1
                opacity: root.disabled ? 0.5 : 1.0

                Row {
                    id: presetBtnRow
                    anchors.centerIn: parent
                    spacing: 4

                    Text {
                        text: "⏱ " + root.presetsLabel + " ▾"
                        color: ThemeTokens.text
                        font.pixelSize: root.fontSize
                    }
                }

                MouseArea {
                    id: presetMouse
                    anchors.fill: parent
                    hoverEnabled: true
                    enabled: !root.disabled
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        if (presetPopup.visible) {
                            presetPopup.close();
                        } else {
                            presetPopup.open();
                        }
                    }
                }
            }
        }

        // Bottom Labels Row
        Row {
            id: labelsRow
            visible: root.showLabels
            spacing: 6

            Text {
                width: root.segmentBoxWidth
                horizontalAlignment: Text.AlignHCenter
                text: root.hoursLabel
                font.pixelSize: root.labelFontSize
                color: ThemeTokens.subduedText
            }

            Item { width: 4; height: 1 } // colon space placeholder

            Text {
                width: root.segmentBoxWidth
                horizontalAlignment: Text.AlignHCenter
                text: root.minutesLabel
                font.pixelSize: root.labelFontSize
                color: ThemeTokens.subduedText
            }

            Item { width: 4; height: 1 } // colon space placeholder

            Text {
                width: root.segmentBoxWidth
                horizontalAlignment: Text.AlignHCenter
                text: root.secondsLabel
                font.pixelSize: root.labelFontSize
                color: ThemeTokens.subduedText
            }
        }
    }

    // Presets Popup
    Popup {
        id: presetPopup
        y: controlsRow.height + 4
        x: controlsRow.width - width
        width: 130
        padding: 4
        modal: false
        focus: false
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

        background: Rectangle {
            color: ThemeTokens.panel
            border.color: ThemeTokens.border
            border.width: 1
            radius: root.customRadius
        }

        contentItem: Column {
            spacing: 4
            width: parent.width

            Repeater {
                model: root.presets
                delegate: Column {
                    required property var modelData
                    required property int index
                    width: parent ? parent.width : 120
                    spacing: 2

                    Rectangle {
                        visible: index > 0
                        width: parent ? parent.width : 120
                        height: 1
                        color: ThemeTokens.border
                    }

                    Text {
                        text: modelData.label
                        color: ThemeTokens.subduedText
                        font.pixelSize: 10
                        font.weight: Font.DemiBold
                        leftPadding: 4
                        topPadding: 2
                    }

                    Repeater {
                        model: modelData.items
                        delegate: Rectangle {
                            required property var modelData
                            required property int index
                            width: parent ? parent.width : 120
                            height: 24

                            radius: 4
                            color: itemMouse.containsMouse ? ThemeTokens.hover : "transparent"

                            Text {
                                anchors.left: parent.left
                                anchors.leftMargin: 8
                                anchors.verticalCenter: parent.verticalCenter
                                text: modelData.label
                                color: ThemeTokens.text
                                font.pixelSize: 11
                            }

                            MouseArea {
                                id: itemMouse
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: {
                                    root.value = modelData.seconds;
                                    presetPopup.close();
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
