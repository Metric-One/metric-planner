# CLAUDE.md — metric-planner (AI Planner surface of Metric One)

> This repo is the **AI Planner** surface of **Metric One**. Parts 1–3 below are
> the **company brain**, pasted from the Day-1 master prompt and **locked** — do
> not alter the facts. Only the repo-specific technical sections at the bottom
> are editable, and they must always describe **verified reality**, not aspiration.

---

> ## ⛔ STRICT BUILD RULE — read before writing ANY code
> - **Build step-by-step, option-by-option.** One small, verified piece at a time.
> - **Never guess or hallucinate** copy, features, pages, flows, pricing, data
>   models, or design. There is no planner product spec yet beyond the
>   coming-soon page and the Part-1 description.
> - **Ask the Founder (Mani) first** before adding any page, route, data model,
>   dependency, third-party service, or before starting any feature work.
> - **Read-only-first:** every write/publish/automation flag defaults FALSE
>   until the founder explicitly approves it.
> - Wherever this file says **"ask founder"** / **"TBD"**, that is a hard stop.

---

## PART 1 — COMPANY BRAIN (locked, verbatim)

ECOSYSTEM: Metric One (metric.one) — AI growth engine, three surfaces:
1. Dashboard — connects international ad platforms + e-commerce + global
   marketplaces, normalizes all data into one interface including true net
   profit. Serves both individual brands AND agencies/companies (multi-client).
2. AI Growth Officer — analysis + growth recommendations on the user's real
   connected data, OR the company's own default AI analysis when nothing is
   connected (BYOK via Anthropic/OpenAI/Gemini API keys, rule-based fallback
   otherwise — this fallback already exists, do not rebuild it).
3. AI Planner — personal AND agentic planners in one system, more
   customizable than Notion; 10-question onboarding builds a tailored plan;
   fully editable by user or AI.
Plus B2B services: custom dashboards, planners, automation builds.
Pricing (v0, not final): Free / Pro ~$20 / Max ~$100.

FOUNDER: Mani Alizadeh — Head of Growth (never "Founder" in public copy).
Istanbul, Türkiye. 10 years sales & marketing (7yr traditional + 3yr digital).
Computer Engineering, Nişantaşı University. Builds everything with AI agents.

BRAND — Signal v1.0 (locked): Electric #2F6BFF · Deep #1E50E0 · Ink #0A0E17 ·
Navy #0B1B3A · Tint #EAF1FF · Paper #FFFFFF. Profit #4DA3FF / Loss #16337A,
always paired with ▲▼ glyphs — color is never the only signal. Space Grotesk
(display) / IBM Plex Sans (body) / IBM Plex Mono (data). Dark theme = brand
Navy/Ink, never pure OLED black. Mascot: Safir, anthropomorphic lion in a
Signal-navy suit.

STACK (locked, flag any deviation instead of silently allowing it):
Pure JS+JSX — NO TypeScript. Vite, React 18, Tailwind, Recharts, Framer
Motion, Zustand. Express 5, Prisma, Postgres 16, Redis 7. Targets: Web/PWA,
Capacitor (iOS/Android), Tauri (macOS/Windows — no Linux).
Architecture principle: read-only-first — all write/publish/automation
flags default FALSE until explicitly approved by the founder.
Supabase is explicitly rejected — do not suggest it, do not migrate to it.

GTM: zero content publishing before V1. LinkedIn (personal + company) goes
live only after V1 ships. YouTube + Instagram follow after that. This repo's
work has no dependency on content/marketing timing — build regardless.

## PART 2 — V1 SCOPE (locked this cycle, target ship 2026-07-31)

CONNECTORS — tiered, only Tier 1 blocks V1:
- Tier 1 (V1, build now): Shopify, WooCommerce, Meta Ads, Google Ads, Stripe
- Tier 2 (fast-follow, weeks 1-2 post-V1; START Amazon SP-API approval NOW —
  long lead time): Amazon (US first), TikTok Ads, PayPal
- Tier 3 (later, regional): Trendyol, Hepsiburada
- NOT building: any Alibaba-style B2B sourcing connector.

EXPLICITLY OUT OF V1 (defer to post-launch hardening):
- Support portal / Socket.io live agent desk — simple contact form for V1
- Native mobile/desktop shells (Capacitor/Tauri) — PWA covers V1
- Full CI/CD, CDN/caching, load balancing/scaling, full DR

DASHBOARD MUST BE FUNCTIONALLY COMPLETE FOR V1 — the 5 placeholder pages
(Orders, Products & COGS, Ad Spend, Attribution, Cohorts) wired to Tier-1
connector data; multi-tenant agency view working end to end.

> **Planner note (verified reading of Part 2):** the locked V1 scope is
> **dashboard-centric**. The **AI Planner is NOT listed as V1-blocking** — it
> carries no Tier-1 connector or dashboard-page requirement. Whether the AI
> Planner ships inside the 2026-07-31 V1 or stays a coming-soon teaser through
> that date is **an open founder decision** (see the plan / open questions).
> Until confirmed, this repo stays a polished teaser and does not start planner
> feature work.

## PART 3 — 13-LAYER PRODUCTION FRAMEWORK (phased)

V1-BLOCKING: (1) Frontend foundation — no TS creep, Tailwind-only, clean build ·
(2) API & backend logic — thin routes, logic in services · (3) DB & storage —
schema matches real features, clean migrations · (4) Auth & permissions —
verify multi-tenant client boundary is enforced at the **query** level, not
just middleware · (5) Hosting — Vercel for frontend-only repos, VPS for
anything needing a persistent backend/DB/Redis · (6) Basic security — secrets
encrypted at rest, rate-limited login, CSRF, input sanitization before any AI
context (verify dompurify/equivalent actually installed) · (7) Error tracking &
logs — server-side logging that survives restart; no paid APM required for V1.

HARDEN AFTER V1: (8) cloud/compute scaling · (9) rate-limit refinement ·
(10) full CI/CD (human-gated) · (11) caching & CDN · (12) load balancing &
horizontal scaling · (13) full availability & DR.

Automation loop (Part 4, scaffold-only for now): Claude prepares branch + PR
with a plain-English diff summary; **Mani reviews & merges manually**; deploy is
a **separate, equally human-gated** step. **No auto-merge, no auto-deploy, ever.**

═══════════════════════════════════════════════════════════════
REPO-SPECIFIC TECHNICAL SECTIONS (verified 2026-07-05 — real state)
═══════════════════════════════════════════════════════════════

## What this repo actually is, today

A **single-screen "Metric Planner — coming soon" teaser**. Verified by reading
the code: `App.jsx` renders `<MeshBackground/> + <Landing/>` and nothing else.
There is **no router, no state store, no motion library, no auth, no backend,
no product surface** yet. It builds clean and is already deployed on Vercel.

**Installed deps (real):** `react`, `react-dom`, `clsx`, `lucide-react` (dev:
`vite`, `@vitejs/plugin-react`, `tailwindcss`, `postcss`, `autoprefixer`).
Note the locked ecosystem stack also names React Router / Framer Motion /
Zustand / Recharts — **none are installed here yet** (correct for a teaser; add
only when the founder greenlights the real planner, one dep at a time).

## ⚠️ Verified discrepancies vs the locked brain (fix before feature work)

1. **Brand tokens predate Signal v1.0.** `src/index.css` still uses the OLD
   palette: `--primary #2f7df0` (not Electric `#2F6BFF`), profit `#047d50`/
   `#00ff87`, loss `#c81e4a`/`#ff5470`. Dark `--bg` is **`#000000` (pure OLED
   black)** — this **violates** the locked rule *"dark theme = Navy/Ink, never
   pure OLED black."* Retokenizing to Signal v1.0 (Electric/Deep/Ink/Navy/Tint/
   Paper + profit `#4DA3FF`/loss `#16337A`) is the first planned task.
2. **Body/mono fonts are wrong.** Loaded fonts are **Plus Jakarta Sans + JetBrains
   Mono**; Signal v1.0 locks **IBM Plex Sans (body) + IBM Plex Mono (data)**.
   Display (Space Grotesk) is correct. `index.html` `<link>` + `tailwind.config.js`
   `fontFamily` both need updating.
3. **Semantic color has no ▲▼ glyph pairing** anywhere yet — required by the
   brand ("color is never the only signal"). Relevant once real data renders.
4. **Positioning drift in Landing copy.** Current copy = "the productivity
   companion to AdMetrics — turn your net-profit insights into a plan." The
   locked brain positions the AI Planner as *"personal AND agentic planners in
   one system, more customizable than Notion"* — broader than an AdMetrics
   companion. **Do not rewrite the copy unprompted — ask founder** which framing
   is canonical.
5. **Naming.** Product/brand is **Metric One**; this surface is the **AI
   Planner**. The repo, page `<h1>`, and `<title>` say "Metric Planner." Keep as
   is until the founder confirms the public name for this surface.

## Folder map (verified)

```
metric-planner/
├── index.html            Google Fonts + no-flash theme script (default light)
├── vite.config.js        port 5175, @ alias
├── tailwind.config.js    token→utility color/font mapping + fadeUp anim
├── postcss.config.js · jsconfig.json · vercel.json (SPA rewrite)
├── .env.example          VITE_SITE_URL, VITE_APP_URL (cross-repo, env-driven)
└── src/
    ├── main.jsx          React 18 root (StrictMode)
    ├── App.jsx           <MeshBackground/> + <Landing/>  (no router)
    ├── index.css         design tokens (OLD palette — see discrepancy #1)
    ├── api/client.js      stub: apiBase from VITE_API_URL (no backend)
    ├── lib/cn.js          clsx helper
    ├── shared/
    │   ├── components/    Logo, MeshBackground (shared brand)
    │   └── hooks/         (empty — .gitkeep)
    └── portals/
        ├── app/Landing.jsx   coming-soon screen (real render)
        └── auth/             (empty — .gitkeep)
```

## Ecosystem & cross-repo rules

- Sibling repos: **metric-App** (Dashboard + AI Growth Officer, its own backend/
  DB/Redis) and **metric-site** (marketing/portfolio, static). Separate
  codebases, **shared brand only — no shared code package** (a `@metric/ui`
  package is a possible later item; don't add it now).
- **Cross-repo links are env-driven** (`VITE_SITE_URL`, `VITE_APP_URL`) — never
  hardcode a domain. Landing already reads `VITE_SITE_URL` for its one CTA.

## Local dev

```bash
corepack pnpm install
corepack pnpm dev        # http://localhost:5175
corepack pnpm build      # → dist/  (must be 0 errors)
corepack pnpm preview
```

Deploy: static Vite build → **Vercel** (frontend-only, per Part 3 layer 5).
`vercel.json` = SPA rewrite. Repo is already connected and auto-deploying on
merge to `main` (note: auto-deploy on merge conflicts with the Part-4
"human-gated deploy" principle — flag for the founder if that gate matters here).

## CURRENT REALITY — module status (updated 2026-07-05, Day 1)

| Area | Status |
|---|---|
| Coming-soon teaser | ✅ done, deployed |
| Signal v1.0 tokens/fonts | ✅ **applied** — `:root`/`.dark` retokenized; dark = Navy `#0B1B3A` / Ink `#0A0E17` (no OLED black); fonts = Space Grotesk + IBM Plex Sans + IBM Plex Mono |
| Router (React Router 6) | ✅ added — `/` Landing, `/onboarding`, `*`→`/` |
| State (Zustand 5) | ✅ added — `src/shared/stores/onboardingStore.js` (local only; write flags FALSE) |
| 10-question onboarding | 🟡 **shell only** — 10 locked questions captured to local state; no plan gen, no persistence |
| Planner data model | 🟡 **schema defined, NOT migrated** — `prisma/schema.prisma` (Workspace, OnboardingProfile, Sprint, Block, Task); awaiting founder review |
| Sprint/Block/Task UI + drag-drop calendar | ❌ not started (Week 2, after schema + onboarding approved) |
| Auth | ❌ none |
| Backend / API (Express) | ❌ none (stub only; Prisma deps not installed yet — Day 2 does install + generate + migrate) |
| Is any of this V1-blocking? | ❓ **open founder decision** — Part 2 does not list the planner as V1 |

### Day 1 log — 2026-07-05
- **Brand fix:** Signal v1.0 tokens + fonts applied across `index.css`,
  `tailwind.config.js`, `index.html` (incl. dark `theme-color` → Navy). Build 0 errors.
- **Scaffold:** added `react-router-dom@6`, `zustand@5`; onboarding route shell
  with the 10 locked questions; answers → local Zustand; all write flags FALSE.
- **Schema:** authored `prisma/schema.prisma` (multi-tenant, workspace-scoped) +
  `DATABASE_URL` in `.env.example`. **No migrate run** — pending schema review.
- **Deferred to Day 2+ (hard stop honored):** no Sprint/Block/Task UI, no
  drag-drop calendar, no backend persistence, no `prisma migrate`.
- **Open for review:** Block is only *transitively* tenant-scoped (via Sprint);
  see the FK note — decide whether to denormalize `workspaceId` onto Block.
