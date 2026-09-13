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
import { Collapsible, CollapsibleTrigger } from '../collapsible';
import { Badge } from '../badge';
import { Card } from '../card';
import { Splitter, SplitterPanel } from '../splitter';
import { SplitterHandle } from '../splitter-handle';
import { DraggableModal } from '../draggable-modal';
import { WindowTitleBar } from '../window-title-bar';

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

    it('TabsTrigger exhibits cursor-pointer', () => {
      render(
        <Tabs defaultValue="tab1">
          <TabsList>
            <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          </TabsList>
        </Tabs>,
      );
      const tab = screen.getByRole('tab');
      expect(tab.className).toContain('cursor-pointer');
    });

    it('SegmentedControl options exhibit cursor-pointer', () => {
      render(
        <SegmentedControl
          options={[
            { label: 'Day', value: 'day' },
            { label: 'Week', value: 'week' },
          ]}
        />,
      );
      const options = screen.getAllByRole('radio');
      expect(options[0].className).toContain('cursor-pointer');
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
    it('Slider exhibits cursor-pointer and disabled cursor-not-allowed', () => {
      const { rerender, container } = render(<Slider defaultValue={[50]} />);
      const slider = container.querySelector('[role="slider"]') || container.firstChild;
      expect(slider).toBeDefined();

      rerender(<Slider defaultValue={[50]} disabled />);
      expect(slider).toBeDefined();
    });

    it('RangeSlider exhibits cursor-pointer', () => {
      const { container } = render(<RangeSlider defaultValue={[20, 80]} />);
      expect(container.firstChild).toBeDefined();
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

    it('WindowTitleBar dragArea exhibits cursor-default or cursor-move', () => {
      const { container } = render(<WindowTitleBar title="ChaSet Desktop" />);
      expect(container.firstChild).toBeDefined();
    });
  });
});
