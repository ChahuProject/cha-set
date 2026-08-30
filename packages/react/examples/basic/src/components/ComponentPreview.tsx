import React, { useState } from 'react';
import { CodeBlock } from './CodeBlock';

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
    <div className="my-6 rounded-xl border border-border bg-card overflow-hidden shadow-xs">
      {/* Tab Navigation Header */}
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-2">
        <div className="flex items-center gap-1 bg-muted/70 p-0.5 rounded-lg border border-border/50">
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-background text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Preview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
              activeTab === 'code'
                ? 'bg-background text-foreground shadow-xs font-semibold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            React Code
          </button>
          {qtCode && (
            <button
              type="button"
              onClick={() => setActiveTab('qt')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                activeTab === 'qt'
                  ? 'bg-background text-foreground shadow-xs font-semibold'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Qt QML
            </button>
          )}
        </div>

        {title && <span className="text-xs font-medium text-muted-foreground hidden sm:inline">{title}</span>}
      </div>

      {/* Main Content Pane */}
      {activeTab === 'preview' ? (
        <div>
          <div className="relative min-h-[300px] p-8 flex items-center justify-center bg-background/50 border-b border-border/50 overflow-hidden">
            {children}
          </div>

          {/* Interactive Controls Bar */}
          {controls && (
            <div className="p-4 bg-muted/20 flex flex-wrap items-center gap-4 text-xs border-t border-border/40">
              {controls}
            </div>
          )}
        </div>
      ) : activeTab === 'code' ? (
        <div className="p-0">
          <CodeBlock code={reactCode} language="tsx" className="border-0 rounded-none" />
        </div>
      ) : (
        <div className="p-0">
          <CodeBlock code={qtCode || ''} language="qml" className="border-0 rounded-none" />
        </div>
      )}
    </div>
  );
}
