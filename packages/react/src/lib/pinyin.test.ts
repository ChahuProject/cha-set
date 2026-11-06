// packages/react/src/lib/pinyin.test.ts
import { describe, it, expect } from 'vitest';
import { matchPinyin, lookupSyllable } from './pinyin';

describe('matchPinyin', () => {
  it('handles lookupSyllable', () => {
    const s = lookupSyllable('位'.codePointAt(0)!);
    expect(s).not.toBeNull();
    expect(s![0]).toBe('wei');
    expect(s![1]).toBe('w');
  });

  it('matches direct substrings', () => {
    expect(matchPinyin('Button', 'butt')).toBe(true);
    expect(matchPinyin('Card', 'card')).toBe(true);
    expect(matchPinyin('位置', '位置')).toBe(true);
  });

  it('matches standard full pinyin', () => {
    expect(matchPinyin('位置', 'weizhi')).toBe(true);
    expect(matchPinyin('按钮', 'anniu')).toBe(true);
    expect(matchPinyin('卡片', 'kapian')).toBe(true);
  });

  it('matches pinyin initials', () => {
    expect(matchPinyin('位置', 'wz')).toBe(true);
    expect(matchPinyin('按钮', 'an')).toBe(true);
    expect(matchPinyin('卡片', 'kp')).toBe(true);
    expect(matchPinyin('工作流', 'gzl')).toBe(true);
    expect(matchPinyin('五星', 'wx')).toBe(true);
    expect(matchPinyin('零星', 'lx')).toBe(true);
  });

  it('matches Xiaohe double pinyin', () => {
    // 位置 -> w (wei) + v (zhi) -> wv, wwvi
    expect(matchPinyin('位置', 'wv')).toBe(true);
    expect(matchPinyin('位置', 'wwvi')).toBe(true);
  });

  it('matches mixed text and prefix', () => {
    expect(matchPinyin('Buttons (按钮)', 'an')).toBe(true);
    expect(matchPinyin('1星 (未评级)', '1')).toBe(true);
  });

  it('returns false for non-matching queries', () => {
    expect(matchPinyin('位置', 'xyz')).toBe(false);
    expect(matchPinyin('按钮', 'kp')).toBe(false);
  });
});
