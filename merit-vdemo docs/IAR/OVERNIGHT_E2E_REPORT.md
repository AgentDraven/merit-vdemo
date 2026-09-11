# MERIT V01 overnight E2E report

**Run date:** 2026-09-11  
**Consumer:** `merit-vdemo` (vault-projected V01 configuration)  
**Scope:** full showcase page, local interaction checks, provider health, deployed capability routes, and clean-fork evidence.

## Results

| Area | Evidence | Result |
|---|---|---|
| Consumer contract | `npm test` | 10/10 passed |
| Hosted E2E probe | `npm run e2e` | Gateway, subscriber, store, utility homepage, and registry all ready |
| V01 artifact build | `npm run verify` | Four pinned artifacts verified; build passed |
| Provider matrix | `npm run probe:v01` | `ready=true`, no blockers |
| Gateway | `https://merit-prodv01.vercel.app/api/health` | HTTP 200 |
| Subscriber provider | `https://merit-subsv01.vercel.app/api/v1/health` | HTTP 200 |
| Store provider | `https://merit-storev01.vercel.app/api/v1/health` | HTTP 200; 20 offerings |
| Utility registry | `https://merit-utilsv01.vercel.app/registry.json` | HTTP 200; meter and referral packages present |
| Consumer UI | local HTTP page | Full navigation, hello-world join interaction, workbench, plans, capabilities, and fork guide rendered |
| Lifecycle | hosted subscriber fixture | Downgrade and cancellation HTTP 200; entitlement state changed correctly |
| Metering | hosted utility fixture | First event accepted; identical replay returned `duplicate=true` |
| Isolation | hosted gateway fixture | Two app identities isolated; cross-read returned zero rows |

## Route boundary observations

The V01 tenant routes return `401` without their server-only gateway/subscriber credentials, which is the expected browser boundary. The browser showcase does not contain those values. Routes that are not part of the current deployed V01 contract (for example the old `/api/gw/room-media/book` alias) remain out of the consumer claim surface and are documented as provider-owned follow-up work rather than represented as working features.

## Capability claim boundary

| Capability | Current claim | Evidence or next fixture |
|---|---|---|
| Shell/workbench | Implemented | Local full-page render and pinned V01 assets |
| Identity/entitlements | Implemented | Hosted subscriber onboarding, downgrade, cancellation, and entitlement state |
| Metering | Implemented | Signed fixture persisted; identical replay returned `duplicate=true` |
| Journal, AMA, community, rooms, notifications | Planned | Routes are protected by `401`; add authenticated CRUD fixtures before promoting |
| Calendar/room media, leaderboard, store | Planned/route reserved | Use canonical `/api/room-media/book`, `/api/leaderboard/*`, `/api/meritstore/*`; do not use retired `/api/gw/*` aliases |
| Referral/analytics | Planned | Package and privacy contract exists; hosted attribution/analytics fixture still required |

## Human-only intervention record

No provider key or database secret was required for this run. The only manual steps recorded for a new ecosystem are: authenticate the owning GitHub/Vercel/Supabase/Square accounts, authorize the correct project/repository connection, choose sandbox catalog values, and supply disposable test identities. The agent can run code, probes, migrations, and deployment checks after those authorizations; it must stop before revealing or inventing secrets.

## Visual evidence

The run captured full-page screenshots of:

- the V01 vaulted showcase at local `/` after the workbench mounted;
- the OC showcase Portal at local `/portal/`, including Workbench, Journal, AMA, and MeritSubs route cards.

The screenshots were visually inspected for page shell, responsive card layout, route labels, and absence of secret values.
