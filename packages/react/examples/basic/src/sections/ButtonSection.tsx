import { useState } from 'react';
import { Button, ScrollArea, SettingsIcon, useChaSetI18n } from '@chahu/cha-set';

const VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;
const SIZES = ['sm', 'default', 'lg', 'icon'] as const;

export default function ButtonSection() {
  const { t } = useChaSetI18n();
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const push = (msg: string) => setLog((l) => [msg, ...l].slice(0, 5));

  return (
    <section className="block" id="button">
      <div className="block-header">
        <div>
          <h2>{t('desktopComposite.buttonSection.title', 'Components · Button Matrix')}</h2>
          <p className="desc">
            Neutral contract (spec/components/button.ts) implemented via @base-ui/react. Full variant × size matrix,
            polymorphic link rendering, and asynchronous loading states.
          </p>
        </div>
      </div>

      {/* Variant × Size Matrix */}
      {VARIANTS.map((v) => (
        <div className="matrix-row" key={v}>
          <span className="matrix-label">{v}</span>
          {SIZES.map((s) => (
            <Button key={s} variant={v} size={s} onClick={() => push(`${v}/${s} clicked`)}>
              {s === 'icon' ? <SettingsIcon className="size-4" /> : `${v} ${s}`}
            </Button>
          ))}
        </div>
      ))}

      {/* States Row */}
      <div className="matrix-row">
        <span className="matrix-label">{t('desktopComposite.buttonSection.statesLabel', 'states')}</span>
        <Button variant="destructive" onClick={() => push('destructive clicked')}>
          {t('desktopComposite.buttonSection.deleteItem', 'Delete Item')}
        </Button>
        <Button disabled onClick={() => push('never fire')}>
          {t('desktopComposite.buttonSection.disabledButton', 'Disabled Button')}
        </Button>
        <Button
          asChild
          variant="secondary"
          nativeButton={false}
          onClick={() => push('asChild link clicked')}
        >
          <a href="#docs">{t('desktopComposite.buttonSection.asChildLink', 'asChild Link (<a>)')}</a>
        </Button>
      </div>

      {/* Async Loading & Full Width */}
      <div className="matrix-row">
        <span className="matrix-label">{t('desktopComposite.buttonSection.asyncBlock', 'async & block')}</span>
        <Button
          loading={loading}
          onClick={() => {
            setLoading(true);
            push('Async action started (1.2s spinner)');
            window.setTimeout(() => {
              setLoading(false);
              push('Async action finished');
            }, 1200);
          }}
        >
          {loading ? 'Saving Changes…' : 'Simulate Async Action'}
        </Button>
      </div>

      <div className="matrix-row" style={{ marginTop: '0.5rem' }}>
        <span className="matrix-label">fullWidth</span>
        <div style={{ flex: 1 }}>
          <Button fullWidth onClick={() => push('fullWidth clicked')}>
            {t('desktopComposite.buttonSection.fullWidthAction', 'Full Width Block Action')}
          </Button>
        </div>
      </div>

      {/* Interactive Log */}
      <div className="log-container">
        <div className="log-header">
          <span>{t('desktopComposite.buttonSection.logTitle', 'Interaction Log (Click events)')}</span>
          {log.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setLog([])}>
              {t('desktopComposite.buttonSection.clear', 'Clear')}
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-32" viewportClassName="p-3">
          <ul className="list-none m-0 p-0 font-mono text-xs text-muted-foreground space-y-1">
            {log.length === 0 ? (
              <li className="italic opacity-60">{t('desktopComposite.buttonSection.emptyLog', 'Click buttons above to see click events…')}</li>
            ) : (
              log.map((entry, i) => <li key={i}>{entry}</li>)
            )}
          </ul>
        </ScrollArea>
      </div>
    </section>
  );
}
