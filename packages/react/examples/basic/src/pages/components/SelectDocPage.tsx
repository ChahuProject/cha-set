import React, { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, CodeBlock, useChaSetI18n } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

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
      <SelectItem value="apple" tooltip="Fuji crisp apples">Apple</SelectItem>
      <SelectItem value="banana" tooltip="Cavendish sweet bananas">Banana</SelectItem>
      <SelectItem value="blueberry" tooltip="Rich in antioxidants">Blueberry</SelectItem>
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
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.select.overviewHeading', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t('formsA.select.overviewDesc', 'Select an item from the menu. Selected value: {{value}}', { value })}
        </DocText>

        <ComponentPreview
          qtCode={`ChaSetSelect {
    value: "apple"
    placeholder: "Choose fruit..."
    options: [
        { value: "apple", label: "Apple", tooltip: "Fuji crisp apples" },
        { value: "banana", label: "Banana", tooltip: "Cavendish sweet bananas" },
        { value: "cherry", label: "Cherry", tooltip: "Rich in antioxidants" }
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
                <SelectItem value="apple" tooltip={t('formsA.select.appleTooltip', 'Fuji crisp apples')}>{t('formsA.select.apple', 'Apple')}</SelectItem>
                <SelectItem value="banana" tooltip={t('formsA.select.bananaTooltip', 'Cavendish sweet bananas')}>{t('formsA.select.banana', 'Banana')}</SelectItem>
                <SelectItem value="blueberry" tooltip={t('formsA.select.blueberryTooltip', 'Rich in antioxidants')}>{t('formsA.select.blueberry', 'Blueberry')}</SelectItem>
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
