import * as React from 'react';
import {
  ReorderableList,
  type ReorderableListItem,
  Button,
  Card,
  useChaSetI18n,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocText } from '../../components/DocText';

export function ReorderableListDocPage() {
  const { t } = useChaSetI18n();

  const initialItems: ReorderableListItem[] = React.useMemo(
    () => [
      { id: 'name', label: t('desktopComposite.reorderableList.fieldName', 'File Name'), visible: true },
      { id: 'size', label: t('desktopComposite.reorderableList.fieldSize', 'File Size'), visible: true },
      { id: 'type', label: t('desktopComposite.reorderableList.fieldType', 'Item Type'), visible: true },
      { id: 'date', label: t('desktopComposite.reorderableList.fieldDate', 'Modified Date'), visible: true },
      { id: 'tags', label: t('desktopComposite.reorderableList.fieldTags', 'Tags'), visible: false },
      { id: 'author', label: t('desktopComposite.reorderableList.fieldAuthor', 'Author'), visible: false },
    ],
    [t],
  );

  const [items, setItems] = React.useState<ReorderableListItem[]>(initialItems);
  const [reorderable, setReorderable] = React.useState<boolean>(true);

  const handleToggleReorderable = () => {
    setReorderable((prev) => !prev);
  };

  const handleAddItem = () => {
    const nextItem: ReorderableListItem = {
      id: `custom_${items.length + 1}`,
      label: `${t('desktopComposite.reorderableList.fieldName', 'File Name')} (${items.length + 1})`,
      visible: true,
    };
    setItems((prev) => [...prev, nextItem]);
  };

  const handleReset = () => {
    setItems(initialItems);
    setReorderable(true);
  };

  const heroReactCode = `<ReorderableList
  items={[
    { id: "name", label: "${t('desktopComposite.reorderableList.fieldName', 'File Name')}", visible: true },
    { id: "size", label: "${t('desktopComposite.reorderableList.fieldSize', 'File Size')}", visible: true },
    { id: "type", label: "${t('desktopComposite.reorderableList.fieldType', 'Item Type')}", visible: true },
    { id: "date", label: "${t('desktopComposite.reorderableList.fieldDate', 'Modified Date')}", visible: true },
    { id: "tags", label: "${t('desktopComposite.reorderableList.fieldTags', 'Tags')}", visible: false },
  ]}
  reorderable={${reorderable}}
  onItemsEdited={(newItems) => console.log("Items edited:", newItems)}
/>`;

  const heroQtCode = `ChaSetReorderableList {
    width: parent.width
    reorderable: ${reorderable}
    items: [
        { id: "name", label: "${t('desktopComposite.reorderableList.fieldName', 'File Name')}", visible: true },
        { id: "size", label: "${t('desktopComposite.reorderableList.fieldSize', 'File Size')}", visible: true },
        { id: "type", label: "${t('desktopComposite.reorderableList.fieldType', 'Item Type')}", visible: true },
        { id: "date", label: "${t('desktopComposite.reorderableList.fieldDate', 'Modified Date')}", visible: true },
        { id: "tags", label: "${t('desktopComposite.reorderableList.fieldTags', 'Tags')}", visible: false }
    ]
    onItemsEdited: (newItems) => console.log("Items edited:", newItems)
}`;

  return (
    <DocLayout
      category="Composite Engines"
      title="Reorderable List"
      description={t(
        'components.reorderableList.description',
        'Drag-and-drop reorderable action list with insertion slot indicators and Alt solo toggles.',
      )}
      tocItems={[
        { id: 'overview', title: t('showcase.interactiveOverview', 'Interactive Overview') },
        { id: 'installation', title: t('showcase.installation', 'Installation') },
        { id: 'animations', title: t('showcase.animations', 'Animations') },
        { id: 'keyboard', title: t('showcase.keyboardNavigation', 'Keyboard Navigation') },
        { id: 'props', title: t('showcase.propsReference', 'Props Reference') },
      ]}
    >
      <DocText id="overview-desc" className="text-muted-foreground text-sm mb-4">
        {t(
          'desktopComposite.reorderableList.overviewDesc',
          'Interactive list supporting drag-and-drop reordering with collinear slot indicators, custom action columns, and Alt+Click solo/invert toggles.',
        )}
      </DocText>

      <ComponentPreview
        title={t('desktopComposite.reorderableList.sandboxTitle', 'Reorderable List Sandbox')}
        reactCode={heroReactCode}
        qtCode={heroQtCode}
      >
        <div className="flex flex-col gap-6 w-full max-w-sm items-center text-foreground">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleToggleReorderable}>
              {t('desktopComposite.reorderableList.toggleReorderable', 'Toggle Reorderable')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleAddItem}>
              {t('desktopComposite.reorderableList.addItem', 'Add Item')}
            </Button>
            <Button variant="secondary" size="sm" onClick={handleReset}>
              {t('desktopComposite.reorderableList.resetList', 'Reset Items')}
            </Button>
          </div>

          <Card className="p-3 w-full border border-border bg-card text-card-foreground">
            <ReorderableList
              items={items}
              reorderable={reorderable}
              onItemsEdited={(next: ReorderableListItem[]) => setItems(next)}
            />
          </Card>
        </div>
      </ComponentPreview>

      <section id="installation" className="mt-8 scroll-mt-20">
        <DocText role="h2">{t('showcase.installation', 'Installation')}</DocText>
        <div className="mt-4 rounded-lg border border-border bg-card p-4 font-mono text-xs text-card-foreground">
          <code>npm install @chahu/cha-set</code>
        </div>
      </section>

      <DocMarkdown id="reorderable-list" section="animations" />
      <DocMarkdown id="reorderable-list" section="keyboard" />
      <DocMarkdown id="reorderable-list" section="props" />
    </DocLayout>
  );
}
