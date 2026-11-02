import * as React from 'react';
import { Slider, type SliderProps, type SliderSize } from '../slider';

export type SnapSliderSize = SliderSize;

export interface SnapSliderProps
  extends Omit<SliderProps, 'onChange' | 'onValueChange'> {
  onChange?: (value: number) => void;
  onValueChange?: (value: number) => void;
}

export const SnapSlider = React.forwardRef<HTMLDivElement, SnapSliderProps>(
  ({ count = 5, showTicks = true, ...props }, ref) => {
    return <Slider ref={ref} count={count} showTicks={showTicks} {...props} />;
  },
);

SnapSlider.displayName = 'SnapSlider';
