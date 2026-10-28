import * as React from 'react';
import { bench, describe } from 'vitest';
import { render } from '@testing-library/react';
import {
  Checkbox,
  ColorPicker,
  DurationInput,
  InlineEditableText,
  Input,
  KeybindingRecorder,
  PresetNumberInput,
  RangeSlider,
  ReadOnlyInput,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Slider,
  SnapSlider,
  Switch,
} from '../src';

describe('Performance Suite: Form Controls (13 Components)', () => {
  bench('Checkbox (100x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <Checkbox key={i} defaultChecked={i % 2 === 0} />
        ))}
      </div>
    );
    unmount();
  });

  bench('ColorPicker (20x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <ColorPicker key={i} defaultValue="#3b82f6" mode="inline" />
        ))}
      </div>
    );
    unmount();
  });

  bench('DurationInput (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <DurationInput key={i} defaultValue={120} />
        ))}
      </div>
    );
    unmount();
  });

  bench('InlineEditableText (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <InlineEditableText key={i} defaultValue={`Editable text ${i}`} />
        ))}
      </div>
    );
    unmount();
  });

  bench('Input (100x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <Input key={i} defaultValue={`Value ${i}`} />
        ))}
      </div>
    );
    unmount();
  });

  bench('KeybindingRecorder (30x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 30 }, (_, i) => (
          <KeybindingRecorder key={i} defaultValue="Ctrl+K" />
        ))}
      </div>
    );
    unmount();
  });

  bench('PresetNumberInput (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <PresetNumberInput key={i} defaultValue={42} presets={[10, 25, 50, 100]} />
        ))}
      </div>
    );
    unmount();
  });

  bench('RangeSlider (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <RangeSlider key={i} defaultValue={[20, 80]} min={0} max={100} />
        ))}
      </div>
    );
    unmount();
  });

  bench('ReadOnlyInput (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <ReadOnlyInput key={i} value={`Read-only key ${i}`} />
        ))}
      </div>
    );
    unmount();
  });

  bench('Select (30x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 30 }, (_, i) => (
          <Select key={i} defaultValue="opt-1">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="opt-1">Option 1</SelectItem>
              <SelectItem value="opt-2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        ))}
      </div>
    );
    unmount();
  });

  bench('Slider (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <Slider key={i} defaultValue={[50]} min={0} max={100} />
        ))}
      </div>
    );
    unmount();
  });

  bench('SnapSlider (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <SnapSlider key={i} defaultValue={2} count={5} />
        ))}
      </div>
    );
    unmount();
  });

  bench('Switch (100x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <Switch key={i} defaultChecked={i % 2 === 0} />
        ))}
      </div>
    );
    unmount();
  });
});
