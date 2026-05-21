<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Vitex Cafe

Next.js storefront and admin for a cafe, backed by the Express API in [`api-server/`](api-server/) (git submodule).

## Run locally

**Prerequisites:** Node.js, MongoDB (for the API)

**Frontend** (this folder):

1. `npm install`
2. Copy [`.env.example`](.env.example) to `.env.local` and set `NEXT_PUBLIC_API_URL` (e.g. `http://localhost:5000/api`)
3. `npm run dev` → http://localhost:3000

**API** (`api-server/`):

1. `cd api-server && npm install`
2. Copy `api-server/.env.example` to `api-server/.env` and configure `MONGODB_URI`, `JWT_SECRET`, `ALLOWED_ORIGINS`
3. `npm run dev` → http://localhost:5000

Optional: `npm run seed` in `api-server/` for sample data.

## Developing with Cursor

- **[AGENTS.md](AGENTS.md)** — architecture, env vars, and commands for AI agents
- **`.cursor/rules/`** — project rules (overview, frontend, API)
- Open the repo root in Cursor so rules and `AGENTS.md` apply automatically

For more detail than this README, see `AGENTS.md`.
