import React, { useState } from 'react';
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
      <Button variant="primary" size="md">
        Save Changes
      </Button>
      <Button variant="secondary" size="md">
        Cancel
      </Button>
      <Button variant="destructive" size="md">
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
            variant: "primary"
            size: "md"
            text: "Save Changes"
            onClicked: console.log("Primary clicked")
        }

        ChaSetButton {
            variant: "secondary"
            size: "md"
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
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'css' ? 'active' : ''}`}
            onClick={() => setActiveTab('css')}
          >
            CSS Variables
          </button>
          <button
            className={`modal-tab ${activeTab === 'tailwind' ? 'active' : ''}`}
            onClick={() => setActiveTab('tailwind')}
          >
            Tailwind v4
          </button>
          <button
            className={`modal-tab ${activeTab === 'react' ? 'active' : ''}`}
            onClick={() => setActiveTab('react')}
          >
            React Code
          </button>
          <button
            className={`modal-tab ${activeTab === 'qt' ? 'active' : ''}`}
            onClick={() => setActiveTab('qt')}
          >
            Qt / QML
          </button>
          <button
            className={`modal-tab ${activeTab === 'json' ? 'active' : ''}`}
            onClick={() => setActiveTab('json')}
          >
            JSON Spec
          </button>
        </div>

        <div className="modal-body">
          <pre className="modal-code-pre">
            <code>{getSnippet()}</code>
          </pre>
        </div>

        <div className="modal-footer">
          <span className="modal-hint">
            💡 Drop this configuration directly into your project's stylesheet or theme manager.
          </span>
          <div className="modal-footer-actions">
            <button className="btn-secondary" onClick={onClose}>
              Close
            </button>
            <button className="btn-primary" onClick={copyToClipboard}>
              {copied ? '✓ Copied to Clipboard!' : '📋 Copy to Clipboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
