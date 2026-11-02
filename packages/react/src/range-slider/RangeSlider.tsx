import * as React from 'react';
import { Slider, type SliderProps, type SliderSize } from '../slider';

export type RangeSliderSize = SliderSize;

export interface RangeSliderProps
  extends Omit<SliderProps, 'range' | 'value' | 'defaultValue' | 'onChange' | 'onValueChange'> {
  value?: [number, number];
  defaultValue?: [number, number];
  onChange?: (value: [number, number]) => void;
  onValueChange?: (value: [number, number]) => void;
}

export const RangeSlider = React.forwardRef<HTMLDivElement, RangeSliderProps>(
  (props, ref) => {
    return <Slider ref={ref} range {...props} />;
  },
);

RangeSlider.displayName = 'RangeSlider';
