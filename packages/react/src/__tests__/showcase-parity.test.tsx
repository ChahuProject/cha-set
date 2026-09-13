import { describe, it, expect } from 'vitest';
// @ts-expect-error - .mjs helper script without types
import { verifyShowcaseParity } from '../../../../scripts/verify-showcase-parity.mjs';

describe('Showcase Parity Assurance System (SPAS)', () => {
  it('validates dual-stack showcase metadata and TOC parity across all components', () => {
    const result = verifyShowcaseParity({ targetComponent: 'all' });
    if (!result.ok) {
      console.error('Showcase parity errors:', result.errors);
    }
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
    expect(result.checkedCount).toBeGreaterThanOrEqual(47);
  });

  it('validates Splitter specific cross-stack showcase parity and sandbox layout', () => {
    const result = verifyShowcaseParity({ targetComponent: 'splitter' });
    expect(result.errors).toEqual([]);
    expect(result.ok).toBe(true);
  });

  it('detects metadata and TOC divergences accurately when given synthetic mismatched content', async () => {
    // @ts-expect-error - .mjs helper script without types
    const { extractReactDocMetadata, extractQtDocMetadata } = await import('../../../../scripts/verify-showcase-parity.mjs');
    
    const syntheticReact = `<DocLayout category="WrongCategory" title="WrongTitle" description="Desc" tocItems={[{ id: 'overview', title: 'Interactive Overview' }]}><div>content</div></DocLayout>`;
    const rMeta = extractReactDocMetadata(syntheticReact);
    expect(rMeta.category).toBe('WrongCategory');
    expect(rMeta.title).toBe('WrongTitle');

    const syntheticQt = `DocLayout { category: "WrongCategory"; pageTitle: "WrongTitle"; description: "Desc"; tocItems: [{ id: "preview", title: "Legacy" }] }`;
    const qMeta = extractQtDocMetadata(syntheticQt);
    expect(qMeta.category).toBe('WrongCategory');
    expect(qMeta.pageTitle).toBe('WrongTitle');
    expect(qMeta.tocItems[0].id).toBe('preview');
  });
});
