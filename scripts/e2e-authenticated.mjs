import fs from 'node:fs/promises';
import path from 'node:path';

const base = 'https://merit-prodv01.vercel.app';
const gatewayKey = process.env.MERIT_V01_GATEWAY_KEY;
if (!gatewayKey) throw new Error('Set MERIT_V01_GATEWAY_KEY in the invoking shell; never commit it.');
const consumer = 'merit-vdemo';
const subscriber = `e2e-${Date.now()}`;
const collections = ['journal', 'questions', 'contributions', 'rooms', 'alerts', 'push', 'members'];
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'X-Merit-Consumer': consumer,
  'X-Merit-Gateway-Key': gatewayKey,
  'X-Subscriber-Id': subscriber,
};
const results = [];
async function call(method, collection, body, id) {
  const url = `${base}/api/tenant/${collection}${id ? `?id=${encodeURIComponent(id)}` : ''}`;
  const response = await fetch(url, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(20000) });
  const text = await response.text();
  let payload = {};
  try { payload = text ? JSON.parse(text) : {}; } catch { /* keep redacted */ }
  return { status: response.status, payload };
}
for (const collection of collections) {
  const getBefore = await call('GET', collection);
  const create = await call('POST', collection, { text: `E2E ${collection}`, e2e_id: subscriber });
  const itemId = create.payload?.item?.id;
  const getAfter = await call('GET', collection);
  const deleted = itemId ? await call('DELETE', collection, undefined, itemId) : { status: null, payload: {} };
  const passed = getBefore.status === 200 && create.status === 200 && Boolean(itemId) && getAfter.status === 200 && deleted.status === 200;
  results.push({ collection, before: getBefore.status, create: create.status, after: getAfter.status, delete: deleted.status, itemIdPresent: Boolean(itemId), passed });
  console.log(`${passed ? 'PASS' : 'FAIL'} ${collection}: GET ${getBefore.status} POST ${create.status} GET ${getAfter.status} DELETE ${deleted.status}`);
}
const evidence = { checkedAt: new Date().toISOString(), consumer, subscriber, results, failed: results.filter((r) => !r.passed).length };
const dir = path.join(process.cwd(), 'merit-vdemo docs', 'IAR', 'evidence');
await fs.mkdir(dir, { recursive: true });
await fs.writeFile(path.join(dir, 'authenticated-tenant-matrix.json'), `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify(evidence, null, 2));
if (evidence.failed) process.exitCode = 1;
