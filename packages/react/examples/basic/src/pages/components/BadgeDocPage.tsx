import React, { useState } from 'react';
import { Badge, CopyableBadge, type BadgeVariant, type BadgeSize, SegmentedControl, Checkbox, Card, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function BadgeDocPage() {
  const { t } = useChaSetI18n();
  const [variant, setVariant] = useState<BadgeVariant>('default');
  const [size, setSize] = useState<BadgeSize>('default');
  const [dot, setDot] = useState(false);
  const [removable, setRemovable] = useState(false);
  const [removed, setRemoved] = useState(false);

  const heroReactCode = `<Badge
  variant="${variant}"
  size="${size}"${dot ? '\n  dot' : ''}${removable ? '\n  removable\n  onRemove={() => console.log("removed")}' : ''}
>
  ${variant.charAt(0).toUpperCase() + variant.slice(1)} Badge
</Badge>`;

  const heroQtCode = `ChaSetBadge {
    variant: "${variant}"
    size: "${size}"
    text: "${variant.charAt(0).toUpperCase() + variant.slice(1)} Badge"${dot ? '\n    dot: true' : ''}${removable ? '\n    removable: true\n    onRemoved: console.log("removed")' : ''}
}`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Badge"
      description={t('components.badge.description', 'Displays a badge or a component that looks like a badge to highlight status, tags, and counts.')}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.badge.overviewHeading', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('components.badge.overviewDesc', 'Adjust variant, size, and interactive status options in real time with synchronized previews for Web and Desktop.')}
        </DocText>

        <ComponentPreview
          title={t('showcase.previewTitles.Badge Sandbox', 'Badge Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('common.variant', 'Variant:')}</span>
                <SegmentedControl
                  size="sm"
                  value={variant}
                  onChange={(v) => setVariant(v as BadgeVariant)}
                  options={[
                    { label: t('common.default', 'Default'), value: 'default' },
                    { label: t('common.secondary', 'Secondary'), value: 'secondary' },
                    { label: t('common.destructive', 'Destructive'), value: 'destructive' },
                    { label: t('common.outline', 'Outline'), value: 'outline' },
                    { label: t('common.ghost', 'Ghost'), value: 'ghost' },
                    { label: t('common.link', 'Link'), value: 'link' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('common.size', 'Size:')}</span>
                <SegmentedControl
                  size="sm"
                  value={size}
                  onChange={(s) => setSize(s as BadgeSize)}
                  options={[
                    { label: t('common.default', 'Default'), value: 'default' },
                    { label: t('desktopComposite.badge.sizeSmall', 'Small (sm)'), value: 'sm' },
                  ]}
                />
              </div>

              <Checkbox
                size="sm"
                checked={dot}
                onCheckedChange={(v) => setDot(v)}
                label={t('components.badge.statusDot', 'Status Dot')}
              />

              <Checkbox
                size="sm"
                checked={removable}
                onCheckedChange={(v) => {
                  setRemovable(v);
                  setRemoved(false);
                }}
                label={t('components.badge.removable', 'Removable')}
              />
            </div>
          }
        >
          {removed ? (
            <button
              type="button"
              onClick={() => setRemoved(false)}
              className="text-xs text-primary underline cursor-pointer"
            >
              {t('components.badge.resetRemoved', 'Reset Removed Badge')}
            </button>
          ) : (
            <Badge
              variant={variant}
              size={size}
              dot={dot}
              removable={removable}
              onRemove={() => setRemoved(true)}
            >
              {variant.charAt(0).toUpperCase() + variant.slice(1)} Badge
            </Badge>
          )}
        </ComponentPreview>
      </section>

      {/* 2. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Badge } from '@chahu/cha-set';\n\n<Badge>Badge</Badge>`}
        qtCode={`import ChaSet\n\nChaSetBadge {\n    text: "Badge"\n}`}
      />

      {/* 3. Variants */}
      <section id="variants" className="scroll-mt-20 my-10">
        <DocText role="h2" data-toc-title={t('components.badge.variantsTitle', 'Variants')} className="mb-3">
          {t('components.badge.variantsTitle', 'Variants')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('components.badge.variantsDesc', 'All six standard semantic variants aligned with the ChaSet design token system.')}
        </DocText>
        <Card className="flex flex-wrap items-center gap-3 p-6">
          <Badge variant="default">{t('common.default', 'Default')}</Badge>
          <Badge variant="secondary">{t('common.secondary', 'Secondary')}</Badge>
          <Badge variant="destructive">{t('common.destructive', 'Destructive')}</Badge>
          <Badge variant="outline">{t('common.outline', 'Outline')}</Badge>
          <Badge variant="ghost">{t('common.ghost', 'Ghost')}</Badge>
          <Badge variant="link">{t('common.link', 'Link')}</Badge>
        </Card>
      </section>

      {/* 4. Sizes */}
      <section id="sizes" className="scroll-mt-20 my-10">
        <DocText role="h2" data-toc-title={t('components.badge.sizesTitle', 'Sizes')} className="mb-3">
          {t('components.badge.sizesTitle', 'Sizes')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('components.badge.sizesDesc', 'Choose between standard pill scale (default) and compact micro badge (sm).')}
        </DocText>
        <Card className="flex flex-wrap items-center gap-4 p-6">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{t('components.badge.defaultLabel', 'Default:')}</span>
            <Badge size="default">{t('components.badge.badgeDefault', 'Badge Default')}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">{t('components.badge.smallLabel', 'Small:')}</span>
            <Badge size="sm">{t('components.badge.badgeNew', 'NEW')}</Badge>
          </div>
        </Card>
      </section>

      {/* 5. Status & Removable Badges */}
      <section id="status-removable-tags" className="scroll-mt-20 my-10">
        <DocText role="h2" data-toc-title={t('components.badge.statusTitle', 'Status & Removable Tags')} className="mb-3">
          {t('components.badge.statusTitle', 'Status & Removable Tags')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('components.badge.statusDesc', 'Badges support live status indicator dots and dismissible action buttons for filter tags.')}
        </DocText>
        <Card className="flex flex-wrap items-center gap-4 p-6">
          <Badge dot dotColor="bg-emerald-500" variant="outline">{t('components.badge.online', 'Online')}</Badge>
          <Badge dot dotColor="bg-amber-500" variant="outline">{t('components.badge.away', 'Away')}</Badge>
          <Badge dot dotColor="bg-rose-500" variant="destructive">{t('components.badge.error', 'Error')}</Badge>
          <Badge removable onRemove={() => alert('Removed!')}>{t('components.badge.reactTag', 'React Tag')}</Badge>
          <Badge removable onRemove={() => alert('Removed!')} variant="secondary">{t('components.badge.qtQuick', 'Qt Quick')}</Badge>
        </Card>
      </section>

            {/* Animations */}
      <DocMarkdown id="badge" section="animations" />

            <DocMarkdown id="badge" section="keyboard" />

      <DocMarkdown id="badge" section="props" />
    </DocLayout>
  );
}
