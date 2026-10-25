/** Type surface for spec/shared/docAst.mjs — the runtime parser shared by React and Qt. */

export type DocInline =
  | { t: 'text'; v: string }
  | { t: 'strong'; c: DocInline[] }
  | { t: 'em'; c: DocInline[] }
  | { t: 'code'; v: string }
  /** Keycap group, e.g. `Ctrl+K` or `Space / Enter` — the serialized form both Kbd primitives parse. */
  | { t: 'kbd'; v: string };

/** Cell treatment behind ```` ```table <schema> ```` — see DOC_SCHEMAS in docAst.mjs. */
export type DocTableCellKind = 'rich' | 'code' | 'copyable' | 'kbd';

export interface DocTableColumn {
  kind: DocTableCellKind;
  /** Reserved width (dp on Qt, px on the web). The last column stays flexible. */
  width?: number;
  wrap?: boolean;
}

export type DocTableSchema = 'plain' | 'props' | 'shortcuts';

export type DocBlock =
  | { t: 'heading'; level: number; id: string; inlines: DocInline[] }
  | { t: 'para'; inlines: DocInline[] }
  | { t: 'list'; ordered: boolean; items: DocInline[][] }
  | { t: 'table'; schema: DocTableSchema; head: DocInline[][]; rows: DocInline[][][] }
  | { t: 'slot'; name: string };

export interface DocSection {
  id: string;
  title: string;
  blocks: DocBlock[];
}

export interface DocPage {
  id: string;
  component: string;
  category: string;
  title: string;
  description: string;
  sections: DocSection[];
}

export interface DocFrontMatter {
  meta: Record<string, string>;
  body: string;
  errors: string[];
}

export declare const DOC_SLOTS: string[];
export declare const DOC_SCHEMAS: Record<DocTableSchema, DocTableColumn[]>;

export declare function parseFrontMatter(source: string): DocFrontMatter;
export declare function parseInline(text: string): DocInline[];
export declare function buildDocAst(source: string): { page: DocPage | null; errors: string[] };
export declare function sectionIds(page: DocPage | null): string[];
export declare function slotNames(page: DocPage | null): string[];
/** Flatten inline nodes to plain text (cells that are badges / keycaps, not prose). */
export declare function inlineText(nodes: DocInline[]): string;
/** `"Ctrl + Shift + P"` → `[["Ctrl","Shift","P"]]`; `"Space / Enter"` → `[["Space"],["Enter"]]`. */
export declare function splitShortcut(text: string): string[][];
