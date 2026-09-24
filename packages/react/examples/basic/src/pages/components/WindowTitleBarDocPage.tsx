import React, { useState } from 'react';
import { WindowTitleBar, Badge, CodeBlock, ChaSetLogoIcon } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function WindowTitleBarDocPage() {
  const [lastAction, setLastAction] = useState('Idle');

  const reactCode = `<WindowTitleBar
  title="Window Title Bar"
  icon={<ChaSetLogoIcon className="size-4 text-primary" />}
  onMinimize={() => setLastAction('Minimize clicked')}
  onMaximize={() => setLastAction('Maximize / Restore clicked')}
  onClose={() => setLastAction('Close clicked')}
/>`;

  return (
    <DocLayout
      category="Desktop & Virtualization"
      title="Window Title Bar"
      description="Desktop window frame header with title, drag region, and minimize/maximize/close control buttons for frameless native windows."
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Frameless window title bar with native-style action buttons.
        </p>

        <ComponentPreview
          qtCode={`ChaSetWindowTitleBar {
    width: parent.width
    title: "Chahu Render Studio"
    icon: "logo"
    onMinimizeClicked: console.log("minimize")
    onMaximizeClicked: console.log("maximize")
    onCloseClicked: console.log("close")
}`} title="Window Title Bar Sandbox" reactCode={reactCode}>
          <div className="w-full max-w-lg border border-border rounded-lg overflow-hidden shadow-sm">
            <WindowTitleBar
              title="ChaSet Desktop Studio"
              icon={<ChaSetLogoIcon className="size-4 text-primary" />}
              onMinimize={() => setLastAction('Minimize clicked')}
              onMaximize={() => setLastAction('Maximize / Restore clicked')}
              onClose={() => setLastAction('Close clicked')}
            />
            <div className="h-32 p-4 bg-card text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
              <span>Frameless Client Window Area</span>
              <div className="flex items-center gap-2">
                <span>Caption Event:</span>
                <Badge variant="secondary">{lastAction}</Badge>
              </div>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { WindowTitleBar } from '@chahu/cha-set';

<WindowTitleBar title="ChaSet Desktop" onMinimize={() => {}} onMaximize={() => {}} onClose={() => {}} />`}
        qtCode={`import ChaSet

ChaSetWindowTitleBar {
    width: parent.width
    title: "ChaSet Desktop"
}`}
      />



            <ComponentReference
        name="WindowTitleBar"
        componentId="window-title-bar"
        props={[
            { name: 'title', type: 'ReactNode', default: 'undefined', description: 'Window title label or element.' },
            { name: 'icon', type: 'ReactNode', default: 'undefined', description: 'Application icon rendered at left edge.' },
            { name: 'onMinimize', type: '() => void', default: 'undefined', description: 'Minimize button click callback.' },
            { name: 'onMaximize', type: '() => void', default: 'undefined', description: 'Maximize button click callback.' },
            { name: 'onClose', type: '() => void', default: 'undefined', description: 'Close button click callback.' },
          ]}
      />
    </DocLayout>
  );
}
