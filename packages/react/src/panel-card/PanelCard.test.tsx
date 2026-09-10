import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  PanelCard,
  PanelCardHeader,
  PanelCardContent,
  PanelCardFooter,
} from './PanelCard';

describe('PanelCard', () => {
  it('renders standard card structure with header, content, and footer', () => {
    render(
      <PanelCard>
        <PanelCardHeader
          title="Server Settings"
          description="Manage configuration"
          action={<button type="button">Edit</button>}
        />
        <PanelCardContent>Card Content Body</PanelCardContent>
        <PanelCardFooter>Footer info</PanelCardFooter>
      </PanelCard>,
    );

    expect(screen.getByText('Server Settings')).toBeInTheDocument();
    expect(screen.getByText('Manage configuration')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Card Content Body')).toBeInTheDocument();
    expect(screen.getByText('Footer info')).toBeInTheDocument();
  });

  it('renders with compact size sm variant', () => {
    const { container } = render(
      <PanelCard size="sm">
        <PanelCardContent>Compact Content</PanelCardContent>
      </PanelCard>,
    );

    const card = container.querySelector('[data-slot="panel-card"]');
    expect(card).toHaveAttribute('data-size', 'sm');
  });

  it('supports convenience props and collapsible toggling', () => {
    const onCollapsedChange = vi.fn();
    const { rerender } = render(
      <PanelCard
        title="Diagnostics"
        badgeText="Active"
        collapsible
        defaultCollapsed={false}
        onCollapsedChange={onCollapsedChange}
      >
        <span>Telemetry Data</span>
      </PanelCard>,
    );

    expect(screen.getByText('Diagnostics')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Telemetry Data')).toBeInTheDocument();

    const toggleBtn = screen.getByRole('button', { name: 'Collapse panel' });
    fireEvent.click(toggleBtn);
    expect(onCollapsedChange).toHaveBeenCalledWith(true);
    expect(screen.queryByText('Telemetry Data')).not.toBeInTheDocument();
  });
});
