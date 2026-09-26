import React, { useState } from 'react';
import {
  TaskHud,
  type TaskItem,
  type TaskHudPlacement,
  Button,
  SegmentedControl,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';
import { PropsTable } from '../../components/PropsTable';

const PLACEMENT_OPTIONS: { label: string; value: TaskHudPlacement }[] = [
  { label: 'Bottom Right', value: 'bottom-right' },
  { label: 'Top Right', value: 'top-right' },
  { label: 'Bottom Left', value: 'bottom-left' },
];

const TASK_DEFAULTS = {
  progress: -1,
  indeterminate: false,
  status: 'running' as const,
  cancellable: false,
};

export function TaskHudDocPage() {
  // Preview 1 — live execution sandbox.
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task-1',
      title: 'Packaging Bundle',
      detail: 'Compiling assets and modules',
      progress: 0.65,
      status: 'running',
      elapsedMs: 2400,
      cancellable: true,
    },
    {
      id: 'task-2',
      title: 'Database Migration',
      detail: 'Applied 12 schema patches',
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
    { ...TASK_DEFAULTS, id: 'queue-1', title: 'Indexing Symbols', detail: 'Scanning 4,182 files', indeterminate: true },
    { ...TASK_DEFAULTS, id: 'queue-2', title: 'Optimizing Images', detail: 'Re-encoding 38 assets', progress: 0.42 },
    { ...TASK_DEFAULTS, id: 'queue-3', title: 'Running Unit Tests', detail: 'Suite 7 of 12', progress: 0.58, total: 12, done: 7 },
    { ...TASK_DEFAULTS, id: 'queue-4', title: 'Uploading Artifacts', detail: 'Waiting for credentials', status: 'queued' },
    { ...TASK_DEFAULTS, id: 'queue-5', title: 'Generating Report', detail: 'Coverage summary', progress: -1 },
  ];

  const dismiss = (id: string) => setTasks((prev) => prev.filter((task) => task.id !== id));
  const cancel = (id: string) =>
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, status: 'cancelled' as const, detail: 'Cancelled by user' } : task)),
    );

  const addRunning = () =>
    setTasks((prev) => [
      ...prev,
      {
        ...TASK_DEFAULTS,
        id: `task-${Date.now()}`,
        title: `Build Job #${prev.length + 1}`,
        detail: 'Processing dependencies',
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
        title: `Analyzing AST #${prev.length + 1}`,
        detail: 'Indexing symbols',
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
        detail: status === 'success' ? 'Completed successfully' : 'Compilation error (exit code 1)',
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
      description="Floating task progress and notification HUD stack for background executions."
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Interactive Overview</h2>
        <ComponentPreview
          title="Task HUD Sandbox"
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
              <span className="mr-1 text-muted-foreground">Simulate Tasks:</span>
              <Button variant="outline" size="sm" onClick={addRunning}>
                Add Running
              </Button>
              <Button variant="outline" size="sm" onClick={addIndeterminate}>
                Add Indeterminate
              </Button>
              <Button variant="outline" size="sm" onClick={() => settleFirstRunning('success')}>
                Succeed Task
              </Button>
              <Button variant="outline" size="sm" onClick={() => settleFirstRunning('error')}>
                Fail Task
              </Button>
              <Button variant="outline" size="sm" onClick={() => setTasks([])}>
                Clear All
              </Button>
            </div>
          }
        >
          <div className="relative flex min-h-80 w-full items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Task HUD is idle and hidden. Press "Add Running" to simulate background jobs.
              </p>
            ) : null}
            <TaskHud
              tasks={tasks}
              onDismiss={dismiss}
              onCancel={cancel}
              maxVisible={3}
              forceVisible
              className="!relative !right-0 !bottom-0 !w-full max-w-sm"
            />
          </div>
        </ComponentPreview>
      </section>

      <section id="overflow" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Collapse & Overflow</h2>
        <ComponentPreview
          title="Collapsed & Overflow"
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
                <span className="text-muted-foreground">Max Visible:</span>
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
                <span className="text-muted-foreground">Placement:</span>
                <SegmentedControl
                  value={placement}
                  onValueChange={(value) => setPlacement(value as TaskHudPlacement)}
                  options={PLACEMENT_OPTIONS.map((option) => ({ label: option.label, value: option.value }))}
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => setCollapsed((prev) => !prev)}>
                {collapsed ? 'Expand Stack' : 'Collapse Stack'}
              </Button>
            </div>
          }
        >
          <div className="relative flex min-h-80 w-full items-start justify-center rounded-xl border border-dashed border-border bg-muted/20 p-6">
            <TaskHud
              key={collapsed ? 'collapsed' : 'expanded'}
              tasks={backlog}
              maxVisible={Number(maxVisible)}
              placement={placement}
              defaultCollapsed={collapsed}
              className="!relative !right-0 !bottom-0 !w-full max-w-sm"
            />
            <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-muted-foreground md:text-[0.6875rem]">
              anchor: <code className="rounded bg-muted px-1">{placement}</code>
            </p>
          </div>
        </ComponentPreview>
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
        <h2 className="text-xl font-semibold text-foreground">Animations</h2>
        <p className="text-sm text-muted-foreground">
          Motion tokens and kinematic timing contracts for the activity stack and its cards.
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-foreground">
          <li>
            New cards enter with <code className="rounded bg-muted px-1 text-xs">duration-medium</code> (180ms) and the{' '}
            <code className="rounded bg-muted px-1 text-xs">ease-standard</code> curve, sliding in from the anchored
            edge (Qt counterpart:{' '}
            <code className="rounded bg-muted px-1 text-xs">ThemeTokens.motionMedium</code> and{' '}
            <code className="rounded bg-muted px-1 text-xs">ThemeTokens.easeStandard</code>).
          </li>
          <li>
            Dismissed cards linger as exit ghosts for the same 180ms so the stack reorders underneath them instead of
            snapping.
          </li>
          <li>
            Determinate progress transitions over{' '}
            <code className="rounded bg-muted px-1 text-xs">duration-medium</code>; indeterminate tasks run an infinite
            1.6s shimmer rail.
          </li>
          <li>
            An emptied HUD holds its last frame for{' '}
            <code className="rounded bg-muted px-1 text-xs">autoHideDelay</code> (600ms) before fading out.
          </li>
          <li>
            Respects <code className="rounded bg-muted px-1 text-xs">prefers-reduced-motion</code> on Web and{' '}
            <code className="rounded bg-muted px-1 text-xs">ThemeTokens.animationsEnabled</code> in Qt.
          </li>
        </ul>
      </section>

      <section id="keyboard" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Keyboard Navigation</h2>
        <p className="text-sm text-muted-foreground">
          The stack is a single tab stop: cards are roving-focus entries inside it.
        </p>
        <KeyboardShortcutsTable componentId="task-hud" />
      </section>

      <section id="props" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Props Reference</h2>
        <PropsTable
          items={[
            {
              name: 'tasks',
              type: 'TaskItem[]',
              default: '[]',
              description: 'Background executions to surface, oldest first; the newest card sits nearest the anchor.',
            },
            {
              name: 'onDismiss',
              type: '(id: string) => void',
              default: 'undefined',
              description: 'Renders the per-card dismiss control; omit to make cards non-dismissible.',
            },
            {
              name: 'onCancel',
              type: '(id: string) => void',
              default: 'undefined',
              description: 'Renders a cancel control on running tasks flagged cancellable.',
            },
            {
              name: 'maxVisible',
              type: 'number',
              default: '3',
              description: 'Cards rendered before the stack overflows into its "show all" pill.',
            },
            {
              name: 'autoHideDelay',
              type: 'number',
              default: '600',
              description: 'Grace period in milliseconds an emptied HUD stays on screen before fading out.',
            },
            {
              name: 'placement',
              type: '"top-left" | "top-center" | "top-right" | "left-center" | "right-center" | "bottom-left" | "bottom-center" | "bottom-right"',
              default: "'bottom-right'",
              description: 'Viewport anchor. Cards enter and exit through the anchored edge.',
            },
            {
              name: 'offset',
              type: 'number',
              default: '16',
              description: 'Inset from the anchored viewport edges, in logical units.',
            },
            {
              name: 'collapsible',
              type: 'boolean',
              default: 'true',
              description: 'Offers the collapse-to-summary-row control.',
            },
            {
              name: 'defaultCollapsed',
              type: 'boolean',
              default: 'false',
              description: 'Renders the stack collapsed on first paint.',
            },
            {
              name: 'forceVisible',
              type: 'boolean',
              default: 'false',
              description: 'Keeps the HUD mounted while no task is running (used by static sandboxes).',
            },
            {
              name: 'label',
              type: 'string',
              default: "'Task Progress HUD'",
              description: 'Accessible name of the HUD region.',
            },
          ]}
        />
        <p className="text-sm text-muted-foreground">
          Each <code className="rounded bg-muted px-1 text-xs">TaskItem</code> carries{' '}
          <code className="rounded bg-muted px-1 text-xs">id</code>,{' '}
          <code className="rounded bg-muted px-1 text-xs">title</code>, an optional{' '}
          <code className="rounded bg-muted px-1 text-xs">detail</code>, a{' '}
          <code className="rounded bg-muted px-1 text-xs">status</code> of{' '}
          <code className="rounded bg-muted px-1 text-xs">queued | running | success | warning | error | cancelled</code>
          , a <code className="rounded bg-muted px-1 text-xs">progress</code> ratio (or{' '}
          <code className="rounded bg-muted px-1 text-xs">indeterminate</code>), a{' '}
          <code className="rounded bg-muted px-1 text-xs">total</code>/
          <code className="rounded bg-muted px-1 text-xs">done</code> step counter and{' '}
          <code className="rounded bg-muted px-1 text-xs">elapsedMs</code>.
        </p>
      </section>
    </DocLayout>
  );
}
