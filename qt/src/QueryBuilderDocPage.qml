// QueryBuilderDocPage.qml — Living Documentation for ChaSetQueryBuilder
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Query Builder"
    description: ChaSetI18n.tr("components.query-builder.description", "Visual rule tree builder for structured search query generation with nested logic groups (AND/OR), operator filters, and JSON serialization.")

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.queryBuilder.sandboxTitle", "Query Builder Sandbox")
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
                spacing: ThemeTokens.dp(12)
                width: ThemeTokens.dp(440)

                ChaSetQueryBuilder {
                    id: qb
                    width: parent.width
                    connector: "AND"
                    fields: [
                        { key: "role", label: ChaSetI18n.tr("desktopComposite.queryBuilder.fieldRole", "Role") },
                        { key: "age", label: ChaSetI18n.tr("desktopComposite.queryBuilder.fieldAge", "Age") },
                        { key: "status", label: ChaSetI18n.tr("common.status", "Status") }
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
                    spacing: ThemeTokens.dp(8)
                    ChaSetBadge {
                        text: ChaSetI18n.tr("desktopComposite.queryBuilder.rulesCount", "Rules: {{count}}", { count: qb.rules.length })
                        variant: "outline"
                    }
                    ChaSetBadge {
                        text: ChaSetI18n.tr("desktopComposite.queryBuilder.combinatorLabel", "Combinator: {{combinator}}", { combinator: qb.connector })
                        variant: "secondary"
                    }
                }

                Rectangle {
                    width: parent.width
                    height: ThemeTokens.dp(50)
                    color: ThemeTokens.hover
                    border.color: ThemeTokens.border
                    border.width: 1
                    radius: ThemeTokens.dp(4)

                    DocText {
                        id: serializedText
                        anchors.fill: parent
                        anchors.margins: 8
                        text: JSON.stringify({ connector: qb.connector, rules: qb.rules })
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeMicro
                        font.family: Typography.familyMono
                        wrapMode: TextEdit.WrapAnywhere
                    }
                }
            }
        }
    }

        DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetQueryBuilder {
    width: parent.width
    fields: fieldsModel
}`
        reactCode: `import { QueryBuilder } from '@chahu/cha-set';

<QueryBuilder fields={fields} value={rules} onChange={setRules} />`
    }

    
    ComponentReference {
        name: "QueryBuilder"
        componentId: "query-builder"
        propsModel: [
            { name: "connector", type: "string", default: "'AND'", description: ChaSetI18n.tr("components.queryBuilder.connectorDesc", "Root boolean combinator logic ('AND' | 'OR').") },
            { name: "fields", type: "var[]", default: "[]", description: ChaSetI18n.tr("components.queryBuilder.fieldsListDesc", "Array of queryable field definitions.") },
            { name: "rules", type: "var[]", default: "[]", description: ChaSetI18n.tr("components.queryBuilder.rulesDesc", "Array of active condition rules.") },
            { name: "customRadius", type: "int", default: "8", description: ChaSetI18n.tr("components.queryBuilder.customRadiusDesc", "Corner radius of the rule builder container.") }
        ]
    }
}
