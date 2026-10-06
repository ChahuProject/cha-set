import React, { useState } from 'react';
import { Squircle, Button, Card, Badge, Input, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocFooterSections } from '../../components/DocFooterSections';

export function SquircleDocPage() {
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
      description="iOS 连续曲率超椭圆圆角（G2 连续律）。消除了传统圆弧角在直线与切点处曲率突变导致的生硬折痕，为整个项目提供平滑、有机的现代圆角设计。"
      tocItems={[
        { id: 'overview', title: 'Interactive Overview' },
        { id: 'installation', title: 'Installation' },
        { id: 'animations', title: 'Animations' },
        { id: 'keyboard', title: 'Keyboard Navigation' },
        { id: 'props', title: 'Props Reference' },
      ]}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold mb-4 text-foreground">Interactive Overview</h2>
        <ComponentPreview
          title="Squircle Sandbox & Curvature Comparison"
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
                  <span>Squircle (Smoothing: {(smoothing * 100).toFixed(0)}%)</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">Radius: {radius} | S: {smoothing.toFixed(2)}</span>
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
                  <span>Classic Arc (Smoothing: 0%)</span>
                </div>
                <span className="text-xs text-muted-foreground font-mono">Standard Circular Arc</span>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto w-full pt-4 border-t border-border">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Corner Smoothing</span>
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
                  <span>Corner Radius</span>
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
                Full-Project Default Adoption Preview
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="default">Squircle Button</Button>
                <Button variant="outline">Outline Button</Button>
                <Badge variant="default">Status Pill</Badge>
                <Badge variant="secondary">Secondary Badge</Badge>
                <div className="w-48">
                  <Input placeholder="Squircle Input..." />
                </div>
              </div>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Installation & Global Adoption Guide */}
      <section id="installation" className="mt-12 scroll-mt-20 space-y-6">
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-3">
          Installation
        </h2>
        <CodeBlock code="pnpm add @chahu/cha-set" language="bash" />

        <div className="pt-4 space-y-6 border-t border-border">
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-foreground mb-1">
              项目全局接入指南 (Global Adoption Guide for External Projects)
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              外部项目接入 ChaSet iOS 连续曲率体系支持两层渐进增强策略：底层通过现代浏览器 CSS 特性实现全量 Tailwind 零成本加速；对老旧环境或高精度几何边框需求，则通过 <code>&lt;Squircle&gt;</code> 原语组件获得保真渲染。
            </p>
          </div>

          {/* Section 1: Universal CSS Acceleration */}
          <Card className="p-5 space-y-3 bg-card text-card-foreground border border-border">
            <div className="flex items-center gap-2">
              <Badge variant="default">策略一</Badge>
              <h4 className="text-sm font-semibold text-foreground">
                Universal CSS Acceleration (全局 CSS 连续曲率加速)
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              在宿主项目的全局样式表（如 <code>globals.css</code> 或 <code>index.css</code>）中加入 CSS 特性查询。所有基于 Tailwind CSS <code>rounded-*</code> 类的元素将即刻提升为 iOS 连续曲率超椭圆，平滑消除边缘生硬折痕。
            </p>
            <CodeBlock
              code={globalCssSnippet}
              language="css"
              filename="globals.css"
            />
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md space-y-1">
              <span className="font-semibold text-foreground">Tailwind 协同机制：</span>
              <p>
                无需修改业务代码中的 <code>rounded-md</code>, <code>rounded-lg</code>, <code>rounded-xl</code>。浏览器匹配 <code>corner-shape: squircle</code> 后将直接应用超椭圆连续曲率，并由 <code>.rounded-full</code> 规则保护圆形头像与状态点不发生几何形变。
              </p>
            </div>
          </Card>

          {/* Section 2: Guaranteed Progressive Enhancement */}
          <Card className="p-5 space-y-3 bg-card text-card-foreground border border-border">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">策略二</Badge>
              <h4 className="text-sm font-semibold text-foreground">
                Guaranteed Progressive Enhancement (<code>&lt;Squircle&gt;</code> 容器渐进增强)
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              对于弹窗（Dialog/Sheet）、高光卡片或不支持 CSS <code>corner-shape</code> 的浏览器内核，使用 ChaSet 的 <code>&lt;Squircle&gt;</code> 组件进行包裹。内部通过 SVG <code>clipPath</code> 裁剪与 <code>ResizeObserver</code> 动态几何计算，确保 100% 跨平台像素级平滑。
            </p>
            <CodeBlock
              code={progressiveComponentSnippet}
              language="tsx"
              filename="components/PremiumCard.tsx"
            />
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-md space-y-1">
              <span className="font-semibold text-foreground">连续曲率描边支持：</span>
              <p>
                传统 CSS <code>border</code> 在超椭圆剪裁下会出现宽度不均或硬直角。传入 <code>borderWidth</code> 与 <code>borderColor</code> 时，<code>&lt;Squircle&gt;</code> 会自动渲染自适应连续曲率矢量描边，保证外轮廓厚度均匀。
              </p>
            </div>
          </Card>

          {/* Section 3: Design Tokens Configuration */}
          <Card className="p-5 space-y-3 bg-card text-card-foreground border border-border">
            <div className="flex items-center gap-2">
              <Badge variant="outline">策略三</Badge>
              <h4 className="text-sm font-semibold text-foreground">
                Design Tokens Configuration (设计令牌全局配置)
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              ChaSet 核心设计令牌内置曲率控制变量。宿主工程可在根层级定义 <code>--cs-corner-shape</code> 与 <code>--cs-corner-smoothing</code>，全库组件将自动继承对应曲率平滑度。
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
          { name: 'radius', type: 'number', defaultValue: '8', description: 'Corner radius in logical units.' },
          { name: 'smoothing', type: 'number', defaultValue: '0.6', description: 'Curvature smoothing factor from 0.0 (circle arc) to 1.0 (full squircle). 0.6 is the Apple iOS standard.' },
          { name: 'cornerSmoothing', type: 'number', defaultValue: '0.6', description: 'Alias for smoothing conforming to the neutral schema.' },
          { name: 'topLeftRadius', type: 'number', defaultValue: 'undefined', description: 'Explicit top-left corner radius override.' },
          { name: 'topRightRadius', type: 'number', defaultValue: 'undefined', description: 'Explicit top-right corner radius override.' },
          { name: 'bottomLeftRadius', type: 'number', defaultValue: 'undefined', description: 'Explicit bottom-left corner radius override.' },
          { name: 'bottomRightRadius', type: 'number', defaultValue: 'undefined', description: 'Explicit bottom-right corner radius override.' },
          { name: 'roundLeft', type: 'boolean', defaultValue: 'true', description: 'Whether left corners are rounded.' },
          { name: 'roundRight', type: 'boolean', defaultValue: 'true', description: 'Whether right corners are rounded.' },
          { name: 'roundTop', type: 'boolean', defaultValue: 'true', description: 'Whether top corners are rounded.' },
          { name: 'roundBottom', type: 'boolean', defaultValue: 'true', description: 'Whether bottom corners are rounded.' },
          { name: 'borderWidth', type: 'number', defaultValue: '0', description: 'Border stroke width in logical units.' },
          { name: 'borderColor', type: 'string', defaultValue: 'undefined', description: 'Border stroke color for continuous curvature outline.' },
          { name: 'color', type: 'string', defaultValue: 'undefined', description: 'Background surface fill color.' },
          { name: 'width', type: 'number', defaultValue: 'undefined', description: 'Explicit width in logical units (auto-measured via ResizeObserver if omitted).' },
          { name: 'height', type: 'number', defaultValue: 'undefined', description: 'Explicit height in logical units (auto-measured via ResizeObserver if omitted).' },
          { name: 'as', type: 'React.ElementType', defaultValue: "'div'", description: 'Underlying HTML tag or component to render as.' },
        ]}
      />
    </DocLayout>
  );
}
