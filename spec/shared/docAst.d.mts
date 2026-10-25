/** Type surface for spec/shared/docAst.mjs — the runtime parser shared by React and Qt. */

export type DocInline =
  | { t: 'text'; v: string }
  | { t: 'strong'; c: DocInline[] }
  | { t: 'em'; c: DocInline[] }
  | { t: 'code'; v: string };

export type DocBlock =
  | { t: 'heading'; level: number; id: string; inlines: DocInline[] }
  | { t: 'para'; inlines: DocInline[] }
  | { t: 'list'; ordered: boolean; items: DocInline[][] }
  | { t: 'table'; head: DocInline[][]; rows: DocInline[][][] }
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

export declare function parseFrontMatter(source: string): DocFrontMatter;
export declare function parseInline(text: string): DocInline[];
export declare function buildDocAst(source: string): { page: DocPage | null; errors: string[] };
export declare function sectionIds(page: DocPage | null): string[];
export declare function slotNames(page: DocPage | null): string[];
