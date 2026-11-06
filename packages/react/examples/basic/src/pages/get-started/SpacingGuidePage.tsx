import React from 'react';
import {
  Card,
  CardTitle,
  CardDescription,
  Badge,
  Input,
  Label,
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Separator,
  useChaSetI18n,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocText } from '../../components/DocText';
import { SPACING_SCALE_DATA } from '../../data/showcaseData.generated';

export function SpacingGuidePage() {
  const { t, locale } = useChaSetI18n();
  const isZh = locale.startsWith('zh');

  return (
    <DocLayout
      category="Get Started"
      title={t('getStarted.spacing.title', 'Spacing & Density')}
      description={t(
        'getStarted.spacing.desc',
        'Desktop space aesthetics, spacing scale, information density, and form layout guidelines for React & Qt.',
      )}
      tocItems={[
        { id: 'principles', title: t('showcase.toc.principles', 'Core Principles') },
        { id: 'scale', title: t('showcase.toc.scale', 'Spacing Scale') },
        { id: 'forms', title: t('showcase.toc.forms', 'Form Patterns') },
        { id: 'containers', title: t('showcase.toc.containers', 'Container Sizes') },
        { id: 'checklist', title: t('showcase.toc.checklist', 'Checklist') },
      ]}
    >
      {/* 1. Principles */}
      <section id="principles" className="my-6 scroll-mt-20">
        <DocText role="h2" className="mb-2">
          {t('getStarted.spacing.principles.title', 'Desktop Space Aesthetics: Four Golden Laws')}
        </DocText>
        <DocText role="p" className="mb-5 text-muted-foreground">
          {t(
            'getStarted.spacing.principles.desc',
            'Negative space is a tool for hierarchical grouping and visual breathing. In desktop applications, negative space must never devolve into an empty dead void. Eliminate hollow voids and horizontal asymmetry while preserving compact, orderly density.',
          )}
        </DocText>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <Card className="p-4.5 flex flex-col items-start gap-2 border-border/80 bg-card text-card-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/30">
                {t('getStarted.spacing.principles.law1', 'Law 1')}
              </Badge>
              <CardTitle className="font-semibold text-sm">
                {t('getStarted.spacing.principles.law1Title', 'Hug-Content First')}
              </CardTitle>
            </div>
            <CardDescription className="text-xs leading-relaxed text-muted-foreground">
              {t(
                'getStarted.spacing.principles.law1Desc',
                'Dialogs, sheets, and cards must auto-hug content vertically by default. Fixed heights that create cavernous dead space are strictly prohibited.',
              )}
            </CardDescription>
          </Card>

          <Card className="p-4.5 flex flex-col items-start gap-2 border-border/80 bg-card text-card-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/30">
                {t('getStarted.spacing.principles.law2', 'Law 2')}
              </Badge>
              <CardTitle className="font-semibold text-sm">
                {t('getStarted.spacing.principles.law2Title', 'Top-Aligned Scan Flow')}
              </CardTitle>
            </div>
            <CardDescription className="text-xs leading-relaxed text-muted-foreground">
              {t(
                'getStarted.spacing.principles.law2Desc',
                'Lightweight modal forms enforce top-aligned labels with full-width inputs, preventing left-side margin waste and horizontal visual rupture.',
              )}
            </CardDescription>
          </Card>

          <Card className="p-4.5 flex flex-col items-start gap-2 border-border/80 bg-card text-card-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/30">
                {t('getStarted.spacing.principles.law3', 'Law 3')}
              </Badge>
              <CardTitle className="font-semibold text-sm">
                {t('getStarted.spacing.principles.law3Title', 'Compact Rhythm & Density')}
              </CardTitle>
            </div>
            <CardDescription className="text-xs leading-relaxed text-muted-foreground">
              {t(
                'getStarted.spacing.principles.law3Desc',
                'Say goodbye to bloated mobile-style p-8 paddings. Standard desktop container padding converges to p-5 (20px) with cohesive, proportional rhythm.',
              )}
            </CardDescription>
          </Card>

          <Card className="p-4.5 flex flex-col items-start gap-2 border-border/80 bg-card text-card-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-primary border-primary/30">
                {t('getStarted.spacing.principles.law4', 'Law 4')}
              </Badge>
              <CardTitle className="font-semibold text-sm">
                {t('getStarted.spacing.principles.law4Title', 'Single Divider & Surface Elevation')}
              </CardTitle>
            </div>
            <CardDescription className="text-xs leading-relaxed text-muted-foreground">
              {t(
                'getStarted.spacing.principles.law4Desc',
                'Keep exactly one soft divider between content and footer. Double borders are banned, and footer padding is compact (py-3.5) for a sturdy finish.',
              )}
            </CardDescription>
          </Card>
        </div>
      </section>

      {/* 2. Spacing Scale */}
      <section id="scale" className="my-8 scroll-mt-20">
        <DocText role="h2" className="mb-2">
          {t('getStarted.spacing.scale.title', 'Standard Spacing Scale')}
        </DocText>
        <DocText role="p" className="mb-4 text-muted-foreground">
          {t(
            'getStarted.spacing.scale.desc',
            'Unified spatial metrics mapped 1:1 across React Tailwind rem and Qt ThemeTokens.dp scale.',
          )}
        </DocText>

        <Card className="overflow-hidden border-border bg-card text-card-foreground">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/30">
                <TableHead className="w-32">{t('getStarted.spacing.scale.colLevel', 'Level')}</TableHead>
                <TableHead className="w-28">{t('getStarted.spacing.scale.colRem', 'Rem / Dp')}</TableHead>
                <TableHead className="w-24">{t('getStarted.spacing.scale.colPx', 'Base Px')}</TableHead>
                <TableHead className="w-36">{t('getStarted.spacing.scale.colSpecimen', 'Visual Specimen')}</TableHead>
                <TableHead>{t('getStarted.spacing.scale.colUsage', 'Typical Application')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SPACING_SCALE_DATA.scaleSteps.map((step) => (
                <TableRow key={step.id} className="border-b border-border/50 hover:bg-muted/20">
                  <TableCell className="font-medium">
                    <span className="text-foreground">{step.name}</span>
                    <span className="text-xs text-muted-foreground ml-1.5">({step.nameZh})</span>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs text-primary font-mono">{step.rem}</code>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {step.px}px
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3.5 rounded-xs bg-primary"
                        style={{ width: step.rem }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {isZh ? step.usageZh : step.usage}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* 3. Form Patterns */}
      <section id="forms" className="my-8 scroll-mt-20">
        <DocText role="h2" className="mb-2">
          {t('getStarted.spacing.forms.title', 'Form Layout Patterns: Best Practice vs Anti-Pattern')}
        </DocText>
        <DocText role="p" className="mb-5 text-muted-foreground">
          {t(
            'getStarted.spacing.forms.desc',
            'Visual comparison illustrating why top-aligned labels eliminate whitespace defects in dialogs.',
          )}
        </DocText>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-4">
          {/* Recommended Pattern */}
          <Card className="p-5 flex flex-col gap-4 border-primary/40 bg-card text-card-foreground shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-600 text-white">
                  {t('getStarted.spacing.forms.recommended', 'Recommended')}
                </Badge>
                <CardTitle className="text-sm font-semibold">
                  {t('getStarted.spacing.forms.topAlignedTitle', 'Top-Aligned Single-Track')}
                </CardTitle>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-background text-foreground border border-border flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <Label size="sm" className="text-muted-foreground font-medium">
                  {t('getStarted.spacing.forms.nameLabel', 'Name')}
                </Label>
                <Input defaultValue={t('getStarted.spacing.forms.sampleName', 'Alex Rivera')} className="w-full" readOnly />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label size="sm" className="text-muted-foreground font-medium">
                  {t('getStarted.spacing.forms.usernameLabel', 'Username')}
                </Label>
                <Input defaultValue={t('getStarted.spacing.forms.sampleUsername', '@arivera')} className="w-full" readOnly />
              </div>
            </div>

            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>{t('getStarted.spacing.forms.recPoint1', 'Direct vertical eye scanning with zero zig-zag')}</li>
              <li>{t('getStarted.spacing.forms.recPoint2', 'Full width input with zero wasted horizontal margin')}</li>
              <li>{t('getStarted.spacing.forms.recPoint3', 'Naturally resilient to multi-language string expansion')}</li>
            </ul>
          </Card>

          {/* Anti-Pattern */}
          <Card className="p-5 flex flex-col gap-4 border-destructive/30 bg-card text-card-foreground shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">
                  {t('getStarted.spacing.forms.antiPattern', 'Anti-Pattern')}
                </Badge>
                <CardTitle className="text-sm font-semibold">
                  {t('getStarted.spacing.forms.gridTitle', 'Rigid Percentage Grid')}
                </CardTitle>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-background text-foreground border border-border flex flex-col gap-3.5">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right text-xs font-medium text-destructive">
                  {t('getStarted.spacing.forms.nameLabel', 'Name')}
                </span>
                <Input defaultValue={t('getStarted.spacing.forms.sampleName', 'Alex Rivera')} className="col-span-3 opacity-60" readOnly />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right text-xs font-medium text-destructive">
                  {t('getStarted.spacing.forms.usernameLabel', 'Username')}
                </span>
                <Input defaultValue={t('getStarted.spacing.forms.sampleUsername', '@arivera')} className="col-span-3 opacity-60" readOnly />
              </div>
            </div>

            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li className="text-destructive/90">{t('getStarted.spacing.forms.antiPoint1', 'Wastes 100px+ of dead space to the left of short labels')}</li>
              <li>{t('getStarted.spacing.forms.antiPoint2', 'Forces asymmetric form weight heavily to the right')}</li>
              <li>{t('getStarted.spacing.forms.antiPoint3', 'Interrupts natural reading flow from title to input fields')}</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* 4. Container Sizing Tiers */}
      <section id="containers" className="my-8 scroll-mt-20">
        <DocText role="h2" className="mb-2">
          {t('getStarted.spacing.containers.title', 'Modal & Container Sizing Guidelines')}
        </DocText>
        <DocText role="p" className="mb-4 text-muted-foreground">
          {t(
            'getStarted.spacing.containers.desc',
            'Pre-calibrated width tiers paired with mandatory vertical auto-hug containment.',
          )}
        </DocText>

        <Card className="overflow-hidden border-border bg-card text-card-foreground">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/30">
                <TableHead className="w-36">{t('getStarted.spacing.containers.colTier', 'Size Tier')}</TableHead>
                <TableHead className="w-32">{t('getStarted.spacing.containers.colWidthRem', 'Width Range')}</TableHead>
                <TableHead className="w-32">{t('getStarted.spacing.containers.colWidthPx', 'Physical Base')}</TableHead>
                <TableHead className="w-48">{t('getStarted.spacing.containers.colCapacity', 'Form Capacity')}</TableHead>
                <TableHead>{t('getStarted.spacing.containers.colUseCase', 'Typical Use Cases')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SPACING_SCALE_DATA.modalTiers.map((tier) => (
                <TableRow key={tier.id} className="border-b border-border/50 hover:bg-muted/20">
                  <TableCell className="font-medium text-foreground">
                    {tier.size}
                  </TableCell>
                  <TableCell>
                    <code className="text-xs text-primary font-mono">{tier.widthRem}</code>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {tier.widthPx}
                  </TableCell>
                  <TableCell className="text-xs text-foreground">
                    {isZh ? tier.capZh : tier.cap}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {isZh ? tier.useCaseZh : tier.useCase}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* 5. Checklist */}
      <section id="checklist" className="my-8 scroll-mt-20">
        <DocText role="h2" className="mb-2">
          {t('getStarted.spacing.checklist.title', 'Design & Code Review Checklist')}
        </DocText>
        <DocText role="p" className="mb-4 text-muted-foreground">
          {t(
            'getStarted.spacing.checklist.desc',
            'Verify every pull request against these five spatial health checks before merging:',
          )}
        </DocText>

        <Card className="p-5 border-border bg-card text-card-foreground flex flex-col gap-3">
          <div className="flex items-start gap-3">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">
              1
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">
                {t('getStarted.spacing.checklist.item1Title', 'Does the container hug its content tightly?')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t(
                  'getStarted.spacing.checklist.item1Desc',
                  'Verify the modal shrinks automatically when content is sparse, preventing 60px+ dead voids.',
                )}
              </span>
            </div>
          </div>
          <Separator />

          <div className="flex items-start gap-3">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">
              2
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">
                {t('getStarted.spacing.checklist.item2Title', 'Are percentage-grid inline labels avoided?')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t(
                  'getStarted.spacing.checklist.item2Desc',
                  'Top-aligned labels are the primary choice; inline labels require fixed narrow widths.',
                )}
              </span>
            </div>
          </div>
          <Separator />

          <div className="flex items-start gap-3">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">
              3
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">
                {t('getStarted.spacing.checklist.item3Title', 'Is padding disciplined to desktop-grade p-5 (20px)?')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t(
                  'getStarted.spacing.checklist.item3Desc',
                  'Avoid bloated mobile paddings (p-8/p-6), retaining high-density desktop refinement.',
                )}
              </span>
            </div>
          </div>
          <Separator />

          <div className="flex items-start gap-3">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">
              4
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">
                {t('getStarted.spacing.checklist.item4Title', 'Is the footer divider clean and singular?')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t(
                  'getStarted.spacing.checklist.item4Desc',
                  'Ensure only one soft divider border separates body and footer, avoiding stacked borders.',
                )}
              </span>
            </div>
          </div>
          <Separator />

          <div className="flex items-start gap-3">
            <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs ring-1 ring-primary/20">
              5
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-foreground">
                {t('getStarted.spacing.checklist.item5Title', 'Is component dogfooding enforced?')}
              </span>
              <span className="text-xs text-muted-foreground">
                {t(
                  'getStarted.spacing.checklist.item5Desc',
                  'Form labels must use the native ChaSet Label primitive, strictly avoiding bare unstyled label tags.',
                )}
              </span>
            </div>
          </div>
        </Card>
      </section>
    </DocLayout>
  );
}
