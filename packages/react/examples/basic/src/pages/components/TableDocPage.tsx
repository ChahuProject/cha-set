import React, { useState, useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
  Badge,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  Checkbox,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

interface Invoice {
  id: string;
  status: 'Paid' | 'Pending' | 'Unpaid';
  method: string;
  amount: string;
}

const INVOICES: Invoice[] = [
  { id: 'INV-001', status: 'Paid', method: 'Credit Card', amount: '$250.00' },
  { id: 'INV-002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  { id: 'INV-003', status: 'Unpaid', method: 'Bank Transfer', amount: '$350.00' },
  { id: 'INV-004', status: 'Paid', method: 'Credit Card', amount: '$450.00' },
  { id: 'INV-005', status: 'Paid', method: 'PayPal', amount: '$550.00' },
];

export function TableDocPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCaption, setShowCaption] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>('INV-001');

  const filteredInvoices = useMemo(() => {
    return INVOICES.filter((inv) => {
      const matchesSearch =
        inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.method.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || inv.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const heroReactCode = `<Table>
  ${showCaption ? '<TableCaption>A list of your recent invoices.</TableCaption>\n  ' : ''}<TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.map((inv) => (
      <TableRow key={inv.id} data-state={selectedId === inv.id ? "selected" : undefined}>
        <TableCell className="font-medium">{inv.id}</TableCell>
        <TableCell>{inv.status}</TableCell>
        <TableCell>{inv.method}</TableCell>
        <TableCell className="text-right">{inv.amount}</TableCell>
      </TableRow>
    ))}
  </TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={3}>Total</TableCell>
      <TableCell className="text-right">$1,750.00</TableCell>
    </TableRow>
  </TableFooter>
</Table>`;

  const heroQtCode = `ChaSetTable {
    width: parent.width
    caption: ${showCaption ? '"A list of your recent invoices."' : '""'}
    columns: [
        { key: "id", title: "Invoice", width: 100 },
        { key: "status", title: "Status", width: 100 },
        { key: "method", title: "Method" },
        { key: "amount", title: "Amount", align: "right", width: 120 }
    ]
    rows: [
        { id: "INV-001", status: "Paid", method: "Credit Card", amount: "$250.00" },
        { id: "INV-002", status: "Pending", method: "PayPal", amount: "$150.00" },
        { id: "INV-003", status: "Unpaid", method: "Bank Transfer", amount: "$350.00" },
        { id: "INV-004", status: "Paid", method: "Credit Card", amount: "$450.00" },
        { id: "INV-005", status: "Paid", method: "PayPal", amount: "$550.00" }
    ]
    selectedIndex: 0
    onRowClicked: (index, rowData) => console.log("Selected:", rowData.id)
}`;

  return (
    <DocLayout
      category="Components"
      title="Table"
      description="A responsive, accessible table component with row hover highlights, clean borders, and header/caption semantics."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'anatomy', title: 'Anatomy' },
        { id: 'states', title: 'Examples & States' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Test interactive data table controls with live filtering, row selection, and synchronized React and Qt Quick code.
        </p>

        <ComponentPreview
          title="Table Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Search Filter */}
              <div className="w-48">
                <Input
                  size="sm"
                  placeholder="Filter invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">Status:</span>
                <Tabs value={statusFilter} onValueChange={setStatusFilter}>
                  <TabsList className="h-8">
                    <TabsTrigger value="all" className="h-6 px-2.5 text-xs">All</TabsTrigger>
                    <TabsTrigger value="paid" className="h-6 px-2.5 text-xs">Paid</TabsTrigger>
                    <TabsTrigger value="pending" className="h-6 px-2.5 text-xs">Pending</TabsTrigger>
                    <TabsTrigger value="unpaid" className="h-6 px-2.5 text-xs">Unpaid</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Caption Toggle */}
              <Checkbox
                size="sm"
                checked={showCaption}
                onCheckedChange={(v) => setShowCaption(v)}
                label="Show Caption"
              />
            </div>
          }
        >
          <div className="w-full border border-border rounded-lg overflow-hidden bg-card">
            <Table>
              {showCaption && (
                <TableCaption>A list of your recent invoices.</TableCaption>
              )}
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((inv) => (
                    <TableRow
                      key={inv.id}
                      className="cursor-pointer"
                      data-state={selectedId === inv.id ? 'selected' : undefined}
                      onClick={() => setSelectedId(inv.id)}
                    >
                      <TableCell className="font-medium">{inv.id}</TableCell>
                      <TableCell>
                        <Badge
                          size="sm"
                          variant={
                            inv.status === 'Paid'
                              ? 'default'
                              : inv.status === 'Pending'
                              ? 'secondary'
                              : 'destructive'
                          }
                        >
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{inv.method}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{inv.amount}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>Total</TableCell>
                  <TableCell className="text-right font-mono">$1,750.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Installation */}
      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      {/* 3. Anatomy */}
      <section id="anatomy" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Anatomy
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Construct semantic and accessible tables using shadcn compound subcomponents.
        </p>
        <CodeBlock
          code={`import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from '@chahu/cha-set';

export function TableDemo() {
  return (
    <Table>
      <TableCaption>A list of recent records.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Header 1</TableHead>
          <TableHead>Header 2</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Data 1</TableCell>
          <TableCell>Data 2</TableCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={2}>Footer summary</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}`}
          language="tsx"
        />
      </section>

      {/* 4. Examples & States */}
      <section id="states" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Examples & States
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Common table patterns and interactive configurations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Clean Simple Table */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle>Simple Data Table</CardTitle>
              <CardDescription>Minimal table without header background or footer.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Alice</TableCell>
                      <TableCell>Administrator</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Bob</TableCell>
                      <TableCell>Developer</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Carol</TableCell>
                      <TableCell>Designer</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Card: Status Badges Table */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle>Status Badges & Selection</CardTitle>
              <CardDescription>Tables embedding status indicator badges and interactive row states.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Task</TableHead>
                      <TableHead className="text-right">State</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow data-state="selected">
                      <TableCell className="font-medium">API Integration</TableCell>
                      <TableCell className="text-right">
                        <Badge size="sm" variant="default">Complete</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Unit Testing</TableCell>
                      <TableCell className="text-right">
                        <Badge size="sm" variant="secondary">In Review</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Documentation</TableCell>
                      <TableCell className="text-right">
                        <Badge size="sm" variant="outline">Planned</Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 5. Props Reference */}
      
      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="table" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Table</h3>
            <PropsTable
              props={[
                {
                  name: 'className',
                  type: 'string',
                  default: "''",
                  description: 'Additional CSS classes for the table element.',
                },
                {
                  name: 'containerClassName',
                  type: 'string',
                  default: "''",
                  description: 'Additional CSS classes for the overflow-auto wrapper container.',
                },
              ]}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">TableRow</h3>
            <PropsTable
              props={[
                {
                  name: 'data-state',
                  type: "'selected' | undefined",
                  default: 'undefined',
                  description: 'Sets row selection styling highlight.',
                },
                {
                  name: 'className',
                  type: 'string',
                  default: "''",
                  description: 'Additional CSS classes for the table row element.',
                },
              ]}
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">TableHead & TableCell</h3>
            <PropsTable
              props={[
                {
                  name: 'className',
                  type: 'string',
                  default: "''",
                  description: 'Additional CSS classes for cell alignment, typography, or width.',
                },
              ]}
            />
          </div>
        </div>
      </section>
    </DocLayout>
  );
}
