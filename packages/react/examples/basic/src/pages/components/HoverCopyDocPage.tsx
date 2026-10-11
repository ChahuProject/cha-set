import React, { useState } from 'react';
import {
  HoverCopy,
  CopyableBadge,
  Card,
  SegmentedControl,
  Slider,
  Switch,
  useChaSetI18n,
  type HoverCopyRadius,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { ComponentReference } from '../../components/ComponentReference';
import { DocAnatomy } from '../../components/DocAnatomy';
import { KeyboardShortcutsTable } from '../../components/KeyboardShortcutsTable';

const RADIUS_OPTIONS: HoverCopyRadius[] = ['none', 'sm', 'md', 'lg', 'full'];

export function HoverCopyDocPage() {
  const { t } = useChaSetI18n();

  // Demo identifiers stay byte-identical across locales (ElidedText sampleText
  // convention): plain constants, never routed through t().
  const orderTitle = 'Order #1024';
  const orderMeta = 'cha-set / dev-2049';
  const demoToken = 'sk-chaset-demo-token-9182';
  const presetText = t('components.hover-copy.presetText', 'ORDER-1024');
  const resetTarget = 'sk-chaset-reset-2048';
  const truncateText = t('components.hover-copy.truncateText', 'ORDER-2026-0417-PROD-HOTFIX');
  const copiedStatus = t('components.hover-copy.copiedStatus', 'Copied');

  const [previewCopied, setPreviewCopied] = useState(false);
  const [resetTime, setResetTime] = useState(2000);
  const [dim, setDim] = useState(0.45);
  const [radius, setRadius] = useState<HoverCopyRadius>('md');
  const [playgroundDisabled, setPlaygroundDisabled] = useState(false);

  const previewReactCode = `<HoverCopy text="sk-chaset-demo-token-9182">
  <Card className="w-64 p-4">
    <p className="text-sm font-medium text-card-foreground">Order #1024</p>
    <p className="text-xs text-muted-foreground">cha-set / dev-2049</p>
  </Card>
</HoverCopy>`;

  const previewQtCode = `import ChaSet

ChaSetHoverCopy {
    text: "sk-chaset-demo-token-9182"
    radius: "md"
    ChaSetCard {
        width: ThemeTokens.dp(256)
        Column {
            spacing: ThemeTokens.dp(4)
            Text { text: "Order #1024" }
            Text { text: "cha-set / dev-2049" }
        }
    }
}`;

  const presetReactCode = `<CopyableBadge text="ORDER-1024">ORDER-1024</CopyableBadge>`;

  const presetQtCode = `import ChaSet

ChaSetCopyableBadge {
    text: "ORDER-1024"
}`;

  const playgroundReactCode = `const [resetTime, setResetTime] = useState(2000);
const [dim, setDim] = useState(0.45);
const [radius, setRadius] = useState<'none' | 'sm' | 'md' | 'lg' | 'full'>('md');

<HoverCopy text="sk-chaset-reset-2048" resetTime={resetTime} dim={dim} radius={radius} disabled={disabled}>
  <code className="text-xs font-mono">sk-chaset-reset-2048</code>
</HoverCopy>`;

  const playgroundQtCode = `import ChaSet

Column {
    spacing: ThemeTokens.dp(12)
    ChaSetSegmentedControl {
        options: ["none", "sm", "md", "lg", "full"]
        currentValue: "md"
        onCurrentValueChanged: (v) => hoverDemo.radius = v
    }
    ChaSetSlider {
        from: 800; to: 4000; stepSize: 200; value: 2000
        onMoved: (v) => hoverDemo.resetTime = v
    }
    ChaSetSlider {
        from: 0.1; to: 0.8; stepSize: 0.05; value: 0.45
        onMoved: (v) => hoverDemo.dim = v
    }
    ChaSetHoverCopy {
        id: hoverDemo
        text: "sk-chaset-reset-2048"
        radius: "md"
        Text { text: "sk-chaset-reset-2048" }
    }
}`;

  const truncateReactCode = `<HoverCopy text="ORDER-2026-0417-PROD-HOTFIX">
  <span className="block max-w-32 truncate text-sm text-foreground">ORDER-2026-0417-PROD-HOTFIX</span>
</HoverCopy>`;

  const truncateQtCode = `import ChaSet

ChaSetHoverCopy {
    text: "ORDER-2026-0417-PROD-HOTFIX"
    radius: "md"
    Text {
        width: ThemeTokens.dp(128)
        elide: Text.ElideRight
        text: "ORDER-2026-0417-PROD-HOTFIX"
    }
}`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Hover Copy"
      description={t('components.hover-copy.description', 'Hover-dim overlay with centered copy button; clicking anywhere on the overlay copies.')}
      tocItems={[
        { id: 'overview', title: t('showcase.interactiveOverview', 'Interactive Overview') },
        { id: 'installation', title: t('showcase.installation', 'Installation') },
        { id: 'preset', title: t('components.hover-copy.presetTitle', 'CopyableBadge Preset') },
        { id: 'playground', title: t('components.hover-copy.playgroundTitle', 'Timing & Dim Controls') },
        { id: 'animations', title: t('showcase.animations', 'Animations') },
        { id: 'keyboard', title: t('showcase.keyboardNavigation', 'Keyboard Navigation') },
        { id: 'props', title: t('showcase.propsReference', 'Props Reference') },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.hover-copy.overviewDesc', 'Hover the card to reveal a dimmed scrim with a centered copy button. Click anywhere on the overlay to copy the hidden payload to the clipboard.')}
        </p>

        <ComponentPreview
          title={t('showcase.previewTitles.Hover to reveal', 'Hover to reveal')}
          reactCode={previewReactCode}
          qtCode={previewQtCode}
        >
          <div className="flex flex-col items-center gap-3">
            <HoverCopy
              text={demoToken}
              onCopy={() => {
                setPreviewCopied(true);
                window.setTimeout(() => setPreviewCopied(false), 2000);
              }}
            >
              <Card className="w-64 p-4">
                <p className="text-sm font-medium text-card-foreground">{orderTitle}</p>
                <p className="text-xs text-muted-foreground">{orderMeta}</p>
              </Card>
            </HoverCopy>
            <span className="text-xs text-muted-foreground" aria-live="polite">
              {previewCopied
                ? copiedStatus
                : t('components.hover-copy.hoverHint', 'Hover the card, then click anywhere on the overlay to copy.')}
            </span>
          </div>
        </ComponentPreview>
      </section>

      <DocAnatomy
        id="installation"
        title={t('showcase.installation', 'Installation')}
        description={t('components.hover-copy.installationDesc', 'Import HoverCopy or the CopyableBadge preset from the shared package.')}
        reactCode={`import { HoverCopy, CopyableBadge } from '@chahu/cha-set';

<HoverCopy text="sk-chaset-demo-token-9182">
  <Card className="w-64 p-4">
    <p className="text-sm font-medium text-card-foreground">Order #1024</p>
    <p className="text-xs text-muted-foreground">cha-set / dev-2049</p>
  </Card>
</HoverCopy>`}
        qtCode={`import ChaSet

ChaSetHoverCopy {
    text: "sk-chaset-demo-token-9182"
    radius: "md"
}`}
      />

      <section id="preset" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('components.hover-copy.presetTitle', 'CopyableBadge Preset')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.hover-copy.presetDesc', 'CopyableBadge is a thin preset that wraps a secondary Badge in HoverCopy with a pill overlay. It adds no state or timing of its own.')}
        </p>

        <ComponentPreview
          title={t('showcase.previewTitles.CopyableBadge preset', 'CopyableBadge preset')}
          reactCode={presetReactCode}
          qtCode={presetQtCode}
        >
          <div className="flex flex-col items-center gap-3">
            <CopyableBadge text={presetText}>{presetText}</CopyableBadge>
            <span className="text-xs text-muted-foreground">
              {t('components.hover-copy.presetHint', 'Hover the badge to reveal its copy overlay; click anywhere to copy.')}
            </span>
          </div>
        </ComponentPreview>
      </section>

      <section id="playground" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('components.hover-copy.playgroundTitle', 'Timing & Dim Controls')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.hover-copy.playgroundDesc', 'Tune the overlay radius, restore interval, scrim density, and disabled state. The sandbox below mirrors the desktop layout exactly.')}
        </p>

        <ComponentPreview
          title={t('showcase.previewTitles.Timing & Dim Controls', 'Timing & Dim Controls')}
          reactCode={playgroundReactCode}
          qtCode={playgroundQtCode}
        >
          <div className="flex w-full max-w-md flex-col gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t('components.hover-copy.radius', 'Radius')}</span>
                <SegmentedControl
                  size="sm"
                  value={radius}
                  onValueChange={(v) => setRadius(v as HoverCopyRadius)}
                  options={RADIUS_OPTIONS.map((r) => ({ label: r, value: r }))}
                />
              </div>
              <Switch
                size="sm"
                checked={playgroundDisabled}
                onCheckedChange={setPlaygroundDisabled}
                label={t('components.hover-copy.disabled', 'Disabled')}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-xs text-muted-foreground">{t('components.hover-copy.restoreInterval', 'Restore interval')}</span>
              <Slider
                className="flex-1"
                value={resetTime}
                min={800}
                max={4000}
                step={200}
                onValueChange={setResetTime}
              />
              <span className="w-12 shrink-0 text-right text-xs tabular-nums text-foreground">{resetTime}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-28 shrink-0 text-xs text-muted-foreground">{t('components.hover-copy.dimAmount', 'Dim amount')}</span>
              <Slider
                className="flex-1"
                value={dim}
                min={0.1}
                max={0.8}
                step={0.05}
                onValueChange={setDim}
              />
              <span className="w-12 shrink-0 text-right text-xs tabular-nums text-foreground">{dim.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-center rounded-lg border border-border bg-card p-6 text-card-foreground">
              <HoverCopy
                text={resetTarget}
                resetTime={resetTime}
                dim={dim}
                radius={radius}
                disabled={playgroundDisabled}
              >
                <code className="text-xs font-mono">{resetTarget}</code>
              </HoverCopy>
            </div>
          </div>
        </ComponentPreview>
      </section>

      <section id="truncate" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('components.hover-copy.truncateTitle', 'Truncated display, full copy')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.hover-copy.truncateDesc', 'The visible label may be truncated while the copied payload stays the full string.')}
        </p>

        <ComponentPreview
          title={t('showcase.previewTitles.Truncated display full copy', 'Truncated display, full copy')}
          reactCode={truncateReactCode}
          qtCode={truncateQtCode}
        >
          <div className="flex flex-col items-center gap-3">
            <HoverCopy text={truncateText}>
              <span className="block max-w-32 truncate text-sm text-foreground">{truncateText}</span>
            </HoverCopy>
            <span className="text-xs text-muted-foreground">
              {t('components.hover-copy.truncateHint', 'Only the start fits on screen; copying grabs the complete identifier.')}
            </span>
          </div>
        </ComponentPreview>
      </section>

      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
          {t('showcase.animations', 'Animations')}
        </h2>
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            {t('showcase.animationsDesc', 'Motion behavior and timing for interactive states aligned with ChaSet tokens.')}
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
            <li>
              {t('components.hover-copy.animBullet1', 'Overlay reveal and leave animate over duration-quick with the ease-standard curve (Qt: ThemeTokens.motionQuick + easeStandard).')}
            </li>
            <li>
              {t('components.hover-copy.animBullet2', 'The resting-to-success icon swap uses the duration-short token.')}
            </li>
            <li>
              {t('components.hover-copy.animBullet3', 'Durations and easing resolve from theme tokens, so prefers-reduced-motion zeroes them automatically (Qt: governed by ThemeTokens.animationsEnabled). The restore timer is logic timing and is never shortened.')}
            </li>
          </ul>
        </div>
      </section>

      <section id="keyboard" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.keyboardNavigation', 'Keyboard Navigation')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.hover-copy.keyboardDesc', 'Tab focuses the centered button, Enter or Space copies, clicking anywhere on the overlay also copies, and leaving focus dismisses the overlay.')}
        </p>
        <KeyboardShortcutsTable componentId="hover-copy" />
      </section>

      <ComponentReference
        name="HoverCopy"
        componentId="hover-copy"
        shortcuts={[]}
        props={[
          { name: 'text', type: 'string', default: "''", description: t('components.hover-copy.textDesc', 'Payload copied to the clipboard; may differ from the displayed (possibly truncated) content.') },
          { name: 'children', type: 'ReactNode', default: 'undefined', description: t('components.hover-copy.childrenDesc', 'Arbitrary wrapped content the overlay hugs; no assumptions are made about child tags.') },
          { name: 'dim', type: 'number', default: '0.45', description: t('components.hover-copy.dimDesc', 'Black scrim alpha of the hover overlay, 0 to 1, default 0.45.') },
          { name: 'radius', type: "'none' | 'sm' | 'md' | 'lg' | 'full'", default: "'md'", description: t('components.hover-copy.radiusDesc', 'Semantic radius of the overlay: none, sm, md, lg or full (pill).') },
          { name: 'icon', type: "'copy' | 'check'", default: "'copy'", description: t('components.hover-copy.iconDesc', 'Resting overlay icon semantic name, default copy.') },
          { name: 'copiedIcon', type: "'copy' | 'check'", default: "'check'", description: t('components.hover-copy.copiedIconDesc', 'Success icon semantic name, default check.') },
          { name: 'resetTime', type: 'number', default: '2000', description: t('components.hover-copy.resetTimeDesc', 'Milliseconds before restoring after a successful copy, default 2000.') },
          { name: 'disabled', type: 'boolean', default: 'false', description: t('components.hover-copy.disabledDesc', 'When disabled the overlay never appears and copy never fires.') },
          { name: 'onCopy', type: '(text: string) => void', default: 'undefined', description: t('components.hover-copy.onCopyDesc', 'Fired on successful copy with the copied text.') },
          { name: 'onError', type: '(error: unknown) => void', default: 'undefined', description: t('components.hover-copy.onErrorDesc', 'Fired when the clipboard write fails.') },
        ]}
      />
    </DocLayout>
  );
}
