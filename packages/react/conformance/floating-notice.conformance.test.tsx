import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  floatingNoticeSchema,
  floatingNoticeItemSchema,
  floatingNoticePlacementSchema,
  floatingNoticeLevelSchema,
} from '@chahu/spec/floating-notice';

describe('FloatingNotice conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      notices: [
        {
          id: 'test-1',
          title: 'Test notice',
          description: 'Detailed description',
          level: 'info',
          priority: 10,
          duration: 3000,
          closable: true,
          icon: 'check',
        },
      ],
      placement: 'top',
      offset: 16,
      defaultDuration: 3000,
      pauseOnHover: true,
      zoomOnHover: true,
      closable: true,
    } as const;

    expect(() => floatingNoticeSchema.parse(fixture)).not.toThrow();

    const defaultParsed = floatingNoticeSchema.parse({});
    expect(defaultParsed.placement).toBe('top');
    expect(defaultParsed.offset).toBe(16);
    expect(defaultParsed.defaultDuration).toBe(3000);
    expect(defaultParsed.pauseOnHover).toBe(true);
    expect(defaultParsed.zoomOnHover).toBe(true);
    expect(defaultParsed.closable).toBe(true);
    expect(defaultParsed.notices).toEqual([]);

    for (const p of ['top', 'bottom'] as const) {
      expect(() => floatingNoticePlacementSchema.parse(p)).not.toThrow();
    }

    for (const l of ['default', 'info', 'warning', 'error'] as const) {
      expect(() => floatingNoticeLevelSchema.parse(l)).not.toThrow();
      expect(() => floatingNoticeItemSchema.parse({ id: '1', level: l })).not.toThrow();
    }
  });

  it('rejects invalid level and placement', () => {
    expect(() =>
      floatingNoticeSchema.parse({
        placement: 'invalid-placement',
      })
    ).toThrow();

    expect(() =>
      floatingNoticeItemSchema.parse({
        id: 'bad',
        level: 'unknown-level',
      })
    ).toThrow();
  });

  it('declares capability conformance in packages/react/conformance/coverage.json', () => {
    const coveragePath = resolve(__dirname, 'coverage.json');
    expect(existsSync(coveragePath)).toBe(true);
    const coverage = JSON.parse(readFileSync(coveragePath, 'utf8'));
    expect(coverage.floatingNotice).toBeDefined();
    expect(coverage.floatingNotice.placement).toBe(true);
    expect(coverage.floatingNotice.priority).toBe(true);
    expect(coverage.floatingNotice.levels).toBe(true);
    expect(coverage.floatingNotice.queueDots).toBe(true);
    expect(coverage.floatingNotice.hoverPause).toBe(true);
    expect(coverage.floatingNotice.hoverZoom).toBe(true);
    expect(coverage.floatingNotice.dismissible).toBe(true);
    expect(coverage.floatingNotice.customContent).toBe(true);
  });
});
