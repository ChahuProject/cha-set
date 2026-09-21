import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSettings } from './LanguageSettings';
import { registerLocale, setLocalePreference } from '../i18n';

describe('LanguageSettings', () => {
  it('renders Follow System option and fixed language cards', () => {
    render(<LanguageSettings preference="system" />);

    expect(screen.getByText(/Language Preference|语言偏好/i)).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Follow System|跟随系统/i })).toBeInTheDocument();
    expect(screen.getByText('简体中文')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('triggers onPreferenceChange when selecting a language card', () => {
    const handleChange = vi.fn();
    render(<LanguageSettings preference="system" onPreferenceChange={handleChange} />);

    const zhCard = screen.getByRole('radio', { name: /简体中文/i });
    fireEvent.click(zhCard);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('zh-CN');
  });

  it('dynamically displays user-registered custom language', () => {
    registerLocale(
      {
        code: 'ja-JP',
        nativeName: '日本語',
        englishName: 'Japanese',
        quote: { text: '古池や 蛙飛びこむ 水の音', author: '松尾芭蕉' },
      },
      {
        theme: { mode: { light: 'ライト' } },
        language: { title: '言語設定' },
      }
    );

    render(<LanguageSettings preference="system" />);
    expect(screen.getByText('日本語')).toBeInTheDocument();
    expect(screen.getByText('ja-JP')).toBeInTheDocument();
    expect(screen.getByText(/古池や 蛙飛びこむ 水の音/i)).toBeInTheDocument();
  });
});
