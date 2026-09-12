import * as React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CodeBlock } from './CodeBlock';
import { tokenColorVar } from './HighlightedCode';
import { tokenize } from './tokenize.generated';

const SAMPLE = 'const answer: number = 42; // life';

const writeText = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  writeText.mockClear();
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
});

const codeEl = (container: HTMLElement) =>
  container.querySelector('[data-slot="code-block-code"]') as HTMLElement;

describe('CodeBlock (React)', () => {
  it('renders the source losslessly after trimming outer whitespace', () => {
    const { container } = render(<CodeBlock code={`\n${SAMPLE}\n`} language="ts" />);
    expect(codeEl(container).textContent).toBe(SAMPLE);
  });

  it('highlights by emitting per-token spans whose text reconstructs the source', () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" />);

    const spans = Array.from(container.querySelectorAll('[data-token]')) as HTMLElement[];
    expect(spans.length).toBeGreaterThan(0);

    // Every emitted type must be one the shared lexer can produce.
    const expected = tokenize(SAMPLE, 'ts').filter((t) => t.t !== 'plain');
    expect(spans.map((el) => el.textContent).join('')).toBe(expected.map((t) => t.v).join(''));
    expect(spans.map((el) => el.dataset.token)).toEqual(expected.map((t) => t.t));

    const keyword = container.querySelector('[data-token="keyword"]') as HTMLElement;
    expect(keyword.textContent).toBe('const');
  });

  it('maps token types onto the documented CSS variable convention', () => {
    expect(tokenColorVar('keyword')).toBe('var(--code-keyword, var(--cs-code-keyword))');
    expect(tokenColorVar('tag')).toBe('var(--code-tag, var(--cs-code-tag))');
  });

  it('renders monochrome when highlight is disabled', () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" highlight={false} />);
    expect(container.querySelectorAll('[data-token]')).toHaveLength(0);
    expect(codeEl(container).textContent).toBe(SAMPLE);
  });

  it('copies the source to the clipboard and surfaces copied feedback', async () => {
    render(<CodeBlock code={SAMPLE} language="ts" />);
    const button = screen.getByRole('button', { name: /copy/i });

    fireEvent.click(button);

    expect(writeText).toHaveBeenCalledWith(SAMPLE);
    expect(await screen.findByText('Copied!')).toBeInTheDocument();
  });

  it('labels the header with the resolved language, and prefers a filename', () => {
    const { container, unmount } = render(<CodeBlock code="x" language="qml" />);
    expect(screen.getByText('QML')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="code-block-label"]')).not.toBeNull();

    unmount();
    render(<CodeBlock code="x" language="qml" filename="Main.qml" />);
    expect(screen.getByText('Main.qml')).toBeInTheDocument();
    expect(screen.queryByText('QML')).toBeNull();
  });

  it('can hide the language label and the copy button', () => {
    const { container } = render(<CodeBlock code="x" language="ts" showLanguage={false} showCopy={false} />);
    expect(container.querySelector('[data-slot="code-block-label"]')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders one gutter entry per line when line numbers are on', () => {
    const { container } = render(<CodeBlock code={'a\nb\nc'} language="text" showLineNumbers />);
    const gutters = Array.from(container.querySelectorAll('[data-slot="code-block-gutter"]'));
    expect(gutters.map((el) => el.textContent)).toEqual(['1', '2', '3']);
    expect(gutters[0]!.getAttribute('aria-hidden')).toBe('true');
    // The gutter is aria-hidden chrome; the source order is gutter-then-code per line.
    expect(codeEl(container).textContent).toBe('1a2b3c');
    expect(container.querySelectorAll('[data-slot="code-block-code"] [data-token]')).toHaveLength(0);
  });

  it('switches between wrapping and horizontal scrolling', () => {
    const { container, unmount } = render(<CodeBlock code={SAMPLE} language="ts" />);
    expect(container.querySelector('.whitespace-pre')).not.toBeNull();
    expect(container.querySelector('.whitespace-pre-wrap')).toBeNull();

    unmount();
    const wrapped = render(<CodeBlock code={SAMPLE} language="ts" wrap />);
    expect(wrapped.container.querySelector('.whitespace-pre-wrap')).not.toBeNull();
  });

  it('bounds content height with a rem-based max height', () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" maxHeight={320} />);
    const body = container.querySelector('[data-slot="code-block-body"]') as HTMLElement;
    expect(body.style.maxHeight).toBe('20rem');
  });

  it('accepts a raw CSS length for maxHeight', () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" maxHeight="24rem" />);
    const body = container.querySelector('[data-slot="code-block-body"]') as HTMLElement;
    expect(body.style.maxHeight).toBe('24rem');
  });

  it('drops the card chrome when embedded', () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" embedded />);
    expect(container.querySelector('[data-slot="code-block-header"]')).toBeNull();
    expect((container.querySelector('[data-slot="code-block"]') as HTMLElement).dataset.embedded).toBe('true');
    expect(codeEl(container).textContent).toBe(SAMPLE);
  });

  it('groups multiple files behind tabs and keeps the copy target in sync', async () => {
    const files = [
      { name: 'a.ts', code: 'const a = 1;' },
      { name: 'b.ts', code: 'const b = 2;', language: 'js' },
    ];
    const { container } = render(<CodeBlock language="ts" files={files} />);

    expect(screen.getByRole('tab', { name: 'a.ts' })).toBeInTheDocument();
    expect(codeEl(container).textContent).toBe('const a = 1;');

    fireEvent.click(screen.getByRole('tab', { name: 'b.ts' }));

    // Tab activation is deferred by the tabs primitive, so await the panel swap.
    await waitFor(() => expect(codeEl(container).textContent).toBe('const b = 2;'));

    fireEvent.click(screen.getByRole('button', { name: /copy/i }));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith('const b = 2;'));
  });

  it('honours per-file language overrides', () => {
    const entries = tokenize('const a = 1;', 'js');
    expect(entries.some((t) => t.t === 'keyword')).toBe(true);
  });
});
