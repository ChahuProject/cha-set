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
    expect(parsed.initialPositionMode).toBe('center');
    expect(parsed.topMargin).toBe(72);
    expect(parsed.remBase).toBe(16);

    const customParsed = draggableModalSchema.parse({
      initialPositionMode: 'top',
      topMargin: 80,
      sizeOptions: [
        { name: '默认', special: 'default' },
        { name: '紧凑', widthRem: 24, heightRem: 18 },
        { name: '全窗口', special: '全窗口' },
      ],
      sizeMenuTooltip: '调整尺寸',
      remBase: 16,
    });
    expect(customParsed.initialPositionMode).toBe('top');
    expect(customParsed.topMargin).toBe(80);
    expect(customParsed.sizeOptions).toHaveLength(3);
    expect(customParsed.sizeOptions?.[0].special).toBe('default');
    expect(customParsed.sizeOptions?.[1].widthRem).toBe(24);
    expect(customParsed.sizeMenuTooltip).toBe('调整尺寸');
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
