import * as React from 'react';
import { bench, describe } from 'vitest';
import { render } from '@testing-library/react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Resizable,
  ScrollBar,
  SegmentedControl,
  SettingRow,
  Sidebar,
  Splitter,
  SplitterHandle,
  TableOfContents,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  WindowTitleBar,
  ViewportConstrainedContainer,
} from '../src';

describe('Performance Suite: Layout & Navigation (12 Components)', () => {
  bench('Collapsible (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <Collapsible key={i}>
            <CollapsibleTrigger>Toggle {i}</CollapsibleTrigger>
            <CollapsibleContent>Content {i}</CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    );
    unmount();
  });

  bench('Resizable (20x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <Resizable key={i} defaultSize={{ width: 200, height: 100 }}>
            <div>Resizable {i}</div>
          </Resizable>
        ))}
      </div>
    );
    unmount();
  });

  bench('ScrollBar (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <ScrollBar key={i} orientation="vertical" />
        ))}
      </div>
    );
    unmount();
  });

  bench('SegmentedControl (50x batch mount)', () => {
    const options = [
      { value: 'all', label: 'All' },
      { value: 'active', label: 'Active' },
    ];
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <SegmentedControl key={i} options={options} defaultValue="all" />
        ))}
      </div>
    );
    unmount();
  });

  bench('SettingRow (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <SettingRow key={i} name={`Setting ${i}`} description="Description" />
        ))}
      </div>
    );
    unmount();
  });

  bench('Sidebar (20x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <Sidebar key={i}>
            <div>Sidebar content {i}</div>
          </Sidebar>
        ))}
      </div>
    );
    unmount();
  });

  bench('Splitter (20x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <Splitter key={i} orientation="horizontal">
            <div>Panel Left {i}</div>
            <div>Panel Right {i}</div>
          </Splitter>
        ))}
      </div>
    );
    unmount();
  });

  bench('SplitterHandle (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <SplitterHandle key={i} orientation="vertical" />
        ))}
      </div>
    );
    unmount();
  });

  bench('TableOfContents (30x batch mount)', () => {
    const items = [
      { id: 'sec-1', title: 'Section 1' },
      { id: 'sec-2', title: 'Section 2' },
    ];
    const { unmount } = render(
      <div>
        {Array.from({ length: 30 }, (_, i) => (
          <TableOfContents key={i} items={items} activeId="sec-1" />
        ))}
      </div>
    );
    unmount();
  });

  bench('Tabs (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <Tabs key={i} defaultValue="tab1">
            <TabsList>
              <TabsTrigger value="tab1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab1">Content 1</TabsContent>
            <TabsContent value="tab2">Content 2</TabsContent>
          </Tabs>
        ))}
      </div>
    );
    unmount();
  });

  bench('WindowTitleBar (30x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 30 }, (_, i) => (
          <WindowTitleBar key={i} title={`Window Title ${i}`} />
        ))}
      </div>
    );
    unmount();
  });

  bench('ViewportConstrainedContainer (30x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 30 }, (_, i) => (
          <ViewportConstrainedContainer key={i}>
            <div>Constrained child {i}</div>
          </ViewportConstrainedContainer>
        ))}
      </div>
    );
    unmount();
  });
});
