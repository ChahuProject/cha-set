import * as React from 'react';
import {
  PipelineView,
  StepTimeline,
  LogConsole,
  type PipelineJob,
  type PipelineStep,
  useChaSetI18n,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

const SAMPLE_LOGS: Record<string, string[]> = {
  'job-1': [
    '[compiler] Initializing Vulkan GLSL compiler...',
    '[compiler] \u001B[32mStage 1/2: Vertex shader compiled successfully\u001B[0m',
    '[compiler] \u001B[32mStage 2/2: Fragment shader compiled successfully\u001B[0m',
    '[compiler] Pipeline layout validated (0 errors, 0 warnings)',
  ],
  'job-2': [
    '[bench] Initializing benchmark context...',
    '[bench] GPU: NVIDIA GeForce RTX 4090',
    '[bench] Warmup pass completed (144.2 fps)',
    '[bench] \u001B[33mRunning ray tracing reflection stress test...\u001B[0m',
    '[bench] Iteration 1: 142.8 fps (frame delta: 0.12ms)',
    '[bench] Iteration 2: 144.1 fps (frame delta: 0.08ms)',
    '[bench] \u001B[32mActive thermal profile: Nominal (58°C)\u001B[0m',
  ],
  'job-3': [
    '[package] Waiting for benchmark job to conclude...',
  ],
};

export function PipelineViewDocPage() {
  const { t } = useChaSetI18n();
  const [activeJobId, setActiveJobId] = React.useState<string | null>('job-2');

  const sampleSteps: PipelineStep[] = React.useMemo(() => [
    { name: t('desktopComposite.pipelineView.stepParseSpirv', 'Parse SPIR-V Bytecode'), status: 'success', durationMs: 3200 },
    { name: t('desktopComposite.pipelineView.stepDeadCode', 'Dead Code Elimination'), status: 'success', durationMs: 4100 },
    { name: t('desktopComposite.pipelineView.stepRegAlloc', 'Hardware Register Allocation'), status: 'running', durationMs: null },
    { name: t('desktopComposite.pipelineView.stepEmitBinary', 'Emit Target Binary'), status: 'queued', durationMs: null },
  ], [t]);

  const sampleJobs: PipelineJob[] = React.useMemo(() => [
    {
      id: 'job-1',
      name: t('desktopComposite.pipelineView.jobShaderComp', 'Shader Compilation'),
      status: 'success',
      durationMs: 12400,
      steps: [
        { name: t('desktopComposite.pipelineView.stepCompileVertex', 'Compile Vertex Stage'), status: 'success', durationMs: 5000 },
        { name: t('desktopComposite.pipelineView.stepCompileFragment', 'Compile Fragment Stage'), status: 'success', durationMs: 7400 },
      ],
    },
    {
      id: 'job-2',
      name: t('desktopComposite.pipelineView.jobBenchmark', 'Benchmark Suite'),
      status: 'running',
      durationMs: null,
      steps: sampleSteps,
    },
    {
      id: 'job-3',
      name: t('desktopComposite.pipelineView.jobPackage', 'Package Artifacts'),
      status: 'queued',
      durationMs: null,
      steps: [],
    },
  ], [t, sampleSteps]);

  const reactCode = `<PipelineView
  status="running"
  startMs={0}
  endMs={null}
  jobs={jobs}
  activeJobId={activeJobId}
  onSelectJob={setActiveJobId}
  getLogs={jobId => logs[jobId] ?? []}
/>`;

  const qtCode = `ChaSetPipelineView {
    width: parent.width
    status: "running"
    jobs: root.sampleJobs
    activeJobId: "job-2"
    logsSupplier: function(jobId) { return root.getLogsForJob(jobId) }
}`;

  return (
    <DocLayout
      category="Composite Engines"
      title="Pipeline View"
      description="Multi-stage execution view and pipeline center with job tracking, step timelines, and virtualized auto-scrolling log console."
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.pipelineView.overviewHeading', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.pipelineView.overviewDesc', 'A high-performance execution inspector assembling job tracking, vertical step timelines, and virtualized auto-scrolling log consoles. All subcomponents can also be consumed independently.')}
        </p>

        <ComponentPreview title={t('desktopComposite.pipelineView.sandboxTitle', 'Pipeline View Sandbox')} reactCode={reactCode} qtCode={qtCode}>
          <div className="w-full h-[28rem] flex flex-col">
            <PipelineView
              status="running"
              startMs={0}
              endMs={null}
              jobs={sampleJobs}
              activeJobId={activeJobId}
              onSelectJob={setActiveJobId}
              getLogs={jobId => SAMPLE_LOGS[jobId] ?? []}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { PipelineView } from '@chahu/cha-set';

<PipelineView stages={stages} activeStageIndex={0} />`}
        qtCode={`import ChaSet

ChaSetPipelineView {
    width: parent.width
    stages: stagesModel
}`}
      />



      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.animations', 'Animations')}
        </h2>
        <p className="text-sm text-muted-foreground mb-3">
          {t('desktopComposite.pipelineView.animationsDesc', 'Execution transitions and status node states are governed by shared motion tokens:')}
        </p>
        <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1.5 leading-relaxed">
          <li>
            {t('desktopComposite.pipelineView.animationsBullet1', 'Active execution nodes (running, compiling, retrying) display continuous rotation using animate-spin.')}
          </li>
          <li>
            {t('desktopComposite.pipelineView.animationsBullet2', 'Job list hover and selection transitions use duration-quick ease-standard.')}
          </li>
          <li>
            {t('showcase.animationsItem2', 'Durations and easing resolve from theme tokens, so prefers-reduced-motion zeroes them automatically (Qt: governed by ThemeTokens.animationsEnabled).')}
          </li>
        </ul>
      </section>

            <ComponentReference
        name="PipelineView"
        componentId="pipeline-view"
        props={[
            { name: 'status', type: 'PipelineStatus', default: "'running'", description: t('components.pipelineView.statusDesc', 'Overall execution status for summary header badge.') },
            { name: 'startMs', type: 'number', default: '0', description: t('components.pipelineView.startMsDesc', 'Execution start timestamp in epoch milliseconds.') },
            { name: 'endMs', type: 'number | null', default: 'null', description: t('components.pipelineView.endMsDesc', 'Execution completion timestamp; displays formatted duration when non-null.') },
            { name: 'jobs', type: 'PipelineJob[]', default: '[]', description: t('components.pipelineView.jobsDesc', 'Array of jobs belonging to the current execution run.') },
            { name: 'activeJobId', type: 'string | null', default: 'null', description: t('components.pipelineView.activeJobIdDesc', 'Currently selected job id displaying step timeline and logs.') },
            { name: 'onSelectJob', type: '(id: string) => void', default: 'undefined', description: t('components.pipelineView.onSelectJobDesc', 'Callback invoked when a job is selected.') },
            { name: 'onCancel', type: '() => void', default: 'undefined', description: t('components.pipelineView.onCancelDesc', 'Callback invoked when the cancel button is clicked.') },
            { name: 'cancelDisabled', type: 'boolean', default: 'false', description: t('components.pipelineView.cancelDisabledDesc', 'Disables the cancel button.') },
            { name: 'getLogs', type: '(jobId: string) => string[]', default: 'undefined', description: t('components.pipelineView.getLogsDesc', 'Function supplying log lines array for a given job id.') },
            { name: 'jobsTitle', type: 'string', default: "'Jobs'", description: t('components.pipelineView.jobsTitleDesc', 'Title text for the job list sidebar.') },
            { name: 'emptyJobsText', type: 'string', default: "'No jobs'", description: t('components.pipelineView.emptyJobsTextDesc', 'Placeholder text displayed when the job list is empty.') },
            { name: 'headerActionSlot', type: 'ReactNode', default: 'undefined', description: t('components.pipelineView.headerActionSlotDesc', 'Slot for custom actions in the header.') },
          ]}
      />
    </DocLayout>
  );
}
