import * as React from 'react';
import { bench, describe } from 'vitest';
import { render } from '@testing-library/react';
import { CodeBlock } from '../src/code-block/CodeBlock';

describe('Tier 4: CodeBlock Syntax Highlighting Benchmarks', () => {
  const sampleTypeScript = `
import React, { useState, useEffect } from 'react';

export interface UserProfileProps {
  id: string;
  name: string;
  active: boolean;
  onUpdate: (id: string, meta: Record<string, unknown>) => Promise<void>;
}

export function UserProfile({ id, name, active, onUpdate }: UserProfileProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(active ? 'active' : 'suspended');

  useEffect(() => {
    console.info('Initialized user profile for:', id);
  }, [id]);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onUpdate(id, { status: 'toggled', timestamp: Date.now() });
      setStatus(prev => prev === 'active' ? 'suspended' : 'active');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card text-foreground p-4 rounded-lg bg-card border border-border">
      <h3 className="text-base font-semibold">{name}</h3>
      <span className="text-xs text-muted-foreground">ID: {id}</span>
      <button disabled={loading} onClick={handleToggle} className="btn-primary">
        {loading ? 'Updating...' : status}
      </button>
    </div>
  );
}
`.repeat(15); // ~400 lines of TSX

  bench('CodeBlock tokenize & render 400 LOC TypeScript', () => {
    const { unmount } = render(
      <CodeBlock
        language="tsx"
        code={sampleTypeScript}
        showLineNumbers={true}
      />
    );
    unmount();
  });
});
