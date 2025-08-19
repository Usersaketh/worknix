# Worknix — AI agent instructions

Use these conventions to be productive in this Vite + React + TypeScript + Tailwind + shadcn-ui app. The app is a frontend-only job portal with resume builder, job listings (incl. govt jobs), and an admin dashboard. No backend; lists are mocked in-page for now.

## Architecture & routing
- Entrypoint: `index.html` -> `/src/main.tsx` renders `<App />`.
- Routing: `src/App.tsx` with `react-router-dom` v6. Paths: `/` (Home), `/jobs`, `/govt-jobs`, `/resume-builder`, `/signin`, `/signup`, `/admin` (guarded), `*` (NotFound).
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
- `src/pages/JobPortal.tsx` and `src/pages/GovtJob.tsx`: client-side search and sidebar filters, card lists with badges, icons.
- `src/pages/ResumeBuilder.tsx`: tabs for sections, live preview card, local state for template and fields.
- `src/pages/AdminPortal.tsx`: tabs (dashboard, jobs, govt-jobs, candidates, resumes, settings), Recharts (`BarChart`, `PieChart`) examples.

## Conventions
- Path alias `@` -> `./src` (see `vite.config.ts`). Always prefer absolute alias imports.
- Co-locate simple mock data within page components unless extracted; keep types explicit when adding shared data.
- Use shadcn primitives first; avoid introducing new UI libs.
- Accessibility: provide meaningful `alt` on images, label inputs via `Label` + `htmlFor`, ensure keyboard focus styles remain (Tailwind focus-visible).
- Responsive: favor mobile-first Tailwind classes; audit `sm/md/lg` breakpoints consistent with Tailwind defaults.

## Ads & policies (planned integration)
- Google AdSense not wired yet. When adding:
  - Load script in `index.html` only if an env flag is present; render responsive in-content ad components that don’t obstruct core flows.
  - Add required policy pages and routes: About, Contact, Privacy (link from footer/nav).

## Workflows
- Scripts (see `package.json`):
  - Dev: `npm run dev`
  - Build: `npm run build` (Vite), Preview: `npm run preview`
  - Lint: `npm run lint`
- Add a page:
  1) Create `src/pages/MyPage.tsx` using shadcn cards/buttons.
  2) Register route in `src/App.tsx`; add nav item in `src/components/Navigation.tsx`.
- Styling: prefer Tailwind + theme vars; keep animations subtle using `--transition-smooth`.

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
