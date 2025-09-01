<div align="center">

# Worknix

Lightweight, production‑ready frontend job portal with ATS‑friendly job detail pages, optional real‑time notifications, admin dashboard, SEO + sitemap, PWA service worker, and themeable UI (shadcn + Tailwind). Fully static deploy – no privileged backend bundled.

</div>

## Features

- Modern stack: Vite + React 18 + TypeScript
- UI system: Tailwind CSS + shadcn/ui (Radix primitives)
- Jobs browsing: private & govt listings with client‑side filters, search, sort
- Hero slideshow: lightweight auto‑sized multi‑image slider (see `HeroSlideshow`)
- Job detail pages: structured data (JobPosting JSON‑LD), sanitized HTML description
- Admin area: tabbed dashboard + lazy‑loaded charts (gated by simple key + localhost)
- Notifications: optional Supabase table + realtime channel (graceful fallback / disable)
- SEO: central `<Seo />`, canonical tags, dynamic `<Helmet>` integration
- Sitemap generation script (`scripts/generate-sitemap.mjs`)
- Service Worker: asset caching + update toast
- Ads (optional): Google AdSense slots behind env flags
- Accessibility: skip link, labeled inputs, focus-visible styles
- Theming & design tokens via CSS variables; responsive layout out of the box
- Error resilience: enhanced `ErrorBoundary` with diagnostics capture
- Security hygiene: basic HTML sanitization for job descriptions

## Getting Started

Requirements: Node 18+ (recommend using nvm), npm.

```sh
git clone <REPO_URL>
cd worknix
npm install
npm run dev
```

Open http://localhost:5173 (default Vite port).

## Build & Preview

```sh
npm run build
npm run preview   # serves dist/ locally
```

`dist/` contains static assets ready for any CDN or static host (Vercel, Netlify, Cloudflare Pages, S3+CloudFront, etc.). Ensure SPA fallback (all unmatched routes -> `/index.html`).

## Environment Variables

Create a `.env` (only `VITE_` prefixed vars are exposed to the client):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_ADMIN_KEY=change-me            # query param key for /admin (e.g. /admin?key=...)
VITE_TELEGRAM_URL=
VITE_WHATSAPP_URL=
VITE_ENABLE_NOTIFICATION_FALLBACK=false
VITE_DISABLE_NOTIFICATIONS=false    # if true, suppress all remote notification calls
VITE_ADSENSE_CLIENT_ID=
VITE_ADSENSE_SLOT_HOME=
VITE_ADSENSE_SLOT_HOME_FEATURED=
VITE_SITE_URL=https://your-domain.com
VITE_ENABLE_ANALYTICS=false
```

Security: never place service role / private keys in `VITE_` vars. Everything ships to the browser.

Notifications: if you do not have a `notifications` table, set `VITE_DISABLE_NOTIFICATIONS=true` to avoid remote 404s (graceful suppression also auto‑detects missing table once).

## Directory Overview (Selected)

```
src/
	assets/            # Static images (hero carousel images: `carousel_*.png`)
	components/        # UI + shared widgets (Navigation, HeroSlideshow, JobCard, Notifications, ads, etc.)
	pages/             # Route components (Home, Jobs, Govt, JobDetail, Admin, basic auth stubs)
	data/              # Data access helpers (Supabase wrappers)
	lib/               # Supabase client, utilities
	hooks/             # Reusable React hooks
	components/ui/     # shadcn generated primitives
public/              # Static assets, manifest, service worker, sitemap
scripts/             # build-time scripts (sitemap)

The auth / resume related pages are currently lightweight placeholders; wire them up to real logic or remove if not needed.

## Hero Slideshow

`HeroSlideshow` is a minimal dependency‑free slider that:

1. Accepts an `images` array (`{ src, alt }`).
2. Auto advances every `intervalMs` (default 5–7s) with smooth horizontal slide.
3. Auto‑sizes to the natural dimensions of the first image (maintains aspect ratio).
4. Supports `fit="contain"` (no crop) or `fit="cover"`.

Add / change hero images:

1. Drop files into `src/assets` (e.g. `carousel_4.png`).
2. Import them in `Home.tsx` and pass to the `images` prop.
3. Keep alt text descriptive for accessibility + SEO.
```

## Admin Access Model

The `/admin` route is intentionally lightweight: allowed only on `localhost` OR when a `?key=` query parameter matches `VITE_ADMIN_KEY`. Replace with real auth later (Supabase Auth + RLS, etc.).

## Deployment Checklist

1. Set `VITE_SITE_URL` (used for sitemap + canonical fallbacks)
2. (Optional) Configure Supabase vars if using notifications / future data
3. (Optional) Configure AdSense env vars; leave unset to disable ads
4. Run `npm run build`
5. Upload `dist/` to host & configure SPA rewrite
6. Serve with proper cache headers:
	 - `/*` -> `Cache-Control: no-cache`
	 - `/assets/*` -> `Cache-Control: public, max-age=31536000, immutable`

## Sitemap & Robots

`scripts/generate-sitemap.mjs` emits `public/sitemap.xml` (static + dynamic job IDs if available). Set `VITE_SITE_URL` before running for correct absolute URLs. Update `public/robots.txt` sitemap line to match your domain.

## Service Worker

`public/sw.js` handles: network‑first for navigations, cache‑first for hashed assets, and update detection with a toast prompting reload.

## Analytics Placeholder

`Analytics` component is a stub (no network unless you implement). Toggle with `VITE_ENABLE_ANALYTICS` or replace with a real provider (Plausible, Umami, Posthog, etc.).

## Ads (Optional)

AdSense script only loads if `VITE_ADSENSE_CLIENT_ID` is set. Slots are rendered via `<AdSlot />` where configured. Keep placements minimal to preserve UX and CLS.

## Notifications (Optional)

`notifications.ts` queries Supabase `notifications` table and subscribes to realtime inserts. Missing table errors are auto‑suppressed. Provide a table (id UUID, title text, body text, created_at timestamptz default now()) or disable via env.

## Error Handling & Resilience

- `ErrorBoundary` captures and displays errors with a reload action.
- Sanitization utility strips unsafe tags/attributes from job descriptions.

## Performance Notes

- Route-level code splitting via `React.lazy`
- Manual vendor chunking (React, Supabase, Recharts) for long‑term caching
- SW caches static assets; update toast encourages refresh
- JSON‑LD for Organization + JobPosting improves search visibility

## Future Enhancements (Ideas)

- Real authentication & role-based admin
- Server-rendered / prerendered job pages
- Richer resume builder & export formats (.docx)
- Form-based job submission pipeline with moderation
- Enhanced analytics & A/B testing hooks

## Contributing

Open a PR or branch off `main`/`my-changes`. Run lint before committing:

```sh
npm run lint
```

## License

MIT (adjust if needed). Include attribution for third-party assets you add.

