const base = 'https://merit-prodv01.vercel.app';
const checks = [
  ['gateway health', 'GET', `${base}/api/health`, [200]],
  ['v01 health', 'GET', `${base}/api/v1/health`, [200]],
  ['tenant journal auth boundary', 'GET', `${base}/api/tenant/journal`, [401]],
  ['tenant questions auth boundary', 'GET', `${base}/api/tenant/questions`, [401]],
  ['tenant contributions auth boundary', 'GET', `${base}/api/tenant/contributions`, [401]],
  ['tenant rooms auth boundary', 'GET', `${base}/api/tenant/rooms`, [401]],
  ['tenant alerts auth boundary', 'GET', `${base}/api/tenant/alerts`, [401]],
  ['room media route', 'GET', `${base}/api/room-media/book`, [200, 401, 405]],
  ['usage route', 'GET', `${base}/api/usage?consumer_id=merit-vdemo&format=json`, [200, 401]],
  ['subscriber health', 'GET', 'https://merit-subsv01.vercel.app/api/v1/health', [200]],
  ['subscriber entitlement auth boundary', 'GET', 'https://merit-subsv01.vercel.app/api/v1/entitlements', [401]],
  ['store health', 'GET', 'https://merit-storev01.vercel.app/api/v1/health', [200]],
  ['store tenant offerings', 'GET', 'https://merit-storev01.vercel.app/api/v1/tenants/merit-vdemo/offerings', [200, 404]],
  ['utility registry', 'GET', 'https://merit-utilsv01.vercel.app/registry.json', [200]],
  ['utility meter validation', 'POST', 'https://merit-utilsv01.vercel.app/api/events/ingest', [202]],
];

const results = [];
for (const [label, method, url, expected] of checks) {
  const init = { method, redirect: 'error', signal: AbortSignal.timeout(20000), headers: { Accept: 'application/json' } };
  if (method === 'POST') {
    init.headers['Content-Type'] = 'application/json';
    init.body = JSON.stringify({ schema: 'merit.telemetry.event.v1', event_type: 'e2e.probe', occurred_at: new Date().toISOString(), consumer_id: 'merit-vdemo', capability: 'e2e', quantity: 1 });
  }
  try {
    const response = await fetch(url, init);
    const ok = expected.includes(response.status);
    results.push({ label, method, url, status: response.status, expected, ok });
    console.log(`${ok ? 'PASS' : 'FAIL'} ${label}: ${response.status}`);
  } catch (error) {
    results.push({ label, method, url, status: null, expected, ok: false, error: error.name || error.message });
    console.log(`FAIL ${label}: ${error.name || error.message}`);
  }
}
const failed = results.filter((item) => !item.ok);
const evidence = { checkedAt: new Date().toISOString(), results, failed: failed.length };
const fs = await import('node:fs/promises');
const path = await import('node:path');
const evidenceDir = path.join(process.cwd(), 'merit-vdemo docs', 'IAR', 'evidence');
await fs.mkdir(evidenceDir, { recursive: true });
await fs.writeFile(path.join(evidenceDir, 'hosted-api-matrix.json'), `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify(evidence, null, 2));
if (failed.length) process.exitCode = 1;
