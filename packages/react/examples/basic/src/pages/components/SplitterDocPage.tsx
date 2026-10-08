import React, { useState } from 'react';
import { Splitter, Badge, Button, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function SplitterDocPage() {
  const { t } = useChaSetI18n();
  const [size, setSize] = useState(35);
  const [verticalSize, setVerticalSize] = useState(65);

  const horizontalReactCode = `<div className="flex h-48 border rounded-md">
  <div style={{ width: \`\${size}%\` }} className="p-4 text-xs">
    Left Pane (Sidebar)
  </div>
  <Splitter size={size} onChange={setSize} orientation="vertical" />
  <div style={{ width: \`\${100 - size}%\` }} className="p-4 text-xs">
    Right Pane (Main Content)
  </div>
</div>`;

  const horizontalQtCode = `ChaSetSplitter {
    width: 480
    height: 192
    orientation: "vertical"
    initialSize: 35
    minRatio: 0.20
    maxRatio: 0.80
    leftItem: Component { ... }
    rightItem: Component { ... }
}`;

  const verticalReactCode = `<div className="flex flex-col h-64 border rounded-md">
  <div style={{ height: \`\${verticalSize}%\` }} className="p-4 text-xs">
    Top Pane (Editor Canvas)
  </div>
  <Splitter size={verticalSize} onChange={setVerticalSize} orientation="horizontal" />
  <div style={{ height: \`\${100 - verticalSize}%\` }} className="p-4 text-xs">
    Bottom Pane (Terminal Console)
  </div>
</div>`;

  const verticalQtCode = `ChaSetSplitter {
    width: 480
    height: 220
    orientation: "horizontal"
    initialSize: 65
    minRatio: 0.20
    maxRatio: 0.80
    leftItem: Component { ... }
    rightItem: Component { ... }
}`;

  return (
    <DocLayout
      category="Surfaces & Layout"
      title="Splitter"
      description={t('components.splitter.description', 'Multi-pane resizable layout container with draggable gutters and collapse limits for IDEs and desktop toolkits.')}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.splitter.overviewHeading', 'Horizontal Splitter')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.splitter.horizontalDesc', 'Hover over the gutter between panes and drag horizontally to resize panels. Double-click to reset.')}
        </p>

        <ComponentPreview
          title={t('desktopComposite.splitter.horizontalSandboxTitle', 'Horizontal Splitter Sandbox')}
          reactCode={horizontalReactCode}
          qtCode={horizontalQtCode}
        >
          <div className="w-full max-w-lg">
            <div className="flex h-48 border border-border rounded-md bg-card overflow-hidden">
              <div
                style={{ width: `${size}%` }}
                className="h-full p-4 text-xs text-muted-foreground bg-muted/20 overflow-hidden shrink-0"
              >
                <strong className="text-foreground block mb-2">{t('surfaces.splitter.navTree')}</strong>
                <ul className="space-y-1 font-mono">
                  <li>{t('desktopComposite.splitter.fileSrc', '▾ src')}</li>
                  <li className="pl-3">{t('desktopComposite.splitter.fileComponents', '▸ components')}</li>
                  <li className="pl-3">{t('desktopComposite.splitter.fileLayout', '▸ layout')}</li>
                </ul>
              </div>

              <Splitter size={size} onChange={setSize} orientation="vertical" minSize={20} maxSize={80} />

              <div
                style={{ width: `${100 - size}%` }}
                className="h-full p-4 text-xs text-muted-foreground flex flex-col justify-center items-center gap-2 overflow-hidden shrink-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">{t('surfaces.splitter.editorWorkspace')}</span>
                  <Badge variant="secondary">{Math.round(100 - size)}%</Badge>
                </div>
                <span>{t('surfaces.splitter.dragHint')}</span>
                <Button variant="outline" size="xs" onClick={() => setSize(35)}>
                  {t('surfaces.splitter.reset35')}
                </Button>
              </div>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Splitter } from '@chahu/cha-set';

<Splitter orientation="horizontal" defaultSplit={0.3}>
  <div>Left Pane</div>
  <div>Right Pane</div>
</Splitter>`}
        qtCode={`import ChaSet

ChaSetSplitter {
    width: parent.width
    height: 300
    orientation: Qt.Horizontal
    splitRatio: 0.3
}`}
      />



      <section id="vertical" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.splitter.verticalTitle', 'Vertical Splitter')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.splitter.verticalDesc', 'Top and bottom pane split with horizontal divider line. Drag vertically to resize console output.')}
        </p>

        <ComponentPreview
          title={t('desktopComposite.splitter.verticalSandboxTitle', 'Vertical Splitter')}
          reactCode={verticalReactCode}
          qtCode={verticalQtCode}
        >
          <div className="w-full max-w-lg">
            <div className="flex flex-col h-64 border border-border rounded-md bg-card overflow-hidden">
              <div
                style={{ height: `${verticalSize}%` }}
                className="w-full p-4 text-xs text-muted-foreground bg-muted/20 flex flex-col justify-center items-center gap-1 overflow-hidden shrink-0"
              >
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">{t('surfaces.splitter.editorCanvas')}</span>
                  <Badge variant="secondary">{Math.round(verticalSize)}%</Badge>
                </div>
                <span>{t('surfaces.splitter.dragVerticalHint')}</span>
              </div>

              <Splitter size={verticalSize} onChange={setVerticalSize} orientation="horizontal" minSize={20} maxSize={80} />

              <div
                style={{ height: `${100 - verticalSize}%` }}
                className="w-full p-4 text-xs text-muted-foreground flex flex-col justify-center items-center gap-2 overflow-hidden shrink-0 bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">{t('surfaces.splitter.terminalConsole')}</span>
                  <Badge variant="outline">{Math.round(100 - verticalSize)}%</Badge>
                </div>
                <Button variant="outline" size="xs" onClick={() => setVerticalSize(65)}>
                  {t('surfaces.splitter.reset65')}
                </Button>
              </div>
            </div>
          </div>
        </ComponentPreview>
      </section>

      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.animations', 'Animations')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('desktopComposite.splitter.animationsDesc', 'Motion tokens and kinematic timing contracts for Splitter divider gutters.')}
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            {t('desktopComposite.splitter.animationsBullet1', 'Gutter indicator color and opacity transitions animate smoothly over duration-quick (150ms) using ease-standard curve (Qt counterpart: ThemeTokens.motionQuick and ThemeTokens.easeStandard).')}
          </li>
          <li>
            {t('desktopComposite.splitter.animationsBullet2', 'Divider dragging kinematics are strictly un-animated for deterministic, 60fps real-time pointer tracking.')}
          </li>
          <li>
            {t('showcase.animationsItem2', 'Durations and easing resolve from theme tokens, so prefers-reduced-motion zeroes them automatically (Qt: governed by ThemeTokens.animationsEnabled).')}
          </li>
        </ul>
      </section>

            <ComponentReference
        name="Splitter"
        componentId="splitter"
        props={[
            { name: 'size', type: 'number', default: 'undefined', description: t('components.splitter.sizeDesc', 'Controlled percentage width/height (0-100).') },
            { name: 'onChange', type: '(size: number) => void', default: 'undefined', description: t('components.splitter.onChangeDesc', 'Callback fired on drag with new percentage.') },
            { name: 'initialSize', type: 'number', default: '50', description: t('components.splitter.initialSizeDesc', 'Initial size percentage for uncontrolled usage.') },
            { name: 'minSize', type: 'number', default: '0', description: t('components.splitter.minSizeDesc', 'Minimum allowed percentage bound.') },
            { name: 'maxSize', type: 'number', default: '100', description: t('components.splitter.maxSizeDesc', 'Maximum allowed percentage bound.') },
            { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: t('components.splitter.orientationDesc', 'Orientation of the divider.') },
          ]}
      />
    </DocLayout>
  );
}
