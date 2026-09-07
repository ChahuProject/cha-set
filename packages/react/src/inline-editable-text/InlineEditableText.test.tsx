import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InlineEditableText } from './InlineEditableText';

describe('InlineEditableText', () => {
  it('renders display mode with value initially', () => {
    render(<InlineEditableText value="Project Title" onSave={() => {}} />);
    expect(screen.getByText('Project Title')).toBeInTheDocument();
  });

  it('enters editing mode upon click and submits with Enter', async () => {
    const onSave = vi.fn().mockReturnValue(true);
    render(<InlineEditableText value="Old Title" onSave={onSave} />);

    const displayBtn = screen.getByText('Old Title');
    fireEvent.click(displayBtn);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('Old Title');

    fireEvent.change(input, { target: { value: 'New Title' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('New Title');
    });
  });

  it('cancels edit on Escape key press', () => {
    const onSave = vi.fn();
    render(<InlineEditableText value="Original" onSave={onSave} />);

    fireEvent.click(screen.getByText('Original'));
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Changed' } });
    fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('Original')).toBeInTheDocument();
  });
});
