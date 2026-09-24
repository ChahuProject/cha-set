import React, { useState } from 'react';
import { Card, CodeBlock, SegmentedControl } from '@chahu/cha-set';

export interface DocAnatomyProps {
  id?: string;
  title?: string;
  description?: string;
  reactCode: string;
  qtCode?: string;
}

export function DocAnatomy({
  id = 'anatomy',
  title = 'Anatomy',
  description = 'Import and structure definition for React and Qt Quick.',
  reactCode,
  qtCode,
}: DocAnatomyProps) {
  const [activeTab, setActiveTab] = useState<'react' | 'qt'>('react');

  return (
    <section id={id} className="scroll-mt-20 my-8">
      <div className="flex flex-col gap-1 mb-3">
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
          <SegmentedControl
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as 'react' | 'qt')}
            options={[
              { label: 'React (TSX)', value: 'react' },
              ...(qtCode ? [{ label: 'Qt Quick (QML)', value: 'qt' }] : []),
            ]}
          />
        </div>

        {activeTab === 'react' && (
          <CodeBlock
            code={reactCode.trim()}
            language="tsx"
            className="rounded-none border-none"
          />
        )}

        {activeTab === 'qt' && qtCode && (
          <CodeBlock
            code={qtCode.trim()}
            language="qml"
            className="rounded-none border-none"
          />
        )}
      </Card>
    </section>
  );
}
