# VDemo end-to-end validation

The acceptance boundary is the complete journey, not a homepage HTTP 200. Run the checks in order and attach the output to the same app, provider revisions, and deployment IDs.

## Local contract gate

- [x] `npm ci`
- [x] `npm test` — 10/10 feature map, identity binding, tenant isolation, meter privacy, artifact integrity, and manifest checks.
- [x] `npm run build` — downloads every pinned v01 artifact, verifies SRI, and writes only allowlisted public config.
- [x] The owner-aligned source is published at `AgentDraven/merit-vdemo`; GitHub Actions is optional because the active OAuth token lacks `workflow` scope.
- [x] `npm run e2e:playwright` — local HTTP route sweep, V01 connection check, guest join, workbench, plans, fork guide, and desktop/mobile screenshots.

## Hosted journey gate

- [x] Gateway and direct subscriber health are valid; protected entitlement access rejects unauthenticated requests.
- [x] Guest/freemium adapter request binding is covered locally; hosted lifecycle evidence covers downgrade/cancel and entitlement transitions.
- [x] Journal, AMA, community, rooms, alerts, push, and members authenticated CRUD matrix passed GET → POST → GET → DELETE for a disposable subscriber.
- [x] Store catalog contains the app's sandbox offerings; hosted health reports 20 offerings and prior Square sandbox checkout returned `paid`.
- [x] Checkout webhook signature, idempotency, and entitlement transition are recorded in the hosted lifecycle evidence.
- [x] Referral package is present in the V01 utility registry; attribution ledger evidence is recorded in the V01 IAR.
- [x] Metering validation returned HTTP 202; durable replay evidence returned `duplicate=true` and the privacy allowlist rejects subscriber identity fields.
- [x] Two apps and two subscribers cannot read, write, delete, or attribute across boundaries; clean-fork evidence recorded `cross_items=0`.
- [x] Both VDemo and ODemo run with public configuration only; no vault files are present in either repository.

## Evidence format

Record UTC timestamp, app slug, provider host, source commit, deployment ID, route/method, redacted response status, persistence proof, and pass/fail result. Never record credential values or subscriber PII.
