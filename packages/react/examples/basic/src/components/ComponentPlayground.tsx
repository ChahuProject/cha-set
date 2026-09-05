import React, { useState } from 'react';
import { Button, type ButtonVariant, type ButtonSize } from '@chahu/cha-set';

export const ComponentPlayground: React.FC = () => {
  const [variant, setVariant] = useState<ButtonVariant>('default');
  const [size, setSize] = useState<ButtonSize>('default');
  const [label, setLabel] = useState('Create Project');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [renderAsLink, setRenderAsLink] = useState(false);
  const [copied, setCopied] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const generatedCode = `<Button
  variant="${variant}"
  size="${size}"${loading ? '\n  loading' : ''}${disabled ? '\n  disabled' : ''}${fullWidth ? '\n  fullWidth' : ''}${
    renderAsLink ? '\n  render={<a href="#project-link" />} nativeButton={false}' : ''
  }
>
  ${label}
</Button>`;

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <section className="block playground-block" id="playground">
      <div className="block-header">
        <div>
          <h2>Interactive Component Sandbox</h2>
          <p className="desc">
            Adjust props live, interact with the component, and copy ready-to-use code directly into your app.
          </p>
        </div>
      </div>

      <div className="playground-grid">
        {/* Controls Column */}
        <div className="playground-controls">
          <div className="control-field">
            <label className="control-label">Variant</label>
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
            <label className="control-label">Size</label>
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
            <label className="control-label">Button Label</label>
            <input
              type="text"
              className="text-input"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Button text"
            />
          </div>

          <div className="control-switches-grid">
            <label className="switch-row">
              <input
                type="checkbox"
                checked={loading}
                onChange={(e) => setLoading(e.target.checked)}
              />
              <span>Loading State</span>
            </label>

            <label className="switch-row">
              <input
                type="checkbox"
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
              />
              <span>Disabled</span>
            </label>

            <label className="switch-row">
              <input
                type="checkbox"
                checked={fullWidth}
                onChange={(e) => setFullWidth(e.target.checked)}
              />
              <span>Full Width</span>
            </label>

            <label className="switch-row">
              <input
                type="checkbox"
                checked={renderAsLink}
                onChange={(e) => setRenderAsLink(e.target.checked)}
              />
              <span>Polymorphic (`&lt;a&gt;` link via Base UI)</span>
            </label>
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
              <span>Clicks: {clickCount}</span>
              {loading && <span className="badge-pill">Loading spinner active</span>}
              {disabled && <span className="badge-pill">Disabled</span>}
            </div>
          </div>

          <div className="code-snippet-box">
            <div className="code-snippet-header">
              <span>React JSX Usage</span>
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={copyCode}>
                {copied ? '✓ Copied' : '📋 Copy JSX'}
              </Button>
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
