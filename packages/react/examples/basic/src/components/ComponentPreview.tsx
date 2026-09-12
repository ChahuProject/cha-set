import React, { useState } from 'react';
import { Tabs, TabsContent, Card, CodeBlock, SegmentedControl } from '@chahu/cha-set';
import { ErrorBoundary } from './ErrorBoundary';

export interface ComponentPreviewProps {
  title?: string;
  description?: string;
  reactCode: string;
  qtCode?: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
}

export function ComponentPreview({
  title,
  description,
  reactCode,
  qtCode,
  children,
  controls,
}: ComponentPreviewProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'qt'>('preview');

  return (
    <Card className="my-6 overflow-hidden">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="gap-0">
        {/* Tab Navigation Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
          <SegmentedControl
            size="sm"
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as 'preview' | 'code' | 'qt')}
            options={[
              { label: 'Preview', value: 'preview' },
              { label: 'React Code', value: 'code' },
              ...(qtCode ? [{ label: 'Qt QML', value: 'qt' }] : []),
            ]}
          />

          {title && <span className="text-xs font-medium text-muted-foreground hidden sm:inline">{title}</span>}
        </div>

        {/* Main Content Panels */}
        <TabsContent value="preview" className="mt-0">
          <div>
            <div className="relative min-h-[18.75rem] p-8 flex items-center justify-center bg-background/50 border-b border-border/50 overflow-hidden">
              <ErrorBoundary fallbackTitle="Component Preview Error">
                {children}
              </ErrorBoundary>
            </div>

            {/* Interactive Controls Bar */}
            {controls && (
              <div className="p-4 bg-muted/20 flex flex-wrap items-center gap-4 text-xs border-t border-border/40">
                {controls}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="code" className="mt-0 p-0">
          <CodeBlock code={reactCode} language="tsx" className="border-0 rounded-none" />
        </TabsContent>

        {qtCode && (
          <TabsContent value="qt" className="mt-0 p-0">
            <CodeBlock code={qtCode} language="qml" className="border-0 rounded-none" />
          </TabsContent>
        )}
      </Tabs>
    </Card>
  );
}
