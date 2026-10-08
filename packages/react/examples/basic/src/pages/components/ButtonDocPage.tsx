import React, { useState } from 'react';
import { Button, ButtonGroup, Icon, Input, Checkbox, SegmentedControl, type ButtonVariant, type ButtonSize, CodeBlock, SettingsIcon, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { ComponentReference } from "../../components/ComponentReference";

export function ButtonDocPage() {
  const { t } = useChaSetI18n();
  const [variant, setVariant] = useState<ButtonVariant>('default');
  const [size, setSize] = useState<ButtonSize>('default');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [fullWidth, setFullWidth] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState('Button');

  const isIconSize = size === 'icon' || size === 'icon-xs' || size === 'icon-sm' || size === 'icon-lg';

  const reactCode = `<Button
  variant="${variant}"
  size="${size}"${loading ? '\n  loading' : ''}${disabled ? '\n  disabled' : ''}${fullWidth ? '\n  fullWidth' : ''}${pressed ? '\n  pressed' : ''}
>
  ${isIconSize ? '<SettingsIcon className="size-4" />' : label}
</Button>`;

  const qtCode = `ChaSetButton {
    variant: "${variant}"
    size: "${size}"
    text: "${isIconSize ? '' : label}"
    loading: ${loading}
    disabled: ${disabled}
    fullWidth: ${fullWidth}
    pressed: ${pressed}
    onClicked: console.log("clicked")
}`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Button"
      description={t('components.button.description', 'Displays a button or a component that looks like a button with multiple variants, sizes, and states.')}
    >
      {/* 1. Interactive Preview Hero */}
      <section id="overview">
        <ComponentPreview
          title={t('desktopComposite.button.sandboxTitle', 'Interactive Button Sandbox')}
          reactCode={reactCode}
          qtCode={qtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4 w-full">
              {/* Variant Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground font-medium text-xs">{t('common.variant', 'Variant:')}</span>
                <SegmentedControl
                  size="sm"
                  value={variant}
                  onChange={(v) => setVariant(v as ButtonVariant)}
                  options={[
                    { label: t('common.default', 'Default'), value: 'default' },
                    { label: t('common.secondary', 'Secondary'), value: 'secondary' },
                    { label: t('common.outline', 'Outline'), value: 'outline' },
                    { label: t('common.ghost', 'Ghost'), value: 'ghost' },
                    { label: t('common.destructive', 'Destructive'), value: 'destructive' },
                    { label: t('common.link', 'Link'), value: 'link' },
                    { label: t('common.overlay', 'Overlay'), value: 'overlay' },
                  ]}
                />
              </div>

              {/* Size Selector */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-muted-foreground font-medium text-xs">{t('common.size', 'Size:')}</span>
                <SegmentedControl
                  size="sm"
                  value={size}
                  onChange={(s) => setSize(s as ButtonSize)}
                  options={[
                    { label: 'XS', value: 'xs' },
                    { label: 'SM', value: 'sm' },
                    { label: t('common.default', 'Default'), value: 'default' },
                    { label: 'LG', value: 'lg' },
                    { label: t('desktopComposite.button.iconLabel', 'Icon'), value: 'icon' },
                    { label: t('desktopComposite.button.iconXsLabel', 'Icon-XS'), value: 'icon-xs' },
                    { label: t('desktopComposite.button.iconSmLabel', 'Icon-SM'), value: 'icon-sm' },
                    { label: t('desktopComposite.button.iconLgLabel', 'Icon-LG'), value: 'icon-lg' },
                  ]}
                />
              </div>

              {/* Toggles */}
              <Checkbox
                size="sm"
                checked={loading}
                onCheckedChange={(val) => setLoading(val)}
                label={t('common.loading', 'Loading')}
              />

              <Checkbox
                size="sm"
                checked={disabled}
                onCheckedChange={(val) => setDisabled(val)}
                label={t('common.disabled', 'Disabled')}
              />

              <Checkbox
                size="sm"
                checked={fullWidth}
                onCheckedChange={(val) => setFullWidth(val)}
                label={t('common.fullWidth', 'Full Width')}
              />

              <Checkbox
                size="sm"
                checked={pressed}
                onCheckedChange={(val) => setPressed(val)}
                label={t('common.pressed', 'Pressed')}
              />

              {/* Text input */}
              {!isIconSize && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <span className="text-muted-foreground text-xs">{t('common.label', 'Label:')}</span>
                  <Input
                    size="sm"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-28 h-7 text-xs"
                  />
                </div>
              )}
            </div>
          }
        >
          <div className={fullWidth ? 'w-full max-w-md px-4' : ''}>
            <Button
              variant={variant}
              size={size}
              loading={loading}
              disabled={disabled}
              fullWidth={fullWidth}
              pressed={pressed}
            >
              {isIconSize ? <SettingsIcon className="size-4" /> : label}
            </Button>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Button } from '@chahu/cha-set';\n\n<Button variant="default">Button</Button>`}
        qtCode={`import ChaSet\n\nChaSetButton {\n    text: "Button"\n}`}
      />

      {/* 3. Examples */}
      <section id="states" className="my-10">
        <h2 className="text-xl font-bold tracking-tight mb-4">{t('showcase.examplesAndStates', 'Examples & States')}</h2>

        {/* Variants */}
        <div id="variants" className="my-6">
          <h3 className="text-base font-semibold mb-2">{t('components.button.variantsTitle', 'Variants')}</h3>
          <p className="text-xs text-muted-foreground mb-3">
            {t('components.button.variantsDesc', 'Use the variant prop to change the visual hierarchy.')}
          </p>
          <div className="p-6 rounded-lg border border-border bg-card/40 flex flex-wrap items-center gap-3">
            <Button variant="default">{t('common.default', 'Default')}</Button>
            <Button variant="secondary">{t('common.secondary', 'Secondary')}</Button>
            <Button variant="outline">{t('common.outline', 'Outline')}</Button>
            <Button variant="ghost">{t('common.ghost', 'Ghost')}</Button>
            <Button variant="destructive">{t('common.destructive', 'Destructive')}</Button>
            <Button variant="link">{t('common.link', 'Link')}</Button>
            <Button variant="overlay">{t('common.overlay', 'Overlay')}</Button>
          </div>
          <CodeBlock
            code={`<Button variant="default">Default</Button>\n<Button variant="secondary">Secondary</Button>\n<Button variant="outline">Outline</Button>\n<Button variant="ghost">Ghost</Button>\n<Button variant="destructive">Destructive</Button>\n<Button variant="link">Link</Button>\n<Button variant="overlay">Overlay</Button>`}
            language="tsx"
            className="mt-3"
          />
        </div>

        {/* Sizes */}
        <div id="sizes" className="my-6">
          <h3 className="text-base font-semibold mb-2">{t('components.button.sizesTitle', 'Sizes')}</h3>
          <p className="text-xs text-muted-foreground mb-3">
            {t('components.button.sizesDesc', 'Available in standardized sizes: xs, sm, default, lg, and icon variants.')}
          </p>
          <div className="p-6 rounded-lg border border-border bg-card/40 flex flex-wrap items-center gap-3">
            <Button size="xs">{t('components.button.extraSmall', 'Extra Small')}</Button>
            <Button size="sm">{t('components.button.small', 'Small')}</Button>
            <Button size="default">{t('common.default', 'Default')}</Button>
            <Button size="lg">{t('components.button.large', 'Large')}</Button>
            <Button size="icon" aria-label={t('desktopComposite.button.settingsAriaLabel', 'Settings')}><SettingsIcon className="size-4" /></Button>
          </div>
          <CodeBlock
            code={`<Button size="xs">Extra Small</Button>\n<Button size="sm">Small</Button>\n<Button size="default">Default</Button>\n<Button size="lg">Large</Button>\n<Button size="icon" aria-label="Settings"><SettingsIcon className="size-4" /></Button>`}
            language="tsx"
            className="mt-3"
          />
        </div>

        {/* States */}
        <div id="states" className="my-6">
          <h3 className="text-base font-semibold mb-2">{t('components.button.statesTitle', 'States & Loading')}</h3>
          <p className="text-xs text-muted-foreground mb-3">
            {t('components.button.statesDesc', 'Buttons handle loading, pressed, and disabled states automatically, preserving width and blocking pointer events.')}
          </p>
          <div className="p-6 rounded-lg border border-border bg-card/40 flex flex-wrap items-center gap-3">
            <Button loading loadingText={t('common.saving', 'Saving...')}>{t('common.saveChanges', 'Saving Changes')}</Button>
            <Button pressed>{t('components.button.activeToggle', 'Active Toggle')}</Button>
            <Button disabled>{t('components.button.disabledButton', 'Disabled Button')}</Button>
          </div>
          <CodeBlock
            code={`<Button loading loadingText="Saving...">Saving Changes</Button>\n<Button pressed>Active Toggle</Button>\n<Button disabled>Disabled Button</Button>`}
            language="tsx"
            className="mt-3"
          />
        </div>

        {/* Button Group & Icons */}
        <div id="button-group" className="my-6">
          <h3 className="text-base font-semibold mb-2">{t('components.button.groupTitle', 'Button Group & Icons')}</h3>
          <p className="text-xs text-muted-foreground mb-3">
            {t('components.button.groupDesc', 'Group related buttons cohesively with ButtonGroup, and enrich buttons with leading or trailing icons.')}
          </p>
          <div className="p-6 rounded-lg border border-border bg-card/40 flex flex-wrap items-center gap-4">
            <Button leftIcon={<Icon name="arrow-left" className="size-4" />}>{t('common.back', 'Back')}</Button>
            <Button rightIcon={<Icon name="arrow-right" className="size-4" />}>{t('common.next', 'Next')}</Button>
            <ButtonGroup>
              <Button variant="outline">{t('components.button.left', 'Left')}</Button>
              <Button variant="outline">{t('components.button.middle', 'Middle')}</Button>
              <Button variant="outline">{t('components.button.right', 'Right')}</Button>
            </ButtonGroup>
          </div>
          <CodeBlock
            code={`<Button leftIcon={<Icon name="arrow-left" />}>Back</Button>\n<Button rightIcon={<Icon name="arrow-right" />}>Next</Button>\n\n<ButtonGroup>\n  <Button variant="outline">Left</Button>\n  <Button variant="outline">Middle</Button>\n  <Button variant="outline">Right</Button>\n</ButtonGroup>`}
            language="tsx"
            className="mt-3"
          />
        </div>
      </section>

      {/* 4. API Reference */}
      
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
        name="Button"
        componentId="button"
        props={[
          {
            name: 'variant',
            type: "'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'overlay'",
            default: "'default'",
            description: t('components.button.variantDesc', 'Visual appearance and semantic intent.'),
          },
          {
            name: 'size',
            type: "'default' | 'sm' | 'lg' | 'icon' | 'xs' | 'icon-xs' | 'icon-sm' | 'icon-lg'",
            default: "'default'",
            description: t('components.button.sizeDesc', 'Standardized dimensions scale.'),
          },
          {
            name: 'loading',
            type: 'boolean',
            default: 'false',
            description: t('components.button.loadingDesc', 'Shows spinning indicator and disables user interaction.'),
          },
          {
            name: 'loadingText',
            type: 'ReactNode',
            default: 'undefined',
            description: t('components.button.loadingTextDesc', 'Optional content displayed while in loading state.'),
          },
          {
            name: 'pressed',
            type: 'boolean',
            default: 'false',
            description: t('components.button.pressedDesc', 'Toggle or selected state with active styling and aria-pressed.'),
          },
          {
            name: 'leftIcon',
            type: 'ReactNode',
            default: 'undefined',
            description: t('components.button.leftIconDesc', 'Optional leading icon displayed before children.'),
          },
          {
            name: 'rightIcon',
            type: 'ReactNode',
            default: 'undefined',
            description: t('components.button.rightIconDesc', 'Optional trailing icon displayed after children.'),
          },
          {
            name: 'iconSize',
            type: 'number',
            default: 'undefined',
            description: t('components.button.iconSizeDesc', 'Logical unscaled icon size; enlarges or overrides icons rendered inside the button.'),
          },
          {
            name: 'fullWidth',
            type: 'boolean',
            default: 'false',
            description: t('components.button.fullWidthDesc', 'Stretches the button to 100% of the parent container width.'),
          },
          {
            name: 'asChild',
            type: 'boolean',
            default: 'false',
            description: t('components.button.asChildDesc', 'Passes props directly to the child element (polymorphism).'),
          },
          {
            name: 'disabled',
            type: 'boolean',
            default: 'false',
            description: t('components.button.disabledDesc', 'Blocks clicks and applies muted disabled styling.'),
          },
          {
            name: 'type',
            type: "'button' | 'submit' | 'reset'",
            default: "'button'",
            description: t('components.button.typeDesc', 'HTML button type attribute.'),
          },
        ]}
      />
    </DocLayout>
  );
}
