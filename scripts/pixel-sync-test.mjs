import { spawn, spawnSync, execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const rootDir = resolve(process.cwd());
const outDir = join(rootDir, '.pixel-diff');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const qtExe = join(rootDir, 'qt', 'build', 'QtChaSetDemo.exe');
const qtBin = 'D:\\pengj\\qt\\6.10.1\\msvc2022_64\\bin';
const port = 5299;
const cdpPort = 9457;

// Parse CLI flags
const args = process.argv.slice(2);
const componentArg = args.find((a) => a.startsWith('--component='))?.split('=')[1] ?? (args.includes('--component') ? args[args.indexOf('--component') + 1] : 'button');
const variantFilter = args.find((a) => a.startsWith('--variant='))?.split('=')[1] ?? (args.includes('--variant') ? args[args.indexOf('--variant') + 1] : null);
const stateFilter = args.find((a) => a.startsWith('--state='))?.split('=')[1] ?? (args.includes('--state') ? args[args.indexOf('--state') + 1] : null);

console.log('🔬 ChaSet Scientific Pixel-Sync & Conformance Engine');
console.log(`   Component: ${componentArg} | Filter: variant=${variantFilter || 'all'}, state=${stateFilter || 'all'}\n`);

// Definitive Button test matrix covering variants, sizes, and interactive behavior states
const buttonMatrix = [
  // 1. Variants (Idle state with zero-variance Unicode Middle Dot benchmark)
  { id: 'btn-default-idle', variant: 'default', size: 'default', state: 'idle', label: '·', width: 220, height: 80, maxDiff: 0.2 },
  { id: 'btn-destructive-idle', variant: 'destructive', size: 'default', state: 'idle', label: '·', width: 220, height: 80, maxDiff: 0.2 },
  { id: 'btn-outline-idle', variant: 'outline', size: 'default', state: 'idle', label: '·', width: 220, height: 80, maxDiff: 0.2 },
  { id: 'btn-secondary-idle', variant: 'secondary', size: 'default', state: 'idle', label: '·', width: 220, height: 80, maxDiff: 0.2 },
  { id: 'btn-ghost-idle', variant: 'ghost', size: 'default', state: 'idle', label: '·', width: 220, height: 80, maxDiff: 0.2 },
  { id: 'btn-link-idle', variant: 'link', size: 'default', state: 'idle', label: '·', width: 220, height: 80, maxDiff: 0.2 },

  // 2. Behavioral States (Hover & Active/Pressed for Default, Outline, Secondary, Ghost)
  { id: 'btn-default-hover', variant: 'default', size: 'default', state: 'hover', label: '·', width: 220, height: 80, maxDiff: 0.2 },
  { id: 'btn-default-active', variant: 'default', size: 'default', state: 'active', label: '·', width: 220, height: 80, maxDiff: 0.2 },
  { id: 'btn-outline-hover', variant: 'outline', size: 'default', state: 'hover', label: '·', width: 220, height: 80, maxDiff: 0.2 },
  { id: 'btn-outline-active', variant: 'outline', size: 'default', state: 'active', label: '·', width: 220, height: 80, maxDiff: 0.2 },
  { id: 'btn-secondary-hover', variant: 'secondary', size: 'default', state: 'hover', label: '·', width: 220, height: 80, maxDiff: 0.2 },
  { id: 'btn-ghost-hover', variant: 'ghost', size: 'default', state: 'hover', label: '·', width: 220, height: 80, maxDiff: 0.2 },

  // 3. Sizes
  { id: 'btn-size-sm', variant: 'default', size: 'sm', state: 'idle', label: '·', width: 220, height: 80, maxDiff: 0.7 },
  { id: 'btn-size-lg', variant: 'default', size: 'lg', state: 'idle', label: '·', width: 220, height: 80, maxDiff: 0.4 },
  { id: 'btn-size-icon', variant: 'outline', size: 'icon', state: 'idle', label: '·', width: 220, height: 80, maxDiff: 0.2 },

  // 4. Invariant States (Disabled)
  { id: 'btn-disabled', component: 'button', variant: 'default', size: 'default', state: 'idle', label: '·', disabled: true, width: 220, height: 80, probeX: 104, probeY: 30, maxDiff: 0.2 },
];

// Mark component on buttonMatrix
for (const b of buttonMatrix) {
  if (!b.component) b.component = 'button';
  if (!b.probeX) b.probeX = 104;
  if (!b.probeY) b.probeY = 30;
}

// Definitive ScrollArea test matrix covering vertical & horizontal orientations, idle/hover/active, steppers, and themes
const scrollAreaMatrix = [
  // 1. Vertical with Steppers (Idle, Hover, Active)
  { id: 'scroll-vert-stepper-idle', component: 'scroll-area', orientation: 'vertical', state: 'idle', showButtons: true, theme: 'light', width: 120, height: 200, probeX: 106, probeY: 65, maxDiff: 0.8 },
  { id: 'scroll-vert-stepper-hover', component: 'scroll-area', orientation: 'vertical', state: 'hover', showButtons: true, theme: 'light', width: 120, height: 200, probeX: 106, probeY: 65, maxDiff: 0.8 },
  { id: 'scroll-vert-stepper-active', component: 'scroll-area', orientation: 'vertical', state: 'active', showButtons: true, theme: 'light', width: 120, height: 200, probeX: 106, probeY: 65, maxDiff: 0.8 },

  // 2. Vertical Minimalist (No Steppers)
  { id: 'scroll-vert-idle', component: 'scroll-area', orientation: 'vertical', state: 'idle', showButtons: false, theme: 'light', width: 120, height: 200, probeX: 106, probeY: 55, maxDiff: 0.8 },
  { id: 'scroll-vert-hover', component: 'scroll-area', orientation: 'vertical', state: 'hover', showButtons: false, theme: 'light', width: 120, height: 200, probeX: 106, probeY: 55, maxDiff: 0.8 },
  { id: 'scroll-vert-active', component: 'scroll-area', orientation: 'vertical', state: 'active', showButtons: false, theme: 'light', width: 120, height: 200, probeX: 106, probeY: 55, maxDiff: 0.8 },

  // 3. Horizontal (Minimalist & with Steppers)
  { id: 'scroll-horiz-idle', component: 'scroll-area', orientation: 'horizontal', state: 'idle', showButtons: false, theme: 'light', width: 200, height: 80, probeX: 55, probeY: 66, maxDiff: 0.8 },
  { id: 'scroll-horiz-hover', component: 'scroll-area', orientation: 'horizontal', state: 'hover', showButtons: false, theme: 'light', width: 200, height: 80, probeX: 55, probeY: 66, maxDiff: 0.8 },
  { id: 'scroll-horiz-active', component: 'scroll-area', orientation: 'horizontal', state: 'active', showButtons: false, theme: 'light', width: 200, height: 80, probeX: 55, probeY: 66, maxDiff: 0.8 },
  { id: 'scroll-horiz-stepper-hover', component: 'scroll-area', orientation: 'horizontal', state: 'hover', showButtons: true, theme: 'light', width: 200, height: 80, probeX: 65, probeY: 66, maxDiff: 0.8 },

  // 4. Dark Theme
  { id: 'scroll-dark-vert-idle', component: 'scroll-area', orientation: 'vertical', state: 'idle', showButtons: true, theme: 'dark', width: 120, height: 200, probeX: 106, probeY: 65, maxDiff: 0.8 },
  { id: 'scroll-dark-vert-hover', component: 'scroll-area', orientation: 'vertical', state: 'hover', showButtons: true, theme: 'dark', width: 120, height: 200, probeX: 106, probeY: 65, maxDiff: 0.8 },
  { id: 'scroll-dark-vert-active', component: 'scroll-area', orientation: 'vertical', state: 'active', showButtons: true, theme: 'dark', width: 120, height: 200, probeX: 106, probeY: 65, maxDiff: 0.8 },
];

let testCases = [];
if (componentArg === 'button') {
  testCases = buttonMatrix;
  if (variantFilter) testCases = testCases.filter((tc) => tc.variant === variantFilter);
  if (stateFilter) testCases = testCases.filter((tc) => tc.state === stateFilter);
} else if (componentArg === 'scroll-area' || componentArg === 'scrollbar') {
  testCases = scrollAreaMatrix;
  if (stateFilter) testCases = testCases.filter((tc) => tc.state === stateFilter);
} else if (componentArg === 'all') {
  testCases = [...buttonMatrix, ...scrollAreaMatrix];
} else {
  console.log(`[pixel-sync] Component "${componentArg}" is not enabled for selective pixel sync. Skipping.`);
  process.exit(0);
}

// 1. Build React and Qt targets
console.log('[1/4] Ensuring build artifacts for React & Qt...');
execSync('pnpm --filter @chahu/cha-set build', { stdio: 'pipe', cwd: rootDir });
execSync('pnpm --filter @chaset/example-react-button build', { stdio: 'pipe', cwd: rootDir });
execSync('cmake --build qt/build', { stdio: 'pipe', cwd: rootDir });

// 2. Start Vite Preview server
console.log('[2/4] Starting React server on port ' + port + '...');
const serverProc = spawn('npx', ['vite', 'preview', '--port', String(port), '--host', '127.0.0.1'], {
  cwd: join(rootDir, 'packages', 'react', 'examples', 'basic'),
  shell: true,
  stdio: 'ignore',
});

await new Promise((r) => setTimeout(r, 1200));

// 3. Launch Edge Headless CDP
console.log('[3/4] Launching headless browser for React captures...');
const userData = mkdtempSync(join(tmpdir(), 'edge-pixel-sync-'));
const edgeProc = spawn(edgePath, [
  '--headless=new',
  `--remote-debugging-port=${cdpPort}`,
  `--user-data-dir=${userData}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu-rasterization',
  '--disable-font-subpixel-positioning',
  `http://127.0.0.1:${port}/`,
]);

await new Promise((r) => setTimeout(r, 1500));

const results = [];

try {
  const res = await fetch(`http://127.0.0.1:${cdpPort}/json`);
  const tabs = await res.json();
  const tab = tabs.find((t) => t.type === 'page');
  if (!tab) throw new Error('Could not find Edge page tab');

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));

  let msgId = 1000;
  function sendCdp(method, params = {}) {
    const id = ++msgId;
    return new Promise((resolve) => {
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  console.log('[4/4] Executing paired pixel-diff capture and state conformance...\n');

  for (const tc of testCases) {
    const reactPngPath = join(outDir, `${tc.id}-react.png`);
    const qtPngPath = join(outDir, `${tc.id}-qt.png`);
    const diffPngPath = join(outDir, `${tc.id}-diff.png`);

    // A. Capture React
    const query = tc.component === 'scroll-area'
      ? new URLSearchParams({
          harness: 'scroll-area',
          orientation: tc.orientation,
          state: tc.state,
          showButtons: tc.showButtons ? 'true' : 'false',
          theme: tc.theme,
          width: String(tc.width),
          height: String(tc.height),
        }).toString()
      : new URLSearchParams({
          harness: 'button',
          variant: tc.variant,
          size: tc.size,
          label: tc.label,
          state: tc.state,
          disabled: tc.disabled ? 'true' : 'false',
          loading: tc.loading ? 'true' : 'false',
        }).toString();
    const targetUrl = `http://127.0.0.1:${port}/?${query}`;

    await sendCdp('Page.navigate', { url: targetUrl });
    await new Promise((r) => setTimeout(r, 200));
    await sendCdp('Emulation.setDeviceMetricsOverride', {
      width: tc.width,
      height: tc.height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await new Promise((r) => setTimeout(r, 150));

    const shotRes = await sendCdp('Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: tc.width, height: tc.height, scale: 1 },
    });
    const reactBuf = Buffer.from(shotRes.data, 'base64');
    writeFileSync(reactPngPath, reactBuf);

    // B. Capture Qt
    const qtArgs = tc.component === 'scroll-area'
      ? [
          '--harness', 'scroll-area',
          '--orientation', tc.orientation,
          '--state', tc.state,
          '--width', String(tc.width),
          '--height', String(tc.height),
          '--shot', qtPngPath,
          ...(tc.showButtons ? [] : ['--no-buttons']),
          ...(tc.theme === 'dark' ? ['--dark'] : ['--light']),
        ]
      : [
          '--harness', 'button',
          '--variant', tc.variant,
          '--size', tc.size,
          '--label', tc.label,
          '--state', tc.state,
          '--width', String(tc.width),
          '--height', String(tc.height),
          '--shot', qtPngPath,
          ...(tc.disabled ? ['--disabled'] : []),
          ...(tc.loading ? ['--loading'] : []),
        ];

    const qtEnv = {
      ...process.env,
      PATH: `${qtBin};${process.env.PATH || ''}`,
      QT_ENABLE_HIGHDPI_SCALING: '0',
      QT_SCALE_FACTOR: '1',
    };
    spawnSync(qtExe, qtArgs, { env: qtEnv, stdio: 'ignore' });

    await new Promise((r) => setTimeout(r, 150));

    if (!existsSync(qtPngPath)) {
      throw new Error(`Qt failed to produce snapshot at ${qtPngPath}`);
    }

    // C. Pixelmatch Diff & Color Probe
    const imgReact = PNG.sync.read(readFileSync(reactPngPath));
    const imgQt = PNG.sync.read(readFileSync(qtPngPath));

    const width = Math.min(imgReact.width, imgQt.width);
    const height = Math.min(imgReact.height, imgQt.height);
    const diffImg = new PNG({ width, height });

    const mismatchedPixels = pixelmatch(
      imgReact.data,
      imgQt.data,
      diffImg.data,
      width,
      height,
      { threshold: 0.15, includeAA: false }
    );

    writeFileSync(diffPngPath, PNG.sync.write(diffImg));

    // Sample component surface background color for behavioral color parity
    const probeX = tc.probeX ?? 104;
    const probeY = tc.probeY ?? 30;

    const probeIdx = (width * probeY + probeX) << 2;
    const rR = imgReact.data[probeIdx];
    const rG = imgReact.data[probeIdx + 1];
    const rB = imgReact.data[probeIdx + 2];
    const qR = imgQt.data[probeIdx];
    const qG = imgQt.data[probeIdx + 1];
    const qB = imgQt.data[probeIdx + 2];

    const colorDelta = Math.sqrt((rR - qR) ** 2 + (rG - qG) ** 2 + (rB - qB) ** 2);
    const colorMatch = colorDelta <= 4.0; // Bit-exact or minimal subpixel tolerance

    const totalPixels = width * height;
    const diffPercent = (mismatchedPixels / totalPixels) * 100;
    const passed = diffPercent <= tc.maxDiff && colorMatch;

    results.push({
      id: tc.id,
      component: tc.component,
      variant: tc.variant ?? tc.orientation,
      state: tc.state,
      size: tc.size ?? (tc.showButtons ? 'steppers' : 'minimal'),
      width,
      height,
      colorReact: `rgb(${rR},${rG},${rB})`,
      colorQt: `rgb(${qR},${qG},${qB})`,
      colorDelta: colorDelta.toFixed(1),
      mismatchedPixels,
      totalPixels,
      diffPercent: diffPercent.toFixed(2),
      maxAllowed: tc.maxDiff.toFixed(2),
      status: passed ? 'PASS' : 'FAIL',
    });
  }

  ws.close();
} finally {
  edgeProc.kill();
  serverProc.kill();
}

// Print Results Table
console.log('┌──────────────────────┬─────────────┬───────────┬────────────────────┬────────────────────┬───────────┬────────┐');
console.log('│ Target Scenario      │ Variant/St  │ Res (px)  │ React Center Color │ Qt Center Color    │ Diff Rate │ Status │');
console.log('├──────────────────────┼─────────────┼───────────┼────────────────────┼────────────────────┼───────────┼────────┤');

let allPassed = true;
for (const r of results) {
  const padName = r.id.padEnd(20);
  const padVar = `${r.variant}:${r.state}`.padEnd(11);
  const padRes = `${r.width}x${r.height}`.padEnd(9);
  const padRColor = r.colorReact.padEnd(18);
  const padQColor = r.colorQt.padEnd(18);
  const padRate = `${r.diffPercent}% (≤${r.maxAllowed}%)`.padEnd(9);
  const padStatus = r.status === 'PASS' ? ' \x1b[32mPASS\x1b[0m ' : ' \x1b[31mFAIL\x1b[0m ';
  if (r.status !== 'PASS') allPassed = false;
  console.log(`│ ${padName} │ ${padVar} │ ${padRes} │ ${padRColor} │ ${padQColor} │ ${padRate} │ ${padStatus} │`);
}
console.log('└──────────────────────┴─────────────┴───────────┴────────────────────┴────────────────────┴───────────┴────────┘\n');

// Generate HTML Summary Report
const htmlReport = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>ChaSet Pixel-Sync Visual Conformance Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 2rem; margin: 0; }
    h1 { margin-bottom: 0.5rem; }
    .subtitle { color: #94a3b8; font-size: 0.9rem; margin-bottom: 2rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(480px, 1fr)); gap: 1.5rem; }
    .card { background: #1e293b; border-radius: 8px; border: 1px solid #334155; padding: 1rem; overflow: hidden; }
    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .card-title { font-weight: 600; font-size: 0.95rem; }
    .badge-pass { background: #10b98120; color: #34d399; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 0.75rem; }
    .badge-fail { background: #ef444420; color: #f87171; padding: 2px 8px; border-radius: 4px; font-weight: 600; font-size: 0.75rem; }
    .images { display: flex; gap: 0.5rem; background: #020817; padding: 0.5rem; border-radius: 6px; }
    .image-col { flex: 1; text-align: center; font-size: 0.75rem; color: #94a3b8; }
    .image-col img { width: 100%; border: 1px solid #334155; border-radius: 4px; margin-top: 4px; }
    .metrics { margin-top: 0.75rem; font-size: 0.75rem; color: #94a3b8; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <h1>🍵 ChaSet Pixel-Sync Visual Conformance Report</h1>
  <div class="subtitle">Component: ${componentArg} | Total Scenarios: ${results.length} | Generated: ${new Date().toISOString()}</div>
  <div class="grid">
    ${results.map((r) => `
      <div class="card">
        <div class="card-header">
          <span class="card-title">${r.id} (${r.variant} / ${r.state})</span>
          <span class="${r.status === 'PASS' ? 'badge-pass' : 'badge-fail'}">${r.status} (${r.diffPercent}%)</span>
        </div>
        <div class="images">
          <div class="image-col">React Web<img src="${r.id}-react.png" /></div>
          <div class="image-col">Qt Quick<img src="${r.id}-qt.png" /></div>
          <div class="image-col">Diff Heatmap<img src="${r.id}-diff.png" /></div>
        </div>
        <div class="metrics">
          <span>React Color: <code>${r.colorReact}</code></span>
          <span>Qt Color: <code>${r.colorQt}</code> (Δ ${r.colorDelta})</span>
          <span>Mismatched: ${r.mismatchedPixels} / ${r.totalPixels} px</span>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

writeFileSync(join(outDir, 'report.html'), htmlReport, 'utf8');
console.log(`📊 Visual report written to: file:///${join(outDir, 'report.html').replace(/\\/g, '/')}\n`);

if (allPassed) {
  console.log('✅ ALL PIXEL-LEVEL CONFORMANCE CHECKS PASSED!');
  process.exit(0);
} else {
  console.error('❌ PIXEL REGRESSION DETECTED — Some component scenarios exceeded tolerance.');
  process.exit(1);
}
