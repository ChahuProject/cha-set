// QueryBuilderDocPage.qml — Living Documentation for ChaSetQueryBuilder
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Query Builder"
    description: "Visual rule tree builder for structured query generation with AND/OR logic toggling, field and operator predicates, and dynamic condition management."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    ComponentPreview {
        title: "Query Builder Preview"
        reactCode: `<QueryBuilder
  fields={fields}
  query={query}
  onQueryChange={setQuery}
/>`
        qtCode: `ChaSetQueryBuilder {
    connector: "AND"
    fields: [
        { key: "role", label: "Role" },
        { key: "age", label: "Age" }
    ]
    rules: [
        { id: "r1", field: "role", operator: "equals", value: "Architect" }
    ]
    onQueryChanged: console.log("query changed")
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 12
                width: 440

                ChaSetQueryBuilder {
                    id: qb
                    width: parent.width
                    connector: "AND"
                    fields: [
                        { key: "role", label: "Role" },
                        { key: "age", label: "Age" },
                        { key: "status", label: "Status" }
                    ]
                    rules: [
                        { id: "r1", field: "role", operator: "equals", value: "Staff Engineer" },
                        { id: "r2", field: "age", operator: "greaterThan", value: "28" }
                    ]
                    onQueryChanged: {
                        serializedText.text = JSON.stringify({ connector: qb.connector, rules: qb.rules })
                    }
                }

                Row {
                    spacing: 8
                    ChaSetBadge {
                        text: "Rules: " + qb.rules.length
                        variant: "outline"
                    }
                    ChaSetBadge {
                        text: "Combinator: " + qb.connector
                        variant: "secondary"
                    }
                }

                Rectangle {
                    width: parent.width
                    height: 50
                    color: ThemeTokens.hover
                    border.color: ThemeTokens.border
                    border.width: 1
                    radius: 4

                    Text {
                        id: serializedText
                        anchors.fill: parent
                        anchors.margins: 8
                        text: JSON.stringify({ connector: qb.connector, rules: qb.rules })
                        color: ThemeTokens.subduedText
                        font.pixelSize: 10
                        font.family: "monospace"
                        wrapMode: Text.WrapAnywhere
                    }
                }
            }
        }
    }

    ChaSetCodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetQueryBuilder { connector: \"AND\"; rules: [...] }"
        language: "qml"
    }

    
    KeyboardShortcutsTable {
        componentId: "query-builder"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "connector", type: "string", default: "'AND'", description: "Root boolean combinator logic ('AND' | 'OR')." },
            { name: "fields", type: "var[]", default: "[]", description: "Array of queryable field definitions." },
            { name: "rules", type: "var[]", default: "[]", description: "Array of active condition rules." },
            { name: "customRadius", type: "int", default: "8", description: "Corner radius of the rule builder container." }
        ]
    }
}
