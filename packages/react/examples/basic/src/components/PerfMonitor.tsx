import * as React from 'react';
import { Card, useChaSetI18n } from '@chahu/cha-set';

export interface PerfMonitorProps {
  defaultVisible?: boolean;
}

export function PerfMonitor({ defaultVisible = false }: PerfMonitorProps) {
  const { t } = useChaSetI18n();
  const [visible, setVisible] = React.useState(defaultVisible);
  const [fps, setFps] = React.useState(60);
  const [domCount, setDomCount] = React.useState(0);
  const [heapMb, setHeapMb] = React.useState<number | null>(null);

  // Toggle visibility with Ctrl+Alt+P / Cmd+Alt+P
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        setVisible((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Frame rate and DOM node measurement loop
  React.useEffect(() => {
    if (!visible) return;

    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measure = (now: number) => {
      frameCount++;
      const elapsed = now - lastTime;
      if (elapsed >= 500) {
        setFps(Math.round((frameCount * 1000) / elapsed));
        frameCount = 0;
        lastTime = now;

        // Count active DOM elements
        setDomCount(document.querySelectorAll('*').length);

        // Memory info if available in chromium
        const perf = window.performance as unknown as { memory?: { usedJSHeapSize: number } };
        if (perf?.memory?.usedJSHeapSize) {
          setHeapMb(Math.round((perf.memory.usedJSHeapSize / (1024 * 1024)) * 10) / 10);
        }
      }
      animId = requestAnimationFrame(measure);
    };

    animId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(animId);
  }, [visible]);

  if (!visible) return null;

  const fpsColor =
    fps >= 55 ? 'text-emerald-500' : fps >= 30 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none animate-in fade-in slide-in-from-bottom-2 duration-150">
      <Card className="px-3 py-2 bg-card/95 backdrop-blur-md shadow-lg border border-border flex items-center gap-3 text-xs font-mono">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-muted-foreground font-sans">{t('showcase.telemetryFps', 'FPS')}:</span>
          <span className={`font-bold ${fpsColor}`}>{fps}</span>
        </div>

        <div className="h-3 w-px bg-border" />

        <div className="flex items-center gap-1.5">
          <span className="text-muted-foreground font-sans">{t('showcase.telemetryDom', 'DOM')}:</span>
          <span className="text-foreground">{domCount.toLocaleString()}</span>
        </div>

        {heapMb !== null && (
          <>
            <div className="h-3 w-px bg-border" />
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground font-sans">{t('showcase.telemetryHeap', 'Heap')}:</span>
              <span className="text-foreground">{heapMb}MB</span>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={() => setVisible(false)}
          className="ml-1 text-muted-foreground hover:text-foreground transition-colors"
          title={t('showcase.telemetryClose', 'Close (Ctrl+Alt+P to reopen)')}
          aria-label={t('showcase.telemetryClose', 'Close (Ctrl+Alt+P to reopen)')}
        >
          ×
        </button>
      </Card>
    </div>
  );
}
