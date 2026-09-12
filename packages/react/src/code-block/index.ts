export { CodeBlock, type CodeBlockProps, type CodeBlockFileProps } from './CodeBlock';
export { CodeBlockHeader, type CodeBlockHeaderProps } from './CodeBlockHeader';
export { HighlightedCode, tokenColorVar, type HighlightedCodeProps } from './HighlightedCode';

// The shared lexer is part of the public surface: hosts can re-tokenize for
// their own renderers and are guaranteed the same token stream as Qt.
export {
  tokenize,
  toLines,
  resolveLanguage,
  languageLabel,
  isHighlightable,
  buildRichText,
} from './tokenize.generated';
export type { Token, TokenType } from './tokenize.generated';
