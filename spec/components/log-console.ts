import { z } from 'zod';

/**
 * Neutral API contract for LogConsole component.
 * High-performance virtualized terminal/log viewer with auto-scroll, ANSI color parsing, and one-click copy.
 */
export const logConsoleSchema = z.object({
  lines: z.array(z.string()).default([]),
  emptyText: z.string().default('No logs'),
  showCopy: z.boolean().default(true),
  showLineCount: z.boolean().default(true),
  autoScroll: z.boolean().default(true),
  copyTitle: z.string().default('Copy all logs'),
});

export type LogConsoleApi = z.infer<typeof logConsoleSchema>;
