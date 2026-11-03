import * as React from 'react';
import {
  StepTimeline,
  type PipelineStep,
  Button,
  Card,
  useChaSetI18n,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocText } from '../../components/DocText';

export function StepTimelineDocPage() {
  const { t } = useChaSetI18n();

  const initialSteps: PipelineStep[] = React.useMemo(
    () => [
      {
        name: t('desktopComposite.stepTimeline.stepLint', 'Lint & Typecheck'),
        status: 'success',
        durationMs: 1450,
      },
      {
        name: t('desktopComposite.stepTimeline.stepBuild', 'Compile Application Bundle'),
        status: 'success',
        durationMs: 8200,
      },
      {
        name: t('desktopComposite.stepTimeline.stepTest', 'Unit & Integration Test Suite'),
        status: 'running',
        durationMs: null,
      },
      {
        name: t('desktopComposite.stepTimeline.stepPackage', 'Generate Release Package'),
        status: 'queued',
        durationMs: null,
      },
      {
        name: t('desktopComposite.stepTimeline.stepDeploy', 'Deploy to Edge Cluster'),
        status: 'cancelled',
        durationMs: null,
      },
    ],
    [t],
  );

  const [steps, setSteps] = React.useState<PipelineStep[]>(initialSteps);
  const [showEmpty, setShowEmpty] = React.useState(false);

  const activeSteps = showEmpty ? [] : steps;

  const handleToggleEmpty = () => {
    setShowEmpty((prev) => !prev);
  };

  const handleAddStep = () => {
    const nextStep: PipelineStep = {
      name: `${t('desktopComposite.stepTimeline.stepBuild', 'Compile Application Bundle')} (${steps.length + 1})`,
      status: 'queued',
      durationMs: null,
    };
    setSteps((prev) => [...prev, nextStep]);
    setShowEmpty(false);
  };

  const handleReset = () => {
    setSteps(initialSteps);
    setShowEmpty(false);
  };

  const heroReactCode = `<StepTimeline
  steps={[
    { name: "${t('desktopComposite.stepTimeline.stepLint', 'Lint & Typecheck')}", status: "success", durationMs: 1450 },
    { name: "${t('desktopComposite.stepTimeline.stepBuild', 'Compile Application Bundle')}", status: "success", durationMs: 8200 },
    { name: "${t('desktopComposite.stepTimeline.stepTest', 'Unit & Integration Test Suite')}", status: "running", durationMs: null },
    { name: "${t('desktopComposite.stepTimeline.stepPackage', 'Generate Release Package')}", status: "pending", durationMs: null },
  ]}
  emptyText="${t('components.stepTimeline.emptyText', 'No steps')}"
/>`;

  const heroQtCode = `ChaSetStepTimeline {
    steps: [
        { name: "${t('desktopComposite.stepTimeline.stepLint', 'Lint & Typecheck')}", status: "success", durationMs: 1450 },
        { name: "${t('desktopComposite.stepTimeline.stepBuild', 'Compile Application Bundle')}", status: "success", durationMs: 8200 },
        { name: "${t('desktopComposite.stepTimeline.stepTest', 'Unit & Integration Test Suite')}", status: "running", durationMs: null },
        { name: "${t('desktopComposite.stepTimeline.stepPackage', 'Generate Release Package')}", status: "pending", durationMs: null }
    ]
    emptyText: "${t('components.stepTimeline.emptyText', 'No steps')}"
}`;

  return (
    <DocLayout
      category="Composite Engines"
      title="Step Timeline"
      description={t(
        'components.stepTimeline.description',
        'Sequential vertical execution step timeline with status indicators and formatted durations.',
      )}
      tocItems={[
        { id: 'overview', title: t('showcase.interactiveOverview', 'Interactive Overview') },
        { id: 'installation', title: t('showcase.installation', 'Installation') },
        { id: 'animations', title: t('showcase.animations', 'Animations') },
        { id: 'keyboard', title: t('showcase.keyboardNavigation', 'Keyboard Navigation') },
        { id: 'props', title: t('showcase.propsReference', 'Props Reference') },
      ]}
    >
      <DocText id="overview-desc" className="text-muted-foreground text-sm mb-4">
        {t(
          'desktopComposite.stepTimeline.overviewDesc',
          'Sequential vertical execution step timeline with status indicators, dynamic duration formatting, and empty state.',
        )}
      </DocText>

      <ComponentPreview
        title={t('desktopComposite.stepTimeline.sandboxTitle', 'Step Timeline Sandbox')}
        reactCode={heroReactCode}
        qtCode={heroQtCode}
      >
        <div className="flex flex-col gap-6 w-full max-w-md items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleToggleEmpty}>
              {t('desktopComposite.stepTimeline.toggleEmpty', 'Toggle Empty State')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddStep}>
              {t('desktopComposite.stepTimeline.addStep', 'Add Step')}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleReset}>
              {t('desktopComposite.stepTimeline.reset', 'Reset Steps')}
            </Button>
          </div>

          <Card className="p-4 w-full">
            <StepTimeline
              steps={activeSteps}
              emptyText={t('components.stepTimeline.emptyText', 'No steps')}
            />
          </Card>
        </div>
      </ComponentPreview>

      <section id="installation" className="mt-8 scroll-mt-20">
        <DocText role="h2">{t('showcase.installation', 'Installation')}</DocText>
        <div className="mt-4 rounded-lg border border-border bg-card p-4 font-mono text-xs">
          <code>npm install @chahu/cha-set</code>
        </div>
      </section>

      <DocMarkdown id="step-timeline" section="animations" />
      <DocMarkdown id="step-timeline" section="keyboard" />
      <DocMarkdown id="step-timeline" section="props" />
    </DocLayout>
  );
}
