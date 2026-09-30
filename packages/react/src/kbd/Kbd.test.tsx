import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Kbd, Shortcut, KbdGroup, formatKeyToken, parseShortcutString } from './index';

describe('Kbd Component', () => {
  it('renders raw children keycap element', () => {
    render(<Kbd>⌘</Kbd>);
    const kbd = screen.getByText('⌘');
    expect(kbd).toBeInTheDocument();
    expect(kbd.tagName.toLowerCase()).toBe('kbd');
    expect(kbd).toHaveAttribute('data-slot', 'kbd');
  });

  it('renders structured shortcut string with auto key parsing', () => {
    const { container } = render(<Kbd shortcut="Ctrl+K" compact="never" />);
    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    expect(screen.getByText('K')).toBeInTheDocument();
    expect(container.querySelectorAll('kbd').length).toBe(2);
  });

  it('renders full text by default in auto mode when space is available', () => {
    render(<Kbd shortcut="Ctrl+K" />);
    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    expect(screen.getByText('K')).toBeInTheDocument();
  });

  it('converts modifier names to compact symbols in compact mode', () => {
    render(<Kbd shortcut="Ctrl+Shift+P" compact="always" />);
    expect(screen.getByText('⌃')).toBeInTheDocument();
    expect(screen.getByText('⇧')).toBeInTheDocument();
    expect(screen.getByText('P')).toBeInTheDocument();
  });

  it('renders alternative key combinations with "or" separator', () => {
    render(<Kbd shortcut="Space / Enter" compact="never" />);
    expect(screen.getByText('Space')).toBeInTheDocument();
    expect(screen.getByText('or')).toBeInTheDocument();
    expect(screen.getByText('Enter')).toBeInTheDocument();
  });

  it('supports variants (outline, solid, subtle, inverted)', () => {
    const { rerender } = render(<Kbd variant="outline">Esc</Kbd>);
    let kbd = screen.getByText('Esc');
    expect(kbd).toHaveClass('border');

    rerender(<Kbd variant="solid">Esc</Kbd>);
    kbd = screen.getByText('Esc');
    expect(kbd).toHaveClass('bg-muted');

    rerender(<Kbd variant="inverted">Esc</Kbd>);
    kbd = screen.getByText('Esc');
    expect(kbd).toHaveClass('border-current/20');

    rerender(<Kbd variant="subtle">Esc</Kbd>);
    kbd = screen.getByText('Esc');
    expect(kbd).toHaveClass('text-muted-foreground');
    expect(kbd.tagName.toLowerCase()).toBe('span');
  });

  it('supports sizes (xs, sm, md)', () => {
    const { rerender } = render(<Kbd size="xs">A</Kbd>);
    let kbd = screen.getByText('A');
    expect(kbd).toHaveClass('h-4.5');

    rerender(<Kbd size="sm">A</Kbd>);
    kbd = screen.getByText('A');
    expect(kbd).toHaveClass('h-5');

    rerender(<Kbd size="md">A</Kbd>);
    kbd = screen.getByText('A');
    expect(kbd).toHaveClass('h-6');
  });

  it('supports forceHover and forceActive test hooks', () => {
    render(<Kbd forceHover forceActive>X</Kbd>);
    const kbd = screen.getByText('X');
    expect(kbd).toHaveClass('border-primary/50');
    expect(kbd).toHaveClass('bg-accent');
  });

  it('renders KbdGroup with custom separator', () => {
    render(
      <KbdGroup separator="/">
        <Kbd>A</Kbd>
        <Kbd>B</Kbd>
      </KbdGroup>,
    );
    expect(screen.getByText('/')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('renders Shortcut component with trailing alignment and subtle styling', () => {
    render(<Shortcut value="Ctrl+S" compact="never" />);
    const textNode = screen.getByText('Ctrl+S');
    expect(textNode).toBeInTheDocument();
    const shortcutRoot = textNode.closest('[data-slot="shortcut"]');
    expect(shortcutRoot).toBeInTheDocument();
    expect(shortcutRoot).toHaveClass('ml-auto');
    expect(shortcutRoot).toHaveClass('shrink-0');
  });

  it('formatKeyToken correctly handles key representations', () => {
    expect(formatKeyToken('ctrl', true)).toBe('⌃');
    expect(formatKeyToken('ctrl', false)).toBe('Ctrl');
    expect(formatKeyToken('cmd', true)).toBe('⌘');
    expect(formatKeyToken('enter', true)).toBe('↵');
    expect(formatKeyToken('k', true)).toBe('k');
  });

  it('parseShortcutString splits alternatives and combinations', () => {
    const parsed = parseShortcutString('Ctrl + Shift + P / ⌘ + ⇧ + P');
    expect(parsed).toEqual([
      ['Ctrl', 'Shift', 'P'],
      ['⌘', '⇧', 'P'],
    ]);
  });

  it('renders mouse glyphs with illuminated button state', () => {
    const { container: c1 } = render(<Kbd shortcut="mouse-left" />);
    const glyph1 = c1.querySelector('[data-slot="mouse-glyph"]');
    expect(glyph1).toBeInTheDocument();
    expect(glyph1).toHaveAttribute('data-button', 'left');

    const { container: c2 } = render(<Kbd shortcut="Ctrl+mouse-right" compact="never" />);
    expect(screen.getByText('Ctrl')).toBeInTheDocument();
    const glyph2 = c2.querySelector('[data-slot="mouse-glyph"]');
    expect(glyph2).toBeInTheDocument();
    expect(glyph2).toHaveAttribute('data-button', 'right');

    const { container: c3 } = render(<Kbd shortcut="mouse-middle" />);
    const glyph3 = c3.querySelector('[data-slot="mouse-glyph"]');
    expect(glyph3).toBeInTheDocument();
    expect(glyph3).toHaveAttribute('data-button', 'middle');

    render(<Kbd shortcut="mouse-left:拖拽" />);
    expect(screen.getByText('拖拽')).toBeInTheDocument();
  });
});

