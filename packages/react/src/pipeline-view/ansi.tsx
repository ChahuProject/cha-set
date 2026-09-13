import * as React from 'react';

interface AnsiStyle {
  color?: string;
  bold?: boolean;
  underline?: boolean;
}

const ANSI_COLOR_MAP: Record<number, string> = {
  30: 'var(--muted-foreground, #64748b)',
  31: '#ef4444', // red
  32: '#10b981', // green
  33: '#f59e0b', // yellow
  34: '#3b82f6', // blue
  35: '#d946ef', // magenta
  36: '#06b6d4', // cyan
  37: '#f3f4f6', // white
  90: '#94a3b8', // bright black
  91: '#f87171', // bright red
  92: '#34d399', // bright green
  93: '#fbbf24', // bright yellow
  94: '#60a5fa', // bright blue
  95: '#e879f9', // bright magenta
  96: '#22d3ee', // bright cyan
  97: '#ffffff', // bright white
};

/**
 * Tokenizes a single ANSI line into text chunks and associated styling.
 */
export function parseAnsi(text: string): Array<{ text: string; style: AnsiStyle }> {
  const result: Array<{ text: string; style: AnsiStyle }> = [];
  const regex = /\u001B\[([0-9;]*)m/g;
  let lastIndex = 0;
  let currentStyle: AnsiStyle = {};

  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    const chunk = text.slice(lastIndex, match.index);
    if (chunk) {
      result.push({ text: chunk, style: { ...currentStyle } });
    }
    lastIndex = regex.lastIndex;

    const codeStr = match[1];
    if (!codeStr || codeStr === '0') {
      currentStyle = {};
    } else {
      const codes = codeStr.split(';').map(Number);
      for (const code of codes) {
        if (code === 0) {
          currentStyle = {};
        } else if (code === 1) {
          currentStyle.bold = true;
        } else if (code === 4) {
          currentStyle.underline = true;
        } else if (ANSI_COLOR_MAP[code]) {
          currentStyle.color = ANSI_COLOR_MAP[code];
        }
      }
    }
  }

  const remainder = text.slice(lastIndex);
  if (remainder) {
    result.push({ text: remainder, style: { ...currentStyle } });
  }

  return result.length > 0 ? result : [{ text, style: {} }];
}

/**
 * Renders ANSI-coded string as React elements.
 */
export function AnsiText({ text }: { text: string }) {
  const tokens = React.useMemo(() => parseAnsi(text), [text]);

  if (tokens.length === 1 && !tokens[0]?.style.color && !tokens[0]?.style.bold && !tokens[0]?.style.underline) {
    return <span>{text}</span>;
  }

  return (
    <>
      {tokens.map((token, index) => {
        const style: React.CSSProperties = {};
        if (token.style.color) style.color = token.style.color;
        if (token.style.bold) style.fontWeight = 'bold';
        if (token.style.underline) style.textDecoration = 'underline';

        return (
          <span key={index} style={Object.keys(style).length > 0 ? style : undefined}>
            {token.text}
          </span>
        );
      })}
    </>
  );
}

/**
 * Converts ANSI-encoded string to HTML string for Qt StyledText rendering.
 */
export function ansiToHtml(text: string): string {
  const tokens = parseAnsi(text);
  return tokens
    .map(t => {
      let escaped = t.text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      if (t.style.bold) escaped = `<b>${escaped}</b>`;
      if (t.style.underline) escaped = `<u>${escaped}</u>`;
      if (t.style.color) escaped = `<font color="${t.style.color}">${escaped}</font>`;
      return escaped;
    })
    .join('');
}
