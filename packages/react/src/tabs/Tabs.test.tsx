import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';

describe('Tabs Component', () => {
  it('renders tab list, triggers and default active content', () => {
    render(
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account Content</TabsContent>
        <TabsContent value="password">Password Content</TabsContent>
      </Tabs>,
    );

    expect(screen.getByRole('tab', { name: 'Account' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Password' })).toBeInTheDocument();
    expect(screen.getByText('Account Content')).toBeInTheDocument();
    expect(screen.queryByText('Password Content')).not.toBeInTheDocument();
  });

  it('switches active tab and content on click (selection capability)', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );

    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

    expect(screen.queryByText('Content 1')).not.toBeInTheDocument();
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('navigates between tabs with keyboard arrow keys', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    tab1.focus();
    expect(tab1).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    expect(tab2).toHaveFocus();
  });

  it('blocks interaction on disabled tab (disabled capability)', async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );

    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    expect(tab2).toHaveAttribute('aria-disabled', 'true');

    await user.click(tab2);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    expect(screen.queryByText('Content 2')).not.toBeInTheDocument();
  });

  it('supports orientation prop', () => {
    const { container } = render(
      <Tabs defaultValue="tab1" orientation="vertical">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>,
    );

    const tabList = container.querySelector('[role="tablist"]');
    expect(tabList).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('applies visual styling and force states for testing hooks', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1" forceActive>Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" forceHover>Tab 2</TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
    expect(tab1.className).toContain('bg-background');

    const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
    expect(tab2.className).toContain('text-foreground');
  });

  it('supports variant="line" with underline styling and trigger gap', () => {
    render(
      <Tabs defaultValue="tab1" variant="line">
        <TabsList data-testid="tabs-list">
          <TabsTrigger value="tab1" data-testid="trigger-1">
            <svg data-testid="tab-icon" />
            Tab 1
          </TabsTrigger>
        </TabsList>
      </Tabs>,
    );

    const list = screen.getByTestId('tabs-list');
    expect(list).toHaveAttribute('data-variant', 'line');
    expect(list.className).toContain('border-b');

    const trigger = screen.getByTestId('trigger-1');
    expect(trigger).toHaveAttribute('data-variant', 'line');
    expect(trigger.className).toContain('gap-1.5');
    expect(trigger.className).toContain('border-b-2');
  });
});
