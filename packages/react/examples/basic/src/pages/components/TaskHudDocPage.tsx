import React, { useState } from 'react';
import {
  TaskHud,
  type TaskItem,
  type TaskHudPlacement,
  Button,
  SegmentedControl,
  Badge,
  CodeBlock,
  useChaSetI18n,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';
import { PropsTable } from '../../components/PropsTable';

const TASK_DEFAULTS = {
  progress: -1,
  indeterminate: false,
  status: 'running' as const,
  cancellable: false,
};

export function TaskHudDocPage() {
  const { t } = useChaSetI18n();

  const PLACEMENT_OPTIONS: { label: string; value: TaskHudPlacement }[] = [
    { label: t('overlays.taskHud.placementBottomRight', 'Bottom Right'), value: 'bottom-right' },
    { label: t('overlays.taskHud.placementBottomLeft', 'Bottom Left'), value: 'bottom-left' },
    { label: t('overlays.taskHud.placementTopRight', 'Top Right'), value: 'top-right' },
    { label: t('overlays.taskHud.placementTopLeft', 'Top Left'), value: 'top-left' },
    { label: t('overlays.taskHud.placementBottomCenter', 'Bottom Center'), value: 'bottom-center' },
  ];

  // Preview 1 — live execution sandbox.
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task-1',
      title: t('overlays.taskHud.taskPackagingBundle', 'Packaging Bundle'),
      detail: t('overlays.taskHud.taskPackagingBundleDetail', 'Compiling assets and modules'),
      progress: 0.65,
      status: 'running',
      elapsedMs: 2400,
      cancellable: true,
    },
    {
      id: 'task-2',
      title: t('overlays.taskHud.taskDatabaseMigration', 'Database Migration'),
      detail: t('overlays.taskHud.taskDatabaseMigrationDetail', 'Applied 12 schema patches'),
      progress: 1,
      status: 'success',
      total: 12,
      done: 12,
    },
  ]);

  // Preview 2 — overflow & collapse sandbox.
  const [maxVisible, setMaxVisible] = useState('3');
  const [placement, setPlacement] = useState<TaskHudPlacement>('bottom-right');
  const [collapsed, setCollapsed] = useState(false);
  const backlog: TaskItem[] = [
    { ...TASK_DEFAULTS, id: 'queue-1', title: t('overlays.taskHud.taskIndexingSymbols', 'Indexing Symbols'), detail: t('overlays.taskHud.taskIndexingSymbolsDetail', 'Scanning 4,182 files'), indeterminate: true },
    { ...TASK_DEFAULTS, id: 'queue-2', title: t('overlays.taskHud.taskOptimizingImages', 'Optimizing Images'), detail: t('overlays.taskHud.taskOptimizingImagesDetail', 'Re-encoding 38 assets'), progress: 0.42 },
    { ...TASK_DEFAULTS, id: 'queue-3', title: t('overlays.taskHud.taskRunningUnitTests', 'Running Unit Tests'), detail: t('overlays.taskHud.taskRunningUnitTestsDetail', 'Suite 7 of 12'), progress: 0.58, total: 12, done: 7 },
    { ...TASK_DEFAULTS, id: 'queue-4', title: t('overlays.taskHud.taskUploadingArtifacts', 'Uploading Artifacts'), detail: t('overlays.taskHud.taskUploadingArtifactsDetail', 'Waiting for credentials'), status: 'queued' },
    { ...TASK_DEFAULTS, id: 'queue-5', title: t('overlays.taskHud.taskGeneratingReport', 'Generating Report'), detail: t('overlays.taskHud.taskGeneratingReportDetail', 'Coverage summary'), progress: -1 },
  ];

  const dismiss = (id: string) => setTasks((prev) => prev.filter((task) => task.id !== id));
  const cancel = (id: string) =>
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: 'cancelled' as const, detail: t('overlays.taskHud.cancelledByUser', 'Cancelled by user') } : task)),
    );

  const addRunning = () =>
    setTasks((prev) => [
      ...prev,
      {
        ...TASK_DEFAULTS,
        id: `task-${Date.now()}`,
        title: t('overlays.taskHud.buildJob', 'Build Job #{{num}}', { num: prev.length + 1 }),
        detail: t('overlays.taskHud.processingDependencies', 'Processing dependencies'),
        progress: 0.35,
        elapsedMs: 800,
        cancellable: true,
      },
    ]);

  const addIndeterminate = () =>
    setTasks((prev) => [
      ...prev,
      {
        ...TASK_DEFAULTS,
        id: `task-${Date.now()}`,
        title: t('overlays.taskHud.analyzingAst', 'Analyzing AST #{{num}}', { num: prev.length + 1 }),
        detail: t('overlays.taskHud.indexingSymbols', 'Indexing symbols'),
        indeterminate: true,
      },
    ]);

  const settleFirstRunning = (status: 'success' | 'error') =>
    setTasks((prev) => {
      const index = prev.findIndex((task) => task.status === 'running');
      if (index === -1) return prev;
      const next = [...prev];
      next[index] = {
        ...next[index]!,
        status,
        progress: status === 'success' ? 1 : next[index]!.progress,
        detail: status === 'success' ? t('overlays.taskHud.completedSuccessfully', 'Completed successfully') : t('overlays.taskHud.compilationError', 'Compilation error (exit code 1)'),
      };
      return next;
    });

  const sandboxReactCode = `const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);

<TaskHud
  tasks={tasks}
  maxVisible={3}
  autoHideDelay={600}
  onDismiss={(id) => setTasks((prev) => prev.filter((task) => task.id !== id))}
  onCancel={(id) => markCancelled(id)}
/>`;

  const overflowReactCode = `// maxVisible caps the rendered cards; the remaining jobs collapse into an
// overflow pill that expands the stack into a scrollable list.
<TaskHud
  tasks={backlog}
  maxVisible={3}
  placement="bottom-right"
  collapsible
  defaultCollapsed={false}
/>`;

  return (
    <DocLayout
      category="Overlays & Feedback"
      title="Task HUD"
      description={t('components.taskHud.description', 'Floating stack of background executions with progress, overflow and collapse-to-summary.')}
      tocItems={[
        { id: 'overview', title: t('showcase.interactiveOverview', 'Interactive Overview') },
        { id: 'installation', title: t('showcase.installation', 'Installation') },
        { id: 'anatomy', title: t('showcase.anatomy', 'Anatomy') },
        { id: 'animations', title: t('showcase.animations', 'Animations') },
        { id: 'keyboard', title: t('showcase.keyboardNavigation', 'Keyboard Navigation') },
        { id: 'props', title: t('showcase.propsReference', 'Props Reference') },
      ]}
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">{t('showcase.interactiveOverview', 'Interactive Overview')}</h2>
        <ComponentPreview
          title={t('desktopComposite.taskHud.sandboxTitle', 'Task HUD Sandbox')}
          reactCode={sandboxReactCode}
          qtCode={`ChaSetTaskHud {
    tasks: demoTasks
    maxVisible: 3
    autoHideDelay: 600
    onDismissed: function(id) { removeTask(id) }
    onCancelled: function(id) { markCancelled(id) }
}`}
          controls={
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="mr-1 text-muted-foreground">{t('overlays.taskHud.simulateTasks', 'Simulate Tasks:')}</span>
              <Button variant="outline" size="sm" onClick={addRunning}>
                {t('overlays.taskHud.addRunning', 'Add Running')}
              </Button>
              <Button variant="outline" size="sm" onClick={addIndeterminate}>
                {t('overlays.taskHud.addIndeterminate', 'Add Indeterminate')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => settleFirstRunning('success')}>
                {t('overlays.taskHud.succeedTask', 'Succeed Task')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => settleFirstRunning('error')}>
                {t('overlays.taskHud.failTask', 'Fail Task')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setTasks([])}>
                {t('overlays.taskHud.clearAll', 'Clear All')}
              </Button>
            </div>
          }
        >
          <div className="relative min-h-80 w-full overflow-hidden rounded-xl border border-dashed border-border bg-muted/20 p-6">
            {tasks.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  {t('overlays.taskHud.idleHidden', 'Task HUD is idle and hidden. Press "Add Running" to simulate background jobs.')}
                </p>
              </div>
            ) : null}
            <TaskHud
              tasks={tasks}
              onDismiss={dismiss}
              onCancel={cancel}
              maxVisible={3}
              forceVisible
              className="!absolute max-w-sm"
            />
          </div>
        </ComponentPreview>

        <div className="space-y-4 pt-6">
          <h3 className="text-lg font-semibold text-foreground">{t('showcase.collapseOverflow', 'Collapse & Overflow')}</h3>
          <ComponentPreview
            title={t('desktopComposite.taskHud.overflowSandboxTitle', 'Collapsed & Overflow')}
            reactCode={overflowReactCode}
            qtCode={`ChaSetTaskHud {
    tasks: backlogTasks
    maxVisible: 3
    placement: "bottom-right"
    collapsible: true
    defaultCollapsed: false
}`}
            controls={
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{t('overlays.taskHud.maxVisible', 'Max Visible:')}</span>
                  <SegmentedControl
                    value={maxVisible}
                    onValueChange={(value) => setMaxVisible(String(value))}
                    options={[
                      { label: '2', value: '2' },
                      { label: '3', value: '3' },
                      { label: '5', value: '5' },
                    ]}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{t('overlays.taskHud.placement', 'Placement:')}</span>
                  <SegmentedControl
                    value={placement}
                    onValueChange={(value) => setPlacement(value as TaskHudPlacement)}
                    options={PLACEMENT_OPTIONS.map((option) => ({ label: option.label, value: option.value }))}
                  />
                </div>
                <Button variant="outline" size="sm" onClick={() => setCollapsed((prev) => !prev)}>
                  {collapsed ? t('overlays.taskHud.expandStack', 'Expand Stack') : t('overlays.taskHud.collapseStack', 'Collapse Stack')}
                </Button>
              </div>
            }
          >
            <div className="relative min-h-96 w-full overflow-hidden rounded-xl border border-dashed border-border bg-muted/20 p-6">
              <TaskHud
                key={collapsed ? 'collapsed' : 'expanded'}
                tasks={backlog}
                maxVisible={Number(maxVisible)}
                placement={placement}
                defaultCollapsed={collapsed}
                className="!absolute max-w-sm"
              />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <Badge variant="secondary" size="sm">
                  {t('desktopComposite.taskHud.anchorLabel', 'anchor: {{placement}}', { placement })}
                </Badge>
              </div>
            </div>
          </ComponentPreview>
        </div>
      </section>

      <section id="installation" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('showcase.installation', 'Installation')}</h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      <DocAnatomy
        id="anatomy"
        reactCode={`import { TaskHud } from '@chahu/cha-set';

<TaskHud
  tasks={tasks}
  onDismiss={(id) => removeTask(id)}
  placement="bottom-right"
/>`}
        qtCode={`import ChaSet

ChaSetTaskHud {
    tasks: demoTasks
    placement: "bottom-right"
    onDismissed: function(id) { removeTask(id) }
}`}
      />

      <section id="animations" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('showcase.animations', 'Animations')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('desktopComposite.taskHud.animationsDesc', 'Motion tokens and kinematic timing contracts for the activity stack and its cards.')}
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground">
          <li>
            {t('desktopComposite.taskHud.animEnterPrefix', 'New cards enter with')}{' '}
            <code className="rounded bg-muted px-1 text-xs">duration-medium</code>{' '}
            {t('desktopComposite.taskHud.animEnterMid', '(180ms) and the')}{' '}
            <code className="rounded bg-muted px-1 text-xs">ease-standard</code>{' '}
            {t('desktopComposite.taskHud.animEnterSuffix', 'curve, sliding in from the anchored edge (Qt counterpart:')}{' '}
            <code className="rounded bg-muted px-1 text-xs">ThemeTokens.motionMedium</code> {t('desktopComposite.taskHud.and', 'and')}{' '}
            <code className="rounded bg-muted px-1 text-xs">ThemeTokens.easeStandard</code>
            {t('desktopComposite.taskHud.animEnterEnd', ').')}
          </li>
          <li>
            {t('desktopComposite.taskHud.animExitGhosts', 'Dismissed cards linger as exit ghosts for the same 180ms so the stack reorders underneath them instead of snapping.')}
          </li>
          <li>
            {t('desktopComposite.taskHud.animProgressPrefix', 'Determinate progress transitions over')}{' '}
            <code className="rounded bg-muted px-1 text-xs">duration-medium</code>
            {t('desktopComposite.taskHud.animProgressSuffix', '; indeterminate tasks run an infinite 1.6s shimmer rail.')}
          </li>
          <li>
            {t('desktopComposite.taskHud.animAutoHidePrefix', 'An emptied HUD holds its last frame for')}{' '}
            <code className="rounded bg-muted px-1 text-xs">autoHideDelay</code>
            {t('desktopComposite.taskHud.animAutoHideSuffix', '(600ms) before fading out.')}
          </li>
          <li>
            {t('desktopComposite.taskHud.animReducedPrefix', 'Respects')}{' '}
            <code className="rounded bg-muted px-1 text-xs">prefers-reduced-motion</code>{' '}
            {t('desktopComposite.taskHud.animReducedMid', 'on Web and')}{' '}
            <code className="rounded bg-muted px-1 text-xs">ThemeTokens.animationsEnabled</code>{' '}
            {t('desktopComposite.taskHud.animReducedSuffix', 'in Qt.')}
          </li>
        </ul>
      </section>

      <section id="keyboard" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('showcase.keyboardNavigation', 'Keyboard Navigation')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('desktopComposite.taskHud.keyboardDesc', 'The stack is a single tab stop: cards are roving-focus entries inside it.')}
        </p>
        <KeyboardShortcutsTable componentId="task-hud" />
      </section>

      <section id="props" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">{t('showcase.propsReference', 'Props Reference')}</h2>
        <PropsTable
          items={[
            {
              name: 'tasks',
              type: 'TaskItem[]',
              default: '[]',
              description: t('components.taskHud.propTasks', 'Background executions to surface, oldest first; the newest card sits nearest the anchor.'),
            },
            {
              name: 'onDismiss',
              type: '(id: string) => void',
              default: 'undefined',
              description: t('components.taskHud.propOnDismiss', 'Renders the per-card dismiss control; omit to make cards non-dismissible.'),
            },
            {
              name: 'onCancel',
              type: '(id: string) => void',
              default: 'undefined',
              description: t('components.taskHud.propOnCancel', 'Renders a cancel control on running tasks flagged cancellable.'),
            },
            {
              name: 'maxVisible',
              type: 'number',
              default: '3',
              description: t('components.taskHud.propMaxVisible', 'Cards rendered before the stack overflows into its "show all" pill.'),
            },
            {
              name: 'autoHideDelay',
              type: 'number',
              default: '600',
              description: t('components.taskHud.propAutoHideDelay', 'Grace period in milliseconds an emptied HUD stays on screen before fading out.'),
            },
            {
              name: 'placement',
              type: '"top-left" | "top-center" | "top-right" | "left-center" | "right-center" | "bottom-left" | "bottom-center" | "bottom-right"',
              default: "'bottom-right'",
              description: t('components.taskHud.propPlacement', 'Viewport anchor. Cards enter and exit through the anchored edge.'),
            },
            {
              name: 'offset',
              type: 'number',
              default: '16',
              description: t('components.taskHud.propOffset', 'Inset from the anchored viewport edges, in logical units.'),
            },
            {
              name: 'collapsible',
              type: 'boolean',
              default: 'true',
              description: t('components.taskHud.propCollapsible', 'Offers the collapse-to-summary-row control.'),
            },
            {
              name: 'defaultCollapsed',
              type: 'boolean',
              default: 'false',
              description: t('components.taskHud.propDefaultCollapsed', 'Renders the stack collapsed on first paint.'),
            },
            {
              name: 'forceVisible',
              type: 'boolean',
              default: 'false',
              description: t('components.taskHud.propForceVisible', 'Keeps the HUD mounted while no task is running (used by static sandboxes).'),
            },
            {
              name: 'label',
              type: 'string',
              default: "'Task Progress HUD'",
              description: t('components.taskHud.propLabel', 'Accessible name of the HUD region.'),
            },
          ]}
        />
        <p className="text-sm text-muted-foreground">
          {t('components.taskHud.taskItemFooter', 'Each TaskItem carries id, title, an optional detail, a status of queued | running | success | warning | error | cancelled, a progress ratio (or indeterminate), a total/done step counter and elapsedMs.')}
        </p>
      </section>
    </DocLayout>
  );
}
