import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  dialogSchema,
  dialogTriggerSchema,
  dialogContentSchema,
  dialogHeaderSchema,
  dialogTitleSchema,
  dialogDescriptionSchema,
  dialogFooterSchema,
  dialogCloseSchema,
} from '@chahu/spec/dialog';

describe('Dialog conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const rootFixture = {
      open: false,
      title: 'Modal Title',
      description: 'Modal description text',
    } as const;
    expect(() => dialogSchema.parse(rootFixture)).not.toThrow();

    const defaultParsed = dialogSchema.parse({});
    expect(defaultParsed.open).toBe(false);

    const triggerFixture = {
      asChild: false,
      disabled: false,
    } as const;
    expect(() => dialogTriggerSchema.parse(triggerFixture)).not.toThrow();

    const contentFixture = {
      customRadius: 8,
      size: 'lg' as const,
      closeOnOverlayClick: true,
      closeOnEscape: true,
    } as const;
    const parsedContent = dialogContentSchema.parse(contentFixture);
    expect(parsedContent.draggable).toBe(true);
    expect(parsedContent.showCloseButton).toBe(true);
    expect(parsedContent.showEscBadge).toBe(true);
    expect(parsedContent.size).toBe('lg');
    expect(parsedContent.closeOnOverlayClick).toBe(true);
    expect(parsedContent.closeOnEscape).toBe(true);

    const desktopContentFixture = {
      draggable: true,
      showCloseButton: true,
      showEscBadge: true,
      defaultWidthRem: 36,
      defaultHeightRem: 24,
      minWidthRem: 20,
      minHeightRem: 15,
      initialPositionMode: 'top' as const,
      topMarginRem: 4.5,
      autoFitHeight: true,
      sizeOptions: [
        { name: '默认', special: 'default' as const },
        { name: '宽屏', widthRem: 42, heightRem: 28 },
      ],
      sizeMenuTooltip: '切换窗口尺寸',
      dragHandleClassName: 'custom-dialog-header',
      contentClassName: 'custom-dialog-body',
      内容类名: 'custom-dialog-body-cn',
    };
    expect(() => dialogContentSchema.parse(desktopContentFixture)).not.toThrow();

    expect(() => dialogHeaderSchema.parse({})).not.toThrow();
    expect(() => dialogTitleSchema.parse({})).not.toThrow();
    expect(() => dialogDescriptionSchema.parse({})).not.toThrow();
    expect(() => dialogFooterSchema.parse({})).not.toThrow();
    expect(() => dialogFooterSchema.parse({ showCloseButton: true })).not.toThrow();
    expect(() => dialogCloseSchema.parse({})).not.toThrow();
  });

  it('rejects invalid types per the contract', () => {
    expect(() => dialogSchema.parse({ open: 'not-a-boolean' })).toThrow();
    expect(() => dialogContentSchema.parse({ draggable: 'not-a-bool' })).toThrow();
    expect(() => dialogContentSchema.parse({ initialPositionMode: 'invalid-mode' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      dialog?: Record<string, boolean>;
    };
    if (!coverage.dialog) {
      console.warn('[conformance] coverage.json has no dialog entry yet; skipping earned-capability assertions');
      return;
    }
    for (const cap of ['open', 'portal', 'overlay', 'closeButton', 'escapeKey', 'size'] as const) {
      expect(coverage.dialog?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
