import React, { useState } from 'react';
import { QueryBuilder, type QueryRuleGroup, type QueryField } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

const SAMPLE_FIELDS: QueryField[] = [
  { id: 'name', label: 'User Name', type: 'string' },
  { id: 'age', label: 'Age', type: 'number' },
  { id: 'role', label: 'Role', type: 'string' },
  { id: 'active', label: 'Is Active', type: 'boolean' },
];

export function QueryBuilderDocPage() {
  const [query, setQuery] = useState<QueryRuleGroup>({
    id: 'root',
    combinator: 'and',
    rules: [
      { id: 'r1', field: 'role', operator: 'equals', value: 'Architect' },
      { id: 'r2', field: 'age', operator: 'greaterThan', value: 25 },
    ],
  });

  const reactCode = `<QueryBuilder
  fields={fields}
  query={query}
  onQueryChange={setQuery}
/>`;

  return (
    <DocLayout
      category="Composite Engines"
      title="Query Builder"
      description="Visual rule tree builder for structured search query generation with nested logic groups (AND/OR), operator filters, and JSON serialization."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Add rules and nested groups dynamically to construct complex query predicates.
        </p>

        <ComponentPreview title="Query Builder Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-xl flex flex-col gap-4">
            <QueryBuilder
              fields={SAMPLE_FIELDS}
              query={query}
              onQueryChange={setQuery}
            />

            <div className="p-3 bg-muted/40 rounded-md border border-border">
              <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                Serialized JSON Query Model:
              </span>
              <pre className="text-[0.7rem] font-mono text-foreground overflow-auto max-h-36">
                {JSON.stringify(query, null, 2)}
              </pre>
            </div>
          </div>
        </ComponentPreview>
      </section>

      <section id="installation" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      
      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Keyboard Navigation
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Keyboard shortcuts and interaction patterns for this component.
        </p>
        <KeyboardShortcutsTable componentId="query-builder" />
      </section>

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'fields', type: 'QueryField[]', default: '[]', description: 'Available queryable fields and data types.' },
            { name: 'query', type: 'QueryRuleGroup', default: 'undefined', description: 'Active query tree root group.' },
            { name: 'onQueryChange', type: '(q: QueryRuleGroup) => void', default: 'undefined', description: 'Callback fired on rule addition, deletion, or editing.' },
            { name: 'maxDepth', type: 'number', default: '3', description: 'Maximum nested rule group depth.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
