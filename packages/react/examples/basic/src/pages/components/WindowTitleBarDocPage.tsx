import React from 'react';
import { WindowTitleBar } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { CodeBlock } from '../../components/CodeBlock';
import { PropsTable } from '../../components/PropsTable';

export function WindowTitleBarDocPage() {
  const reactCode = `<WindowTitleBar
  title="ChaSet Desktop Studio"
  icon={<span className="text-base">🍵</span>}
  onMinimize={() => console.log('minimize')}
  onMaximize={() => console.log('maximize')}
  onClose={() => console.log('close')}
/>`;

  return (
    <DocLayout
      category="Desktop & Virtualization"
      title="Window Title Bar"
      description="Desktop window frame header with title, drag region, and minimize/maximize/close control buttons for frameless native windows."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Frameless window title bar with native-style action buttons.
        </p>

        <ComponentPreview title="Window Title Bar Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-lg border border-border rounded-lg overflow-hidden shadow-sm">
            <WindowTitleBar
              title="ChaSet Desktop Studio"
              icon={<span className="text-sm">🍵</span>}
              onMinimize={() => alert('Minimize clicked')}
              onMaximize={() => alert('Maximize clicked')}
              onClose={() => alert('Close clicked')}
            />
            <div className="h-32 p-4 bg-card text-xs text-muted-foreground flex items-center justify-center">
              Frameless Client Window Area
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

      <section id="props" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Props Reference
        </h2>
        <PropsTable
          props={[
            { name: 'title', type: 'ReactNode', default: 'undefined', description: 'Window title label or element.' },
            { name: 'icon', type: 'ReactNode', default: 'undefined', description: 'Application icon rendered at left edge.' },
            { name: 'onMinimize', type: '() => void', default: 'undefined', description: 'Minimize button click callback.' },
            { name: 'onMaximize', type: '() => void', default: 'undefined', description: 'Maximize button click callback.' },
            { name: 'onClose', type: '() => void', default: 'undefined', description: 'Close button click callback.' },
          ]}
        />
      </section>
    </DocLayout>
  );
}
