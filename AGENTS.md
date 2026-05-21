# Vitex Cafe — Agent guide

Cafe storefront and admin dashboard. **Next.js 15** (App Router) talks to a separate **Express + MongoDB** API in `api-server/` (git submodule).

## Repository layout

| Path | Role |
|------|------|
| `app/(storefront)/` | Public site: menu, product, orders, lunch, ASMR, about |
| `app/admin/` | Protected admin UI (JWT in `localStorage`) |
| `components/` | Shared React components |
| `lib/api.ts` | `fetchAPI`, `endpoints`, `formatPrice` (vi-VN), `getImageUrl` |
| `context/AuthContext.tsx` | Admin auth (`vt_admin_token`, `vt_admin_user`) |
| `api-server/` | REST API (submodule: `vitex-cafe-api`) |

## Local development

**Frontend** (repo root):

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev                  # http://localhost:3000
```

**API** (`api-server/`):

```bash
cd api-server
npm install
cp .env.example .env         # MONGODB_URI, JWT_SECRET, ALLOWED_ORIGINS
npm run dev                  # http://localhost:5000
```

Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api` in `.env.local`. Timezone for business logic is **Asia/Ho_Chi_Minh**.

Optional: `npm run seed` in `api-server/` for sample data.

## Conventions

- **Imports**: `@/` alias → project root (`tsconfig.json`).
- **API calls**: Use `fetchAPI` and `endpoints` from `@/lib/api` — do not duplicate base URL logic.
- **Prices**: Display with `formatPrice` (Vietnamese locale).
- **Admin routes**: Client-side guard in `app/admin/layout.tsx`; token attached automatically by `fetchAPI`.
- **Styling**: Tailwind CSS v4, `app/globals.css`, Lucide icons, `motion` for animations.
- **Submodule**: Changes inside `api-server/` may need a commit in the submodule repo, not only the parent.

## Commands

| Command | Where | Purpose |
|---------|-------|---------|
| `npm run dev` | root | Next dev server |
| `npm run build` | root | Production build |
| `npm run lint` | root | ESLint |
| `npm run dev` | api-server | API with nodemon |
| `npm run seed` | api-server | Seed MongoDB |

## What not to commit

- `.env`, `.env.local`, and any file with real API keys or `JWT_SECRET`
- `node_modules/`, `.next/`

## Cursor rules

Project-specific guidance lives in `.cursor/rules/` (overview, frontend, API). Prefer those over generic assumptions when editing matching files.
