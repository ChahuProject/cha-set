import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SplitButton } from './SplitButton';

describe('SplitButton', () => {
  it('triggers main action on main button click', () => {
    const onMainClick = vi.fn();
    render(
      <SplitButton onClick={onMainClick}>
        Run Task
      </SplitButton>,
    );

    const mainBtn = screen.getByRole('button', { name: 'Run Task' });
    fireEvent.click(mainBtn);

    expect(onMainClick).toHaveBeenCalledTimes(1);
  });

  it('opens dropdown menu with options when chevron is clicked', async () => {
    const onItemClick = vi.fn();
    render(
      <SplitButton
        onClick={() => {}}
        items={[
          { key: 'debug', label: 'Run with Debugger', onClick: onItemClick },
          { key: 'profile', label: 'Run with Profiler', separator: true },
        ]}
      >
        Run
      </SplitButton>,
    );

    const chevronBtn = screen.getByRole('button', { name: 'Show more options' });
    fireEvent.click(chevronBtn);

    await waitFor(() => {
      expect(screen.getByText('Run with Debugger')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Run with Debugger'));
    expect(onItemClick).toHaveBeenCalledTimes(1);
  });
});
