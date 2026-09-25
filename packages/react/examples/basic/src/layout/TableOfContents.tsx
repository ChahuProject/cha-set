import React, { useEffect, useState } from 'react';
import {
  ScrollArea,
  TableOfContents as ChaSetTableOfContents,
  flattenTocItems,
  type TocItem,
} from '@chahu/cha-set';

export type { TocItem };

/** Heading tag -> outline depth. The page title (h1) sits outside the scanned
 * container, so document pages normally resolve to h2 sections / h3 subsections. */
const HEADING_LEVELS: Record<string, number> = { h1: 1, h2: 2, h3: 3, h4: 4 };
const DEFAULT_LEVEL = 2;

/** Gap kept between the sticky banner and the jumped-to heading. */
const BANNER_GAP_REM = 0.75;

const CANONICAL_TITLES: Record<string, string> = {
  overview: 'Interactive Overview',
  installation: 'Installation',
  states: 'Examples & States',
  animations: 'Animations',
  keyboard: 'Keyboard Navigation',
  props: 'Props Reference',
};

/** Anchors the outline may point at: explicit section wrappers plus any heading
 * or `div` that already carries an id. */
const ANCHOR_SELECTOR = [
  'section[id]',
  '[data-toc-id]',
  '[data-section-id]',
  'h1[id]',
  'h2[id]',
  'h3[id]',
  'h4[id]',
  'div[id]',
].join(', ');

export function slugToTitle(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function headingFor(el: HTMLElement): HTMLElement | null {
  if (HEADING_LEVELS[el.tagName.toLowerCase()]) return el;
  return el.querySelector<HTMLElement>(
    ':scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > div > h1, :scope > div > h2, :scope > div > h3, :scope > div > h4, [data-toc-heading]'
  );
}

function levelFor(el: HTMLElement): number {
  const heading = headingFor(el);
  const tag = heading?.tagName.toLowerCase() ?? '';
  return HEADING_LEVELS[tag] ?? DEFAULT_LEVEL;
}

function titleFor(el: HTMLElement, id: string, heading: HTMLElement | null): string {
  const explicit = el.getAttribute('data-toc-title')?.trim();
  if (explicit) return explicit;

  let title = '';
  if (HEADING_LEVELS[el.tagName.toLowerCase()]) {
    title = el.textContent?.trim() ?? '';
  } else if (heading) {
    title = heading.textContent?.trim() ?? '';
  }

  const canonical = CANONICAL_TITLES[id];
  const isSandboxOverview = id === 'overview' && title.toLowerCase().includes('sandbox');
  if (!title || isSandboxOverview) {
    return canonical ?? (title || slugToTitle(id));
  }
  return title;
}

/** Rebase depths so the shallowest heading in the outline renders flush; a page
 * whose top-level headings are h2 must not indent every row by one step. */
function normalizeLevels(items: TocItem[]): TocItem[] {
  if (items.length === 0) return items;
  const min = Math.min(...items.map((item) => item.level ?? DEFAULT_LEVEL));
  return items.map((item) => ({ ...item, level: (item.level ?? DEFAULT_LEVEL) - min + 1 }));
}

function sameOutline(a: TocItem[], b: TocItem[]): boolean {
  return (
    a.length === b.length &&
    a.every(
      (item, i) =>
        item.id === b[i]?.id && item.title === b[i]?.title && item.level === b[i]?.level
    )
  );
}

export function scanDocSections(container: HTMLElement | null): TocItem[] {
  if (!container) return [];

  const candidates = Array.from(container.querySelectorAll<HTMLElement>(ANCHOR_SELECTOR));
  const items: TocItem[] = [];
  const seenIds = new Set<string>();

  for (const el of candidates) {
    const id = (el.getAttribute('data-toc-id') || el.getAttribute('data-section-id') || el.id || '').trim();
    if (!id || seenIds.has(id)) continue;

    const isHeading = !!HEADING_LEVELS[el.tagName.toLowerCase()];
    const heading = headingFor(el);
    const hasDataAttr =
      el.hasAttribute('data-toc-id') ||
      el.hasAttribute('data-toc-title') ||
      el.hasAttribute('data-section-id');
    const isKnownSection = id in CANONICAL_TITLES || id === 'examples';

    if (!isHeading && !heading && !hasDataAttr && !isKnownSection) continue;

    seenIds.add(id);
    items.push({ id, title: titleFor(el, id, heading), level: levelFor(el) });
  }

  return normalizeLevels(items);
}

/** Explicit `tocItems` keep their labels and order; depth is read back from the
 * rendered DOM so a flat hand-written list still renders as a hierarchy. */
export function enrichTocLevels(items: TocItem[], container: HTMLElement | null): TocItem[] {
  if (!container || items.length === 0) return items;

  const enriched = items.map((item) => {
    const el = document.getElementById(item.id);
    if (!el || !container.contains(el)) return item;
    return { ...item, level: item.level ?? levelFor(el) };
  });

  return normalizeLevels(enriched);
}

function rootFontSize(): number {
  if (typeof window === 'undefined') return 16;
  const size = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
  return Number.isFinite(size) && size > 0 ? size : 16;
}

/** Height of the sticky top banner, so jumped-to headings never land beneath it.
 * Measured from the live element because interface scale changes both the banner
 * height and the rem-relative gap. */
function useBannerOffset(): number {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const banner = document.querySelector<HTMLElement>('[data-slot="showcase-top-banner"]');
    if (!banner) return;

    const measure = () => {
      const height = banner.getBoundingClientRect().height;
      if (height <= 0) return;
      setOffset(Math.round(height + BANNER_GAP_REM * rootFontSize()));
    };

    measure();

    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    observer?.observe(banner);
    window.addEventListener('resize', measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  return offset;
}

export interface TableOfContentsProps {
  items?: TocItem[];
  containerRef?: React.RefObject<HTMLElement | null>;
}

export function TableOfContents({ items: propItems, containerRef }: TableOfContentsProps) {
  const [outline, setOutline] = useState<TocItem[]>([]);
  const bannerOffset = useBannerOffset();

  useEffect(() => {
    const hasExplicit = !!propItems && propItems.length > 0;

    if (!containerRef?.current) {
      if (hasExplicit) setOutline(propItems!);
      return;
    }

    const scan = () => {
      if (!containerRef.current) return;
      const detected = hasExplicit
        ? enrichTocLevels(propItems!, containerRef.current)
        : scanDocSections(containerRef.current);
      setOutline((prev) => (sameOutline(prev, detected) ? prev : detected));
    };

    scan();

    const observer = new MutationObserver(scan);
    observer.observe(containerRef.current, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [propItems, containerRef]);

  const items = outline;
  const [activeId, setActiveId] = useState<string>(() => items[0]?.id || '');

  useEffect(() => {
    if (items.length > 0 && !items.some((item) => item.id === activeId)) {
      setActiveId(items[0]!.id);
    }
  }, [items, activeId]);

  useEffect(() => {
    if (typeof window === 'undefined' || !items || items.length === 0) return;

    const flat = flattenTocItems(items);
    if (flat.length === 0) return;

    let ticking = false;

    const updateActive = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const innerHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      // 1. Bottom of page -> activate last item
      if (scrollY + innerHeight >= scrollHeight - 64) {
        const last = flat[flat.length - 1];
        if (last) {
          setActiveId(last.id);
          return;
        }
      }

      // 2. Top of page -> activate first item
      if (scrollY < 50) {
        const first = flat[0];
        if (first) {
          setActiveId(first.id);
          return;
        }
      }

      // 3. Current heading nearest reading baseline below bannerOffset
      const threshold = (bannerOffset || 56) + 40;
      let currentActive = flat[0]?.id;

      for (let i = 0; i < flat.length; i++) {
        const item = flat[i];
        if (!item) continue;
        const el = document.getElementById(item.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= threshold) {
          currentActive = item.id;
        }
      }

      // If near the bottom of the page, activate the lowest visible section
      const distFromBottom = scrollHeight - (scrollY + innerHeight);
      if (distFromBottom < innerHeight * 0.4) {
        for (let i = flat.length - 1; i >= 0; i--) {
          const item = flat[i];
          if (!item) continue;
          const el = document.getElementById(item.id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.top < innerHeight * 0.8 && rect.bottom > 0) {
            currentActive = item.id;
            break;
          }
        }
      }

      if (currentActive) {
        setActiveId(currentActive);
      }
    };

    const onScroll = () => {
      updateActive();
    };

    updateActive();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [items, bannerOffset]);

  if (!items || items.length === 0) return null;

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveId(id);
    const raw = window.location.hash;
    const baseRoute = raw.split('#').filter(Boolean).find((p) => p.startsWith('/')) || '/components/button';
    const cleanRoute = baseRoute.startsWith('/') ? `#${baseRoute}` : `/#${baseRoute}`;
    window.history.replaceState(null, '', `${window.location.pathname}${cleanRoute}#${id}`);
  };

  return (
    <aside className="w-56 shrink-0 hidden xl:block border-l border-border h-[calc(100vh-3.5rem)] sticky top-14 text-xs bg-background/50 overflow-hidden">
      <ScrollArea className="h-full w-full" viewportClassName="p-6">
        <ChaSetTableOfContents
          items={items}
          activeId={activeId}
          title="On this page"
          showTitle={true}
          showTrack={true}
          targetOffset={bannerOffset}
          onSelect={(item, e) => scrollToSection(e as any, item.id)}
        />
      </ScrollArea>
    </aside>
  );
}
