import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeSettings, DEFAULT_THEME_CONFIG } from './ThemeSettings';
import type { ThemeConfig } from '@chahu/spec/theme-settings';

describe('ThemeSettings', () => {
  it('renders standard setting sections with default configuration', () => {
    render(<ThemeSettings />);

    expect(screen.getByText('Theme Configuration')).toBeInTheDocument();
    expect(screen.getByText('Appearance Mode')).toBeInTheDocument();
    expect(screen.getByText('Accent Palette')).toBeInTheDocument();
    expect(screen.getByText('Interface Style')).toBeInTheDocument();
    expect(screen.getByText('Decoration Level')).toBeInTheDocument();
    expect(screen.getByText('Interface Scale')).toBeInTheDocument();
  });

  it('triggers onChange when switching appearance mode', () => {
    const handleChange = vi.fn();
    render(<ThemeSettings config={DEFAULT_THEME_CONFIG} onChange={handleChange} />);

    // Click dark mode button
    const darkBtn = screen.getByRole('radio', { name: /Dark/i });
    fireEvent.click(darkBtn);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'dark',
      })
    );
  });

  it('triggers onChange when selecting a canonical palette preset', () => {
    const handleChange = vi.fn();
    render(<ThemeSettings config={DEFAULT_THEME_CONFIG} onChange={handleChange} />);

    const redBtn = screen.getByTitle('Red');
    fireEvent.click(redBtn);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        palette: expect.objectContaining({ id: 'red' }),
      })
    );
  });

  it('reverts configuration on reset button click', () => {
    const handleChange = vi.fn();
    const handleReset = vi.fn();
    const modifiedConfig: ThemeConfig = {
      ...DEFAULT_THEME_CONFIG,
      mode: 'dark',
      decoration: { styleId: 'expressive', level: 90, overrides: {} },
    };

    render(
      <ThemeSettings
        config={modifiedConfig}
        onChange={handleChange}
        onReset={handleReset}
      />
    );

    const resetBtn = screen.getByRole('button', { name: 'Reset' });
    fireEvent.click(resetBtn);

    expect(handleReset).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(DEFAULT_THEME_CONFIG);
  });

  it('exports valid JSON configuration', () => {
    const handleExport = vi.fn();
    render(
      <ThemeSettings
        config={DEFAULT_THEME_CONFIG}
        onExport={handleExport}
      />
    );

    const exportBtn = screen.getByRole('button', { name: 'Export JSON' });
    fireEvent.click(exportBtn);

    expect(handleExport).toHaveBeenCalledTimes(1);
    const exportedJson = JSON.parse(handleExport.mock.calls[0]![0]);
    expect(exportedJson.version).toBe(1);
    expect(exportedJson.mode).toBe('system');
  });

  it('respects disabled prop', () => {
    const handleChange = vi.fn();
    const { container } = render(
      <ThemeSettings
        config={DEFAULT_THEME_CONFIG}
        onChange={handleChange}
        disabled={true}
      />
    );

    const root = container.querySelector('[data-slot="theme-settings"]');
    expect(root).toHaveClass('opacity-60');
    expect(root).toHaveClass('pointer-events-none');
  });
});
