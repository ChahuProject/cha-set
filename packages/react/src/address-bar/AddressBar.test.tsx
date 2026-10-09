import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { AddressBar, parsePathSegments, getParentPath } from './AddressBar';

describe('AddressBar', () => {
  describe('path parsing helpers', () => {
    it('parses Windows drive letter paths correctly', () => {
      const segments = parsePathSegments('C:/Users/Development/cha-set');
      expect(segments).toEqual([
        { label: 'C:', path: 'C:/', realPath: 'C:/', isDrive: true, icon: 'package' },
        { label: 'Users', path: 'C:/Users', realPath: 'C:/Users', icon: 'folder' },
        { label: 'Development', path: 'C:/Users/Development', realPath: 'C:/Users/Development', icon: 'folder' },
        { label: 'cha-set', path: 'C:/Users/Development/cha-set', realPath: 'C:/Users/Development/cha-set', icon: 'folder' },
      ]);
    });

    it('parses POSIX paths correctly', () => {
      const segments = parsePathSegments('/var/log/nginx');
      expect(segments).toEqual([
        { label: '/', path: '/', realPath: '/', isRoot: true, icon: 'folder' },
        { label: 'var', path: '/var', realPath: '/var', icon: 'folder' },
        { label: 'log', path: '/var/log', realPath: '/var/log', icon: 'folder' },
        { label: 'nginx', path: '/var/log/nginx', realPath: '/var/log/nginx', icon: 'folder' },
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

    it('renders standalone Breadcrumb and triggers onOpenSubfolders on chevron click', () => {
      const handleNavigate = vi.fn();
      const handleSubfolders = vi.fn();
      const segments = [
        { label: 'C:', path: 'C:/', realPath: 'C:/', isDrive: true, icon: 'package' },
        { label: 'Users', path: 'C:/Users', realPath: 'C:/Users', icon: 'folder' },
      ];

      render(
        <AddressBar
          path="C:/Users"
          onNavigate={handleNavigate}
          fileSystemAdapter={{
            getSubfolders: handleSubfolders,
          }}
        />
      );

      const chevrons = screen.getAllByRole('button', { name: /open subfolders/i });
      expect(chevrons.length).toBeGreaterThan(0);
      fireEvent.click(chevrons[0]!);
      expect(handleSubfolders).toHaveBeenCalled();
    });

    it('shows suggestions dropdown and navigates with arrow keys in edit mode', () => {
      const handleNavigate = vi.fn();
      render(
        <AddressBar
          path="C:/Users"
          onNavigate={handleNavigate}
          suggestions={['C:/Users/Development', 'C:/Users/Public']}
          history={['C:/Windows']}
        />
      );

      const addressBar = screen.getByRole('toolbar', { name: 'Address bar' });
      fireEvent.click(addressBar.querySelector('div.cursor-text')!);

      const input = screen.getByRole('textbox', { name: 'Address path input' });
      fireEvent.keyDown(input, { key: 'ArrowDown' });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(handleNavigate).toHaveBeenCalled();
    });

    it('expands search input on button click and collapses on Escape', () => {
      const handleSearch = vi.fn();
      render(
        <AddressBar
          path="C:/Users"
          showSearch
          onSearch={handleSearch}
        />
      );

      const searchButton = screen.getByRole('button', { name: /搜索|Search/ });
      expect(searchButton).toBeInTheDocument();

      fireEvent.click(searchButton);
      const searchInput = screen.getByPlaceholderText(/搜索\.\.\.|Search\.\.\./);
      expect(searchInput).toBeInTheDocument();

      fireEvent.change(searchInput, { target: { value: 'file.txt' } });
      expect(handleSearch).toHaveBeenCalledWith('file.txt');

      // Clear search
      const clearBtn = screen.getByRole('button', { name: 'Clear search' });
      fireEvent.click(clearBtn);
      expect(handleSearch).toHaveBeenCalledWith('');

      // Escape collapses
      fireEvent.keyDown(searchInput, { key: 'Escape' });
      expect(screen.getByRole('button', { name: /搜索|Search/ })).toBeInTheDocument();
    });
  });
});


