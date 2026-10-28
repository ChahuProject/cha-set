import * as React from 'react';
import { bench, describe } from 'vitest';
import { render } from '@testing-library/react';
import {
  Badge,
  Button,
  Card,
  CopyButton,
  ElidedText,
  HoverCopy,
  Kbd,
  Label,
  PanelCard,
  Separator,
  Skeleton,
  Squircle,
} from '../src';

describe('Performance Suite: Core Primitives (12 Components)', () => {
  bench('Badge (100x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <Badge key={i} variant="secondary">Status {i}</Badge>
        ))}
      </div>
    );
    unmount();
  });

  bench('Button (100x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <Button key={i} variant="outline" size="sm">Action {i}</Button>
        ))}
      </div>
    );
    unmount();
  });

  bench('Card (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <Card key={i} className="p-3">Card Content {i}</Card>
        ))}
      </div>
    );
    unmount();
  });

  bench('CopyButton (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <CopyButton key={i} text={`token-${i}`} />
        ))}
      </div>
    );
    unmount();
  });

  bench('ElidedText (100x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <ElidedText key={i} text={`Very long file path to truncate /var/log/system-${i}.log`} />
        ))}
      </div>
    );
    unmount();
  });

  bench('HoverCopy (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <HoverCopy key={i} text={`code-${i}`}>Snippet {i}</HoverCopy>
        ))}
      </div>
    );
    unmount();
  });

  bench('Kbd (100x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <Kbd key={i}>Ctrl+K</Kbd>
        ))}
      </div>
    );
    unmount();
  });

  bench('Label (100x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <Label key={i}>Field Label {i}</Label>
        ))}
      </div>
    );
    unmount();
  });

  bench('PanelCard (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <PanelCard key={i} title={`Panel ${i}`}>Panel Body</PanelCard>
        ))}
      </div>
    );
    unmount();
  });

  bench('Separator (100x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <Separator key={i} />
        ))}
      </div>
    );
    unmount();
  });

  bench('Skeleton (100x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <Skeleton key={i} className="h-4 w-32" />
        ))}
      </div>
    );
    unmount();
  });

  bench('Squircle (100x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 100 }, (_, i) => (
          <Squircle key={i} radius={8} smoothing={0.6} className="size-8" />
        ))}
      </div>
    );
    unmount();
  });
});
