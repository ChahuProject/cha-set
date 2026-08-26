import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

// ChaSet Qt 展示画廊 —— 消费生成的 ThemeTokens 单例（spec/tokens.json，
// dunting preset）。顶栏开关实时切换明暗；全部颜色随单例属性联动。
ApplicationWindow {
    id: win
    width: 900
    height: 1040
    visible: true
    title: "ChaSet Qt 组件展示"
    color: ThemeTokens.background

    property string lastClick: "Ready."
    function push(msg) { lastClick = msg }

    Component.onCompleted: if (startupLight === true) ThemeTokens.dark = false

    // ---- 内联卡片组件 ----
    component Card: Rectangle {
        id: cardRoot
        property string title
        default property alias contentData: contentCol.data
        radius: ThemeTokens.radiusLarge
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        implicitWidth: contentCol.implicitWidth + 32
        implicitHeight: contentCol.implicitHeight + 52
        Column {
            id: contentCol
            x: 16
            y: 14
            spacing: 12
            Text {
                text: cardRoot.title
                color: ThemeTokens.text
                font.pixelSize: ThemeTokens.fontSizeHeading
                font.weight: Font.Medium
            }
        }
    }

    component SwatchItem: Column {
        property string tokenName
        property string label
        spacing: 4
        Rectangle {
            width: 150
            height: 40
            radius: ThemeTokens.rowRadius
            color: ThemeTokens.color(tokenName)
            border.color: ThemeTokens.border
        }
        Text {
            text: tokenName
            color: ThemeTokens.text
            font.pixelSize: ThemeTokens.fontSizeSmall
            font.family: "Consolas"
        }
        Text {
            text: label
            color: ThemeTokens.subduedText
            font.pixelSize: ThemeTokens.fontSizeSmall
        }
    }

    Column {
        anchors.fill: parent
        anchors.margins: 20
        spacing: 16

        // ---- 顶栏 ----
        Row {
            width: parent.width
            spacing: 12
            Text {
                text: "ChaSet Qt 组件展示"
                color: ThemeTokens.text
                font.pixelSize: ThemeTokens.fontSizeTitle
                font.weight: Font.Medium
            }
            Item { width: 1; height: 1 } // spacer
            Switch {
                text: "暗色"
                checked: ThemeTokens.dark
                onToggled: ThemeTokens.dark = checked
            }
        }

        // ---- 色板 ----
        Card {
            title: "色板 · dunting preset（实时联动暗色开关）"
            Grid {
                columns: 4
                columnSpacing: 14
                rowSpacing: 10
                Repeater {
                    model: [
                        ["background", "窗口背景"], ["panel", "面板"],
                        ["panelRaised", "浮起面板"], ["selection", "选中"],
                        ["hover", "悬停"], ["pressed", "按下"],
                        ["accent", "强调"], ["onAccent", "强调上文字"],
                        ["nestAccent", "嵌套强调"], ["pendingAccent", "待定"],
                        ["conflict", "冲突"], ["blocked", "受阻"],
                        ["danger", "危险"], ["dangerHover", "危险悬停"],
                        ["border", "边框"], ["text", "文字"],
                        ["subduedText", "次要文字"], ["overlayScrim", "遮罩"]
                    ]
                    delegate: SwatchItem {
                        required property var modelData
                        tokenName: modelData[0]
                        label: modelData[1]
                    }
                }
            }
        }

        // ---- 字体 / 圆角 ----
        Card {
            title: "字体 / 圆角"
            Row {
                spacing: 14
                Repeater {
                    model: [
                        ["rowRadius", 4], ["panelRadius", 6],
                        ["radiusLarge", 10], ["radiusXl", 14]
                    ]
                    delegate: Rectangle {
                        required property var modelData
                        width: 76
                        height: 56
                        radius: modelData[1]
                        color: "transparent"
                        border.color: ThemeTokens.accent
                        border.width: 1.5
                        Text {
                            anchors.centerIn: parent
                            text: parent.modelData[0]
                            color: ThemeTokens.subduedText
                            font.pixelSize: ThemeTokens.fontSizeSmall
                        }
                    }
                }
            }
            Column {
                spacing: 4
                Text {
                    text: "Medium — 茶具 ChaSet，跨栈组件库"
                    color: ThemeTokens.text
                    font.pixelSize: ThemeTokens.fontSizeHeading
                    font.weight: Font.Medium
                }
                Text {
                    text: "DemiBold — 茶具 ChaSet，跨栈组件库"
                    color: ThemeTokens.subduedText
                    font.pixelSize: ThemeTokens.fontSizeHeading
                    font.weight: Font.DemiBold
                }
            }
        }

        // ---- 按钮 ----
        Card {
            title: "Button · variant × size（cha-set 契约）"
            width: parent.width

            Grid {
                columns: 1
                rowSpacing: 10
                Repeater {
                    model: ["primary", "secondary", "ghost", "danger"]
                    delegate: Row {
                        required property string modelData
                        spacing: 10
                        Text {
                            text: modelData
                            color: ThemeTokens.subduedText
                            font.pixelSize: ThemeTokens.fontSizeSmall
                            font.family: "Consolas"
                            width: 80
                            anchors.verticalCenter: parent.verticalCenter
                        }
                        ChaSetButton { variant: parent.modelData; size: "sm"; text: "sm"; onClicked: win.push(modelData + "/sm") }
                        ChaSetButton { variant: parent.modelData; size: "md"; text: "md"; onClicked: win.push(modelData + "/md") }
                        ChaSetButton { variant: parent.modelData; size: "lg"; text: "lg"; onClicked: win.push(modelData + "/lg") }
                    }
                }
                Row {
                    spacing: 10
                    Text {
                        text: "states"
                        color: ThemeTokens.subduedText
                        font.pixelSize: ThemeTokens.fontSizeSmall
                        font.family: "Consolas"
                        width: 80
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetButton { variant: "danger"; text: "删除"; onClicked: win.push("danger clicked") }
                    ChaSetButton { text: "禁用"; disabled: true }
                    ChaSetButton { fullWidth: true; width: 320; text: "Full width"; onClicked: win.push("fullWidth clicked") }
                }
                Row {
                    spacing: 10
                    Text {
                        text: "async"
                        color: ThemeTokens.subduedText
                        font.pixelSize: ThemeTokens.fontSizeSmall
                        font.family: "Consolas"
                        width: 80
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetButton {
                        id: saveBtn
                        text: loading ? "保存中…" : "模拟保存"
                        onClicked: {
                            loading = true
                            resetTimer.restart()
                        }
                    }
                    Timer {
                        id: resetTimer
                        interval: 1200
                        onTriggered: saveBtn.loading = false
                    }
                }
                Text {
                    id: btnLog
                    text: win.lastClick
                    color: ThemeTokens.subduedText
                    font.pixelSize: ThemeTokens.fontSizeSmall
                    font.family: "Consolas"
                }
            }
        }
    }
}
