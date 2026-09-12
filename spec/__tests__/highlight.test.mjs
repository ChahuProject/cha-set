// spec/__tests__/highlight.test.mjs — lexer correctness + cross-stack engine parity.
//
// Guards three things that would otherwise rot silently:
//   1. The token stream is lossless (joining tokens reproduces the source).
//   2. Classification rules still land on the intended token types.
//   3. React and Qt embed the byte-identical engine body, so both stacks can
//      never highlight the same source differently.
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  tokenize,
  toLines,
  buildRichText,
  languageLabel,
  isHighlightable,
  resolveLanguage,
} from '../highlight/engine.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..', '..');
const languagesPath = resolve(repoRoot, 'spec', 'highlight', 'languages.json');
const reactArtifact = resolve(repoRoot, 'packages', 'react', 'src', 'code-block', 'tokenize.generated.ts');
const qmlArtifact = resolve(repoRoot, 'qt', 'src', 'Highlighter.generated.qml');

const languages = JSON.parse(readFileSync(languagesPath, 'utf8'));

const SAMPLES = {
  tsx: [
    '<div className="flex items-center gap-4">',
    '  <Button variant="ghost" onClick={() => setCount((c) => c + 1)}>Copy</Button>',
    '  {/* block note */}',
    '</div>',
    'const SECRET = "sk_live_948271"; // inline',
    'const n = 0x1f + 42_000;',
    'async function load(url: string): Promise<void> {',
    '  try { await fetch(`${url}/api`); } catch (err) { throw err; }',
    '}',
  ].join('\n'),
  qml: [
    'import QtQuick 6.10',
    'import ChaSet',
    '',
    'ChaSetButton {',
    '    id: root',
    '    width: parent.width',
    '    text: root.copied ? "\\u2713 Copied!" : "Copy"',
    '    onClicked: root.copyToClipboard()',
    '}',
  ].join('\n'),
  bash: [
    'pnpm add @chahu/cha-set --save-dev',
    'if [ -f $LOCK ]; then',
    "  echo 'done' # trailing note",
    'fi',
  ].join('\n'),
  json: '{\n  "name": "@chahu/cha-set",\n  "private": true,\n  "count": 42,\n  "nested": { "ok": null }\n}',
  css: ':root {\n  --primary: #1d7ae0;\n  font-size: 13px;\n}\n.btn:hover { color: var(--primary); }',
  python: 'def greet(name: str) -> str:\n    """doc"""\n    return f"hi {name}"\n',
  html: '<a href="/docs" class="link">Docs</a>\n<!-- note -->',
  yaml: 'name: cha-set\nprivate: true\nitems:\n  - one\n  - two',
  text: 'anything at all <>&"\'',
};

const kinds = (source, language) => {
  const map = new Map();
  for (const token of tokenize(languages, source, language)) {
    if (token.t === 'plain') continue;
    if (!map.has(token.v)) map.set(token.v, token.t);
  }
  return map;
};

describe('highlight lexer', () => {
  describe('losslessness', () => {
    for (const [language, source] of Object.entries(SAMPLES)) {
      it(`round-trips ${language} byte for byte`, () => {
        const tokens = tokenize(languages, source, language);
        expect(tokens.map((t) => t.v).join('')).toBe(source);
      });

      it(`round-trips ${language} after line splitting`, () => {
        const lines = toLines(tokenize(languages, source, language));
        expect(lines.map((l) => l.map((t) => t.v).join('')).join('\n')).toBe(source);
        expect(lines.length).toBe(source.split('\n').length);
      });
    }
  });

  describe('classification', () => {
    it('classifies tsx tokens', () => {
      const map = kinds(SAMPLES.tsx, 'tsx');
      expect(map.get('const')).toBe('keyword');
      expect(map.get('async')).toBe('keyword');
      expect(map.get('setCount')).toBe('function');
      expect(map.get('Button')).toBe('type');
      expect(map.get('Promise')).toBe('type');
      expect(map.get('"sk_live_948271"')).toBe('string');
      expect(map.get('// inline')).toBe('comment');
      expect(map.get('/* block note */')).toBe('comment');
      expect(map.get('0x1f')).toBe('number');
      expect(map.get('42_000')).toBe('number');
    });

    it('classifies qml tokens', () => {
      const map = kinds(SAMPLES.qml, 'qml');
      expect(map.get('import')).toBe('keyword');
      expect(map.get('id')).toBe('keyword');
      expect(map.get('ChaSetButton')).toBe('type');
      expect(map.get('width')).toBe('property');
      expect(map.get('onClicked')).toBe('function');
      expect(map.get('"\\u2713 Copied!"')).toBe('string');
    });

    it('classifies bash tokens', () => {
      const map = kinds(SAMPLES.bash, 'bash');
      expect(map.get('pnpm')).toBe('function');
      expect(map.get('if')).toBe('keyword');
      expect(map.get('fi')).toBe('keyword');
      expect(map.get('--save-dev')).toBe('operator');
      expect(map.get('$LOCK')).toBe('variable');
      expect(map.get('# trailing note')).toBe('comment');
    });

    it('classifies bash variables outside of quotes', () => {
      const map = kinds('echo $HOME && echo ${PATH} && echo "$QUOTED"', 'bash');
      expect(map.get('$HOME')).toBe('variable');
      expect(map.get('${PATH}')).toBe('variable');
      expect(map.get('"$QUOTED"')).toBe('string');
    });

    it('classifies json tokens', () => {
      const map = kinds(SAMPLES.json, 'json');
      expect(map.get('null')).toBe('constant');
      expect(map.get('42')).toBe('number');
      expect(map.get('"name"')).toBe('string');
    });

    it('classifies css tokens', () => {
      const map = kinds(SAMPLES.css, 'css');
      expect(map.get('#1d7ae0')).toBe('constant');
      expect(map.get('--primary')).toBe('variable');
      expect(map.get('font-size')).toBe('property');
      expect(map.get('.btn')).toBe('type');
    });

    it('classifies html tags and attributes', () => {
      const map = kinds(SAMPLES.html, 'html');
      expect(map.get('a')).toBe('tag');
      expect(map.get('href')).toBe('attribute');
      expect(map.get('"\/docs"')).toBe('string');
    });

    it('classifies python tokens', () => {
      const map = kinds(SAMPLES.python, 'python');
      expect(map.get('def')).toBe('keyword');
      expect(map.get('return')).toBe('keyword');
      expect(map.get('greet')).toBe('function');
      expect(map.get('str')).toBe('type');
      const withPrint = kinds('print(len(items))', 'python');
      expect(withPrint.get('print')).toBe('function');
      expect(withPrint.get('len')).toBe('function');
    });

    it('treats block comments as a single comment token', () => {
      const tokens = tokenize(languages, '/* one\ntwo */ x', 'ts');
      expect(tokens[0].t).toBe('comment');
      expect(tokens[0].v).toBe('/* one\ntwo */');
    });

    it('keeps an unterminated block comment to end of input', () => {
      const tokens = tokenize(languages, 'x /* open', 'ts');
      const last = tokens[tokens.length - 1];
      expect(last.t).toBe('comment');
      expect(last.v).toBe('/* open');
    });

    it('does not run a line comment past its newline', () => {
      const tokens = tokenize(languages, '// a\nb', 'ts');
      const comment = tokens.find((t) => t.t === 'comment');
      expect(comment.v).toBe('// a');
    });
  });

  describe('language resolution', () => {
    it('resolves aliases and extensions', () => {
      expect(resolveLanguage(languages, 'tsx')).toBe('ts');
      expect(resolveLanguage(languages, 'jsx')).toBe('ts');
      expect(resolveLanguage(languages, '.TSX')).toBe('ts');
      expect(resolveLanguage(languages, 'yml')).toBe('yaml');
      expect(resolveLanguage(languages, 'shell')).toBe('bash');
      expect(resolveLanguage(languages, 'nope')).toBeNull();
      expect(resolveLanguage(languages, null)).toBeNull();
    });

    it('labels languages for the header chip', () => {
      expect(languageLabel(languages, 'tsx')).toBe('TSX');
      expect(languageLabel(languages, 'qml')).toBe('QML');
      expect(languageLabel(languages, 'bash')).toBe('BASH');
      expect(languageLabel(languages, 'wat')).toBe('WAT');
      expect(languageLabel(languages, undefined)).toBe('TEXT');
    });

    it('reports highlightability', () => {
      expect(isHighlightable(languages, 'tsx')).toBe(true);
      expect(isHighlightable(languages, 'text')).toBe(false);
      expect(isHighlightable(languages, 'unknown-lang')).toBe(false);
    });

    it('degrades to a single plain token for unknown languages', () => {
      const source = 'some :: unknown -- syntax';
      const tokens = tokenize(languages, source, 'unknown-lang');
      expect(tokens).toEqual([{ t: 'plain', v: source }]);
    });

    it('returns an empty stream for empty input', () => {
      expect(tokenize(languages, '', 'ts')).toEqual([]);
      expect(tokenize(languages, null, 'ts')).toEqual([]);
    });

    it('merges adjacent tokens of the same type', () => {
      const tokens = tokenize(languages, 'const a = 1', 'ts');
      for (let i = 1; i < tokens.length; i++) {
        expect(tokens[i].t).not.toBe(tokens[i - 1].t);
      }
    });
  });

  describe('rich text generation (Qt target)', () => {
    it('wraps tokens in coloured spans and escapes markup', () => {
      const rich = buildRichText(tokenize(languages, 'const x = "<b>";', 'ts'), (t) =>
        t === 'keyword' ? '#c586c0' : t === 'string' ? '#ce9178' : null,
      );
      expect(rich).toContain('<span style="color:#c586c0">const</span>');
      expect(rich).toContain('&lt;b&gt;');
      expect(rich).not.toContain('<b>');
    });

    it('preserves indentation with non-breaking spaces', () => {
      const rich = buildRichText(tokenize(languages, '  x', 'ts'), () => null);
      expect(rich.startsWith('&nbsp;&nbsp;')).toBe(true);
    });

    it('emits <br/> for newlines', () => {
      const rich = buildRichText(tokenize(languages, 'a\nb', 'ts'), () => null);
      expect(rich).toBe('a<br/>b');
    });
  });

  describe('cross-stack engine parity', () => {
    it('has both generated artifacts on disk', () => {
      expect(existsSync(reactArtifact), `missing ${reactArtifact} — run pnpm gen:highlight`).toBe(true);
      expect(existsSync(qmlArtifact), `missing ${qmlArtifact} — run pnpm gen:highlight`).toBe(true);
    });

    it('embeds a byte-identical engine body in React and Qt', () => {
      const react = readFileSync(reactArtifact, 'utf8');
      const qml = readFileSync(qmlArtifact, 'utf8');

      const reactEngineMarker = 'const engine = (function () {\n';
      const reactStart = react.indexOf(reactEngineMarker);
      expect(reactStart, 'React artifact: engine IIFE marker not found').toBeGreaterThan(-1);
      const reactFrom = reactStart + reactEngineMarker.length;
      // The façade return is uniquely identified by its first key; the engine
      // body itself also contains `return {` (hlBuildSets), so a bare marker
      // would truncate the comparison and hide real divergence.
      const reactTo = react.indexOf('\n  return {\n    resolveLanguage: hlResolveLanguage,', reactFrom);
      expect(reactTo).toBeGreaterThan(reactFrom);
      const reactEngine = react.slice(reactFrom, reactTo);

      const qmlLang = qml.indexOf('var LANGUAGES = ');
      expect(qmlLang, 'Qt artifact: LANGUAGES declaration not found').toBeGreaterThan(-1);
      const qmlFrom = qml.indexOf('\n\n', qmlLang) + 2;
      const qmlTo = qml.indexOf('\n        return {\n            languages: LANGUAGES,', qmlFrom);
      expect(qmlTo).toBeGreaterThan(qmlFrom);
      const qmlEngine = qml.slice(qmlFrom, qmlTo);

      expect(qmlEngine).toBe(reactEngine);
      expect(reactEngine).toContain('function hlTokenize(languages, source, language)');
      expect(reactEngine).not.toMatch(/^export /m);
    });

    it('embeds the full language table in both artifacts', () => {
      const react = readFileSync(reactArtifact, 'utf8');
      const qml = readFileSync(qmlArtifact, 'utf8');
      for (const id of Object.keys(languages.languages)) {
        expect(react, `React artifact missing language "${id}"`).toContain(`"${id}": {`);
        expect(qml, `Qt artifact missing language "${id}"`).toContain(`"${id}": {`);
      }
      expect(react).toContain('export function tokenize(code: string');
      expect(qml).toContain('function tokenize(code, language)');
    });
  });
});
