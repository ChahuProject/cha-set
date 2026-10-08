import React, { useState } from 'react';
import { Squircle, Button, Card, Badge, Input, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocFooterSections } from '../../components/DocFooterSections';

export function SquircleDocPage() {
  const { t } = useChaSetI18n();
  const [radius, setRadius] = useState(16);
  const [smoothing, setSmoothing] = useState(0.6);

  const heroReactCode = `<Squircle
  radius={${radius}}
  smoothing={${smoothing.toFixed(2)}}
  className="w-48 h-32 bg-primary/10 border border-primary/30 flex items-center justify-center p-4 text-center text-sm font-medium"
>
  iOS Continuous Squircle (${Math.round(smoothing * 100)}%)
</Squircle>`;

  const heroQtCode = `ChaSetSquircle {
    width: 192
    height: 128
    radius: ${radius}
    cornerSmoothing: ${smoothing.toFixed(2)}
    color: Qt.rgba(48/255, 160/255, 255/255, 0.1)
    border.color: ThemeTokens.accent
    border.width: 1

    Text {
        anchors.centerIn: parent
        text: "iOS Continuous Squircle (${Math.round(smoothing * 100)}%)"
        color: ThemeTokens.text
    }
}`;

  const globalCssSnippet = `/* globals.css — 全局 CSS 连续曲率超椭圆加速 */
@supports (corner-shape: squircle) {
  *,
  ::before,
  ::after {
    corner-shape: squircle;
  }

  /* 保持纯圆 Pill / Avatar 徽章不受连续曲率形变影响 */
  .rounded-full,
  [data-shape="round"] {
    corner-shape: round;
  }
}`;

  const progressiveComponentSnippet = `import React from 'react';
import { Squircle } from '@chahu/cha-set';

export function PremiumCard({ children }: { children: React.ReactNode }) {
  return (
    <Squircle
      radius={16}
      smoothing={0.6}
      borderWidth={1}
      borderColor="var(--border)"
      className="bg-card text-card-foreground p-6 shadow-sm"
    >
      {children}
    </Squircle>
  );
}`;

  const tokensConfigSnippet = `/* Design Tokens Configuration — 全局设计令牌配置 */
:root {
  --cs-corner-shape: squircle;
  --cs-corner-smoothing: 0.6;
}

/* 主题级曲率覆盖示例 */
[data-theme="ios"] {
  --cs-corner-shape: squircle;
  --cs-corner-smoothing: 0.6;
}

[data-theme="classic"] {
  --cs-corner-shape: round;
  --cs-corner-smoothing: 0.0;
}`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Squircle"
      description={t('components.squircle.description', 'iOS continuous curvature superellipse rounded corners (G2 continuity). Eliminates harsh creases caused by abrupt curvature transitions in classic circular arcs, providing smooth, organic modern corners across the design system.')}
      tocItems={[
        { id: 'overview', title: t('desktopComposite.squircle.overviewHeading', 'Interactive Overview') },
        { id: 'installation', title: t('desktopComposite.squircle.installHeading', 'Installation') },
        { id: 'animations', title: t('showcase.animations', 'Animations') },
        { id: 'keyboard', title: t('showcase.keyboardNavigation', 'Keyboard Navigation') },
        { id: 'props', title: t('showcase.propsReference', 'Props Reference') },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold mb-4 text-foreground">{t('desktopComposite.squircle.overviewHeading', 'Interactive Overview')}</h2>
        <ComponentPreview
          title={t('desktopComposite.squircle.sandboxTitle', 'Squircle Sandbox & Curvature Comparison')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
        >
          <div className="w-full flex flex-col gap-6 py-4">
            {/* Interactive Sandbox */}
            <div className="flex flex-wrap items-center justify-center gap-8">
              {/* Active Squircle */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-44 h-28 bg-primary/15 border-2 border-primary flex items-center justify-center text-center p-3 text-sm font-medium text-foreground transition-all shadow-sm"
                  style={{
                    borderRadius: `${radius * 0.0625}rem`,
                    ['cornerShape' as string]: 'squircle',
                    ['--cs-corner-smoothing' as string]: smoothing,
                  }}
                  data-corner-shape="squircle"
                >
                  <span>{t('components.squircle.squircleLabel', 'Squircle (Smoothing: {{smoothing}}%)', { smoothing: (smoothing * 100).toFixed(0) })}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{t('components.squircle.radiusLabel', 'Radius: {{radius}}', { radius })} | S: {smoothing.toFixed(2)}</span>
              </div>

              {/* Standard Round Comparison */}
              <div className="flex flex-col items-center gap-2">
                <div
                  className="w-44 h-28 bg-muted/60 border-2 border-border flex items-center justify-center text-center p-3 text-sm font-medium text-muted-foreground"
                  style={{
                    borderRadius: `${radius * 0.0625}rem`,
                    ['cornerShape' as string]: 'round',
                  }}
                  data-shape="round"
                >
                  <span>{t('components.squircle.classicArc', 'Classic Arc (Smoothing: 0%)')}</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">{t('components.squircle.g1Label', 'Standard Circular Arc (G1)')}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto w-full pt-4 border-t border-border">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t('components.squircle.cornerSmoothing', 'Corner Smoothing')}</span>
                  <span className="font-mono font-medium text-foreground">{(smoothing * 100).toFixed(0)}% (iOS: 60%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={smoothing}
                  onChange={(e) => setSmoothing(parseFloat(e.target.value))}
                  className="w-full cursor-pointer accent-primary"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t('components.squircle.cornerRadius', 'Corner Radius')}</span>
                  <span className="font-mono font-medium text-foreground">{radius}</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="48"
                  step="2"
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value, 10))}
                  className="w-full cursor-pointer accent-primary"
                />
              </div>
            </div>

            {/* Component Adoption Preview */}
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {t('components.squircle.adoptionPreview', 'Full-Project Default Adoption Preview')}
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="default">{t('desktopComposite.squircle.demoButton', 'Squircle Button')}</Button>
                <Button variant="outline">{t('desktopComposite.squircle.demoOutline', 'Outline Button')}</Button>
                <Badge variant="default">{t('desktopComposite.squircle.demoPill', 'Status Pill')}</Badge>
                <Badge variant="secondary">{t('desktopComposite.squircle.demoBadge', 'Secondary Badge')}</Badge>
                <div className="w-48">
                  <Input placeholder={t('desktopComposite.squircle.demoInput', 'Squircle Input...')} />
                </div>
              </div>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Installation & Global Adoption Guide */}
      <section id="installation" className="mt-12 scroll-mt-20 space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
          {t('desktopComposite.squircle.installHeading', 'Installation')}
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />

        <div className="pt-4 space-y-6 border-t border-border">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground mb-1">
              {t('desktopComposite.squircle.guideTitle', 'Global Adoption Guide for External Projects')}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {t('desktopComposite.squircle.guideDesc', 'External projects adopt the ChaSet iOS continuous-curvature system via two progressive enhancement strategies: the base layer accelerates all Tailwind utilities at zero cost through modern browser CSS features; legacy environments or high-precision bordered geometry fall back to guaranteed rendering through the primitive component.')}
            </p>
          </div>

          {/* Section 1: Universal CSS Acceleration */}
          <Card className="p-5 space-y-3 bg-card text-card-foreground border border-border">
            <div className="flex items-center gap-2">
              <Badge variant="default">{t('desktopComposite.squircle.strategyBadge1', 'Strategy 1')}</Badge>
              <h4 className="text-sm font-semibold text-foreground">
                {t('desktopComposite.squircle.strategy1Title', 'Universal CSS Acceleration (Global CSS Continuous-Curvature Acceleration)')}
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('desktopComposite.squircle.strategy1Desc', 'Add a CSS feature query in the host project global stylesheet (e.g. globals.css or index.css). Every element based on Tailwind rounded-* utilities is instantly promoted to iOS continuous-curvature superellipses, smoothly eliminating harsh edge creases.')}
            </p>
            <CodeBlock
              code={globalCssSnippet}
              language="css"
              filename="globals.css"
            />
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md space-y-1">
              <span className="font-semibold text-foreground">{t('desktopComposite.squircle.tailwindSyncLabel', 'Tailwind Synergy:')}</span>
              <p>
                {t('desktopComposite.squircle.tailwindNote', 'No business-code changes to rounded-md, rounded-lg, or rounded-xl are needed. After the browser matches corner-shape: squircle, continuous-curvature superellipses apply directly, while the .rounded-full rule protects circular avatars and status dots from geometric distortion.')}
              </p>
            </div>
          </Card>

          {/* Section 2: Guaranteed Progressive Enhancement */}
          <Card className="p-5 space-y-3 bg-card text-card-foreground border border-border">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{t('desktopComposite.squircle.strategyBadge2', 'Strategy 2')}</Badge>
              <h4 className="text-sm font-semibold text-foreground">
                {t('desktopComposite.squircle.strategy2Title', 'Guaranteed Progressive Enhancement (Container Progressive Enhancement)')}
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('desktopComposite.squircle.strategy2Desc', 'For dialogs (Dialog/Sheet), highlight cards, or browser engines without CSS corner-shape support, wrap content with the ChaSet component. Internally it clips via SVG clipPath with ResizeObserver-driven geometry, guaranteeing 100% cross-platform pixel-smooth rendering.')}
            </p>
            <CodeBlock
              code={progressiveComponentSnippet}
              language="tsx"
              filename="components/PremiumCard.tsx"
            />
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md space-y-1">
              <span className="font-semibold text-foreground">{t('desktopComposite.squircle.borderSupportLabel', 'Continuous-Curvature Stroke Support:')}</span>
              <p>
                {t('desktopComposite.squircle.borderNote', 'Traditional CSS borders render uneven widths or hard corners under superellipse clipping. Passing borderWidth and borderColor renders an adaptive continuous-curvature vector stroke with uniform outline thickness.')}
              </p>
            </div>
          </Card>

          {/* Section 3: Design Tokens Configuration */}
          <Card className="p-5 space-y-3 bg-card text-card-foreground border border-border">
            <div className="flex items-center gap-2">
              <Badge variant="outline">{t('desktopComposite.squircle.strategyBadge3', 'Strategy 3')}</Badge>
              <h4 className="text-sm font-semibold text-foreground">
                {t('desktopComposite.squircle.strategy3Title', 'Design Tokens Configuration (Global Design-Token Setup)')}
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t('desktopComposite.squircle.strategy3Desc', 'ChaSet core design tokens ship built-in curvature variables. Host projects may define --cs-corner-shape and --cs-corner-smoothing at the root level, and the full component library automatically inherits the matching curvature.')}
            </p>
            <CodeBlock
              code={tokensConfigSnippet}
              language="css"
              filename="tokens.css"
            />
          </Card>
        </div>
      </section>

      {/* 3. Animations, Keyboard Navigation, and Props Reference */}
      <DocFooterSections
        componentId="squircle"
        props={[
          { name: 'radius', type: 'number', defaultValue: '8', description: t('components.squircle.radiusDesc', 'Corner radius in logical units.') },
          { name: 'smoothing', type: 'number', defaultValue: '0.6', description: t('components.squircle.smoothingDesc', 'Curvature smoothing factor from 0.0 (circle arc) to 1.0 (full squircle). 0.6 is the Apple iOS standard.') },
          { name: 'cornerSmoothing', type: 'number', defaultValue: '0.6', description: t('components.squircle.cornerSmoothingDesc', 'Alias for smoothing conforming to the neutral schema.') },
          { name: 'topLeftRadius', type: 'number', defaultValue: 'undefined', description: t('components.squircle.topLeftDesc', 'Explicit top-left corner radius override.') },
          { name: 'topRightRadius', type: 'number', defaultValue: 'undefined', description: t('components.squircle.topRightDesc', 'Explicit top-right corner radius override.') },
          { name: 'bottomLeftRadius', type: 'number', defaultValue: 'undefined', description: t('components.squircle.bottomLeftDesc', 'Explicit bottom-left corner radius override.') },
          { name: 'bottomRightRadius', type: 'number', defaultValue: 'undefined', description: t('components.squircle.bottomRightDesc', 'Explicit bottom-right corner radius override.') },
          { name: 'roundLeft', type: 'boolean', defaultValue: 'true', description: t('components.squircle.rlDesc', 'Whether left corners are rounded.') },
          { name: 'roundRight', type: 'boolean', defaultValue: 'true', description: t('components.squircle.rrDesc', 'Whether right corners are rounded.') },
          { name: 'roundTop', type: 'boolean', defaultValue: 'true', description: t('components.squircle.rtDesc', 'Whether top corners are rounded.') },
          { name: 'roundBottom', type: 'boolean', defaultValue: 'true', description: t('components.squircle.rbDesc', 'Whether bottom corners are rounded.') },
          { name: 'borderWidth', type: 'number', defaultValue: '0', description: t('components.squircle.borderWidthDesc', 'Border stroke width in logical units.') },
          { name: 'borderColor', type: 'string', defaultValue: 'undefined', description: t('components.squircle.borderColorDesc', 'Border stroke color for continuous curvature outline.') },
          { name: 'color', type: 'string', defaultValue: 'undefined', description: t('components.squircle.bgDesc', 'Background surface fill color.') },
          { name: 'width', type: 'number', defaultValue: 'undefined', description: t('components.squircle.widthDesc', 'Explicit width in logical units (auto-measured via ResizeObserver if omitted).') },
          { name: 'height', type: 'number', defaultValue: 'undefined', description: t('components.squircle.heightDesc', 'Explicit height in logical units (auto-measured via ResizeObserver if omitted).') },
          { name: 'as', type: 'React.ElementType', defaultValue: "'div'", description: t('components.squircle.asDesc', 'Underlying HTML tag or component to render as.') },
        ]}
      />
    </DocLayout>
  );
}
