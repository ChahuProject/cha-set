// GenericDataTableDocPage.qml — Living Documentation for ChaSetGenericDataTable
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Generic Data Table"
    description: "Enterprise data table with column header sorting, live search filter querying, responsive row virtualization, and paginated navigation."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    ComponentPreview {
        title: "Data Table Preview"
        reactCode: `<GenericDataTable
  columns={[
    { key: "id", header: "ID" },
    { key: "service", header: "Microservice" },
    { key: "status", header: "Status" }
  ]}
  data={dataset}
  pageSize={5}
/>`
        qtCode: `ChaSetGenericDataTable {
    columns: [
        { key: "id", header: "ID", width: 80 },
        { key: "service", header: "Microservice", width: 180 },
        { key: "status", header: "Status", width: 100 }
    ]
    data: [...]
    pageSize: 5
}`

        Item {
            anchors.fill: parent

            ChaSetGenericDataTable {
                anchors.centerIn: parent
                width: 480
                height: 280
                pageSize: 4
                columns: [
                    { key: "id", header: "ID", width: 80 },
                    { key: "service", header: "Service", width: 160 },
                    { key: "version", header: "Version", width: 100 },
                    { key: "status", header: "Status", width: 100 }
                ]
                data: [
                    { id: "SVC-101", service: "auth-gateway", version: "v2.4.1", status: "Healthy" },
                    { id: "SVC-102", service: "render-debugger", version: "v1.9.0", status: "Active" },
                    { id: "SVC-103", service: "pipeline-runner", version: "v3.1.2", status: "Degraded" },
                    { id: "SVC-104", service: "storage-broker", version: "v0.8.4", status: "Healthy" },
                    { id: "SVC-105", service: "token-engine", version: "v1.2.0", status: "Healthy" },
                    { id: "SVC-106", service: "query-compiler", version: "v2.0.0", status: "Active" },
                    { id: "SVC-107", service: "metric-collector", version: "v4.0.1", status: "Healthy" }
                ]
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetGenericDataTable { columns: [...]; data: [...] }"
        language: "qml"
    }

    
    KeyboardShortcutsTable {
        componentId: "generic-data-table"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "columns", type: "var[]", default: "[]", description: "Array of column specifications: { key, header, width }." },
            { name: "data", type: "var[]", default: "[]", description: "Array of arbitrary records to display." },
            { name: "pageSize", type: "int", default: "5", description: "Number of rows per page." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the table border frame." }
        ]
    }
}
