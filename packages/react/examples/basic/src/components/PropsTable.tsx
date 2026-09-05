import React from 'react';
import { ScrollArea } from '@chahu/cha-set';

export interface PropItem {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export interface PropsTableProps {
  title?: string;
  props: PropItem[];
}

export function PropsTable({ title, props }: PropsTableProps) {
  return (
    <div className="my-6">
      {title && <h3 className="text-base font-semibold mb-3 tracking-tight">{title}</h3>}
      <ScrollArea
        showVerticalScrollBar={false}
        showHorizontalScrollBar={true}
        showButtons={false}
        className="rounded-lg border border-border w-full"
      >
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="py-2.5 px-4">Prop</th>
              <th className="py-2.5 px-4">Type</th>
              <th className="py-2.5 px-4">Default</th>
              <th className="py-2.5 px-4">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {props.map((p) => (
              <tr key={p.name} className="hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4 font-mono text-xs font-medium text-primary whitespace-nowrap">
                  {p.name}
                  {p.required && <span className="text-destructive ml-1">*</span>}
                </td>
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                  <span className="bg-muted px-1.5 py-0.5 rounded text-[0.6875rem] text-foreground/80">{p.type}</span>
                </td>
                <td className="py-3 px-4 font-mono text-xs text-muted-foreground">
                  {p.default ? <code className="text-foreground/70">{p.default}</code> : <span className="opacity-40">—</span>}
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground leading-relaxed">{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
}
