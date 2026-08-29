import { spawn } from 'node:child_process';
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const userData = mkdtempSync(join(tmpdir(), 'edge-unique-'));
const url = process.argv[2] || 'http://127.0.0.1:5277';
const outFile = process.argv[3] || 'react-shot.png';
const port = 9455;

const proc = spawn(edgePath, [
  '--headless=new',
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${userData}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--window-size=1100,1200',
  url,
]);

await new Promise((r) => setTimeout(r, 1800));

try {
  const res = await fetch(`http://127.0.0.1:${port}/json`);
  const tabs = await res.json();
  const tab = tabs.find((t) => t.type === 'page' && t.url.includes('5277')) || tabs.find((t) => t.type === 'page');
  if (!tab) throw new Error('No page tab found');

  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener('open', resolve));

  const shotPromise = new Promise((resolve) => {
    ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === 2 && msg.result?.data) {
        resolve(Buffer.from(msg.result.data, 'base64'));
      }
    });
  });

  ws.send(JSON.stringify({ id: 1, method: 'Emulation.setDeviceMetricsOverride', params: { width: 1100, height: 1200, deviceScaleFactor: 1, mobile: false } }));
  await new Promise((r) => setTimeout(r, 600));
  ws.send(JSON.stringify({ id: 2, method: 'Page.captureScreenshot', params: { format: 'png' } }));

  const buf = await shotPromise;
  writeFileSync(outFile, buf);
  console.log(`[capture-web] Saved unique screenshot to ${outFile}`);
  ws.close();
} catch (e) {
  console.error('[capture-web] Error:', e);
} finally {
  proc.kill();
}
