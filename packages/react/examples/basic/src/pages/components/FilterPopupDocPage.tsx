import React, { useState } from 'react';
import {
  FilterPopup,
  Button,
  Badge,
  SegmentedControl,
  useChaSetI18n,
  type FilterPopupItem,
} from '@chahu/cha-set';
import { DocLayout } from '../../layout/DocLayout';
import { DocMarkdown } from '../../components/DocMarkdown';
import { ComponentPreview } from '../../components/ComponentPreview';
import { DocAnatomy } from '../../components/DocAnatomy';
import { DocText } from '../../components/DocText';

export function FilterPopupDocPage() {
  const { t } = useChaSetI18n();
  const [activeTab, setActiveTab] = useState<'format' | 'rating' | 'tag'>('format');
  const [open, setOpen] = useState(false);

  // Filter states for sample formats
  const [formatItems, setFormatItems] = useState<FilterPopupItem[]>([
    { key: 'jpg', label: '.jpg', count: 142, isChecked: true },
    { key: 'png', label: '.png', count: 86 },
    { key: 'svg', label: '.svg', count: 24 },
    { key: 'exe', label: '.exe', count: 3, isExcluded: true },
    { key: 'json', label: '.json', count: 19 },
    { key: 'psd', label: '.psd', count: 8 },
  ]);

  // Filter states for ratings
  const [ratingItems, setRatingItems] = useState<FilterPopupItem[]>([
    { key: 5, stars: 5, count: 28 },
    { key: 4, stars: 4, count: 45, isChecked: true },
    { key: 3, stars: 3, count: 19 },
    { key: 2, stars: 2, count: 6 },
    { key: 1, stars: 1, count: 2, isExcluded: true },
    { key: 0, stars: 0, count: 120 },
  ]);

  // Filter states for tags
  const [tagItems, setTagItems] = useState<FilterPopupItem[]>([
    { key: 'landscape', label: '风景', color: '#3b82f6', count: 54, isChecked: true },
    { key: 'portrait', label: '人像', color: '#ec4899', count: 32 },
    { key: 'architecture', label: '建筑', color: '#10b981', count: 18 },
    { key: 'draft', label: '草稿', color: '#f59e0b', count: 9, isExcluded: true },
    { key: 'archive', label: '归档', color: '#6b7280', count: 75 },
  ]);

  const [tagLogicMode, setTagLogicMode] = useState<'and' | 'or'>('and');

  const currentItems =
    activeTab === 'format'
      ? formatItems
      : activeTab === 'rating'
        ? ratingItems
        : tagItems;

  const currentTitle =
    activeTab === 'format'
      ? t('overlays.filterPopup.formatFilter', '格式筛选')
      : activeTab === 'rating'
        ? t('overlays.filterPopup.ratingFilter', '评分筛选')
        : t('overlays.filterPopup.tagFilter', '标签筛选');

  const currentIcon =
    activeTab === 'format'
      ? 'folder'
      : activeTab === 'rating'
        ? 'star'
        : 'tag';

  const handleIncludeToggle = (key: string | number) => {
    const updateList = (prev: FilterPopupItem[]) =>
      prev.map((it) =>
        it.key === key
          ? { ...it, isChecked: !it.isChecked, isExcluded: false }
          : it,
      );
    if (activeTab === 'format') setFormatItems(updateList);
    else if (activeTab === 'rating') setRatingItems(updateList);
    else setTagItems(updateList);
  };

  const handleExcludeToggle = (key: string | number) => {
    const updateList = (prev: FilterPopupItem[]) =>
      prev.map((it) =>
        it.key === key
          ? { ...it, isExcluded: !it.isExcluded, isChecked: false }
          : it,
      );
    if (activeTab === 'format') setFormatItems(updateList);
    else if (activeTab === 'rating') setRatingItems(updateList);
    else setTagItems(updateList);
  };

  const handleClear = () => {
    const clearList = (prev: FilterPopupItem[]) =>
      prev.map((it) => ({ ...it, isChecked: false, isExcluded: false }));
    if (activeTab === 'format') setFormatItems(clearList);
    else if (activeTab === 'rating') setRatingItems(clearList);
    else setTagItems(clearList);
  };

  const hasActive = currentItems.some((it) => it.isChecked || it.isExcluded);

  const heroReactCode = `<FilterPopup
  open={${open}}
  onOpenChange={setOpen}
  title="${currentTitle}"
  icon="${currentIcon}"
  items={items}
  hasActive={${hasActive}}
  showLogicToggle={${activeTab === 'tag'}}
  logicMode="${tagLogicMode}"
  onLogicModeChange={setTagLogicMode}
  onClear={handleClear}
  onItemIncludeToggle={handleIncludeToggle}
  onItemExcludeToggle={handleExcludeToggle}
  trigger={
    <Button variant="outline" size="sm" className="gap-2">
      <span>${currentTitle}</span>
      {hasActive && <Badge size="xs" variant="secondary">Active</Badge>}
    </Button>
  }
/>`;

  const heroQtCode = `ChaSetFilterPopup {
    id: filterPopup
    title: "${currentTitle}"
    iconName: "${currentIcon}"
    items: currentItemsModel
    hasActive: ${hasActive}
    showLogicToggle: ${activeTab === 'tag'}
    logicMode: "${tagLogicMode}"
    onItemIncludeToggled: (key) => handleIncludeToggle(key)
    onItemExcludeToggled: (key) => handleExcludeToggle(key)
    onClearRequested: () => handleClear()
}`;

  return (
    <DocLayout
      category="Overlays & Feedback"
      title="Filter Popup"
      description={t(
        'components.filterPopup.description',
        'Multi-dimensional facet filtering popup with search, exclusions, ratings and shortcuts.',
      )}
    >
      <section id="overview" className="scroll-mt-20">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.filterPopup.overviewHeading', 'Interactive Overview')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t(
            'desktopComposite.filterPopup.overviewDesc',
            'Multi-dimensional facet filtering popup supporting tri-state inclusion and exclusion, instant pinyin fuzzy search, star ratings, and bottom keyboard shortcut guidance.',
          )}
        </DocText>

        <ComponentPreview
          title={t('desktopComposite.filterPopup.sandboxTitle', 'Filter Popup Sandbox')}
          reactCode={heroReactCode}
          qtCode={heroQtCode}
          controls={
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {t('overlays.filterPopup.dimension', 'Dimension:')}
                </span>
                <SegmentedControl
                  size="sm"
                  value={activeTab}
                  onChange={(val) => setActiveTab(val as 'format' | 'rating' | 'tag')}
                  options={[
                    { label: t('overlays.filterPopup.format', 'Format'), value: 'format' },
                    { label: t('overlays.filterPopup.rating', 'Rating'), value: 'rating' },
                    { label: t('overlays.filterPopup.tag', 'Tag'), value: 'tag' },
                  ]}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleClear} disabled={!hasActive}>
                  {t('overlays.filterPopup.clearDimension', 'Clear Dimension')}
                </Button>
                {hasActive && (
                  <Badge variant="secondary" size="sm">
                    {t('overlays.filterPopup.filtered', 'Filtered')}
                  </Badge>
                )}
              </div>
            </div>
          }
        >
          <div className="relative w-full h-[22.5rem] rounded-lg border border-dashed border-border bg-muted/10 flex flex-col items-center justify-center gap-4 p-6 overflow-hidden">
            <div className="text-center text-xs text-muted-foreground/70 select-none">
              {t(
                'overlays.filterPopup.hint',
                'Click the button below to open the filter popup, or press printable characters to test quick search.',
              )}
            </div>

            <FilterPopup
              open={open}
              onOpenChange={setOpen}
              title={currentTitle}
              icon={currentIcon}
              items={currentItems}
              searchEnabled={true}
              searchVisibility="autoHidden"
              validateFileName={activeTab === 'format'}
              hasActive={hasActive}
              showLogicToggle={activeTab === 'tag'}
              logicMode={tagLogicMode}
              onLogicModeChange={setTagLogicMode}
              onClear={handleClear}
              onItemIncludeToggle={handleIncludeToggle}
              onItemExcludeToggle={handleExcludeToggle}
              trigger={
                <Button variant="outline" size="sm" className="gap-2">
                  <span>{currentTitle}</span>
                  {hasActive && (
                    <Badge size="sm" variant="secondary" className="px-1 text-[0.625rem]">
                      {t('overlays.filterPopup.filteredBadge', '已筛选')}
                    </Badge>
                  )}
                </Button>
              }
            />

            <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mt-2">
              {currentItems
                .filter((it) => it.isChecked || it.isExcluded)
                .map((it) => (
                  <Badge
                    key={it.key}
                    variant={it.isExcluded ? 'destructive' : 'default'}
                    size="sm"
                    className="gap-1 font-mono text-[0.6875rem]"
                  >
                    {it.isExcluded ? '-' : '+'}
                    {typeof it.stars === 'number'
                      ? `${it.stars} ${t('overlays.filterPopup.stars', 'Stars')}`
                      : it.label ?? String(it.key)}
                  </Badge>
                ))}
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Anatomy */}
      <DocAnatomy
        id="anatomy"
        reactCode={`import { FilterPopup } from '@chahu/cha-set';

<FilterPopup
  title="Format Filter"
  icon="folder"
  items={items}
  onItemIncludeToggle={(key) => handleInclude(key)}
  onItemExcludeToggle={(key) => handleExclude(key)}
  trigger={<Button>Filter</Button>}
/>`}
        qtCode={`import ChaSet

ChaSetFilterPopup {
    title: "格式筛选"
    iconName: "folder"
    items: itemsModel
    onItemIncludeToggled: (key) => handleInclude(key)
    onItemExcludeToggled: (key) => handleExclude(key)
}`}
      />

      {/* Section: Animations */}
      <section id="animations" className="scroll-mt-20 my-10">
        <DocText role="h2" className="mb-3">
          {t('desktopComposite.filterPopup.animationsTitle', 'Animations')}
        </DocText>
        <DocText role="p" className="mb-4">
          {t(
            'desktopComposite.filterPopup.animationsDesc',
            'Fade and zoom scale transitions apply on popup entrance and exit with quick duration (90ms) and standard easing tokens. Micro-interactions for hover, checkbox states, and search expansions are animated smoothly and honor reduced motion preferences.',
          )}
        </DocText>
      </section>

      <DocMarkdown id="filter-popup" section="keyboard" />
      <DocMarkdown id="filter-popup" section="props" />
    </DocLayout>
  );
}
