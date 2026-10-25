import React, { useState, useMemo } from 'react';
import { QueryBuilder, Badge, type QueryRuleGroup, type QueryField, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function QueryBuilderDocPage() {
  const { t } = useChaSetI18n();

  const sampleFields = useMemo<QueryField[]>(() => [
    { id: 'name', label: t('desktopComposite.queryBuilder.fieldUserName', 'User Name'), type: 'string' },
    { id: 'age', label: t('desktopComposite.queryBuilder.fieldAge', 'Age'), type: 'number' },
    { id: 'role', label: t('desktopComposite.queryBuilder.fieldRole', 'Role'), type: 'string' },
    { id: 'active', label: t('desktopComposite.queryBuilder.fieldIsActive', 'Is Active'), type: 'boolean' },
  ], [t]);

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
      description={t('components.query-builder.description', 'Visual rule tree builder for structured search query generation with nested logic groups (AND/OR), operator filters, and JSON serialization.')}
    >
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('desktopComposite.queryBuilder.overviewDesc', 'Add rules and nested groups dynamically to construct complex query predicates.')}
        </DocText>

        <ComponentPreview
          qtCode={`ChaSetQueryBuilder {
    connector: "AND"
    fields: [
        { key: "role", label: "Role" },
        { key: "age", label: "Age" }
    ]
    rules: [
        { id: "r1", field: "role", operator: "equals", value: "Architect" }
    ]
    onQueryChanged: console.log("query changed")
}`} title={t('desktopComposite.queryBuilder.sandboxTitle', 'Query Builder Sandbox')} reactCode={reactCode}>
          <div className="w-full max-w-xl flex flex-col gap-4">
            <QueryBuilder
              fields={sampleFields}
              query={query}
              onQueryChange={setQuery}
            />

            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {t('desktopComposite.queryBuilder.rulesCount', 'Rules: {{count}}', { count: query.rules?.length ?? 0 })}
              </Badge>
              <Badge variant="secondary">
                {t('desktopComposite.queryBuilder.combinatorLabel', 'Combinator: {{combinator}}', { combinator: String(query.combinator).toUpperCase() })}
              </Badge>
            </div>

            <div className="p-3 bg-muted/40 rounded-md border border-border">
              <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                {t('desktopComposite.queryBuilder.serializedModel', 'Serialized JSON Query Model:')}
              </span>
              <pre className="text-[0.7rem] font-mono text-foreground overflow-auto max-h-36">
                {JSON.stringify(query, null, 2)}
              </pre>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { QueryBuilder } from '@chahu/cha-set';

<QueryBuilder fields={fields} value={rules} onChange={setRules} />`}
        qtCode={`import ChaSet

ChaSetQueryBuilder {
    width: parent.width
    fields: fieldsModel
}`}
      />



                        <DocMarkdown id="query-builder" section="keyboard" />

            <DocMarkdown id="query-builder" section="props" />
    </DocLayout>
  );
}
