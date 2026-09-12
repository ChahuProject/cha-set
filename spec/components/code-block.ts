import { z } from 'zod';

/**
 * Neutral API contract for the CodeBlock composite.
 *
 * CodeBlock is the first display-oriented composite in ChaSet: it is assembled
 * entirely from library primitives (ScrollArea + CopyButton + Tabs + Badge) and
 * a spec-driven syntax lexer (spec/highlight), so React and Qt render the exact
 * same tokens and colors with no third-party highlighter dependency.
 *
 * `language` is free-form (not an enum) on purpose: it is resolved through the
 * lexer's alias table (spec/highlight/languages.json), which is the single
 * source of truth for supported languages. Unknown values degrade to plain text.
 */

/** One entry of the `files` multi-file tab group. */
export const codeBlockFileSchema = z.object({
  /** Tab label, normally a file name (e.g. "Button.tsx"). */
  name: z.string(),
  /** File source text. */
  code: z.string(),
  /** Per-file language override; falls back to the parent `language`. */
  language: z.string().optional(),
});

export const codeBlockSchema = z.object({
  /** Source text. Ignored when `files` is provided. */
  code: z.string().default(''),
  /** Language id or alias resolved by the lexer (e.g. "tsx", "qml", "bash"). */
  language: z.string().default('tsx'),
  /** Header title override; defaults to the resolved language label. */
  filename: z.string().optional(),
  /** Multi-file tab group; when present it replaces the single `code` body. */
  files: z.array(codeBlockFileSchema).optional(),
  /** Enable spec-driven syntax highlighting (off renders monochrome text). */
  highlight: z.boolean().default(true),
  /** Render a line-number gutter. */
  showLineNumbers: z.boolean().default(false),
  /** Render the language / filename label in the header. */
  showLanguage: z.boolean().default(true),
  /** Render the built-in copy button in the header. */
  showCopy: z.boolean().default(true),
  /** Wrap long lines instead of scrolling horizontally. */
  wrap: z.boolean().default(false),
  /** Bound the content height (px number or any CSS length string); enables vertical scroll. */
  maxHeight: z.union([z.number(), z.string()]).optional(),
  /** Drop the card chrome (border / background / header) for inline prose embedding. */
  embedded: z.boolean().default(false),
  /** Accessible label for the copy button; defaults to "Copy code". */
  copyLabel: z.string().optional(),
  /** Extra classes on the root element (layout/spacing overrides). */
  className: z.string().optional(),
});

export type CodeBlockFile = z.infer<typeof codeBlockFileSchema>;
export type CodeBlockApi = z.infer<typeof codeBlockSchema>;
