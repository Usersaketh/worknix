# Worknix — AI agent instructions

Use these conventions to be productive in this Vite + React + TypeScript + Tailwind + shadcn-ui app. The app is a frontend-only job portal with resume builder, job listings (incl. govt jobs), and an admin dashboard. No backend; lists are mocked in-page for now.

## Architecture & routing
- Entrypoint: `index.html` -> `/src/main.tsx` renders `<App />`.
- Routing: `src/App.tsx` with `react-router-dom` v6. Paths: `/` (Home), `/jobs`, `/govt-jobs`, `/resume-builder`, `/signin`, `/signup`, `/admin` (guarded), `*` (NotFound).
- Code-splitting: Pages are loaded via `React.lazy` wrapped in `<Suspense>` with a lightweight fallback. When adding new pages, prefer lazy imports to keep the main chunk smaller.
- Navigation: `src/components/Navigation.tsx` top bar. Update nav and routes together.
- Guard: `src/components/ProtectedRoute.tsx` allows admin only on localhost (demo-only). Keep behavior unless explicitly changed.
- State/data: Mostly local component state with mocked arrays in each page. `@tanstack/react-query` is configured but not yet used for fetching.

## UI system
- shadcn-ui components live in `src/components/ui/*`. Import via alias `@/components/ui/...`.
- Tailwind theme uses CSS variables in `src/index.css` (e.g., `--primary`, `--shadow-elegant`, `--shadow-card`). Reuse these for consistent look.
- Buttons: `src/components/ui/button.tsx` defines variants:
  - `variant`: default, destructive, outline, secondary, ghost, link, professional, success, warning.
  - Prefer `variant="professional"` for primary CTAs; use `success`/`warning` contextually.
- Utility: `cn` from `src/lib/utils.ts` for class merging.

## Pages in scope (examples of patterns)
- `src/pages/Home.tsx`: marketing-style hero, stats, feature cards, responsive img with alt. Uses gradients/shadows from theme.
- `src/pages/JobPortal.tsx` and `src/pages/GovtJob.tsx`: client-side search and sidebar filters, card lists with badges, icons. Includes controlled filters (type/location/department/clearance) and a sorting select (recent, salary up/down). Keep filters controlled and accessible with labels.
  - Filters and search sync to URL query params (Jobs: q, types, locs, p; Govt Jobs: q, types, depts, cls, p). Render filter chips with clear/remove and a Clear all.
- `src/pages/ResumeBuilder.tsx`: tabs for sections, live preview card, local state for template and fields.
- `src/pages/AdminPortal.tsx`: tabs (dashboard, jobs, govt-jobs, candidates, resumes, settings), Recharts (`BarChart`, `PieChart`) examples.
  - Dashboard charts are lazy-loaded (`src/pages/admin/AdminDashboardCharts.tsx`) to keep the main admin chunk smaller.

## Conventions
- Path alias `@` -> `./src` (see `vite.config.ts`). Always prefer absolute alias imports.
- Co-locate simple mock data within page components unless extracted; keep types explicit when adding shared data.
- Use shadcn primitives first; avoid introducing new UI libs.
- Accessibility: provide meaningful `alt` on images, label inputs via `Label` + `htmlFor`, ensure keyboard focus styles remain (Tailwind focus-visible).
- Responsive: favor mobile-first Tailwind classes; audit `sm/md/lg` breakpoints consistent with Tailwind defaults.
- Add or keep the Skip to Content link (`index.html`) targeting `#main-content` in `App.tsx` for keyboard users.

## Ads & policies
- AdSense is integrated behind env flags. Set in `.env`:
  - `VITE_ENABLE_ADS=true`, `VITE_ADSENSE_CLIENT_ID=ca-pub-...`, and optional per-page slots `VITE_ADSENSE_SLOT_HOME`, `VITE_ADSENSE_SLOT_JOBS`, `VITE_ADSENSE_SLOT_GOVT`.
- Script loader: `src/components/ads/AdProvider.tsx`; responsive slots: `src/components/ads/AdSlot.tsx`.
- Slots are placed in-content on Home, Jobs, Govt Jobs and are non-intrusive.
- Policy pages exist: `/about`, `/contact`, `/privacy`, linked from `Footer` and mobile secondary nav.

## Workflows
- Scripts (see `package.json`):
  - Dev: `npm run dev`
  - Build: `npm run build` (Vite), Preview: `npm run preview`
  - Lint: `npm run lint`
- Add a page:
  1) Create `src/pages/MyPage.tsx` using shadcn cards/buttons.
  2) Register route in `src/App.tsx`; add nav item in `src/components/Navigation.tsx`.
- Styling: prefer Tailwind + theme vars; keep animations subtle using `--transition-smooth`.

## Resume builder specifics
- Validation: Personal info uses `react-hook-form` + `zod` with onChange validation; export buttons are disabled until valid.
- Persistence: Saving writes to `localStorage` key `worknix_resume`; load on mount if available.
- Exports: PDF via `react-to-print`; basic Word export via HTML-as-DOC download. For real .docx, consider a small library in a follow-up.

## Performance
- Use route-level code-splitting for new routes. If a page grows, consider splitting heavy sub-sections with dynamic imports.
- For Admin, prefer lazy-loading of charts and other heavy widgets inside their tabs.

## Gotchas
- `ProtectedRoute` blocks `/admin` unless on localhost; keep for demo safety.
- `App.css` is Vite boilerplate; avoid relying on it—use Tailwind.
- Recharts needs parent with dimensions; use `ResponsiveContainer` like in `AdminPortal`.

## Definition of done for new features
- Routed page reachable from nav.
- Uses shadcn components and Tailwind theme variables.
- Responsive (mobile to desktop) and accessible labels/alt.
- Linted and builds with `vite build`.

Questions or unclear areas: AdSense publisher/slot IDs, final policy content, and any backend/API plans. Provide placeholders and gate behavior via env until provided.
