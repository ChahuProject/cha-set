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
    ],
  },
];
