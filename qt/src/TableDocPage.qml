// TableDocPage.qml — Documentation and interactive sandbox for ChaSetTable
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Table"
    description: "A responsive, accessible table component with row hover highlights, clean borders, and header/caption semantics."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "installation", title: "Installation" },
        { id: "anatomy", title: "Anatomy" },
        { id: "states", title: "Examples & States" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border

    property string statusFilter: "all"
    property string searchTerm: ""
    property bool showCaption: true
    property int selectedInvoiceIndex: 0

    readonly property var allInvoices: [
        { id: "INV-001", status: "Paid", method: "Credit Card", amount: "$250.00" },
        { id: "INV-002", status: "Pending", method: "PayPal", amount: "$150.00" },
        { id: "INV-003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
        { id: "INV-004", status: "Paid", method: "Credit Card", amount: "$450.00" },
        { id: "INV-005", status: "Paid", method: "PayPal", amount: "$550.00" }
    ]

    readonly property var filteredInvoices: {
        var list = [];
        for (var i = 0; i < allInvoices.length; ++i) {
            var item = allInvoices[i];
            var matchSearch = searchTerm === "" ||
                item.id.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
                item.method.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
            var matchStatus = statusFilter === "all" || item.status.toLowerCase() === statusFilter.toLowerCase();
            if (matchSearch && matchStatus) {
                list.push(item);
            }
        }
        return list;
    }

    // Section 1: Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Table Sandbox"
        reactCode: `<Table>\n  ${root.showCaption ? '<TableCaption>A list of your recent invoices.</TableCaption>\n  ' : ''}<TableHeader>\n    <TableRow>\n      <TableHead className="w-24">Invoice</TableHead>\n      <TableHead>Status</TableHead>\n      <TableHead>Method</TableHead>\n      <TableHead className="text-right">Amount</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    {invoices.map((inv) => (\n      <TableRow key={inv.id}>\n        <TableCell className="font-medium">{inv.id}</TableCell>\n        <TableCell>{inv.status}</TableCell>\n        <TableCell>{inv.method}</TableCell>\n        <TableCell className="text-right">{inv.amount}</TableCell>\n      </TableRow>\n    ))}\n  </TableBody>\n</Table>`
        qtCode: `ChaSetTable {\n    width: parent.width\n    caption: ${root.showCaption ? '"A list of your recent invoices."' : '""'}\n    columns: [\n        { key: "id", title: "Invoice", width: 100 },\n        { key: "status", title: "Status", width: 100, badge: true },\n        { key: "method", title: "Method" },\n        { key: "amount", title: "Amount", align: "right", width: 120 }\n    ]\n    rows: invoices\n    selectedIndex: 0\n    onRowClicked: (index, rowData) => console.log("Selected:", rowData.id)\n}`

        stageData: [
            Item {
                anchors.fill: parent
                anchors.margins: 16

                ChaSetTable {
                    anchors.centerIn: parent
                    width: parent.width > 540 ? 540 : parent.width
                    caption: root.showCaption ? "A list of your recent invoices." : ""
                    columns: [
                        { key: "id", title: "Invoice", width: 90 },
                        { key: "status", title: "Status", width: 90, badge: true },
                        { key: "method", title: "Method" },
                        { key: "amount", title: "Amount", align: "right", width: 100 }
                    ]
                    rows: root.filteredInvoices
                    selectedIndex: root.selectedInvoiceIndex
                    onRowClicked: (index, rowData) => root.selectedInvoiceIndex = index
                }
            }
        ]

        controlsData: [
            Row {
                spacing: 16

                ChaSetInput {
                    width: 160
                    size: "sm"
                    placeholderText: "Filter invoices..."
                    text: root.searchTerm
                    onTextEdited: root.searchTerm = text
                    anchors.verticalCenter: parent.verticalCenter
                }

                Row {
                    spacing: 8
                    anchors.verticalCenter: parent.verticalCenter
                    Text { text: "Status:"; color: root.cMutedFg; font.pixelSize: 12; anchors.verticalCenter: parent.verticalCenter }
                    ChaSetTabs {
                        anchors.verticalCenter: parent.verticalCenter
                        currentValue: root.statusFilter
                        onCurrentValueChanged: root.statusFilter = currentValue
                        ChaSetTabsList {
                            ChaSetTabsTrigger { value: "all"; text: "All" }
                            ChaSetTabsTrigger { value: "paid"; text: "Paid" }
                            ChaSetTabsTrigger { value: "pending"; text: "Pending" }
                            ChaSetTabsTrigger { value: "unpaid"; text: "Unpaid" }
                        }
                    }
                }

                ChaSetCheckbox {
                    size: "sm"
                    label: "Show Caption"
                    checked: root.showCaption
                    onToggled: (v) => root.showCaption = v
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
        ]
    }

    // Section 2: Installation
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Installation"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        ChaSetCodeBlock {
            width: parent.width
            language: "bash"
            code: "pnpm add @chahu/cha-set"
        }
    }

    // Section 3: Anatomy
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Anatomy"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        Text {
            text: "Import ChaSetTable and declare column schemas and row datasets."
            color: root.cMutedFg
            font.pixelSize: 13
        }

        ChaSetCodeBlock {
            width: parent.width
            language: "qml"
            code: `import ChaSet\n\nChaSetTable {\n    width: parent.width\n    columns: [\n        { key: "id", title: "ID", width: 80 },\n        { key: "name", title: "Name" },\n        { key: "role", title: "Role", align: "right" }\n    ]\n    rows: [\n        { id: 1, name: "Alice", role: "Admin" },\n        { id: 2, name: "Bob", role: "Editor" }\n    ]\n}`
        }
    }

    // Section 4: Examples & States
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Examples & States"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        Text {
            text: "Common configurations and visual states in Qt Quick."
            color: root.cMutedFg
            font.pixelSize: 13
        }

        Row {
            width: parent.width
            spacing: 16

            // Example 1: Simple Table
            ChaSetCard {
                width: (parent.width - 16) / 2
                customRadius: root.customRadius

                ChaSetCardHeader {
                    ChaSetCardTitle { text: "Simple Data Table" }
                    ChaSetCardDescription { text: "Basic table showing users and roles." }
                }

                ChaSetCardContent {
                    ChaSetTable {
                        width: parent.width
                        columns: [
                            { key: "user", title: "User" },
                            { key: "role", title: "Role", align: "right" }
                        ]
                        rows: [
                            { user: "Alice", role: "Administrator" },
                            { user: "Bob", role: "Developer" },
                            { user: "Carol", role: "Designer" }
                        ]
                    }
                }
            }

            // Example 2: Status & Selection
            ChaSetCard {
                width: (parent.width - 16) / 2
                customRadius: root.customRadius

                ChaSetCardHeader {
                    ChaSetCardTitle { text: "Selected Row State" }
                    ChaSetCardDescription { text: "Interactive row highlighting with active selection." }
                }

                ChaSetCardContent {
                    ChaSetTable {
                        width: parent.width
                        selectedIndex: 0
                        columns: [
                            { key: "task", title: "Task" },
                            { key: "state", title: "State", align: "right", badge: true }
                        ]
                        rows: [
                            { task: "API Integration", state: "Complete" },
                            { task: "Unit Testing", state: "In Review" },
                            { task: "Documentation", state: "Planned" }
                        ]
                    }
                }
            }
        }
    }

    // Section 5: Props Reference
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Props Reference"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        
    KeyboardShortcutsTable {
        componentId: "table"
    }

    PropsTable {
            width: parent.width
            propsModel: [
                {
                    name: "columns",
                    type: "var (array)",
                    default: "[]",
                    description: "Array of column definition objects with key, title, optional width, and align ('left' | 'center' | 'right')."
                },
                {
                    name: "rows",
                    type: "var (array)",
                    default: "[]",
                    description: "Array of data objects containing keys matching the column definitions."
                },
                {
                    name: "caption",
                    type: "string",
                    default: "\"\"",
                    description: "Optional caption text rendered at the bottom of the table."
                },
                {
                    name: "headerHeight",
                    type: "int",
                    default: "36",
                    description: "Height for the column header row."
                },
                {
                    name: "rowHeight",
                    type: "int",
                    default: "36",
                    description: "Height for each table data row."
                },
                {
                    name: "selectedIndex",
                    type: "int",
                    default: "-1",
                    description: "Index of currently selected row, applying active selection token styling."
                },
                {
                    name: "customRadius",
                    type: "int",
                    default: "8",
                    description: "Corner radius for the table outer container."
                },
                {
                    name: "customBorderColor",
                    type: "color",
                    default: "ThemeTokens.border",
                    description: "Border color for the table and row dividers."
                }
            ]
        }
    }
}
