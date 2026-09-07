import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { KeybindingRecorder } from './KeybindingRecorder';

describe('KeybindingRecorder', () => {
  it('displays placeholder when no keybinding is set', () => {
    render(
      <KeybindingRecorder
        value={{ ctrl: false, alt: false, shift: false, meta: false, code: '' }}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText('No keybinding set')).toBeInTheDocument();
  });

  it('renders badges for key combination', () => {
    render(
      <KeybindingRecorder
        value={{ ctrl: true, alt: false, shift: true, meta: false, code: 'KeyK' }}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    expect(screen.getByText('Shift')).toBeInTheDocument();
    expect(screen.getByText('K')).toBeInTheDocument();
  });

  it('records new key combination on click and keydown', () => {
    const onChange = vi.fn();
    render(
      <KeybindingRecorder
        value={{ ctrl: false, alt: false, shift: false, meta: false, code: '' }}
        onChange={onChange}
      />,
    );

    const recorder = screen.getByRole('button');
    fireEvent.click(recorder);

    expect(screen.getByText('Press key combination (Esc to cancel)...')).toBeInTheDocument();

    fireEvent.keyDown(recorder, {
      key: 'p',
      code: 'KeyP',
      ctrlKey: true,
      altKey: true,
      shiftKey: false,
      metaKey: false,
    });

    expect(onChange).toHaveBeenCalledWith({
      ctrl: true,
      alt: true,
      shift: false,
      meta: false,
      code: 'KeyP',
    });
  });

  it('allows clearing keybinding via clear button', () => {
    const onChange = vi.fn();
    render(
      <KeybindingRecorder
        value={{ ctrl: true, alt: false, shift: false, meta: false, code: 'KeyS' }}
        onChange={onChange}
      />,
    );

    const clearBtn = screen.getByRole('button', { name: 'Clear keybinding' });
    fireEvent.click(clearBtn);

    expect(onChange).toHaveBeenCalledWith({
      ctrl: false,
      alt: false,
      shift: false,
      meta: false,
      code: '',
    });
  });
});
