# CLAUDE.md — metric-planner

> Productivity app in the **Metric** ecosystem. Separate, standalone codebase;
> shares branding (design tokens) with AdMetrics + metric-site, but **no shared
> code**. Source of truth for anyone (human or AI) working in this repo.

## Ecosystem role

Three independent repos, shared brand, separate codebases:
- **AdMetrics** (dashboard app) — true net-profit analytics + AI Growth Officer.
- **metric-site** — umbrella marketing / portfolio site (static).
- **metric-planner** (this repo) — the productivity companion that turns
  AdMetrics insights into a plan you actually execute.

This repo **extends the Metric ecosystem standards** and reuses the shared
brand tokens (`:root`/`.dark` in `src/index.css`, the Tailwind color/font
mapping, the fonts + no-flash theme script). Cross-repo links are **env-driven**
(`VITE_SITE_URL`, `VITE_APP_URL`) — never hardcoded domains.

## Stack

Vite 6 · React 18 · pure JS/JSX (NO TypeScript) · Tailwind 3 (token-driven CSS
variables, dark/light) · pnpm. No backend yet.

## Structure

```
src/
├── main.jsx · App.jsx · index.css     design tokens copied from metric-site
├── api/            backend client (stub — no backend yet)
├── lib/            cn + helpers
├── shared/
│   ├── components/ Logo, MeshBackground (shared brand)
│   └── hooks/      (empty — to come)
└── portals/
    ├── app/        Landing ("coming soon") — the future product surface
    └── auth/       (empty — to come)
```

## Run

```bash
pnpm install
pnpm dev        # http://localhost:5175
pnpm build      # → dist/  (must be 0 errors)
```

## STRICT RULE — read before adding anything

- **Build step-by-step.** One small, verified piece at a time.
- **Never hallucinate copy or features.** There is no product spec yet beyond
  the coming-soon page. Do not invent pages, flows, pricing, or data models.
- **Ask the Founder first** before adding any page, route, data model,
  dependency, or third-party service.
- Pure JS/JSX, Tailwind utilities only, no secrets in the repo (only
  `.env.example` is committed).
