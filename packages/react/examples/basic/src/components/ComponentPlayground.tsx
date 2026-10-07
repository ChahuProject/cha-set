import React, { useState } from 'react';
import { Button, Badge, Input, Checkbox, CopyButton, useChaSetI18n, type ButtonVariant, type ButtonSize } from '@chahu/cha-set';

export const ComponentPlayground: React.FC = () => {
  const { t } = useChaSetI18n();
  const [variant, setVariant] = useState<ButtonVariant>('default');
  const [size, setSize] = useState<ButtonSize>('default');
  const [label, setLabel] = useState(t('getStarted.themeTuner.playground.defaultProjectLabel', 'Create Project'));
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [renderAsLink, setRenderAsLink] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const generatedCode = `<Button
  variant="${variant}"
  size="${size}"${loading ? '\n  loading' : ''}${disabled ? '\n  disabled' : ''}${fullWidth ? '\n  fullWidth' : ''}${
    renderAsLink ? '\n  render={<a href="#project-link" />} nativeButton={false}' : ''
  }
>
  ${label}
</Button>`;

  return (
    <section className="block playground-block" id="playground">
      <div className="block-header">
        <div>
          <h2>{t('getStarted.themeTuner.playground.title', 'Interactive Component Sandbox')}</h2>
          <p className="desc">
            {t('getStarted.themeTuner.playground.desc', 'Adjust props live, interact with the component, and copy ready-to-use code directly into your app.')}
          </p>
        </div>
      </div>

      <div className="playground-grid">
        {/* Controls Column */}
        <div className="playground-controls">
          <div className="control-field">
            <label className="control-label">{t('getStarted.themeTuner.playground.variant', 'Variant')}</label>
            <div className="chip-selector flex flex-wrap gap-1">
              {(['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const).map((v) => (
                <Button
                  key={v}
                  type="button"
                  variant={variant === v ? 'default' : 'outline'}
                  size="sm"
                  className="h-6 px-2 text-xs capitalize"
                  onClick={() => setVariant(v)}
                >
                  {v}
                </Button>
              ))}
            </div>
          </div>

          <div className="control-field">
            <label className="control-label">{t('getStarted.themeTuner.playground.size', 'Size')}</label>
            <div className="chip-selector flex flex-wrap gap-1">
              {(['default', 'sm', 'lg', 'icon'] as const).map((s) => (
                <Button
                  key={s}
                  type="button"
                  variant={size === s ? 'default' : 'outline'}
                  size="sm"
                  className="h-6 px-2 text-xs uppercase"
                  onClick={() => setSize(s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>

          <div className="control-field">
            <label className="control-label">{t('getStarted.themeTuner.playground.buttonLabel', 'Button Label')}</label>
            <Input
              size="sm"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={t('getStarted.themeTuner.playground.buttonPlaceholder', 'Button text')}
              className="h-8 text-xs"
            />
          </div>

          <div className="control-switches-grid">
            <Checkbox
              size="sm"
              checked={loading}
              onCheckedChange={(val) => setLoading(val)}
              label={t('getStarted.themeTuner.playground.loadingState', 'Loading State')}
            />

            <Checkbox
              size="sm"
              checked={disabled}
              onCheckedChange={(val) => setDisabled(val)}
              label={t('getStarted.themeTuner.playground.disabled', 'Disabled')}
            />

            <Checkbox
              size="sm"
              checked={fullWidth}
              onCheckedChange={(val) => setFullWidth(val)}
              label={t('getStarted.themeTuner.playground.fullWidth', 'Full Width')}
            />

            <Checkbox
              size="sm"
              checked={renderAsLink}
              onCheckedChange={(val) => setRenderAsLink(val)}
              label={t('getStarted.themeTuner.playground.renderAsLink', 'Polymorphic (<a> link via Base UI)')}
            />
          </div>
        </div>

        {/* Live Preview & Code Column */}
        <div className="playground-stage">
          <div className="stage-canvas">
            <div className={`preview-wrapper ${fullWidth ? 'w-full' : ''}`}>
              {renderAsLink ? (
                <Button
                  variant={variant}
                  size={size}
                  loading={loading}
                  disabled={disabled}
                  fullWidth={fullWidth}
                  render={<a href="#project-link" />}
                  nativeButton={false}
                  onClick={() => setClickCount((c) => c + 1)}
                >
                  {label}
                </Button>
              ) : (
                <Button
                  variant={variant}
                  size={size}
                  loading={loading}
                  disabled={disabled}
                  fullWidth={fullWidth}
                  onClick={() => setClickCount((c) => c + 1)}
                >
                  {label}
                </Button>
              )}
            </div>
            <div className="stage-feedback">
              <span>{t('getStarted.themeTuner.playground.clicks', 'Clicks: {{count}}', { count: clickCount })}</span>
              {loading && <Badge size="sm" variant="secondary">{t('getStarted.themeTuner.playground.loadingSpinnerActive', 'Loading spinner active')}</Badge>}
              {disabled && <Badge size="sm" variant="destructive">{t('getStarted.themeTuner.playground.disabled', 'Disabled')}</Badge>}
            </div>
          </div>

          <div className="code-snippet-box">
            <div className="code-snippet-header">
              <span>{t('getStarted.themeTuner.playground.jsxUsage', 'React JSX Usage')}</span>
              <CopyButton
                text={generatedCode}
                label={t('getStarted.themeTuner.playground.copyJsx', 'Copy JSX')}
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs"
              />
            </div>
            <pre className="code-snippet-pre">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
