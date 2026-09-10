import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { smoothWheelHandlerSchema } from '@chahu/spec/smooth-wheel-handler';

describe('SmoothWheelHandler conformance (spec contract)', () => {
  it('accepts a props fixture that satisfies the spec contract', () => {
    const fixture = {
      scrollOrientation: 'vertical',
      mapVerticalToHorizontal: false,
      speedMultiplier: 1.2,
      duration: 200,
      fixedStepSize: 0,
      consumeEvent: true,
      easingType: 'out-cubic',
    } as const;
    expect(() => smoothWheelHandlerSchema.parse(fixture)).not.toThrow();
  });

  it('rejects invalid orientation per the contract', () => {
    expect(() => smoothWheelHandlerSchema.parse({ scrollOrientation: 'diagonal' })).toThrow();
  });

  it('earned coverage declares must capabilities', () => {
    const file = resolve(import.meta.dirname, 'coverage.json');
    if (!existsSync(file)) {
      console.warn('[conformance] coverage.json not present yet; skipping earned-capability assertions');
      return;
    }
    const coverage = JSON.parse(readFileSync(file, 'utf8')) as {
      smoothWheelHandler?: Record<string, boolean>;
    };
    for (const cap of ['kinematics', 'orientation', 'interactionMutex'] as const) {
      expect(coverage.smoothWheelHandler?.[cap], `capability "${cap}" must be earned`).toBe(true);
    }
  });
});
