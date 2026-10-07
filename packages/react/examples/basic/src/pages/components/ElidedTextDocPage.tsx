import React, { useState } from 'react';
import { ElidedText, Card, Button, Slider, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { ComponentReference } from "../../components/ComponentReference";

export function ElidedTextDocPage() {
  const { t } = useChaSetI18n();
  const [containerWidth, setContainerWidth] = useState(240);
  const [alwaysShow, setAlwaysShow] = useState(false);
  const [copyable, setCopyable] = useState(true);
  const sampleText = 'C:\\Users\\Development\\Projects\\cha-set\\packages\\react\\src\\elided-text\\ElidedText.tsx';

  const heroReactCode = `<div style={{ width: '${(containerWidth / 16).toFixed(3)}rem' }}>
  <ElidedText
    text="${sampleText}"
    alwaysShowTooltip={${alwaysShow}}
    copyable={${copyable}}
    tooltipPlacement="top"
  />
</div>`;

  const heroQtCode = `Item {
    width: ${containerWidth}
    height: 32

    ChaSetElidedText {
        anchors.fill: parent
        text: "${sampleText}"
        alwaysShowTooltip: ${alwaysShow}
        copyable: ${copyable}
        tooltipPlacement: "top"
    }
}`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Elided Text"
      description="Smart text truncation with automatic overflow detection, click-to-copy, and contextual tooltip reveal."
    >
      <section id="overview" className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Interactive Overview</h2>
        <p className="text-sm text-muted-foreground">
          {t('components.elided-text.overviewDesc', 'Resize the container below using the slider. When the text is clipped with an ellipsis, hovering reveals the full path in a tooltip. Click to copy the full path when copyable is enabled.')}
        </p>

        <ComponentPreview title="Elided Text Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t('components.elided-text.widthLabel', 'Width: {{width}}', { width: containerWidth })}</span>
                <div className="w-32">
                  <Slider
                    value={containerWidth}
                    min={120}
                    max={480}
                    step={10}
                    onValueChange={(val) => setContainerWidth(val)}
                  />
                </div>
              </div>
              <Button
                variant={alwaysShow ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAlwaysShow(!alwaysShow)}
              >
                {t('components.elided-text.alwaysShow', 'Always Show: {{status}}', { status: alwaysShow ? t('components.elided-text.on', 'On') : t('components.elided-text.off', 'Off') })}
              </Button>
              <Button
                variant={copyable ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCopyable(!copyable)}
              >
                {t('components.elided-text.copyable', 'Copyable: {{status}}', { status: copyable ? t('components.elided-text.on', 'On') : t('components.elided-text.off', 'Off') })}
              </Button>
            </div>
          }
        >
          <div className="py-6 flex flex-col items-center justify-center">
            <Card className="p-4 bg-muted/20 border-dashed">
              <div
                style={{ width: `${(containerWidth / 16).toFixed(3)}rem` }}
                className="transition-all duration-150 border border-primary/20 p-2 rounded bg-card"
              >
                <ElidedText
                  text={sampleText}
                  alwaysShowTooltip={alwaysShow}
                  copyable={copyable}
                  tooltipPlacement="top"
                />
              </div>
            </Card>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { ElidedText } from '@chahu/cha-set';\n\n<ElidedText text="Sample text..." />`}
        qtCode={`import ChaSet\n\nChaSetElidedText {\n    text: "Sample text..."\n    width: parent.width\n}`}
      />

      <section id="multi-line-clamping" className="space-y-4 pt-6">
        <h2 className="text-xl font-semibold text-foreground" data-toc-title="Multi-Line Clamping">{t('components.elided-text.multiLineTitle', 'Multi-Line Clamping')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('components.elided-text.multiLineDesc', 'Using maxLines={2}, text wraps up to two lines before truncating with an ellipsis.')}
        </p>
        <Card className="p-4 max-w-sm">
          <ElidedText
            maxLines={2}
            text={t('components.elided-text.sampleParagraph', 'ChaSet provides cross-stack design system primitives with pixel-level parity across React Web and Qt Quick desktop applications.')}
            tooltipPlacement="bottom"
          />
        </Card>
      </section>

            {/* Animations */}
      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
          Animations
        </h2>
        <div>
          <p className="text-sm text-muted-foreground mb-4">
            Motion behavior and timing for interactive states aligned with ChaSet tokens.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
            <li>
              State changes (hover, press, focus) animate over{" "}
              <code className="text-xs bg-muted px-1 rounded">duration-quick</code> with the{" "}
              <code className="text-xs bg-muted px-1 rounded">ease-standard</code> curve.
            </li>
            <li>
              Durations and easing resolve from theme tokens, so{" "}
              <code>prefers-reduced-motion</code> zeroes them automatically (Qt: governed by{" "}
              <code>ThemeTokens.animationsEnabled</code>).
            </li>
          </ul>
        </div>
      </section>

      <ComponentReference
        name="ElidedText"
        componentId="elided-text"
        props={[
          {
            name: 'text',
            type: 'string',
            default: "''",
            description: 'The string content to display and measure for overflow.',
          },
          {
            name: 'tooltipText',
            type: 'string',
            default: "''",
            description: 'Custom tooltip text override if different from raw text.',
          },
          {
            name: 'tooltipPlacement',
            type: "'top' | 'bottom' | 'left' | 'right' | 'auto'",
            default: "'top'",
            description: 'Placement direction of the floating tooltip.',
          },
          {
            name: 'tooltipDelay',
            type: 'number',
            default: '400',
            description: 'Delay in milliseconds before showing tooltip on hover.',
          },
          {
            name: 'alwaysShowTooltip',
            type: 'boolean',
            default: 'false',
            description: 'Force tooltip to appear on hover even if text is not elided.',
          },
          {
            name: 'showTooltipWhenElided',
            type: 'boolean',
            default: 'true',
            description: 'Enable tooltip reveal whenever overflow truncation is detected.',
          },
          {
            name: 'maxLines',
            type: 'number',
            default: '1',
            description: 'Maximum visible lines before truncating (1 = single line, >1 = clamp).',
          },
          {
            name: 'copyable',
            type: 'boolean',
            default: 'false',
            description: 'Whether clicking the text copies it to clipboard with instant feedback.',
          },
        ]}
      />
    </DocLayout>
  );
}

