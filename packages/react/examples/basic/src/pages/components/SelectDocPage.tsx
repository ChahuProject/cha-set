import React, { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function SelectDocPage() {
  const { t } = useChaSetI18n();
  const [value, setValue] = useState('apple');

  const reactCode = `<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruits</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="blueberry">Blueberry</SelectItem>
      <SelectItem value="grapes">Grapes</SelectItem>
      <SelectItem value="pineapple">Pineapple</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`;

  return (
    <DocLayout
      category="Forms & Inputs"
      title="Select"
      description={t('components.select.description', 'Displays a list of options for the user to pick from, triggered by a button with item indicators and scroll buttons.')}
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          {t('desktopComposite.select.overviewHeading', 'Interactive Overview')}
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t('formsA.select.overviewDesc', 'Select an item from the menu. Selected value: {{value}}', { value })}
        </p>

        <ComponentPreview
          qtCode={`ChaSetSelect {
    value: "apple"
    placeholder: "Choose fruit..."
    options: [
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
        { value: "cherry", label: "Cherry" }
    ]
    onValueChanged: function(val) { console.log(val) }
}`} title={t('desktopComposite.select.sandboxTitle', 'Select Sandbox')} reactCode={reactCode}>
          <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder={t('formsA.select.placeholder', 'Select a fruit')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t('formsA.select.fruitsGroup', 'Fruits')}</SelectLabel>
                <SelectItem value="apple">{t('formsA.select.apple', 'Apple')}</SelectItem>
                <SelectItem value="banana">{t('formsA.select.banana', 'Banana')}</SelectItem>
                <SelectItem value="blueberry">{t('formsA.select.blueberry', 'Blueberry')}</SelectItem>
                <SelectItem value="grapes">{t('formsA.select.grapes', 'Grapes')}</SelectItem>
                <SelectItem value="pineapple">{t('formsA.select.pineapple', 'Pineapple')}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@chahu/cha-set';

<Select defaultValue="apple">
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Select fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
  </SelectContent>
</Select>`}
        qtCode={`import ChaSet

ChaSetSelect {
    model: ["Apple", "Banana", "Orange"]
    currentText: "Apple"
}`}
      />



            <ComponentReference
        name="Select"
        componentId="select"
        props={[
            { name: 'value', type: 'string', default: 'undefined', description: t('components.select.valueDesc', 'Controlled selected value.') },
            { name: 'defaultValue', type: 'string', default: 'undefined', description: t('components.select.defaultValueDesc', 'Initial value for uncontrolled usage.') },
            { name: 'onValueChange', type: '(value: string) => void', default: 'undefined', description: t('components.select.onValueChangeDesc', 'Callback triggered when value changes.') },
            { name: 'disabled', type: 'boolean', default: 'false', description: t('components.select.disabledDesc', 'Whether the select is disabled.') },
          ]}
      />
    </DocLayout>
  );
}
