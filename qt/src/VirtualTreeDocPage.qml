// VirtualTreeDocPage.qml — Living Documentation for ChaSetVirtualTree
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Virtual Tree"
    description: ChaSetI18n.tr("components.virtual-tree.description", "Virtualized hierarchical tree view with node expansion, selection, and keyboard navigation.")

    property string selectionMode: "multiple"
    property var selectedIds: ["Button.tsx"]
    property var cutIds: []
    property var copiedIds: []
    property string statusMessage: ChaSetI18n.tr("desktopComposite.virtualTree.readyStatus", "Ready. Try selecting files or dragging to reorder (hold Ctrl to copy).")

    readonly property var initialNodes: [
        {
            id: "src", label: "src", children: [
                {
                    id: "components", label: "components", children: [
                        { id: "Button.tsx", label: "Button.tsx" },
                        { id: "Input.tsx", label: "Input.tsx" },
                        { id: "Dialog.tsx", label: "Dialog.tsx" }
                    ]
                },
                {
                    id: "virtual", label: "virtual", children: [
                        { id: "VirtualList.tsx", label: "VirtualList.tsx" },
                        { id: "VirtualTree.tsx", label: "VirtualTree.tsx" },
                        { id: "VirtualGrid.tsx", label: "VirtualGrid.tsx" }
                    ]
                },
                { id: "index.ts", label: "index.ts" }
            ]
        },
        {
            id: "spec", label: "spec", children: [
                { id: "capabilities.json", label: "capabilities.json" },
                { id: "components.ts", label: "components.ts" }
            ]
        },
        { id: "package.json", label: "package.json" },
        { id: "README.md", label: "README.md" }
    ]

    property var treeNodes: JSON.parse(JSON.stringify(initialNodes))

    function copyNodesInTree(tree, sourceKeys, targetKey, position) {
        let cloned = []
        function cloneSubtree(n) {
            let newId = n.id + "-copy-" + Math.floor(Math.random() * 10000)
            let copy = {
                id: newId,
                label: n.label + " (copy)"
            }
            if (n.children) {
                copy.children = []
                for (let c = 0; c < n.children.length; c++) {
                    copy.children.push(cloneSubtree(n.children[c]))
                }
            }
            return copy
        }
        function findAndClone(list) {
            for (let i = 0; i < list.length; i++) {
                let n = list[i]
                if (sourceKeys.indexOf(n.id) !== -1) {
                    cloned.push(cloneSubtree(n))
                }
                if (n.children) findAndClone(n.children)
            }
        }
        findAndClone(tree)
        if (cloned.length === 0) return tree

        function insertTarget(list) {
            let res = []
            for (let i = 0; i < list.length; i++) {
                let n = list[i]
                if (n.id === targetKey) {
                    if (position === "before") {
                        for (let j = 0; j < cloned.length; j++) res.push(cloned[j])
                        res.push(n)
                    } else if (position === "after") {
                        res.push(n)
                        for (let j = 0; j < cloned.length; j++) res.push(cloned[j])
                    } else {
                        let copy = Object.assign({}, n)
                        copy.children = copy.children ? copy.children.concat(cloned) : cloned.slice()
                        res.push(copy)
                    }
                } else {
                    let copy = Object.assign({}, n)
                    if (copy.children) {
                        copy.children = insertTarget(copy.children)
                    }
                    res.push(copy)
                }
            }
            return res
        }
        return insertTarget(tree)
    }

    function moveNodesInTree(tree, sourceKeys, targetKey, position) {
        let extracted = []
        function removeSource(list) {
            let res = []
            for (let i = 0; i < list.length; i++) {
                let n = list[i]
                if (sourceKeys.indexOf(n.id) !== -1) {
                    extracted.push(n)
                } else {
                    let copy = Object.assign({}, n)
                    if (copy.children) {
                        copy.children = removeSource(copy.children)
                    }
                    res.push(copy)
                }
            }
            return res
        }
        let cleaned = removeSource(tree)
        if (extracted.length === 0) return tree

        function insertTarget(list) {
            let res = []
            for (let i = 0; i < list.length; i++) {
                let n = list[i]
                if (n.id === targetKey) {
                    if (position === "before") {
                        for (let j = 0; j < extracted.length; j++) res.push(extracted[j])
                        res.push(n)
                    } else if (position === "after") {
                        res.push(n)
                        for (let j = 0; j < extracted.length; j++) res.push(extracted[j])
                    } else {
                        let copy = Object.assign({}, n)
                        copy.children = copy.children ? copy.children.concat(extracted) : extracted.slice()
                        res.push(copy)
                    }
                } else {
                    let copy = Object.assign({}, n)
                    if (copy.children) {
                        copy.children = insertTarget(copy.children)
                    }
                    res.push(copy)
                }
            }
            return res
        }
        return insertTarget(cleaned)
    }

    function removeNodesInTree(tree, targetKeys) {
        let res = []
        for (let i = 0; i < tree.length; i++) {
            let n = tree[i]
            if (targetKeys.indexOf(n.id) === -1) {
                let copy = Object.assign({}, n)
                if (copy.children) {
                    copy.children = removeNodesInTree(copy.children, targetKeys)
                }
                res.push(copy)
            }
        }
        return res
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.virtualTree.sandboxTitle", "Virtual Tree Sandbox")
        stageHeight: 420
        reactCode: `<VirtualTree
  ref={treeRef}
  rootNodes={treeData}
  selectionMode="multiple"
  selectedIds={selectedIds}
  onSelectionChange={(ids) => setSelectedIds(ids)}
  dimmedIds={cutIds}
  copiedIds={copiedIds}
  enableDnd
  onDropNode={(evt) => handleDrop(evt)}
  onCut={(nodes, ids) => handleCut(nodes, ids)}
  onCopy={(nodes, ids) => handleCopy(nodes, ids)}
  onPaste={(target, pos) => handlePaste(target, pos)}
  onDelete={(nodes, ids) => handleDelete(nodes, ids)}
  onEscape={() => handleEscape()}
  defaultExpandDepth={2}
  className="h-72 border border-border rounded-md bg-card overflow-auto p-2"
/>`
        qtCode: `ChaSetVirtualTree {
    nodes: treeData
    selectionMode: "multiple"
    selectedIds: selectedIds
    dimmedIds: cutIds
    copiedIds: copiedIds
    enableDnd: true
    onNodeDropped: function(src, target, pos, isCopy) { ... }
    onNodeCut: function(ids) { cutIds = ids }
    onNodeCopied: function(ids) { copiedIds = ids }
    onNodeDeleted: function(ids) { ... }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(10)
                width: ThemeTokens.dp(380)

                // Action Toolbar
                Flow {
                    width: parent.width
                    spacing: ThemeTokens.dp(6)

                    ChaSetButton {
                        text: ChaSetI18n.tr("desktopComposite.virtualTree.expandAll", "Expand All")
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualTree.expandAll()
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("desktopComposite.virtualTree.collapseAll", "Collapse All")
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualTree.collapseAll()
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("desktopComposite.virtualTree.mode", "Mode: {{mode}}", { mode: (root.selectionMode === "multiple" ? ChaSetI18n.tr("desktopComposite.virtualTree.multi", "Multi") : ChaSetI18n.tr("desktopComposite.virtualTree.single", "Single")) })
                        variant: "outline"
                        size: "sm"
                        onClicked: {
                            root.selectionMode = root.selectionMode === "multiple" ? "single" : "multiple"
                        }
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("desktopComposite.virtualTree.copyBtn", "Copy (Ctrl+C)")
                        variant: "outline"
                        size: "sm"
                        enabled: virtualTree.selectedIds.length > 0 || virtualTree.selectedId !== ""
                        onClicked: {
                            var ids = virtualTree.selectedIds.length > 0 ? virtualTree.selectedIds : [virtualTree.selectedId]
                            root.copiedIds = ids
                            root.cutIds = []
                            root.statusMessage = ChaSetI18n.tr("desktopComposite.virtualTree.copyStatus", "Copied {{count}} item(s) (pulsing). Select a target and press Ctrl+V to paste or Esc to cancel.", { count: ids.length })
                        }
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("desktopComposite.virtualTree.cutBtn", "Cut (Ctrl+X)")
                        variant: "outline"
                        size: "sm"
                        enabled: virtualTree.selectedIds.length > 0 || virtualTree.selectedId !== ""
                        onClicked: {
                            var ids = virtualTree.selectedIds.length > 0 ? virtualTree.selectedIds : [virtualTree.selectedId]
                            root.cutIds = ids
                            root.copiedIds = []
                            root.statusMessage = ChaSetI18n.tr("desktopComposite.virtualTree.cutStatus", "Cut {{count}} item(s) (dimmed). Select a target and press Ctrl+V to paste or Esc to cancel.", { count: ids.length })
                        }
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("desktopComposite.virtualTree.pasteBtn", "Paste (Ctrl+V)")
                        variant: "outline"
                        size: "sm"
                        enabled: root.cutIds.length > 0 || root.copiedIds.length > 0
                        onClicked: {
                            var targetId = virtualTree.selectedId !== "" ? virtualTree.selectedId : (virtualTree.selectedIds.length > 0 ? virtualTree.selectedIds[0] : "")
                            if (targetId !== "") {
                                if (root.cutIds.length > 0) {
                                    root.treeNodes = root.moveNodesInTree(root.treeNodes, root.cutIds, targetId, "inside")
                                    root.statusMessage = ChaSetI18n.tr("desktopComposite.virtualTree.pastedMoved", "Pasted (moved) {{count}} item(s) into/after \"{{target}}\".", { count: root.cutIds.length, target: targetId })
                                    root.cutIds = []
                                } else if (root.copiedIds.length > 0) {
                                    root.treeNodes = root.copyNodesInTree(root.treeNodes, root.copiedIds, targetId, "inside")
                                    root.statusMessage = ChaSetI18n.tr("desktopComposite.virtualTree.pastedCopied", "Pasted (copied) {{count}} item(s) into/after \"{{target}}\".", { count: root.copiedIds.length, target: targetId })
                                }
                            }
                        }
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("desktopComposite.virtualTree.deleteBtn", "Delete (Del)")
                        variant: "outline"
                        size: "sm"
                        enabled: virtualTree.selectedIds.length > 0 || virtualTree.selectedId !== ""
                        onClicked: {
                            var ids = virtualTree.selectedIds.length > 0 ? virtualTree.selectedIds : [virtualTree.selectedId]
                            if (ids.length > 0) {
                                root.treeNodes = root.removeNodesInTree(root.treeNodes, ids)
                                root.selectedIds = []
                                virtualTree.selectedIds = []
                                virtualTree.selectedId = ""
                                root.statusMessage = ChaSetI18n.tr("desktopComposite.virtualTree.deletedStatus", "Deleted {{count}} item(s).", { count: ids.length })
                            }
                        }
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("common.reset", "Reset")
                        variant: "outline"
                        size: "sm"
                        onClicked: {
                            root.treeNodes = JSON.parse(JSON.stringify(root.initialNodes))
                            root.cutIds = []
                            root.copiedIds = []
                            root.selectedIds = ["Button.tsx"]
                            root.statusMessage = ChaSetI18n.tr("desktopComposite.virtualTree.resetStatus", "Reset tree to default.")
                        }
                    }
                }

                ChaSetVirtualTree {
                    id: virtualTree
                    width: parent.width
                    height: ThemeTokens.dp(240)
                    selectionMode: root.selectionMode
                    selectedIds: root.selectedIds
                    dimmedIds: root.cutIds
                    copiedIds: root.copiedIds
                    enableDnd: true
                    expandedIds: ({ "src": true, "components": true })
                    nodes: root.treeNodes

                    onNodeSelected: function(nodeId) {
                        root.selectedIds = virtualTree.selectedIds
                    }

                    onNodeCopied: function(ids) {
                        root.copiedIds = ids
                        root.cutIds = []
                        root.statusMessage = ChaSetI18n.tr("desktopComposite.virtualTree.copyStatus", "Copied {{count}} item(s) (pulsing). Select target and paste or Esc to cancel.", { count: ids.length })
                    }

                    onNodeCut: function(ids) {
                        root.cutIds = ids
                        root.copiedIds = []
                        root.statusMessage = ChaSetI18n.tr("desktopComposite.virtualTree.cutStatus", "Cut {{count}} item(s) (dimmed). Select target folder and paste or Esc to cancel.", { count: ids.length })
                    }

                    onNodePasted: function(targetId, pos) {
                        if (targetId !== "") {
                            if (root.cutIds.length > 0) {
                                root.treeNodes = root.moveNodesInTree(root.treeNodes, root.cutIds, targetId, pos)
                                root.statusMessage = ChaSetI18n.tr("desktopComposite.virtualTree.pastedMoved", "Pasted (moved) {{count}} item(s) into/after \"{{target}}\".", { count: root.cutIds.length, target: targetId })
                                root.cutIds = []
                            } else if (root.copiedIds.length > 0) {
                                root.treeNodes = root.copyNodesInTree(root.treeNodes, root.copiedIds, targetId, pos)
                                root.statusMessage = ChaSetI18n.tr("desktopComposite.virtualTree.pastedCopied", "Pasted (copied) {{count}} item(s) into/after \"{{target}}\".", { count: root.copiedIds.length, target: targetId })
                            }
                        }
                    }

                    onNodeDeleted: function(ids) {
                        if (ids.length > 0) {
                            root.treeNodes = root.removeNodesInTree(root.treeNodes, ids)
                            root.selectedIds = []
                            virtualTree.selectedIds = []
                            virtualTree.selectedId = ""
                            root.statusMessage = ChaSetI18n.tr("desktopComposite.virtualTree.deletedStatus", "Deleted {{count}} item(s).", { count: ids.length })
                        }
                    }

                    onNodeDropped: function(sourceIds, targetId, pos, isCopy) {
                        if (isCopy) {
                            root.treeNodes = root.copyNodesInTree(root.treeNodes, sourceIds, targetId, pos)
                            root.statusMessage = ChaSetI18n.tr("desktopComposite.virtualTree.droppedCopied", "Copied {{source}} -> {{pos}} \"{{target}}\".", { source: sourceIds.join(", "), pos: pos, target: targetId })
                        } else {
                            root.treeNodes = root.moveNodesInTree(root.treeNodes, sourceIds, targetId, pos)
                            root.statusMessage = ChaSetI18n.tr("desktopComposite.virtualTree.droppedMoved", "Moved {{source}} -> {{pos}} \"{{target}}\".", { source: sourceIds.join(", "), pos: pos, target: targetId })
                        }
                    }
                }

                // Telemetry / Status Box
                Rectangle {
                    width: parent.width
                    height: ThemeTokens.dp(52)
                    color: ThemeTokens.panel
                    border.color: ThemeTokens.border
                    border.width: 1
                    radius: ThemeTokens.dp(4)

                    Column {
                        anchors.fill: parent
                        anchors.margins: ThemeTokens.dp(6)
                        spacing: ThemeTokens.dp(2)

                        Row {
                            spacing: ThemeTokens.dp(8)
                            Text {
                                text: ChaSetI18n.tr("desktopComposite.virtualTree.selectedLabel", "Selected:") + " " + (virtualTree.selectedIds.length > 0 ? virtualTree.selectedIds.join(", ") : (virtualTree.selectedId || ChaSetI18n.tr("desktopComposite.virtualTree.none", "None")))
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeCaption
                                font.family: Typography.familyMono
                            }
                            Text {
                                visible: root.cutIds.length > 0
                                text: ChaSetI18n.tr("desktopComposite.virtualTree.cutBadge", "[{{count}} cut/dimmed]", { count: root.cutIds.length })
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeCaption
                            }
                            Text {
                                visible: root.copiedIds.length > 0
                                text: ChaSetI18n.tr("desktopComposite.virtualTree.copiedBadge", "[{{count}} copied (pulsing)]", { count: root.copiedIds.length })
                                color: ThemeTokens.focus
                                font.pixelSize: Typography.sizeCaption
                            }
                        }

                        Text {
                            text: root.statusMessage
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeCaption
                            elide: Text.ElideRight
                            width: parent.width
                        }
                    }
                }
            }
        }
    }

        DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetVirtualTree {
    width: parent.width
    height: 400
    model: treeModel
}`
        reactCode: `import { VirtualTree } from '@chahu/cha-set';

<VirtualTree data={treeNodes} onNodeSelect={(node) => console.log(node)} />`
    }

    ComponentReference {
        name: "VirtualTree"
        componentId: "virtual-tree"
        propsModel: [
            { name: "nodes", type: "var[]", default: "[]", description: ChaSetI18n.tr("components.virtualTree.rootNodesDesc", "Array of top-level hierarchy nodes.") },
            { name: "selectionMode", type: "string", default: "'single'", description: ChaSetI18n.tr("components.virtualTree.selectionModeDesc", "Active selection interaction mode.") },
            { name: "selectedId", type: "string", default: "''", description: ChaSetI18n.tr("components.virtualTree.selectedIdDesc", "Identifier of the currently selected node (single mode).") },
            { name: "selectedIds", type: "var[]", default: "[]", description: ChaSetI18n.tr("components.virtualTree.selectedIdsDesc", "Array of selected node identifiers (multiple mode).") },
            { name: "dimmedIds", type: "var[]", default: "[]", description: ChaSetI18n.tr("components.virtualTree.dimmedDesc", "Array of node IDs rendered in dimmed/cut state.") },
            { name: "stickyItems", type: "var[]", default: "[]", description: ChaSetI18n.tr("components.virtualTree.stickyDesc", "Expanded ancestor chain of the open node, pinned above the scroll area so parents stay visible.") },
            { name: "stickyNodeSelected(nodeId)", type: "signal", default: "signal", description: ChaSetI18n.tr("components.virtualTree.onStickySelectDesc", "Callback fired when a pinned row is clicked (navigate only, never toggles expansion).") },
            { name: "stickyNodeToggled(nodeId)", type: "signal", default: "signal", description: ChaSetI18n.tr("components.virtualTree.onStickyToggleDesc", "Callback fired when the chevron of a pinned row is activated.") },
            { name: "enableDnd", type: "bool", default: "false", description: ChaSetI18n.tr("components.virtualTree.enableDndDesc", "Enables drag-and-drop reordering and folder nesting.") },
            { name: "expandedIds", type: "var", default: "{}", description: ChaSetI18n.tr("components.virtualTree.expandedMapDesc", "Map of expanded node IDs.") },
            { name: "defaultExpandDepth", type: "int", default: "0", description: ChaSetI18n.tr("components.virtualTree.defaultExpandDesc", "Default level of expansion for child branches.") },
            { name: "estimateSize", type: "int", default: "28", description: ChaSetI18n.tr("components.virtualTree.estimateDesc", "Estimated row height for virtual calculation.") },
            { name: "gap", type: "int", default: "0", description: ChaSetI18n.tr("components.virtualTree.gapDesc", "Spacing between adjacent rows.") },
            { name: "overscan", type: "int", default: "10", description: ChaSetI18n.tr("components.virtualTree.overscanDesc", "Buffer nodes rendered outside visible bounds.") },
            { name: "customRadius", type: "int", default: "6", description: ChaSetI18n.tr("components.virtualTree.cornerRadiusDesc", "Corner radius of the tree container.") },
            { name: "expandAll()", type: "function", default: "function", description: ChaSetI18n.tr("components.virtualTree.expandAllDesc", "Expands all collapsible tree branches.") },
            { name: "collapseAll()", type: "function", default: "function", description: ChaSetI18n.tr("components.virtualTree.collapseAllDesc", "Collapses all open tree branches.") },
            { name: "selectAll()", type: "function", default: "function", description: ChaSetI18n.tr("components.virtualTree.selectAllDesc", "Selects all visible nodes in multiple mode.") },
            { name: "scrollToIndex(index)", type: "function", default: "function", description: ChaSetI18n.tr("components.virtualTree.scrollToDesc", "Scrolls the virtual tree to the specified index.") }
        ]
    }
}
