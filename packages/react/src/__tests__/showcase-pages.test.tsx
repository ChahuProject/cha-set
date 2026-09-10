import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

import { AlertDialogDocPage } from '../../examples/basic/src/pages/components/AlertDialogDocPage';
import { BadgeDocPage } from '../../examples/basic/src/pages/components/BadgeDocPage';
import { ButtonDocPage } from '../../examples/basic/src/pages/components/ButtonDocPage';
import { CardDocPage } from '../../examples/basic/src/pages/components/CardDocPage';
import { CheckboxDocPage } from '../../examples/basic/src/pages/components/CheckboxDocPage';
import { ColorPickerDocPage } from '../../examples/basic/src/pages/components/ColorPickerDocPage';
import { ContextMenuDocPage } from '../../examples/basic/src/pages/components/ContextMenuDocPage';
import { CopyButtonDocPage } from '../../examples/basic/src/pages/components/CopyButtonDocPage';
import { DialogDocPage } from '../../examples/basic/src/pages/components/DialogDocPage';
import { DraggableModalDocPage } from '../../examples/basic/src/pages/components/DraggableModalDocPage';
import { DropdownMenuDocPage } from '../../examples/basic/src/pages/components/DropdownMenuDocPage';
import { GenericDataTableDocPage } from '../../examples/basic/src/pages/components/GenericDataTableDocPage';
import { InlineEditableTextDocPage } from '../../examples/basic/src/pages/components/InlineEditableTextDocPage';
import { InputDocPage } from '../../examples/basic/src/pages/components/InputDocPage';
import { LabelDocPage } from '../../examples/basic/src/pages/components/LabelDocPage';
import { CollapsibleDocPage } from '../../examples/basic/src/pages/components/CollapsibleDocPage';
import { KeybindingRecorderDocPage } from '../../examples/basic/src/pages/components/KeybindingRecorderDocPage';
import { PanelCardDocPage } from '../../examples/basic/src/pages/components/PanelCardDocPage';
import { PopoverDocPage } from '../../examples/basic/src/pages/components/PopoverDocPage';
import { QueryBuilderDocPage } from '../../examples/basic/src/pages/components/QueryBuilderDocPage';
import { RangeSliderDocPage } from '../../examples/basic/src/pages/components/RangeSliderDocPage';
import { ReadOnlyInputDocPage } from '../../examples/basic/src/pages/components/ReadOnlyInputDocPage';
import { PresetNumberInputDocPage } from '../../examples/basic/src/pages/components/PresetNumberInputDocPage';
import { ScrollAreaDocPage } from '../../examples/basic/src/pages/components/ScrollAreaDocPage';
import { SelectDocPage } from '../../examples/basic/src/pages/components/SelectDocPage';
import { SeparatorDocPage } from '../../examples/basic/src/pages/components/SeparatorDocPage';
import { SheetDocPage } from '../../examples/basic/src/pages/components/SheetDocPage';
import { SkeletonDocPage } from '../../examples/basic/src/pages/components/SkeletonDocPage';
import { SliderDocPage } from '../../examples/basic/src/pages/components/SliderDocPage';
import { SplitButtonDocPage } from '../../examples/basic/src/pages/components/SplitButtonDocPage';
import { SplitterDocPage } from '../../examples/basic/src/pages/components/SplitterDocPage';
import { ResizableDocPage } from '../../examples/basic/src/pages/components/ResizableDocPage';
import { SwitchDocPage } from '../../examples/basic/src/pages/components/SwitchDocPage';
import { TableDocPage } from '../../examples/basic/src/pages/components/TableDocPage';
import { TabsDocPage } from '../../examples/basic/src/pages/components/TabsDocPage';
import { TooltipDocPage } from '../../examples/basic/src/pages/components/TooltipDocPage';
import { VirtualGridDocPage } from '../../examples/basic/src/pages/components/VirtualGridDocPage';
import { VirtualListDocPage } from '../../examples/basic/src/pages/components/VirtualListDocPage';
import { VirtualTreeDocPage } from '../../examples/basic/src/pages/components/VirtualTreeDocPage';
import { WindowTitleBarDocPage } from '../../examples/basic/src/pages/components/WindowTitleBarDocPage';
import { SegmentedControlDocPage } from '../../examples/basic/src/pages/components/SegmentedControlDocPage';
import { SmoothWheelHandlerDocPage } from '../../examples/basic/src/pages/components/SmoothWheelHandlerDocPage';
import { SettingRowDocPage } from '../../examples/basic/src/pages/components/SettingRowDocPage';
import { ElidedTextDocPage } from '../../examples/basic/src/pages/components/ElidedTextDocPage';
import { SplitterHandleDocPage } from '../../examples/basic/src/pages/components/SplitterHandleDocPage';

const pages = [
  { name: 'AlertDialogDocPage', Component: AlertDialogDocPage },
  { name: 'BadgeDocPage', Component: BadgeDocPage },
  { name: 'ButtonDocPage', Component: ButtonDocPage },
  { name: 'CardDocPage', Component: CardDocPage },
  { name: 'CheckboxDocPage', Component: CheckboxDocPage },
  { name: 'ColorPickerDocPage', Component: ColorPickerDocPage },
  { name: 'ContextMenuDocPage', Component: ContextMenuDocPage },
  { name: 'CopyButtonDocPage', Component: CopyButtonDocPage },
  { name: 'DialogDocPage', Component: DialogDocPage },
  { name: 'DraggableModalDocPage', Component: DraggableModalDocPage },
  { name: 'DropdownMenuDocPage', Component: DropdownMenuDocPage },
  { name: 'GenericDataTableDocPage', Component: GenericDataTableDocPage },
  { name: 'InlineEditableTextDocPage', Component: InlineEditableTextDocPage },
  { name: 'InputDocPage', Component: InputDocPage },
  { name: 'LabelDocPage', Component: LabelDocPage },
  { name: 'CollapsibleDocPage', Component: CollapsibleDocPage },
  { name: 'KeybindingRecorderDocPage', Component: KeybindingRecorderDocPage },
  { name: 'PanelCardDocPage', Component: PanelCardDocPage },
  { name: 'PopoverDocPage', Component: PopoverDocPage },
  { name: 'QueryBuilderDocPage', Component: QueryBuilderDocPage },
  { name: 'RangeSliderDocPage', Component: RangeSliderDocPage },
  { name: 'ReadOnlyInputDocPage', Component: ReadOnlyInputDocPage },
  { name: 'PresetNumberInputDocPage', Component: PresetNumberInputDocPage },
  { name: 'ScrollAreaDocPage', Component: ScrollAreaDocPage },
  { name: 'SelectDocPage', Component: SelectDocPage },
  { name: 'SeparatorDocPage', Component: SeparatorDocPage },
  { name: 'SheetDocPage', Component: SheetDocPage },
  { name: 'SkeletonDocPage', Component: SkeletonDocPage },
  { name: 'SliderDocPage', Component: SliderDocPage },
  { name: 'SplitButtonDocPage', Component: SplitButtonDocPage },
  { name: 'SplitterDocPage', Component: SplitterDocPage },
  { name: 'ResizableDocPage', Component: ResizableDocPage },
  { name: 'SwitchDocPage', Component: SwitchDocPage },
  { name: 'TableDocPage', Component: TableDocPage },
  { name: 'TabsDocPage', Component: TabsDocPage },
  { name: 'TooltipDocPage', Component: TooltipDocPage },
  { name: 'VirtualGridDocPage', Component: VirtualGridDocPage },
  { name: 'VirtualListDocPage', Component: VirtualListDocPage },
  { name: 'VirtualTreeDocPage', Component: VirtualTreeDocPage },
  { name: 'WindowTitleBarDocPage', Component: WindowTitleBarDocPage },
  { name: 'SegmentedControlDocPage', Component: SegmentedControlDocPage },
  { name: 'SmoothWheelHandlerDocPage', Component: SmoothWheelHandlerDocPage },
  { name: 'SettingRowDocPage', Component: SettingRowDocPage },
  { name: 'ElidedTextDocPage', Component: ElidedTextDocPage },
  { name: 'SplitterHandleDocPage', Component: SplitterHandleDocPage },
];

describe('Showcase Living Documentation Pages (Smoke & Click Integrity)', () => {
  for (const { name, Component } of pages) {
    it('renders ' + name + ' without unhandled exception and tolerates clicks', () => {
      const res = render(React.createElement(Component));
      const buttons = Array.from(res.container.querySelectorAll('button'));
      for (const btn of buttons) {
        try { fireEvent.click(btn); } catch (err) { throw new Error('Button click failed on ' + name + ': ' + (err.message || err)); }
      }
    });
  }
});
