# CinePersona

Progressive Web App built with [Next.js 16](https://nextjs.org).

## Requirements

- Node.js `20` (matches the Netlify build — see `NODE_VERSION` in `netlify.toml`)
- npm `>= 10`

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For PWA install / offline testing, run over local HTTPS:

```bash
npx next dev --experimental-https
```

## Scripts

| Script          | Purpose                              |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server                 |
| `npm run build` | Production build                     |
| `npm start`     | Run the production build             |
| `npm run lint`  | ESLint (`eslint-config-next`)        |

## Environment variables

Copy `.env.example` to `.env.local` and fill in real values. Every required key is listed there.

| Key                                  | Used by                                          |
| ------------------------------------ | ------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`               | `lib/site.ts` — absolute URLs, OG, redirects     |
| `NEXT_PUBLIC_SUPABASE_URL`           | Supabase browser + server clients                |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase browser + server clients              |

`.env.local` is gitignored. `.env.example` is committed (no secrets).

## Project layout

```
app/
  layout.tsx         root layout, fonts, metadata, viewport, SW registrar
  page.tsx           home
  loading.tsx        root suspense fallback
  error.tsx          segment error boundary (Next.js 16 unstable_retry)
  global-error.tsx   last-resort boundary, owns <html>/<body>
  not-found.tsx      404 (also rendered by notFound())
  offline/page.tsx   offline fallback served by sw.js
  manifest.ts        web app manifest
lib/
  site.ts            shared site constants (name, url, description, theme)
public/
  sw.js              service worker (precache + offline fallback)
  icon-*.png         PWA icons
```

## PWA

- Manifest: `app/manifest.ts` (driven by `lib/site.ts`)
- Service worker: `public/sw.js`, registered in production by `app/sw-register.tsx`
- Offline fallback: `app/offline/page.tsx`
- Security + SW headers: `next.config.ts`

## Deployment (Netlify)

- Adapter: `@netlify/plugin-nextjs`
- Node version: `20` (set via `NODE_VERSION` in `netlify.toml`)
- Required env vars in the Netlify dashboard:
  - `NEXT_PUBLIC_SITE_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Add the production + preview URLs to Supabase **Auth → Redirect URLs**.

## Notes for contributors

- This project tracks the latest Next.js 16 conventions — see `AGENTS.md`. When touching framework-level APIs, consult `node_modules/next/dist/docs/` rather than older external references.
- `error.tsx` and `global-error.tsx` use the Next.js 16 `unstable_retry` prop (replaces `reset`).
- Progress and remaining setup tasks live in `docs/TODO.md`.
