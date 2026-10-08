import React, { useState } from 'react';
import { Separator, type SeparatorOrientation, type SeparatorVariant, type SeparatorLabelPosition, SegmentedControl, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Checkbox, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { ComponentReference } from "../../components/ComponentReference";

export function SeparatorDocPage() {
  const { t } = useChaSetI18n();
  const [orientation, setOrientation] = useState<SeparatorOrientation>('horizontal');
  const [variant, setVariant] = useState<SeparatorVariant>('solid');
  const [hasLabel, setHasLabel] = useState(false);
  const [labelPosition, setLabelPosition] = useState<SeparatorLabelPosition>('center');
  const [decorative, setDecorative] = useState(true);

  const labelText = hasLabel ? t('components.separator.continueWith', 'Continue with') : undefined;

  const heroReactCode = orientation === 'horizontal'
    ? hasLabel
      ? `<div className="w-full max-w-sm space-y-4">
  <Button className="w-full">Sign in with SSO</Button>
  <Separator
    orientation="horizontal"
    variant="${variant}"
    label="${labelText}"
    labelPosition="${labelPosition}"${decorative ? '' : ' decorative={false}'}
  />
  <Button variant="outline" className="w-full">Sign in with Email</Button>
</div>`
      : `<div className="w-full max-w-sm space-y-4">
  <div className="space-y-1">
    <h4 className="text-sm font-medium leading-none">ChaSet UI</h4>
    <p className="text-sm text-muted-foreground">
      Cross-stack React & Qt Quick Design System.
    </p>
  </div>
  <Separator orientation="horizontal" variant="${variant}"${decorative ? '' : ' decorative={false}'} />
  <div className="flex h-5 items-center space-x-4 text-sm">
    <div>Docs</div>
    <Separator orientation="vertical" variant="${variant}" />
    <div>Source</div>
    <Separator orientation="vertical" variant="${variant}" />
    <div>Changelog</div>
  </div>
</div>`
    : `<div className="flex h-8 items-center space-x-4 text-sm">
  <span>Components</span>
  <Separator orientation="vertical" variant="${variant}"${decorative ? '' : ' decorative={false}'} />
  <span>Tokens</span>
  <Separator orientation="vertical" variant="${variant}" />
  <span>Showcase</span>
</div>`;

  const heroQtCode = orientation === 'horizontal'
    ? hasLabel
      ? `Column {
    width: 280
    spacing: 12
    ChaSetButton { text: "Sign in with SSO"; width: parent.width }
    ChaSetSeparator {
        orientation: "horizontal"
        variant: "${variant}"
        label: "${labelText}"
        labelPosition: "${labelPosition}"
        width: parent.width
    }
    ChaSetButton { variant: "outline"; text: "Sign in with Email"; width: parent.width }
}`
      : `Column {
    width: 280
    spacing: 12

    Column {
        spacing: 4
        Text { text: "ChaSet UI"; font.bold: true; color: ThemeTokens.text }
        Text { text: "Cross-stack React & Qt Quick Design System."; color: ThemeTokens.subduedText; font.pixelSize: 12 }
    }

    ChaSetSeparator { orientation: "horizontal"; variant: "${variant}" }

    Row {
        spacing: 12
        Text { text: "Docs"; color: ThemeTokens.text; font.pixelSize: 12 }
        ChaSetSeparator { orientation: "vertical"; variant: "${variant}"; height: 16 }
        Text { text: "Source"; color: ThemeTokens.text; font.pixelSize: 12 }
        ChaSetSeparator { orientation: "vertical"; variant: "${variant}"; height: 16 }
        Text { text: "Changelog"; color: ThemeTokens.text; font.pixelSize: 12 }
    }
}`
    : `Row {
    spacing: 12
    Text { text: "Components"; color: ThemeTokens.text; font.pixelSize: 13 }
    ChaSetSeparator { orientation: "vertical"; variant: "${variant}"; height: 20 }
    Text { text: "Tokens"; color: ThemeTokens.text; font.pixelSize: 13 }
    ChaSetSeparator { orientation: "vertical"; variant: "${variant}"; height: 20 }
    Text { text: "Showcase"; color: ThemeTokens.text; font.pixelSize: 13 }
}`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Separator"
      description={t('components.separator.description', 'Visually or semantically separates content in a list, form, or section.')}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.separator.overviewHeading', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.separator.overviewDesc', 'Test orientation, dashed/dotted line styles, and labeled section dividers across Web and Desktop.')}
        </p>

        <ComponentPreview
          title={t('desktopComposite.separator.sandboxTitle', 'Separator Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('common.orientation', 'Orientation:')}</span>
                <SegmentedControl
                  size="sm"
                  value={orientation}
                  onChange={(v) => setOrientation(v as SeparatorOrientation)}
                  options={[
                    { label: t('common.horizontal', 'Horizontal'), value: 'horizontal' },
                    { label: t('common.vertical', 'Vertical'), value: 'vertical' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('common.style', 'Style:')}</span>
                <SegmentedControl
                  size="sm"
                  value={variant}
                  onChange={(v) => setVariant(v as SeparatorVariant)}
                  options={[
                    { label: t('common.solid', 'Solid'), value: 'solid' },
                    { label: t('common.dashed', 'Dashed'), value: 'dashed' },
                    { label: t('common.dotted', 'Dotted'), value: 'dotted' },
                  ]}
                />
              </div>

              {orientation === 'horizontal' && (
                <>
                  <Checkbox
                    size="sm"
                    checked={hasLabel}
                    onCheckedChange={(val) => setHasLabel(Boolean(val))}
                    label={t('common.label', 'Label')}
                  />

                  {hasLabel && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">{t('common.position', 'Position:')}</span>
                      <SegmentedControl
                        size="sm"
                        value={labelPosition}
                        onChange={(v) => setLabelPosition(v as SeparatorLabelPosition)}
                        options={[
                          { label: t('common.left', 'Left'), value: 'left' },
                          { label: t('common.center', 'Center'), value: 'center' },
                          { label: t('common.right', 'Right'), value: 'right' },
                        ]}
                      />
                    </div>
                  )}
                </>
              )}

              <Checkbox
                size="sm"
                checked={decorative}
                onCheckedChange={(val) => setDecorative(Boolean(val))}
                label={`${t('components.separator.decorative', 'Decorative')} (${decorative ? 'role="none"' : 'role="separator"'})`}
              />
            </div>
          }
        >
          <div className="py-6 flex justify-center w-full">
            {orientation === 'horizontal' ? (
              hasLabel ? (
                <div className="w-full max-w-sm space-y-4">
                  <Button className="w-full" size="sm">{t('components.separator.signInSso', 'Sign in with SSO')}</Button>
                  <Separator
                    orientation="horizontal"
                    variant={variant}
                    label={labelText}
                    labelPosition={labelPosition}
                    decorative={decorative}
                  />
                  <Button variant="outline" className="w-full" size="sm">{t('components.separator.signInEmail', 'Sign in with Email')}</Button>
                </div>
              ) : (
                <div className="w-full max-w-sm space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-none text-foreground">{t('components.separator.chasetUi', 'ChaSet UI')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t('components.separator.systemDesc', 'Cross-stack React & Qt Quick Design System.')}
                    </p>
                  </div>
                  <Separator orientation="horizontal" variant={variant} decorative={decorative} />
                  <div className="flex h-5 items-center space-x-4 text-sm text-muted-foreground">
                    <span>{t('components.separator.docs', 'Docs')}</span>
                    <Separator orientation="vertical" variant={variant} />
                    <span>{t('components.separator.source', 'Source')}</span>
                    <Separator orientation="vertical" variant={variant} />
                    <span>{t('components.separator.changelog', 'Changelog')}</span>
                  </div>
                </div>
              )
            ) : (
              <div className="flex h-10 items-center space-x-4 text-sm text-foreground">
                <span>{t('components.separator.components', 'Components')}</span>
                <Separator orientation="vertical" variant={variant} decorative={decorative} />
                <span>{t('components.separator.tokens', 'Tokens')}</span>
                <Separator orientation="vertical" variant={variant} />
                <span>{t('components.separator.showcase', 'Showcase')}</span>
              </div>
            )}
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Separator } from '@chahu/cha-set';\n\n<Separator orientation="horizontal" />`}
        qtCode={`import ChaSet\n\nChaSetSeparator {\n    orientation: "horizontal"\n    width: parent.width\n}`}
      />

      {/* 4. Examples & States */}
      <section id="states" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3" data-toc-title={t('components.separator.examplesTitle', 'Examples & States')}>
          {t('components.separator.examplesTitle', 'Examples & States')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.separator.examplesDesc', 'Common layout patterns using horizontal, vertical, dashed, dotted, and labeled separators.')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Content Segmentation */}
          <Card className="flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle>{t('components.separator.accountOverview', 'Account Overview')}</CardTitle>
              <CardDescription>{t('components.separator.accountDesc', 'Manage your workspace settings and profile.')}</CardDescription>
            </CardHeader>
            <Separator orientation="horizontal" />
            <CardContent className="py-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('components.separator.status', 'Status')}</span>
                <span className="font-medium text-foreground">{t('components.separator.active', 'Active')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('components.separator.plan', 'Plan')}</span>
                <span className="font-medium text-foreground">{t('components.separator.enterprise', 'Enterprise')}</span>
              </div>
            </CardContent>
            <Separator orientation="horizontal" />
            <CardFooter className="pt-3 flex justify-end">
              <Button size="sm">{t('components.separator.manage', 'Manage')}</Button>
            </CardFooter>
          </Card>

          {/* Labeled Section & Form Dividers */}
          <Card className="flex flex-col justify-between p-6">
            <div>
              <h3 className="font-semibold text-foreground mb-1">{t('components.separator.labeledDividers', 'Labeled Dividers')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('components.separator.labeledDividersDesc', 'Embed clear section titles or auth splits with left, center, or right alignment.')}
              </p>
            </div>
            <div className="space-y-4">
              <Separator label={t('components.separator.sectionStart', 'Section Start')} labelPosition="left" />
              <Separator label={t('components.separator.orContinueWith', 'OR CONTINUE WITH')} labelPosition="center" />
              <Separator label={t('components.separator.endOfCategory', 'End of Category')} labelPosition="right" />
            </div>
          </Card>

          {/* Border Styles (Solid, Dashed, Dotted) */}
          <Card className="flex flex-col justify-between p-6">
            <div>
              <h3 className="font-semibold text-foreground mb-1">{t('components.separator.borderStyles', 'Border Styles')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('components.separator.borderStylesDesc', 'Choose between solid, dashed, or dotted dividers to distinguish hierarchy.')}
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">{t('components.separator.solidDefault', 'Solid (Default)')}</span>
                <Separator orientation="horizontal" variant="solid" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">{t('components.separator.dashed', 'Dashed')}</span>
                <Separator orientation="horizontal" variant="dashed" />
              </div>
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">{t('components.separator.dotted', 'Dotted')}</span>
                <Separator orientation="horizontal" variant="dotted" />
              </div>
            </div>
          </Card>

          {/* Inline Navigation & Metadata Bar */}
          <Card className="flex flex-col justify-between p-6">
            <div>
              <h3 className="font-semibold text-foreground mb-1">{t('components.separator.navDivider', 'Navigation Divider')}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('components.separator.navDividerDesc', 'Vertical dividers between inline list items or metadata tags.')}
              </p>
            </div>
            <div className="flex h-5 items-center space-x-4 text-xs text-muted-foreground border border-border p-3 rounded-lg bg-muted/20">
              <span className="font-medium text-foreground">v0.2.0</span>
              <Separator orientation="vertical" />
              <span>{t('desktopComposite.separator.mitLicense', 'MIT License')}</span>
              <Separator orientation="vertical" />
              <span>{t('desktopComposite.separator.stackBadge', 'React 19 & Qt 6')}</span>
            </div>
          </Card>
        </div>
      </section>

            {/* Animations */}
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
              {t('showcase.animationsItem1', 'State changes (hover, press, focus) animate over duration-quick with the ease-standard curve.')}
            </li>
            <li>
              {t('showcase.animationsItem2', 'Durations and easing resolve from theme tokens, so prefers-reduced-motion zeroes them automatically (Qt: governed by ThemeTokens.animationsEnabled).')}
            </li>
          </ul>
        </div>
      </section>

      <ComponentReference
        name="Separator"
        componentId="separator"
        props={[
          {
            name: 'orientation',
            type: "'horizontal' | 'vertical'",
            default: "'horizontal'",
            description: t('components.separator.orientationDesc', 'The orientation of the separator line.'),
          },
          {
            name: 'variant',
            type: "'solid' | 'dashed' | 'dotted'",
            default: "'solid'",
            description: t('components.separator.variantDesc', 'The stroke style of the separator line.'),
          },
          {
            name: 'label',
            type: 'ReactNode',
            default: 'undefined',
            description: t('components.separator.labelDesc', 'Optional label or annotation text embedded in the divider line.'),
          },
          {
            name: 'labelPosition',
            type: "'left' | 'center' | 'right'",
            default: "'center'",
            description: t('components.separator.labelPositionDesc', 'Horizontal alignment for the embedded label.'),
          },
          {
            name: 'decorative',
            type: 'boolean',
            default: 'true',
            description:
              'Whether the component is purely decorative (role="none") or represents a structural semantic separator (role="separator").',
          },
          {
            name: 'className',
            type: 'string',
            default: "''",
            description: t('components.separator.classNameDesc', 'Additional CSS classes for custom width, height, margin, or color overrides.'),
          },
        ]}
      />
    </DocLayout>
  );
}
