import React, { useState } from 'react';
import { TaskHud, type TaskItem, Card, CodeBlock, Button } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { PropsTable } from '../../components/PropsTable';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

export function TaskHudDocPage() {
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task-1',
      title: 'Packaging Bundle',
      detail: 'Compiling assets and modules',
      progress: 0.65,
      status: 'running',
      elapsedMs: 2400,
    },
    {
      id: 'task-2',
      title: 'Database Migration',
      detail: 'Applied 12 schema patches',
      status: 'success',
      total: 12,
      done: 12,
    },
  ]);

  const handleDismiss = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addRunningTask = () => {
    const id = `task-${Date.now()}`;
    const newTask: TaskItem = {
      id,
      title: `Build Job #${tasks.length + 1}`,
      detail: 'Processing dependencies',
      progress: 0.35,
      status: 'running',
      elapsedMs: 800,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const addIndeterminateTask = () => {
    const id = `task-${Date.now()}`;
    const newTask: TaskItem = {
      id,
      title: `Analyzing AST #${tasks.length + 1}`,
      detail: 'Indexing symbols',
      status: 'running',
      indeterminate: true,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const succeedFirstTask = () => {
    setTasks((prev) => {
      const runningIdx = prev.findIndex((t) => t.status === 'running');
      if (runningIdx === -1) return prev;
      const next = [...prev];
      next[runningIdx] = {
        ...next[runningIdx],
        status: 'success',
        progress: 1.0,
        detail: 'Completed successfully',
      };
      return next;
    });
  };

  const failFirstTask = () => {
    setTasks((prev) => {
      const runningIdx = prev.findIndex((t) => t.status === 'running');
      if (runningIdx === -1) return prev;
      const next = [...prev];
      next[runningIdx] = {
        ...next[runningIdx],
        status: 'error',
        detail: 'Compilation error (exit code 1)',
      };
      return next;
    });
  };

  const clearAllTasks = () => {
    setTasks([]);
  };

  const heroReactCode = `<TaskHud
  tasks={tasks}
  maxVisible={3}
  autoHideDelay={600}
  onDismiss={(id) => setTasks((prev) => prev.filter((t) => t.id !== id))}
/>`;

  return (
    <DocLayout
      category="Overlays & Feedback"
      title="Task HUD"
      description="Floating task progress and notification HUD stack for background executions."
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'animations', title: 'Animations' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Interactive Overview</h2>
        <ComponentPreview
          qtCode={`ChaSetTaskHud {
    tasks: demoTasks
    maxVisible: 3
    autoHideDelay: 600
    onDismissed: (id) => dismissTask(id)
}`}
          title="Task HUD Sandbox"
          reactCode={heroReactCode}
          controls={
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground mr-1">Simulate Tasks:</span>
              <Button variant="outline" size="sm" onClick={addRunningTask}>
                + Add Running
              </Button>
              <Button variant="outline" size="sm" onClick={addIndeterminateTask}>
                + Add Indeterminate
              </Button>
              <Button variant="outline" size="sm" onClick={succeedFirstTask}>
                Succeed Task
              </Button>
              <Button variant="outline" size="sm" onClick={failFirstTask}>
                Fail Task
              </Button>
              <Button variant="outline" size="sm" onClick={clearAllTasks}>
                Clear All
              </Button>
            </div>
          }
        >
          <div className="w-full min-h-80 relative flex items-center justify-center p-6 bg-muted/20 border border-dashed border-border rounded-xl">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Task HUD is idle and hidden. Click "+ Add Running" to simulate background jobs.
              </p>
            ) : null}
            <TaskHud
              tasks={tasks}
              onDismiss={handleDismiss}
              maxVisible={3}
              forceVisible
              className="!relative !bottom-0 !right-0 !w-full max-w-sm"
            />
          </div>
        </ComponentPreview>
      </section>

      <section id="installation" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Installation</h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />
      </section>

      <section id="animations" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Animations</h2>
        <p className="text-sm text-muted-foreground">
          Motion tokens and kinematic timing contracts for TaskHud stack and cards.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            Card push-up and slide-in transitions animate smoothly over{' '}
            <code className="text-xs bg-muted px-1 rounded">duration-medium</code> (180ms) using{' '}
            <code className="text-xs bg-muted px-1 rounded">ease-out</code> curve (Qt counterpart:{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.motionMedium</code> and{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.easeStandard</code>).
          </li>
          <li>
            Determinate progress transitions animate smoothly over 220ms, and running indeterminate
            tasks display an infinite 1.4s shimmer animation guarded by global motion settings.
          </li>
          <li>
            Auto-hide delay operates on a 600ms countdown when task queue becomes empty.
          </li>
          <li>
            Respects <code className="text-xs bg-muted px-1 rounded">prefers-reduced-motion</code> on Web and{' '}
            <code className="text-xs bg-muted px-1 rounded">ThemeTokens.animationsEnabled</code> in Qt.
          </li>
        </ul>
      </section>

      <section id="keyboard" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground">Keyboard Navigation</h2>
        <p className="text-sm text-muted-foreground">
          Keyboard shortcuts and button activation patterns.
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
              description: 'Array of active or completed task objects.',
            },
            {
              name: 'onDismiss',
              type: '(id: string) => void',
              default: 'undefined',
              description: 'Callback invoked when a task card dismiss button is activated.',
            },
            {
              name: 'maxVisible',
              type: 'number',
              default: '3',
              description: 'Maximum number of task cards displayed in the stack before collapsing.',
            },
            {
              name: 'autoHideDelay',
              type: 'number',
              default: '600',
              description: 'Delay in milliseconds before fading out after the task queue is empty.',
            },
            {
              name: 'placement',
              type: 'string',
              default: "'bottom-right'",
              description: 'Viewport anchor positioning ("bottom-right", "bottom-left", "top-right", "top-left").',
            },
            {
              name: 'forceVisible',
              type: 'boolean',
              default: 'false',
              description: 'Forces visibility for static previews or testing harnesses.',
            },
          ]}
        />
      </section>
    </DocLayout>
  );
}
