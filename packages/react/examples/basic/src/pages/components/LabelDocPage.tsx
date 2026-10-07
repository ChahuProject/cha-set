import React, { useState } from 'react';
import { Label, type LabelSize, Input, Checkbox, SegmentedControl, Card, CardHeader, CardTitle, CardDescription, CardContent, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function LabelDocPage() {
  const { t } = useChaSetI18n();
  const [size, setSize] = useState<LabelSize>('default');
  const [disabled, setDisabled] = useState(false);
  const [required, setRequired] = useState(false);
  const [optional, setOptional] = useState(false);
  const [invalid, setInvalid] = useState(false);

  const heroReactCode = `<div className="grid w-full max-w-sm items-center gap-1.5">
  <Label
    htmlFor="email"
    size="${size}"${disabled ? ' disabled' : ''}${required ? ' required' : ''}${optional ? ' optional' : ''}${invalid ? ' invalid' : ''}
  >
    Email address
  </Label>
  <Input
    type="email"
    id="email"
    placeholder="name@example.com"
    size="${size}"${disabled ? ' disabled' : ''}${invalid ? ' invalid' : ''}
  />
</div>`;

  const heroQtCode = `Column {
    spacing: 6
    width: 260

    ChaSetLabel {
        text: "Email address"
        size: "${size}"
        disabled: ${disabled}
        required: ${required}
        optional: ${optional}
        invalid: ${invalid}
    }

    ChaSetInput {
        width: parent.width
        placeholder: "name@example.com"
        size: "${size}"
        disabled: ${disabled}
        invalid: ${invalid}
    }
}`;

  return (
    <DocLayout
      category="Base Primitives"
      title="Label"
      description="Renders an accessible label associated with form controls."
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.label.overviewDesc', 'Adjust size, required markers, optional indicators, validation states, and disabled appearance in real time.')}
        </p>

        <ComponentPreview
          title="Label Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{t('common.size', 'Size:')}</span>
                <SegmentedControl
                  size="sm"
                  value={size}
                  onChange={(s) => setSize(s as LabelSize)}
                  options={[
                    { label: 'Default', value: 'default' },
                    { label: 'Small (sm)', value: 'sm' },
                  ]}
                />
              </div>

              <Checkbox
                size="sm"
                label={t('common.disabled', 'Disabled')}
                checked={disabled}
                onCheckedChange={(v) => setDisabled(v)}
              />

              <Checkbox
                size="sm"
                label={t('common.required', 'Required')}
                checked={required}
                onCheckedChange={(v) => setRequired(v)}
              />

              <Checkbox
                size="sm"
                label={t('common.optional', 'Optional')}
                checked={optional}
                onCheckedChange={(v) => setOptional(v)}
              />

              <Checkbox
                size="sm"
                label={t('common.invalid', 'Invalid')}
                checked={invalid}
                onCheckedChange={(v) => setInvalid(v)}
              />
            </div>
          }
        >
          <div className="grid w-full max-w-sm items-center gap-2 p-4">
            <Label
              htmlFor="sandbox-email"
              size={size}
              disabled={disabled}
              required={required}
              optional={optional}
              invalid={invalid}
            >
              {t('components.label.emailAddress', 'Email address')}
            </Label>
            <Input
              type="email"
              id="sandbox-email"
              placeholder={t('components.label.emailPlaceholder', 'name@example.com')}
              size={size}
              disabled={disabled}
              invalid={invalid}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Label } from '@chahu/cha-set';

<Label htmlFor="email">Email Address</Label>`}
        qtCode={`import ChaSet

ChaSetLabel {
    text: "Email Address"
}`}
      />

      {/* 3. Sizes */}
      <section id="sizes" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3" data-toc-title="Sizes">
          {t('components.label.sizesTitle', 'Sizes')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.label.sizesDesc', 'Choose between standard text size and compact high-density size for toolbars or dense forms.')}
        </p>
        <Card className="p-6">
          <CardContent className="space-y-4 p-0">
            <div className="flex items-center gap-4">
              <span className="w-24 text-xs text-muted-foreground">{t('common.default', 'Default')}:</span>
              <Label size="default">{t('components.label.defaultLabel', 'Default Label')}</Label>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-xs text-muted-foreground">{t('common.small', 'Small')}:</span>
              <Label size="sm">{t('components.label.smallLabel', 'Small Label')}</Label>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 4. States */}
      <section id="states" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3" data-toc-title="States & Variants">
          {t('components.label.statesTitle', 'States & Variants')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.label.statesDesc', 'Visual matrix of label states including required asterisk, optional tag, validation error, helper description, and tooltips.')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground">{t('components.label.requiredTitle', 'Required Indicator')}</span>
              <span className="text-xs text-muted-foreground">{t('components.label.requiredDesc', 'Destructive asterisk denoting mandatory input fields')}</span>
              <div className="pt-2">
                <Label required>{t('components.label.workEmail', 'Work Email')}</Label>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground">{t('components.label.optionalTitle', 'Optional Indicator')}</span>
              <span className="text-xs text-muted-foreground">{t('components.label.optionalDesc', 'Muted tag denoting non-mandatory optional fields')}</span>
              <div className="pt-2">
                <Label optional>{t('components.label.altPhone', 'Alternative Phone')}</Label>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground">{t('components.label.invalidTitle', 'Validation Error (Invalid)')}</span>
              <span className="text-xs text-muted-foreground">{t('components.label.invalidDesc', 'Destructive text color highlighting a field with validation errors')}</span>
              <div className="pt-2">
                <Label invalid>{t('components.label.accountPassword', 'Account Password')}</Label>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground">{t('components.label.tooltipTitle', 'With Info Tooltip')}</span>
              <span className="text-xs text-muted-foreground">{t('components.label.tooltipDesc', 'Help icon with contextual explanation on hover')}</span>
              <div className="pt-2">
                <Label tooltip={t('components.label.recoveryTooltip', 'Used for two-factor authentication recovery codes')}>{t('components.label.recoveryEmail', 'Recovery Email')}</Label>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground">{t('components.label.descriptionTitle', 'With Helper Description')}</span>
              <span className="text-xs text-muted-foreground">{t('components.label.descriptionDesc', 'Supporting guidance subtitle directly below the label')}</span>
              <div className="pt-2">
                <Label description={t('components.label.legalEntityHelper', 'Enter your company legal name as registered with tax authorities')}>
                  {t('components.label.legalEntityName', 'Legal Entity Name')}
                </Label>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium text-foreground">{t('components.label.disabledTitle', 'Disabled State')}</span>
              <span className="text-xs text-muted-foreground">{t('components.label.disabledDesc', 'Dimmed opacity for non-interactive form elements')}</span>
              <div className="pt-2">
                <Label disabled>{t('components.label.archivedRecordId', 'Archived Record ID')}</Label>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Form Association */}
      <section id="form-control" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3" data-toc-title="Form Association">
          {t('components.label.formControlTitle', 'Form Association')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('components.label.formControlDesc', 'Clicking the label activates or toggles the linked input element via htmlFor.')}
        </p>
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-base">{t('components.label.termsTitle', 'Terms and Conditions')}</CardTitle>
            <CardDescription>{t('components.label.termsSubtitle', 'Click the text below to toggle the checkbox')}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="cursor-pointer">
                {t('components.label.acceptTerms', 'I accept the terms and conditions')}
              </Label>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* 6. Props Reference */}
            <ComponentReference
        name="Label"
        componentId="label"
        props={[
            {
              name: 'size',
              type: "'default' | 'sm'",
              default: "'default'",
              description: 'Text size variant (default or compact sm).',
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: 'Whether the label is displayed in a disabled dimmed state.',
            },
            {
              name: 'required',
              type: 'boolean',
              default: 'false',
              description: 'Displays a destructive colored asterisk marker.',
            },
            {
              name: 'optional',
              type: 'boolean',
              default: 'false',
              description: 'Displays a muted optional text indicator.',
            },
            {
              name: 'invalid',
              type: 'boolean',
              default: 'false',
              description: 'Displays destructive text color indicating validation error.',
            },
            {
              name: 'description',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Supporting helper text rendered beneath the label.',
            },
            {
              name: 'tooltip',
              type: 'ReactNode',
              default: 'undefined',
              description: 'Contextual help tooltip text or node displayed with info icon.',
            },
            {
              name: 'htmlFor',
              type: 'string',
              default: 'undefined',
              description: 'ID of the form element the label is bound to.',
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: 'Additional custom CSS classes.',
            },
          ]}
      />
    </DocLayout>
  );
}
