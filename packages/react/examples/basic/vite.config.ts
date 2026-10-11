import path from 'node:path';
import { execFile } from 'node:child_process';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Watches single-source-of-truth inputs under spec/ and re-runs the
// generators on change, so `pnpm showcase` always serves fresh artifacts
// (tokens.css, locales.generated.ts, showcaseData.generated.ts, icons)
// without a manual `pnpm gen:all`. Component source is already live via
// the @chahu/cha-set alias below; this plugin closes the remaining gap
// for spec-derived files. Dev-only (apply: 'serve').
function chaSpecWatch(): Plugin {
  const repoRoot = path.resolve(import.meta.dirname, '../../../..');
  const specRoot = path.resolve(repoRoot, 'spec');
  const genAll = path.resolve(specRoot, 'generators/generate-all.mjs');
  const watchDirs = ['tokens', 'i18n', 'icons', 'showcase', 'components'].map((d) =>
    path.resolve(specRoot, d)
  );
  // spec/ root-level inputs (capabilities, qt-mapping, top-level scripts).
  // spec/tokens.json is EXCLUDED: it is rewritten by the generators
  // themselves and watching it would self-trigger an infinite regen loop.
  const watchFiles = ['capabilities.json', 'qt-mapping.json', 'build-tokens.mjs'].map((f) =>
    path.resolve(specRoot, f)
  );
  let timer: ReturnType<typeof setTimeout> | null = null;
  let running = false;
  let queued = false;

  const run = (server: { ws: { send: (p: unknown) => void } }) => {
    if (running) {
      queued = true;
      return;
    }
    running = true;
    execFile(process.execPath, [genAll], { cwd: repoRoot }, (err) => {
      running = false;
      if (err) {
        console.error(`[cha-spec-watch] generate-all failed: ${err.message}`);
      } else {
        server.ws.send({ type: 'full-reload' });
      }
      if (queued) {
        queued = false;
        run(server);
      }
    });
  };

  return {
    name: 'cha-spec-watch',
    apply: 'serve',
    configureServer(server) {
      for (const dir of watchDirs) {
        server.watcher.add(dir);
      }
      for (const file of watchFiles) {
        server.watcher.add(file);
      }
      console.log('[cha-spec-watch] watching spec/{tokens,i18n,icons,showcase,components} + root inputs (tokens.json excluded)');
      const schedule = (file: string) => {
        if (!file.startsWith(specRoot)) return;
        // Never react to our own output: spec/tokens.json is rewritten by
        // build-tokens.mjs on every regen.
        if (file === path.resolve(specRoot, 'tokens.json')) return;
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => run(server), 300);
      };
      server.watcher.on('change', schedule);
      server.watcher.on('add', schedule);
      server.watcher.on('unlink', schedule);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), chaSpecWatch()],
  resolve: {
    alias: [
      {
        find: /^@chahu\/cha-set$/,
        replacement: path.resolve(import.meta.dirname, '../../src/index.ts'),
      },
      {
        // Keep dev off the built artifact: a fresh clone has no dist/, and the
        // built CSS would also lag behind source edits. Matches the subpath
        // export declared in packages/react/package.json.
        find: '@chahu/cha-set/styles.css',
        replacement: path.resolve(import.meta.dirname, '../../src/styles/index.css'),
      },
    ],
  },
  server: {
    port: 5173,
  },
});