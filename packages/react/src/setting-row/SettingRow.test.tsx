import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SettingRow } from './SettingRow';

describe('SettingRow', () => {
  it('renders name, description, and children controls', () => {
    render(
      <SettingRow
        name="Hardware Acceleration"
        description="Enable GPU-accelerated rasterization"
      >
        <button type="button">Toggle</button>
      </SettingRow>
    );

    expect(screen.getByText('Hardware Acceleration')).toBeInTheDocument();
    expect(screen.getByText('Enable GPU-accelerated rasterization')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Toggle' })).toBeInTheDocument();
  });

  it('renders icon and badge when provided', () => {
    render(
      <SettingRow
        name="Developer Mode"
        icon={<span data-testid="dev-icon">⚙</span>}
        badge="Beta"
      />
    );

    expect(screen.getByTestId('dev-icon')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('triggers highlight ring when highlightTarget matches highlightId', () => {
    const { container } = render(
      <SettingRow
        name="Sound Output"
        highlightId="sound"
        highlightTarget="sound"
      />
    );

    const row = container.querySelector('#sound');
    expect(row).toHaveClass('ring-2');
    expect(row).toHaveClass('animate-pulse');
  });

  it('supports size variant sm', () => {
    const { container } = render(
      <SettingRow
        name="Compact Item"
        size="sm"
      />
    );

    const row = container.querySelector('[data-slot="setting-row"]');
    expect(row).toHaveAttribute('data-size', 'sm');
    expect(row).toHaveClass('py-2');
  });

  it('applies disabled styling when disabled is true', () => {
    const { container } = render(
      <SettingRow
        name="Disabled Item"
        disabled
      />
    );

    const row = container.querySelector('[data-slot="setting-row"]');
    expect(row).toHaveClass('opacity-50');
    expect(row).toHaveClass('pointer-events-none');
  });
});
