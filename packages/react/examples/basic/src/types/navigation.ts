export interface NavItem {
  id: string;
  title: string;
  href: string;
  badge?: string;
  description?: string;
}

export interface NavCategory {
  title: string;
  items: NavItem[];
}

export const NAVIGATION_CONFIG: NavCategory[] = [
  {
    title: 'Get Started',
    items: [
      {
        id: 'intro',
        title: 'Introduction',
        href: '#/get-started/introduction',
        description: 'Single source of truth architecture and multi-stack overview.',
      },
      {
        id: 'tokens',
        title: 'Theme & Tokens',
        href: '#/get-started/tokens',
        description: 'Color palette, semantic mappings, radius and typography.',
      },
      {
        id: 'theme-tuner',
        title: 'Theme Studio',
        href: '#/get-started/theme-tuner',
        badge: 'Live',
        description: 'Interactive theme customizer and config exporter.',
      },
    ],
  },
  {
    title: 'Components',
    items: [
      {
        id: 'button',
        title: 'Button',
        href: '#/components/button',
        description: 'A versatile button component with multiple variants, sizes, and states.',
      },
      {
        id: 'scroll-area',
        title: 'Scroll Area',
        href: '#/components/scroll-area',
        badge: 'New',
        description: 'Custom scrollable container with hot-zone expansion and stepper buttons.',
      },
      {
        id: 'tabs',
        title: 'Tabs',
        href: '#/components/tabs',
        badge: 'New',
        description: 'Set of layered content sections known as tab panels, displayed one at a time.',
      },
      {
        id: 'badge',
        title: 'Badge',
        href: '#/components/badge',
        badge: 'New',
        description: 'Displays a badge or a component that looks like a badge to highlight status, tags, and counts.',
      },
      {
        id: 'card',
        title: 'Card',
        href: '#/components/card',
        badge: 'New',
        description: 'Displays a card with header, title, description, content, and footer actions.',
      },
      {
        id: 'input',
        title: 'Input',
        href: '#/components/input',
        badge: 'New',
        description: 'Displays a form text input field or a component that looks like an input field.',
      },
      {
        id: 'checkbox',
        title: 'Checkbox',
        href: '#/components/checkbox',
        badge: 'New',
        description: 'A control that allows the user to toggle between checked and not-checked states.',
      },
      {
        id: 'switch',
        title: 'Switch',
        href: '#/components/switch',
        badge: 'New',
        description: 'A control that allows the user to toggle between checked and not checked states.',
      },
      {
        id: 'separator',
        title: 'Separator',
        href: '#/components/separator',
        badge: 'New',
        description: 'Visually or semantically separates content in a list or section.',
      },
      {
        id: 'slider',
        title: 'Slider',
        href: '#/components/slider',
        badge: 'New',
        description: 'An interactive control that allows the user to select a numeric value along a track.',
      },
      {
        id: 'dialog',
        title: 'Dialog',
        href: '#/components/dialog',
        badge: 'New',
        description: 'A modal window that interrupts the user with critical content and prompts for user action.',
      },
      {
        id: 'tooltip',
        title: 'Tooltip',
        href: '#/components/tooltip',
        badge: 'New',
        description: 'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
      },
      {
        id: 'table',
        title: 'Table',
        href: '#/components/table',
        badge: 'New',
        description: 'A responsive, accessible table component for organizing and displaying tabular data.',
      },
    ],
  },
];
