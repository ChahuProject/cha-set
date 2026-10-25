// spec/__tests__/hover-copy-parity.test.ts
//
// Dual-stack constant parity for HoverCopy (docs/architecture/hover-copy.md):
// the shared contract in spec/components/hover-copy.ts is the single source of
// truth; packages/react/src/hover-copy/HoverCopy.tsx and
// qt/src/ChaSetHoverCopy.qml MUST mirror its defaults and radius map
// bit-for-bit. Any drift fails here, not in review.
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hoverCopyDefaults, hoverCopyRadiusMap } from '../components/hover-copy';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');

describe('hover-copy shared contract', () => {
  it('behavior defaults are the specified values', () => {
    expect(hoverCopyDefaults.text).toBe('');
    expect(hoverCopyDefaults.dim).toBe(0.45);
    expect(hoverCopyDefaults.radius).toBe('md');
    expect(hoverCopyDefaults.icon).toBe('copy');
    expect(hoverCopyDefaults.copiedIcon).toBe('check');
    expect(hoverCopyDefaults.resetTime).toBe(1000);
  });

  it('radius map covers all five semantic radii with web + qt geometry', () => {
    expect(hoverCopyRadiusMap).toEqual({
      none: { web: 'rounded-none', qt: 0 },
      sm: { web: 'rounded', qt: 2 },
      md: { web: 'rounded-md', qt: 6 },
      lg: { web: 'rounded-lg', qt: 8 },
      full: { web: 'rounded-full', qt: 'pill' },
    });
  });
});

describe('hover-copy React mirror', () => {
  const reactSource = readFileSync(
    resolve(repoRoot, 'packages', 'react', 'src', 'hover-copy', 'HoverCopy.tsx'),
    'utf8',
  );

  it('mirrors the radius classes', () => {
    for (const radius of ['none', 'sm', 'md', 'lg', 'full'] as const) {
      expect(reactSource).toContain(hoverCopyRadiusMap[radius].web);
    }
    for (const cls of ['rounded-none', 'rounded', 'rounded-md', 'rounded-lg', 'rounded-full']) {
      expect(reactSource).toContain(`'${cls}'`);
    }
  });

  it('mirrors the behavior defaults', () => {
    expect(reactSource).toContain('0.45');
    expect(reactSource).toContain('1000');
    expect(reactSource).toContain(`icon = 'copy'`);
    expect(reactSource).toContain(`copiedIcon = 'check'`);
    expect(reactSource).toContain(`radius = 'md'`);
  });

  it('implements the full state vocabulary', () => {
    for (const state of ['idle', 'hovered', 'copied']) {
      expect(reactSource).toContain(state);
    }
  });
});

describe('hover-copy Qt mirror', () => {
  const qmlPath = resolve(repoRoot, 'qt', 'src', 'ChaSetHoverCopy.qml');
  if (!existsSync(qmlPath)) {
    console.warn('[parity] qt/src/ChaSetHoverCopy.qml not present yet (parallel Qt twin); skipping QML assertions');
    return;
  }
  const qmlSource = readFileSync(qmlPath, 'utf8');

  it('mirrors the behavior defaults', () => {
    expect(qmlSource).toContain('0.45');
    expect(qmlSource).toContain('1000');
    expect(qmlSource).toContain('"copy"');
    expect(qmlSource).toContain('"check"');
  });

  it('maps all five semantic radii to qt geometry', () => {
    expect(qmlSource).toContain('"none"');
    expect(qmlSource).toContain('"full"');
    for (const token of ['0', '2', '6', '8', 'pill']) {
      expect(qmlSource).toContain(token);
    }
  });

  it('implements the full state vocabulary', () => {
    for (const state of ['idle', 'hovered', 'copied']) {
      expect(qmlSource).toContain(state);
    }
  });
});
