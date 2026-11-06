import * as React from 'react';
import {
  LogConsole,
  Button,
  useChaSetI18n,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

const INITIAL_LOGS = [
  '[compiler] Initializing Vulkan GLSL compiler v1.3.268...',
  '[compiler] Loading target target-spirv64-vulkan1.3 architecture...',
  '\u001B[32mStage 1/2: Vertex shader compiled successfully (0.04s)\u001B[0m',
  '\u001B[33m[warn] Uniform block binding 2 (CameraParams) exceeds 256 bytes\u001B[0m',
  '\u001B[32mStage 2/2: Fragment shader compiled successfully (0.07s)\u001B[0m',
  '[linker] Generating SPIR-V binary module: pipeline.spv (14.2 KB)',
  '\u001B[32m[ok] Pipeline layout validated (0 errors, 1 warning)\u001B[0m',
];

export function LogConsoleDocPage() {
  const { t } = useChaSetI18n();
  const [lines, setLines] = React.useState<string[]>(INITIAL_LOGS);

  const handleAppendOne = () => {
    const timestamp = new Date().toISOString().substring(11, 19);
    setLines((prev) => [
      ...prev,
      `[${timestamp}] \u001B[36m[telemetry] Worker thread heartbeat ping #${prev.length + 1} (frame latency 0.12ms)\u001B[0m`,
    ]);
  };

  const handleAppendStream = () => {
    const timestamp = new Date().toISOString().substring(11, 19);
    setLines((prev) => [
      ...prev,
      `[${timestamp}] \u001B[35m[optimizer] Running scalar dead-code elimination pass...\u001B[0m`,
      `[${timestamp}] \u001B[35m[optimizer] Inlining 14 functions, pruned 18 instructions\u001B[0m`,
      `[${timestamp}] \u001B[32m[optimizer] Optimization pass concluded in 3.4ms\u001B[0m`,
    ]);
  };

  const handleClear = () => {
    setLines([]);
  };

  const handleReset = () => {
    setLines(INITIAL_LOGS);
  };

  const heroReactCode = `<LogConsole
  lines={[
    "[compiler] Initializing Vulkan GLSL compiler v1.3.268...",
    "\\u001B[32mStage 1/2: Vertex shader compiled successfully (0.04s)\\u001B[0m",
    "\\u001B[33m[warn] Uniform block binding 2 exceeds 256 bytes\\u001B[0m",
    "\\u001B[32m[ok] Pipeline layout validated (0 errors, 1 warning)\\u001B[0m",
  ]}
  showCopy
  showLineCount
  autoScroll
  emptyText="${t('components.logConsole.empty', 'No logs')}"
/>`;

  const heroQtCode = `ChaSetLogConsole {
    width: ThemeTokens.dp(480)
    height: ThemeTokens.dp(260)
    lines: [
        "[compiler] Initializing Vulkan GLSL compiler v1.3.268...",
        "\\u001B[32mStage 1/2: Vertex shader compiled successfully (0.04s)\\u001B[0m",
        "\\u001B[33m[warn] Uniform block binding 2 exceeds 256 bytes\\u001B[0m",
        "\\u001B[32m[ok] Pipeline layout validated (0 errors, 1 warning)\\u001B[0m"
    ]
    showCopy: true
    showLineCount: true
    autoScroll: true
    emptyText: "${t('components.logConsole.empty', 'No logs')}"
}`;

  return (
    <DocLayout
      category="Composite Engines"
      title="Log Console"
      description={t(
        'components.logConsole.description',
        'High-performance virtualized terminal log viewer with auto-scroll, ANSI color parsing, and copy support.',
      )}
    >
      <DocText id="overview-desc" className="text-muted-foreground text-sm mb-4">
        {t(
          'desktopComposite.logConsole.overviewDesc',
          'High-performance virtualized terminal log viewer with auto-scroll, ANSI color parsing, and copy support.',
        )}
      </DocText>

      <ComponentPreview
        title={t('desktopComposite.logConsole.sandboxTitle', 'Log Console Sandbox')}
        reactCode={heroReactCode}
        qtCode={heroQtCode}
      >
        <div className="flex flex-col gap-4 w-full max-w-xl items-center">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Button variant="outline" size="sm" onClick={handleAppendOne}>
              {t('desktopComposite.logConsole.appendLog', 'Append Log Line')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleAppendStream}>
              {t('desktopComposite.logConsole.appendStream', 'Append Batch Stream')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleClear}>
              {t('desktopComposite.logConsole.clearLogs', 'Clear Logs')}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleReset}>
              {t('desktopComposite.logConsole.reset', 'Reset Logs')}
            </Button>
          </div>

          <div className="w-full h-64">
            <LogConsole
              lines={lines}
              showCopy
              showLineCount
              autoScroll
              emptyText={t('components.logConsole.empty', 'No logs')}
            />
          </div>
        </div>
      </ComponentPreview>

      <DocAnatomy
        id="anatomy"
        reactCode={`import { LogConsole } from '@chahu/cha-set';

<LogConsole
  lines={[
    '[compiler] Initializing Vulkan GLSL compiler...',
    '[ok] Pipeline layout validated',
  ]}
  showCopy
  showLineCount
  autoScroll
/>`}
        qtCode={`import ChaSet

ChaSetLogConsole {
    width: parent.width
    height: 220
    lines: [
        "[compiler] Initializing Vulkan GLSL compiler...",
        "[ok] Pipeline layout validated"
    ]
    showCopy: true
    showLineCount: true
    autoScroll: true
}`}
      />

      <DocMarkdown id="log-console" section="animations" />
      <DocMarkdown id="log-console" section="keyboard" />
      <DocMarkdown id="log-console" section="props" />
    </DocLayout>
  );
}
