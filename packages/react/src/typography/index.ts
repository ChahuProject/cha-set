/**
 * ChaSet Typography & Font System Constants
 *
 * Exposes the single-source-of-truth font family stacks and typography tokens
 * for programmatic consumption by React host applications.
 */

export const defaultSansFontStack =
  "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', 'WenQuanYi Micro Hei', 'Helvetica Neue', Arial, sans-serif";

export const defaultMonoFontStack =
  "ui-monospace, SFMono-Regular, 'Cascadia Code', Menlo, Monaco, Consolas, 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'Liberation Mono', 'Courier New', monospace";

export const typographyTokens = {
  fontSize: {
    nano: '0.5625rem',     // 9px
    micro: '0.625rem',     // 10px
    caption: '0.6875rem',  // 11px
    small: '0.75rem',      // 12px
    body: '0.875rem',      // 14px
    heading: '1rem',       // 16px
    subheading: '1.125rem',// 18px
    titleSm: '1.25rem',    // 20px
    titleMd: '1.5rem',     // 24px
    title: '1.75rem',      // 28px
    display: '2.25rem',    // 36px
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    code: 1.4,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;
