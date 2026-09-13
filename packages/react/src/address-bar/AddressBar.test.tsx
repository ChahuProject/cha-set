import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { AddressBar, parsePathSegments, getParentPath } from './AddressBar';

describe('AddressBar', () => {
  describe('path parsing helpers', () => {
    it('parses Windows drive letter paths correctly', () => {
      const segments = parsePathSegments('C:/Users/Development/cha-set');
      expect(segments).toEqual([
        { label: 'C:', path: 'C:/' },
        { label: 'Users', path: 'C:/Users' },
        { label: 'Development', path: 'C:/Users/Development' },
        { label: 'cha-set', path: 'C:/Users/Development/cha-set' },
      ]);
    });

    it('parses POSIX paths correctly', () => {
      const segments = parsePathSegments('/var/log/nginx');
      expect(segments).toEqual([
        { label: '/', path: '/' },
        { label: 'var', path: '/var' },
        { label: 'log', path: '/var/log' },
        { label: 'nginx', path: '/var/log/nginx' },
      ]);
    });

    it('computes parent directory correctly', () => {
      expect(getParentPath('C:/Users/Development')).toBe('C:/Users');
      expect(getParentPath('C:/Users')).toBe('C:/');
      expect(getParentPath('/var/log/nginx')).toBe('/var/log');
      expect(getParentPath('/var')).toBe('/');
    });
  });

  describe('Component interactions', () => {
    it('renders breadcrumb segments in read mode', () => {
      render(<AddressBar path="C:/Users/Development/cha-set" />);
      expect(screen.getByText('C:')).toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
      expect(screen.getByText('Development')).toBeInTheDocument();
      expect(screen.getByText('cha-set')).toBeInTheDocument();
    });

    it('calls onNavigate when a breadcrumb segment is clicked', () => {
      const handleNavigate = vi.fn();
      render(
        <AddressBar
          path="C:/Users/Development/cha-set"
          onNavigate={handleNavigate}
        />
      );
      fireEvent.click(screen.getByText('Users'));
      expect(handleNavigate).toHaveBeenCalledWith('C:/Users');
    });

    it('switches to edit mode on clicking empty area of address bar', () => {
      render(<AddressBar path="C:/Users/Development" />);
      const addressBar = screen.getByRole('toolbar', { name: 'Address bar' });
      fireEvent.click(addressBar.querySelector('div.cursor-text')!);

      const input = screen.getByRole('textbox', { name: 'Address path input' });
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('C:/Users/Development');
    });

    it('commits edited path on Enter', () => {
      const handleNavigate = vi.fn();
      render(
        <AddressBar
          path="C:/Users"
          onNavigate={handleNavigate}
        />
      );
      const addressBar = screen.getByRole('toolbar', { name: 'Address bar' });
      fireEvent.click(addressBar.querySelector('div.cursor-text')!);

      const input = screen.getByRole('textbox', { name: 'Address path input' });
      fireEvent.change(input, { target: { value: 'C:/Windows/System32' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(handleNavigate).toHaveBeenCalledWith('C:/Windows/System32');
    });

    it('cancels edit mode and reverts on Escape', () => {
      const handleNavigate = vi.fn();
      render(
        <AddressBar
          path="C:/Users"
          onNavigate={handleNavigate}
        />
      );
      const addressBar = screen.getByRole('toolbar', { name: 'Address bar' });
      fireEvent.click(addressBar.querySelector('div.cursor-text')!);

      const input = screen.getByRole('textbox', { name: 'Address path input' });
      fireEvent.change(input, { target: { value: 'C:/Changed' } });
      fireEvent.keyDown(input, { key: 'Escape' });

      expect(handleNavigate).not.toHaveBeenCalled();
      expect(screen.queryByRole('textbox', { name: 'Address path input' })).not.toBeInTheDocument();
      expect(screen.getByText('Users')).toBeInTheDocument();
    });

    it('invokes navigation button callbacks', () => {
      const handleBack = vi.fn();
      const handleForward = vi.fn();
      const handleRefresh = vi.fn();
      const handleUp = vi.fn();

      render(
        <AddressBar
          path="C:/Users/Development"
          canGoBack
          canGoForward
          onBack={handleBack}
          onForward={handleForward}
          onRefresh={handleRefresh}
          onUp={handleUp}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: 'Back' }));
      expect(handleBack).toHaveBeenCalled();

      fireEvent.click(screen.getByRole('button', { name: 'Forward' }));
      expect(handleForward).toHaveBeenCalled();

      fireEvent.click(screen.getByRole('button', { name: 'Refresh' }));
      expect(handleRefresh).toHaveBeenCalled();

      fireEvent.click(screen.getByRole('button', { name: 'Up to parent directory' }));
      expect(handleUp).toHaveBeenCalled();
    });
  });
});
