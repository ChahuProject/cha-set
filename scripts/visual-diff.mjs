import { spawn, spawnSync, execSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const rootDir = resolve(process.cwd());
const outDir = join(rootDir, '.visual-diff');
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const qtExe = join(rootDir, 'qt', 'build', 'QtChaSetDemo.exe');
const qtBin = 'D:\\pengj\\qt\\6.10.1\\msvc2022_64\\bin';
const port = 5298;
const cdpPort = 9456;

// Matrix of cross-stack visual test targets
const testCases = [
  {
    name: 'button-primary-sm',
    harness: 'button',
    variant: 'primary',
    size: 'sm',
    label: 'Action',
    width: 220,
    height: 80,
    maxDiffPercent: 3.5,
  },
  {
    name: 'button-primary-md',
    harness: 'button',
    variant: 'primary',
    size: 'md',
    label: 'Create Project',
    width: 220,
    height: 80,
    maxDiffPercent: 3.5,
  },
  {
    name: 'button-primary-lg',
    harness: 'button',
    variant: 'primary',
    size: 'lg',
    label: 'Launch App',
    width: 220,
    height: 80,
    maxDiffPercent: 3.5,
  },
  {
    name: 'button-secondary-md',
    harness: 'button',
    variant: 'secondary',
    size: 'md',
    label: 'Secondary',
    width: 220,
    height: 80,
    maxDiffPercent: 3.5,
  },
  {
    name: 'button-destructive-md',
    harness: 'button',
    variant: 'destructive',
    size: 'md',
    label: 'Delete Item',
    width: 220,
    height: 80,
    maxDiffPercent: 3.5,
  },
  {
    name: 'button-ghost-md',
    harness: 'button',
    variant: 'ghost',
    size: 'md',
    label: 'Ghost Action',
    width: 220,
    height: 80,
    maxDiffPercent: 3.5,
  },
  {
    name: 'button-disabled-md',
    harness: 'button',
    variant: 'primary',
    size: 'md',
    label: 'Disabled',
    disabled: true,
    width: 220,
    height: 80,
    maxDiffPercent: 3.5,
  },
  {
    name: 'studio-workbench-light',
    harness: '',
    variant: '',
    size: '',
    label: '',
    width: 1100,
    height: 1200,
    maxDiffPercent: 6.0,
  },
];

console.log('🍵 ChaSet Visual Conformance & Pixel-Diff Pipeline\n');

// 1. Build React and Qt targets
console.log('[1/4] Building React & Qt artifacts...');
execSync('pnpm --filter @chaset/example-react-button build', { stdio: 'inherit', cwd: rootDir });
execSync('node scripts/run-qt-showcase.mjs --build-only', { stdio: 'inherit', cwd: rootDir });

// 2. Start Vite Preview server
console.log('\n[2/4] Starting React preview server on port ' + port + '...');
const serverProc = spawn('npx', ['vite', 'preview', '--port', String(port), '--host', '127.0.0.1'], {
  cwd: join(rootDir, 'packages', 'react', 'examples', 'basic'),
  shell: true,
  stdio: 'ignore',
});

// Wait for server to become responsive
await new Promise((r) => setTimeout(r, 1500));

// 3. Launch Edge Headless CDP
console.log('[3/4] Launching headless browser for React captures...');
const userData = mkdtempSync(join(tmpdir(), 'edge-diff-'));
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

  let msgId = 100;
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

  console.log('\n[4/4] Executing paired snapshot captures & pixel diffing...\n');

  for (const tc of testCases) {
    const reactPngPath = join(outDir, `${tc.name}-react.png`);
    const qtPngPath = join(outDir, `${tc.name}-qt.png`);
    const diffPngPath = join(outDir, `${tc.name}-diff.png`);

    // A. Capture React
    let targetUrl = `http://127.0.0.1:${port}/`;
    if (tc.harness) {
      const query = new URLSearchParams({
        harness: tc.harness,
        variant: tc.variant,
        size: tc.size,
        label: tc.label,
        disabled: tc.disabled ? 'true' : 'false',
      }).toString();
      targetUrl += `?${query}`;
    }

    await sendCdp('Page.navigate', { url: targetUrl });
    await new Promise((r) => setTimeout(r, 350));
    await sendCdp('Emulation.setDeviceMetricsOverride', {
      width: tc.width,
      height: tc.height,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await new Promise((r) => setTimeout(r, 200));

    const shotRes = await sendCdp('Page.captureScreenshot', { format: 'png' });
    const reactBuf = Buffer.from(shotRes.data, 'base64');
    writeFileSync(reactPngPath, reactBuf);

    // B. Capture Qt
    const qtArgs = [];
    if (tc.harness) {
      qtArgs.push('--harness', tc.harness);
      qtArgs.push('--variant', tc.variant);
      qtArgs.push('--size', tc.size);
      qtArgs.push('--label', tc.label);
      if (tc.disabled) qtArgs.push('--disabled');
    }
    qtArgs.push('--width', String(tc.width));
    qtArgs.push('--height', String(tc.height));
    qtArgs.push('--shot', qtPngPath);

    const qtEnv = { ...process.env, PATH: `${qtBin};${process.env.PATH || ''}` };
    spawnSync(qtExe, qtArgs, { env: qtEnv, stdio: 'ignore' });

    // Wait for file write
    await new Promise((r) => setTimeout(r, 250));

    if (!existsSync(qtPngPath)) {
      throw new Error(`Qt failed to produce snapshot at ${qtPngPath}`);
    }

    // C. Pixelmatch Diff
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

    const totalPixels = width * height;
    const diffPercent = (mismatchedPixels / totalPixels) * 100;
    const passed = diffPercent <= tc.maxDiffPercent;

    results.push({
      target: tc.name,
      width,
      height,
      mismatchedPixels,
      totalPixels,
      diffPercent: diffPercent.toFixed(2),
      maxAllowed: tc.maxDiffPercent.toFixed(2),
      status: passed ? 'PASS' : 'FAIL',
    });
  }

  ws.close();
} finally {
  edgeProc.kill();
  serverProc.kill();
}

// Print Results Table
console.log('┌─────────────────────────────┬─────────────┬────────────────┬───────────┬────────┐');
console.log('│ Target Component Snapshot   │ Resolution  │ Mismatched Px  │ Diff Rate │ Status │');
console.log('├─────────────────────────────┼─────────────┼────────────────┼───────────┼────────┤');

let allPassed = true;
for (const r of results) {
  const padName = r.target.padEnd(27);
  const padRes = `${r.width}x${r.height}`.padEnd(11);
  const padMismatch = `${r.mismatchedPixels} / ${r.totalPixels} px`.padEnd(14);
  const padRate = `${r.diffPercent}% (≤${r.maxAllowed}%)`.padEnd(9);
  const padStatus = r.status === 'PASS' ? ' \x1b[32mPASS\x1b[0m ' : ' \x1b[31mFAIL\x1b[0m ';
  if (r.status !== 'PASS') allPassed = false;
  console.log(`│ ${padName} │ ${padRes} │ ${padMismatch} │ ${padRate} │ ${padStatus} │`);
}
console.log('└─────────────────────────────┴─────────────┴────────────────┴───────────┴────────┘\n');

if (allPassed) {
  console.log('✅ ALL VISUAL CONFORMANCE CHECKS PASSED — Cross-stack pixel-level parity verified!');
  process.exit(0);
} else {
  console.error('❌ VISUAL REGRESSION DETECTED — Some component snapshots exceeded the pixel difference threshold.');
  process.exit(1);
}
