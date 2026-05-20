# bim. — AI Assistant Guide

Transit information monorepo for German commuters. Shows planned vs. actual transit conditions using GTFS Static and GTFS Realtime data.

## Repository structure

```
bim./
├── apps/
│   ├── api/          # @bim/api — Fastify 5 REST backend (port 4000)
│   └── web/          # @bim/web — React 19 + Vite SPA (port 5173)
├── packages/
│   └── shared/       # @bim/shared — shared TypeScript types + utilities
├── docs/
│   ├── architecture.md   # data flow and system design
│   └── compliance.md     # data license checklist (must pass before real data)
├── docker-compose.yml
├── eslint.config.js
├── tsconfig.base.json
└── .prettierrc
```

## Development commands

```bash
npm install               # install all workspaces from root
npm run dev               # start api (4000) + web (5173) concurrently
npm run test --workspaces -- --run   # run all tests once
npm run lint              # ESLint across all workspaces
npm run typecheck --workspaces       # TypeScript check all packages
docker compose up --build # full stack via nginx on port 8080
npm run docker:up         # alias for the above
```

Individual workspace commands:
```bash
npm --workspace @bim/api run dev     # API only (tsx watch)
npm --workspace @bim/web run dev     # web only (vite)
```

## Architecture

**Data flow:** GTFS Static (preprocessed base schedule) + GTFS-RT (polled every 15–30 s) → API normalization → frontend rendering.

**Layers:**
- `@bim/shared` — type contracts and utilities, imported by both api and web
- `@bim/api` — Fastify backend; encapsulates feed details, handles CORS, normalizes responses
- `@bim/web` — React SPA; knows only the internal API contract, never raw GTFS formats

**Fallback strategy:** prefer realtime data; fall back to static schedule when realtime is stale (>45 s). The UI must show data freshness (source, timestamp, `is_stale` flag).

**Current data layer:** `MockTransitRepository` (`apps/api/src/mockRepository.ts`) backed by fixtures in `apps/api/src/fixtures.ts`. Simulates the full realtime + static GTFS structure.

## API contract

All responses use the `ApiResponse<T>` envelope from `@bim/shared`:
```typescript
type ApiResponse<T> = {
  meta: FeedMeta;  // source, data_timestamp, fetched_at, is_stale, provider
  data: T;
};
```

Endpoints:
| Method | Path | Query params | Response data |
|--------|------|--------------|---------------|
| GET | `/api/health` | — | `{ status, service, compliance_mode }` |
| GET | `/api/departures` | `stop_id` (required), `limit` (1–20, default 8) | `Departure[]` |
| GET | `/api/service-alerts` | `active` (default true) | `ServiceAlert[]` |
| GET | `/api/vehicle-positions` | `route_id` (optional filter) | `VehiclePosition[]` |
| GET | `/api/raw/:feedType` | `trip_id` (optional) | `RawFeedDebug` |

## Web routes and pages

| Route | Page component | Purpose |
|-------|---------------|---------|
| `/departures/:stationId` | `DeparturesPage` | Live departures with delay indicators |
| `/map` | `MapPage` | Vehicle positions map |
| `/route` | `RoutePage` | Route planner |
| `/disruptions` | `DisruptionsPage` | Active service alerts |
| `/commute/:routeId` | `CommutePage` | Optimized commuter view |
| `/raw/:tripId` | `RawPage` | Debug / raw feed transparency |

Root `/` redirects to `/departures/demo-stop`.

## Key files

| File | Role |
|------|------|
| `packages/shared/src/index.ts` | Source of truth for all types and utilities — add new shared types here |
| `apps/api/src/app.ts` | Fastify route definitions — add new endpoints here |
| `apps/api/src/mockRepository.ts` | Data layer — extend for new mock data shapes |
| `apps/web/src/apiClient.ts` | Typed fetch wrapper — add new API calls here |
| `apps/web/src/components/useApi.ts` | Custom hook for async data fetching — reuse in every page |
| `apps/web/src/App.tsx` | Router + nav shell — register new routes and nav items here |

## Conventions

**Naming:**
- React components and TypeScript types: `PascalCase`
- Page components: `XxxPage.tsx` in `apps/web/src/pages/`
- Shared UI components and hooks: `apps/web/src/components/` (`SourceBar.tsx`, `useApi.ts`, etc.)
- Utilities and non-component files: `camelCase`
- Tests: `__tests__/` subdirectory adjacent to source files

**Imports:**
- Cross-package: use workspace name — `import { Departure } from '@bim/shared'`
- Within a package: use `.js` extension — `import { foo } from './bar.js'` (ESM requirement)
- Unused args: prefix with `_` — ESLint enforces `argsIgnorePattern: '^_'`

**Language:**
- Product copy, UI labels, and user-facing strings: **German** (e.g., "Abfahrten", "Störungen")
- Code identifiers, type names, comments: **English**

**Formatting (Prettier):** single quotes, trailing commas, 100-char line width.

**TypeScript:** strict mode, ES2022 target, bundler module resolution, isolated modules.

## Testing

Vitest is used across all packages:
- `apps/api` — node environment; uses `app.inject()` for route testing
- `apps/web` — jsdom environment; setup file at `apps/web/src/testSetup.ts`
- `packages/shared` — node environment; pure utility tests

Test files live in `__tests__/` directories. Run a single workspace's tests:
```bash
npm --workspace @bim/api run test -- --run
npm --workspace @bim/web run test -- --run
npm --workspace @bim/shared run test -- --run
```

## Critical constraints

### Mock-only (IMPORTANT)

**Do not introduce real GTFS feed URLs, API keys, or live data parsing.** The stack currently runs on mock data only (`compliance_mode: 'mock-only'`). Real data integration is blocked until every item in `docs/compliance.md` is signed off. Violating this risks license and legal issues.

### Data attribution

Any page or component that displays transit data must show the data source. The footer in `App.tsx` already carries `"Datenquelle: ÖBB Mock"` — preserve this pattern when adding new views.

### V1 scope

V1 is a read-first product. Do not add authentication, user persistence, favourites, push notifications, or personalisation. Those are V2 concerns. Before starting feature work, confirm whether the feature belongs to V1 or V2 (see `README.md` scope section).

## Docker deployment

```
web container (nginx:1.27-alpine) → port 8080
  └── proxies /api/* → api container (node:22-alpine) → port 4000
```

The Compose stack uses mock data only. `apps/web/nginx.conf` defines the reverse proxy rules.
