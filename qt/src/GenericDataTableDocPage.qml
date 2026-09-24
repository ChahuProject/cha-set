// GenericDataTableDocPage.qml — Living Documentation for ChaSetGenericDataTable
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Generic Data Table"
    description: "Enterprise data table with column header sorting, live search filter querying, responsive row virtualization, and paginated navigation."

    ComponentPreview {
        title: "Generic Data Table Sandbox"
        reactCode: `<GenericDataTable
  data={users}
  columns={[
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'User Name' },
    { accessorKey: 'role', header: 'Role' },
    { accessorKey: 'status', header: 'Status' },
  ]}
  enablePagination
  pageSize={5}
/>`
        qtCode: `ChaSetGenericDataTable {
    width: ThemeTokens.dp(480)
    height: ThemeTokens.dp(280)
    pageSize: 5
    columns: [
        { key: "id", header: "ID", width: 50 },
        { key: "name", header: "User Name", width: 130 },
        { key: "role", header: "Role", width: 160 },
        { key: "status", header: "Status", width: 90 }
    ]
    rows: users
}`

        Item {
            anchors.fill: parent

            ChaSetGenericDataTable {
                anchors.centerIn: parent
                width: ThemeTokens.dp(480)
                height: ThemeTokens.dp(280)
                pageSize: 5
                columns: [
                    { key: "id", header: "ID", width: 50 },
                    { key: "name", header: "User Name", width: 130 },
                    { key: "role", header: "Role", width: 160 },
                    { key: "status", header: "Status", width: 90 }
                ]
                rows: [
                    { id: "1", name: "Alice Chen", role: "Lead Architect", status: "Active" },
                    { id: "2", name: "Bob Smith", role: "Frontend Engineer", status: "Active" },
                    { id: "3", name: "Carol White", role: "Qt Specialist", status: "Pending" },
                    { id: "4", name: "David Lee", role: "DevOps Engineer", status: "Offline" },
                    { id: "5", name: "Elena Rostova", role: "Product Manager", status: "Active" }
                ]
            }
        }
    }

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetGenericDataTable {
    width: ThemeTokens.dp(480)
    height: ThemeTokens.dp(280)
    columns: columns
    pageSize: 10
}`
        reactCode: `import { GenericDataTable } from '@chahu/cha-set';

<GenericDataTable data={data} columns={columns} pageSize={10} />`
    }



    "
        language: "qml"
    }

    
    ComponentReference {
        name: "DataTable"
        componentId: "data-table"
        propsModel: [
            { name: "columns", type: "var[]", default: "[]", description: "Array of column specifications: { key, header, width }." },
            { name: "rows", type: "var[]", default: "[]", description: "Array of arbitrary records to display (alias: tableData)." },
            { name: "pageSize", type: "int", default: "5", description: "Number of rows per page." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the table border frame." }
        ]
    }
}
        ]
    }
}
