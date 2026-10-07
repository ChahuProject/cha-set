import React, { useState } from 'react';
import { SegmentedControl, Card, useChaSetI18n } from '@chahu/cha-set';
import { Checkbox, type CheckboxSize } from '../../../../../src/checkbox';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { ComponentReference } from '../../components/ComponentReference';

export function CheckboxDocPage() {
  const { t } = useChaSetI18n();
  const [size, setSize] = useState<CheckboxSize>('default');
  const [checked, setChecked] = useState(true);
  const [indeterminate, setIndeterminate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [readOnly, setReadOnly] = useState(false);
  const [showDesc, setShowDesc] = useState(true);
  const [label, setLabel] = useState('Accept terms and conditions');
  const currentLabel = label === 'Accept terms and conditions' ? t('formsA.checkbox.sandboxLabel', 'Accept terms and conditions') : label;
  const descriptionText = showDesc ? t('formsA.checkbox.sandboxDescription', 'You agree to the automated billing policy and privacy guidelines.') : undefined;

  const heroReactCode = `<Checkbox
  size="${size}"
  checked={${indeterminate ? 'false' : checked}}
  indeterminate={${indeterminate}}
  disabled={${disabled}}
  readOnly={${readOnly}}
  invalid={${invalid}}
  label="${label}"
  ${descriptionText ? `description="${descriptionText}"\n  ` : ''}onCheckedChange={(val) => setChecked(val)}
/>`;

  const heroQtCode = `ChaSetCheckbox {
    size: "${size}"
    checked: ${indeterminate ? 'false' : checked}
    indeterminate: ${indeterminate}
    disabled: ${disabled}
    readOnly: ${readOnly}
    invalid: ${invalid}
    label: "${label}"
    ${descriptionText ? `description: "${descriptionText}"\n    ` : ''}onToggled: (val) => { /* handle toggle */ }
}`;

  return (
    <DocLayout
      category="Forms & Inputs"
      title="Checkbox"
      description="A control that allows the user to toggle between checked and not-checked states, with support for indeterminate states, sizes, helper descriptions, and companion labels."
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('formsA.checkbox.overviewDesc', 'Test interactive checkbox toggling, indeterminate states, helper descriptions, error states, and sizes across Web and Qt Desktop.')}
        </p>

        <ComponentPreview
          title="Checkbox Sandbox"
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-6">
              {/* Size Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('showcase.size', 'Size:')}</span>
                <SegmentedControl
                  size="sm"
                  value={size}
                  onChange={(v) => setSize(v as CheckboxSize)}
                  options={[
                    { label: t('common.default', 'Default'), value: 'default' },
                    { label: t('formsA.checkbox.sizeSm', 'Small (sm)'), value: 'sm' },
                  ]}
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4">
                <Checkbox
                  size="sm"
                  checked={checked && !indeterminate}
                  onCheckedChange={(val) => {
                    setChecked(val as boolean);
                    if (indeterminate) setIndeterminate(false);
                  }}
                  label={t('formsA.checkbox.checked', 'Checked')}
                />

                <Checkbox
                  size="sm"
                  checked={indeterminate}
                  onCheckedChange={(val) => setIndeterminate(val as boolean)}
                  label={t('formsA.checkbox.indeterminate', 'Indeterminate')}
                />

                <Checkbox
                  size="sm"
                  checked={disabled}
                  onCheckedChange={(val) => setDisabled(val as boolean)}
                  label={t('common.disabled', 'Disabled')}
                />

                <Checkbox
                  size="sm"
                  checked={readOnly}
                  onCheckedChange={(val) => setReadOnly(val as boolean)}
                  label={t('formsA.checkbox.readOnly', 'Read-Only')}
                />

                <Checkbox
                  size="sm"
                  checked={invalid}
                  onCheckedChange={(val) => setInvalid(val as boolean)}
                  label={t('formsA.checkbox.invalid', 'Invalid')}
                />

                <Checkbox
                  size="sm"
                  checked={showDesc}
                  onCheckedChange={(val) => setShowDesc(val as boolean)}
                  label={t('formsA.checkbox.descriptionLabel', 'Description')}
                />
              </div>
            </div>
          }
        >
          <div className="py-6 flex items-center justify-center">
            <Checkbox
              size={size}
              checked={checked}
              indeterminate={indeterminate}
              disabled={disabled}
              readOnly={readOnly}
              invalid={invalid}
              label={currentLabel}
              description={descriptionText}
              onCheckedChange={(next) => {
                if (indeterminate) setIndeterminate(false);
                setChecked(next as boolean);
              }}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Checkbox } from '@chahu/cha-set';\n\n<Checkbox\n  checked={agree}\n  onCheckedChange={setAgree}\n  label="Service agreement"\n  description="I agree to the service agreement and terms of use."\n/>`}
        qtCode={`import ChaSet\n\nChaSetCheckbox {\n    checked: agree\n    label: "Service agreement"\n    description: "I agree to the service agreement and terms of use."\n    onToggled: agree = checked\n}`}
      />

      {/* 4. Examples & States */}
      <section id="states" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Examples & States
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('formsA.checkbox.examplesSubtitle', 'Visual matrix of common checkbox configurations, sizes, descriptions, and states.')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col gap-2 p-5">
            <span className="text-xs font-semibold text-foreground">{t('formsA.checkbox.uncheckedCheckedTitle', 'Unchecked & Checked')}</span>
            <span className="text-xs text-muted-foreground mb-2">{t('formsA.checkbox.uncheckedCheckedDesc', 'Standard interactive states')}</span>
            <div className="flex flex-col gap-3">
              <Checkbox defaultChecked={false} label={t('formsA.checkbox.uncheckedByDefault', 'Unchecked by default')} />
              <Checkbox defaultChecked={true} label={t('formsA.checkbox.checkedByDefault', 'Checked by default')} />
            </div>
          </Card>

          <Card className="flex flex-col gap-2 p-5">
            <span className="text-xs font-semibold text-foreground">{t('formsA.checkbox.indeterminateTitle', 'Indeterminate State')}</span>
            <span className="text-xs text-muted-foreground mb-2">{t('formsA.checkbox.indeterminateDesc', 'Represents partially selected sub-options')}</span>
            <div className="flex flex-col gap-3">
              <Checkbox indeterminate label={t('formsA.checkbox.selectAllSubtasks', 'Select all sub-tasks')} />
              <div className="pl-6 flex flex-col gap-2">
                <Checkbox defaultChecked label={t('formsA.checkbox.task1', 'Task 1: Requirements')} size="sm" />
                <Checkbox defaultChecked={false} label={t('formsA.checkbox.task2', 'Task 2: Implementation')} size="sm" />
              </div>
            </div>
          </Card>

          <Card className="flex flex-col gap-2 p-5">
            <span className="text-xs font-semibold text-foreground">{t('formsA.checkbox.helperDescTitle', 'With Helper Description')}</span>
            <span className="text-xs text-muted-foreground mb-2">{t('formsA.checkbox.helperDescSubtitle', 'Detailed multi-line label and subtext')}</span>
            <div className="flex flex-col gap-3">
              <Checkbox
                defaultChecked
                label={t('formsA.checkbox.autoSyncLabel', 'Automatic background syncing')}
                description={t('formsA.checkbox.autoSyncDesc', 'Sync data with remote servers every 5 minutes when idle.')}
              />
            </div>
          </Card>

          <Card className="flex flex-col gap-2 p-5">
            <span className="text-xs font-semibold text-foreground">{t('formsA.checkbox.invalidTitle', 'Invalid / Error State')}</span>
            <span className="text-xs text-muted-foreground mb-2">{t('formsA.checkbox.invalidDesc', 'Highlights unchecked required confirmation')}</span>
            <div className="flex flex-col gap-3">
              <Checkbox
                invalid
                defaultChecked={false}
                label={t('formsA.checkbox.mandatoryLabel', 'Mandatory compliance confirmation')}
                description={t('formsA.checkbox.mandatoryDesc', 'Must be accepted before proceeding with setup.')}
              />
            </div>
          </Card>

          <Card className="flex flex-col gap-2 p-5">
            <span className="text-xs font-semibold text-foreground">{t('formsA.checkbox.disabledReadOnlyTitle', 'Disabled & Read-Only States')}</span>
            <span className="text-xs text-muted-foreground mb-2">{t('formsA.checkbox.disabledReadOnlyDesc', 'Dimmed non-interactive vs locked presentation')}</span>
            <div className="flex flex-col gap-3">
              <Checkbox disabled defaultChecked={false} label={t('formsA.checkbox.disabledUnchecked', 'Disabled unchecked')} />
              <Checkbox readOnly defaultChecked={true} label={t('formsA.checkbox.readOnlyChecked', 'Read-only checked')} />
            </div>
          </Card>

          <Card className="flex flex-col gap-2 p-5">
            <span className="text-xs font-semibold text-foreground">{t('formsA.checkbox.sizeVariantsTitle', 'Size Variants')}</span>
            <span className="text-xs text-muted-foreground mb-2">{t('formsA.checkbox.sizeVariantsDesc', 'Default vs Compact size')}</span>
            <div className="flex flex-col gap-3">
              <Checkbox size="default" defaultChecked label={t('formsA.checkbox.defaultSizeLabel', 'Default size (text-sm)')} />
              <Checkbox size="sm" defaultChecked label={t('formsA.checkbox.smSizeLabel', 'Small size (sm, text-xs)')} />
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Animations */}
      <section id="animations" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Animations
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Motion behavior and timing for the checked, indeterminate, and state transitions.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-sm text-foreground">
          <li>
            The check-mark SVG stays mounted and, when checked, fades in from opacity 0 to 1
            while scaling from 0.5 to 1 over{' '}
            <code className="text-xs bg-muted px-1 rounded">duration-quick</code> with the{' '}
            <code className="text-xs bg-muted px-1 rounded">ease-entrance</code> curve.
          </li>
          <li>
            The box border color cross-fades on hover, focus, checked, and invalid state changes.
          </li>
          <li>
            Durations and easing resolve from theme tokens, so{' '}
            <code>prefers-reduced-motion</code> zeroes them automatically (Qt: governed by{' '}
            <code>ThemeTokens.animationsEnabled</code>).
          </li>
        </ul>
      </section>

      {/* 5. Component Reference (Keyboard + Props) */}
      <ComponentReference
        name="Checkbox"
        componentId="checkbox"
        props={[
          {
            name: 'checked',
            type: 'boolean',
            default: 'false',
            description: 'The controlled checked state of the checkbox.',
          },
          {
            name: 'defaultChecked',
            type: 'boolean',
            default: 'false',
            description: 'The default checked state when uncontrolled.',
          },
          {
            name: 'indeterminate',
            type: 'boolean',
            default: 'false',
            description: 'Whether the checkbox is in an indeterminate state (takes visual precedence over checked).',
          },
          {
            name: 'disabled',
            type: 'boolean',
            default: 'false',
            description: 'Disables user interactions and applies 50% opacity.',
          },
          {
            name: 'readOnly',
            type: 'boolean',
            default: 'false',
            description: 'Prevents toggling state while retaining focusability and full opacity.',
          },
          {
            name: 'invalid',
            type: 'boolean',
            default: 'false',
            description: 'Applies destructive error styling and aria-invalid attribute.',
          },
          {
            name: 'size',
            type: "'default' | 'sm'",
            default: "'default'",
            description: 'The size variant: default or sm.',
          },
          {
            name: 'label',
            type: 'ReactNode',
            default: 'undefined',
            description: 'Optional companion label rendered alongside the checkbox.',
          },
          {
            name: 'description',
            type: 'ReactNode',
            default: 'undefined',
            description: 'Optional helper text rendered below the label.',
          },
          {
            name: 'onCheckedChange',
            type: '(checked: boolean) => void',
            default: 'undefined',
            description: 'Callback invoked when checked state changes.',
          },
          {
            name: 'forceHover',
            type: 'boolean',
            default: 'false',
            description: 'Visual testing aid to force hover state styles.',
          },
          {
            name: 'forceFocus',
            type: 'boolean',
            default: 'false',
            description: 'Visual testing aid to force focus ring styles.',
          },
          {
            name: 'className',
            type: 'string',
            default: "''",
            description: 'Additional CSS class names to apply to the checkbox button.',
          },
        ]}
      />
    </DocLayout>
  );
}
