# FreshCart Grocery Delivery

FreshCart is a fast grocery delivery storefront with INR pricing, catalog discovery, cart persistence, and checkout.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/fresh-cart/` — React + Vite storefront and shopper flows
- `artifacts/api-server/src/routes/catalog.ts` — seeded catalog, categories, and merchandising highlights
- `artifacts/api-server/src/routes/orders.ts` — order placement endpoint
- `lib/api-spec/openapi.yaml` — source-of-truth API contract
- `lib/api-client-react/src/generated/` — generated React Query client hooks

## Architecture decisions

- INR is the only shopper-facing currency in the first release.
- Cart state is client-side and persisted in localStorage so browsing and reloads preserve the basket.
- The API server owns catalog filtering and order totals; the initial seed is in memory so the storefront can run without extra setup.

## Product

- Browse curated categories and featured products.
- Search, filter, sort, and add grocery products to a persistent cart.
- Review delivery details and choose COD or UPI at checkout.
- Place an order and see confirmation with ETA and total.

## User preferences

- The user requested a stronger UI than the reference grocery site and prices in rupees.

## Gotchas

- Run API codegen after any OpenAPI change.
- Standalone Vite builds need `PORT` and `BASE_PATH`; managed workflows provide them automatically.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
