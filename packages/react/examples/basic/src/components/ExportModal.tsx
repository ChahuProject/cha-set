import React, { useState } from 'react';
import { Button, ScrollArea } from '@chahu/cha-set';
import type { ThemeOverrides } from './ThemeTuner';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: string;
  accent: string;
  overrides: ThemeOverrides;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  mode,
  accent,
  overrides,
}) => {
  const [activeTab, setActiveTab] = useState<'css' | 'tailwind' | 'react' | 'qt' | 'json'>('css');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Build CSS Variables Snippet
  const buildCssSnippet = () => {
    const lines: string[] = [];
    lines.push(`/* ChaSet Design Tokens — Custom Theme Config */`);
    lines.push(`/* Mode: ${mode} | Accent: ${accent || 'default'} */`);
    lines.push(`:root {`);
    if (overrides.radius) lines.push(`  --radius: ${overrides.radius};`);
    if (overrides.primary) lines.push(`  --primary: ${overrides.primary};`);
    if (overrides.primaryForeground) lines.push(`  --primary-foreground: ${overrides.primaryForeground};`);
    if (overrides.secondary) lines.push(`  --secondary: ${overrides.secondary};`);
    if (overrides.secondaryForeground) lines.push(`  --secondary-foreground: ${overrides.secondaryForeground};`);
    if (overrides.accent) lines.push(`  --accent: ${overrides.accent};`);
    if (overrides.destructive) lines.push(`  --destructive: ${overrides.destructive};`);
    if (overrides.background) lines.push(`  --background: ${overrides.background};`);
    if (overrides.card) lines.push(`  --card: ${overrides.card};`);
    if (overrides.ring) lines.push(`  --ring: ${overrides.ring};`);
    if (Object.keys(overrides).length === 0) {
      lines.push(`  /* Default Theme Tokens active */`);
      lines.push(`  --primary: ${mode === 'dark' ? '#30a0ff' : '#1d7ae0'};`);
      lines.push(`  --primary-foreground: #ffffff;`);
      lines.push(`  --radius: 0.5rem;`);
    }
    lines.push(`}`);
    return lines.join('\n');
  };

  // Build Tailwind v4 @theme Snippet
  const buildTailwindSnippet = () => {
    return `@import "tailwindcss";
@import "@chahu/cha-set/styles.css";

@theme inline {
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-destructive: var(--destructive);
  --color-background: var(--background);
  --color-card: var(--card);
  --radius-sm: calc(var(--radius) - 0.25rem);
  --radius-md: calc(var(--radius) - 0.125rem);
  --radius-lg: var(--radius);
}`;
  };

  // Build React Usage Snippet
  const buildReactSnippet = () => {
    return `// 1. Install component library
// pnpm add @chahu/cha-set

import React from 'react';
import { Button } from '@chahu/cha-set';
import '@chahu/cha-set/styles.css';

export function ActionPanel() {
  return (
    <div className="flex gap-3">
      <Button variant="default" size="default">
        Save Changes
      </Button>
      <Button variant="secondary" size="default">
        Cancel
      </Button>
      <Button variant="destructive" size="default">
        Delete
      </Button>
    </div>
  );
}`;
  };

  // Build Qt / QML Snippet
  const buildQtSnippet = () => {
    const primaryColor = overrides.primary || (mode === 'dark' ? '#30a0ff' : '#1d7ae0');
    return `// ChaSet Qt / QML Integration
// 1. Import ThemeTokens and ChaSet components
import QtQuick 6.10
import chaSet

ApplicationWindow {
    visible: true
    width: 600
    height: 400
    color: ThemeTokens.background

    Component.onCompleted: {
        ThemeTokens.dark = ${mode === 'dark' ? 'true' : 'false'}
    }

    Row {
        spacing: 12
        anchors.centerIn: parent

        ChaSetButton {
            variant: "default"
            size: "default"
            text: "Save Changes"
            onClicked: console.log("Default clicked")
        }

        ChaSetButton {
            variant: "secondary"
            size: "default"
            text: "Cancel"
        }
    }
}`;
  };

  // Build JSON Spec Snippet
  const buildJsonSnippet = () => {
    return JSON.stringify(
      {
        theme: {
          mode,
          accent: accent || 'default',
          overrides,
        },
      },
      null,
      2,
    );
  };

  const getSnippet = () => {
    switch (activeTab) {
      case 'css':
        return buildCssSnippet();
      case 'tailwind':
        return buildTailwindSnippet();
      case 'react':
        return buildReactSnippet();
      case 'qt':
        return buildQtSnippet();
      case 'json':
        return buildJsonSnippet();
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getSnippet());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <h3>Export & Copy Theme Configuration</h3>
            <p>One-click copy tailored styles and component code for your target framework.</p>
          </div>
          <Button variant="ghost" size="icon" className="size-7" onClick={onClose} aria-label="Close">
            ✕
          </Button>
        </div>

        <div className="modal-tabs flex gap-1 p-2 bg-muted/30 border-b border-border">
          <Button
            variant={activeTab === 'css' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('css')}
          >
            CSS Variables
          </Button>
          <Button
            variant={activeTab === 'tailwind' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('tailwind')}
          >
            Tailwind v4
          </Button>
          <Button
            variant={activeTab === 'react' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('react')}
          >
            React Code
          </Button>
          <Button
            variant={activeTab === 'qt' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('qt')}
          >
            Qt / QML
          </Button>
          <Button
            variant={activeTab === 'json' ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setActiveTab('json')}
          >
            JSON Spec
          </Button>
        </div>

        <div className="modal-body">
          <ScrollArea
            showVerticalScrollBar={true}
            showHorizontalScrollBar={true}
            showButtons={false}
            className="max-h-72 rounded-md border border-border bg-card"
            viewportClassName="p-4"
          >
            <pre className="m-0 font-mono text-xs leading-relaxed text-foreground whitespace-pre">
              <code>{getSnippet()}</code>
            </pre>
          </ScrollArea>
        </div>

        <div className="modal-footer">
          <span className="modal-hint">
            💡 Drop this configuration directly into your project's stylesheet or theme manager.
          </span>
          <div className="modal-footer-actions flex gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button variant="default" size="sm" onClick={copyToClipboard}>
              {copied ? '✓ Copied to Clipboard!' : '📋 Copy to Clipboard'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
