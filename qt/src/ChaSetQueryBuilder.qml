// ChaSetQueryBuilder.qml — Cross-Stack Query Builder Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root

    property string connector: "AND"
    property var fields: [
        { key: "role", label: "Role" },
        { key: "age", label: "Age" },
        { key: "status", label: "Status" }
    ]
    property var rules: [
        { id: "r1", field: "role", operator: "equals", value: "Architect" },
        { id: "r2", field: "age", operator: "greaterThan", value: "25" }
    ]
    property int customRadius: 8

    signal queryChanged()

    color: ThemeTokens.panel
    border.color: ThemeTokens.border
    border.width: 1
    radius: root.customRadius
    implicitWidth: 460
    implicitHeight: mainCol.implicitHeight + 24
    clip: true

    function toggleConnector() {
        root.connector = root.connector === "AND" ? "OR" : "AND"
        root.queryChanged()
    }

    function addCondition() {
        let copy = root.rules.slice()
        copy.push({
            id: "r" + (Date.now() % 10000),
            field: root.fields[0]?.key || "field",
            operator: "equals",
            value: ""
        })
        root.rules = copy
        root.queryChanged()
    }

    function deleteRule(idx) {
        let copy = root.rules.slice()
        copy.splice(idx, 1)
        root.rules = copy
        root.queryChanged()
    }

    Column {
        id: mainCol
        anchors.fill: parent
        anchors.margins: 12
        spacing: 10

        // Connector & Actions Bar
        Row {
            spacing: 8

            ChaSetButton {
                text: root.connector
                variant: "outline"
                size: "xs"
                onClicked: root.toggleConnector()
            }

            ChaSetButton {
                text: "+ Add condition"
                variant: "ghost"
                size: "xs"
                onClicked: root.addCondition()
            }
        }

        // Rules List
        Column {
            width: parent.width
            spacing: 6

            Repeater {
                model: root.rules
                delegate: Rectangle {
                    required property var modelData
                    required property int index
                    width: parent.width
                    height: 32
                    color: ThemeTokens.hover
                    border.color: ThemeTokens.border
                    border.width: 1
                    radius: 4

                    Row {
                        anchors.left: parent.left
                        anchors.leftMargin: 8
                        anchors.right: deleteBtn.left
                        anchors.rightMargin: 8
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: 8

                        // Field
                        ChaSetBadge {
                            anchors.verticalCenter: parent.verticalCenter
                            text: parent.parent.modelData.field
                            variant: "outline"
                            size: "sm"
                        }

                        // Operator
                        ChaSetBadge {
                            anchors.verticalCenter: parent.verticalCenter
                            text: parent.parent.modelData.operator
                            variant: "secondary"
                            size: "sm"
                        }

                        // Value
                        ChaSetInput {
                            anchors.verticalCenter: parent.verticalCenter
                            width: 140
                            height: 24
                            text: String(parent.parent.modelData.value ?? "")
                            onTextEdited: {
                                parent.parent.modelData.value = text
                                root.queryChanged()
                            }
                        }
                    }

                    // Delete
                    ChaSetButton {
                        id: deleteBtn
                        anchors.right: parent.right
                        anchors.rightMargin: 8
                        anchors.verticalCenter: parent.verticalCenter
                        text: "✕"
                        variant: "ghost"
                        size: "icon-xs"
                        onClicked: root.deleteRule(parent.index)
                    }
                }
            }
        }
    }
}
