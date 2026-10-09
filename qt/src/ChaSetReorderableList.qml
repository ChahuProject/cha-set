// ChaSetReorderableList.qml — Cross-Stack Reorderable Action List Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root
    objectName: "chaSetReorderableList"

    /// 数据项清单：每个元素为 Object，例如：
    /// [ { id: "name", label: "文件名", icon: "label", visible: true }, ... ]
    property var items: []

    /// 每行逻辑高度（dp）
    property int rowHeight: 30

    /// 是否允许拖拽重排
    property bool reorderable: true

    /// 操作列配置清单，默认如果为空，则根据 defaultActionKey 自动生成一列显隐开关：
    /// [
    ///   {
    ///     key: "visible",                 // 绑定的布尔属性
    ///     activeIcon: "visibility",       // 激活态图标
    ///     inactiveIcon: "visibility_off", // 停用态图标
    ///     tooltip: ChaSetI18n.tr("desktopComposite.reorderableList.toggleTooltip", "显示/隐藏"),     // 基础 tooltip 文本
    ///     shortcut: "Alt+Click",           // 快捷键提示
    ///     activeColor: ThemeTokens.accent,// 激活态颜色
    ///     inactiveColor: ThemeTokens.subduedText // 停用态颜色
    ///   }
    /// ]
    property var actionColumns: []

    /// 当 actionColumns 为空时默认绑定的属性键，默认 "visible"
    property string defaultActionKey: "visible"

    /// 统一事件通知：
    /// itemsEdited(var newItems)：无论是排序变动还是操作按钮点击（含 Alt 独占/反转），均回抛完整的新 items 清单
    signal itemsEdited(var newItems)
    /// 单项操作触发：(int index, string key, bool newValue)
    signal actionTriggered(int index, string key, bool newValue)
    /// 排序完成触发：(int from, int to, var newItems)
    signal itemsReordered(int from, int to, var newItems)

    readonly property var effectiveActionColumns: {
        if (root.actionColumns && root.actionColumns.length > 0)
            return root.actionColumns
        return [
            {
                key: root.defaultActionKey,
                activeIcon: "visibility",
                inactiveIcon: "visibility_off",
                tooltip: ChaSetI18n.tr("desktopComposite.reorderableList.toggleTooltip", "显示/隐藏"),
                shortcut: "Alt+Click"
            }
        ]
    }

    readonly property var listItems: root.items ? root.items : []
    readonly property int effectiveRowHeight: ThemeTokens.dp(root.rowHeight)

    implicitWidth: ThemeTokens.dp(280)
    implicitHeight: fieldRows.height

    /// 正在拖拽的行下标；-1 表示空闲
    property int dragIndex: -1
    /// 拖拽起点行位移（px）
    property real dragDeltaY: 0
    /// 落点下标（拖拽中才有效）
    readonly property int dropIndex: root.dragIndex < 0 ? -1
        : Math.max(0, Math.min(root.listItems.length - 1,
                               root.dragIndex + Math.round(root.dragDeltaY / root.effectiveRowHeight)))

    function moveItem(from, to) {
        if (from < 0 || to < 0 || from === to) return
        var list = root.listItems.slice(0)
        if (from >= list.length || to >= list.length) return
        var moved = list.splice(from, 1)[0]
        list.splice(to, 0, moved)
        root.itemsReordered(from, to, list)
        root.itemsEdited(list)
    }

    function setItemAction(index, key, value) {
        var list = root.listItems
        if (index < 0 || index >= list.length) return
        var next = []
        next.length = list.length
        for (var i = 0; i < list.length; ++i) {
            var copy = Object.assign({}, list[i])
            if (i === index) {
                copy[key] = value
            }
            next[i] = copy
        }
        root.actionTriggered(index, key, value)
        root.itemsEdited(next)
    }

    function handleActionClick(targetIndex, colKey, mouseModifiers) {
        var list = root.listItems
        if (targetIndex < 0 || targetIndex >= list.length) return

        var isAlt = Boolean(mouseModifiers & Qt.AltModifier)
        var next = []
        next.length = list.length

        if (isAlt) {
            // Alt+点击：Solo 独占与反转切换
            // 判定当前是否已处于「仅该项生效」的独占态：
            var onlyThisActive = true
            for (var i = 0; i < list.length; ++i) {
                var item = list[i]
                var val = item ? Boolean(item[colKey]) : false
                if (i === targetIndex) {
                    if (!val) onlyThisActive = false
                } else {
                    if (val) onlyThisActive = false
                }
            }

            if (onlyThisActive) {
                // 已经是独占态：再次 Alt 点击 -> 其他的全部生效，被点击的这一个关闭！
                for (var j = 0; j < list.length; ++j) {
                    var copy = Object.assign({}, list[j])
                    copy[colKey] = (j !== targetIndex)
                    next[j] = copy
                }
                root.actionTriggered(targetIndex, colKey, false)
            } else {
                // 尚未独占：只让被点击的这一个生效，其他的全部关闭！
                for (var k = 0; k < list.length; ++k) {
                    var copy2 = Object.assign({}, list[k])
                    copy2[colKey] = (k === targetIndex)
                    next[k] = copy2
                }
                root.actionTriggered(targetIndex, colKey, true)
            }
        } else {
            // 普通点击：仅切换当前项这一列的状态
            var targetNewVal = false
            for (var m = 0; m < list.length; ++m) {
                var copy3 = Object.assign({}, list[m])
                if (m === targetIndex) {
                    copy3[colKey] = !Boolean(copy3[colKey])
                    targetNewVal = copy3[colKey]
                }
                next[m] = copy3
            }
            root.actionTriggered(targetIndex, colKey, targetNewVal)
        }

        root.itemsEdited(next)
    }

    Item {
        id: fieldRows
        width: parent.width
        height: root.listItems.length * root.effectiveRowHeight

        // 落点指示线
        Rectangle {
            visible: root.dragIndex >= 0
            z: 5
            x: 0
            width: fieldRows.width
            height: 2
            color: ThemeTokens.accent
            y: root.dropIndex * root.effectiveRowHeight - 1
        }

        Repeater {
            model: root.listItems

            delegate: Rectangle {
                id: itemRow
                required property var modelData
                required property int index
                width: fieldRows.width
                height: root.effectiveRowHeight - ThemeTokens.dp(2)
                radius: ThemeTokens.dp(4)
                z: itemRow.isDragging ? 3 : 0
                // 拖拽行实时位移跟手，其余行由指示线提示落点
                y: itemRow.index * root.effectiveRowHeight
                   + (itemRow.isDragging ? root.dragDeltaY : 0)
                color: itemRow.isDragging
                       ? ThemeTokens.panelRaised
                       : (rowHover.containsMouse ? ThemeTokens.panelRaised : "transparent")

                readonly property bool isDragging: root.dragIndex === index
                readonly property string itemLabel: (modelData && modelData.label !== undefined)
                                                     ? String(modelData.label)
                                                     : ((modelData && modelData.name !== undefined)
                                                        ? String(modelData.name)
                                                        : (modelData && modelData.id !== undefined ? String(modelData.id) : ""))
                readonly property string itemIcon: (modelData && modelData.icon) ? String(modelData.icon) : ""

                // 拖拽手柄区域
                MouseArea {
                    id: gripMouse
                    visible: root.reorderable
                    x: 0
                    width: ThemeTokens.dp(26)
                    height: parent.height
                    anchors.verticalCenter: parent.verticalCenter
                    hoverEnabled: true
                    preventStealing: true
                    cursorShape: dragActive ? Qt.ClosedHandCursor : Qt.OpenHandCursor

                    property bool dragActive: false
                    property real startSceneY: 0

                    function sceneY(mouse) {
                        return mapToItem(fieldRows, mouse.x, mouse.y).y
                    }

                    onPressed: (mouse) => {
                        dragActive = true
                        startSceneY = sceneY(mouse)
                        root.dragDeltaY = 0
                        root.dragIndex = itemRow.index
                    }
                    onPositionChanged: (mouse) => {
                        if (!dragActive || root.dragIndex !== itemRow.index) return
                        var count = root.listItems.length
                        var raw = sceneY(mouse) - startSceneY
                        var minDelta = -itemRow.index * root.effectiveRowHeight
                        var maxDelta = (count - 1 - itemRow.index) * root.effectiveRowHeight
                        root.dragDeltaY = Math.max(minDelta, Math.min(maxDelta, raw))
                    }
                    onReleased: {
                        if (!dragActive) return
                        var from = root.dragIndex
                        var to = root.dropIndex
                        dragActive = false
                        root.dragIndex = -1
                        root.dragDeltaY = 0
                        root.moveItem(from, to)
                    }
                    onCanceled: {
                        dragActive = false
                        root.dragIndex = -1
                        root.dragDeltaY = 0
                        root.dragDeltaY = 0
                    }
                }

                // 拖拽指示手柄图标
                ChaSetIcon {
                    visible: root.reorderable
                    anchors.left: parent.left
                    anchors.leftMargin: ThemeTokens.dp(6)
                    anchors.verticalCenter: parent.verticalCenter
                    name: "grip-horizontal"
                    size: 14
                    color: ThemeTokens.subduedText
                }

                // 项左侧图标（可选）
                ChaSetIcon {
                    id: leftIcon
                    visible: itemRow.itemIcon !== ""
                    anchors.left: parent.left
                    anchors.leftMargin: root.reorderable ? ThemeTokens.dp(26) : ThemeTokens.dp(8)
                    anchors.verticalCenter: parent.verticalCenter
                    name: itemRow.itemIcon
                    size: 14
                    color: ThemeTokens.subduedText
                }

                // 文本标签
                Text {
                    id: labelText
                    anchors.left: leftIcon.visible ? leftIcon.right : (root.reorderable ? parent.left : parent.left)
                    anchors.leftMargin: leftIcon.visible ? ThemeTokens.dp(8) : (root.reorderable ? ThemeTokens.dp(28) : ThemeTokens.dp(8))
                    anchors.right: actionRow.left
                    anchors.rightMargin: ThemeTokens.dp(8)
                    anchors.verticalCenter: parent.verticalCenter
                    elide: Text.ElideRight
                    text: itemRow.itemLabel
                    font.pixelSize: Typography.sizeSmall
                    color: {
                        // 若所有 action 均为 false，弱化显示
                        var anyActive = false
                        var cols = root.effectiveActionColumns
                        for (var c = 0; c < cols.length; ++c) {
                            if (itemRow.modelData && itemRow.modelData[cols[c].key]) {
                                anyActive = true
                                break
                            }
                        }
                        return anyActive ? ThemeTokens.text : ThemeTokens.subduedText
                    }
                }

                // 末尾操作按钮列（水平排列）
                Row {
                    id: actionRow
                    anchors.right: parent.right
                    anchors.rightMargin: ThemeTokens.dp(4)
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: ThemeTokens.dp(2)

                    Repeater {
                        model: root.effectiveActionColumns

                        delegate: Item {
                            id: actionBtn
                            required property var modelData
                            required property int index
                            objectName: (actionBtn.modelData && actionBtn.modelData.objectName)
                                        ? String(actionBtn.modelData.objectName) : "chaSetActionBtn"
                            width: ThemeTokens.dp(26)
                            height: ThemeTokens.dp(24)

                            readonly property var colDef: actionBtn.modelData
                            readonly property string colKey: colDef ? String(colDef.key) : root.defaultActionKey
                            readonly property bool isActive: Boolean(itemRow.modelData && itemRow.modelData[colKey])
                            readonly property string iconName: isActive
                                ? (colDef.activeIcon ? colDef.activeIcon : "visibility")
                                : (colDef.inactiveIcon ? colDef.inactiveIcon : "visibility_off")
                            readonly property color iconColor: isActive
                                ? (colDef.activeColor ? colDef.activeColor : ThemeTokens.accent)
                                : (colDef.inactiveColor ? colDef.inactiveColor : ThemeTokens.subduedText)
                            readonly property string tipText: colDef.tooltip ? colDef.tooltip : ChaSetI18n.tr("desktopComposite.reorderableList.toggleTooltip", "显示/隐藏")
                            readonly property string tipShortcut: colDef.shortcut ? colDef.shortcut : "Alt+Click"

                            ChaSetIcon {
                                anchors.centerIn: parent
                                name: actionBtn.iconName
                                size: 15
                                color: actionBtn.iconColor
                                opacity: actionBtn.isActive ? 1.0 : 0.55
                            }

                            ChaSetTooltip {
                                id: actionTooltip
                                text: actionBtn.tipText
                                shortcut: actionBtn.tipShortcut
                                delay: 300
                            }

                            MouseArea {
                                id: actionMouse
                                anchors.fill: parent
                                hoverEnabled: true
                                cursorShape: Qt.PointingHandCursor
                                onClicked: (mouse) => {
                                    root.handleActionClick(itemRow.index, actionBtn.colKey, (mouse && typeof mouse.modifiers !== "undefined") ? mouse.modifiers : 0)
                                }
                            }
                        }
                    }
                }

                // 整行悬停跟踪（不阻断手柄与按钮点击）
                MouseArea {
                    id: rowHover
                    anchors.fill: parent
                    z: -1
                    hoverEnabled: true
                    acceptedButtons: Qt.NoButton
                }
            }
        }
    }
}
