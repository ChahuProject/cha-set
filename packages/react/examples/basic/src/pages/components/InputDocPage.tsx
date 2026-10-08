import React, { useState } from 'react';
import { Input, type InputSize, Button, Badge, SegmentedControl, Checkbox, CodeBlock, MailIcon, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from "../../components/ComponentReference";
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function InputDocPage() {
  const { t } = useChaSetI18n();
  const [size, setSize] = useState<InputSize>('default');
  const [disabled, setDisabled] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [clearable, setClearable] = useState(true);
  const [passwordToggle, setPasswordToggle] = useState(true);
  const [showIcon, setShowIcon] = useState(true);
  const [bordered, setBordered] = useState(true);
  const [value, setValue] = useState('user@chahu.dev');
  const [placeholder, setPlaceholder] = useState('Enter your email...');
  const [type, setType] = useState<'text' | 'password'>('text');

  const heroReactCode = `<div className="w-full max-w-sm flex flex-col gap-2">
  <Input
    type="${type}"
    size="${size}"
    placeholder="${placeholder}"
    value="${value}"
    disabled={${disabled}}
    invalid={${invalid}}
    clearable={${clearable}}
    bordered={${bordered}}
    passwordToggle={${passwordToggle}}${showIcon ? '\n    icon={<MailIcon className="size-4" />}' : ''}
    onChange={(e) => setValue(e.target.value)}
  />
</div>`;

  const heroQtCode = `ChaSetInput {
    width: 280
    size: "${size}"
    type: "${type}"
    placeholderText: "${placeholder}"
    text: "${value}"
    disabled: ${disabled}
    invalid: ${invalid}
    clearable: ${clearable}
    bordered: ${bordered}
    passwordToggle: ${passwordToggle}${showIcon ? '\n    icon: "mail"' : ''}
    onTextEdited: { /* handle text */ }
}`;

  return (
    <DocLayout
      category="Forms & Inputs"
      title="Input"
      description={t('components.input.description', 'Displays a form text input field or a component that looks like an input field.')}
    >
      {/* 1. Interactive Sandbox Preview */}
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.input.overviewHeading', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('formsA.input.overviewDesc', 'Explore interactive input behaviors, sizes, states, clearable action, password toggle, and responsive token styling across Web and Qt Desktop.')}
        </p>

        <ComponentPreview
          title={t('desktopComposite.input.sandboxTitle', 'Input Sandbox')}
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
                  onChange={(v) => setSize(v as InputSize)}
                  options={[
                    { label: t('common.default', 'Default'), value: 'default' },
                    { label: t('formsA.input.sizeSm', 'Small (sm)'), value: 'sm' },
                  ]}
                />
              </div>

              {/* Type Selector */}
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs">{t('formsA.input.typeLabel', 'Type:')}</span>
                <SegmentedControl
                  size="sm"
                  value={type}
                  onChange={(v) => setType(v as 'text' | 'password')}
                  options={[
                    { label: t('formsA.input.typeText', 'Text'), value: 'text' },
                    { label: t('formsA.input.typePassword', 'Password'), value: 'password' },
                  ]}
                />
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-4">
                <Checkbox
                  size="sm"
                  checked={disabled}
                  onCheckedChange={(val) => setDisabled(val)}
                  label={t('common.disabled', 'Disabled')}
                />
                <Checkbox
                  size="sm"
                  checked={invalid}
                  onCheckedChange={(val) => setInvalid(val)}
                  label={t('formsA.input.invalid', 'Invalid')}
                />
                <Checkbox
                  size="sm"
                  checked={clearable}
                  onCheckedChange={(val) => setClearable(val)}
                  label={t('formsA.input.clearable', 'Clearable')}
                />
                <Checkbox
                  size="sm"
                  checked={showIcon}
                  onCheckedChange={(val) => setShowIcon(val)}
                  label={t('formsA.input.showIcon', 'Show Icon')}
                />
                <Checkbox
                  size="sm"
                  checked={bordered}
                  onCheckedChange={(val) => setBordered(val)}
                  label={t('formsA.input.bordered', 'Bordered')}
                />
                {type === 'password' && (
                  <Checkbox
                    size="sm"
                    checked={passwordToggle}
                    onCheckedChange={(val) => setPasswordToggle(val)}
                    label={t('formsA.input.passwordToggle', 'Password Toggle')}
                  />
                )}
              </div>
            </div>
          }
        >
          <div className="w-full max-w-sm flex flex-col gap-3 py-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t('formsA.input.emailAddress', 'Email address')}</span>
              {value && <span className="text-xs font-mono opacity-70">{t('formsA.input.charsCount', '{{count}} chars', { count: value.length })}</span>}
            </div>
            <Input
              type={type}
              size={size}
              placeholder={t('formsA.input.emailPlaceholder', 'Enter your email...')}
              value={value}
              disabled={disabled}
              invalid={invalid}
              clearable={clearable}
              bordered={bordered}
              icon={showIcon ? <MailIcon className="size-4" /> : undefined}
              passwordToggle={passwordToggle}
              onChange={(e) => setValue(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              {invalid ? (
                <span className="text-destructive font-medium">{t('formsA.input.emailError', 'Please enter a valid corporate email address.')}</span>
              ) : (
                t('formsA.input.emailHint', 'We will never share your email with anyone else.')
              )}
            </p>
          </div>
        </ComponentPreview>
      </section>

      {/* 2. Installation */}
      {/* 3. Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Input } from '@chahu/cha-set';\n\n<Input type="email" placeholder="Email" clearable />`}
        qtCode={`import ChaSet\n\nChaSetInput {\n    type: "email"\n    placeholder: "Email"\n    clearable: true\n}`}
      />

      {/* 4. Examples & States */}
      <section id="states" className="scroll-mt-20 my-10">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('showcase.examplesAndStates', 'Examples & States')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('formsA.input.examplesSubtitle', 'Visual matrix of common input configurations and states.')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-1.5 p-4 rounded-lg border border-border bg-card">
            <span className="text-xs font-medium text-foreground">{t('formsA.input.defaultInputTitle', 'Default Input')}</span>
            <span className="text-xs text-muted-foreground mb-2">{t('formsA.input.defaultInputDesc', 'Standard text input with placeholder')}</span>
            <Input placeholder={t('formsA.input.defaultInputPlaceholder', 'Enter username...')} />
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-lg border border-border bg-card">
            <span className="text-xs font-medium text-foreground">{t('formsA.input.smInputTitle', 'Small Size (sm)')}</span>
            <span className="text-xs text-muted-foreground mb-2">{t('formsA.input.smInputDesc', 'Compact height for tight toolbars')}</span>
            <Input size="sm" placeholder={t('formsA.input.smInputPlaceholder', 'Compact input...')} />
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-lg border border-border bg-card">
            <span className="text-xs font-medium text-foreground">{t('formsA.input.invalidInputTitle', 'Invalid / Error State')}</span>
            <span className="text-xs text-muted-foreground mb-2">{t('formsA.input.invalidInputDesc', 'Destructive highlight with error feedback')}</span>
            <Input invalid defaultValue="invalid-email@" placeholder="user@example.com" />
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-lg border border-border bg-card">
            <span className="text-xs font-medium text-foreground">{t('formsA.input.clearableInputTitle', 'Clearable Field')}</span>
            <span className="text-xs text-muted-foreground mb-2">{t('formsA.input.clearableInputDesc', 'Clickable clear action or Escape key')}</span>
            <Input clearable defaultValue={t('formsA.input.clearableInputVal', 'Click cross to clear')} />
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-lg border border-border bg-card">
            <span className="text-xs font-medium text-foreground">{t('formsA.input.passwordInputTitle', 'Password with Toggle')}</span>
            <span className="text-xs text-muted-foreground mb-2">{t('formsA.input.passwordInputDesc', 'Interactive visibility eye button')}</span>
            <Input type="password" passwordToggle defaultValue="supersecret123" />
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-lg border border-border bg-card">
            <span className="text-xs font-medium text-foreground">{t('formsA.input.disabledInputTitle', 'Disabled State')}</span>
            <span className="text-xs text-muted-foreground mb-2">{t('formsA.input.disabledInputDesc', 'Non-interactive with dimmed opacity')}</span>
            <Input disabled placeholder={t('formsA.input.disabledInputPlaceholder', 'Disabled field')} value={t('formsA.input.disabledInputVal', 'preset value')} />
          </div>
        </div>
      </section>

      {/* 5. Keyboard Navigation */}
            <ComponentReference
        name="Input"
        componentId="input"
        props={[
            {
              name: 'size',
              type: "'default' | 'sm'",
              default: "'default'",
              description: t('components.input.sizeDesc', 'The height and padding scale of the input.'),
            },
            {
              name: 'type',
              type: 'string',
              default: "'text'",
              description: t('components.input.typeDesc', 'Standard HTML/Qt input type: "text" | "password" | "email" | "search" | "number".'),
            },
            {
              name: 'placeholder',
              type: 'string',
              default: "''",
              description: t('components.input.placeholderDesc', 'Placeholder hint text displayed when input is empty.'),
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: t('components.input.disabledDesc', 'Disables user interactions and applies 50% opacity.'),
            },
            {
              name: 'readOnly',
              type: 'boolean',
              default: 'false',
              description: t('components.input.readOnlyDesc', 'Prevents editing value while keeping focusability.'),
            },
            {
              name: 'invalid',
              type: 'boolean',
              default: 'false',
              description: t('components.input.invalidDesc', 'Applies destructive error styling and aria-invalid attribute.'),
            },
            {
              name: 'clearable',
              type: 'boolean',
              default: 'false',
              description: t('components.input.clearableDesc', 'Renders a clear button when text is present to wipe content.'),
            },
            {
              name: 'passwordToggle',
              type: 'boolean',
              default: 'false',
              description: t('components.input.passwordToggleDesc', 'Renders an eye toggle button to reveal or mask passwords.'),
            },
            {
              name: 'leftIcon',
              type: 'ReactNode',
              default: 'undefined',
              description: t('components.input.leftIconDesc', 'Icon element rendered on the leading side of the input.'),
            },
            {
              name: 'rightIcon',
              type: 'ReactNode',
              default: 'undefined',
              description: t('components.input.rightIconDesc', 'Icon element rendered on the trailing side of the input.'),
            },
            {
              name: 'onClear',
              type: '() => void',
              default: 'undefined',
              description: t('components.input.onClearDesc', 'Callback fired when the clear button is clicked.'),
            },
            {
              name: 'forceHover',
              type: 'boolean',
              default: 'false',
              description: t('components.input.forceHoverDesc', 'Visual testing aid to force hover state styles.'),
            },
            {
              name: 'forceFocus',
              type: 'boolean',
              default: 'false',
              description: t('components.input.forceFocusDesc', 'Visual testing aid to force focus ring styles.'),
            },
            {
              name: 'className',
              type: 'string',
              default: "''",
              description: t('components.input.classNameDesc', 'Additional CSS class names to apply to the input element.'),
            },
          ]}
      />
    </DocLayout>
  );
}
