import * as React from 'react';
import { bench, describe } from 'vitest';
import { render } from '@testing-library/react';
import {
  AddressBar,
  CodeBlock,
  LanguageSettings,
  MediaProgressBar,
  PipelineView,
  QueryBuilder,
  ScaleOsd,
  SplitButton,
  ThemeSettings,
  DEFAULT_THEME_CONFIG,
} from '../src';

describe('Performance Suite: Composite Engines (9 Components)', () => {
  bench('AddressBar (20x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <AddressBar key={i} defaultValue={`/home/user/project/sub-${i}`} />
        ))}
      </div>
    );
    unmount();
  });

  const sampleTsx = `
import React, { useState } from 'react';
export function Counter() {
  const [val, setVal] = useState(0);
  return <button onClick={() => setVal(v => v + 1)}>Count: {val}</button>;
}
`.repeat(20);

  bench('CodeBlock (20x batch mount & syntax highlighting)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <CodeBlock key={i} language="tsx" code={sampleTsx} />
        ))}
      </div>
    );
    unmount();
  });

  bench('LanguageSettings (20x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <LanguageSettings key={i} />
        ))}
      </div>
    );
    unmount();
  });

  bench('MediaProgressBar (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <MediaProgressBar key={i} currentTime={45} duration={180} />
        ))}
      </div>
    );
    unmount();
  });

  const sampleJobs = [
    { id: 'j1', name: 'Build', status: 'success' as const, steps: [{ id: 's1', name: 'Compile', status: 'success' as const }] },
    { id: 'j2', name: 'Test', status: 'running' as const, steps: [{ id: 's2', name: 'Vitest', status: 'running' as const }] },
  ];

  bench('PipelineView (10x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 10 }, (_, i) => (
          <PipelineView key={i} status="running" jobs={sampleJobs} />
        ))}
      </div>
    );
    unmount();
  });

  const qbFields = [
    { name: 'name', label: 'Name', type: 'string' as const },
    { name: 'age', label: 'Age', type: 'number' as const },
  ];

  bench('QueryBuilder (20x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <QueryBuilder key={i} fields={qbFields} />
        ))}
      </div>
    );
    unmount();
  });

  bench('ScaleOsd (30x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 30 }, (_, i) => (
          <ScaleOsd key={i} value={1.25} />
        ))}
      </div>
    );
    unmount();
  });

  bench('SplitButton (50x batch mount)', () => {
    const options = [{ label: 'Option A', onSelect: () => {} }];
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <SplitButton key={i} options={options}>Action {i}</SplitButton>
        ))}
      </div>
    );
    unmount();
  });

  bench('ThemeSettings (15x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 15 }, (_, i) => (
          <ThemeSettings key={i} config={DEFAULT_THEME_CONFIG} />
        ))}
      </div>
    );
    unmount();
  });
});
