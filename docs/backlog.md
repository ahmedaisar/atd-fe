# Agoda.com Clone — Implementation Backlog

Status: Draft • Owner: Frontend team • Repo: agoda-clone (Next.js 15, App Router, TS, Tailwind, Radix)

This backlog converts the PRD into concrete, sequenced work items aligned with the current codebase.

Repo snapshot (today)

- Next.js App Router with pages: `/`, `/search`, `/hotels`, `/hotel/[id]`, `/booking`
- Many UI components already scaffolded (cards, filters, booking steps, galleries)
- Types present: `types/search.ts`, `types/hotels.ts`, `types/enhanced-pricing.ts`
- No API routes or fixtures yet; no tests/CI setup; map libs not installed

Milestones overview

- M0: Project hygiene & tooling
- M1: Mock data & API endpoints
- M2: Search experience (autocomplete, dates, guests)
- M3: Search results (filters, sorting, map)
- M4: Hotel detail (gallery, info, rooms, reviews)
- M5: Booking engine (cart, steps, payment sim)
- M6: Confirmation experience
- M7: SEO & Accessibility
- M8: Performance & CWV
- M9: Testing (unit, e2e)
- M10: Analytics & instrumentation
- M11: Documentation & demos

Notes

- Acceptance Criteria (AC) kept concise and testable.
- Use RSC/Server Actions where helpful; all data from mock API.
- Keep URL-driven state for shareability; persist short-term state in sessionStorage/localStorage when needed.

---

M0 — Project hygiene & tooling

1. Add linting/formatting
   - Do: Add ESLint config (next/core-web-vitals), Prettier, Tailwind plugin ordering
   - AC: `pnpm lint` shows 0 errors; pre-commit runs lint+format (lint-staged/husky optional)

2. Add testing frameworks
   - Do: Vitest + @testing-library/react + @testing-library/jest-dom; setup file
   - AC: `pnpm test` runs and sample test passes

3. Add E2E framework
   - Do: Playwright setup (chromium + mobile viewport)
   - AC: `pnpm e2e` runs a sample spec against `next dev`

4. Basic CI
   - Do: GitHub Actions to install deps, build, run lint, tests, and Playwright in headless
   - AC: CI passes on main PR

M1 — Mock data & API endpoints (App Route Handlers)

Create `data/fixtures/` and `app/api/*` with typed responses using `types/*`.

1. Fixtures
   - Do: `data/fixtures/{destinations.json, hotels.json, rooms.json, reviews.json, bookings.json, offers.json}`
   - AC: JSON validates against TS types via zod parse in route handlers

2. GET /api/search/destinations
   - Params: `q`, `geoloc=true|false`
   - AC: Fuzzy search by name, type (city/region/landmark), returns top 10; geoloc returns nearby mock

3. GET /api/search/hotels
   - Params: `destinationId`, `checkIn`, `checkOut`, `rooms`, `adults`, `children[]`, `sort`, `page`, `filters` (amenities, rating, price, deals, payment, cancellation, area)
   - AC: Returns paginated hotels with computed starting price and badges; supports sorting and filters

4. GET /api/hotels/[id]
   - AC: Returns hotel details including coordinates, policies, amenities, images

5. GET /api/hotels/[id]/rooms
   - AC: Returns room types with rate plans, inclusions, cancellation, price per night breakdown

6. GET /api/hotels/[id]/reviews
   - AC: Paginated reviews with category breakdown and traveler types

7. POST /api/booking/availability
   - Body: search params + selected room types
   - AC: Returns up-to-date price/availability (simulate changes with small probability)

8. POST /api/booking/hold
   - Body: selection summary
   - AC: Returns `holdId` with 15-min expiry; simulate limited inventory

9. POST /api/checkout
   - Body: guest details + card mock + billing
   - AC: Validate fields; simulate success/failure

10. POST /api/booking/confirm
    - Body: `holdId`
    - AC: Returns booking reference, total, policy, summary

11. GET /api/booking/[reference]
    - AC: Returns booking details for confirmation page

M2 — Search experience (components exist; wire to API)

1. Destination autocomplete
   - Do: Use `/api/search/destinations`; recent searches in localStorage; keyboard nav; aria combobox
   - AC: Debounced search, 10 results, arrow key + enter selection, SR-friendly

2. Date selection
   - Do: Desktop dual-month, mobile single; block past; quick presets
   - AC: Tonight/Tomorrow/Weekend presets; range highlighting; zod validation

3. Guest/room selector
   - Do: Up to 8 rooms; adult/children per room with age pickers
   - AC: Occupancy summary string; validation rules enforced

4. Submit search -> navigate to `/search` with query params
   - AC: SSR loads results with same criteria; params preserved on refresh

M3 — Search results page

1. SSR results + skeletons/streaming
   - Do: Server component fetches `/api/search/hotels`; show count, sorting, filters sidebar
   - AC: Loading states render within 200ms; first content visible early

2. Hotel cards refinement
   - Do: Image, name, stars, location, distance, review score, strikethrough/original, discount, urgency, amenities, cancellation highlight
   - AC: Matches PRD fields; keyboard accessible

3. Filters system
   - Do: Price slider + histogram, rating, property type, amenities, location area, deals, payment, cancellation
   - AC: Filter chips reflect active filters; back/forward keep state via URL

4. Sorting options
   - Do: Recommended (custom score), Price asc/desc, Star, Guest rating, Distance, Most reviewed
   - AC: Sorting stabilizes pagination; selection persists

5. Map integration (toggle list/map)
   - Do: Choose MapLibre + react-map-gl or maplibre-gl; pins with price; cluster; hover sync with list
   - AC: Map bounds filter optional toggle; keyboard/ARIA basics

M4 — Hotel detail page `/hotel/[id]`

1. Photo gallery + lightbox
   - Do: Hero with overlay; thumbnails; categories; fullscreen lightbox
   - AC: Keyboard left/right/esc; SSR friendly

2. Hotel information
   - Do: Description, policies, amenities with icons, nearby attractions, transport, location map
   - AC: All sections present; links anchorable

3. Room selection
   - Do: Room type cards, bed icons, occupancy, sqft/m2, amenities, rate inclusions, cancellation per rate, select qty
   - AC: Price per night breakdown; limited availability warnings

4. Reviews section
   - Do: Overall + category breakdown, filters (type, rating, language), verified badges, highlights
   - AC: Pagination; filter chips

M5 — Booking engine (multi-step)

1. Cart state model
   - Do: URL param + sessionStorage persistence; derived totals; promo code hook
   - AC: Modify qty, remove room, totals recalc; refresh-safe

2. Step: Room selection -> Summary
   - Do: Selected rooms summary panel; price with taxes/fees
   - AC: Matches detail page prices; discrepancy banner if change

3. Step: Guest details
   - Do: Full name, email, phone, additional guests, requests, arrival time, loyalty, newsletter opt-in
   - AC: Zod form schema; clear validation messages

4. Step: Payment simulation
   - Do: Card form UI (mock), billing address, save card checkbox, terms acceptance, price guarantee banner
   - AC: Disable continue until valid; `/api/checkout` mock used

5. Final review + place booking
   - Do: Review all details; confirm; call hold -> confirm
   - AC: On success navigate to confirmation with reference; on failure show retry/recover flows

6. Error handling/resilience
   - Do: Unavailable room recovery, price change notice, session timeout, network retry
   - AC: All simulated via API flags with user-friendly toasts/banners

M6 — Confirmation experience `/booking/[reference]`

1. Success details
   - Do: Booking reference, hotel/room/guest summary, total paid, policy, check-in instructions
   - AC: Deep link reload works; data pulled from `/api/booking/[reference]`

2. Post-booking actions
   - Do: Download PDF itinerary, email confirmation (UI only), add to calendar (ICS), share booking, similar hotels
   - AC: PDF generates client-side; ICS downloads; share uses Web Share or copy link fallback

M7 — SEO & Structured Data

1. Metadata + OG
   - Do: Per-route metadata; canonical URLs; open graph tags
   - AC: View-source shows correct tags

2. Structured data
   - Do: JSON-LD for Hotel, Offer, Review on results & detail; BreadcrumbList
   - AC: Rich results test passes locally

3. Sitemap & robots
   - Do: `app/sitemap.ts`, robots.txt; hotels dynamically included from fixtures
   - AC: Build emits sitemap; pages discoverable

M8 — Accessibility (WCAG 2.1 AA)

1. Keyboard navigation & focus management
   - Do: Focus rings, skip to content, roving tab index for carousels
   - AC: Axe + keyboard run finds zero critical issues

2. ARIA labels/roles for interactive components
   - Do: Combobox, dialogs, tabs, sliders, accordions using Radix semantics
   - AC: SR reads labels correctly

3. Color contrast
   - Do: Tailwind tokens meet contrast; dark mode
   - AC: Contrast >= 4.5:1 for text

M9 — Performance & CWV

1. Images & media
   - Do: next/image, responsive sizes, lazy loading, priority hero
   - AC: LCP < 2.5s on mid-tier device (lab); CLS < 0.05

2. Code splitting & streaming
   - Do: Dynamic imports for heavy components; RSC streaming on results/detail
   - AC: TTI < 3.5s; Lighthouse > 90

3. Caching
   - Do: Cache mock GETs; revalidate tags; memoize pure components
   - AC: Minimal network on navigations; smooth back/forward

M10 — Testing

1. Unit & component tests
   - Do: Core UI (cards, filters, selectors); utils in `lib/utils.ts`
   - AC: 80%+ statements on critical paths

2. Contract tests for API route handlers
   - Do: zod schemas + tests for each endpoint
   - AC: Invalid payloads rejected with 400

3. E2E flows (Playwright)
   - Do: Search -> Results -> Detail -> Booking -> Confirmation happy path; plus error scenarios
   - AC: CI green across Chromium desktop + mobile viewport

M11 — Analytics & instrumentation

1. Event tracking
   - Do: Use `@vercel/analytics` + custom event bus
   - AC: Events for search submit, filter use, add-to-cart, checkout steps, confirm

2. Error logging
   - Do: Global error boundary + console capture in dev
   - AC: Errors visible in dev overlay and logged

M12 — Documentation & demos

1. Developer docs
   - Do: `docs/DEV.md` with setup, scripts, env, testing, conventions
   - AC: New dev can onboard in <15 minutes

2. User walkthrough
   - Do: `docs/DEMO.md` with screenshots/GIFs for core flow
   - AC: PM can review features offline

---

Dependencies & sequencing (high-level)

- M0 -> M1 -> M2/M3 in parallel -> M4 -> M5 -> M6
- M7/M8/M9 run across sprints; M10 after feature slices stabilize

Proposed 3-sprint plan (2 weeks each)

- Sprint 1: M0, M1, M2, start M3
- Sprint 2: Finish M3, M4, start M5
- Sprint 3: Finish M5, M6, M7–M10 polish

Acceptance test checklist (happy path)

- Enter destination + dates + 2 adults -> results with 20+ hotels
- Filter price < $200, sort Price Low to High -> list updates & persists via URL
- Open a hotel -> view gallery, info, rooms with prices
- Select room -> booking steps -> enter details -> simulate payment -> get reference
- Refresh confirmation page -> booking persists via `/api/booking/[reference]`

Engineering notes

- Prefer `app/api/*/route.ts` with zod validation and typed responses
- Keep fixtures small but realistic; add price variability and scarcity flags
- Favor Server Components + Route Handlers for data; client components for interactivity
- Map: try MapLibre GL with public tiles; fall back to static map if needed
