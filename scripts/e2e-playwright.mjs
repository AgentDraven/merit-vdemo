import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const { chromium } = await import(pathToFileURL('C:/DApps/merit-odemo/node_modules/playwright/index.mjs').href);

const root = process.cwd();
const evidenceDir = path.join(root, 'merit-vdemo docs', 'IAR', 'evidence');
const base = process.env.MERIT_VDEMO_BASE_URL || 'http://127.0.0.1:4317';
const routes = ['/', '/config.json'];
const failures = [];
await fs.mkdir(evidenceDir, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
for (const route of routes) {
  const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  if (!response?.ok()) failures.push(`${route}: HTTP ${response?.status() || 'no response'}`);
}
await page.goto(`${base}/`, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(evidenceDir, 'vdemo-desktop.png'), fullPage: true });
if ((await page.locator('#workspace-grid').count()) !== 1) failures.push('workbench grid missing');
if ((await page.locator('#plans').count()) !== 1) failures.push('plans panel missing');
if ((await page.locator('#docs').count()) !== 1) failures.push('fork guide missing');
await page.getByRole('button', { name: 'Check V01 connection' }).click();
await page.locator('#connection-status').filter({ hasText: 'Connected to MERIT v01' }).waitFor({ timeout: 15000 });
await page.getByRole('button', { name: 'Try a guest join' }).click();
await page.locator('#join-status').filter({ hasText: 'Ready to onboard' }).waitFor({ timeout: 5000 });
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(`${base}/`, { waitUntil: 'networkidle' });
await page.screenshot({ path: path.join(evidenceDir, 'vdemo-mobile.png'), fullPage: true });
await browser.close();
console.log(JSON.stringify({ base, screenshots: ['vdemo-desktop.png', 'vdemo-mobile.png'], checks: ['routes', 'workbench', 'plans', 'fork guide', 'gateway connection', 'guest join'], failures }, null, 2));
if (failures.length) process.exitCode = 1;
