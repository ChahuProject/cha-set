import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverTitle,
  PopoverDescription,
  PopoverClose,
} from './Popover';

describe('Popover', () => {
  it('renders trigger and opens popover content when clicked', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger>Open Popover</PopoverTrigger>
        <PopoverContent>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Configure dimensions</PopoverDescription>
          <div>Popover Body</div>
        </PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole('button', { name: 'Open Popover' });
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByText('Dimensions')).toBeNull();

    await user.click(trigger);
    expect(screen.getByText('Dimensions')).toBeInTheDocument();
    expect(screen.getByText('Configure dimensions')).toBeInTheDocument();
    expect(screen.getByText('Popover Body')).toBeInTheDocument();
  });

  it('supports controlled open state', () => {
    render(
      <Popover open={true}>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent>
          <p>Visible Popover</p>
        </PopoverContent>
      </Popover>,
    );

    expect(screen.getByText('Visible Popover')).toBeInTheDocument();
  });

  it('renders movable drag handle when movable is true', () => {
    render(
      <Popover open={true}>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent movable moveLabel="Drag this popover">
          <p>Movable Body</p>
        </PopoverContent>
      </Popover>,
    );

    const dragHandle = screen.getByRole('button', { name: 'Drag this popover' });
    expect(dragHandle).toBeInTheDocument();
  });

  it('supports PopoverClose', async () => {
    const user = userEvent.setup();
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent>
          <PopoverClose>Close Popover</PopoverClose>
        </PopoverContent>
      </Popover>,
    );

    const closeBtn = screen.getByRole('button', { name: 'Close Popover' });
    expect(closeBtn).toBeInTheDocument();

    await user.click(closeBtn);
    expect(screen.queryByText('Close Popover')).toBeNull();
  });

  it('closes popover when Escape is pressed', async () => {
    const user = userEvent.setup();
    render(
      <Popover defaultOpen>
        <PopoverTrigger>Trigger</PopoverTrigger>
        <PopoverContent>
          <div>Popover Body</div>
        </PopoverContent>
      </Popover>,
    );

    expect(screen.getByText('Popover Body')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByText('Popover Body')).toBeNull();
  });
});
