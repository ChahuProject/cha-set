import React from 'react';
import {
  ScrollArea,
  Badge,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@chahu/cha-set';

export interface PropItem {
  name: string;
  type: string;
  default?: string;
  defaultValue?: string;
  description: string;
  required?: boolean;
}

export interface PropsTableProps {
  title?: string;
  props?: PropItem[];
  items?: PropItem[];
}

export function PropsTable({ title, props, items }: PropsTableProps) {
  const list = props ?? items ?? [];
  return (
    <div className="my-6">
      {title && <h3 className="text-base font-semibold mb-3 tracking-tight">{title}</h3>}
      <ScrollArea
        showVerticalScrollBar={false}
        showHorizontalScrollBar={true}
        showButtons={false}
        className="rounded-lg border border-border w-full"
      >
        <Table className="w-full text-left text-sm border-collapse">
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <TableHead className="py-2.5 px-4 w-40">Prop</TableHead>
              <TableHead className="py-2.5 px-4 w-36">Type</TableHead>
              <TableHead className="py-2.5 px-4 w-28">Default</TableHead>
              <TableHead className="py-2.5 px-4">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-border/60">
            {list.map((p) => (
              <TableRow key={p.name} className="hover:bg-muted/20 transition-colors">
                <TableCell className="py-3 px-4 font-mono text-xs font-medium text-primary whitespace-nowrap">
                  {p.name}
                  {p.required && <span className="text-destructive ml-1">*</span>}
                </TableCell>
                <TableCell className="py-3 px-4 font-mono text-xs text-muted-foreground">
                  <Badge size="sm" variant="outline" className="font-mono text-[0.6875rem] text-foreground/80 bg-muted/60">
                    {p.type}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 px-4 font-mono text-xs text-muted-foreground">
                  {(p.default ?? p.defaultValue) ? <code className="text-foreground/70">{p.default ?? p.defaultValue}</code> : <span className="opacity-40">—</span>}
                </TableCell>
                <TableCell className="py-3 px-4 text-xs text-muted-foreground leading-relaxed">{p.description}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
