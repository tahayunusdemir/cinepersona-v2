# CinePersona

> Find the films that fit your personality.

CinePersona is a film-discovery app built around a **cinema-specific personality model**. Take a short test, learn your CineType (one of 16), and get film recommendations, a public profile, a community, and a partner-match flow — all tuned to how you actually watch.

It's a Next.js 16 Progressive Web App backed by Supabase. Installable, works offline, dark by default.

---

## How the system works

CinePersona is built around five connected surfaces:

### 🎭 CineType — the model
A cinema-specific personality system inspired by MBTI / NERIS, but rebuilt for how people watch films. Four axes, sixteen types, grouped into four families and four strategies. The full theoretical model — axes, types, scoring, question bank, and the rationale for diverging from MBTI — lives in [`docs/MBTI/cinepersona-personality-system.md`](docs/MBTI/cinepersona-personality-system.md). Browse types at `/cinetype`.

### 📝 CineTest — the instrument
A 48-question test that places you on the four axes and assigns one of the 16 types. The form runs entirely client-side; results are only persisted when you opt in. Routes: `/cinetest` (intro), `/cinetest/take` (form), `/cinetest/result` (your type + film picks).

### 🎬 Films — the catalogue
A TMDB-backed film catalogue with detail pages, cast, keywords, and CineType tags. Routes: `/films`, `/films/[slug]`. Data is seeded via `npm run seed:tmdb`.

### 💞 CineMatch — pairwise discovery
Pair two profiles and produce a blended set of recommendations — inspired by Spotify Blend, but for films. Routes under `/cine-match/*`.

### 💬 Community + Profiles
Public profiles at `/{username}` (identity, counters, action bar, friends), plus boards / threads / comments / votes / follows / blocks / reports under `/community/*`. Authenticated routes include `/settings` (profile, password, email, account) and `/badges` (achievement system).

Auth, account, and routing details live in [`docs/specs/`](docs/specs) — that folder is the single source of truth for every page.

---

## Tech stack

- **Next.js 16.2** (App Router) — note: this version uses `proxy.ts` instead of `middleware.ts`, and `error.tsx` uses `unstable_retry` instead of `reset`.
- **React 19.2** · **TypeScript 5**
- **Tailwind CSS v4** with `@theme inline` tokens
- **shadcn/ui** (Nova preset, base-nova, neutral) on **Base UI** — 55 components under `components/ui/`
- **next-themes** — class-based dark mode, dark by default
- **lucide-react** — icons
- **React Hook Form** + **Zod 4** — forms validated and submitted via Server Actions + `useActionState`
- **Supabase** (`@supabase/ssr`) — auth + Postgres with RLS on every public table
- **TMDB v3** — film metadata source
- **PWA** — `app/manifest.ts`, `public/sw.js`, `app/offline/page.tsx`
- **Netlify** + `@netlify/plugin-nextjs` for hosting

Canonical, always-current list: [`docs/TECHSTACK.md`](docs/TECHSTACK.md).

---

## Getting started

### Requirements
- Node.js **20** (matches Netlify — see `NODE_VERSION` in `netlify.toml`)
- npm **>= 10**
- A Supabase project ([database.new](https://database.new))
- A TMDB API key (for seeding the films catalogue)

### Setup

```bash
git clone https://github.com/<your-org>/cinepersona.git
cd cinepersona
npm install
cp .env.example .env.local        # then fill in real values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For PWA install / offline testing, run over local HTTPS:

```bash
npx next dev --experimental-https
```

### Database

DDL is split into ordered files under `supabase/`. Apply them in numerical order in the Supabase SQL editor (or via `psql`):

```
supabase/
├── 00_README.md
├── 01_extensions.sql
├── 02_profiles.sql
├── 03_contact.sql
├── 04_community.sql
├── 05_films.sql
├── 06_cinepersona.sql      ← CineType / CineTest tables
├── 07_badges.sql
├── 08_cinematch.sql
└── 09_friends.sql
```

All scripts are idempotent and safe to re-run. RLS is enabled on every public table; policies are keyed off `auth.uid()`.

### Seeding films

```bash
npm run seed:tmdb
```

Reads `TMDB_API_KEY` from `.env.local` and populates the `films` tables.

---

## Scripts

| Script               | Purpose                              |
| -------------------- | ------------------------------------ |
| `npm run dev`        | Start the dev server                 |
| `npm run build`      | Production build                     |
| `npm start`          | Run the production build             |
| `npm run lint`       | ESLint (`eslint-config-next`)        |
| `npm run seed:tmdb`  | Populate the films catalogue from TMDB |

---

## Environment variables

Copy `.env.example` to `.env.local`. Every required key is listed there.

| Key                                      | Used by                                      |
| ---------------------------------------- | -------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                   | `lib/site.ts` — absolute URLs, OG, redirects |
| `NEXT_PUBLIC_SUPABASE_URL`               | Supabase browser + server clients            |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`   | Supabase browser + server clients            |
| `SUPABASE_SERVICE_ROLE_KEY`              | Server-only admin tasks (seed scripts)       |
| `TMDB_API_KEY`                           | `scripts/seed-tmdb.mjs`                      |

`.env.local` is gitignored. `.env.example` is committed (no secrets).

---

## Project layout

```
app/                    Next.js App Router
├── (auth)/             login / register / forgot-password — grouped, no URL segment
├── [username]/         public profile + friends sub-routes
├── about/
├── auth/confirm/       Supabase OTP confirm callback
├── badges/
├── checkout/
├── cine-match/         CineMatch flow
├── cinetest/           the 48-question test
├── cinetype/           the model: 16 types, groups, strategies
├── community/          boards / threads / comments
├── films/              catalogue + detail pages
├── messages/
├── offline/            PWA offline fallback
├── pricing/
├── reset-password/
├── settings/           profile, password, email, account, community
├── layout.tsx          root layout + ThemeProvider + SW registrar
├── page.tsx            landing
├── manifest.ts         PWA manifest
├── error.tsx           segment error boundary (Next 16 unstable_retry)
└── global-error.tsx    last-resort boundary

components/
├── ui/                 shadcn/ui — 55 components
├── auth/  badges/  cinematch/  cinepersona/  cinetest/  community/
├── films/  friends/  pricing/  profile/  settings/
├── site-header.tsx · site-footer.tsx · site-nav.tsx
└── theme-provider.tsx · mode-toggle.tsx · flash-toast.tsx · contact-form.tsx

lib/
├── supabase/           browser, server, and proxy clients
├── schemas/            Zod schemas (one per form)
├── auth/  badges/  cinematch/  cinepersona/  community/  contact/
├── films/  friends/  match/  pricing/  profile/  settings/
└── site.ts             single source of truth for name / url / theme

supabase/               ordered DDL — apply 01 → 09
public/                 icons, service worker, static assets
docs/                   specs, framework docs, design system references
proxy.ts                Next 16 proxy — Supabase session refresh
```

For a deeper tour of the docs, see [`docs/README.md`](docs/README.md).

---

## PWA

CinePersona installs as an app and works offline:

- Manifest: `app/manifest.ts` (driven by `lib/site.ts`)
- Service worker: `public/sw.js`, registered in production by `app/sw-register.tsx`
- Offline fallback: `app/offline/page.tsx`
- Security + SW headers: `next.config.ts`

The recipe behind this lives in [`docs/How to build a PWA with Next.js.md`](docs/How%20to%20build%20a%20PWA%20with%20Next.js.md).

---

## Deployment (Netlify)

- Adapter: `@netlify/plugin-nextjs`
- Node version: `20` (set via `NODE_VERSION` in `netlify.toml`)
- Required env vars in the Netlify dashboard:
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (if running scheduled tasks server-side)
  - `TMDB_API_KEY` (if seeding from the build)
- Add the production + preview URLs to Supabase **Auth → Redirect URLs**.
- Post-deploy smoke check: SW registers, manifest/icons resolve, sign-in works.

---

## Contributing

- Read [`AGENTS.md`](AGENTS.md) before touching framework-level APIs — this is Next.js 16, with breaking changes from older versions. When in doubt, consult `node_modules/next/dist/docs/` rather than external references.
- Every page has a spec under [`docs/specs/`](docs/specs). Read it first; specs are the single source of truth.
- All DDL goes in `supabase/*.sql`. Specs summarise the shape; they don't paste DDL.
- Default shadcn components + Lucide icons. No custom variants.
- UI copy is English. Specs are written in Turkish — don't translate them.
- Progress and remaining setup tasks live in [`docs/TODO.md`](docs/TODO.md).

---

## License

TBD.
