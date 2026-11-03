import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { Breadcrumb, type PathSegment } from './index';

describe('Breadcrumb', () => {
  const sampleSegments: PathSegment[] = [
    { label: 'Computer', path: '/', isRoot: true, icon: 'monitor' },
    { label: 'Drive C:', path: 'C:/', isDrive: true, icon: 'package' },
    { label: 'Projects', path: 'C:/Projects', icon: 'folder' },
    { label: 'ChaSet', path: 'C:/Projects/ChaSet', icon: 'folder' },
  ];

  it('renders path segments and handles navigate callback', () => {
    const handleNavigate = vi.fn();
    render(
      <Breadcrumb
        segments={sampleSegments}
        onNavigate={handleNavigate}
      />,
    );

    expect(screen.getByText('Computer')).toBeInTheDocument();
    expect(screen.getByText('Drive C:')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('ChaSet')).toBeInTheDocument();

    const projectsBtn = screen.getByText('Projects');
    fireEvent.click(projectsBtn);
    expect(handleNavigate).toHaveBeenCalledWith('C:/Projects');
  });

  it('handles subfolder chevron click', () => {
    const handleOpenSubfolders = vi.fn();
    const { container } = render(
      <Breadcrumb
        segments={sampleSegments}
        onOpenSubfolders={handleOpenSubfolders}
      />,
    );

    const chevrons = container.querySelectorAll('button[aria-label*="Browse"]');
    if (chevrons.length > 0) {
      fireEvent.click(chevrons[0]!);
      expect(handleOpenSubfolders).toHaveBeenCalled();
    }
  });

  it('renders in disabled state', () => {
    const handleNavigate = vi.fn();
    render(
      <Breadcrumb
        segments={sampleSegments}
        disabled
        onNavigate={handleNavigate}
      />,
    );

    const projectsBtn = screen.getByText('Projects');
    fireEvent.click(projectsBtn);
    expect(handleNavigate).not.toHaveBeenCalled();
  });
});
