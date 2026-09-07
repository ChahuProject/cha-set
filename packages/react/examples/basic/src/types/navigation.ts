export interface NavItem {
  id: string;
  title: string;
  href: string;
  badge?: string;
  description?: string;
  label?: string;
  path?: string;
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
    title: 'Base Primitives',
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
        description: 'Custom scrollable container with hot-zone expansion and stepper buttons.',
      },
      {
        id: 'tabs',
        title: 'Tabs',
        href: '#/components/tabs',
        description: 'Set of layered content sections known as tab panels, displayed one at a time.',
      },
      {
        id: 'badge',
        title: 'Badge',
        href: '#/components/badge',
        description: 'Displays a badge or status tag to highlight status, tags, and counts.',
      },
      {
        id: 'card',
        title: 'Card',
        href: '#/components/card',
        description: 'Displays a card with header, title, description, content, and footer actions.',
      },
      {
        id: 'input',
        title: 'Input',
        href: '#/components/input',
        description: 'Form text input field with desktop high-density sizing and states.',
      },
      {
        id: 'checkbox',
        title: 'Checkbox',
        href: '#/components/checkbox',
        description: 'Control that allows toggling between checked, unchecked, and indeterminate.',
      },
      {
        id: 'switch',
        title: 'Switch',
        href: '#/components/switch',
        description: 'A control that allows toggling binary state with smooth animated transitions.',
      },
      {
        id: 'separator',
        title: 'Separator',
        href: '#/components/separator',
        description: 'Visually or semantically separates content in horizontal or vertical orientation.',
      },
      {
        id: 'slider',
        title: 'Slider',
        href: '#/components/slider',
        description: 'Interactive control that allows selecting a numeric value along a track.',
      },
      {
        id: 'dialog',
        title: 'Dialog',
        href: '#/components/dialog',
        description: 'Modal window that interrupts the user with critical content.',
      },
      {
        id: 'tooltip',
        title: 'Tooltip',
        href: '#/components/tooltip',
        description: 'Popup that displays information related to an element on hover or focus.',
      },
      {
        id: 'table',
        title: 'Table',
        href: '#/components/table',
        description: 'Responsive, accessible table component for tabular data.',
      },
      {
        id: 'color-picker',
        title: 'ColorPicker',
        href: '#/components/color-picker',
        description: 'Interactive color selection with saturation/brightness field and swatches.',
      },
      {
        id: 'dropdown-menu',
        title: 'Dropdown Menu',
        href: '#/components/dropdown-menu',
        badge: 'Stage 1',
        description: 'Displays a menu to the user triggered by a button with item groups and shortcuts.',
      },
      {
        id: 'select',
        title: 'Select',
        href: '#/components/select',
        badge: 'Stage 1',
        description: 'Displays a list of options for the user to pick from with trigger and indicator.',
      },
      {
        id: 'popover',
        title: 'Popover',
        href: '#/components/popover',
        badge: 'Stage 1',
        description: 'Displays rich interactive content in a floating portal anchored to a trigger.',
      },
      {
        id: 'context-menu',
        title: 'Context Menu',
        href: '#/components/context-menu',
        badge: 'Stage 1',
        description: 'Displays a menu located at the pointer coordinates on right-click or context gesture.',
      },
      {
        id: 'alert-dialog',
        title: 'Alert Dialog',
        href: '#/components/alert-dialog',
        badge: 'Stage 1',
        description: 'A modal dialog that interrupts the user with important content and requires confirmation.',
      },
      {
        id: 'sheet',
        title: 'Sheet',
        href: '#/components/sheet',
        badge: 'Stage 1',
        description: 'Extends the dialog component to display content that slides in from any screen edge.',
      },
      {
        id: 'skeleton',
        title: 'Skeleton',
        href: '#/components/skeleton',
        badge: 'Stage 1',
        description: 'Used to show a placeholder while content is loading with pulse animations.',
      },
    ],
  },
  {
    title: 'Interactive Controls',
    items: [
      {
        id: 'copy-button',
        title: 'Copy Button',
        href: '#/components/copy-button',
        badge: 'Stage 2',
        description: 'One-click clipboard copy button with transient feedback icons and custom timeouts.',
      },
      {
        id: 'panel-card',
        title: 'Panel Card',
        href: '#/components/panel-card',
        badge: 'Stage 2',
        description: 'Card surface with integrated collapsible sections and header action slots.',
      },
      {
        id: 'split-button',
        title: 'Split Button',
        href: '#/components/split-button',
        badge: 'Stage 2',
        description: 'Dual-action button with primary direct click and secondary dropdown chevron.',
      },
      {
        id: 'inline-editable-text',
        title: 'Inline Editable Text',
        href: '#/components/inline-editable-text',
        badge: 'Stage 2',
        description: 'Text element that switches seamlessly to an input field on double-click or edit trigger.',
      },
      {
        id: 'range-slider',
        title: 'Range Slider',
        href: '#/components/range-slider',
        badge: 'Stage 2',
        description: 'Dual-thumb slider for selecting numeric min-max intervals with collision prevention.',
      },
      {
        id: 'read-only-input',
        title: 'Read-Only Input',
        href: '#/components/read-only-input',
        badge: 'Stage 2',
        description: 'Protected input field for tokens and IDs with integrated copy-to-clipboard action.',
      },
      {
        id: 'keybinding-recorder',
        title: 'Keybinding Recorder',
        href: '#/components/keybinding-recorder',
        badge: 'Stage 2',
        description: 'Interactive recorder that captures accelerator keyboard sequences for desktop apps.',
      },
    ],
  },
  {
    title: 'Desktop & Virtualization',
    items: [
      {
        id: 'virtual-list',
        title: 'Virtual List',
        href: '#/components/virtual-list',
        badge: 'Stage 3',
        description: 'High-performance windowed 100k+ row list with dynamic or fixed item measurements.',
      },
      {
        id: 'virtual-tree',
        title: 'Virtual Tree',
        href: '#/components/virtual-tree',
        badge: 'Stage 3',
        description: 'Virtualized hierarchical tree view with node expansion, selection, and keyboard navigation.',
      },
      {
        id: 'virtual-grid',
        title: 'Virtual Grid',
        href: '#/components/virtual-grid',
        badge: 'Stage 3',
        description: '2D windowed grid virtualizer for massive dataset visualization.',
      },
      {
        id: 'draggable-modal',
        title: 'Draggable Modal',
        href: '#/components/draggable-modal',
        badge: 'Stage 3',
        description: 'Desktop floating window with dragging title bar and bound viewport constraints.',
      },
      {
        id: 'splitter',
        title: 'Splitter',
        href: '#/components/splitter',
        badge: 'Stage 3',
        description: 'Multi-pane resizable layout container with draggable gutters and collapse limits.',
      },
      {
        id: 'window-title-bar',
        title: 'Window Title Bar',
        href: '#/components/window-title-bar',
        badge: 'Stage 3',
        description: 'Desktop window frame header with title, drag region, and minimize/maximize/close buttons.',
      },
    ],
  },
  {
    title: 'Composite Engines',
    items: [
      {
        id: 'generic-data-table',
        title: 'Generic Data Table',
        href: '#/components/generic-data-table',
        badge: 'Stage 4',
        description: 'Full-featured data table with column sorting, filtering, selection, and pagination.',
      },
      {
        id: 'query-builder',
        title: 'Query Builder',
        href: '#/components/query-builder',
        badge: 'Stage 4',
        description: 'Visual rule tree builder for structured query generation with nested logic groups.',
      },
    ],
  },
];
