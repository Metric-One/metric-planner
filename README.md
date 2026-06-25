# metric-planner

The productivity app in the **Metric** ecosystem — the companion that turns
AdMetrics net-profit insights into an executable plan. Separate, standalone
repo; shares branding (design tokens) with AdMetrics + metric-site, no shared
code. Currently a **coming-soon** landing page.

## Stack

Vite 6 · React 18 (pure JS/JSX, no TypeScript) · Tailwind 3 (token-driven CSS
vars, dark/light) · pnpm.

## Run

```bash
pnpm install
pnpm dev        # http://localhost:5175
pnpm build      # → dist/  (0 errors)
pnpm preview
```

## Cross-repo links

Env-driven (`.env.example` → `.env`): `VITE_SITE_URL` (metric-site),
`VITE_APP_URL` (AdMetrics dashboard). Never hardcode domains.

See `CLAUDE.md` for the ecosystem role and build rules.
