import * as React from 'react';
import { bench, describe } from 'vitest';
import { render } from '@testing-library/react';
import { Button } from '../src/button/Button';
import { Badge } from '../src/badge/Badge';
import { Checkbox } from '../src/checkbox/Checkbox';
import { Switch } from '../src/switch/Switch';
import { Input } from '../src/input/Input';
import { Squircle } from '../src/squircle/Squircle';

describe('Tier 5: Atomic Primitives 500x Batch Mount Stress', () => {
  bench('500x Button batch mount', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 500 }, (_, i) => (
          <Button key={i} variant="outline" size="sm">
            Action {i}
          </Button>
        ))}
      </div>
    );
    unmount();
  });

  bench('500x Badge batch mount', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 500 }, (_, i) => (
          <Badge key={i} variant="secondary">
            Status {i}
          </Badge>
        ))}
      </div>
    );
    unmount();
  });

  bench('500x Checkbox batch mount', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 500 }, (_, i) => (
          <Checkbox key={i} defaultChecked={i % 2 === 0} />
        ))}
      </div>
    );
    unmount();
  });

  bench('500x Switch batch mount', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 500 }, (_, i) => (
          <Switch key={i} defaultChecked={i % 2 === 0} />
        ))}
      </div>
    );
    unmount();
  });

  bench('500x Input batch mount', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 500 }, (_, i) => (
          <Input key={i} defaultValue={`Value ${i}`} />
        ))}
      </div>
    );
    unmount();
  });

  bench('500x Squircle batch mount', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 500 }, (_, i) => (
          <Squircle key={i} radius={8} smoothing={0.6} className="size-8" />
        ))}
      </div>
    );
    unmount();
  });
});
