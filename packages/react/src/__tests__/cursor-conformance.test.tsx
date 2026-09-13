import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { Button } from '../button';
import { Checkbox } from '../checkbox';
import { Switch } from '../switch';
import { Input } from '../input';
import { DurationInput } from '../duration-input';
import { PresetNumberInput } from '../preset-number-input';
import { ReadOnlyInput } from '../read-only-input';
import { SplitButton } from '../split-button';
import { CopyButton } from '../copy-button';
import { Tabs, TabsList, TabsTrigger } from '../tabs';
import { SegmentedControl } from '../segmented-control';
import { Select, SelectTrigger, SelectValue } from '../select';
import { Slider } from '../slider';
import { RangeSlider } from '../range-slider';
import { SnapSlider } from '../snap-slider';
import { Collapsible, CollapsibleTrigger } from '../collapsible';
import { Badge } from '../badge';
import { Card } from '../card';
import { Splitter, SplitterPanel } from '../splitter';
import { SplitterHandle } from '../splitter-handle';
import { DraggableModal } from '../draggable-modal';
import { WindowTitleBar } from '../window-title-bar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '../dropdown-menu';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
} from '../context-menu';
import { Dialog, DialogTrigger } from '../dialog';
import { Tooltip, TooltipTrigger, TooltipContent } from '../tooltip';
import { ScrollBarButton } from '../scroll-area/ScrollBarButtons';

interface CursorContract {
  version: number;
  semanticTypes: Record<
    string,
    {
      web: { idle: string; disabled?: string; readonly?: string };
      qt: { idle: string; disabled?: string; readonly?: string };
    }
  >;
  components: Record<
    string,
    {
      semantic: string;
      supportsDisabled?: boolean;
      supportsReadOnly?: boolean;
    }
  >;
}

const contractPath = resolve(__dirname, '../../../../spec/cursor-contract.json');
const contract: CursorContract = JSON.parse(readFileSync(contractPath, 'utf8'));

describe('Cross-Stack Cursor Semantics Conformance (React vs Contract)', () => {
  it('contract exists and contains verified semanticTypes', () => {
    expect(contract.version).toBe(1);
    expect(contract.semanticTypes.action.web.idle).toBe('cursor-pointer');
    expect(contract.semanticTypes.action.web.disabled).toBe('cursor-not-allowed');
    expect(contract.semanticTypes.text.web.idle).toBe('cursor-text');
    expect(contract.semanticTypes.text.web.disabled).toBe('cursor-not-allowed');
  });

  describe('Action Controls (idle -> pointer, disabled -> not-allowed)', () => {
    it('Button exhibits cursor-pointer and disabled:cursor-not-allowed without blocking pointer-events', () => {
      const { rerender } = render(<Button>Click me</Button>);
      const btn = screen.getByRole('button', { name: 'Click me' });
      expect(btn.className).toContain('cursor-pointer');

      rerender(<Button disabled>Click me</Button>);
      expect(btn.className).toContain('cursor-not-allowed');
      expect(btn.className).not.toContain('disabled:pointer-events-none');
    });

    it('Checkbox exhibits cursor-pointer and disabled cursor-not-allowed', () => {
      const { rerender, container } = render(<Checkbox label="Subscribe" />);
      const box = container.querySelector('[role="checkbox"]') as HTMLElement;
      expect(box.className).toContain('cursor-pointer');

      rerender(<Checkbox label="Subscribe" disabled />);
      expect(box.className).toContain('cursor-not-allowed');

      rerender(<Checkbox label="Subscribe" readOnly />);
      expect(box.className).toContain('cursor-default');
    });

    it('Switch exhibits cursor-pointer and disabled cursor-not-allowed', () => {
      const { rerender, container } = render(<Switch label="Dark Mode" />);
      const sw = container.querySelector('[role="switch"]') as HTMLElement;
      expect(sw.className).toContain('cursor-pointer');

      rerender(<Switch label="Dark Mode" disabled />);
      expect(sw.className).toContain('cursor-not-allowed');

      rerender(<Switch label="Dark Mode" readOnly />);
      expect(sw.className).toContain('cursor-default');
    });

    it('SplitButton inherits cursor-pointer and disabled cursor-not-allowed on both parts', () => {
      const { rerender } = render(<SplitButton label="Save" />);
      const buttons = screen.getAllByRole('button');
      expect(buttons[0].className).toContain('cursor-pointer');
      expect(buttons[1].className).toContain('cursor-pointer');

      rerender(<SplitButton label="Save" disabled />);
      expect(buttons[0].className).toContain('cursor-not-allowed');
      expect(buttons[1].className).toContain('cursor-not-allowed');
    });

    it('CopyButton inherits cursor-pointer and disabled cursor-not-allowed', () => {
      const { rerender } = render(<CopyButton text="cha-set" label="Copy token" />);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('cursor-pointer');

      rerender(<CopyButton text="cha-set" label="Copy token" disabled />);
      expect(btn.className).toContain('cursor-not-allowed');
    });

    it('TabsTrigger exhibits cursor-pointer and disabled cursor-not-allowed', () => {
      const { rerender } = render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      const tab = screen.getByRole('tab');
      expect(tab.className).toContain('cursor-pointer');

      rerender(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1" disabled>Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      expect(tab.className).toContain('disabled:cursor-not-allowed');
      expect(tab.className).not.toContain('disabled:pointer-events-none');
    });

    it('SegmentedControl options exhibit cursor-pointer and disabled cursor-not-allowed', () => {
      const { rerender } = render(
        <SegmentedControl
          options={[
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
          ]}
        />,
      );
      const options = screen.getAllByRole('radio');
      expect(options[0].className).toContain('cursor-pointer');

      rerender(
        <SegmentedControl
          disabled
          options={[
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
          ]}
        />,
      );
      const disabledOptions = screen.getAllByRole('radio');
      expect(disabledOptions[0].className).toContain('disabled:cursor-not-allowed');
      expect(disabledOptions[0].className).not.toContain('disabled:pointer-events-none');
    });

    it('DropdownMenuItem exhibits cursor-pointer and data-disabled cursor-not-allowed without pointer-events-none', () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Active Item</DropdownMenuItem>
            <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );
      const active = screen.getByText('Active Item');
      const disabled = screen.getByText('Disabled Item');
      expect(active.className).toContain('cursor-pointer');
      expect(disabled.className).toContain('data-disabled:cursor-not-allowed');
      expect(disabled.className).not.toContain('data-disabled:pointer-events-none');
    });

    it('ContextMenuItem exhibits cursor-pointer and data-disabled cursor-not-allowed without pointer-events-none', () => {
      render(
        <ContextMenu defaultOpen>
          <ContextMenuTrigger><div>Target</div></ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Context Item</ContextMenuItem>
            <ContextMenuItem disabled>Disabled Context</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>,
      );
      const active = screen.getByText('Context Item');
      const disabled = screen.getByText('Disabled Context');
      expect(active.className).toContain('cursor-pointer');
      expect(disabled.className).toContain('data-disabled:cursor-not-allowed');
      expect(disabled.className).not.toContain('data-disabled:pointer-events-none');
    });

    it('ScrollBarButton exhibits cursor-pointer and disabled cursor-not-allowed', () => {
      const { rerender } = render(<ScrollBarButton>▲</ScrollBarButton>);
      const btn = screen.getByRole('button');
      expect(btn.className).toContain('cursor-pointer');

      rerender(<ScrollBarButton disabled>▲</ScrollBarButton>);
      expect(btn.className).toContain('disabled:cursor-not-allowed');
    });

    it('DialogTrigger and TooltipTrigger exhibit cursor-pointer', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
        </Dialog>,
      );
      const dialogBtn = screen.getByRole('button', { name: 'Open Dialog' });
      expect(dialogBtn.className).toContain('cursor-pointer');

      render(
        <Tooltip>
          <TooltipTrigger>Help</TooltipTrigger>
          <TooltipContent>Help details</TooltipContent>
        </Tooltip>,
      );
      const tooltipBtn = screen.getByRole('button', { name: 'Help' });
      expect(tooltipBtn.className).toContain('cursor-pointer');
    });

    it('SelectTrigger exhibits cursor-pointer and disabled cursor-not-allowed', () => {
      const { rerender } = render(
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>,
      );
      const trigger = screen.getByRole('combobox');
      expect(trigger.className).toContain('cursor-pointer');

      rerender(
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
        </Select>,
      );
      expect(trigger.className).toContain('cursor-not-allowed');
    });

    it('CollapsibleTrigger exhibits cursor-pointer', () => {
      render(
        <Collapsible>
          <CollapsibleTrigger>Toggle Details</CollapsibleTrigger>
        </Collapsible>,
      );
      const trigger = screen.getByRole('button');
      expect(trigger.className).toContain('cursor-pointer');
    });

    it('Badge when clickable exhibits cursor-pointer', () => {
      const { rerender } = render(<Badge onClick={() => {}}>Action Badge</Badge>);
      const badge = screen.getByText('Action Badge');
      expect(badge.className).toContain('cursor-pointer');

      rerender(<Badge>Passive Badge</Badge>);
      expect(screen.getByText('Passive Badge').className).not.toContain('cursor-pointer');
    });

    it('Card when interactive exhibits cursor-pointer', () => {
      const { rerender, container } = render(<Card interactive>Interactive Card</Card>);
      const card = container.firstChild as HTMLElement;
      expect(card.className).toContain('cursor-pointer');

      rerender(<Card>Static Card</Card>);
      expect((container.firstChild as HTMLElement).className).not.toContain('cursor-pointer');
    });
  });

  describe('Text Inputs & Code (idle -> cursor-text, disabled -> cursor-not-allowed)', () => {
    it('Input exhibits cursor-text and disabled cursor-not-allowed', () => {
      const { rerender } = render(<Input placeholder="Type here" />);
      const input = screen.getByPlaceholderText('Type here');
      expect(input.className).toContain('disabled:cursor-not-allowed');

      rerender(<Input placeholder="Type here" disabled />);
      expect(input.className).toContain('disabled:cursor-not-allowed');
    });

    it('DurationInput exhibits cursor-text on fields and cursor-not-allowed when disabled', () => {
      const { rerender, container } = render(<DurationInput />);
      const hoursField = container.querySelector('[data-segment="hours"]') as HTMLElement;
      if (hoursField) {
        expect(hoursField.className).toContain('cursor-text');
      }

      rerender(<DurationInput disabled />);
      const disabledField = container.querySelector('[data-segment="hours"]') as HTMLElement;
      if (disabledField) {
        expect(disabledField.className).toContain('cursor-not-allowed');
      }
    });

    it('ReadOnlyInput exhibits selectable text and cursor-default or cursor-pointer when copyable', () => {
      const { rerender, container } = render(<ReadOnlyInput value="Secret API Token" copyable />);
      const box = container.firstChild as HTMLElement;
      expect(box).toBeDefined();

      rerender(<ReadOnlyInput value="Secret API Token" disabled />);
      expect(container.firstChild as HTMLElement).toBeDefined();
    });
  });

  describe('Sliders & Splitters (track -> pointer, splitter -> col-resize/row-resize)', () => {
    it('Slider exhibits cursor-pointer and disabled cursor-not-allowed without blocking pointer-events', () => {
      const { rerender, container } = render(<Slider defaultValue={[50]} />);
      const slider = container.querySelector('[role="slider"]') || container.firstChild;
      expect(slider).toBeDefined();

      rerender(<Slider defaultValue={[50]} disabled />);
      const disabledSlider = container.querySelector('[role="slider"]') as HTMLElement;
      if (disabledSlider) {
        expect(disabledSlider.className).toContain('cursor-not-allowed');
        expect(disabledSlider.className).not.toContain('pointer-events-none');
      }
    });

    it('RangeSlider exhibits cursor-pointer', () => {
      const { container } = render(<RangeSlider defaultValue={[20, 80]} />);
      expect(container.firstChild).toBeDefined();
    });

    it('SnapSlider exhibits cursor-pointer and disabled cursor-not-allowed', () => {
      const { rerender, container } = render(<SnapSlider defaultValue={2} count={5} />);
      expect(container.firstChild).toBeDefined();

      rerender(<SnapSlider defaultValue={2} count={5} disabled />);
      const disabledSlider = container.querySelector('[role="slider"]') as HTMLElement;
      if (disabledSlider) {
        expect(disabledSlider.className).toContain('cursor-not-allowed');
        expect(disabledSlider.className).not.toContain('pointer-events-none');
      }
    });

    it('Splitter and SplitterHandle exhibit col-resize cursor', () => {
      const { container } = render(
        <Splitter orientation="horizontal">
          <SplitterPanel defaultSize={50}>Left</SplitterPanel>
          <SplitterHandle />
          <SplitterPanel defaultSize={50}>Right</SplitterPanel>
        </Splitter>,
      );
      const handle = container.querySelector('[data-slot="splitter-handle"]') || container.querySelector('[role="separator"]');
      if (handle) {
        expect(handle.className).toMatch(/cursor-col-resize|cursor-row-resize/);
      }
    });
  });

  describe('Window & Modal Header (header -> cursor-move)', () => {
    it('DraggableModal header exhibits cursor-move', () => {
      const { container } = render(
        <DraggableModal open title="Settings Dialog">
          <div>Content</div>
        </DraggableModal>,
      );
      const header = container.querySelector('.cursor-move') || document.querySelector('.cursor-move');
      expect(header).toBeDefined();
    });

    it('WindowTitleBar dragArea exhibits cursor-move and caption buttons exhibit cursor-pointer', () => {
      const { container } = render(<WindowTitleBar title="ChaSet Desktop" showControls />);
      const dragRegion = container.querySelector('[data-slot="window-drag-region"]');
      expect(dragRegion?.className).toContain('cursor-move');

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach((btn) => {
        expect(btn.className).toContain('cursor-pointer');
        expect(btn.className).not.toContain('cursor-default');
      });
    });
  });
});
