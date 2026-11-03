import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { ActivityStack, ActivityCard, type ActivityStackEntry } from './index';

describe('ActivityStack & ActivityCard', () => {
  it('renders ActivityCard with tone, title, detail, and dismiss', () => {
    const handleDismiss = vi.fn();
    render(
      <ActivityCard
        itemId="card-1"
        icon={<span>Icon</span>}
        tone="warning"
        title="Sync In Progress"
        detail="Uploading local delta"
        meta="2.4s"
        progress={0.5}
        onDismiss={handleDismiss}
        dismissLabel="Dismiss sync"
      />,
    );

    expect(screen.getByText('Sync In Progress')).toBeInTheDocument();
    expect(screen.getByText('Uploading local delta')).toBeInTheDocument();
    expect(screen.getByText('2.4s')).toBeInTheDocument();
    expect(screen.getByTestId('activity-progress-card-1')).toBeInTheDocument();

    const dismissBtn = screen.getByRole('button', { name: 'Dismiss sync' });
    fireEvent.click(dismissBtn);
    expect(handleDismiss).toHaveBeenCalledTimes(1);
  });

  it('renders indeterminate progress bar when indeterminate is true', () => {
    render(
      <ActivityCard
        itemId="card-indet"
        icon={<span>Icon</span>}
        title="Indexing Ast"
        indeterminate
      />,
    );
    expect(screen.getByTestId('activity-indeterminate-card-indet')).toBeInTheDocument();
  });

  it('renders ActivityStack with placement, entries, and labelled region', () => {
    const entries: ActivityStackEntry[] = [
      {
        id: 'entry-1',
        node: <ActivityCard itemId="entry-1" icon={<span>1</span>} title="Item One" />,
      },
      {
        id: 'entry-2',
        node: <ActivityCard itemId="entry-2" icon={<span>2</span>} title="Item Two" />,
      },
    ];

    render(
      <ActivityStack
        entries={entries}
        placement="bottom-right"
        label="Test Activity Stack"
      />,
    );

    const region = screen.getByRole('region', { name: 'Test Activity Stack' });
    expect(region).toHaveAttribute('data-placement', 'bottom-right');
    expect(screen.getByText('Item One')).toBeInTheDocument();
    expect(screen.getByText('Item Two')).toBeInTheDocument();
  });

  it('shows overflow pill when entries exceed maxVisible', () => {
    const entries: ActivityStackEntry[] = [
      { id: '1', node: <ActivityCard itemId="1" icon={<span>1</span>} title="Card 1" /> },
      { id: '2', node: <ActivityCard itemId="2" icon={<span>2</span>} title="Card 2" /> },
      { id: '3', node: <ActivityCard itemId="3" icon={<span>3</span>} title="Card 3" /> },
      { id: '4', node: <ActivityCard itemId="4" icon={<span>4</span>} title="Card 4" /> },
    ];

    render(
      <ActivityStack
        entries={entries}
        maxVisible={2}
        placement="bottom-right"
        label="Overflow Stack"
      />,
    );

    const overflowBtn = screen.getByTestId('activity-stack-overflow');
    expect(overflowBtn).toBeInTheDocument();
    expect(screen.getByText(/2 more items/i)).toBeInTheDocument();
  });

  it('collapses stack into summary row and toggles back', () => {
    const entries: ActivityStackEntry[] = [
      { id: '1', node: <ActivityCard itemId="1" icon={<span>1</span>} title="Job 1" /> },
      { id: '2', node: <ActivityCard itemId="2" icon={<span>2</span>} title="Job 2" /> },
    ];

    render(
      <ActivityStack
        entries={entries}
        collapsible
        defaultCollapsed
        placement="bottom-right"
        label="Collapsible Stack"
        summaryLabel="jobs running"
      />,
    );

    const toggle = screen.getByTestId('activity-stack-toggle');
    expect(toggle).toBeInTheDocument();
    expect(screen.getByText(/2 items jobs running/i)).toBeInTheDocument();

    fireEvent.click(toggle);
    expect(screen.getByText('Job 1')).toBeInTheDocument();
    expect(screen.getByText('Job 2')).toBeInTheDocument();
  });
});
