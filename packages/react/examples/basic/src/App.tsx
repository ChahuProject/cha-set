import { useEffect, useState } from 'react';
import {
  Button,
  ScrollArea,
  Tabs,
  TabsList,
  TabsTrigger,
  Badge,
  Label,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  CodeBlock,
  ChaSetI18nProvider,
  DEFAULT_THEME_CONFIG,
  type ThemeConfig,
} from '@chahu/cha-set';
import { type ThemeOverrides } from './components/ThemeTuner';
import { ExportModal } from './components/ExportModal';
import { CommandSearchModal } from './components/CommandSearchModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './layout/Header';
import { Sidebar } from './layout/Sidebar';
import { useRouter } from './router/useRouter';
import { ButtonDocPage } from './pages/components/ButtonDocPage';
import { ScrollAreaDocPage } from './pages/components/ScrollAreaDocPage';
import { TabsDocPage } from './pages/components/TabsDocPage';
import { BadgeDocPage } from './pages/components/BadgeDocPage';
import { LabelDocPage } from './pages/components/LabelDocPage';
import { CollapsibleDocPage } from './pages/components/CollapsibleDocPage';
import { CardDocPage } from './pages/components/CardDocPage';
import { InputDocPage } from './pages/components/InputDocPage';
import { CheckboxDocPage } from './pages/components/CheckboxDocPage';
import { SwitchDocPage } from './pages/components/SwitchDocPage';
import { SeparatorDocPage } from './pages/components/SeparatorDocPage';
import { SliderDocPage } from './pages/components/SliderDocPage';
import { DialogDocPage } from './pages/components/DialogDocPage';
import { TooltipDocPage } from './pages/components/TooltipDocPage';
import { TableDocPage } from './pages/components/TableDocPage';
import { ColorPickerDocPage } from './pages/components/ColorPickerDocPage';
import { DropdownMenuDocPage } from './pages/components/DropdownMenuDocPage';
import { SelectDocPage } from './pages/components/SelectDocPage';
import { PopoverDocPage } from './pages/components/PopoverDocPage';
import { ContextMenuDocPage } from './pages/components/ContextMenuDocPage';
import { AlertDialogDocPage } from './pages/components/AlertDialogDocPage';
import { SheetDocPage } from './pages/components/SheetDocPage';
import { SkeletonDocPage } from './pages/components/SkeletonDocPage';
import { CopyButtonDocPage } from './pages/components/CopyButtonDocPage';
import { PanelCardDocPage } from './pages/components/PanelCardDocPage';
import { SplitButtonDocPage } from './pages/components/SplitButtonDocPage';
import { InlineEditableTextDocPage } from './pages/components/InlineEditableTextDocPage';
import { RangeSliderDocPage } from './pages/components/RangeSliderDocPage';
import { SnapSliderDocPage } from './pages/components/SnapSliderDocPage';
import { ScaleOsdDocPage } from './pages/components/ScaleOsdDocPage';
import { TaskHudDocPage } from './pages/components/TaskHudDocPage';
import { ReadOnlyInputDocPage } from './pages/components/ReadOnlyInputDocPage';
import { PresetNumberInputDocPage } from './pages/components/PresetNumberInputDocPage';
import { KeybindingRecorderDocPage } from './pages/components/KeybindingRecorderDocPage';
import { VirtualListDocPage } from './pages/components/VirtualListDocPage';
import { VirtualTreeDocPage } from './pages/components/VirtualTreeDocPage';
import { VirtualGridDocPage } from './pages/components/VirtualGridDocPage';
import { DraggableModalDocPage } from './pages/components/DraggableModalDocPage';
import { SplitterDocPage } from './pages/components/SplitterDocPage';
import { ResizableDocPage } from './pages/components/ResizableDocPage';
import { WindowTitleBarDocPage } from './pages/components/WindowTitleBarDocPage';
import { GenericDataTableDocPage } from './pages/components/GenericDataTableDocPage';
import { QueryBuilderDocPage } from './pages/components/QueryBuilderDocPage';
import { ViewportConstrainedContainerDocPage } from './pages/components/ViewportConstrainedContainerDocPage';
import { SidebarDocPage } from './pages/components/SidebarDocPage';
import { SegmentedControlDocPage } from './pages/components/SegmentedControlDocPage';
import { SmoothWheelHandlerDocPage } from './pages/components/SmoothWheelHandlerDocPage';
import { SettingRowDocPage } from './pages/components/SettingRowDocPage';
import { ElidedTextDocPage } from './pages/components/ElidedTextDocPage';
import { SplitterHandleDocPage } from './pages/components/SplitterHandleDocPage';
import { DurationInputDocPage } from './pages/components/DurationInputDocPage';
import { CodeBlockDocPage } from './pages/components/CodeBlockDocPage';
import { PipelineViewDocPage } from './pages/components/PipelineViewDocPage';
import { AddressBarDocPage } from './pages/components/AddressBarDocPage';
import { ThemeSettingsDocPage } from './pages/components/ThemeSettingsDocPage';
import { LanguageSettingsDocPage } from './pages/components/LanguageSettingsDocPage';
import { IntroductionPage } from './pages/get-started/IntroductionPage';

import { TokensPage } from './pages/get-started/TokensPage';
import { ThemeTunerPage } from './pages/get-started/ThemeTunerPage';

/**
 * Deterministic CodeBlock harness source. Mirrored verbatim in
 * qt/src/Main.qml (`harnessCodeBlockSource`); keep the two in sync — the pixel
 * harness diffs rendered output, so identical input is what makes a delta mean
 * "typography drift" instead of "different sample".
 *
 * Exercises keyword / number / string / comment token roles on 5 short lines so
 * line pitch (the original Code Block drift) is measurable as cumulative offset.
 */
export const CODE_BLOCK_HARNESS_SOURCE = [
  'const answer = 42;',
  'function greet(name: string) {',
  '  // say hi',
  '  return `hi ${name}`;',
  '}',
].join('\n');

function applyTheme(mode: string, accent: string, overrides: ThemeOverrides, uiScale: number = 1.0) {
  const html = document.documentElement;

  // 1. Toggle dark mode class
  html.classList.toggle('dark', mode === 'dark');

  // 2. Set accent dataset
  if (accent) html.setAttribute('data-theme', accent);
  else html.removeAttribute('data-theme');

  // 3. Clear existing custom properties
  const customProps = [
    '--primary',
    '--primary-foreground',
    '--secondary',
    '--secondary-foreground',
    '--accent',
    '--accent-foreground',
    '--destructive',
    '--background',
    '--card',
    '--border',
    '--ring',
    '--radius',
  ];
  for (const prop of customProps) {
    html.style.removeProperty(prop);
  }

  // 4. Inject active overrides
  if (overrides.primary) html.style.setProperty('--primary', overrides.primary);
  if (overrides.primaryForeground) html.style.setProperty('--primary-foreground', overrides.primaryForeground);
  if (overrides.secondary) html.style.setProperty('--secondary', overrides.secondary);
  if (overrides.secondaryForeground) html.style.setProperty('--secondary-foreground', overrides.secondaryForeground);
  if (overrides.accent) html.style.setProperty('--accent', overrides.accent);
  if (overrides.accentForeground) html.style.setProperty('--accent-foreground', overrides.accentForeground);
  if (overrides.destructive) html.style.setProperty('--destructive', overrides.destructive);
  if (overrides.background) html.style.setProperty('--background', overrides.background);
  if (overrides.card) html.style.setProperty('--card', overrides.card);
  if (overrides.border) html.style.setProperty('--border', overrides.border);
  if (overrides.ring) html.style.setProperty('--ring', overrides.ring);
  if (overrides.radius) html.style.setProperty('--radius', overrides.radius);

  // 5. Interface Scale
  if (typeof uiScale === 'number' && uiScale > 0 && Math.abs(uiScale - 1.0) > 0.001) {
    html.style.zoom = String(uiScale);
    html.style.setProperty('--cs-ui-scale', String(uiScale));
  } else {
    html.style.removeProperty('zoom');
    html.style.removeProperty('--cs-ui-scale');
  }
}

export function App() {
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const harness = searchParams?.get('harness');

  // Isolated Component Visual Test Harness (Required for visual diff tests)
  if (harness === 'button') {
    let rawVariant = searchParams?.get('variant') ?? 'default';
    if (rawVariant === 'primary') rawVariant = 'default';
    const variant = rawVariant as any;

    let rawSize = searchParams?.get('size') ?? 'default';
    if (rawSize === 'md') rawSize = 'default';
    const size = rawSize as any;

    const label = searchParams?.get('label') ?? '·';
    const loading = searchParams?.get('loading') === 'true';
    const disabled = searchParams?.get('disabled') === 'true';
    const state = searchParams?.get('state') ?? 'idle';
    const theme = searchParams?.get('theme') ?? 'light';

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    return (
      <div style={{ width: 220, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: theme === 'dark' ? '#020817' : '#ffffff', margin: 0, padding: 0 }}>
        <Button
          variant={variant}
          size={size}
          loading={loading}
          disabled={disabled}
          forceHover={state === 'hover'}
          forceActive={state === 'active'}
        >
          {label}
        </Button>
      </div>
    );
  }

  if (harness === 'scroll-area' || harness === 'scrollbar') {
    const orientation = (searchParams?.get('orientation') ?? 'vertical') as 'vertical' | 'horizontal';
    const state = searchParams?.get('state') ?? 'idle';
    const showButtons = searchParams?.get('showButtons') !== 'false';
    const theme = searchParams?.get('theme') ?? 'light';
    const width = Number(searchParams?.get('width') ?? (orientation === 'vertical' ? 120 : 200));
    const height = Number(searchParams?.get('height') ?? (orientation === 'vertical' ? 200 : 80));

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    const isVert = orientation === 'vertical';
    const containerW = isVert ? 100 : 180;
    const containerH = isVert ? 180 : 60;
    const contentW = isVert ? 100 : 360;
    const contentH = isVert ? 360 : 60;

    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme === 'dark' ? '#020817' : '#ffffff',
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            width: containerW,
            height: containerH,
            position: 'relative',
            overflow: 'hidden',
            background: theme === 'dark' ? '#0f172a' : '#ffffff',
            borderRadius: 6,
            border: `1px solid ${theme === 'dark' ? '#1e293b' : '#e2e8f0'}`,
          }}
        >
          <ScrollArea
            style={{ width: '100%', height: '100%' }}
            showVerticalScrollBar={isVert}
            showHorizontalScrollBar={!isVert}
            showButtons={showButtons}
            forceHover={state === 'hover'}
            forceActive={state === 'active'}
          >
            <div style={{ width: contentW, height: contentH, padding: 8 }}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  opacity: 0.1,
                  background: theme === 'dark' ? '#38bdf8' : '#0284c7',
                }}
              />
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  // Isolated Tabs Visual Test Harness
  if (harness === 'tabs') {
    const state = searchParams?.get('state') ?? 'idle';
    const tabIndex = searchParams?.get('tabIndex') ?? '1';
    const disabled = searchParams?.get('disabled') === 'true';
    const theme = searchParams?.get('theme') ?? 'light';
    const width = Number(searchParams?.get('width') ?? 260);
    const height = Number(searchParams?.get('height') ?? 80);

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    const label1 = searchParams?.get('label1') ?? '·';
    const label2 = searchParams?.get('label2') ?? '·';

    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme === 'dark' ? '#020817' : '#ffffff',
          margin: 0,
          padding: 0,
        }}
      >
        <Tabs defaultValue={tabIndex === '2' ? 'password' : 'account'}>
          <TabsList>
            <TabsTrigger
              value="account"
              forceHover={state === 'hover' && (tabIndex === '1' || tabIndex === '')}
              forceActive={state === 'active' && (tabIndex === '1' || tabIndex === '')}
              disabled={disabled && tabIndex === '1'}
            >
              {label1}
            </TabsTrigger>
            <TabsTrigger
              value="password"
              forceHover={state === 'hover' && tabIndex === '2'}
              forceActive={state === 'active' && tabIndex === '2'}
              disabled={disabled && tabIndex === '2'}
            >
              {label2}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    );
  }

  // Isolated Badge Visual Test Harness
  if (harness === 'badge') {
    const variant = (searchParams?.get('variant') ?? 'default') as any;
    const size = (searchParams?.get('size') ?? 'default') as any;
    const state = searchParams?.get('state') ?? 'idle';
    const theme = searchParams?.get('theme') ?? 'light';
    const width = Number(searchParams?.get('width') ?? 220);
    const height = Number(searchParams?.get('height') ?? 80);
    const label = searchParams?.get('label') ?? '·';

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme === 'dark' ? '#020817' : '#ffffff',
          margin: 0,
          padding: 0,
        }}
      >
        <Badge
          variant={variant}
          size={size}
          forceHover={state === 'hover'}
          forceActive={state === 'active'}
        >
          {label}
        </Badge>
      </div>
    );
  }

  // Isolated Label Visual Test Harness
  if (harness === 'label') {
    const size = (searchParams?.get('size') ?? 'default') as any;
    const disabled = searchParams?.get('disabled') === 'true';
    const required = searchParams?.get('required') === 'true';
    const state = searchParams?.get('state') ?? 'idle';
    const theme = searchParams?.get('theme') ?? 'light';
    const width = Number(searchParams?.get('width') ?? 220);
    const height = Number(searchParams?.get('height') ?? 80);
    const label = searchParams?.get('label') ?? '·';

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme === 'dark' ? '#020817' : '#ffffff',
          margin: 0,
          padding: 0,
        }}
      >
        <Label
          size={size}
          disabled={disabled}
          required={required}
          forceHover={state === 'hover'}
          forceActive={state === 'active'}
        >
          {label}
        </Label>
      </div>
    );
  }

  // Isolated Card Visual Test Harness
  if (harness === 'card') {
    const variant = (searchParams?.get('variant') ?? 'default') as any;
    const theme = searchParams?.get('theme') ?? 'light';
    const width = Number(searchParams?.get('width') ?? 340);
    const height = Number(searchParams?.get('height') ?? 220);
    const label = searchParams?.get('label') ?? '·';

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme === 'dark' ? '#020817' : '#ffffff',
          margin: 0,
          padding: 0,
        }}
      >
        <Card style={{ width: 280 }} variant={variant}>
          <CardHeader>
            <CardTitle>{label}</CardTitle>
            <CardDescription>·</CardDescription>
          </CardHeader>
          <CardContent>
            <span style={{ fontSize: 13, color: theme === 'dark' ? '#f8fafc' : '#020817' }}>·</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Isolated Input Visual Test Harness
  if (harness === 'input') {
    const size = (searchParams?.get('size') ?? 'default') as any;
    const state = searchParams?.get('state') ?? 'idle';
    const disabled = searchParams?.get('disabled') === 'true';
    const theme = searchParams?.get('theme') ?? 'light';
    const width = Number(searchParams?.get('width') ?? 220);
    const height = Number(searchParams?.get('height') ?? 80);
    const label = searchParams?.get('label') ?? '·';

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    return (
      <div
        style={{
          width,
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: theme === 'dark' ? '#020817' : '#ffffff',
          margin: 0,
          padding: 0,
        }}
      >
        <div style={{ width: 220 }}>
          <Input
            size={size}
            defaultValue={label}
            disabled={disabled}
            forceHover={state === 'hover'}
            forceFocus={state === 'focus'}
          />
        </div>
      </div>
    );
  }

  // Isolated Separator Visual Test Harness
  if (harness === 'separator') {
    const orientation = (searchParams?.get('orientation') ?? 'horizontal') as 'horizontal' | 'vertical';
    const theme = searchParams?.get('theme') ?? 'light';
    const width = Number(searchParams?.get('width') ?? 220);
    const height = Number(searchParams?.get('height') ?? 80);

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    const isVert = orientation === 'vertical';

    return (
      <div
        style={{
          width,
          height,
          position: 'relative',
          background: theme === 'dark' ? '#020817' : '#ffffff',
          margin: 0,
          padding: 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: isVert ? 110 : 20,
            top: isVert ? 10 : 40,
            width: isVert ? 1 : 180,
            height: isVert ? 60 : 1,
          }}
        >
          <Separator orientation={orientation} className={isVert ? 'h-full w-[1px]' : 'w-full h-[1px]'} />
        </div>
      </div>
    );
  }

  // Isolated CodeBlock Visual Test Harness (typography / line-height parity)
  //
  // The code sample is duplicated verbatim in qt/src/Main.qml — the two ends must
  // receive byte-identical source so any pixel delta comes from typography
  // (family / size / weight / line pitch) rather than from different content.
  if (harness === 'code-block') {
    const theme = searchParams?.get('theme') ?? 'light';
    const width = Number(searchParams?.get('width') ?? 360);
    const height = Number(searchParams?.get('height') ?? 160);
    const showLineNumbers = searchParams?.get('lineNumbers') === 'true';
    const wrap = searchParams?.get('wrap') === 'true';

    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }

    return (
      <div
        style={{
          width,
          height,
          background: theme === 'dark' ? '#020817' : '#ffffff',
          margin: 0,
          padding: 0,
        }}
      >
        <CodeBlock
          code={CODE_BLOCK_HARNESS_SOURCE}
          language="tsx"
          // The copy button renders a labelled pill whose glyph run is not part of
          // the typography contract under test; excluding it removes unrelated
          // rasterization noise from the diff.
          showCopy={false}
          showLineNumbers={showLineNumbers}
          wrap={wrap}
        />
      </div>
    );
  }

  const { currentHash, navigate } = useRouter();
  // ?theme=light|dark deep link wins over the persisted toggle so visual-diff
  // runs (and shared links) can pin the workbench theme deterministically.
  const [mode, setMode] = useState(() => searchParams?.get('theme') ?? localStorage.getItem('cs-mode') ?? 'light');
  const [accent, setAccent] = useState(() => localStorage.getItem('cs-accent') ?? '');
  const [overrides, setOverrides] = useState<ThemeOverrides>(() => {
    try {
      const saved = localStorage.getItem('cs-overrides');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [uiScale, setUiScale] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('cs-uiscale');
      const parsed = saved ? parseFloat(saved) : 1.0;
      return !isNaN(parsed) && parsed >= 0.75 && parsed <= 2.0 ? parsed : 1.0;
    } catch {
      return 1.0;
    }
  });

  const [showTuner, setShowTuner] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const themeConfig: ThemeConfig = {
    version: 1,
    mode: (mode === 'dark' || mode === 'light' || mode === 'system') ? mode : 'light',
    palette: {
      id: (accent || (overrides.primary ? 'custom' : 'neutral')) as any,
      customHex: overrides.primary || '#30a0ff',
    },
    decoration: {
      styleId: 'simple',
      level: 50,
      overrides: {
        radius: overrides.radius ? Math.round(parseFloat(overrides.radius) * 16) : 8,
      },
    },
    typography: { familyId: 'system', scaleId: 'default' },
    uiScale,
  };

  const handleThemeConfigChange = (next: ThemeConfig) => {
    // 1. Mode
    if (next.mode) {
      setMode(next.mode === 'dark' ? 'dark' : 'light');
    }

    // 2. Palette
    if (next.palette?.id) {
      if (next.palette.id === 'neutral') {
        setAccent('');
        setOverrides((prev) => {
          const nextOv = { ...prev };
          delete nextOv.primary;
          return nextOv;
        });
      } else if (next.palette.id === 'custom' && next.palette.customHex) {
        setAccent('');
        setOverrides((prev) => ({ ...prev, primary: next.palette.customHex }));
      } else {
        setAccent(next.palette.id);
        setOverrides((prev) => {
          const nextOv = { ...prev };
          delete nextOv.primary;
          return nextOv;
        });
      }
    }

    // 3. Decoration
    if (next.decoration) {
      const rad = next.decoration.overrides?.radius !== undefined
        ? next.decoration.overrides.radius
        : Math.round(4 + (next.decoration.level / 100) * 12);
      setOverrides((prev) => ({ ...prev, radius: `${rad * 0.0625}rem` }));
    }

    // 4. UI Scale
    if (typeof next.uiScale === 'number' && next.uiScale >= 0.75 && next.uiScale <= 2.0) {
      setUiScale(next.uiScale);
    }
  };

  const handleResetThemeConfig = () => {
    setMode('light');
    setAccent('');
    setOverrides({});
    setUiScale(1.0);
  };

  useEffect(() => {
    applyTheme(mode, accent, overrides, uiScale);
    localStorage.setItem('cs-mode', mode);
    localStorage.setItem('cs-accent', accent);
    localStorage.setItem('cs-overrides', JSON.stringify(overrides));
    localStorage.setItem('cs-uiscale', String(uiScale));
  }, [mode, accent, overrides, uiScale]);

  const themeKey = `${mode}:${accent}:${JSON.stringify(overrides)}:${uiScale}`;

  const renderActivePage = () => {
    switch (currentHash) {
      case '#/get-started/introduction':
      case '#/':
        return <IntroductionPage />;
      case '#/get-started/tokens':
        return <TokensPage themeKey={themeKey} />;
      case '#/get-started/theme-tuner':
        return (
          <ThemeTunerPage
            mode={mode}
            setMode={setMode}
            accent={accent}
            setAccent={setAccent}
            overrides={overrides}
            setOverrides={setOverrides}
            onOpenExport={() => setExportModalOpen(true)}
          />
        );
      case '#/components/scroll-area':
        return <ScrollAreaDocPage />;
      case '#/components/tabs':
        return <TabsDocPage />;
      case '#/components/badge':
        return <BadgeDocPage />;
      case '#/components/label':
        return <LabelDocPage />;
      case '#/components/collapsible':
        return <CollapsibleDocPage />;
      case '#/components/card':
        return <CardDocPage />;
      case '#/components/input':
        return <InputDocPage />;
      case '#/components/checkbox':
        return <CheckboxDocPage />;
      case '#/components/switch':
        return <SwitchDocPage />;
      case '#/components/separator':
        return <SeparatorDocPage />;
      case '#/components/slider':
        return <SliderDocPage />;
      case '#/components/dialog':
        return <DialogDocPage />;
      case '#/components/tooltip':
        return <TooltipDocPage />;
      case '#/components/table':
        return <TableDocPage />;
      case '#/components/color-picker':
        return <ColorPickerDocPage />;
      case '#/components/dropdown-menu':
        return <DropdownMenuDocPage />;
      case '#/components/select':
        return <SelectDocPage />;
      case '#/components/popover':
        return <PopoverDocPage />;
      case '#/components/context-menu':
        return <ContextMenuDocPage />;
      case '#/components/alert-dialog':
        return <AlertDialogDocPage />;
      case '#/components/sheet':
        return <SheetDocPage />;
      case '#/components/skeleton':
        return <SkeletonDocPage />;
      case '#/components/copy-button':
        return <CopyButtonDocPage />;
      case '#/components/panel-card':
        return <PanelCardDocPage />;
      case '#/components/split-button':
        return <SplitButtonDocPage />;
      case '#/components/inline-editable-text':
        return <InlineEditableTextDocPage />;
      case '#/components/range-slider':
        return <RangeSliderDocPage />;
      case '#/components/snap-slider':
        return <SnapSliderDocPage />;
      case '#/components/scale-osd':
        return <ScaleOsdDocPage />;
      case '#/components/task-hud':
        return <TaskHudDocPage />;
      case '#/components/read-only-input':
        return <ReadOnlyInputDocPage />;
      case '#/components/preset-number-input':
        return <PresetNumberInputDocPage />;
      case '#/components/keybinding-recorder':
        return <KeybindingRecorderDocPage />;
      case '#/components/virtual-list':
        return <VirtualListDocPage />;
      case '#/components/virtual-tree':
        return <VirtualTreeDocPage />;
      case '#/components/virtual-grid':
        return <VirtualGridDocPage />;
      case '#/components/draggable-modal':
        return <DraggableModalDocPage />;
      case '#/components/splitter':
        return <SplitterDocPage />;
      case '#/components/resizable':
        return <ResizableDocPage />;
      case '#/components/window-title-bar':
        return <WindowTitleBarDocPage />;
      case '#/components/generic-data-table':
        return <GenericDataTableDocPage />;
      case '#/components/query-builder':
        return <QueryBuilderDocPage />;
      case '#/components/viewport-constrained-container':
        return <ViewportConstrainedContainerDocPage />;
      case '#/components/sidebar':
        return <SidebarDocPage />;
      case '#/components/segmented-control':
        return <SegmentedControlDocPage />;
      case '#/components/smooth-wheel-handler':
        return <SmoothWheelHandlerDocPage />;
      case '#/components/setting-row':
        return <SettingRowDocPage />;
      case '#/components/elided-text':
        return <ElidedTextDocPage />;
      case '#/components/splitter-handle':
        return <SplitterHandleDocPage />;
      case '#/components/duration-input':
        return <DurationInputDocPage />;
      case '#/components/code-block':
        return <CodeBlockDocPage />;
      case '#/components/pipeline-view':
        return <PipelineViewDocPage />;
      case '#/components/address-bar':
        return <AddressBarDocPage />;
      case '#/components/theme-settings':
        return (
          <ThemeSettingsDocPage
            config={themeConfig}
            onChange={handleThemeConfigChange}
            onReset={handleResetThemeConfig}
          />
        );
      case '#/components/language-settings':
        return <LanguageSettingsDocPage />;
      case '#/components/button':

      default:
        return <ButtonDocPage />;
    }
  };

  return (
    <ChaSetI18nProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20">
        {/* Top Navbar */}
        <Header
          mode={mode}
          onToggleMode={() => setMode((m) => (m === 'dark' ? 'light' : 'dark'))}
          onOpenSearch={() => setSearchModalOpen(true)}
          onToggleTuner={() => setShowTuner((v) => !v)}
          showTuner={showTuner}
          onOpenExport={() => setExportModalOpen(true)}
        />

        {/* Studio / Tuner Overlay Drawer (Collapsible) */}
        {showTuner && (
          <div className="border-b border-border bg-card/60 backdrop-blur-md px-4 py-3 md:px-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground tracking-wide uppercase">
                  Studio Theme Tuner
                </span>
                <span className="text-caption text-muted-foreground">
                  Customizing CSS variables live
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-caption font-medium text-muted-foreground">Accent Palette</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['#30a0ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setAccent(c)}
                        className={`size-6 rounded-md border border-border/80 transition-transform ${
                          accent === c ? 'scale-110 ring-2 ring-primary ring-offset-1 ring-offset-background' : 'hover:scale-105'
                        }`}
                        style={{ backgroundColor: c }}
                        aria-label={`Select accent ${c}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main 2-Column Showcase Layout */}
        <div className="flex flex-1">
          {/* Left SSOT Navigation Sidebar */}
          <Sidebar currentHash={currentHash} />

          {/* Right Main Documentation Viewport */}
          <div className="flex-1 min-w-0">
            <ErrorBoundary>
              {renderActivePage()}
            </ErrorBoundary>
          </div>
        </div>

        {/* Quick Search Dialog (Cmd+K) */}
        <CommandSearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          onSelect={(href) => navigate(href)}
        />

        {/* One-Click Export Modal */}
        <ExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          mode={mode}
          accent={accent}
          overrides={overrides}
        />
      </div>
    </ChaSetI18nProvider>
  );
}
