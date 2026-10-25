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
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

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
  const [resetTime, setResetTime] = useState(1000);
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

  const playgroundReactCode = `const [resetTime, setResetTime] = useState(1000);
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
        from: 400; to: 3000; stepSize: 100; value: 1000
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
        <DocText role="h2" className="mb-3">
          {t('showcase.interactiveOverview', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('components.hover-copy.overviewDesc', 'Hover the card to reveal a dimmed scrim with a centered copy button. Click anywhere on the overlay to copy the hidden payload to the clipboard.')}
        </DocText>

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
                window.setTimeout(() => setPreviewCopied(false), 1000);
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
        <DocText role="h2" className="mb-3">
          {t('components.hover-copy.presetTitle', 'CopyableBadge Preset')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('components.hover-copy.presetDesc', 'CopyableBadge is a thin preset that wraps a secondary Badge in HoverCopy with a pill overlay. It adds no state or timing of its own.')}
        </DocText>

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
        <DocText role="h2" className="mb-3">
          {t('components.hover-copy.playgroundTitle', 'Timing & Dim Controls')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('components.hover-copy.playgroundDesc', 'Tune the overlay radius, restore interval, scrim density, and disabled state. The sandbox below mirrors the desktop layout exactly.')}
        </DocText>

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
                min={400}
                max={3000}
                step={100}
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
        <DocText role="h2" className="mb-3">
          {t('components.hover-copy.truncateTitle', 'Truncated display, full copy')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('components.hover-copy.truncateDesc', 'The visible label may be truncated while the copied payload stays the full string.')}
        </DocText>

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

      <DocMarkdown id="hover-copy" section="animations" />

            <DocMarkdown id="hover-copy" section="keyboard" />

      <DocMarkdown id="hover-copy" section="props" />
    </DocLayout>
  );
}
