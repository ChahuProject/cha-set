import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, renderHook, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Sidebar,
  SidebarContent,
  SidebarEdgeRevealZone,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './Sidebar';

describe('Sidebar Component System', () => {
  describe('SidebarProvider & useSidebar', () => {
    it('throws error when useSidebar is called outside SidebarProvider', () => {
      // Suppress console.error during expected throw
      const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => renderHook(() => useSidebar())).toThrow(
        'useSidebar must be used within a SidebarProvider.',
      );
      spy.mockRestore();
    });

    it('provides default context values and toggles sidebar state', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SidebarProvider defaultOpen={true}>{children}</SidebarProvider>
      );

      const { result } = renderHook(() => useSidebar(), { wrapper });

      expect(result.current.open).toBe(true);
      expect(result.current.state).toBe('expanded');
      expect(result.current.sidebarWidth).toBe(16);

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.open).toBe(false);
      expect(result.current.state).toBe('collapsed');

      act(() => {
        result.current.toggleSidebar();
      });

      expect(result.current.open).toBe(true);
      expect(result.current.state).toBe('expanded');
    });

    it('supports controlled open and triggers onOpenChange', () => {
      const onOpenChange = vi.fn();
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SidebarProvider open={true} onOpenChange={onOpenChange}>
          {children}
        </SidebarProvider>
      );

      const { result } = renderHook(() => useSidebar(), { wrapper });
      act(() => {
        result.current.toggleSidebar();
      });

      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('updates and normalizes sidebar width', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <SidebarProvider>{children}</SidebarProvider>
      );

      const { result } = renderHook(() => useSidebar(), { wrapper });

      act(() => {
        result.current.setSidebarWidth(20);
      });
      expect(result.current.sidebarWidth).toBe(20);

      // Clamps to min width (12)
      act(() => {
        result.current.setSidebarWidth(8);
      });
      expect(result.current.sidebarWidth).toBe(12);

      // Clamps to max width (24)
      act(() => {
        result.current.setSidebarWidth(30);
      });
      expect(result.current.sidebarWidth).toBe(24);
    });
  });

  describe('Sidebar Structural Components', () => {
    it('renders Sidebar, Header, Content, Footer with slots and styles', () => {
      render(
        <SidebarProvider>
          <Sidebar data-testid="sidebar-root">
            <SidebarHeader data-testid="sidebar-header">Header Title</SidebarHeader>
            <SidebarContent data-testid="sidebar-content">Content Area</SidebarContent>
            <SidebarFooter data-testid="sidebar-footer">Footer Controls</SidebarFooter>
            <SidebarRail data-testid="sidebar-rail" />
          </Sidebar>
          <SidebarInset data-testid="sidebar-inset">Main Page Content</SidebarInset>
        </SidebarProvider>,
      );

      const container = screen.getByTestId('sidebar-root');
      expect(container).toBeInTheDocument();
      expect(container).toHaveAttribute('data-slot', 'sidebar-container');
      const root = container.closest('[data-slot="sidebar"]');
      expect(root).toHaveAttribute('data-state', 'expanded');

      const header = screen.getByTestId('sidebar-header');
      expect(header).toHaveAttribute('data-slot', 'sidebar-header');
      expect(header).toHaveTextContent('Header Title');

      const content = screen.getByTestId('sidebar-content');
      expect(content).toHaveAttribute('data-slot', 'sidebar-content');
      expect(content).toHaveTextContent('Content Area');

      const footer = screen.getByTestId('sidebar-footer');
      expect(footer).toHaveAttribute('data-slot', 'sidebar-footer');
      expect(footer).toHaveTextContent('Footer Controls');

      const rail = screen.getByTestId('sidebar-rail');
      expect(rail).toHaveAttribute('data-slot', 'sidebar-rail');

      const inset = screen.getByTestId('sidebar-inset');
      expect(inset).toHaveAttribute('data-slot', 'sidebar-inset');
    });

    it('renders uncollapsible sidebar when collapsible="none"', () => {
      render(
        <SidebarProvider>
          <Sidebar collapsible="none" data-testid="fixed-sidebar">
            <div>Always fixed</div>
          </Sidebar>
        </SidebarProvider>,
      );

      const sidebar = screen.getByTestId('fixed-sidebar');
      expect(sidebar).toHaveAttribute('data-slot', 'sidebar');
      expect(sidebar).toHaveTextContent('Always fixed');
    });
  });

  describe('SidebarTrigger', () => {
    it('toggles sidebar on click with accessible screen reader label', async () => {
      const user = userEvent.setup();

      function Harness() {
        const { state } = useSidebar();
        return (
          <div>
            <span data-testid="state-display">{state}</span>
            <SidebarTrigger data-testid="trigger-btn" />
          </div>
        );
      }

      render(
        <SidebarProvider defaultOpen={true}>
          <Harness />
        </SidebarProvider>,
      );

      const stateDisplay = screen.getByTestId('state-display');
      const trigger = screen.getByTestId('trigger-btn');

      expect(stateDisplay).toHaveTextContent('expanded');
      expect(trigger).toHaveAttribute('data-sidebar', 'trigger');

      await user.click(trigger);
      expect(stateDisplay).toHaveTextContent('collapsed');

      await user.click(trigger);
      expect(stateDisplay).toHaveTextContent('expanded');
    });
  });

  describe('Menu and Hierarchy Components', () => {
    it('renders SidebarMenu, MenuItem, MenuButton with variants, sizes and active states', async () => {
      const handleClick = vi.fn();
      render(
        <SidebarProvider>
          <SidebarMenu data-testid="menu">
            <SidebarMenuItem data-testid="menu-item-1">
              <SidebarMenuButton
                variant="outline"
                size="sm"
                isActive={true}
                onClick={handleClick}
                data-testid="menu-btn-1"
              >
                <span>Dashboard</span>
              </SidebarMenuButton>
              <SidebarMenuAction data-testid="menu-act-1">⋯</SidebarMenuAction>
              <SidebarMenuBadge data-testid="menu-badge-1">5</SidebarMenuBadge>
            </SidebarMenuItem>

            <SidebarMenuItem data-testid="menu-item-2">
              <SidebarMenuButton variant="default" size="lg" data-testid="menu-btn-2">
                <span>Analytics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarProvider>,
      );

      const menu = screen.getByTestId('menu');
      expect(menu).toHaveAttribute('data-slot', 'sidebar-menu');

      const btn1 = screen.getByTestId('menu-btn-1');
      expect(btn1).toHaveAttribute('data-slot', 'sidebar-menu-button');
      expect(btn1).toHaveAttribute('data-size', 'sm');
      expect(btn1).toHaveAttribute('data-active', 'true');
      expect(btn1).toHaveTextContent('Dashboard');

      const user = userEvent.setup();
      await user.click(btn1);
      expect(handleClick).toHaveBeenCalledTimes(1);

      const badge = screen.getByTestId('menu-badge-1');
      expect(badge).toHaveAttribute('data-slot', 'sidebar-menu-badge');
      expect(badge).toHaveTextContent('5');

      const action = screen.getByTestId('menu-act-1');
      expect(action).toHaveAttribute('data-slot', 'sidebar-menu-action');

      const btn2 = screen.getByTestId('menu-btn-2');
      expect(btn2).toHaveAttribute('data-size', 'lg');
      expect(btn2).toHaveAttribute('data-active', 'false');
    });

    it('renders SidebarMenuSub, SubItem, and SubButton hierarchy', () => {
      render(
        <SidebarProvider>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuSub data-testid="menu-sub">
                <SidebarMenuSubItem data-testid="sub-item">
                  <SidebarMenuSubButton href="#/sub-1" size="sm" isActive data-testid="sub-btn">
                    <span>Sub Page 1</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarProvider>,
      );

      const sub = screen.getByTestId('menu-sub');
      expect(sub).toHaveAttribute('data-slot', 'sidebar-menu-sub');

      const subBtn = screen.getByTestId('sub-btn');
      expect(subBtn).toHaveAttribute('data-slot', 'sidebar-menu-sub-button');
      expect(subBtn).toHaveAttribute('data-size', 'sm');
      expect(subBtn).toHaveAttribute('data-active', 'true');
      expect(subBtn).toHaveAttribute('href', '#/sub-1');
    });

    it('renders SidebarGroup, GroupLabel, GroupAction, GroupContent', () => {
      render(
        <SidebarProvider>
          <SidebarGroup data-testid="group">
            <SidebarGroupLabel data-testid="group-label">Projects</SidebarGroupLabel>
            <SidebarGroupAction data-testid="group-action">+</SidebarGroupAction>
            <SidebarGroupContent data-testid="group-content">Group Body</SidebarGroupContent>
          </SidebarGroup>
        </SidebarProvider>,
      );

      expect(screen.getByTestId('group')).toHaveAttribute('data-slot', 'sidebar-group');
      expect(screen.getByTestId('group-label')).toHaveAttribute('data-slot', 'sidebar-group-label');
      expect(screen.getByTestId('group-action')).toHaveAttribute('data-slot', 'sidebar-group-action');
      expect(screen.getByTestId('group-content')).toHaveAttribute('data-slot', 'sidebar-group-content');
    });

    it('renders SidebarMenuSkeleton, SidebarSeparator, and SidebarInput', () => {
      render(
        <SidebarProvider>
          <SidebarInput placeholder="Search..." data-testid="input" />
          <SidebarSeparator data-testid="separator" />
          <SidebarMenuSkeleton showIcon data-testid="skeleton" />
        </SidebarProvider>,
      );

      expect(screen.getByTestId('input')).toHaveAttribute('data-slot', 'sidebar-input');
      expect(screen.getByTestId('separator')).toHaveAttribute('data-slot', 'sidebar-separator');
      expect(screen.getByTestId('skeleton')).toHaveAttribute('data-slot', 'sidebar-menu-skeleton');
    });
  });
});
