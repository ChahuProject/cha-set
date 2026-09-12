// VirtualTreeDocPage.qml — Living Documentation for ChaSetVirtualTree
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Virtual Tree"
    description: "Hierarchical tree structure with reactive node expansion, indentation guides, and selection states."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    property string selectedPath: "None"

    ComponentPreview {
        title: "Virtual Tree Preview"
        reactCode: `<VirtualTree
  rootNodes={treeData}
  getChildren={(n) => n.children}
  getNodeKey={(n) => n.id}
  renderRow={({ node, depth, isExpanded, toggleExpand }) => (
    <div style={{ paddingLeft: depth * 16 }} onClick={toggleExpand}>
      {node.label}
    </div>
  )}
/>`
        qtCode: `ChaSetVirtualTree {
    nodes: [
        { id: "src", label: "src/", children: [
            { id: "components", label: "components/", children: [
                { id: "Button.tsx", label: "Button.tsx" },
                { id: "Tree.tsx", label: "Tree.tsx" }
            ]}
        ]}
    ]
    onNodeSelected: function(id) { console.log(id) }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 12

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: 8

                    ChaSetButton {
                        text: "Expand All"
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualTree.expandAll()
                    }

                    ChaSetButton {
                        text: "Collapse All"
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualTree.collapseAll()
                    }
                }

                ChaSetVirtualTree {
                    id: virtualTree
                    width: 320
                    height: 240
                    expandedIds: ({ "src": true, "components": true })
                    nodes: [
                        {
                            id: "src", label: "📁 src", children: [
                                {
                                    id: "components", label: "📁 components", children: [
                                        { id: "Button.tsx", label: "📄 Button.tsx" },
                                        { id: "Tree.tsx", label: "📄 Tree.tsx" },
                                        { id: "Table.tsx", label: "📄 Table.tsx" }
                                    ]
                                },
                                {
                                    id: "styles", label: "📁 styles", children: [
                                        { id: "theme.css", label: "🎨 theme.css" },
                                        { id: "tokens.css", label: "🎨 tokens.css" }
                                    ]
                                },
                                { id: "index.ts", label: "📄 index.ts" }
                            ]
                        },
                        {
                            id: "spec", label: "📁 spec", children: [
                                { id: "tokens.json", label: "📜 tokens.json" },
                                { id: "capabilities.json", label: "📜 capabilities.json" }
                            ]
                        },
                        { id: "package.json", label: "📦 package.json" },
                        { id: "README.md", label: "📝 README.md" }
                    ]
                    onNodeSelected: function(nodeId) {
                        root.selectedPath = nodeId
                    }
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Selected Node ID: " + root.selectedPath
                    color: ThemeTokens.text
                    font.pixelSize: 12
                    font.family: "monospace"
                }
            }
        }
    }

    ChaSetCodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetVirtualTree { nodes: [...] }"
        language: "qml"
    }

    KeyboardShortcutsTable {
        componentId: "virtual-tree"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "nodes", type: "var[]", default: "[]", description: "Hierarchical array of tree node objects with nested children arrays." },
            { name: "selectedId", type: "string", default: "''", description: "ID of the currently highlighted node." },
            { name: "expandedIds", type: "var", default: "{}", description: "Map of expanded node IDs." },
            { name: "defaultExpandDepth", type: "int", default: "0", description: "Default level of expansion for child branches." },
            { name: "estimateSize", type: "int", default: "28", description: "Estimated row height for virtual calculations." },
            { name: "gap", type: "int", default: "0", description: "Spacing between adjacent rows." },
            { name: "overscan", type: "int", default: "10", description: "Buffer nodes rendered outside visible bounds." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the tree container." },
            { name: "expandAll()", type: "function", default: "function", description: "Expands all collapsible tree branches." },
            { name: "collapseAll()", type: "function", default: "function", description: "Collapses all open tree branches." },
            { name: "scrollToIndex(index)", type: "function", default: "function", description: "Scrolls the virtual tree to the specified index." }
        ]
    }
}
