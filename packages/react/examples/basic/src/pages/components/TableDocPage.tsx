import React, { useState, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption, Badge, Input, SegmentedControl, Checkbox, Card, CardHeader, CardTitle, CardDescription, CardContent, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

interface Invoice {
  id: string;
  status: 'Paid' | 'Pending' | 'Unpaid';
  method: string;
  amount: string;
}

export function TableDocPage() {
  const { t } = useChaSetI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showCaption, setShowCaption] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>('INV-001');

  const invoices = useMemo<Invoice[]>(() => [
    { id: 'INV-001', status: 'Paid', method: t('desktopComposite.table.methodCreditCard', 'Credit Card'), amount: '$250.00' },
    { id: 'INV-002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
    { id: 'INV-003', status: 'Unpaid', method: t('desktopComposite.table.methodBankTransfer', 'Bank Transfer'), amount: '$350.00' },
    { id: 'INV-004', status: 'Paid', method: t('desktopComposite.table.methodCreditCard', 'Credit Card'), amount: '$450.00' },
    { id: 'INV-005', status: 'Paid', method: 'PayPal', amount: '$550.00' },
  ], [t]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.method.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || inv.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const heroReactCode = `<Table>
  ${showCaption ? '<TableCaption>A list of your recent invoices.</TableCaption>\n  ' : ''}<TableHeader>
    <TableRow>
      <TableHead className="w-24">Invoice</TableHead>
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
      category="Composite Engines"
      title="Table"
      description={t('components.table.description', 'A responsive, accessible table component with row hover highlights, clean borders, and header/caption semantics.')}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.table.overviewDesc', 'Test interactive data table controls with live filtering, row selection, and synchronized React and Qt Quick code.')}
        </p>

        <ComponentPreview
          title={t('desktopComposite.table.sandboxTitle', 'Table Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Search Filter */}
              <div className="w-48">
                <Input
                  size="sm"
                  placeholder={t('desktopComposite.table.filterPlaceholder', 'Filter invoices...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('common.status', 'Status:')}</span>
                <SegmentedControl
                  size="sm"
                  value={statusFilter}
                  onChange={(v) => setStatusFilter(String(v))}
                  options={[
                    { label: t('desktopComposite.table.statusAll', 'All'), value: 'all' },
                    { label: t('desktopComposite.table.statusPaid', 'Paid'), value: 'paid' },
                    { label: t('desktopComposite.table.statusPending', 'Pending'), value: 'pending' },
                    { label: t('desktopComposite.table.statusUnpaid', 'Unpaid'), value: 'unpaid' },
                  ]}
                />
              </div>

              {/* Caption Toggle */}
              <Checkbox
                size="sm"
                checked={showCaption}
                onCheckedChange={(v) => setShowCaption(Boolean(v))}
                label={t('desktopComposite.table.showCaption', 'Show Caption')}
              />
            </div>
          }
        >
          <div className="w-full border border-border rounded-lg overflow-hidden bg-card">
            <Table>
              {showCaption && (
                <TableCaption>{t('desktopComposite.table.caption', 'A list of your recent invoices.')}</TableCaption>
              )}
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">{t('desktopComposite.table.colInvoice', 'Invoice')}</TableHead>
                  <TableHead>{t('common.status', 'Status')}</TableHead>
                  <TableHead>{t('desktopComposite.table.colMethod', 'Method')}</TableHead>
                  <TableHead className="text-right">{t('desktopComposite.table.colAmount', 'Amount')}</TableHead>
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
                          {inv.status === 'Paid'
                            ? t('desktopComposite.table.statusPaid', 'Paid')
                            : inv.status === 'Pending'
                            ? t('desktopComposite.table.statusPending', 'Pending')
                            : t('desktopComposite.table.statusUnpaid', 'Unpaid')}
                        </Badge>
                      </TableCell>
                      <TableCell>{inv.method}</TableCell>
                      <TableCell className="text-right font-mono text-xs">{inv.amount}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      {t('desktopComposite.table.noResults', 'No results found.')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3}>{t('desktopComposite.table.total', 'Total')}</TableCell>
                  <TableCell className="text-right font-mono">$1,750.00</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Installation */}
      {/* 3. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Table, TableHeader, TableBody, TableFooter, TableRow, TableHead, TableCell, TableCaption } from '@chahu/cha-set';\n\n<Table>\n  <TableCaption>A list of recent records.</TableCaption>\n  <TableHeader>\n    <TableRow>\n      <TableHead>Name</TableHead>\n      <TableHead>Status</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>\n    <TableRow>\n      <TableCell>Alpha</TableCell>\n      <TableCell>Active</TableCell>\n    </TableRow>\n  </TableBody>\n  <TableFooter>\n    <TableRow>\n      <TableCell colSpan={2}>Footer summary</TableCell>\n    </TableRow>\n  </TableFooter>\n</Table>`}
        qtCode={`import ChaSet\n\nChaSetTable {\n    width: parent.width\n    caption: "A list of recent records."\n    columns: [\n        { key: "name", title: "Name" },\n        { key: "status", title: "Status" }\n    ]\n    rows: [\n        { name: "Alpha", status: "Active" }\n    ]\n}`}
      />

      {/* 4. Examples & States */}
      <section id="states" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.examplesAndStates', 'Examples & States')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.table.examplesDesc', 'Common table patterns and interactive configurations.')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card: Clean Simple Table */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle>{t('desktopComposite.table.simpleTableTitle', 'Simple Data Table')}</CardTitle>
              <CardDescription>{t('desktopComposite.table.simpleTableDesc', 'Minimal table without header background or footer.')}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('desktopComposite.table.colUser', 'User')}</TableHead>
                      <TableHead>{t('desktopComposite.table.colRole', 'Role')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">{t('desktopComposite.table.userAlice', 'Alice')}</TableCell>
                      <TableCell>{t('desktopComposite.table.roleAdmin', 'Administrator')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('desktopComposite.table.userBob', 'Bob')}</TableCell>
                      <TableCell>{t('desktopComposite.table.roleDev', 'Developer')}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('desktopComposite.table.userCarol', 'Carol')}</TableCell>
                      <TableCell>{t('desktopComposite.table.roleDesigner', 'Designer')}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Card: Status Badges Table */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle>{t('desktopComposite.table.statusCardTitle', 'Status Badges & Selection')}</CardTitle>
              <CardDescription>{t('desktopComposite.table.statusCardDesc', 'Tables embedding status indicator badges and interactive row states.')}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('desktopComposite.table.colTask', 'Task')}</TableHead>
                      <TableHead className="text-right">{t('desktopComposite.table.colState', 'State')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow data-state="selected">
                      <TableCell className="font-medium">{t('desktopComposite.table.taskApiIntegration', 'API Integration')}</TableCell>
                      <TableCell className="text-right">
                        <Badge size="sm" variant="default">{t('desktopComposite.table.stateComplete', 'Complete')}</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('desktopComposite.table.taskUnitTesting', 'Unit Testing')}</TableCell>
                      <TableCell className="text-right">
                        <Badge size="sm" variant="secondary">{t('desktopComposite.table.stateInReview', 'In Review')}</Badge>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">{t('desktopComposite.table.taskDocumentation', 'Documentation')}</TableCell>
                      <TableCell className="text-right">
                        <Badge size="sm" variant="outline">{t('desktopComposite.table.statePlanned', 'Planned')}</Badge>
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
      
            <ComponentReference
        name="Table"
        componentId="table"
        props={[
                {
                  name: 'className',
                  type: 'string',
                  default: "''",
                  description: t('components.table.classNameDesc', 'Additional CSS classes for the table element.'),
                },
                {
                  name: 'containerClassName',
                  type: 'string',
                  default: "''",
                  description: t('components.table.containerClassNameDesc', 'Additional CSS classes for the overflow-auto wrapper container.'),
                },
              ]}
      />
    </DocLayout>
  );
}
