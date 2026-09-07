import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { draggableModalSchema } from '@chahu/spec/draggable-modal';

describe('DraggableModal conformance (spec contract)', () => {
  it('accepts valid fixtures that satisfy spec contract', () => {
    expect(() => draggableModalSchema.parse({})).not.toThrow();
    const parsed = draggableModalSchema.parse({ defaultWidth: 600 });
    expect(parsed.defaultWidth).toBe(600);
    expect(parsed.showEscBadge).toBe(false);
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) return;
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      draggableModal?: Record<string, boolean>;
    };
    expect(coverage.draggableModal?.dragMove).toBe(true);
    expect(coverage.draggableModal?.resizeBounds).toBe(true);
  });
});
