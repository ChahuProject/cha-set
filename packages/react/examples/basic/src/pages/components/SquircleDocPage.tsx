import React, { useState } from 'react';
import { Squircle, Button, Card, Badge, Input, Slider } from '@chahu/cha-set';
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
  iOS Continuous Squircle (${(smoothing * 100).toFixed(0)}%)
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
        text: "iOS Continuous Squircle (${(smoothing * 100).toFixed(0)}%)"
        color: ThemeTokens.text
    }
}`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Squircle"
      description="iOS 连续曲率超椭圆圆角（G2 连续律）。消除了传统圆弧角在直线与切点处曲率突变导致的生硬折痕，为整个项目提供平滑、有机的现代圆角设计。"
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

      <DocFooterSections
        componentKey="squircle"
        propsRows={[
          { name: 'radius', type: 'number', defaultValue: '8', description: 'Corner radius in logical units.' },
          { name: 'cornerSmoothing', type: 'number', defaultValue: '0.6', description: 'Curvature smoothing factor from 0.0 (circle arc) to 1.0 (full squircle). 0.6 is the Apple iOS standard.' },
          { name: 'topLeftRadius', type: 'number', defaultValue: 'undefined', description: 'Explicit top-left corner radius override.' },
          { name: 'topRightRadius', type: 'number', defaultValue: 'undefined', description: 'Explicit top-right corner radius override.' },
          { name: 'bottomLeftRadius', type: 'number', defaultValue: 'undefined', description: 'Explicit bottom-left corner radius override.' },
          { name: 'bottomRightRadius', type: 'number', defaultValue: 'undefined', description: 'Explicit bottom-right corner radius override.' },
          { name: 'roundLeft', type: 'boolean', defaultValue: 'true', description: 'Whether left corners are rounded.' },
          { name: 'roundRight', type: 'boolean', defaultValue: 'true', description: 'Whether right corners are rounded.' },
          { name: 'roundTop', type: 'boolean', defaultValue: 'true', description: 'Whether top corners are rounded.' },
          { name: 'roundBottom', type: 'boolean', defaultValue: 'true', description: 'Whether bottom corners are rounded.' },
          { name: 'border.color', type: 'color', defaultValue: '"transparent"', description: 'Border stroke color.' },
          { name: 'border.width', type: 'number', defaultValue: '0', description: 'Border stroke width.' },
          { name: 'color', type: 'color', defaultValue: '"transparent"', description: 'Background surface fill color.' },
        ]}
      />
    </DocLayout>
  );
}
