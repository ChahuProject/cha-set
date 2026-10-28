import * as React from 'react';
import { bench, describe } from 'vitest';
import { render } from '@testing-library/react';
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  Dialog,
  DialogTrigger,
  DialogContent,
  DraggableModal,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  FloatingNotice,
  NotificationStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Sheet,
  SheetTrigger,
  SheetContent,
  TaskHud,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../src';

describe('Performance Suite: Surfaces & Overlays (10 Components)', () => {
  bench('ContextMenu (30x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 30 }, (_, i) => (
          <ContextMenu key={i}>
            <ContextMenuTrigger>
              <div>Right click area {i}</div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Item 1</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </div>
    );
    unmount();
  });

  bench('Dialog (30x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 30 }, (_, i) => (
          <Dialog key={i} open={false}>
            <DialogTrigger asChild>
              <button>Open Dialog {i}</button>
            </DialogTrigger>
            <DialogContent>Dialog Body {i}</DialogContent>
          </Dialog>
        ))}
      </div>
    );
    unmount();
  });

  bench('DraggableModal (20x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <DraggableModal key={i} open={false} title={`Modal ${i}`}>
            <div>Content {i}</div>
          </DraggableModal>
        ))}
      </div>
    );
    unmount();
  });

  bench('DropdownMenu (30x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 30 }, (_, i) => (
          <DropdownMenu key={i}>
            <DropdownMenuTrigger asChild>
              <button>Menu {i}</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Item 1</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ))}
      </div>
    );
    unmount();
  });

  bench('FloatingNotice (30x batch mount)', () => {
    const notices = [{ id: '1', title: 'Notice' }];
    const { unmount } = render(
      <div>
        {Array.from({ length: 30 }, (_, i) => (
          <FloatingNotice key={i} notices={notices} />
        ))}
      </div>
    );
    unmount();
  });

  bench('NotificationStack (20x batch mount)', () => {
    const items = [{ id: '1', title: 'Notification' }];
    const { unmount } = render(
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <NotificationStack key={i} notifications={items} />
        ))}
      </div>
    );
    unmount();
  });

  bench('Popover (30x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 30 }, (_, i) => (
          <Popover key={i}>
            <PopoverTrigger asChild>
              <button>Open Popover {i}</button>
            </PopoverTrigger>
            <PopoverContent>Popover Content</PopoverContent>
          </Popover>
        ))}
      </div>
    );
    unmount();
  });

  bench('Sheet (30x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 30 }, (_, i) => (
          <Sheet key={i} open={false}>
            <SheetTrigger asChild>
              <button>Open Sheet {i}</button>
            </SheetTrigger>
            <SheetContent>Sheet Body {i}</SheetContent>
          </Sheet>
        ))}
      </div>
    );
    unmount();
  });

  bench('TaskHud (20x batch mount)', () => {
    const tasks = [{ id: 't1', title: 'Task 1', status: 'running' as const, progress: 45 }];
    const { unmount } = render(
      <div>
        {Array.from({ length: 20 }, (_, i) => (
          <TaskHud key={i} tasks={tasks} forceVisible={false} />
        ))}
      </div>
    );
    unmount();
  });

  bench('Tooltip (50x batch mount)', () => {
    const { unmount } = render(
      <div>
        {Array.from({ length: 50 }, (_, i) => (
          <Tooltip key={i} content={`Help tip ${i}`}>
            <span>Hover me {i}</span>
          </Tooltip>
        ))}
      </div>
    );
    unmount();
  });
});
