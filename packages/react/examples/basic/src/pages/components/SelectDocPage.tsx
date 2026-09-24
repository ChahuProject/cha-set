import React, { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel, CodeBlock } from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { ComponentReference } from '../../components/ComponentReference';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';

export function SelectDocPage() {
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
      description="Displays a list of options for the user to pick from, triggered by a button with item indicators and scroll buttons."
    >
      <section id="overview" className="scroll-mt-20">
        <h2 className="text-xl font-semibold tracking-tight text-foreground mb-3">
          Interactive Overview
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Select an item from the menu. Selected value: <code>{value}</code>
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
}`} title="Select Sandbox" reactCode={reactCode}>
          <Select value={value} onValueChange={setValue}>
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
            { name: 'value', type: 'string', default: 'undefined', description: 'Controlled selected value.' },
            { name: 'defaultValue', type: 'string', default: 'undefined', description: 'Initial value for uncontrolled usage.' },
            { name: 'onValueChange', type: '(value: string) => void', default: 'undefined', description: 'Callback triggered when value changes.' },
            { name: 'disabled', type: 'boolean', default: 'false', description: 'Whether the select is disabled.' },
          ]}
      />
    </DocLayout>
  );
}
